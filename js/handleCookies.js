const defaultFilePath = 'defaultPreferences.json'; // Path to the JSON file
const loadWatchlistDefaultPreferences = async () => {
    try {
        // Fetch the default preferences
        const response = await fetch(defaultFilePath);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        defaultPreferences = await response.json();
        console.log('Default preferences loaded:', defaultPreferences);
        return defaultPreferences.sectionsText
    } catch (error) {
        console.error('Failed to load default preferences:', error);
    }
}

const loadWatchlistPreferences = async () => {
    return await loadWatchlistDefaultPreferences()
}

// Function to get a cookie by name
const getCookie = (name) => {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
}

const saveCookies = (name, content) => {
    try {
        document.cookie = `${name}=${content};path=/;max-age=${60*60*24*365}`;
        // console.log(`Saved preferences :: ${name}=${content}`);
        return content;
    } catch (error) {
      return false;
    }

    // alert('Preferences saved!');
}

