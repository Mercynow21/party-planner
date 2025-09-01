import type { Item } from './lib'

export type Suggestion = {
  message: string
  apply?: (items: Item[]) => Item[]
}

function clone<T>(v: T): T { return JSON.parse(JSON.stringify(v)) }

export function getSuggestions(items: Item[], budgetCap: number): Suggestion[] {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const suggestions: Suggestion[] = []

  if (total <= budgetCap) {
    suggestions.push({ message: `Good to go. Remaining $${(budgetCap - total).toFixed(2)}.` })
    return suggestions
  }

  // Suggest decreasing quantities of most expensive line items first
  suggestions.push({
    message: 'Reduce quantity of top-cost items until within budget',
    apply: (list) => {
      const next = clone(list)
      let over = next.reduce((s, i) => s + i.price * i.quantity, 0) - budgetCap
      const order = [...next].sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
      for (const item of order) {
        while (item.quantity > 1 && over > 0) {
          item.quantity -= 1
          over -= item.price
        }
      }
      return next
    },
  })

  // Suggest swapping drink to cheaper option if present
  const hasLemonade = items.some(i => /lemonade/i.test(i.name))
  if (hasLemonade) {
    suggestions.push({
      message: 'Swap one lemonade concentrate for water or homemade drink mix',
      apply: (list) => {
        const next = clone(list)
        const idx = next.findIndex(i => /lemonade/i.test(i.name))
        if (idx >= 0 && next[idx].quantity > 0) {
          next[idx].quantity -= 1
          next.push({ id: 'drink-mix', name: 'Drink Mix / Water', price: 0.25, quantity: 1 })
        }
        return next
      },
    })
  }

  return suggestions
}

export function autoBalance(items: Item[], budgetCap: number): Item[] {
  let plan = clone(items)
  for (const s of getSuggestions(plan, budgetCap)) {
    if (s.apply) plan = s.apply(plan)
    const total = plan.reduce((sum, i) => sum + i.price * i.quantity, 0)
    if (total <= budgetCap) break
  }
  return plan
}


