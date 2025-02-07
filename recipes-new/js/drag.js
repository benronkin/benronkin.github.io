// -------------------------------
// Exported functions
// -------------------------------

/**
 * Create a drag stylesheet once when initShopping fires
 */
export function makeDragStyles() {
  const styles = `
    .drag-container {
      margin-top: 1rem;
    }
    .draggable {
      cursor: move;
    }
    .draggable.dragging {
      opacity: 0.5;
    } 
  `

  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

/**
 *
 */
export function enableDragging() {
  // clear prior event handlers
  disableDragging()
  document
    .querySelectorAll('.shopping-item')
    .forEach((elem) => makeElementDraggable(elem))
  document.querySelectorAll('.drag-container').forEach((container) => {
    container.addEventListener('dragover', enableDragContainer)
    container.addEventListener('touchmove', enableDragContainer)
  })
}

/**
 *
 */
export function disableDragging() {
  document
    .querySelectorAll('.draggable')
    .forEach((elem) => breakElementDraggable(elem))
  document.querySelectorAll('.drag-container').forEach((container) => {
    container.removeEventListener('dragover', enableDragContainer)
    container.removeEventListener('touchmove', enableDragContainer)
  })
}

// -------------------------------
// Event handler functions
// -------------------------------

/**
 *
 */
function handleDragStart(e) {
  e.target.closest('.shopping-item').classList.add('dragging')
}

/**
 *
 */
function handleDragEnd(e) {
  e.target.closest('.shopping-item').classList.remove('dragging')
  document.dispatchEvent(new CustomEvent('list-changed'))
}

// -------------------------------
// Helper functions
// -------------------------------

/**
 * Enable drag containers
 */
function enableDragContainer(e) {
  e.preventDefault()
  const draggedElem = document.querySelector('.dragging')
  const dragContainer = draggedElem.closest('.drag-container')
  const afterElement = getAfterElement(
    dragContainer,
    e.clientY || e.touches[0].clientY
  )
  if (afterElement === null) {
    dragContainer.appendChild(draggedElem)
  } else {
    dragContainer.insertBefore(draggedElem, afterElement)
  }
}

/**
 * Make an existing DOM element draggable
 */
function makeElementDraggable(elem) {
  elem.classList.add('draggable')
  elem.setAttribute('draggable', 'true')

  elem.addEventListener('dragstart', handleDragStart)
  elem.addEventListener('touchstart', handleDragStart)
  elem.addEventListener('dragend', handleDragEnd)
  elem.addEventListener('touchend', handleDragEnd)
}

/**
 * Break an existing DOM element draggable
 */
function breakElementDraggable(elem) {
  elem.classList.remove('draggable')
  elem.setAttribute('draggable', 'false')

  elem.removeEventListener('dragstart', handleDragStart)
  elem.removeEventListener('touchstart', handleDragStart)
  elem.removeEventListener('dragend', handleDragEnd)
  elem.removeEventListener('touchend', handleDragEnd)
}

/**
 *
 */
function getAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll('.draggable:not(.dragging)')
  ]
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child }
      } else {
        return closest
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element
}
