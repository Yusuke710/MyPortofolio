// ---
const hamMenuBtn = document.querySelector('.header__main-ham-menu-cont')
const smallMenu = document.querySelector('.header__sm-menu')
const headerHamMenuBtn = document.querySelector('.header__main-ham-menu')
const headerHamMenuCloseBtn = document.querySelector(
  '.header__main-ham-menu-close'
)
const headerSmallMenuLinks = document.querySelectorAll('.header__sm-menu-link')

hamMenuBtn.addEventListener('click', () => {
  if (smallMenu.classList.contains('header__sm-menu--active')) {
    smallMenu.classList.remove('header__sm-menu--active')
  } else {
    smallMenu.classList.add('header__sm-menu--active')
  }
  if (headerHamMenuBtn.classList.contains('d-none')) {
    headerHamMenuBtn.classList.remove('d-none')
    headerHamMenuCloseBtn.classList.add('d-none')
  } else {
    headerHamMenuBtn.classList.add('d-none')
    headerHamMenuCloseBtn.classList.remove('d-none')
  }
})

for (let i = 0; i < headerSmallMenuLinks.length; i++) {
  headerSmallMenuLinks[i].addEventListener('click', () => {
    smallMenu.classList.remove('header__sm-menu--active')
    headerHamMenuBtn.classList.remove('d-none')
    headerHamMenuCloseBtn.classList.add('d-none')
  })
}

// ---
const headerLogoConatiner = document.querySelector('.header__logo-container')

headerLogoConatiner.addEventListener('click', () => {
  location.href = 'index.html'
})


// added by Yusuke 26/12/2023
// JavaScript code for the game logic

// Function to get a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Secret word and list of words
const words = ["artificial", "intelligence", "algorithm", "text", "context", "calculate", "similarity"];

// Use the current date as a seed for randomness
const currentDate = new Date();
const seed = currentDate.getDate(); // You can use other parts of the date for more randomness if needed

// Set a seed for the random number generator
Math.seedrandom(seed);

// Get a random index to pick a secret word
const randomIndex = getRandomInt(0, words.length - 1);
const secretWord = words[randomIndex];

// Calculate distances from the secret word
const distances = words.map(word => ({
    word,
    distance: calculateDistance(secretWord, word)
}));

// Sort words based on distances
distances.sort((a, b) => a.distance - b.distance);

// Function to calculate distance between two words (for demonstration purposes)
function calculateDistance(word1, word2) {
    // Implement your distance calculation logic here (for example, Levenshtein distance)
    // This is a simple placeholder function
    return Math.abs(word1.length - word2.length);
}

// User attempt history
const attemptHistory = [];

// Function to submit a guess
function submitGuess() {
    const guess = document.getElementById('guessInput').value.toLowerCase();

    if (words.includes(guess)) {
        const position = words.indexOf(guess) + 1;
        if (guess === secretWord) {
            displayResult(`Congratulations! You found the secret word.`);
        } else {
            displayResult(`Your word "${guess}" is at position ${position}. Keep guessing!`);
        }
    } else {
        // Display the failure attempt along with the closest words
        const closestWords = distances.slice(0, 3).map(item => item.word);
        displayResult(`Sorry, '${guess}' is not in the list. Your closest attempts: ${closestWords.join(', ')}. Try again.`);
    }

    // Display attempt history
    displayAttemptHistory();
}

// Function to display the result
function displayResult(message) {
    document.getElementById('result').textContent = message;
}

// Function to display attempt history
function displayAttemptHistory() {
    const historyList = document.getElementById('attemptHistory');
    historyList.innerHTML = ''; // Clear previous history

    attemptHistory.forEach(attempt => {
        const listItem = document.createElement('li');
        listItem.textContent = `Word: ${attempt.word}, Position: ${attempt.position}`;
        historyList.appendChild(listItem);
    });

  }