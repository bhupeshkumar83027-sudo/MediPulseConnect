document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('edit-profile-btn');
    const editModal = document.getElementById('edit-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const editForm = document.getElementById('edit-form');
    const displayName = document.getElementById('display-name');
    const displayEmail = document.getElementById('display-email');

    if (editBtn && editModal && closeModalBtn && cancelBtn && editForm) {
        editBtn.addEventListener('click', () => {
            editModal.style.display = 'block';
        });

        closeModalBtn.addEventListener('click', () => {
            editModal.style.display = 'none';
        });

        cancelBtn.addEventListener('click', () => {
            editModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === editModal) {
                editModal.style.display = 'none';
            }
        });

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = editForm.name.value.trim();
            const newEmail = editForm.email.value.trim();

            if (newName && newEmail) {
                displayName.textContent = newName;
                displayEmail.textContent = newEmail;
                alert('Profile updated successfully!');
                editModal.style.display = 'none';
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
});
