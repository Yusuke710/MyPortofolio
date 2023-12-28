# Contextofolio 🕵️‍♂️ 🎭

Want to engage people in reading your portfolio? Transform it into a word guessing game, similar to Contexto.

Introducing **Contextofolio**🔥🔥🔥

The primary concept is to uncover the secret word, akin to Contexto, by utilizing the words within your portfolio. The goal is to engage people in reading your portfolio.

## Contexto x Portfolio Template for Developers

What is in this repo? 🤔
- Simple Implementation of Contexto in Javascript
- Portfolio Template for Developper 

## [Demo](https://yusuke710.github.io/Contextofolio.github.io/index.html) 🔗


<div align="center">
  <video width="100%" autoplay loop muted playsinline>
    <source src="assets/contextofolio_demo.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <br>
</div>


<br/>
<br/>

---

<br/>


## How to Setup and Deploy

```bash
### Download the template
# Clone this repository
$ git clone https://github.com/Yusuke710/Contextofolio.github.io.git

# Go into the repository
$ cd Contextofolio.github.io

### design
# Customise your page(index.html, style.css) by following the section below. Check the layout and design using live server 

### Development Contexto for your Portfolio
# install request, bs4, openai
pip install requests, beautifulsoup4, openai

# export openai key(on Linux)
export export OPENAI_API_KEY='yourkey'

# encode words into vector embeddings
python word_embedding/text_embed.py

# Once again go to live server and check the functionality of Contexto is working

### Publish Online with github.io
# Push it to your repo
git remote set-url origin <your github repo>

# Follow github page setting to publish it. #Note: you need to setup external server if you want to use the email feature. There can be security risk placing formspree endpoint URL on github as people can access it)
https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
```

## Customisation 🔧

Please follow [Dopefolio](https://github.com/rammcodes/Dopefolio) github to make changes to index.html, style.css

## Author 👨‍💻

- **Yusuke Miyashita** - **[Linkedin](https://www.linkedin.com/in/yusuke-miyashita-79a3771a5/)**, **[Twitter](https://twitter.com/Yusuke06552418)**, **[Github](https://github.com/Yusuke710)**, **[Portfolio](https://yusuke710.github.io/Contextofolio.github.io/index.html)**  

## Credit

[Contexto](https://contexto.me/) <br>

[Dopefolio](https://github.com/rammcodes/Dopefolio)


## License 📄

This project is licensed under the  **GPL-3.0** License - see the [LICENSE](LICENSE) file for details

