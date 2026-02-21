// JavaScript for upload_reports.html
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const fileList = document.getElementById('file-list');
    const recentList = document.getElementById('recent-list');
    const uploadCard = document.querySelector('.upload-card');
    let selectedFiles = [];
    let recentUploads = JSON.parse(localStorage.getItem('recentUploads')) || [];

    // Display recent uploads on load
    displayRecentUploads();

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Drag and drop functionality
    uploadCard.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadCard.classList.add('dragover');
    });

    uploadCard.addEventListener('dragleave', () => {
        uploadCard.classList.remove('dragover');
    });

    uploadCard.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadCard.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    function handleFiles(files) {
        for (let file of files) {
            if (isValidFile(file)) {
                selectedFiles.push(file);
                displayFile(file);
            } else {
                alert(`${file.name} is not a supported file type.`);
            }
        }
        updateUploadButton();
    }

    function isValidFile(file) {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        return validTypes.includes(file.type);
    }

    function displayFile(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span>${file.name} (${(file.size / 1024).toFixed(2)} KB)</span>
            <button class="remove-btn" data-name="${file.name}">Remove</button>
        `;
        fileList.appendChild(fileItem);

        // Remove file functionality
        fileItem.querySelector('.remove-btn').addEventListener('click', () => {
            selectedFiles = selectedFiles.filter(f => f.name !== file.name);
            fileItem.remove();
            updateUploadButton();
        });
    }

    function updateUploadButton() {
        uploadBtn.disabled = selectedFiles.length === 0;
    }

    // Upload functionality
    uploadBtn.addEventListener('click', () => {
        if (selectedFiles.length > 0) {
            // Simulate upload
            uploadBtn.textContent = 'Uploading...';
            uploadBtn.disabled = true;

            setTimeout(() => {
                alert(`Successfully uploaded ${selectedFiles.length} report(s)!`);
                // Add to recent uploads and history
                let historyData = JSON.parse(localStorage.getItem('historyData')) || [];
                selectedFiles.forEach(file => {
                    const uploadInfo = {
                        name: file.name,
                        size: file.size,
                        uploadTime: new Date().toLocaleString()
                    };
                    recentUploads.push(uploadInfo);
                    // Add to history with additional fields
                    historyData.push({
                        title: file.name,
                        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                        medicines: 'N/A', // Placeholder
                        doctor: 'N/A', // Placeholder
                        details: `Uploaded report: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
                    });
                });
                localStorage.setItem('recentUploads', JSON.stringify(recentUploads));
                localStorage.setItem('historyData', JSON.stringify(historyData));
                displayRecentUploads();
                selectedFiles = [];
                fileList.innerHTML = '';
                uploadBtn.textContent = 'Upload Reports';
                updateUploadButton();
            }, 2000);
        }
    });

    function displayRecentUploads() {
        recentList.innerHTML = '';
        if (recentUploads.length === 0) {
            recentList.innerHTML = '<p class="no-uploads">📁 No recent uploads yet. Upload your first report!</p>';
            return;
        }
        recentUploads.forEach((upload, index) => {
            const uploadItem = document.createElement('div');
            uploadItem.className = 'recent-item';
            uploadItem.innerHTML = `
                <span>${upload.name} (${(upload.size / 1024).toFixed(2)} KB) - Uploaded on ${upload.uploadTime}</span>
                <div class="item-buttons">
                    <button class="view-btn" data-index="${index}">View</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            recentList.appendChild(uploadItem);

            // View functionality
            uploadItem.querySelector('.view-btn').addEventListener('click', () => {
                viewReport(upload);
            });

            // Delete functionality
            uploadItem.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete ${upload.name}?`)) {
                    recentUploads.splice(index, 1);
                    localStorage.setItem('recentUploads', JSON.stringify(recentUploads));
                    displayRecentUploads();
                }
            });
        });
    }

    function viewReport(upload) {
        if (upload.name.toLowerCase().endsWith('.pdf')) {
            alert(`Viewing PDF report: ${upload.name}`);
            // In a real app, open PDF viewer or download
        } else if (upload.name.toLowerCase().endsWith('.jpg') || upload.name.toLowerCase().endsWith('.png')) {
            // Show image in modal
            const modal = document.getElementById('image-modal');
            const modalImage = document.getElementById('modal-image');
            modalImage.src = 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(upload.name);
            modal.style.display = 'flex';
        } else {
            alert(`Viewing report: ${upload.name}`);
        }
    }

    // Close modal functionality
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('image-modal').style.display = 'none';
    });

    // Close modal when clicking outside
    document.getElementById('image-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('image-modal')) {
            document.getElementById('image-modal').style.display = 'none';
        }
    });
});
