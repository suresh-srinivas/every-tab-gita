import { marked } from './libs/marked.esm.js'

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
chrome.storage.sync.get(['chapter', 'theme', 'profession', 'age'], (data) => {
  console.log('Retrieved data:', data);
});


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



function teachTheVerse() {
    
}

// Function to handle footer icon clicks
function handleFooterClicks(verseData) {
    document.getElementById('original-verse').addEventListener('click', () => showOriginalVerse(verseData));
    document.getElementById('translation').addEventListener('click', () => showTranslations(verseData));
    document.getElementById('commentary').addEventListener('click', () => showCommentary(verseData));
    document.getElementById('youtube').addEventListener('click', () => openYouTube(verseData));
    document.getElementById('act-with-ai').addEventListener('click', () => actWithAI (verseData));
  //  document.getElementById('teach-verse').addEventListener('click', teachTheVerse);

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

async function setupAIModels() {
    chrome.aiOriginTrial.languageModel.capabilities()
    .then(capabilities => {
        if (capabilities.available === 'readily') {
            // Model is ready to use
            console.log('Model is ready!');
            // Proceed with creating a language model session
        } else if (capabilities.available === 'after-download') {
            // Model needs to be downloaded first
            console.log('Model needs to be downloaded.');
            // Create a language model session to trigger the download
            chrome.aiOriginTrial.languageModel.create()
                .then(session => {
                    // Handle the session or display a progress indicator
                    console.log('Model download initiated.');
                    // Optionally, you can listen for download progress events
                })
                .catch(error => {
                    console.error('Error creating session:', error);
                });
        } else {
            console.log('Model is not available.');
        }
    });

    const session = await chrome.aiOriginTrial.languageModel.create({
        initialPrompts: [
            { role: 'system', content: 'You are a friendly, helpful assistant specialized in Bhagavad Gita and creates an Action Plan of 3 actions based on the verse.' },
            // Verse 1
            { role: 'user', content: 'Provide a concise action plan based on Bhagavad Gita 6.16: "There is no possibility of becoming a yogi if one eats too much or eats too little, sleeps too much or does not sleep enough."' },
            { role: 'assistant', content: '## Action Plan: Balancing Body and Mind\n\nInspired by Bhagavad Gita 6.16, let\'s strive for balance in our daily lives:\n\n1. **Mindful Eating:** \n   * Listen to hunger and fullness cues. \n   * Eat a balanced diet. \n   * Avoid overeating or under-eating.\n\n2. **Quality Sleep:** \n   * Maintain a consistent sleep schedule. \n   * Create a calming bedtime routine. \n   * Ensure a serene sleep environment.\n\n3. **Daily Yoga Practice:** \n   * Incorporate yoga into your routine, even for a few minutes. \n   * Combine physical postures, breathing exercises, and meditation. \n   * Consider seeking guidance from a qualified yoga teacher.' },
            // Verse 2
            { role: 'user', content: 'Provide a concise action plan based on Bhagavad Gita 2.47: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty."' },
            { role: 'assistant', content: '## Action Plan: Embracing Duty-Consciousness and Detachment\n\nInspired by Bhagavad Gita 2.47, let\'s cultivate a sense of duty and detachment:\n\n1. **Perform Your Duty Selflessly:** \n   * Identify your dharma (duty) and fulfill it without personal motives. * Act with a sense of responsibility and commitment.\n\n2. **Detach from Outcomes:** \n   * Let go of expectations and attachments to the results of your actions. * Focus on doing your best without worrying about the rewards or punishments.\n\n3. **Cultivate a Balanced Mind:** \n   * Practice equanimity in both success and failure. * Accept both positive and negative experiences with a balanced mind.' },
            // Verse 3
            { role: 'user', content: 'Provide a concise action plan based on Bhagavad Gita 3.20: "Therefore, one should perform his prescribed duty, which is work done with the body, mind, and speech, without being attached to the fruits thereof."' },
            { role: 'assistant', content: '## Action Plan: Embracing Duty-Consciousness\n\nInspired by Bhagavad Gita 3.20, let\'s cultivate a sense of duty and detachment:\n\n1. **Perform Your Duty:** \n   * Identify your dharma (duty) and fulfill it with dedication. \n   * Be mindful of your actions, thoughts, and words.\n\n2. **Detach from Results:** \n   * Let go of expectations and attachments to outcomes. \n   * Focus on doing your best without worrying about the results.\n\n3. **Cultivate Equanimity:** \n   * Practice equanimity in both success and failure. \n   * Accept both positive and negative experiences with a balanced mind.' }
        ]
    });
      /*
      const result1 = await session.prompt(
        'He who realizes the divine truth concerning My birth and life does not take birth again; and when he leaves his body, he becomes one with Me. Bhagavad Gita, Chapter 4, Verse 9'
      );
      console.log(result1);
      
      const result2 = await session.prompt(
        'Verily, those who love the spiritual wisdom as I have taught, whose faith never wavers, and who focus their entire being on Me, they are indeed My most beloved. Bhagavad Gita, Chapter 12, Verse 20'
      );
      console.log(result2);
      */

      return session;
}

chrome.tabs.onCreated.addListener(() => {
  chrome.sidePanel.open().then(() => {
    console.log('Side panel opened successfully');
  }).catch((err) => {
    console.error('Error opening side panel:', err);
  });
});


chrome.storage.sync.get(['chapter', 'theme', 'profession', 'age'], (data) => {
  const chapter = data.chapter || '1';
  const theme = data.theme || 'light';
  const profession = data.profession || 'User';
  const age = data.age || 'Unknown';

  console.log(`User selected Chapter ${chapter}, Theme: ${theme}, Profession: ${profession}, Age: ${age}`);


  // Apply theme
  if (theme === 'dark') {
    document.body.style.backgroundColor = '#121212';
    document.body.style.color = '#ffffff';
  } else {
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#000000';
  }
});

fetchRandomVerse();
fetchRandomImage();



function formatResponse(response) {
    const html = marked(response);
    return html;
}
  // Function to go to the Action with AI in new tab
async function actWithAI(verseData) {
    console.log(verseData);
    const translation = verseData.translations[0].description; // English translation

    const session = await setupAIModels();
    const result1 = await session.prompt(translation);
    console.log(result1);
  
    const formattedHTML = formatResponse(result1);

    const newTab = window.open();
    newTab.document.body.innerHTML = `
        <h1 style="font-size: 28px; margin-bottom: 20px;">Action Plan</h1>
        ${formattedHTML}
    `;
    newTab.document.title = "Action Plan based on Bhagavad Gita";
    newTab.document.body.style.fontFamily = "Arial, sans-serif";
    newTab.document.body.style.padding = "20px";
}



