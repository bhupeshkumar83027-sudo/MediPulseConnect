document.addEventListener('DOMContentLoaded', () => {
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', () => {
            const type = item.getAttribute('data-type');
            alert(`Notification clicked: ${type}`);
            // Add functionality like marking as read or navigating to details
        });
    });
});
