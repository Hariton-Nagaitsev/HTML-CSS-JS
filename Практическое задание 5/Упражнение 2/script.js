(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const contactForm = document.getElementById('contact-form');
        const contactList = document.getElementById('contact-list');

        loadContacts();

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const phoneInput = document.getElementById('phone');

            const contact = {
                name: nameInput.value,
                phone: phoneInput.value,
            };

            addContact(contact);
            nameInput.value = '';
            phoneInput.value = '';
        });

        function addContact(contact) {
            let contacts = getContacts();
            contacts.push(contact);
            saveContacts(contacts);
            displayContacts(contacts);
        }

        function displayContacts(contacts) {
            contactList.innerHTML = '';
            contacts.forEach((contact, index) => {
                const li = document.createElement('li');
                li.textContent = `${contact.name} - ${contact.phone}`;
                
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Удалить';
                deleteButton.addEventListener('click', () => {
                    deleteContact(index);
                });

                li.appendChild(deleteButton);
                contactList.appendChild(li);
            });
        }

        function deleteContact(index) {
            let contacts = getContacts();
            contacts.splice(index, 1);
            saveContacts(contacts);
            displayContacts(contacts);
        }

        function getContacts() {
            const contacts = localStorage.getItem('contacts');
            return contacts ? JSON.parse(contacts) : [];
        }

        function saveContacts(contacts) {
            localStorage.setItem('contacts', JSON.stringify(contacts));
        }

        function loadContacts() {
            const contacts = getContacts();
            displayContacts(contacts);
        }
    });
})();