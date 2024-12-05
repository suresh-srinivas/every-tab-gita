document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const chapterSelect = document.getElementById('chapter');
  const themeSelect = document.getElementById('theme');
  const professionInput = document.getElementById('profession');
  const ageInput = document.getElementById('age');
  const saveButton = document.getElementById('save-settings');

  // Load saved settings
  chrome.storage.sync.get(['chapter', 'theme', 'profession', 'age'], (data) => {
    if (data.chapter) chapterSelect.value = data.chapter;
    if (data.theme) themeSelect.value = data.theme;
    if (data.profession) professionInput.value = data.profession;
    if (data.age) ageInput.value = data.age;
  });

  // Save settings
  saveButton.addEventListener('click', () => {
    const chapter = chapterSelect.value;
    const theme = themeSelect.value;
    const profession = professionInput.value;
    const age = ageInput.value;

    if (!profession || !age) {
      alert('Please fill in all fields!');
      return;
    }

    chrome.storage.sync.set({ chapter, theme, profession, age }, () => {
      alert('Settings saved successfully!');
      console.log('Saved settings:', { chapter, theme, profession, age });
    });
  });
});


