"""Spelling Corrector in Python 3; see http://norvig.com/spell-correct.html

Copyright (c) 2007-2016 Peter Norvig
MIT license: www.opensource.org/licenses/mit-license.php

modified by Yusuke Miyashita 16/06/2024 to fit contextofolio
"""

################ Spelling Corrector 

import re
import pickle
from collections import Counter

from bs4 import BeautifulSoup

# Save WORDS counter to a file
def save_words_counter(words_counter, filename='spell_correction/words_counter.pkl'):
    with open(filename, 'wb') as file:
        pickle.dump(words_counter, file)

# Load WORDS counter from a file
def load_words_counter(filename='spell_correction/words_counter.pkl'):
    try:
        with open(filename, 'rb') as file:
            return pickle.load(file)
    except FileNotFoundError:
        return None

# Scrape words from the website and create WORDS counter
def scrape_words(html_file_path):
    try:
        # Open and read the HTML file
        with open(html_file_path, 'r', encoding='utf-8') as file:
            html_content = file.read()

        # Create a BeautifulSoup object to parse the HTML
        soup = BeautifulSoup(html_content, 'html.parser')

        # Extract text content from the HTML
        text_content = soup.get_text()

        # Use regular expressions to find words (ignoring case)
        words = re.findall(r'\b\w+\b', text_content.lower())

        WORDS = Counter(words)
        #save_words_counter(WORDS)
        return WORDS

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

html_file_path = 'index.html'

WORDS = scrape_words(html_file_path)

def P(word, N=sum(WORDS.values())): 
    "Probability of `word`."
    return WORDS[word] / N

def correction(word): 
    "Most probable spelling correction for word."
    return max(candidates(word), key=P)

def candidates(word): 
    "Generate possible spelling corrections for word."
    return (known([word]) or known(edits1(word)) or known(edits2(word)) or [word])

def known(words, WORDS = WORDS): 
    "The subset of `words` that appear in the dictionary of WORDS."
    return set(w for w in words if w in WORDS)

def edits1(word):
    "All edits that are one edit away from `word`."
    letters    = 'abcdefghijklmnopqrstuvwxyz'
    splits     = [(word[:i], word[i:])    for i in range(len(word) + 1)]
    deletes    = [L + R[1:]               for L, R in splits if R]
    transposes = [L + R[1] + R[0] + R[2:] for L, R in splits if len(R)>1]
    replaces   = [L + c + R[1:]           for L, R in splits if R for c in letters]
    inserts    = [L + c + R               for L, R in splits for c in letters]
    return set(deletes + transposes + replaces + inserts)

def edits2(word): 
    "All edits that are two edits away from `word`."
    return (e2 for e1 in edits1(word) for e2 in edits1(e1))


if __name__ == '__main__':
    word = 'liverpoool'
    corrected_word = correction(word)
    print(f'Corrected words: {corrected_word}')
    #print(unit_tests())
    #spelltest(Testset(open('spell-testset1.txt')))
    #spelltest(Testset(open('spell-testset2.txt')))
