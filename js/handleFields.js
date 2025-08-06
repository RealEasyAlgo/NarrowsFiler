// const replaceTextareaContent = (newContent) => {
//   const textarea = document.getElementById("sections");
//   textarea.value = newContent;
// }

// const selectDropdownItem = (value) => {
//   // console.log("selectDropdownItem(value)")
//   // console.dir(value)
//   const exchange = document.getElementById("exchangeDropdown");
//   // console.dir(exchange)
//   exchange.value = value;
// }
function toggleDownloadContainer(visible) {
    const downloadContainer = document.getElementById('download-container');
    if (visible) {
        downloadContainer.classList.remove('hidden');
    } else {
        downloadContainer.classList.add('hidden');
    }
}


function toggleFileContainer(visible) {
    const fileContainer = document.getElementById('file-container');
    if (visible) {
        fileContainer.classList.remove('hidden');
        toggleDownloadContainer(false)
    } else {
        fileContainer.classList.add('hidden');
    }
}

const getRadioLabel = (value) => {
    // Find the input element by its value
    let radioInput = document.querySelector(`input[type="radio"][name="option"][value="${value}"]`);
    if (radioInput) {
        return { "obj": radioInput, "lbl": radioInput.closest('label')}
    }
    return null;
}

const changeRadioLabelText = (value, newText) => {
    const { obj, lbl } = getRadioLabel(value);
    // console.log(`obj: ${obj}, lbl: ${lbl}`);
    if (lbl) {
        // Replace the text inside the label with the new text
        lbl.textContent = newText;

        // Ensure the input remains in the label
        lbl.prepend(obj);
    }
}

function resetRadioGroup() {
    const radioButtons = document.querySelectorAll('.radio-group input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.checked = false;
    });

    // // Hide and reset the named field
    const namedField = document.getElementById('namedField');
    // namedField.value = ''; // Reset value
    namedField.classList.add('hidden-text-field'); // Hide field

    console.log("......  resetRadioGroup  .....")

    toggleFileContainer(false)
}


const getSectionsField = () => {
  return document.getElementById("sections")
}

const getSectionsFieldValue = () => {
    const sectionsField = getSectionsField();
    return sectionsField.value;
}



const getExchangesField = () => {
    return document.getElementById('exchangeContainer');
}

const getExchangesFieldValue = () => {
    const exchangesField = getExchangesField();
    const exchangesArray = [...exchangesField.querySelectorAll('.exchange-tile span:last-child')]
      .map(span => span.textContent);
    // const orderedExchanges = encodeURIComponent(JSON.stringify(ordered));
    return exchangesArray;
}


const toggleTextField = () => {
    const textField = document.getElementById('namedField');
    const namedRadio = document.querySelector('input[type="radio"][value="named"]');
    console.log("......  toggleTextField  .....")
    textField.style.display = namedRadio.checked ? 'block' : 'none';

    if (namedRadio && namedRadio.value === 'named') {
        toggleFileContainer(true); // Show the file container when "named" is selected
    }
}


const selectText = (input) => {
  input.select();
}

function toggleNote() {
  var popup = document.getElementById("myPopup");
  console.dir(popup)
  popup.classList.toggle("show");
}

async function loadExchanges() {
  const resp = await fetch('Exchanges.json');
  if (!resp.ok) {
    throw new Error(`Failed to load Exchanges.json: ${resp.status} ${resp.statusText}`);
  }
  return resp.json();
}


const checkForChanges = (stillLoading) => {
    console.log("checkForChanges()")

    // Retrieve existing cookies
    const exchangesCookie = getCookie(EXCHANGES_COOKIE_NAME);
    let exchangesCookieValue = null
    if (exchangesCookie) exchangesCookieValue = JSON.parse(exchangesCookie).join(",")
    const exchangesNow = getExchangesFieldValue().toString();


    const sectionsCookie = getCookie(SECTIONS_COOKIE_NAME);
    const sectionsNow = getSectionsFieldValue()

    const button = document.getElementById('savePrefsBtn');

    button.style.display = 'none';

    if (!exchangesCookie || !sectionsCookie) {
        // No cookie exists, show the button
        button.style.display = 'block';
        return;
    }

    if (stillLoading) return;

    console.log(exchangesCookieValue);
    console.log(exchangesNow);
    if (exchangesCookieValue != exchangesNow) {
        // No cookie exists, show the button
        button.style.display = 'block';
        return;
    }

    if (sectionsCookie != sectionsNow) {
        // No cookie exists, show the button
        button.style.display = 'block';
        return;
    }

    return;
}


// render tiles
function renderWatchListSections(container, list) {
    console.log(`Ready to load watch list sections`);
    console.dir(container);
    console.dir(list);

    const sectionsCookie = getCookie(SECTIONS_COOKIE_NAME)
    if (sectionsCookie) {
        list = sectionsCookie;
    }
    container.value = list;
}


// render tiles
function renderExchangeListTiles(container, list) {
    console.log(`Ready to load exchnages`);
    console.dir(container);
    console.dir(list);

    const exchangesCookie = JSON.parse(getCookie(EXCHANGES_COOKIE_NAME));
    if (exchangesCookie) {
        list = exchangesCookie;
    }

    container.innerHTML = '';
    list.forEach(name => {
        const tile = document.createElement('div');
        tile.className = 'exchange-tile';
        tile.draggable = true;

        // drag handle
        const handle = document.createElement('span');
        handle.className = 'drag-handle';
        handle.textContent = '☰';
        tile.append(handle);

        // label
        const label = document.createElement('span');
        label.textContent = name;
        tile.append(label);

        container.append(tile);
    });
}
