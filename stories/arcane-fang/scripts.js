
/// Load the saved theme from localStorage on page load.
document.addEventListener("DOMContentLoaded", () => {
    // Find the main.
    const main = document.querySelector('main');
    // Find the story.
    const story = document.getElementById('story');
    // Find the word-count.
    const word_count = document.getElementById('word-count');
    // Get the saved theme.
    const saved_theme = localStorage.getItem('theme');
    // Get the font size.
    const font_size = localStorage.getItem('font-size');
    // Load theme preference.
    if (saved_theme) {
        document.documentElement.setAttribute('data-theme', saved_theme);
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    // Load font size preference.
    if (font_size) {
        main.style.fontSize = font_size;
    } else {
        main.style.fontSize = "18px";
    }
    // Format the story.
    if (story) {
        story.innerHTML = MarkdownToHTML(story.textContent);
    }
    // Count the words.
    if (story && word_count) {
        word_count.innerText = 'Words: ' + CountWords(story.textContent);
    }

    // ====== Chapter Navigation ======
    if (typeof CHAPTER_TOTAL === "undefined") return;
    const nav = document.getElementById("chapter-nav");
    const match = window.location.pathname.match(/chapter(\d+)\.html/);
    if (!match) return;
    const current = parseInt(match[1], 10);
    let html = "[";
    if (current > 1) {
        html += `<a href="chapter${current - 1}.html">&larr; Previous</a>`;
    } else{
        html += `<a href="#" class="disabled-link">&larr; Previous</a>`;
    }
    html += ` | `;
    if (current < CHAPTER_TOTAL) {
        html += `<a href="chapter${current + 1}.html">Next &rarr;</a>`;
    } else {
        html += `<a href="#" class="disabled-link">Next &rarr;</a>`;
    }
    html += `] `;
    html += `<a href="../index.html"><b>Index</b></a>`;
    nav.innerHTML = html;
});

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('show');
}

document.addEventListener("DOMContentLoaded", function () {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.querySelectorAll("button, a").forEach(el => {
        el.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                mobileMenu.classList.remove("show");
            }
        });
    });
});

/// Change the font size of the main content.
function ChangeFontSize(change) {
    // Get the main content element.
    const main = document.querySelector('main');
    // Get the current font size as a number.
    const currentSize = parseFloat(window.getComputedStyle(main).fontSize);
    // Calculate the new font size based on the change.
    let newSize;
    if (change === 0) {
        newSize = "18px"; // Default font size
    } else {
        newSize = (currentSize + change) + "px";
    }
    // Update the font size of the main content.
    main.style.fontSize = newSize;
    // Save the new font size preference.
    localStorage.setItem('font-size', newSize);
}

/// Toggle between light and dark themes.
function ToggleTheme() {
    // Get the current theme from the HTML element.
    const currentTheme = document.documentElement.getAttribute('data-theme');
    // Toggle the theme based on the current setting.
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    // Update the HTML element with the new theme.
    document.documentElement.setAttribute('data-theme', newTheme);
    // Save the preference for persistence.
    localStorage.setItem('theme', newTheme);
}

/// Helper function to escape HTML entities inside code blocks.
function EscapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// Function to count words
function CountWords(text, displayId) {
    var wordArray = text.trim().split(/\s+/); // Split by spaces and any whitespace characters
    var wordCount = wordArray.length;

    // If the text is empty (no visible words), reset the count to 0
    if (text.trim() === '') {
        wordCount = 0;
    }

    return wordCount;
}

/// Function to convert Markdown-like text to HTML.
/// @param {string} rawText - The raw input text in Markdown format.
function MarkdownToHTML(rawText) {
    return rawText
        // Horizontal Rule: Convert ---, ***, or ___ to <hr>
        .replace(/^\s*(---|\*\*\*|___)\s*$/gm, '<hr>')
        // Headings: Match #, ##, ### and convert to <h1>, <h2>, <h3>, etc.
        .replace(/^\s*(#{1,6})\s(.+)/gm, (_, hashes, text) => {
            // Determine heading level based on the length of hashes.
            const level = hashes.length;
            // Generate the HTML heading.
            return `<h${level}>${text.trim()}</h${level}>`;
        })
        // Code Block: Match ```code``` and convert to <pre><code>
        .replace(/```([\s\S]*?)```/g, (_, code) => {
            return `<pre><code>${EscapeHTML(code)}</code></pre>`;
        })
        // Unordered Lists: Match - or * at the start of a line and wrap in <ul> and <li>
        .replace(/^(\s*[-*]\s.+)/gm, match => {
            const items = match.split('\n').map(line => `<li>${line.slice(2)}</li>`).join('');
            return `<ul>${items}</ul>`;
        })
        // Double Quotes: Convert "text" to <em>text</em>
        .replace(/"([^"]+)"/g, '<em><b>"$1"</b></em>')
        // Bold: Match **bold** or __bold__ and convert to <strong>
        .replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>')
        // Italics: Match *italic* or _italic_ and convert to <em>
        .replace(/(\*|_)(.*?)\1/g, '<em>$2</em>')
        // Inline Code: Match `code` and convert to <code>
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Images: Match ![alt text](image URL) and convert to <img src="image URL" alt="alt text">
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
        // Links: Match [text](url) and convert to <a href="url">text</a>
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        // Blockquotes: Lines starting with > and convert to <blockquote>
        .replace(/^>\s(.+)/gm, '<blockquote>$1</blockquote>')
        // Unordered Lists: Match - or * at the start of a line and wrap in <ul> and <li>
        .replace(/^(\s*[-*]\s.+)/gm, match => {
            const items = match.split('\n').map(line => `<li>${line.slice(2)}</li>`).join('');
            return `<ul>${items}</ul>`;
        })
        // Paragraphs: Split text by double newlines and wrap in <p>
        .split(/\n\s*\n/)
        .map(paragraph => `<p>${paragraph}</p>`)
        .join('');
}

function NavigateChapter(direction, max_page) {
    // Get the current page name from the URL
    const currentPage = window.location.pathname.split("/").pop();
    // Only proceed if we're on a valid page (either index or chapter)
    if (currentPage.startsWith("chapter")) {
        // Extract chapter number if it's a chapter page
        const currentChapterNumber = currentPage.match(/\d+/);
        if (currentChapterNumber) {
            let currentChapter = parseInt(currentChapterNumber[0]);
            // Adjust the chapter number based on direction (forward or backward)
            let nextChapter = currentChapter + direction;
            // Prevent navigation beyond chapter 9 or below chapter 1
            if ((nextChapter >= 1) && (nextChapter <= max_page)) {
                window.location.href = `chapter${nextChapter}.html`;
            }
        }
    }
}
