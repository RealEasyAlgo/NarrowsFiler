function replaceTextareaContent(newContent) {
  const textarea = document.getElementById("sections");
  textarea.value = newContent;
}

function selectDropdownItem(value) {
  const dropdown = document.getElementById("dropdown");
  dropdown.value = value;
}

function getRadioLabel(value) {
    // Find the input element by its value
    let radioInput = document.querySelector(`input[type="radio"][name="option"][value="${value}"]`);
    if (radioInput) {
        return { "obj": radioInput, "lbl": radioInput.closest('label')}
    }
    return null;
}

function changeRadioLabelText(value, newText) {
    const { obj, lbl } = getRadioLabel(value);
    // console.log(`obj: ${obj}, lbl: ${lbl}`);
    if (lbl) {
        // Replace the text inside the label with the new text
        lbl.textContent = newText;

        // Ensure the input remains in the label
        lbl.prepend(obj);
    }
}

function toggleTextField() {
    const textField = document.getElementById('namedField');
    const namedRadio = document.querySelector('input[type="radio"][value="named"]');
    textField.style.display = namedRadio.checked ? 'block' : 'none';
}

function toggleTextField() {
    const textField = document.getElementById('namedField');
    const namedRadio = document.querySelector('input[type="radio"][value="named"]');
    console.log("...........")
    textField.style.display = namedRadio.checked ? 'block' : 'none';
}


function selectText(input) {
  input.select();
}
