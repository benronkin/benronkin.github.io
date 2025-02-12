/**
 * Normalize the suggestions.
 */
function normalizeSuggestions(line) {
  let cleaned = line.replace(/\s*\([^)]*\)/g, '')
  cleaned = cleaned.replace(/\s*\[[^\]]*\]/g, '')

  cleaned = cleaned.replace(
    /\b\d+(?:[\/\.]\d+)?\s*(?:g|grams?s|Tbsp|tsp|cups?|tbsp|tablespoons?)\.?\b/g,
    ''
  )

  return cleaned
}

const line =
  '250g cucumbers, 1/2 cup flour,0.5g chilli powder (0.75g if you are bold), 2 foil wraps, 3 lbs. apples,2 packs dishwasher, 3 tsp tomatoes (the good kind), 3 g peppers, 2 Tbsp onions, 3 pounds carrots,butter,oats [yay]'
const result = normalizeSuggestions(line)
  .split(',')
  .map((i) => i.trim())

console.clear()
console.log(result)
