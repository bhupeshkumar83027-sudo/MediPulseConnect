// JavaScript for history.html
document.addEventListener('DOMContentLoaded', () => {
    // Load history data from localStorage, or use static data if not present
    let historyData = JSON.parse(localStorage.getItem('historyData')) || [
        { title: 'Blood Test Report', date: '2023-01-01', medicines: 'Paracetamol, Ibuprofen', doctor: 'Dr. Smith', details: 'Routine blood check. All parameters normal.' },
        { title: 'X-Ray Chest', date: '2023-02-15', medicines: 'Antibiotics', doctor: 'Dr. Johnson', details: 'Chest X-ray for cough. Mild infection detected.' },
        { title: 'Dental Checkup', date: '2023-03-20', medicines: 'Painkillers', doctor: 'Dr. Lee', details: 'Teeth cleaning and checkup. No issues found.' },
        { title: 'Eye Examination', date: '2023-04-10', medicines: 'Eye drops', doctor: 'Dr. Patel', details: 'Vision test. Prescribed glasses.' },
        { title: 'Cardiac Check', date: '2023-05-05', medicines: 'Beta-blockers', doctor: 'Dr. Gupta', details: 'ECG and stress test. Heart health good.' }
    ];

    const historyList = document.getElementById('history-list');

    // Function to render history items
    function renderHistory() {
        historyList.innerHTML = '';
        historyData.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'history-item';
            itemDiv.innerHTML = `
                <h3>${item.title}</h3>
                <p><strong>Date:</strong> ${item.date}</p>
                <p><strong>Medicines:</strong> ${item.medicines}</p>
                <p><strong>Doctor:</strong> ${item.doctor}</p>
                <div class="details" style="display: none;">${item.details}</div>
            `;
            itemDiv.addEventListener('click', () => {
                if (item.details.startsWith('Uploaded report:')) {
                    // View the report
                    viewReport(item);
                } else {
                    // Toggle details for static history
                    const details = itemDiv.querySelector('.details');
                    details.style.display = details.style.display === 'none' ? 'block' : 'none';
                }
            });
            historyList.appendChild(itemDiv);
        });
    }

    // Function to view report
    function viewReport(item) {
        const reportName = item.title;
        if (reportName.toLowerCase().endsWith('.pdf')) {
            alert(`Viewing PDF report: ${reportName}`);
            // In a real app, open PDF viewer or download
        } else if (reportName.toLowerCase().endsWith('.jpg') || reportName.toLowerCase().endsWith('.png')) {
            // Show image in modal
            showImageModal(reportName);
        } else {
            alert(`Viewing report: ${reportName}`);
        }
    }

    // Function to show image modal
    function showImageModal(reportName) {
        const modal = document.createElement('div');
        modal.id = 'image-modal';
        modal.style.cssText = `
            position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center;
        `;
        modal.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 10px; max-width: 90%; max-height: 90%; position: relative;">
                <span id="close-modal" style="position: absolute; top: 10px; right: 15px; color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
                <img src="https://via.placeholder.com/600x400?text=${encodeURIComponent(reportName)}" alt="Report Image" style="max-width: 100%; max-height: 80vh;">
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Load history
    renderHistory();
});
