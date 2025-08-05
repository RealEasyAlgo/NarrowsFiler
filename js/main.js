const getSectionsText = () => {
    const rtrn = document.getElementById("sections").value;
    // console.log("Text Area Content:", rtrn);
    return rtrn
}

const getSelectedRadioValue = () => {
    let rtrn = ""
    let rbVal = "";
    let selectedRadioValue = document.querySelector('input[name="option"]:checked');
    if (selectedRadioValue) {
        rtrn = selectedRadioValue.closest('label').textContent
        rbVal = selectedRadioValue.value
        console.log(`Selected Radio Option: ${rbVal}  (${rtrn})`);
    } else {
        console.log("No radio option selected");
    }

    return rtrn;
}

const getNamedFieldValue = () => {
    let rtrn = ""
    // Get the value of the namedField input
    rtrn = document.getElementById("namedField").value;
    // console.log("Named Field Value:", rtrn);
    return rtrn;
}

const getDropdownValue = () => {
    let rtrn = ""
    // Get the value of the Dropdown input
    rtrn = document.getElementById("exchangeDropdown").value;
    // console.log("Dropdown Value:", rtrn);
    return rtrn;
}

async function loadAssetsPerExchange(fileName) {
    try {
        const response = await fetch(fileName);
        if (!response.ok) {
            throw new Error(`Failed to load ${fileName}: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        return JSON.parse(text);
    } catch (error) {
        console.error(error);
        return null;
    }
}

const collectArgs = async () => {
    let theHeader = getSectionsText();
    let filename = getSelectedRadioValue();
    let namedFieldValue = getNamedFieldValue();
    const exchangePriorities = getExchangesFieldValue()
    // let dropdownValue = getDropdownValue();
    let dropdownValue = "BINGX";

    let result = ""

    // const multiLine = data.split(',').join('\n');

    // const replacedData = multiLine.split('\n').map(line => {
    //     const match = line.match(/^([^:]+):(.*)$/);
    //     return match ? `${dropdownValue}:${match[2]}` : line;
    // }).join('\n');
    // // console.log(`replacedData : ${replacedData}`);
    // const noLeadingBlanksData = replacedData.replace(/^\s+/gm, '');
    // // console.log(`noLeadingBlanksData : ${noLeadingBlanksData}`);
    // const noBlankLinesData = noLeadingBlanksData.replace(/\n\s*\n/g, '\n');
    // // console.log(`noBlankLinesData : ${noBlankLinesData}`);
    // const noDuplicatesData = removeDuplicateLines(noBlankLinesData)

    // const pyld = theHeader + `\n` + noDuplicatesData
    // const payload = pyld.replace(/\n\s*\n/g, '\n');

    if (filename.includes("named")) filename = namedFieldValue;
    if ( ! filename.includes(".txt")) filename = `${filename}.txt`;

    const exchangeSymbols = await loadAssetsPerExchange(LATEST_ASSETS_PER_EXCHANGE_FILE_NAME)

    return {
        "outFileName" : filename,
        "exchangeSymbols" : exchangeSymbols,
        "exchangePriorities" : exchangePriorities,
        "header" : theHeader,
    }
        // "trendX" : selectedRadioValue.closest('label').textContent,
}

// Function to handle file processing
const handleFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text(); // Read the file content
    const narrows = text.toUpperCase(); // Example processing: convert to uppercase

    // const { exchange, trendX, theHeader, namedFieldValue, payload } = collectArgs(text)
    const { outFileName, exchangeSymbols, exchangePriorities, header } = await collectArgs()

    console.log(`file.name:: ${file.name}`);
    const payload = transform_EA_narrow(narrows, exchangeSymbols, exchangePriorities, header);

    // // // console.log(`exchange : ${exchange}`);
    // // // console.log(`theHeader : ${theHeader}`);
    // // // console.log(`namedFieldValue : ${namedFieldValue}`);
    // // // console.log(`trendX : ${trendX}`);
    // // // console.log(`payload : ${payload}`);
    // let filename = trendX;
    // // if (filename.includes("named")) filename = namedFieldValue;
    // // if ( ! filename.includes(".txt")) filename = `${filename}.txt`;

    // Create a Blob and a download link
    const blob = new Blob([payload], { type: 'text/plain' });
    console.log(`outFileName :: ${outFileName}`);
    downloadLink.setAttribute('download', outFileName);
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.style.display = 'block';

    console.log(`File has been handled`)
}

document.getElementById('download-link').addEventListener('click', () => {
    toggleFileContainer(false);
    resetRadioGroup()
});


document.addEventListener('DOMContentLoaded', async () => {

  const sections = document.getElementById("sections")
  const exchanges = getExchangesField();
  const saveBtn   = document.getElementById('savePrefsBtn');
  if (!exchanges || !saveBtn || !sections) {
    console.error('Missing #exchangeContainer or #savePrefsBtn or #sections');
    return;
  }


  // const defaultWatchlistPreferences = await loadWatchlistDefaultPreferences();
  // const watchlistPreferences = await loadWatchlistPreferences(defaultWatchlistPreferences); // Retrieve and log the preferences
  const watchlistPreferences = await loadWatchlistPreferences(); // Retrieve and log the preferences
  // replaceTextareaContent(watchlistPreferences)


  // 1) load list
  let defaultExchanges = await loadExchanges();
  console.log(`Ready to load cookies`);
  console.dir(defaultExchanges);

  // Retrieve existing cookies
  // const exchangesCookie = JSON.parse(getCookie(EXCHANGES_COOKIE_NAME));
  // const sectionsCookie = getCookie(SECTIONS_COOKIE_NAME);


  // // 2) reorder if user has saved prefs
  // const cookieMatch = document.cookie.match(/(?:^|;\s*)preferredExchanges=([^;]+)/);
  // if (cookieMatch) {
  //   try {
  //     const saved = JSON.parse(decodeURIComponent(cookieMatch[1]));
  //     // keep only known exchanges, in saved order
  //     const ordered = saved.filter(name => exchanges.includes(name));
  //     const remaining = exchanges.filter(name => !ordered.includes(name));
  //     exchanges = ordered.concat(remaining);
  //   } catch (e) {
  //     console.warn('Could not parse preferredExchanges cookie:', e);
  //   }
  // }

  // // 3) render tiles
  // function renderExchangeListTiles(list) {
  //   exchanges.innerHTML = '';
  //   list.forEach(name => {
  //     const tile = document.createElement('div');
  //     tile.className = 'exchange-tile';
  //     tile.draggable = true;

  //     // drag handle
  //     const handle = document.createElement('span');
  //     handle.className = 'drag-handle';
  //     handle.textContent = '☰';
  //     tile.append(handle);

  //     // label
  //     const label = document.createElement('span');
  //     label.textContent = name;
  //     tile.append(label);

  //     exchanges.append(tile);
  //   });
  // }
  renderExchangeListTiles(exchanges, defaultExchanges);

  renderWatchListSections(sections, watchlistPreferences);

  // 4) drag-and-drop logic
  let draggingEl = null;
  exchanges.addEventListener('dragstart', e => {
    if (e.target.matches('.exchange-tile')) {
      draggingEl = e.target;
      e.target.classList.add('dragging');
    }
  });
  exchanges.addEventListener('dragend', e => {
    if (e.target.matches('.exchange-tile')) {
      e.target.classList.remove('dragging');
      draggingEl = null;
    }
  });
  exchanges.addEventListener('dragover', e => {
    e.preventDefault();
    if (!draggingEl) return;
    const after = getDragAfterElement(exchanges, e.clientY);
    if (after == null) {
      exchanges.append(draggingEl);
    } else {
      exchanges.insertBefore(draggingEl, after);
    }
  });

  function getDragAfterElement(exchanges, y) {
    const tiles = [...exchanges.querySelectorAll('.exchange-tile:not(.dragging)')];
    return tiles.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  // 5) save button handler
  saveBtn.addEventListener('click', () => {

    var result = "Preferences storage result ..."
    const ordered = [...exchanges.querySelectorAll('.exchange-tile span:last-child')]
      .map(span => span.textContent);
    const orderedExchanges = encodeURIComponent(JSON.stringify(ordered));
    const test = getExchangesFieldValue()
    const exchanges_ok = saveCookies(EXCHANGES_COOKIE_NAME, orderedExchanges)

    const watchlistSections = encodeURIComponent(sections.value)
    // saveCookies(SECTIONS_COOKIE_NAME, "sdfasdf")
    const sections_ok = saveCookies(SECTIONS_COOKIE_NAME, watchlistSections)

    if (exchanges_ok) {
      result = `${result}\n   - Exchanges:\n${decodeURIComponent(exchanges_ok)}`
    } else {
      result = `${result}\n   - Exchange preferences failed to save! `
    }

    if (sections_ok) {
      result = `${result}\n   - Watchlist sections:\n${decodeURIComponent(sections_ok)}`
    } else {
      result = `${result}\n   - Watchlist sections failed to save! `
    }
    alert(result);

  });
});

// const transformedNarrows = transform_EA_narrow(theNarrows, theExchangeSymbols, theExchangePriorities, aHeader);
// console.dir(transformedNarrows);