document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const chapterSelect = document.getElementById('chapter');
  const themeSelect = document.getElementById('theme');
  const professionInput = document.getElementById('profession');
  const ageInput = document.getElementById('age');
  const temperatureInput = document.getElementById('temperature');
  const topKInput = document.getElementById('top-k');
  const saveButton = document.getElementById('save-settings');

  // Load saved settings
  chrome.storage.sync.get(['chapter', 'theme', 'profession', 'age', 'temperature', 'topK'], (data) => {
    chapterSelect.value = data.chapter || 'Any'; // Default Any Chapter
    themeSelect.value = data.theme || 'light'; // Default Light theme
    professionInput.value = data.profession || '';
    ageInput.value = data.age || '';
    temperatureInput.value = data.temperature || '';
    topKInput.value = data.topK || '';
  });

  // Save settings
  saveButton.addEventListener('click', () => {
    const settings = {
      chapter: chapterSelect.value,
      theme: themeSelect.value,
      profession: professionInput.value,
      age: ageInput.value,
      temperature: parseFloat(temperatureInput.value) || 0.0,
      topK: parseInt(topKInput.value, 10) || 0,
    };

    chrome.storage.sync.set(settings, () => {
      alert('Settings saved successfully!');
    });
  });
});


