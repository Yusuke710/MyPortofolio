// ---
// Header Menu Logic
const hamMenuBtn = document.querySelector('.header__main-ham-menu-cont');
const smallMenu = document.querySelector('.header__sm-menu');
const headerHamMenuBtn = document.querySelector('.header__main-ham-menu');
const headerHamMenuCloseBtn = document.querySelector('.header__main-ham-menu-close');
const headerSmallMenuLinks = document.querySelectorAll('.header__sm-menu-link');

hamMenuBtn.addEventListener('click', () => {
  // Toggle small menu visibility
  smallMenu.classList.toggle('header__sm-menu--active');

  // Toggle visibility of ham menu button and close button
  headerHamMenuBtn.classList.toggle('d-none');
  headerHamMenuCloseBtn.classList.toggle('d-none');
});

for (let i = 0; i < headerSmallMenuLinks.length; i++) {
  headerSmallMenuLinks[i].addEventListener('click', () => {
    // Close small menu and show ham menu button
    smallMenu.classList.remove('header__sm-menu--active');
    headerHamMenuBtn.classList.remove('d-none');
    headerHamMenuCloseBtn.classList.add('d-none');
  });
}

// ---
// Header Logo Click Logic
const headerLogoContainer = document.querySelector('.header__logo-container');

headerLogoContainer.addEventListener('click', () => {
  location.href = 'index.html';
});







// ---
// Game Logic
let secretWord;
let dotProductList = [];
let attemptHistory = [];

// Function to setup, loading JSON file and calculate distances
async function setup() {
  try {
    const response = await fetch('word_embeddings.json');

    if (!response.ok) {
      throw new Error('Failed to load JSON file');
    }

    const data = await response.json();

    // Accessing words and embeddings
    for (const word in data) {
      if (data.hasOwnProperty(word)) {
        const embedding = data[word];
        // Use word and embedding as needed in your code
        // console.log(`${word}: ${embedding}`);
      }
    }

    const words = Object.keys(data);
    const currentDate = new Date();
    const seed = currentDate.getDate();
    Math.seedrandom(seed);

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const randomIndex = getRandomInt(0, words.length - 1);
    secretWord = words[randomIndex];
    console.log('Here for the Secret Word?:', secretWord);

    const randomEmbedding = data[secretWord];
    
    words.forEach(word => {
      const embedding = data[word];
      const dotProduct = calculateDotProduct(randomEmbedding, embedding);
      dotProductList.push({ word, dotProduct });
    });

    dotProductList.sort((a, b) => b.dotProduct - a.dotProduct);

    const firstWordInList = dotProductList[0].word;
    //console.log('First Word in Sorted List:', firstWordInList);

    function calculateDotProduct(arr1, arr2) {
      return arr1.reduce((sum, value, index) => sum + value * arr2[index], 0);
    }
  } catch (error) {
    console.error('Error loading JSON file:', error.message);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  setup();
});

// Function to submit a guess
function submitGuess() {
  const guessInput = document.getElementById('guessInput');
  let guess = guessInput.value.toLowerCase();

  
  // Replace spaces with empty strings
  guess = guess.replace(/ /g, '');

  if (!/^[a-z0-9]+$/.test(guess)) {
    displayResult('Please enter a valid word');
    return;
  }

  const guessedWordIndex = dotProductList.findIndex(item => item.word === guess);

  if (guessedWordIndex !== -1) {
    const position = guessedWordIndex + 1;

    if (guess === secretWord) {
      displayResult(`Congratulations! You found the secret word. You get a secret access to my very personal instagram account https://www.instagram.com/yusk1111111/`);
    } else {
      displayResult(`Your word "${guess}" is at position ${position}. Keep guessing!`);
    }

    attemptHistory.push({ word: guess, position });
    attemptHistory.sort((a, b) => a.position - b.position);
  } else {
    displayResult(`Sorry, '${guess}' is not in this portfolio. Try again.`);
  }

  // Hide the "How to play" section
  hideHowToPlay();

  // Display attempt history
  displayAttemptHistory();

  // Clear the input field
  guessInput.value = '';
}

// Function to display the result
function displayResult(message) {
  document.getElementById('result').textContent = message;
}

// Function to display attempt history
function displayAttemptHistory() {
  const historyList = document.getElementById('attemptHistory');
  historyList.innerHTML = '';

  const maxDistance = dotProductList.length;

  attemptHistory.forEach(attempt => {
    const listItem = document.createElement('li');

    // Calculate the color based on the proximity to the secret word
    const proximity = attempt.position / maxDistance;
    const backgroundColor = getColorByProximity(proximity);

    listItem.innerHTML = `<span class="color-indicator"></span> <span class="word">${attempt.word}</span> <strong class="position">${attempt.position}</strong>`;
    listItem.style.background = `linear-gradient(to right, ${backgroundColor} ${(1- proximity) * 100}%, transparent ${proximity * 100}%)`;
    historyList.appendChild(listItem);
  });
}

// Function to calculate color based on proximity
function getColorByProximity(proximity) {
  const hue = (1 - proximity) * 120; // Map proximity to hue (green to red)
  return `hsl(${hue}, 100%, 50%)`;
}


// Function to hide the "How to play" section
function hideHowToPlay() {
  const howToPlaySection = document.getElementById('howToPlaySection');
  howToPlaySection.classList.add('hidden');
}

// Function to toggle the visibility of the "How to play" section
function toggleHowToPlay() {
  const howToPlaySection = document.getElementById('howToPlaySection');
  howToPlaySection.classList.toggle('hidden');
}


//typing animation
document.addEventListener("DOMContentLoaded", function () {
  function handleIntersection(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const words = entry.target.querySelectorAll("span");

        words.forEach((word, index) => {
          setTimeout(() => {
            word.classList.add("animate-typing");
          }, index * 150); // Adjust the delay between words as needed
        });

        observer.unobserve(entry.target);
      }
    });
  }

  const observer = new IntersectionObserver(handleIntersection, { threshold: 0.5 });

  const typingElements = document.querySelectorAll(".typing-animation");

  typingElements.forEach((element) => {
    observer.observe(element);
  });
});
