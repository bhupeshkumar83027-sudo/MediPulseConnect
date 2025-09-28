document.addEventListener('DOMContentLoaded', () => {
    const notifications = document.querySelectorAll('.notification');

    notifications.forEach(notification => {
        notification.addEventListener('click', () => {
            // Here you would typically mark as read or navigate to details
            alert('Notification clicked!');
        });
    });
});
