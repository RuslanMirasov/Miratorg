export const initTimer = (time, callback) => {
  const timerEl = document.querySelector('[data-timer]');

  if (!timerEl) return;

  const daysEl = timerEl.querySelector('[data-timer-days]');
  const hoursEl = timerEl.querySelector('[data-timer-hours]');
  const minutesEl = timerEl.querySelector('[data-timer-minutes]');
  const secondsEl = timerEl.querySelector('[data-timer-seconds]');

  const parseDate = dateString => {
    const [datePart, timePart = '00:00:00'] = dateString.trim().split(' ');
    const [day, month, year] = datePart.split('.').map(Number);
    const [hours = 0, minutes = 0, seconds = 0] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  const pad = value => String(value).padStart(2, '0');

  const setText = (element, value) => {
    if (element) {
      element.textContent = value;
    }
  };

  const endDate = parseDate(time);

  if (Number.isNaN(endDate.getTime())) {
    console.error('Неверный формат даты. Используй: DD.MM.YYYY HH:mm:ss');
    return;
  }

  let isFinished = false;
  let intervalId;

  const updateTimer = () => {
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) {
      clearInterval(intervalId);

      setText(daysEl, '00');
      setText(hoursEl, '00');
      setText(minutesEl, '00');
      setText(secondsEl, '00');

      if (!isFinished && typeof callback === 'function') {
        isFinished = true;
        callback();
      }

      return;
    }

    const totalSeconds = Math.floor(diff / 1000);

    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    setText(daysEl, pad(days));
    setText(hoursEl, pad(hours));
    setText(minutesEl, pad(minutes));
    setText(secondsEl, pad(seconds));
  };

  updateTimer();
  intervalId = setInterval(updateTimer, 1000);
};
