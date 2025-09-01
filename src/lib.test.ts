import { describe, expect, it } from 'vitest'
import { calculateTotal, isWithinBudget, type Item } from './lib'

describe('budget math', () => {
  it('sums price x quantity', () => {
    const items: Item[] = [
      { id: 'a', name: 'A', price: 1.25, quantity: 2 },
      { id: 'b', name: 'B', price: 0.5, quantity: 3 },
    ]
    expect(calculateTotal(items, false)).toBe(1.25 * 2 + 0.5 * 3)
  })

  it('filters out peanut items when enabled', () => {
    const items: Item[] = [
      { id: 'safe', name: 'Safe', price: 2, quantity: 1, containsPeanuts: false },
      { id: 'nuts', name: 'Nuts', price: 5, quantity: 1, containsPeanuts: true },
    ]
    expect(calculateTotal(items, true)).toBe(2)
    expect(calculateTotal(items, false)).toBe(7)
  })

  it('checks budget cap', () => {
    expect(isWithinBudget(29.99, 30)).toBe(true)
    expect(isWithinBudget(30, 30)).toBe(true)
    expect(isWithinBudget(30.01, 30)).toBe(false)
  })
})


