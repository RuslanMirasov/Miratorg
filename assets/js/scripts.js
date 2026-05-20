import { popup } from './modules/popup.js';
import { initScrollManager } from './modules/scrollManager.js';
import { initDecimalInputs, initForms, initPhoneInputs, initSelectFields } from './modules/forms.js';
import { initNavigationMenu, initDropzones, initStyckyButton, hidePreloader } from './modules/helpers.js';
import { initSliders } from './modules/sliders.js';
import { initTabsSliderNavigation } from './modules/goToSlide.js';
import { initTimer } from './modules/timer.js';
import { initTabs } from './modules/tabs.js';
import { initAccordeons } from './modules/accordeon.js';
import { initProducts } from './modules/products.js';
//import { initWordsGame } from './modules/words-game.js';

popup.init();
window.popup = popup;

initTimer('01.06.2026 00:00:00', () => {
  console.log('Таймер истёк!');
});

document.addEventListener('DOMContentLoaded', () => {
  hidePreloader();
  initSliders();
  initTabsSliderNavigation('prizes-tabs');
  initForms();
  initNavigationMenu();
  initStyckyButton();
  initTabs();
  initAccordeons();
  initPhoneInputs('+7 000 000 00 00');
  initSelectFields();
  initDecimalInputs();
  initDropzones();
  initScrollManager();
  initProducts();
  //initWordsGame();
});
