import { initForms } from './forms.js';
import { initTimer } from './timer.js';

initForms();
initTimer('01.06.2026 00:00:00', () => {
  console.log('Таймер истёк!');
});
