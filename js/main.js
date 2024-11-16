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
    rtrn = document.getElementById("dropdown").value;
    // console.log("Dropdown Value:", rtrn);
    return rtrn;
}

const processFile = data => {
    let sectionsText = getSectionsText();
    let selectedRadioValue = getSelectedRadioValue();
    let namedFieldValue = getNamedFieldValue();
    let dropdownValue = getDropdownValue();

    let result = ""

    const multiLine = data.split(',').join('\n');

    const replacedData = multiLine.split('\n').map(line => {
        const match = line.match(/^([^:]+):(.*)$/);
        return match ? `${dropdownValue}:${match[2]}` : line;
    }).join('\n');
    // console.log(`replacedData : ${replacedData}`);
    const noLeadingBlanksData = replacedData.replace(/^\s+/gm, '');
    // console.log(`noLeadingBlanksData : ${noLeadingBlanksData}`);
    const noBlankLinesData = noLeadingBlanksData.replace(/\n\s*\n/g, '\n');
    // console.log(`noBlankLinesData : ${noBlankLinesData}`);
    const noDuplicatesData = removeDuplicateLines(noBlankLinesData)

    const pyld = sectionsText + `\n` + noDuplicatesData
    const payload = pyld.replace(/\n\s*\n/g, '\n');

    return {
        "exchange" : dropdownValue,
        "sectionsText" : sectionsText,
        "namedFieldValue" : namedFieldValue,
        "trendX" : selectedRadioValue,
        "payload" : payload,
    }
        // "trendX" : selectedRadioValue.closest('label').textContent,
}

// Function to handle file processing
const handleFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text(); // Read the file content
    const reformattedText = text.toUpperCase(); // Example processing: convert to uppercase
    const { exchange, trendX, sectionsText, namedFieldValue, payload } = processFile(text)
    // console.log(`exchange : ${exchange}`);
    // console.log(`sectionsText : ${sectionsText}`);
    // console.log(`namedFieldValue : ${namedFieldValue}`);
    // console.log(`trendX : ${trendX}`);
    // console.log(`payload : ${payload}`);
    let filename = trendX;
    if (filename.includes("named")) filename = namedFieldValue;
    if ( ! filename.includes(".txt")) filename = `${filename}.txt`;

    // Create a Blob and a download link
    const blob = new Blob([payload], { type: 'text/plain' });
    console.log(`filename :: ${filename}`);
    downloadLink.setAttribute('download', filename);
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.style.display = 'block';

    // savePreferences({ exchange, sectionsText })
}
