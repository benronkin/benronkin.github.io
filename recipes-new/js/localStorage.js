// NO NEED TO USE LOCAL STORAGE FOR RECIPES AND SHOPPING.
// USE STATE INSTEAD.

/**
 *
 */
// export function addLocalStorageValues(itemName, values) {
//   const arr = getLocalStorage(itemName)
//   for (let value of values) {
//     if (!value) {
//       continue
//     }
//     if (itemName !== 'recipes') {
//       value = value.trim()
//     }
//     if (!arr.includes(value)) {
//       arr.push(value)
//     }
//   }
//   const str = arr.join(',')
//   localStorage.setItem(itemName, str)
//   return str
// }

/**
 *
 */
// export function deleteLocalStorageValue(itemName, value) {
//   if (!value) {
//     return
//   }
//   let arr = getLocalStorage(itemName)
//   if (itemName !== 'recipes') {
//     value = value.trim()
//     arr = arr.filter((v) => v !== value)
//   } else {
//     arr = arr.filter((v) => v.id !== value.id)
//   }
//   const str = arr.join(',')
//   localStorage.setItem(itemName, str)
//   return str
// }

/**
 *
 */
// export function getLocalStorage(itemName) {
//   let arr = (localStorage.getItem(itemName) || '').split(',')
//   if (itemName !== 'recipes') {
//     arr = arr.map((v) => v.trim())
//   }
//   arr = arr.filter((v) => v.toString().trim().length > 0)
//   return arr
// }

/**
 *
 */
// export function setLocalStorageItem(itemName, value) {
//   localStorage.setItem(itemName, value)
// }
