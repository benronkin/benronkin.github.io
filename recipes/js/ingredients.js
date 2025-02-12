const skippedIngredients = [
  'almond',
  'almonds',
  'and pepper',
  'baking powder',
  'baking soda',
  'black pepper',
  'carrot',
  'carrots',
  'cinnamon',
  'cocoa',
  'coffee',
  'cardamom',
  'cornstarch',
  'corn starch',
  'corn syrup',
  'cumin',
  'espresso',
  'extract',
  'flour',
  'garam',
  'garlic',
  'gelatin',
  'honey',
  'lemon',
  'milk',
  'nutmeg',
  'oil',
  'onion',
  'peppers',
  'recipe',
  'rum',
  'salt',
  'soy',
  'sugar',
  'tomato',
  'tomatoes',
  'turmeric',
  'vanilla',
  'walnut',
  'walnuts',
  'water',
  'white pepper',
  'yeast',
  'yogurt'
]

const transformedIngredients = {
  'beaten egg': 'egg',
  'beaten eggs': 'eggs',
  'chocolate coins': 'chocolate',
  'egg white': 'egg',
  'egg whites': 'eggs',
  'egg yolk': 'egg',
  'egg yolks': 'eggs',
  'raspberry puree': 'raspberries',
  'whipping cream': 'heavy cream'
}

const nameOnlyIngredients = ['butter', 'heavy cream']

/**
 * Transform ingredient lines to a shopping list format
 */
export function transformIngredient(line) {
  for (const [key, value] of Object.entries(transformedIngredients)) {
    if (line.includes(key)) {
      line = line.replace(key, value)
    }
  }

  for (const nameOnly of nameOnlyIngredients) {
    const regex = new RegExp(`\\b${nameOnly}\\b`)
    if (regex.test(line)) {
      line = nameOnly
    }
  }

  const comma = line.indexOf(',')
  if (comma > -1) {
    line = line.slice(0, comma)
  }
  return line
}

/**
 * Filter ingredient lines that should not be added to the shopping list
 */
export function filterIngredient(line) {
  if (!/[a-zA-Z]{3,}/.test(line)) {
    return false
  }
  for (const word of skippedIngredients) {
    const regEx = new RegExp(`\\b${word}\\b`, 'g')
    if (regEx.test(line)) {
      return false
    }
  }
  return true
}

/**
 * Remove quantities and parenthesis
 */
export function standardizeIngredient(line) {}
