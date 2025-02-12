// js/modal.js

// -------------------------------
// Globals
// -------------------------------

let modal

const MODAL_STYLE = `
    dialog {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      margin: auto;
    }
    dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.5);
    }
    #modal-btn-group {
      margin: 20px 0;
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }
    #modal-conform-delete-btn {
    	background-color: red;
    	color: white;
    }
    #modal-cancel-btn {
      background: transparent;
      border: 1px solid #555555;
      color: #555555;
    }
  `
export const MODAL = {
  DELETE_RECIPE: {
    html: `
  	<h3 id="modal-header"></h3>
  	<p id="modal-body"></p>
  	<div id="modal-btn-group">
  		<input id="modal-delete-input" type="password" placeholder="Password" />
			<button id="modal-delete-btn">Delete</button>
			<button id="modal-cancel-btn">Cancel</button>
  	</div>
    <div id="modal-message"></div>`,
    init: function () {
      const modal = document.querySelector('dialog')
      modal.addEventListener('click', handleModalClick)
      document
        .querySelector('#modal-delete-btn')
        .addEventListener('click', handleModalConfirmDeleteClick)
      document
        .querySelector('#modal-cancel-btn')
        .addEventListener('click', handleModalCancelClick)
    }
  }
}

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Create a modal stylesheet and a dialog element
 */
export function initDialog() {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = MODAL_STYLE
  document.head.appendChild(styleSheet)

  const modalEl = document.createElement('dialog')
  document.querySelector('body').appendChild(modalEl)
  modal = document.querySelector('dialog')
}

/*
 * Set modal header and body message
 */
export function setDialog({ type, header, body, id }) {
  modal.innerHTML = type.html
  modal.dataset.target = id
  modal.querySelector('#modal-header').innerHTML = header
  modal.querySelector('#modal-body').innerHTML = body
  type.init()
}

// -------------------------------
// Event listener handlers
// -------------------------------

/**
 * Close modal if clicked outside its visible area
 */
function handleModalClick(e) {
  const dialogDimensions = modal.getBoundingClientRect()
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    modal.close()
  }
}

/**
 * Handle modal confirm delete click
 */
function handleModalConfirmDeleteClick(e) {
  document.dispatchEvent(
    new CustomEvent('delete-recipe', { detail: { id: modal.dataset.target } })
  )
}

/**
 * Handle modal cancel click
 */
function handleModalCancelClick(e) {
  e.preventDefault()
  modal.close()
}
