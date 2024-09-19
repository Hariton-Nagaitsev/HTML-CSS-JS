(function () {
  "use strict";

  // Получение элементов canvas и контекста
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  if (!canvas || !ctx) {
    console.error("Ошибка: Canvas не найден или не поддерживается вашим браузером.");
    return;
  }

  const scoreDisplay = document.getElementById('score');
  const playerNameInput = document.getElementById('playerName');
  const submitScoreBtn = document.getElementById('submitScoreBtn');
  const highScoresTable = document.getElementById('highScoresTable')?.getElementsByTagName('tbody')[0];
  if (!scoreDisplay || !playerNameInput || !submitScoreBtn || !highScoresTable) {
    console.error("Ошибка: Не найдены следующие элементы интерфейса: ", {
      scoreDisplay,
      playerNameInput,
      submitScoreBtn,
      highScoresTable
    });
    return;
  }

  // Размеры поля и змейки
  const box = 20;
  if (canvas.width % box !== 0 || canvas.height % box !== 0) {
    console.error("Ошибка: Размеры canvas должны быть кратны размеру клетки.");
    return;
  }

  let snake;
  let direction;
  let food;
  let game;
  let score = 0;
  let isPaused = false;
  let speed = 120; // Начальная скорость змейки
  const speedIncreaseThreshold = 3; // Порог для увеличения скорости
  const speedIncreaseAmount = 2; // Количество уменьшения времени интервала
  let highScores = [];

  // Инициализация игры
  function initGame() {
    snake = [{ x: Math.floor(canvas.width / box / 2) * box, y: Math.floor(canvas.height / box / 2) * box }];
    direction = 'RIGHT';
    food = generateFood();
    score = 0;
    scoreDisplay.innerText = `Счет: ${score}`;
    speed = 120; // Сброс скорости на начальное значение
    loadHighScores();
    renderHighScores();
  }

  // Загрузить рекорды из localStorage
  function loadHighScores() {
    const storedScores = localStorage.getItem('highScores');
    try {
      highScores = storedScores ? JSON.parse(storedScores) : [];
    } catch (e) {
      console.error("Ошибка при загрузке рекордов:", e);
      highScores = [];
    }
  }

  // Сохранить рекорды в localStorage
  function saveHighScores() {
    localStorage.setItem('highScores', JSON.stringify(highScores));
  }

  // Отобразить таблицу рекордов
  function renderHighScores() {
    const tbody = highScoresTable;
    tbody.innerHTML = '';
    if (highScores.length > 0) {
      highScores.sort((a, b) => b.score - a.score);
      highScores.forEach((entry, index) => {
        const row = tbody.insertRow();
        const nameCell = row.insertCell(0);
        const scoreCell = row.insertCell(1);
        nameCell.innerText = entry.name;
        scoreCell.innerText = entry.score;

        // Если это самый высокий рекорд, выделяем строку красным цветом
        if (index === 0) {
          row.style.color = 'red';
          row.style.fontWeight = 'bold';
        }
      });
    }
  }

  // Функция для генерации координат еды
  function generateFood() {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
      };
    } while (collision(newFood, snake));

    return newFood;
  }

  // Функция для отрисовки игры
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawSnake();
    drawFood();

    if (isPaused) return;

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    switch (direction) {
      case 'LEFT': snakeX -= box; break;
      case 'UP': snakeY -= box; break;
      case 'RIGHT': snakeX += box; break;
      case 'DOWN': snakeY += box; break;
    }

    // Проверка выхода за границы и возвращение с другой стороны
    if (snakeX < 0) snakeX = canvas.width - box;
    if (snakeY < 0) snakeY = canvas.height - box;
    if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY >= canvas.height) snakeY = 0;

    // Создаем новую голову
    const newHead = { x: snakeX, y: snakeY };

    // Проверка на столкновение с телом
    if (collision(newHead, snake)) {
      clearInterval(game);
      alert('Игра окончена!\nСохраните ваш рекорд!');
      return;
    }

    // Проверка на столкновение с едой
    if (snakeX === food.x && snakeY === food.y) {
      food = generateFood();
      score++;
      scoreDisplay.innerText = `Счет: ${score}`;
      checkSpeed();
    } else {
      // Если не столкнулись с едой, удаляем последний сегмент
      snake.pop();
    }

    // Добавляем новую голову
    snake.unshift(newHead);
  }

  // Функция для отрисовки сетки
  function drawGrid() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 0.5;

    // Рисуем вертикальные линии
    for (let x = 0; x <= canvas.width; x += box) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Рисуем горизонтальные линии
    for (let y = 0; y <= canvas.height; y += box) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  // Проверка на столкновение с телом
  function collision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
  }

  // Функция для рисования змейки
  function drawSnake() {
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? 'BlueViolet' : 'MediumPurple';
      ctx.fillRect(segment.x, segment.y, box, box);
      ctx.strokeStyle = 'SlateBlue';
      ctx.strokeRect(segment.x, segment.y, box, box);
    });
  }

  // Функция для рисования еды
  function drawFood() {
    ctx.fillStyle = 'Gold';
    ctx.fillRect(food.x, food.y, box, box);
  }

  // Проверка скорости
  function checkSpeed() {
    if (score % speedIncreaseThreshold === 0) {
      increaseSpeed();
    }
  }

  // Увеличение скорости
  function increaseSpeed() {
    speed = Math.max(50, speed - speedIncreaseAmount);
    clearInterval(game);
    game = setInterval(draw, speed);
  }

  // Управление направлением змейки
  let changingDirection = false; 

  function directionControl(event) {
    if (document.activeElement === playerNameInput) {
      return;
    }

    event.preventDefault();

    if (changingDirection) return;

    changingDirection = true;

    const newDirection = event.key.replace('Arrow', '').toUpperCase();
    if (['LEFT', 'UP', 'RIGHT', 'DOWN'].includes(newDirection)) {
      if (newDirection === 'LEFT' && direction !== 'RIGHT') direction = 'LEFT';
      if (newDirection === 'UP' && direction !== 'DOWN') direction = 'UP';
      if (newDirection === 'RIGHT' && direction !== 'LEFT') direction = 'RIGHT';
      if (newDirection === 'DOWN' && direction !== 'UP') direction = 'DOWN';
    }

    // Сбрасываем флаг изменения направления после обработки
    setTimeout(() => {
      changingDirection = false;
    }, speed);
  }

  // Отправка рекорда
  function submitScore() {
    const name = playerNameInput.value.trim();
    console.log(`Имя, введенное пользователем: "${name}"`);
    console.log(`Счет игрока: ${score}`);

    if (score > 0 && name) {
      highScores.push({ name, score });
      highScores.sort((a, b) => b.score - a.score);
      highScores = highScores.slice(0, 5);
      saveHighScores();
      renderHighScores();
      playerNameInput.value = '';
      console.log("Рекорд успешно сохранен!");
    } else {
      alert('Введите ваше имя для сохранения рекорда!');
    }
  }

  // Удалить все рекорды
  function clearHighScores() {
    localStorage.removeItem('highScores');
    highScores = [];
    renderHighScores();
  }

  // Пауза/возобновление игры
  function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
      clearInterval(game);
    } else {
      game = setInterval(draw, speed);
    }
  }

  // Начало игры
  function startGame() {
    if (game) return;
    initGame();
    game = setInterval(draw, speed);
  }

  // Перезапуск игры
  function restartGame() {
    clearInterval(game);
    initGame();
    game = setInterval(draw, speed);
  }

  // Установка событий
  document.addEventListener('keydown', directionControl);
  document.getElementById('startBtn').addEventListener('click', startGame);
  document.getElementById('pauseBtn').addEventListener('click', togglePause);
  document.getElementById('submitScoreBtn').addEventListener('click', submitScore);
  document.getElementById('clearScoresButton').addEventListener('click', clearHighScores);
  document.getElementById('restartBtn').addEventListener('click', restartGame);

  // Начальная инициализация игры
  initGame();

})();
