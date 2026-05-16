import { popup } from './popup.js';
import { initScrollManager } from './scrollManager.js';
import { initDecimalInputs, initForms, initPhoneInputs, initSelectFields } from './forms.js';
import { initNavigationMenu, initDropzones, initStyckyButton } from './helpers.js';
import { initSliders } from './sliders.js';
import { initTabsSliderNavigation } from './goToSlide.js';
import { initTimer } from './timer.js';
import { initTabs } from './tabs.js';
import { initAccordeons } from './accordeon.js';

popup.init();
window.popup = popup;

initTimer('01.06.2026 00:00:00', () => {
  console.log('Таймер истёк!');
});

document.addEventListener('DOMContentLoaded', () => {
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
});
