
/// Load the saved theme from localStorage on page load.
window.onload = function () {
    // Find the main.
    const main = document.querySelector('main');
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
};

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
