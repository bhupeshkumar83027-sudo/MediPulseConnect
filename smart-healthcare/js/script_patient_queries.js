// Patient Queries Page Script
document.addEventListener('DOMContentLoaded', function() {
    // Load and display queries from localStorage
    loadQueriesFromStorage();

    // Filter functionality
    document.getElementById('date-filter').addEventListener('change', filterQueries);
    document.getElementById('urgency-filter').addEventListener('change', filterQueries);

    function filterQueries() {
        const dateValue = document.getElementById('date-filter').value;
        const urgencyValue = document.getElementById('urgency-filter').value;
        const cards = document.querySelectorAll('.query-card');

        cards.forEach(card => {
            const date = card.querySelector('small').textContent.split(': ')[1];
            const urgency = card.querySelector('.urgency').textContent.toLowerCase();

            const dateMatch = !dateValue || date === dateValue;
            const urgencyMatch = urgencyValue === 'All' || urgency === urgencyValue.toLowerCase();

            if (dateMatch && urgencyMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Respond button functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.respond-btn')) {
            window.location.href = 'respond_solutions.html';
        }
    });
});

function loadQueriesFromStorage() {
    let queries = JSON.parse(localStorage.getItem('patientQueries') || '[]');
    const container = document.querySelector('.queries-list');

    // Sort queries by timestamp descending (newest first)
    queries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Add static sample queries if none exist
    if (queries.length === 0) {
        queries = [
            {
                patientName: 'John Doe',
                query: 'I have been experiencing severe headaches for the past week.',
                timestamp: '2023-10-01T00:00:00.000Z',
                urgency: 'high'
            },
            {
                patientName: 'Jane Smith',
                query: 'Feeling dizzy after meals.',
                timestamp: '2023-10-02T00:00:00.000Z',
                urgency: 'medium'
            }
        ];
        localStorage.setItem('patientQueries', JSON.stringify(queries));
    }

    // Clear existing dynamic cards (keep static HTML ones if present)
    const existingDynamicCards = container.querySelectorAll('.query-card.dynamic');
    existingDynamicCards.forEach(card => card.remove());

    // Render queries from storage (newest first)
    queries.forEach(data => {
        const card = document.createElement('div');
        card.className = 'query-card dynamic';

        const header = document.createElement('div');
        header.className = 'query-header';

        const h3 = document.createElement('h3');
        h3.innerHTML = `<i class="icon">👤</i> Patient: ${data.patientName}`;

        const urgencySpan = document.createElement('span');
        urgencySpan.className = `urgency ${data.urgency}`;
        const urgencyIcon = data.urgency === 'high' ? '🔴' : data.urgency === 'medium' ? '🟡' : '🟢';
        urgencySpan.innerHTML = `<i class="icon">${urgencyIcon}</i> ${data.urgency.charAt(0).toUpperCase() + data.urgency.slice(1)}`;

        header.appendChild(h3);
        header.appendChild(urgencySpan);

        const p = document.createElement('p');
        p.innerHTML = `<i class="icon">📝</i> Query: ${data.query}`;

        const small = document.createElement('small');
        const date = new Date(data.timestamp);
        small.innerHTML = `<i class="icon">📅</i> Date: ${date.toISOString().split('T')[0]}`;

        const respondBtn = document.createElement('button');
        respondBtn.className = 'respond-btn';
        respondBtn.innerHTML = '<i class="icon">💬</i> Respond';

        card.appendChild(header);
        card.appendChild(p);
        card.appendChild(small);
        card.appendChild(respondBtn);

        container.appendChild(card);
    });
}

/*
// Optional: Socket.io for real-time updates (uncomment if server is running)
// const socket = io();
// socket.on('new-patient-message', (data) => {
//     let queries = JSON.parse(localStorage.getItem('patientQueries') || '[]');
//     queries.unshift({
//         patientName: data.patientName || 'Patient',
//         query: data.query || 'No query',
//         timestamp: data.timestamp || new Date().toISOString(),
//         urgency: data.urgency || 'medium'
//     });
//     localStorage.setItem('patientQueries', JSON.stringify(queries));
//     loadQueriesFromStorage(); // Refresh display
// });
*/
