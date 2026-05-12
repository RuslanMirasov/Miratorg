import { popup } from './popup.js';
import { initScrollManager } from './scrollManager.js';
import { initDecimalInputs, initForms, initPhoneInputs } from './forms.js';
import { initTimer } from './timer.js';
import { initNavigationMenu, initDropzones } from './helpers.js';
import { initTabs } from './tabs.js';

popup.init();
window.popup = popup;

initTimer('01.06.2026 00:00:00', () => {
  console.log('Таймер истёк!');
});

document.addEventListener('DOMContentLoaded', () => {
  initScrollManager();
  initForms();
  initNavigationMenu();
  initTabs();
  initPhoneInputs('+7 000 000-00-00');
  initDecimalInputs();
  initDropzones();
});
