onmessage = function(event) {
    (function() {
        "use strict";

        if (event.data === 'Начать обработку') {
            let result = 0;
            for (let i = 0; i < 1e9; i++) {
                result += i;
            }
            postMessage(result);
        }
    })();
};