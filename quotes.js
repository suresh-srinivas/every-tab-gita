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

// --- new: sequential helper ---
async function getSequentialChapterAndVerse() {
  const { lastChapter = 1, lastVerse = 0 } = await chrome.storage.local.get([
    'lastChapter',
    'lastVerse',
  ]);

  let chapter = lastChapter;
  let verse   = lastVerse + 1;

  // roll over at end of chapter
  if (verse > versesPerChapter[chapter]) {
    verse   = 1;
    chapter = chapter === 18 ? 1 : chapter + 1;
  }

  await chrome.storage.local.set({ lastChapter: chapter, lastVerse: verse });
  return { chapter, verse };
}

// --- new: unified selector ---
async function getChapterAndVerse() {
  const { verseOrder = 'random' } = await chrome.storage.sync.get(['verseOrder']);
  return verseOrder === 'sequential'
    ? await getSequentialChapterAndVerse()
    : getRandomChapterAndVerse();
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



function teachTheVerse() {
    
}


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
  const audioUrl = `https://chinmayagita.net/gitachanting/chapter${chapter}/${section}/`;

  window.open(audioUrl, '_blank');
}

// Function to handle footer icon clicks
function handleFooterClicks(verseData) {
    document.getElementById('original-verse').addEventListener('click', () => showOriginalVerse(verseData));
    document.getElementById('translation').addEventListener('click', () => showTranslations(verseData));
    document.getElementById('commentary').addEventListener('click', () => showCommentary(verseData));
//    document.getElementById('youtube').addEventListener('click', () => openYouTube(verseData));
    document.getElementById('audio').addEventListener('click', () => playAudio(verseData));
    document.getElementById('act-with-ai').addEventListener('click', () => actWithAI (verseData));
    // Add this code to handle the Audio icon click in the handleFooterClicks function
 
}

// Function to display the verse and its translation in the HTML
function displayQuote(verseText, translation, chapter, verse) {
    const quoteElement = document.getElementById('quote-text');
    const referenceElement = document.getElementById('quote-reference');

    quoteElement.textContent = translation;
    referenceElement.textContent = `Bhagavad Gita, Chapter ${chapter}, Verse ${verse}`;
}

// Function to update the display with the category, sub-category, and session number
function displayCategory(category, subCategory, sessionNumber, totalSessions) {
    const categoryElement = document.getElementById('quote-category');
    categoryElement.textContent = `Category: ${category}, Sub-Category: ${subCategory}, Session: ${sessionNumber} of ${totalSessions}`;
}

// Function to fetch user settings
function getUserSettings() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['chapter', 'verseCategory', 'theme', 'profession', 'age', 'temperature', 'topK'], (data) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        const userSettings = {
          chapter: data.chapter || 'Any', // Default to Any Chapter
          verseCategory: data.verseCategory || 'All', // Default to All
          theme: data.theme || 'light', // Default Light theme
          profession: data.profession || 'Engineer',
          age: data.age || 'Unknown',
          temperature: parseFloat(data.temperature) || 0.7, // Default temperature
          topK: parseInt(data.topK, 10) || 50, // Default top-k
        };
        resolve(userSettings);
      }
    });
  });
}


// Fetch a random verse from a specified category in the JSON file
async function fetchRandomVerseFromCategory(category) {
  try {
    // Load the JSON file containing verses
    const response = await fetch('verse-category.json');
    if (!response.ok) {
      throw new Error('Failed to fetch verses data');
    }

    const data = await response.json();

    // Ensure the category exists
    if (!data[category] || data[category].length === 0) {
      console.error(`No verses found for category: ${category}`);
      return;
    }

    // Get all verses for the category
    const verses = data[category];

    // Get unique sub-categories to determine total sessions
    const uniqueSubCategories = [...new Set(verses.map(v => v.sub_category))];
    
    // Pick a random verse from the category
    const randomIndex = Math.floor(Math.random() * verses.length);
    const randomVerse = verses[randomIndex];

    const { chapter, verse, sub_category } = randomVerse;

    // Find the session number based on sub-category position
    const sessionNumber = uniqueSubCategories.indexOf(sub_category) + 1;

    console.log(`Random Verse Selected: Chapter ${chapter}, Verse ${verse} (${sub_category}), Session ${sessionNumber} of ${uniqueSubCategories.length}`);

    // Return the chapter, verse, sub_category, and correct session number
    return { 
      chapter, 
      verse, 
      sub_category, 
      sessionNumber,
      totalSessions: uniqueSubCategories.length 
    };

  } catch (error) {
    console.error('Error fetching random verse:', error);
    return null;
  }
}

