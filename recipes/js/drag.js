/**
 *
 */
function initDragging() {
  makeDragStyles()
  enableDragContainers()
}

/**
 * Get an existing DOM element and make it draggable
 */
function makeElementDraggable(elem) {
  elem.classList.add('draggable')
  elem.setAttribute('draggable', 'true')

  elem.addEventListener('dragstart', (event) => {
    elem.classList.add('dragging')
  })

  let isDragging = false

  elem.addEventListener('touchstart', (event) => {
    isDragging = false // Reset dragging state
    elem.classList.add('dragging')
    event.preventDefault()
  })

  elem.addEventListener('dragend', (event) => {
    elem.classList.remove('dragging')
    document.dispatchEvent(new CustomEvent('clear-selection'))
    document.dispatchEvent(new CustomEvent('list-changed'))
  })

  elem.addEventListener('touchend', (event) => {
    elem.classList.remove('dragging')
    if (!isDragging) {
      // Treat it as a click if no drag happened
      elem.click() // Trigger the click handler manually
    }
    document.dispatchEvent(new CustomEvent('list-changed'))
  })

  return elem
}

/**
 * Enable drag and drop functionality for all drag containers
 */
function enableDragContainers() {
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

    container.addEventListener('drop', (event) => {
      event.preventDefault()
    })

    container.addEventListener('touchend', (event) => {
      event.preventDefault()
    })
  }
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

/**
 *
 */
function makeDragStyles() {
  const styles = `
    /* Disable text selection */
    html, body {
      -webkit-user-select: none; /* For Safari */
      -ms-user-select: none;     /* For Internet Explorer/Edge */
      user-select: none;         /* Standard */
    }
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

export { initDragging, makeElementDraggable }
