const template = document.createElement("template");
template.innerHTML = `
<style>
  :root {
    --secondary: #bf6b82;
    --primary: #456389;
    --third: #527869;
    --forth: #f2acb9;
    --black: #260101;
    --white: #F0F2F1;
  }
  
  a {
    text-decoration: none;
  }

  h2 {
    color: var(--third);
    font-size: 2rem;
    font-weight: 400;
    margin-top: 0;
  }

  h3 {
    color: var(--primary);
  }

  h2 + h3 {
    margin-top: -20px;
  }

  .btn {
    text-decoration: none;
    color: #fff;
    background-color: var(--secondary);
    text-align: center;
    letter-spacing: .5px;

    cursor: pointer;
    border: none;
    border-radius: 2px;
    display: inline-block;
    height: 36px;
    line-height: 36px;
    padding: 0 16px;
    text-transform: uppercase;
    vertical-align: middle;
    -webkit-tap-highlight-color: transparent;
  }

  .btn:hover {
    background-color: var(--forth);
  }
  
  .card {
    background-color: white;
    border-radius: 2px;
    /* box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2); */
    /* height: 500px; */
    margin: .5rem 0 7rem 0;
    overflow: hidden;
    position: relative;
    transition: box-shadow .25s, -webkit-box-shadow .25s;
  }
  .horizontal {
    display: flex;
  }

  .card.horizontal .card-image {
    max-width: 50%;
    position: relative;
  }
  .card.horizontal .card-image img {
    width: 400px;
  }
  .card.horizontal .card-stacked {
    display: flex;
    flex-direction: column;
  }
  .card .card-content {
    /* flex-grow: 1; */
    padding: 0 24px 24px 24px;
    border-radius: 0 0 2px 2px;
  }

  .card .card-action {
    /* background-color: #f44336; */
    /*border-top: 1px solid rgba(160,160,160,0.2);*/
    position: relative;
    padding: 0;
    margin-left: 24px;
  }

  .card .card-action a {
    color: white;
    margin-right: 24px;
    -webkit-transition: color .3s ease;
    transition: color .3s ease;
    text-transform: uppercase;
  }

  @media only screen and (max-width: 920px) {
    .card.horizontal .card-image,
    .card.horizontal .card-image img {
      max-width: 100%;
    }
    .horizontal {
      flex-direction: column;
    }
  }
</style>
<div class="card horizontal" data-topics="" data-url="">
  <div class="card-image">
  <a><img></a>
  </div>
  <div class="card-stacked">
    <div class="card-content">
      <h2></h2>
      <h3></h3>
      <p><slot name="description"</p>
    </div>
    <div class="card-action">
      <a class="btn">View project details ➤</a>
    </div>
  </div>
</div>`;

function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

const toggleClass = (ele, cls) => {
  return function () {
    if (hasClass(ele, cls)) {
      removeClass(ele, cls);
    } else {
      addClass(ele, cls);
    }
  };
};

class PortfolioCard extends HTMLElement {
  constructor() {
    super();

    this.setAttribute("data-topics", this.getAttribute("topics"));
    this.setAttribute("data-url", this.getAttribute("target"));

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.querySelector("img").src = this.getAttribute("image");
    this.shadowRoot.querySelector("h2").innerText = this.getAttribute("title");
    this.shadowRoot.querySelector("h3").innerText =
      this.getAttribute("subtitle");
    const as = this.shadowRoot.querySelectorAll("a");
    const href = this.getAttribute("target");
    as.forEach(function (a) {
      a.href = href;
    });
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector(".card")
      .addEventListener(
        "mouseover",
        toggleClass(this.shadowRoot.querySelector(".card-action"), "emphasized")
      );
    this.shadowRoot
      .querySelector(".card")
      .addEventListener(
        "mouseout",
        toggleClass(this.shadowRoot.querySelector(".card-action"), "emphasized")
      );
  }

  disconnectedCallback() {
    this.shadowRoot
      .querySelector(".card")
      .removeEventListener("mouseover", toggleClass);
    this.shadowRoot
      .querySelector(".card")
      .removeEventListener("mouseout", toggleClass);
  }
}

window.customElements.define("portfolio-card", PortfolioCard);
