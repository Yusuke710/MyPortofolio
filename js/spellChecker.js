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
    words.forEach(word => {
      WORDS[word] = (WORDS[word] || 0) + 1;
    });
  } catch (e) {
    console.error(`An error occurred: ${e}`);
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
    words = [words];
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
