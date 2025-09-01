import { describe, expect, it } from 'vitest'
import { autoBalance } from './budget'
import type { Item } from './lib'

describe('smart budgeting', () => {
  it('reduces quantities of costly items to fit budget', () => {
    const items: Item[] = [
      { id: 'a', name: 'A', price: 10, quantity: 2 }, // $20
      { id: 'b', name: 'B', price: 2, quantity: 3 },  // $6
    ]
    const balanced = autoBalance(items, 24) // need <= $24, currently $26
    const total = balanced.reduce((s, i) => s + i.price * i.quantity, 0)
    expect(total).toBeLessThanOrEqual(24)
    // Ensure reductions happened
    expect(balanced.find(i => i.id === 'a')!.quantity).toBeLessThanOrEqual(2)
  })
})


