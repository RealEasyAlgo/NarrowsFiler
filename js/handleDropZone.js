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

