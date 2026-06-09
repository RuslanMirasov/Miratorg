const PRODUCTS_JSON_URL = './assets/json/products.json';
const PRODUCTS_JSON_PROMO_URL = './assets/json/products_promo.json';
const PRODUCTS_IMAGE_PATH = './assets/img/products';
const ALL_VALUE = 'all';
const DEFAULT_PAGE = 1;
const PRODUCTS_PER_PAGE = 20;
const MAX_PAGINATION_BUTTONS = 6;

const escapeHTML = value => {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
};

const getProductImage = id => `${PRODUCTS_IMAGE_PATH}/${id}.webp`;
const getEmptyImage = () => `${PRODUCTS_IMAGE_PATH}/empty.webp`;

const renderProduct = product => {
  const id = escapeHTML(product.id);
  const name = escapeHTML(product.name);
  const weight = escapeHTML(product.weight);

  return `
    <li>
      <article class="product">
        <div class="product__image">
          <img
            src="${getProductImage(id)}"
            alt="${name}"
            loading="lazy"
            onerror="this.onerror=null;this.src='${getEmptyImage()}';"
          />
        </div>
        <h2>${name}</h2>
        <!--<span class="product__weight">${weight}</span>-->
      </article>
    </li>
  `;
};

const renderProducts = (productsList, products) => {
  productsList.innerHTML = products.map(renderProduct).join('');
};

const getPaginatedProducts = (products, page) => {
  const start = (page - 1) * PRODUCTS_PER_PAGE;

  return products.slice(start, start + PRODUCTS_PER_PAGE);
};

const getUniqueValues = values => {
  return [...new Set(values)];
};

const getProductCategories = products => {
  return getUniqueValues(products.flatMap(product => product.category || []));
};

const getProductSegments = products => {
  return getUniqueValues(products.flatMap(product => product.segment || [])).sort((a, b) => a.localeCompare(b, 'ru'));
};

const getURLParams = () => {
  const params = new URLSearchParams(window.location.search);
  const page = Number(params.get('page')) || DEFAULT_PAGE;

  return {
    category: params.get('category') || ALL_VALUE,
    segment: params.get('segment') || ALL_VALUE,
    page: page > 0 ? page : DEFAULT_PAGE,
  };
};

const setURLParams = nextParams => {
  const currentParams = getURLParams();
  const params = new URLSearchParams();
  const category = nextParams.category || currentParams.category;
  const segment = nextParams.segment || currentParams.segment;
  const page = nextParams.page || currentParams.page;

  if (category !== ALL_VALUE) params.set('category', category);
  if (segment !== ALL_VALUE) params.set('segment', segment);
  if (page !== DEFAULT_PAGE) params.set('page', page);

  const query = params.toString();
  const url = query ? `${window.location.pathname}?${query}${window.location.hash}` : `${window.location.pathname}${window.location.hash}`;

  window.history.pushState({}, '', url);
};

const getPaginationPages = (currentPage, totalPages) => {
  if (totalPages <= MAX_PAGINATION_BUTTONS) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const maxStart = totalPages - MAX_PAGINATION_BUTTONS + 1;
  const middleOffset = Math.floor(MAX_PAGINATION_BUTTONS / 2);
  const start = Math.min(Math.max(currentPage - middleOffset, 1), maxStart);

  return Array.from({ length: MAX_PAGINATION_BUTTONS }, (_, index) => start + index);
};

const setActiveLink = (wrapper, selector, activeValue) => {
  if (!wrapper) return;

  wrapper.querySelectorAll(selector).forEach(link => {
    link.classList.toggle('active', link.dataset.category === activeValue || link.dataset.segment === activeValue);
  });
};

const getProductsByCategory = (products, category) => {
  if (category === ALL_VALUE) return products;

  return products.filter(product => product.category?.includes(category));
};

const getFilteredProducts = (products, params) => {
  const categoryProducts = getProductsByCategory(products, params.category);

  if (params.segment === ALL_VALUE) return categoryProducts;

  return categoryProducts.filter(product => product.segment?.includes(params.segment));
};

const renderCategorys = (categorysEl, categories) => {
  if (!categorysEl) return;

  const allCategory = '<li><a data-category="all" class="active">Все</a></li>';
  const categoryItems = categories
    .map(category => {
      const value = escapeHTML(category);

      return `<li><a data-category="${value}">${value}</a></li>`;
    })
    .join('');

  categorysEl.innerHTML = `${allCategory}${categoryItems}`;
};

const renderSegments = (segmentsEl, segments) => {
  if (!segmentsEl) return;

  const allSegment = '<li><a data-segment="all" class="active">Все</a></li>';
  const segmentItems = segments
    .map(segment => {
      const value = escapeHTML(segment);

      return `<li><a data-segment="${value}">${value}</a></li>`;
    })
    .join('');

  segmentsEl.innerHTML = `${allSegment}${segmentItems}`;
};

