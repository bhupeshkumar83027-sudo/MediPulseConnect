// Doctor notifications page script
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for buttons
    const acceptButtons = document.querySelectorAll('.accept');
    const respondButtons = document.querySelectorAll('.respond');

    acceptButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Call accepted! Starting video call...');
            // Here you would initiate the call
        });
    });

    respondButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Opening response interface...');
            // Here you would open a response modal or page
        });
    });
});
