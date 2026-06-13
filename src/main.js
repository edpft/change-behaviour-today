const toggleNavigation = (navigationButton, navigationMenu) => {
  navigationMenu.classList.toggle('c-navigation__items--open');
  const expanded =
    navigationButton.getAttribute('aria-expanded') === 'true' || false;
  navigationButton.setAttribute('aria-expanded', !expanded);
  navigationButton.classList.toggle('c-hamburger--open');
};

const navigationButton = document.getElementById('navigationButton');
const navigationMenu = document.getElementById('navigationMenu');
const navigationLinks = document.getElementsByClassName('c-navigation__link');

const initialiseHamburger = () => {
  navigationButton.addEventListener('click', () => {
    toggleNavigation(navigationButton, navigationMenu);
  });
};

const initialiseNavigationLinks = () => {
  Array.prototype.forEach.call(navigationLinks, (navigationLink) => {
    navigationLink.addEventListener('click', () => {
      toggleNavigation(navigationButton, navigationMenu);
    });
  });
};

initialiseHamburger();
initialiseNavigationLinks();

window.addEventListener('load', () => {
  const script = document.createElement('script');
  script.src =
    'https://identity.netlify.com/v1/netlify-identity-widget.js';
  script.onload = () => {
    window.netlifyIdentity.on('init', (user) => {
      if (!user) {
        window.netlifyIdentity.on('login', () => {
          document.location.href = '/admin/';
        });
      }
    });
  };
  document.head.appendChild(script);
});
