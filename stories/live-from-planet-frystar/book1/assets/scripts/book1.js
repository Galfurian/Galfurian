// Define metadata for Arcane Fang
const CHAPTER_TOTAL = 13;

document.addEventListener('keydown', function (event) {
    if (event.key === "ArrowRight") {
        // Navigate forward to the next chapter.
        NavigateChapter(+1, CHAPTER_TOTAL);
    } else if (event.key === "ArrowLeft") {
        // Navigate backward to the previous chapter.
        NavigateChapter(-1, CHAPTER_TOTAL);
    }
});