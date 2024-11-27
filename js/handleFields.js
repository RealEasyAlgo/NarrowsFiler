const replaceTextareaContent = (newContent) => {
  const textarea = document.getElementById("sections");
  textarea.value = newContent;
}

const selectDropdownItem = (value) => {
  const dropdown = document.getElementById("dropdown");
  dropdown.value = value;
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

const toggleTextField = () => {
    const textField = document.getElementById('namedField');
    const namedRadio = document.querySelector('input[type="radio"][value="named"]');
    console.log("...........")
    textField.style.display = namedRadio.checked ? 'block' : 'none';
}


const selectText = (input) => {
  input.select();
}

function toggleNote() {
  var popup = document.getElementById("myPopup");
  console.dir(popup)
  popup.classList.toggle("show");
}

