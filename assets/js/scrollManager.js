export const initScrollManager = () => {
  const scroller = document.querySelector('.body');
  if (!scroller) return;

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const storageKey = `joy-colony:scroll:${window.location.pathname}${window.location.search}`;
  let saveRafId = 0;

  const getSavedTop = () => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved === null) return null;

    const top = Number(saved);
    return Number.isFinite(top) && top >= 0 ? top : null;
  };

  const saveScrollTop = () => {
    saveRafId = 0;
    sessionStorage.setItem(storageKey, String(scroller.scrollTop));
  };

  const requestSaveScrollTop = () => {
    if (!saveRafId) saveRafId = requestAnimationFrame(saveScrollTop);
  };

  const restoreScrollTop = () => {
    if (window.location.hash) return;

    const savedTop = getSavedTop();
    if (savedTop === null) return;

    let attempts = 0;
    const maxAttempts = 12;

    const tryRestore = () => {
      const maxTop = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      scroller.scrollTop = Math.min(savedTop, maxTop);

      attempts += 1;
      if (scroller.scrollTop < savedTop && attempts < maxAttempts) {
        requestAnimationFrame(tryRestore);
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(tryRestore);
    });
  };

  scroller.addEventListener('scroll', requestSaveScrollTop, { passive: true });
  window.addEventListener('pagehide', saveScrollTop);
  restoreScrollTop();
};
