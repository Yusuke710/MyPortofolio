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
  
      // Footer
      document.getElementById('footer-description').innerText = content.footer.description;
  
      // Social links
      const socialContainer = document.querySelector('.main-footer__social-cont');
      socialContainer.innerHTML = '';
      content.footer.socialLinks.forEach(social => {
        const a = document.createElement('a');
        a.href = social.href;
        a.target = "_blank";
        a.rel = "noreferrer";
        a.classList.add('mr-3'); // Adding margin class for spacing
        a.innerHTML = `<img class="main-footer__icon" src="${social.iconSrc}" alt="icon" />`;
        socialContainer.appendChild(a);
      });
  
      // Publications Section
      const publicationsHeading = document.querySelector('#publications .heading-sec__main');
      const publicationsSubheading = document.querySelector('#publications .heading-sec__sub');
      if (publicationsHeading && publicationsSubheading) {
        publicationsHeading.innerText = content.publications.heading;
        publicationsSubheading.innerText = content.publications.subheading;
      }

      const createPublicationItem = (text, link, award) => {
      const li = document.createElement('li');
      li.classList.add('publications__item');
      if (link) {
        const a = document.createElement('a');
        a.href = link;
        a.textContent = text;
        a.target = "_blank";
        li.appendChild(a);
      } else {
        li.textContent = text;
      }

      if (award) {
        const awardSpan = document.createElement('span');
        awardSpan.classList.add('highlight-red');
        awardSpan.innerHTML = ` - ${award}`;
        li.appendChild(awardSpan);
      }

      
        return li;
      };
  
      if (document.querySelector('#conference-list')) {
        const conferenceList = document.querySelector('#conference-list');
        content.publications.conferences.forEach(pub => {
          conferenceList.appendChild(createPublicationItem(pub.title, pub.link, pub.award));
        });
      }
  
      if (document.querySelector('#invited-talk-list')) {
        const invitedTalkList = document.querySelector('#invited-talk-list');
        content.publications.invitedtalks.forEach(pub => {
          invitedTalkList.appendChild(createPublicationItem(pub.title, pub.link, pub.award));
        });
      }
  
      if (document.querySelector('#workshop-list')) {
        const workshopList = document.querySelector('#workshop-list');
        content.publications.workshops.forEach(pub => {
          workshopList.appendChild(createPublicationItem(pub.title, pub.link, pub.award));
        });
      }
  
    } catch (error) {
      console.error('Error loading content:', error);
    }
  }
  
  document.addEventListener('DOMContentLoaded', loadContent);
  