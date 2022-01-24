const handleContactSubmit = (e) => {
  e.preventDefault();
  const formEl = e.target;
  const formData = new FormData(formEl);

  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  if (!name || !email || !message) {
    document.querySelector("#alert").classList.remove("hidden");
    return false;
  }

  document.querySelector("#contact-submit").disabled = true;

  const url =
    "https://script.google.com/macros/s/AKfycbwRQpnZjqbIFLP1BYOPcQ5z0fvPdzAZ8Za8rRYKWQKYxCGxX-6p/exec";
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const req = new Request(url, {
    method: "POST",
    mode: "no-cors",
    headers,
    body: JSON.stringify([new Date(), name, email, message]),
  });

  fetch(req)
    .then(() => {
      document.querySelector("#contact-form").classList.add("hidden");
      document.querySelector(
        ".lead"
      ).innerText = `Your message was recorded successfully. I'll be in touch soon.`;
    })
    .catch((err) => console.log(err));
};

const handleSelect = (e) => {
  const instance = M.FormSelect.getInstance($("#type-filter"));

  document
    .querySelectorAll("portfolio-card")
    .forEach((portfolioCard) => portfolioCard.classList.add("hide"));

  instance.getSelectedValues().forEach((value) => {
    // Materialize doesn't seem to like multi-token option values
    // (e.g 'Google Workspace'), so the filter now includes a single
    // token (Workspace, Cloud, Other), so we need to add 'Google' back in
    if (value !== "Other") {
      value = `Google ${value}`;
    }

    document
      .querySelectorAll(`portfolio-card[subtitle="${value}"]`)
      .forEach((elem) => elem.classList.remove("hide"));
  });
};

/**
 * Logs a list of URLs for a given topic
 */
function showUrlsByTopic(topic) {
  const cards = document.querySelectorAll(
    `portfolio-card[data-topics*="${topic.toLowerCase()}"]`
  );
  if (cards.length === 0) {
    console.log(`No cards found containing ${topic}`);
    return;
  }
  cards.forEach((card) => {
    const url = card.getAttribute("data-url");
    // log to console w/o file/line no. on the right
    // for easy copy/paste
    setTimeout(
      console.log.bind(console, `https://${window.location.hostname}/${url}`)
    );
  });
}

// this is for query param
// const toggleSelect = (value) => {
//   switch (value) {
//     case 'node':
//       $('#type-filter').val(' Cloud').change().formSelect();
//       handleSelect();
//       break;
//     case 'gas':
//       $('#type-filter').val('Google Apps').change().formSelect();
//       handleSelect();
//       break;
//     default:
//       return;
//   }
// };

const ready = () => {
  console.log("ready");
  // Contact form
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }
  // Portfolio filter
  const selectors = document.querySelectorAll("select");
  let instances;
  if (selectors) {
    instances = M.FormSelect.init(selectors, {});
    selectors.forEach((selector) =>
      selector.addEventListener("change", handleSelect)
    );
  }
  // Query param for portfolio filter
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has("p")) {
    toggleSelect(searchParams.get("p"));
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
