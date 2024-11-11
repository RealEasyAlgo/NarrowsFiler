const savePreferencesToCookie = () => {
    const cookieName = "EA_preferences"
    const preferences = { 
        "sectionsText": document.getElementById("sections").value,
        "exchange" : document.getElementById("dropdown").value
    }
    const jsonPreferences = JSON.stringify(preferences);
    setCookie(cookieName, jsonPreferences, 7); // Cookie lasts 7 days
    alert(`Preferences saved to cookie : ${cookieName}:\n  1) Exchange : ${preferences["exchange"]}\n  2) Sections...\n${preferences["sectionsText"]}`);
}

// Function to set a cookie
const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
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

// Function to save preferences as a cookie after user confirmation
const savePreferences = (preferences) => {
  // Create the object

  // Show dialog to user
  const userConsent = confirm(
    `We'd like to save your preferences:\nExchange: ${preferences.exchange}\nSections Text: ${preferences.sectionsText}\nDo you allow us to save this information as a cookie?`
  );

  // If user consents, save the cookie
  if (userConsent) {
    const jsonPreferences = JSON.stringify(preferences);
    setCookie("EA_preferences", jsonPreferences, 7); // Cookie lasts 7 days
    alert("Preferences saved as a cookie.");
  } else {
    alert("Preferences were not saved.");
  }
}

// Function to retrieve the preferences from the cookie
const loadPreferences = () => {
  const jsonPreferences = getCookie("EA_preferences");
  if (jsonPreferences) {
    try {
      const preferences = JSON.parse(jsonPreferences);
      console.log("Retrieved Preferences:", preferences);
      return preferences;
    } catch (error) {
      console.error("Failed to parse preferences JSON:", error);
    }
  } else {
    console.log("No preferences found in cookies.");
  }
  return null;
}
