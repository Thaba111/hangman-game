const apiUrl = 'https://api.api-ninjas.com/v1/randomword';
const apiKey = 'eJUUegx46J29GB+vKKTtFw==14MmBpmO30nnfR83'; // Your API key

let word;
let guesses;
let incorrectGuesses;
let totalGames = 0;
let wins = 0;
let losses = 0;
let playerName = '';

const wordDisplay = document.getElementById('wordDisplay');
const keyboard = document.getElementById('keyboard');
const celebration = document.getElementById('celebration');
const gameOver = document.getElementById('gameOver');
const correctWordDisplay = document.getElementById('correctWord');
const message = document.getElementById('message');
const nextWordBtn = document.getElementById('nextWordBtn');
const restartGameBtn = document.getElementById('restartGameBtn');
const newGameBtn = document.getElementById('newGameBtn');
const nameEntry = document.getElementById('nameEntry');
const nameInput = document.getElementById('nameInput');
const submitNameBtn = document.getElementById('submitNameBtn');
const welcomeMessage = document.getElementById('welcomeMessage');
const playerNameDisplay = document.getElementById('playerName');
const totalGamesDisplay = document.getElementById('totalGames');
const winsDisplay = document.getElementById('wins');
const lossesDisplay = document.getElementById('losses');

async function fetchRandomWord() {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'X-Api-Key': apiKey }
    });
    const data = await response.json();
    console.log('API Response:', data);
    if (data.word && Array.isArray(data.word) && data.word.length > 0) {
      return data.word[0]; // Extract the first word from the array
    } else {
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    console.error('Error fetching random word:', error);
    return 'default'; // Fallback word
  }
}

async function initializeGame() {
  word = await fetchRandomWord();
  if (!word) {
    word = 'default'; // Fallback word
  }
  guesses = [];
  incorrectGuesses = 0;
  document.getElementById('hangman').className = '';
  renderWord();
  createKeyboard();
  nextWordBtn.classList.add('hide');
  restartGameBtn.classList.add('hide');
  newGameBtn.classList.add('hide');
  celebration.classList.add('hide');
  gameOver.classList.add('hide');
  message.classList.add('hide');
}

function renderWord() {
  wordDisplay.innerHTML = word.split('').map(letter => guesses.includes(letter) ? letter : '_').join(' ');
  if (word.split('').every(letter => guesses.includes(letter))) {
    celebration.classList.remove('hide');
    nextWordBtn.classList.remove('hide'); // Show next word button
    newGameBtn.classList.remove('hide'); // Show new game button
    wins++;
    updateScoreboard();
    disableKeyboard();
  }
}

function handleGuess(letter) {
  if (guesses.includes(letter)) {
    message.textContent = `You already guessed "${letter}".`;
    message.classList.remove('hide');
    return;
  }
  guesses.push(letter);
  if (word.includes(letter)) {
    renderWord();
  } else {
    incorrectGuesses++;
    document.getElementById('hangman').classList.add(`show-${incorrectGuesses}`);
    if (incorrectGuesses === 6) {
      gameOver.classList.remove('hide');
      correctWordDisplay.textContent = word;
      losses++;
      updateScoreboard();
      disableKeyboard();
    }
  }
}

function createKeyboard() {
  keyboard.innerHTML = '';
  for (let i = 97; i <= 122; i++) {
    const letter = String.fromCharCode(i);
    const button = document.createElement('button');
    button.textContent = letter;
    button.addEventListener('click', () => handleGuess(letter));
    keyboard.appendChild(button);
  }
}

function disableKeyboard() {
  Array.from(keyboard.children).forEach(button => button.classList.add('guessed'));
}

function updateScoreboard() {
  totalGames++;
  totalGamesDisplay.textContent = totalGames;
  winsDisplay.textContent = wins;
  lossesDisplay.textContent = losses;
}

function handleNameSubmit() {
  playerName = nameInput.value.trim();
  if (playerName) {
    localStorage.setItem('playerName', playerName);
    displayWelcomeMessage();
  }
}

function displayWelcomeMessage() {
  if (playerName) {
    playerNameDisplay.textContent = playerName;
    nameEntry.classList.add('hide');
    welcomeMessage.classList.remove('hide');
  }
}

submitNameBtn.addEventListener('click', handleNameSubmit);

newGameBtn.addEventListener('click', () => {
  initializeGame();
  newGameBtn.classList.add('hide'); // Hide new game button after clicking
});

initializeGame();
document.addEventListener('DOMContentLoaded', () => {
  playerName = localStorage.getItem('playerName');
  if (playerName) {
    displayWelcomeMessage();
  } else {
    nameEntry.classList.remove('hide');
  }
});
