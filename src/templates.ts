import type { Item } from './lib'

export type PartyTemplate = {
  id: string
  name: string
  items: Item[]
  notes?: string
}

export const BUDGET_CAP = 30

export const templates: PartyTemplate[] = [
  {
    id: 'peanut-free-28',
    name: 'Peanut‑Free Essentials ($28)',
    items: [
      { id: 'pretzels', name: 'Pretzel Twists (15 oz)', price: 2.5, quantity: 2, containsPeanuts: false },
      { id: 'apples', name: 'Apples (12 medium)', price: 0.5, quantity: 12, containsPeanuts: false },
      { id: 'lemonade', name: 'Frozen Lemonade Concentrate', price: 1.25, quantity: 4, containsPeanuts: false },
      { id: 'cups', name: '9 oz Cups (50 ct)', price: 3.0, quantity: 1, containsPeanuts: false },
      { id: 'plates', name: 'Small Plates (24 ct)', price: 2.5, quantity: 1, containsPeanuts: false },
      { id: 'napkins', name: 'Napkins (100 ct)', price: 1.5, quantity: 1, containsPeanuts: false },
      { id: 'ice', name: 'Bag of Ice (7 lb)', price: 2.0, quantity: 1, containsPeanuts: false },
      { id: 'wipes', name: 'Hand Wipes / Sanitizer', price: 2.99, quantity: 1, containsPeanuts: false },
    ],
    notes: 'Balanced plan under $30; nut-free items.',
  },
  {
    id: 'fruit-crackers-29',
    name: 'Fruit & Crackers ($29)',
    items: [
      { id: 'crackers', name: 'Butter-Free Crackers (13 oz)', price: 2.25, quantity: 2, containsPeanuts: false },
      { id: 'apples', name: 'Apples (12 medium)', price: 0.5, quantity: 12, containsPeanuts: false },
      { id: 'grapes', name: 'Seedless Grapes (2 lb)', price: 3.99, quantity: 1, containsPeanuts: false },
      { id: 'lemonade', name: 'Frozen Lemonade Concentrate', price: 1.25, quantity: 4, containsPeanuts: false },
      { id: 'cups', name: '9 oz Cups (50 ct)', price: 3.0, quantity: 1, containsPeanuts: false },
      { id: 'plates', name: 'Small Plates (24 ct)', price: 2.5, quantity: 1, containsPeanuts: false },
      { id: 'napkins', name: 'Napkins (100 ct)', price: 1.5, quantity: 1, containsPeanuts: false },
      { id: 'ice', name: 'Bag of Ice (7 lb)', price: 2.0, quantity: 1, containsPeanuts: false },
    ],
    notes: 'Adds fruit variety; still under cap.',
  },
]


