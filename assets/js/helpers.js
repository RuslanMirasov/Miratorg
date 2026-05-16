const getDropzoneConstructor = () => {
  return typeof window !== 'undefined' ? window.Dropzone : undefined;
};

const disableDropzoneAutoDiscover = () => {
  const DropzoneConstructor = getDropzoneConstructor();

  if (DropzoneConstructor) {
    DropzoneConstructor.autoDiscover = false;
  }
};

disableDropzoneAutoDiscover();

export const initNavigationMenu = () => {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.navigation ');
  const menuLinks = document.querySelectorAll('.menu__link');

  const toggleMenu = () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
  };

  if (burger) burger.addEventListener('click', toggleMenu);
  menuLinks.forEach(link => link.addEventListener('click', toggleMenu));
};

export const initDropzones = () => {
  const dropzoneForms = document.querySelectorAll('[data-dropzone]');
  if (!dropzoneForms.length) return;

  const DropzoneConstructor = getDropzoneConstructor();

  if (!DropzoneConstructor) return;

  DropzoneConstructor.autoDiscover = false;

  dropzoneForms.forEach(el => {
    if (el.dropzone) return;

    const dropzone = new DropzoneConstructor(el, {
      url: el.getAttribute('action') || '#',
      autoProcessQueue: false,
      uploadMultiple: false,
      maxFiles: 1,
      thumbnailWidth: 315,
      thumbnailHeight: 200,
      addRemoveLinks: true,
      clickable: true,
      acceptedFiles: 'image/*',
      dictDefaultMessage: 'Перетащите фото чека или нажмите для выбора',
      dictRemoveFile: 'Удалить',
    });

    dropzone.on('maxfilesexceeded', function (file) {
      this.removeAllFiles();
      this.addFile(file);
    });
  });
};

export const initStyckyButton = () => {
  const styckyButton = document.querySelector('[data-stycky-button]');
  const scrollContainer = document.querySelector('.body');

  if (!styckyButton || !scrollContainer) return;

  let throttleTimeout = null;

  const updateButtonState = () => {
    const scrollTop = scrollContainer.scrollTop;
    const distanceToBottom = scrollContainer.scrollHeight - scrollContainer.clientHeight - scrollTop;

    styckyButton.classList.toggle('active', scrollTop > 100);
    styckyButton.classList.toggle('end', distanceToBottom <= 100);
  };

  const handleScroll = () => {
    if (throttleTimeout) return;

    throttleTimeout = setTimeout(() => {
      throttleTimeout = null;
      updateButtonState();
    }, 100);
  };

  updateButtonState();
  scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
};

export const hidePreloader = () => {
  const preloader = document.querySelector('[data-preloader]');
  const body = document.querySelector('.body');

  if (!preloader || !body) return;

  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 300);

  setTimeout(() => {
    body.classList.add('loaded');
  }, 400);

  setTimeout(() => {
    preloader.remove();
  }, 2000);
};
