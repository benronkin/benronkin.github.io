// js/modal.js

let modal

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Create a modal stylesheet and a dialog element
 */
export function initDialog() {
  const styles = `
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

  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)

  const modalEl = document.createElement('dialog')
  modalEl.innerHTML = `
  	<h3 id="modal-header"></h3>
  	<p id="modal-message"></p>
  	<div id="modal-btn-group">
  		<button id="modal-confirm-delete-btn" class="hidden">Confirm delete</button>
			<button id="modal-delete-btn">Delete</button>
			<button id="modal-cancel-btn">Cancel</button>
  	</div>
  `
  document.querySelector('body').appendChild(modalEl)

  modal = document.querySelector('dialog')

  modal.addEventListener('click', handleModalClick)
  document
    .querySelector('#modal-delete-btn')
    .addEventListener('click', handleModalDeleteClick)
  document
    .querySelector('#modal-cancel-btn')
    .addEventListener('click', handleModalCancelClick)
  document
    .querySelector('#modal-confirm-delete-btn')
    .addEventListener('click', handleModalConfirmDeleteClick)
}

/*
 * Set modal header and body message
 */
export function setDialog({ header, message, id }) {
  modal.dataset.target = id
  modal.querySelector('#modal-header').innerHTML = header
  modal.querySelector('#modal-message').innerHTML = message
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
 * Handle modal delete click
 */
function handleModalDeleteClick(e) {
  e.target.classList.add('hidden')
  document.querySelector('#modal-confirm-delete-btn').classList.remove('hidden')
}

/**
 * Handle modal confirm delete click
 */
function handleModalConfirmDeleteClick(e) {
  e.target.classList.add('hidden')
  document.querySelector('#modal-delete-btn').classList.remove('hidden')
  document.dispatchEvent(
    new CustomEvent('delete-recipe', { detail: { id: modal.dataset.target } })
  )
  modal.close()
}

/**
 * Handle modal cancel click
 */
function handleModalCancelClick(e) {
  e.preventDefault()
  modal.close()
  document.querySelector('#modal-delete-btn').classList.remove('hidden')
  document.querySelector('#modal-confirm-delete-btn').classList.add('hidden')
}