const renderPagination = (paginationEl, currentPage, totalPages) => {
  if (!paginationEl) return;

  if (totalPages <= 1) {
    paginationEl.innerHTML = '';
    return;
  }

  const pages = getPaginationPages(currentPage, totalPages);
  const pageItems = pages
    .map(page => {
      const activeClass = page === currentPage ? ' active' : '';

      return `<li><a href="#products" class="pagination-btn${activeClass}" data-page="${page}">${page}</a></li>`;
    })
    .join('');

  paginationEl.innerHTML = `
    <li>
      <a href="#products" class="pagination-btn prev${currentPage === 1 ? ' disabled' : ''}" data-page-prev aria-disabled="${currentPage === 1}">
        <img src="./assets/img/svg/prev.svg" alt="" />
      </a>
    </li>
    ${pageItems}
    <li>
      <a href="#products" class="pagination-btn next${currentPage === totalPages ? ' disabled' : ''}" data-page-next aria-disabled="${currentPage === totalPages}">
        <img src="./assets/img/svg/next.svg" alt="" />
      </a>
    </li>
  `;
};

const getSafePage = (page, totalPages) => {
  if (totalPages < 1) return DEFAULT_PAGE;

  return Math.min(Math.max(page, DEFAULT_PAGE), totalPages);
};

const getProductsURL = productsList => {
  if (productsList.dataset.productsSource === 'promo') return PRODUCTS_JSON_PROMO_URL;

  return PRODUCTS_JSON_URL;
};

const renderFromURL = ({ products, productsList, categorysEl, segmentsEl, paginationEl }) => {
  const params = getURLParams();
  const activeCategory = categorysEl ? params.category : ALL_VALUE;
  const categoryProducts = getProductsByCategory(products, activeCategory);
  const segments = segmentsEl ? getProductSegments(categoryProducts) : [];
  const activeSegment = segmentsEl && (params.segment === ALL_VALUE || segments.includes(params.segment)) ? params.segment : ALL_VALUE;

  if (segmentsEl && activeSegment !== params.segment) {
    setURLParams({ ...params, segment: ALL_VALUE, page: DEFAULT_PAGE });
    return renderFromURL({ products, productsList, categorysEl, segmentsEl, paginationEl });
  }

  const filteredProducts = getFilteredProducts(products, { category: activeCategory, segment: activeSegment });
  const totalPages = paginationEl ? Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) : 1;
  const currentPage = paginationEl ? getSafePage(params.page, totalPages) : DEFAULT_PAGE;

  if (paginationEl && currentPage !== params.page) {
    setURLParams({ ...params, page: currentPage });
    return renderFromURL({ products, productsList, categorysEl, segmentsEl, paginationEl });
  }

  renderSegments(segmentsEl, segments);
  renderProducts(productsList, paginationEl ? getPaginatedProducts(filteredProducts, currentPage) : filteredProducts);
  renderPagination(paginationEl, currentPage, totalPages);
  setActiveLink(categorysEl, '[data-category]', activeCategory);
  setActiveLink(segmentsEl, '[data-segment]', activeSegment);
};

const initCategorys = options => {
  const { categorysEl } = options;

  if (!categorysEl) return;

  categorysEl.addEventListener('click', e => {
    const link = e.target.closest('[data-category]');

    if (!link || !categorysEl.contains(link)) return;

    e.preventDefault();
    setURLParams({ category: link.dataset.category, segment: ALL_VALUE, page: DEFAULT_PAGE });
    renderFromURL(options);
  });
};

const initSegments = options => {
  const { segmentsEl } = options;

  if (!segmentsEl) return;

  segmentsEl.addEventListener('click', e => {
    const link = e.target.closest('[data-segment]');

    if (!link || !segmentsEl.contains(link)) return;

    e.preventDefault();
    setURLParams({ segment: link.dataset.segment, page: DEFAULT_PAGE });
    renderFromURL(options);
  });
};

const initPagination = options => {
  const { paginationEl } = options;

  if (!paginationEl) return;

  paginationEl.addEventListener('click', e => {
    const pageLink = e.target.closest('[data-page]');
    const prevButton = e.target.closest('[data-page-prev]');
    const nextButton = e.target.closest('[data-page-next]');
    const params = getURLParams();

    if (pageLink) {
      setURLParams({ page: Number(pageLink.dataset.page) });
      renderFromURL(options);
      return;
    }

    if (prevButton || nextButton) {
      if (e.target.closest('a')?.getAttribute('aria-disabled') === 'true') {
        e.preventDefault();
        return;
      }

      setURLParams({ page: params.page + (nextButton ? 1 : -1) });
      renderFromURL(options);
    }
  });
};

const loadProducts = async url => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Products loading failed: ${response.status}`);
  }

  return response.json();
};

export const initProducts = async () => {
  const productsList = document.querySelector('[data-products-list]');
  const categorysEl = document.querySelector('[data-product-categorys]');
  const segmentsEl = document.querySelector('[data-product-segments]');
  const paginationEl = document.querySelector('.pagination');

  if (!productsList) return;

  try {
    const productsURL = getProductsURL(productsList);
    const products = await loadProducts(productsURL);
    const renderOptions = { products, productsList, categorysEl, segmentsEl, paginationEl };

    renderCategorys(categorysEl, getProductCategories(products));
    renderFromURL(renderOptions);
    initCategorys(renderOptions);
    initSegments(renderOptions);
    initPagination(renderOptions);
    window.addEventListener('popstate', () => renderFromURL(renderOptions));

    console.log(`Products loaded: ${products.length}`);
  } catch (error) {
    console.error(error);
  }
};
