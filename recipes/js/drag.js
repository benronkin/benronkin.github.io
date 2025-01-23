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
 * Enable drag and drop functionality for all drag containers once
 * when initShopping fires
 */
export function enableDragContainers() {
  const dragContainers = document.querySelectorAll('.drag-container')
  for (const container of dragContainers) {
    container.addEventListener('dragover', (e) => {
      e.preventDefault()
      handleDraggedElement(e, container)
    })
    container.addEventListener('touchmove', (e) => {
      e.preventDefault()
      handleDraggedElement(e, container)
    })

    // container.addEventListener('drop', (event) => {
    //   event.preventDefault()
    // })

    // container.addEventListener('touchend', (event) => {
    //   event.preventDefault()
    // })
  }
}

/**
 *
 */
export function enableDragging() {
  document.querySelectorAll('.shopping-item').forEach((elem) => makeElementDraggable(elem))
}

/**
 *
 */
export function disableDragging() {
  document.querySelectorAll('.shopping-item').forEach((elem) => breakElementDraggable(elem))
}

// -------------------------------
// Event listeners
// -------------------------------

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

/**
 * handle the dragged item inside the container
 */
function handleDraggedElement(e, container) {
  const draggedElem = document.querySelector('.dragging')
  const afterElement = getAfterElement(container, e.clientY || e.touches[0].clientY)
  if (afterElement === null) {
    container.appendChild(draggedElem)
  } else {
    container.insertBefore(draggedElem, afterElement)
  }
}

// -------------------------------
// Helper functions
// -------------------------------

/**
 *
 */
function getAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
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
