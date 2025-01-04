// playAudio.test.js

const versesPerChapter = {
    1: 47,
    2: 72,
    3: 43,
    4: 42,
    5: 29,
    6: 47,
    7: 30,
    8: 28,
    9: 34,
    10: 42,
    11: 55,
    12: 20,
    13: 35,
    14: 27,
    15: 20,
    16: 24,
    17: 28,
    18: 78
};

const finalChunkBoundaries = {
    2: { start: 61, end: 72 },
    3: { start: 31, end: 43 },
    4: { start: 41, end: 42 },
    10: { start: 31, end: 42 },
    16: { start: 21, end: 24 },
};

function playAudio(verseData) {
    const chapter = verseData.chapter_number;
    const verse = verseData.verse_number;
    const totalVerses = versesPerChapter[chapter];

    let sectionStart, sectionEnd;

    // If a special rule applies AND the verse is in that final chunk
    if (
        finalChunkBoundaries[chapter] &&
        verse >= finalChunkBoundaries[chapter].start
    ) {
        sectionStart = finalChunkBoundaries[chapter].start;
        sectionEnd = finalChunkBoundaries[chapter].end;
    } else {
        // Normal chunking
        sectionStart = Math.floor((verse - 1) / 10) * 10 + 1;
        sectionEnd = sectionStart + 9;
        if (sectionEnd > totalVerses) {
            sectionEnd = totalVerses;
        }
    }

    const section = `${sectionStart}-${sectionEnd}`;
    return `https://chinmayagita.net/gitachanting/chapter${chapter}/${section}/`;
}

test('playAudio generates correct URL for chapter 2, verse 71', () => {
    const verseData = { chapter_number: 2, verse_number: 71 };
    const expectedUrl = 'https://chinmayagita.net/gitachanting/chapter2/61-72/';
    const audioUrl = playAudio(verseData);
    expect(audioUrl).toBe(expectedUrl);
});

test('playAudio generates correct URL for chapter 3, verse 43', () => {
    const verseData = { chapter_number: 3, verse_number: 43 };
    const expectedUrl = 'https://chinmayagita.net/gitachanting/chapter3/31-43/';
    const audioUrl = playAudio(verseData);
    expect(audioUrl).toBe(expectedUrl);
});

test('playAudio generates correct URL for chapter 10, verse 40', () => {
    const verseData = { chapter_number: 10, verse_number: 40 };
    const expectedUrl = 'https://chinmayagita.net/gitachanting/chapter10/31-42/';
    const audioUrl = playAudio(verseData);
    expect(audioUrl).toBe(expectedUrl);
});

test('playAudio generates correct URL for chapter 16, verse 24', () => {
    const verseData = { chapter_number: 16, verse_number: 24 };
    const expectedUrl = 'https://chinmayagita.net/gitachanting/chapter16/21-24/';
    const audioUrl = playAudio(verseData);
    expect(audioUrl).toBe(expectedUrl);
});

