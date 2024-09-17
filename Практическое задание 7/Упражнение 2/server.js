(() => {
    "use strict";

    const WebSocket = require('ws');

    const wss = new WebSocket.Server({ port: 8080 });

    wss.on('connection', (ws) => {
        console.log('Клиент подключен');

        ws.on('message', (message) => {
            console.log(`Получено сообщение: ${message}`);

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(`Клиент: ${message}`);
                }
            });
        });

        ws.on('close', () => {
            console.log('Клиент отключен');
        });
    });

    console.log('Сервер запущен на ws://localhost:8080');
})();