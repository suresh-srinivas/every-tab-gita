// Unsplash API settings
const UNSPLASH_ACCESS_KEY = 'EDc0OHPxWQp34NIILueQ1UVs9LbWWLct5pFh5dsfmpI'
const UNSPLASH_URL = `https://api.unsplash.com/photos/random?query=nature&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`;

// Number of verses in each chapter of the Bhagavad Gita
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

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to get a random chapter and verse number
function getRandomChapterAndVerse() {
    const chapter = getRandomInt(1, 18); // There are 18 chapters
    const verse = getRandomInt(1, versesPerChapter[chapter]); // Random verse based on the chapter
    return { chapter, verse };
}

// Function to fetch a random nature image from Unsplash
async function fetchRandomImage() {
    try {
        const response = await fetch(UNSPLASH_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch image from Unsplash.');
        }
        const data = await response.json();
        const imageUrl = data.urls.regular;
        const imageDescription = data.description || data.alt_description || 'A serene nature image';
        const photographerName = data.user.name || 'Unknown';
        const photographerLink = data.links.html || '#';
        const locationName = data.location && data.location.name ? data.location.name : 'Unknown location';

        document.querySelector('.quote-image').src = imageUrl;
        document.querySelector('.quote-image').alt = imageDescription;

        // Create credit element
        const creditElement = document.createElement('p');
        creditElement.className = 'text-sm text-gray-500 mt-2';
        creditElement.innerHTML = `${imageDescription} by <a href="${photographerLink}" target="_blank" class="text-blue-500">${photographerName}</a> on Unsplash, taken at ${locationName}.`;

        document.querySelector('.quote-container').appendChild(creditElement);

    } catch (error) {
        console.error('Error fetching image:', error);
    }
}

// Function to display the original verse, transliteration, and word meaning in a new tab with larger fonts
function showOriginalVerse(verseData) {
    const originalContent = `
        <h1 style="font-size: 24px; margin-bottom: 20px;">Original Sanskrit</h1>
        <p style="font-size: 28px; line-height: 1.5; font-weight: bold;">${verseData.text}</p>
        <h1 style="font-size: 24px; margin-top: 40px; margin-bottom: 20px;">Transliteration</h1>
        <p style="font-size: 24px; line-height: 1.5;">${verseData.transliteration}</p>
        <h1 style="font-size: 24px; margin-top: 40px; margin-bottom: 20px;">Word Meaning</h1>
        <p style="font-size: 22px; line-height: 1.5;">${verseData.word_meanings}</p>
    `;

    const newTab = window.open();
    newTab.document.body.innerHTML = originalContent;
    newTab.document.title = "Original Verse - Bhagavad Gita";
    newTab.document.body.style.fontFamily = "Arial, sans-serif";
    newTab.document.body.style.padding = "20px";
}

// Function to show translations in a new tab with larger fonts
function showTranslations(verseData) {
    let translations = verseData.translations.map(translation => `
        <h2 style="font-size: 24px; margin-bottom: 10px;">${translation.author_name}</h2>
        <p style="font-size: 22px; line-height: 1.5;">${translation.description}</p>
    `).join('<hr style="margin: 20px 0;">');

    const newTab = window.open();
    newTab.document.body.innerHTML = `
        <h1 style="font-size: 28px; margin-bottom: 20px;">Translations</h1>
        ${translations}
    `;
    newTab.document.title = "Translations - Bhagavad Gita";
    newTab.document.body.style.fontFamily = "Arial, sans-serif";
    newTab.document.body.style.padding = "20px";
}

// Function to show commentaries in a new tab with larger fonts
function showCommentary(verseData) {
    let commentaries = verseData.commentaries.map(commentary => `
        <h2 style="font-size: 24px; margin-bottom: 10px;">${commentary.author_name}</h2>
        <p style="font-size: 22px; line-height: 1.5;">${commentary.description}</p>
    `).join('<hr style="margin: 20px 0;">');

    const newTab = window.open();
    newTab.document.body.innerHTML = `
        <h1 style="font-size: 28px; margin-bottom: 20px;">Commentaries</h1>
        ${commentaries}
    `;
    newTab.document.title = "Commentaries - Bhagavad Gita";
    newTab.document.body.style.fontFamily = "Arial, sans-serif";
    newTab.document.body.style.padding = "20px";
}


// Function to open a YouTube search link in a new tab
function openYouTube(verseData) {
    const youtubeLink = `https://www.youtube.com/results?search_query=Bhagavad+Gita+Chapter+${verseData.chapter_number}+Verse+${verseData.verse_number}`;
    window.open(youtubeLink, '_blank');
}

// Function to go to the learning site in a new tab
function learnTheVerse() {
    const learnLink = 'https://www.sgsgitafoundation.org/tutor.html';
    window.open(learnLink, '_blank');
}

// Function to handle footer icon clicks
function handleFooterClicks(verseData) {
    document.getElementById('original-verse').addEventListener('click', () => showOriginalVerse(verseData));
    document.getElementById('translation').addEventListener('click', () => showTranslations(verseData));
    document.getElementById('commentary').addEventListener('click', () => showCommentary(verseData));
    document.getElementById('youtube').addEventListener('click', () => openYouTube(verseData));
    document.getElementById('learn-verse').addEventListener('click', learnTheVerse);
}

// Function to display the verse and its translation in the HTML
function displayQuote(verseText, translation, chapter, verse) {
    const quoteElement = document.getElementById('quote-text');
    const referenceElement = document.getElementById('quote-reference');

    quoteElement.textContent = translation;
    referenceElement.textContent = `Bhagavad Gita, Chapter ${chapter}, Verse ${verse}`;
}


// Fetch and display a random verse from the Bhagavad Gita
async function fetchRandomVerse() {
    const { chapter, verse } = getRandomChapterAndVerse();

    try {
        const response = await fetch(`https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapter}/verses/${verse}/`, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'bhagavad-gita3.p.rapidapi.com',
                'x-rapidapi-key': '81a58ef15amsh9a25e96ce88b0b1p1c7b24jsn39659ccd82d3' // Your provided API key
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const verseData = await response.json();
        const verseText = verseData.text; // Original verse in Sanskrit
        const translation = verseData.translations[0].description; // English translation

        displayQuote(verseText, translation, chapter, verse);
        handleFooterClicks(verseData);

    } catch (error) {
        console.error('Fetching the verse failed:', error);
        displayQuote("Unable to fetch verse. Please check your connection or try again later.", "", "", "");
    }
}

// Fetch and display a random verse and image when the script is loaded
fetchRandomVerse();
fetchRandomImage();

