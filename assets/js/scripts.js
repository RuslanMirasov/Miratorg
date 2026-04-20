import { popup } from './popup.js';
import { initForms } from './forms.js';
import { initTimer } from './timer.js';

popup.init();
window.popup = popup;

initForms();
initTimer('01.06.2026 00:00:00', () => {
  console.log('Таймер истёк!');
});
