// JavaScript for respond_solutions.html
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const responseTextarea = document.getElementById('response');
    const prescriptionTextarea = document.getElementById('prescription');
    const followUpInput = document.getElementById('follow-up');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const response = responseTextarea.value.trim();
        const prescription = prescriptionTextarea.value.trim();
        const followUp = followUpInput.value;

        if (!response) {
            alert('Please provide a solution or advice.');
            return;
        }

        // Get patient info from query details (static for now)
        const patientName = 'John Doe'; // In real app, get from URL or context
        const query = 'I have been experiencing severe headaches for the past week.';
        const date = '2023-10-01';

        // Create response object
        const doctorResponse = {
            patientName,
            query,
            response,
            prescription,
            followUp,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        let responses = JSON.parse(localStorage.getItem('doctorResponses')) || [];
        responses.push(doctorResponse);
        localStorage.setItem('doctorResponses', JSON.stringify(responses));

        alert('Response submitted successfully.');
        // Reset form
        responseTextarea.value = '';
        prescriptionTextarea.value = '';
        followUpInput.value = '';
    });
});
