// File drop zone element
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const downloadLink = document.getElementById('download-link');

// Allow clicking on the drop zone to upload a file
dropZone.addEventListener('click', () => fileInput.click());

// Handle drag and drop events
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFile({ target: { files: [file] } });
});

const ERROR = "Not a valid EX Narrows file!<br/> -- "
function validateBybitFile(text) {
  const lines = text.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '') continue; // Skip empty lines

    if (!line.startsWith("BYBIT:")) {
      alert(`${ERROR}Line ${i + 1} does not begin with "BYBIT:"`);
      return;
    }

    if (line.length > 40) {
      alert(`${ERROR}Line ${i + 1} exceeds 40 characters`);
      return;
    }

    for (const char of line) {
      const code = char.charCodeAt(0);
      if (code > 127) {
        alert(`${ERROR}Line ${i + 1} contains non-ASCII character: '${char}'`);
        return;
      }

      if (!/[A-Za-z0-9:.]/.test(char)) {
        alert(`${ERROR}Line ${i + 1} contains disallowed character: '${char}'`);
        return;
      }
    }
  }

  // alert("File is valid");
}
