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
  location.href = 'index.html#quiz';
});

//typing animation
document.addEventListener("DOMContentLoaded", function () {
  function handleIntersection(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const words = entry.target.querySelectorAll("span");

        words.forEach((word, index) => {
          setTimeout(() => {
            word.classList.add("animate-typing");
          }, index * 10); // Adjust the delay between words as needed
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


// ---
// Game Logic
let secretWord;
let dotProductList = [];
let attemptHistory = [];

// Function to setup, loading JSON file and calculate distances
async function setup_contextofolio() {
  try {
    const response = await fetch('word_embedding/word_embeddings.json');

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
    console.log('You think you can find the Secret Word here? You found it ->', secretWord);

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
  setup_contextofolio();
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

  const alreadyGuessed = attemptHistory.find(item => item.word === guess);

  if (alreadyGuessed) {
    displayResult(`You have already tried '${guess}'. It is in position ${alreadyGuessed.position}. Try again.`);
  }
  else{
    const guessedWordIndex = dotProductList.findIndex(item => item.word === guess);

    if (guessedWordIndex !== -1) {
      const position = guessedWordIndex + 1;

      if (guess === secretWord) {
        displayResult(`Congratulations! You found the secret word. You get a secret access to my very personal instagram account https://www.instagram.com/yusk1111111/`);
      } 
      else {
        displayResult(`Your word "${guess}" is at position ${position}. Keep guessing!`);
      }

      attemptHistory.push({ word: guess, position });
      attemptHistory.sort((a, b) => a.position - b.position);
    } 
    else {
      // spell check
      corrected_word = correction(guess)
            
      // if the guessed word is not close to any of the words in the portfolio
      if (guess==corrected_word) {
        displayResult(`Sorry, '${guess}' is not in this portfolio. Try again.`);
      }
      else {
        displayResult(`Cannot find '${guess}', did you mean '${corrected_word}'?`);
      }
    }
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
    listItem.style.background = `linear-gradient(to right, ${backgroundColor} ${(1- proximity) * 100}%, transparent ${proximity * 10}%)`;
    historyList.appendChild(listItem);
  });
}

// Function to calculate color based on proximity
function getColorByProximity(proximity) {
  const greenHue = 120; // Fixed hue for green
  const redHue = 0; // Fixed hue for red
  const darkGreenLightness = 30; // Lightness for darker green
  const lightness = darkGreenLightness + proximity * (70 - darkGreenLightness); // Adjust the lightness for the transition

  // Interpolate between green and red based on proximity
  const interpolatedHue = (1 - proximity) * greenHue + proximity * redHue;

  return `hsl(${interpolatedHue}, 100%, ${lightness}%)`;
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

function hint() {
  let hint;

  // If attemptHistory is empty, guess becomes the word in the middle of dotProductList
  if (attemptHistory.length === 0) {
    const middleIndex = Math.floor(dotProductList.length / 2);
    const middleWord = dotProductList[middleIndex].word;
    hint = middleWord;
  } else {
    // If attemptHistory has words, guess becomes the word with half of the best position value in the attemptHistory
    const bestAttempt = attemptHistory.reduce((prev, current) =>
      prev.position < current.position ? prev : current
    );

    const hintPosition = Math.floor(bestAttempt.position / 2);
    hint = dotProductList[hintPosition].word;
  }

  // Type hint into the guess input field
  const guessInput = document.getElementById('guessInput');
  guessInput.value = hint;

  // Then submit Guess 
  submitGuess();
}


// spell checker

let WORDS = {};

async function scrapeWords(htmlFilePath) {
  try {
      // Fetch the HTML content
      const response = await fetch(htmlFilePath);
      const htmlContent = await response.text();

      // Create a DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Extract text content from the HTML
      const textContent = doc.body.innerText;

      // Use regular expressions to find words (ignoring case)
      const words = textContent.toLowerCase().match(/\b\w+\b/g) || [];

      // Create a counter for words
      //const WORDS = {};
      words.forEach(word => {
          WORDS[word] = (WORDS[word] || 0) + 1;
      });
      //return WORDS;
  } catch (e) {
      console.error(`An error occurred: ${e}`);
      return null;
  }
}

const htmlFilePath = 'index.html';

document.addEventListener('DOMContentLoaded', function () {
  scrapeWords(htmlFilePath);
});

function P(word, N = Object.values(WORDS).reduce((a, b) => a + b, 0)) {
  // Probability of `word`
  return (WORDS[word] || 0) / N;
}

function correction(word) {
  // Most probable spelling correction for word. word needs to be an array for reduce to be applied
  return candidates(word).reduce((a, b) => P(a) > P(b) ? a : b);
}

function candidates(word) {
let knownWords = known(word);

if (knownWords.length > 0) {
    return knownWords;
}

knownWords = known(Array.from(edits1(word)));

if (knownWords.length > 0) {
    return knownWords;
}

knownWords = known(Array.from(edits2(word)));

if (knownWords.length > 0) {
    return knownWords;
}

return [word];
}


function known(words) {
// Wrap words in an array if it's not already one
if (!Array.isArray(words)) {
    words = [words]; // filter requires array[] but Array.from gives you the last letter not the whole word
}

// The subset of `words` that appear in the dictionary of WORDS
return words.filter(w => WORDS.hasOwnProperty(w));
}


function edits1(word) {
  // All edits that are one edit away from `word`
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const splits = [...Array(word.length + 1).keys()].map(i => [word.slice(0, i), word.slice(i)]);
  const deletes = splits.filter(([L, R]) => R).map(([L, R]) => L + R.slice(1));
  const transposes = splits.filter(([L, R]) => R.length > 1).map(([L, R]) => L + R[1] + R[0] + R.slice(2));
  const replaces = splits.filter(([L, R]) => R).flatMap(([L, R]) => letters.map(c => L + c + R.slice(1)));
  const inserts = splits.flatMap(([L, R]) => letters.map(c => L + c + R));
  return new Set([...deletes, ...transposes, ...replaces, ...inserts]);
}

function edits2(word) {
  // All edits that are two edits away from `word`
  const e1 = edits1(word);
  return [...e1].flatMap(e => [...edits1(e)]);
}

// Example usages to test
//console.log(WORDS);
//console.log(edits1('tha'));
//console.log(known('yusuke'));
//console.log(known(Array.from(edits1('tha'))));
//console.log(correction('liverpopool'));


// todo
// review correct function, put it under spell_correction dir
// create contexto dir and save it into its own js
// ensure the content is scalable