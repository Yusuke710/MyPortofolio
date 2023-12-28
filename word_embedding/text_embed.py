from bs4 import BeautifulSoup
import re
import json

import numpy as np  # Assuming you're using a library like NumPy for vector operations
from openai import OpenAI

def scrape_and_embed_words(html_file_path):
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

        # Create a set to store unique words
        unique_words = set(words)

        # Placeholder for word embeddings (replace this with your actual encoding logic)
        # Assuming you have a function get_word_embedding(word) that returns the embedding for a word
        word_embeddings = {word: get_word_embedding(word) for word in unique_words}

        return word_embeddings

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def normalize_vector(vector):
    magnitude = np.linalg.norm(vector)
    if magnitude > 0:
        return vector / magnitude
    else:
        return vector
    
def get_word_embedding(word):
    embedding = client.embeddings.create(input = [word], model="text-embedding-ada-002").data[0].embedding
    #embedding = np.random.rand(300)  # Example: Generating a random vector of length 300

    # Normalize the vector
    normalized_embedding = normalize_vector(embedding)

    return normalized_embedding

def save_word_embeddings_to_file(word_embeddings, output_file):
    try:
        # Convert NumPy arrays to Python lists before saving to JSON
        word_embeddings_serializable = {word: emb.tolist() for word, emb in word_embeddings.items()}

        with open(output_file, 'w', encoding='utf-8') as json_file:
            json.dump(word_embeddings_serializable, json_file, ensure_ascii=False, indent=4)
        print(f"Word embeddings saved to {output_file}")
    except Exception as e:
        print(f"An error occurred while saving word embeddings: {e}")

# Example usage
html_file_path = 'index.html'
output_file_path = 'word_embedding/word_embeddings.json'
client = OpenAI()
word_embeddings = scrape_and_embed_words(html_file_path)

if word_embeddings is not None:
    save_word_embeddings_to_file(word_embeddings, output_file_path)