# Gita in Every Tab

**Gita in Every Tab** is a Chrome extension that displays a verse from the Bhagavad Gita each time you open a new tab, providing spiritual insight and reflection throughout your browsing experience.

## Features

- **Random Verse Display:** Each new tab presents a randomly selected verse from the Bhagavad Gita.
- **Simple Interface:** Clean and minimalistic design to keep the focus on the verse.
- **Lightweight:** Does not impact browser performance.

## Installation

1. **Clone the Repository:**
   ```sh
   git clone https://github.com/suresh-srinivas/every-tab-gita.git
   ```
2. **Open Chrome Extensions Page:**
   - Navigate to `chrome://extensions/` in your Chrome browser.
3. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch on the top right corner.
4. **Load Unpacked Extension:**
   - Click on "Load unpacked" and select the cloned `every-tab-gita` directory.

The extension should now be active, and you'll see a new verse each time you open a new tab.

## Usage

- **View Verses:** Simply open a new tab to see a verse from the Bhagavad Gita.
- **Refresh Verse:** Reload the new tab page to display a different verse.

## Action with AI

Action with AI uses the built-in AI model known as Gemini Nano that runs inside Chrome browser. 

1. **Prerequisite**
   - Use latest version of Google Chrome (127+) browser. Open `chrome://version`, to verify.
2. **Setup the built-in AI (Gemini Nano) model**
   - Enable Prompt API**: Open `chrome://flags/#prompt-api-for-gemini-nano`, set it to "Enabled".
   - Enable Optimization Guide**: Open `chrome://flags/#optimization-guide-on-device-model`, set it to "Enabled BypassPerfRequirement". Restart the browser.
3. **Login to Google**: Make sure you are logged in to Chrome. For now, Incognito and Guest mode are not supported.
4. **Download Model**: Go to `chrome://components/`, find "Optimization Guide On Device Model", ensure it’s fully downloaded. If the version is "0.0.0.0", click "Check for update".
5. **Troubleshoot**: If the "Optimization Guide On Device Model" is not displayed, disable the settings in step 2 above, restart your browser and re-enable it.
6. **Verify Setup**: Open a webpage, open developer tools and check `window.ai` in the console.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Verses sourced from the Bhagavad Gita.
- Developed by [Suresh Srinivas](https://github.com/suresh-srinivas).


