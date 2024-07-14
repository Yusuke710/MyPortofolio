async function loadContent() {
  try {
    const response = await fetch('content.yaml');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const yamlText = await response.text();
    const content = jsyaml.load(yamlText);

    // Inject content into HTML
    document.title = content.title;
    document.querySelector('meta[name="description"]').setAttribute('content', content.description);

    // Header links
    const headerLinks = document.querySelector('.header__links');
    headerLinks.innerHTML = '';
    content.header.links.forEach(link => {
      const li = document.createElement('li');
      li.classList.add('header__link-wrapper');
      li.innerHTML = `<a href="${link.href}" class="header__link">${link.text}</a>`;
      headerLinks.appendChild(li);
    });

    // Quiz Section
    document.getElementById('quiz-main-heading').innerText = content.quiz.mainHeading;
    document.getElementById('howToPlayText').innerText = content.quiz.howToPlay;

    // About Section
    document.querySelector('#about .heading-sec__main').innerText = content.about.mainHeading;
    document.querySelector('#about .heading-sec__sub').innerText = content.about.subHeading;
    document.querySelector('#about .about__content-details-para').innerText = content.about.content;

    // About Image
    const aboutImage = document.querySelector('#about .about__content-image');
    aboutImage.src = content.about.image.src;
    aboutImage.alt = content.about.image.alt;

    // Projects Section
    const projectsContainer = document.createElement('div');
    projectsContainer.innerHTML = `
      <section id="projects" class="projects sec-pad">
        <div class="container">
          <h2 class="heading heading-sec heading-sec__mb-med">
            <span class="heading-sec__main">Projects</span>
            <span class="heading-sec__sub">Explore my work and contributions</span>
          </h2>
        </div>
      </section>
    `;
    content.projects.forEach(project => {
      const projectSection = document.createElement('section');
      projectSection.id = project.sectionID;
      projectSection.classList.add('projects', 'sec-pad', project.sectionClass);
      projectSection.innerHTML = `
        <div class="main-container">
          <div class="projects__content">
            <div class="projects__row">
              <div class="projects__row-img-cont">
                <img src="${project.imgSrc}" alt="${project.imgAlt}" class="projects__row-img" loading="lazy" />
              </div>
              <div class="projects__row-content">
                <h3 class="projects__row-content-title">${project.title}</h3>
                <p class="projects__row-content-desc ">${project.description}</p>
                <a href="${project.link.href}" class="btn btn--med btn--theme dynamicBgClr" target="_blank">${project.link.text}</a>
              </div>
            </div>
          </div>
        </div>
      `;
      projectsContainer.appendChild(projectSection);
    });

    // Insert projects container before the quiz section
    document.querySelector('#quiz').insertAdjacentElement('beforebegin', projectsContainer);

    // Footer
    document.getElementById('footer-description').innerText = content.footer.description;

    // Social links
    const socialContainer = document.querySelector('.home-hero__socials');
    socialContainer.innerHTML = '';
    content.footer.socialLinks.forEach(social => {
      const div = document.createElement('div');
      div.classList.add('home-hero__social');
      div.innerHTML = `
        <a href="${social.href}" class="home-hero__social-icon-link">
          <img src="${social.iconSrc}" alt="icon" class="home-hero__social-icon" />
        </a>
      `;
      socialContainer.appendChild(div);
    });

  } catch (error) {
    console.error('Error loading content:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadContent);
