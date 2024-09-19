(function() {
    'use strict';

    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
        const chatBox = document.getElementById('messages');

        if (chatBox) {
            messages.forEach(messageText => {
                if (typeof messageText === 'string' && messageText.trim() !== '') {
                    const newMessage = document.createElement('div');
                    newMessage.classList.add('message', 'user');
                    newMessage.innerText = messageText;
                    chatBox.appendChild(newMessage);
                } else {
                    console.warn('Некорректный текст сообщения:', messageText);
                }
            });

            chatBox.scrollTop = chatBox.scrollHeight;
        } else {
            console.error('Чат не найден.');
        }
    }

    function saveMessage(messageText) {
        if (typeof messageText !== 'string' || messageText.trim() === '') {
            console.warn('Некорректный текст сообщения, не сохраняется:', messageText);
            return;
        }

        const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
        messages.push(messageText);
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }

    window.sendMessage = function() {
        const inputField = document.getElementById('chatInput');
        if (!inputField) {
            console.error('Поле ввода не найдено.');
            return;
        }

        const messageText = inputField.value;

        if (messageText.trim() !== '') {
            const chatBox = document.getElementById('messages');
            if (chatBox) {
                const newMessage = document.createElement('div');
                newMessage.classList.add('message', 'user');
                newMessage.innerText = messageText;

                chatBox.appendChild(newMessage);
                chatBox.scrollTop = chatBox.scrollHeight;

                saveMessage(messageText);
                inputField.value = '';
            } else {
                console.error('Чат не найден.');
            }
        } else {
            console.warn('Пустое сообщение, не отправляется.');
        }
    };

    window.clearChat = function() {
        localStorage.removeItem('chatMessages');
        const chatBox = document.getElementById('messages');
        if (chatBox) {
            chatBox.innerHTML = '';
        } else {
            console.error('Чат не найден.');
        }
    };

    loadMessages();

    const inputField = document.getElementById('chatInput');
    if (inputField) {
        inputField.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
    } else {
        console.error('Поле ввода не найдено для добавления обработчика событий.');
    }
})();