// Function to load the JSON and get a random verse
async function getRandomVerseFromJSON() {
    try {
        // Load the JSON file
        const response = await fetch('swami-bodhananda.json'); // Replace with the actual path to your JSON file
        if (!response.ok) {
            throw new Error('Failed to fetch JSON data');
        }

        const data = await response.json();

        // Pick a random sub-category
        const categories = data['Swami Bodhananda Daily Contemplation'];
        const randomCategoryIndex = Math.floor(Math.random() * categories.length);
        const selectedCategory = categories[randomCategoryIndex];

        // Pick a random verse from the selected sub-category
        const randomVerseIndex = Math.floor(Math.random() * selectedCategory.verses.length);
        const randomVerse = selectedCategory.verses[randomVerseIndex];

        const { chapter, verse } = randomVerse;
        const sub_category = selectedCategory.sub_category;

        console.log(`Random Verse Selected: Chapter ${chapter}, Verse ${verse} (${sub_category})`);

        // Return the chapter, verse, and subcategory
        return { chapter, verse, sub_category };

    } catch (error) {
        console.error('Error fetching random verse:', error);
        return null;
    }
}


// Function to fetch a random verse based on user settings
async function fetchRandomVerse() {
  try {
    // Await user settings
    const userSettings = await getUserSettings();
    let { chapter, verseCategory, theme, profession, age, temperature, topK } = userSettings;
    let verse, sub_category, sessionNumber, totalSessions;

   if (verseCategory != 'All') {
     if (verseCategory == 'Swami Bodhananda Daily Contemplation') {
      const result = await getRandomVerseFromJSON();
      if (result) {
        ({ chapter, verse, sub_category } = result);
      } else {
        console.error('Failed to fetch verse for Swami Bodhananda Daily Contemplation');
      }
     }
     else {
       const result = await fetchRandomVerseFromCategory(verseCategory);
       if (result) {
         ({ chapter, verse, sub_category, sessionNumber, totalSessions } = result);
       } else {
          console.error('Failed to fetch verse for ' + verseCategory + 'Category');
       }
     }
   }
   else { // verseCategory == All
    // Decide between sequential and the original random logic
    const { verseOrder = 'random' } = await chrome.storage.sync.get(['verseOrder']);

    if (verseOrder === 'sequential') {
      const sel = await getSequentialChapterAndVerse();
      chapter = sel.chapter;
      verse   = sel.verse;
    } else if (chapter === 'Any') {
      const rnd = getRandomChapterAndVerse();
      chapter = rnd.chapter;
      verse   = rnd.verse;
    } else {
      // Specific chapter chosen → pick a random verse within that chapter
      verse = getRandomInt(1, versesPerChapter[chapter]);
    }
  }
    const verseOrder = await chrome.storage.sync.get(['verseOrder']);
    console.log(`Fetching verse for Chapter: ${chapter}, Verse: ${verse}, verseOrder: ${verseOrder}, Temperature: ${temperature}, Top-k: ${topK}`);

    // API call to fetch the verse
    const response = await fetch(`https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapter}/verses/${verse}/`, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'bhagavad-gita3.p.rapidapi.com',
            'x-rapidapi-key': '81a58ef15amsh9a25e96ce88b0b1p1c7b24jsn39659ccd82d3'
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const verseData = await response.json();
    const verseText = verseData.text;
    const translation = verseData.translations[0].description;

    if (verseCategory != 'All')
      displayCategory(verseCategory, sub_category, sessionNumber, totalSessions);

    // Display the fetched verse
    displayQuote(verseText, translation, chapter, verse);
    handleFooterClicks(verseData);

  } catch (error) {
    console.error('Error fetching random verse:', error);
    displayQuote("Unable to fetch verse. Please check your connection or try again later.", "", "", "");
  }
}


async function setupAIModels() {
    ai.languageModel.capabilities()
    .then(capabilities => {
        if (capabilities.available === 'readily') {
            // Model is ready to use
            console.log('Model is ready!');
            // Proceed with creating a language model session
        } else if (capabilities.available === 'after-download') {
            // Model needs to be downloaded first
            console.log('Model needs to be downloaded.');
            // Create a language model session to trigger the download
            ai.languageModel.create()
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

    const session = await ai.languageModel.create({
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



