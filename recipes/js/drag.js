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
  elem.addEventListener('dragend', (event) => {
    elem.classList.remove('dragging')
    document.dispatchEvent(new CustomEvent('clear-selection'))
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
      const draggedElem = document.querySelector('.dragging')
      const afterElement = getAfterElement(container, e.clientY)
      if (afterElement === null) {
        container.appendChild(draggedElem)
      } else {
        container.insertBefore(draggedElem, afterElement)
      }
    })

    container.addEventListener('drop', (event) => {
      event.preventDefault()
    })
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
    .drag-container {
      margin-top: 1rem;
    }
    .draggable {
      cursor: move;
      padding: 0.5rem;
      background-color: lightgreen;
      margin-bottom: 0.5rem;
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
