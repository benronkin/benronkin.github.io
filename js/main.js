const handleContactSubmit = (e) => {
  e.preventDefault();
  const formEl = document.forms[0];
  const formData = new FormData(formEl);

  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  if (!name || !email || !message) {
    document.querySelector('#alert').classList.remove('hidden');
    return false;
  }

  const url =
    'https://script.google.com/macros/s/AKfycbwRQpnZjqbIFLP1BYOPcQ5z0fvPdzAZ8Za8rRYKWQKYxCGxX-6p/exec';
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
      console.log('posted');
      document.querySelector('#contact-form').classList.add('hidden');
      document.querySelector(
        '.lead'
      ).innerText = `Thank you! I'll be in touch soon.`;
    })
    .catch((err) => console.log(err));
};

const ready = () => {
  console.log('ready');
  const contactSubmit = document.querySelector('#contact-submit');
  if (contactSubmit) {
    contactSubmit.addEventListener('click', handleContactSubmit);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}
