document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const chapterSelect = document.getElementById('chapter');
  const themeSelect = document.getElementById('theme');
  const professionInput = document.getElementById('profession'); 
  const ageInput = document.getElementById('age');
  const temperatureInput = document.getElementById('temperature');
  const topKInput = document.getElementById('top-k');
  const saveButton = document.getElementById('save-settings');
  const verseCategory = document.getElementById('verse-category');
  const ogpLogo = document.getElementById('ogp-logo');
  const verseOrderSelect = document.getElementById('verse-order');

  // Load saved settings
  chrome.storage.sync.get(['chapter', 'verseCategory', 'theme', 'profession', 'age', 'temperature', 'topK', 'verseOrder'], (data) => {
    chapterSelect.value = data.chapter || 'Any'; // Default Any Chapter
    verseCategory.value = data.verseCategory || 'ALL'; // Default ALL
    themeSelect.value = data.theme || 'light'; // Default Light theme
    professionInput.value = data.profession || ''; 
    ageInput.value = data.age || '';
    temperatureInput.value = data.temperature || '';
    topKInput.value = data.topK || '';
    verseOrderSelect.value = data.verseOrder || 'random';
  });

  // Save settings
  saveButton.addEventListener('click', () => {
    const settings = {
      chapter: chapterSelect.value,
      verseCategory: verseCategory.value,
      theme: themeSelect.value,
      profession: professionInput.value,
      age: ageInput.value,
      temperature: parseFloat(temperatureInput.value) || 0.0,
      topK: parseInt(topKInput.value, 10) || 0,
      verseOrder: verseOrderSelect.value,
    };    
          
    chrome.storage.sync.set(settings, () => {
      alert('Settings saved successfully!');
    });
  });

  // Function to check if a category is an OGP category
  function isOGPCategory(category) {
    return category.startsWith('OGP 2.0');
  }

  // Handle category change
  verseCategory.addEventListener('change', function() {
    const selectedCategory = this.value;
    
    // Show/hide OGP logo based on selection
    if (isOGPCategory(selectedCategory)) {
      ogpLogo.classList.add('active');
    } else {
      ogpLogo.classList.remove('active');
    }
  });

  // Initial check for OGP category
  if (isOGPCategory(verseCategory.value)) {
    ogpLogo.classList.add('active');
  }
});
