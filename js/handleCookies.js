const savePreferencesToCookie = () => {
    const cookieName = "EA_preferences"
    const preferences = { 
        "sectionsText": document.getElementById("sections").value,
        "exchange" : document.getElementById("exchangeDropdown").value
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

// Function to retrieve the preferences from the cookie
const loadPreferences = (defaults) => {
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
    console.log("Default preferences used.");
    return defaults
  }
  return null;
}


const checkForChanges = () => {
    console.log("checkForChanges()")
    const button = document.querySelector('.styled-button');
    const dropdownValue = document.getElementById('exchangeDropdown').value;
    const textareaValue = document.getElementById('sections').value.trim();

    // Retrieve cookie if it exists
    const cookieName = "EA_preferences";
    const cookie = getCookie(cookieName);

    changeRadioLabelText("daily", `Daily_${formatDate(new Date())}_${dropdownValue}.txt`);
    changeRadioLabelText("weekly", `Weekly_${getSundayOfWeek()}_${dropdownValue}.txt`);
    changeRadioLabelText("monthly", `Monthly_${getFirstDayOfMonth()}_${dropdownValue}.txt`);
    changeRadioLabelText("combo", `Combo_${formatDate(new Date())}_${dropdownValue}.txt`);

    if (!cookie) {
        // No cookie exists, show the button
        button.style.display = 'block';
        return;
    }

    try {
        const preferences = JSON.parse(cookie);

        let sections = preferences.sectionsText.replace(/\n+$/, '')
        console.log("preferences.exchange")
        console.log(preferences.exchange)
        // Check if values match the cookie
        if (
            dropdownValue === preferences.exchange &&
            textareaValue.trim() === sections.trim()
        ) {
            // Values match the cookie, hide the button
            console.log("hide")
            button.style.display = 'none';
        } else {
            // Values don't match the cookie, show the button
            console.log("show")
            button.style.display = 'block';
        }
    } catch (error) {
        console.error("Failed to parse preferences from cookie:", error);
        // Show button if cookie parsing fails
        button.style.display = 'block';
    }
};
