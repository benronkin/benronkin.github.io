/* global console document Event fetch FormData Headers M Request setTimeout URLSearchParams window */

const homepageH1 = document.querySelector('#home-h1-div');
if (homepageH1) {
  homepageH1.querySelector('#home-h1-div h1').innerText = `Portfolio (${
    document.querySelectorAll('portfolio-card').length
  })`;
}

document.querySelectorAll('.info-question').forEach((s) =>
  s.addEventListener('click', function () {
    const t = this.querySelector('.toggle');
    t.innerText = t.innerText == '–' ? '+' : '–';
    const q = this.querySelector('.info-question-span');
    q.style['font-weight'] = q.style['font-weight'] == 700 ? 300 : 700;
    this.closest('div').nextElementSibling.classList.toggle('hide');
  })
);

const handleContactSubmit = (e) => {
  e.preventDefault();
  const formEl = e.target;
  const formData = new FormData(formEl);

  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  if (!name || !email || !message) {
    document.querySelector('#alert').classList.remove('hidden');
    return false;
  }

  document.querySelector('#contact-submit').disabled = true;

  const url =
    'https://script.google.com/macros/s/AKfycbzf_XjU6hRiLN8v_HPo9-_3iiBV2lxDOfydW48irVE7QUmKcZqr43iT0SlNEkdz6H0/exec';
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const req = new Request(url, {
    method: 'POST',
    mode: 'no-cors',
    headers,
    body: JSON.stringify([new Date(), name, email, message]),
  });

  fetch(req)
    .then(() => {
      document.querySelector('#contact-form').classList.add('hidden');
      document.querySelector(
        '.message'
      ).innerText = `Your message was recorded successfully. I'll reply shortly.`;
    })
    .catch((err) => console.log(err));
};

const handleSelect = () => {
  const userSelection = document.querySelector('#case-filter').value;
  const cards = document.querySelectorAll('portfolio-card');
  if (userSelection == 'all') {
    cards.forEach((card) => card.classList.remove('hide'));
    return;
  }
  cards.forEach((card) => card.classList.add('hide'));
  document
    .querySelectorAll(
      `portfolio-card[data-topics*="${userSelection.toLowerCase()}"]`
    )
    .forEach((elem) => elem.classList.remove('hide'));
};

/**
 * Logs a list of URLs for a given topic
 */
// eslint-disable-next-line no-unused-vars
function showUrlsByTopic(topic) {
  const allCards = document.querySelectorAll('portfolio-card');
  console.log(
    '\u001b[' +
      31 +
      'm' +
      `Remember to update sitemap.txt by running this function without an argument.` +
      '\u001b[0m'
  );
  console.log(`Total case studies: ${allCards.length}`);
  const cards = topic
    ? document.querySelectorAll(
        `portfolio-card[data-topics*="${topic.toLowerCase()}"]`
      )
    : allCards;

  if (cards.length === 0) {
    console.log(`No cards found containing ${topic}`);
    return;
  }
  cards.forEach((card) => {
    const url = card.getAttribute('data-url');
    // log to console w/o file/line no. on the right
    // for easy copy/paste
    setTimeout(
      console.log.bind(console, `https://${window.location.hostname}/${url}`)
    );
  });
}

// this is for query param
const toggleSelect = (value) => {
  const caseFilter = document.querySelector('#case-filter');
  const isValidValue = Array.from(caseFilter.options)
    .filter((option) => option.attributes)
    .map((option) => option.attributes.value.nodeValue.toLowerCase())
    .some((option) => option.includes(value));
  if (!isValidValue) {
    return;
  }
  caseFilter.value = value;
  M.FormSelect.init(caseFilter, {});
  // in some cases, this is also required:
  caseFilter.dispatchEvent(new Event('change'));
};

function displayCookieBanner() {
  const cookieBanner = document.createElement('div');
  cookieBanner.classList.add('cookie-choice');
  const container = document.createElement('div');
  container.classList.add('container');
  const buttons = document.createElement('div');
  buttons.classList.add('cookie-buttons');
  const ok = document.createElement('a');
  ok.setAttribute('id', 'cookie-ok');
  ok.setAttribute('href', '');
  ok.innerText = 'OK';
  const learnMore = document.createElement('a');
  learnMore.setAttribute(
    'href',
    'https://policies.google.com/technologies/cookies'
  );
  learnMore.setAttribute('target', 'blank_');
  learnMore.innerText = 'Learn more';

  const message = document.createTextNode(
    `This site uses cookies from Google to deliver its services and to analyze traffic. Your IP address and user-agent are shared with Google along with performance and security metrics to ensure quality of service, generate usage statistics, and to detect and address abuse.`
  );
  buttons.appendChild(learnMore);
  buttons.appendChild(ok);
  container.appendChild(message);
  container.appendChild(buttons);
  cookieBanner.appendChild(container);
  const main = document.querySelector('main');
  document.body.insertBefore(cookieBanner, main);

  document.querySelector('#cookie-ok').addEventListener('click', function (e) {
    e.preventDefault();
    document.cookie =
      'BenRonkinCookie=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; Secure';
    document.querySelector('.cookie-choice').hidden = true;
  });
}

const ready = () => {
  // Mobile sidenav
  const elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems, {});
  // Contact form
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
  // Portfolio filter
  const selectors = document.querySelectorAll('select');
  if (selectors) {
    M.FormSelect.init(selectors, {});
    selectors.forEach((selector) =>
      selector.addEventListener('change', handleSelect)
    );
  }
  // Query param for portfolio filter
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('p')) {
    toggleSelect(searchParams.get('p'));
  } else {
  }
  // Cookies banner
  if (document.cookie.indexOf('BenRonkinCookie') == -1) {
    displayCookieBanner();
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}
