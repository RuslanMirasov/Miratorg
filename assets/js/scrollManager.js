export const initScrollManager = () => {
  const scroller = document.querySelector('.body');
  if (!scroller) return;

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const storageKey = `joy-colony:scroll:${window.location.pathname}${window.location.search}`;
  let saveRafId = 0;

  const getHashTarget = hash => {
    const id = decodeURIComponent(String(hash || '').replace(/^#/, ''));
    if (!id) return null;

    return document.getElementById(id);
  };

  const getTargetTop = target => {
    const scrollerRect = scroller.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    return targetRect.top - scrollerRect.top + scroller.scrollTop;
  };

  const scrollToTarget = target => {
    let attempts = 0;
    const maxAttempts = 12;

    const tryScroll = () => {
      const maxTop = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      const top = Math.min(Math.max(0, getTargetTop(target)), maxTop);

      scroller.scrollTop = top;

      attempts += 1;
      if (attempts < maxAttempts) {
        requestAnimationFrame(tryScroll);
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(tryScroll);
    });
  };

  const scrollToHash = hash => {
    const target = getHashTarget(hash);
    if (!target) return false;

    scrollToTarget(target);
    return true;
  };

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
    if (window.location.hash) {
      scrollToHash(window.location.hash);
      return;
    }

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
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    if (!scrollToHash(hash)) return;

    event.preventDefault();
    history.pushState(null, '', hash);
  });
  window.addEventListener('hashchange', () => {
    scrollToHash(window.location.hash);
  });
  window.addEventListener('pagehide', saveScrollTop);
  restoreScrollTop();
};
