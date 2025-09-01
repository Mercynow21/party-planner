export type Item = {
  id: string
  name: string
  price: number
  quantity: number
  containsPeanuts?: boolean
}

export function calculateTotal(items: Item[], peanutFreeOnly: boolean): number {
  const list = peanutFreeOnly ? items.filter(i => !i.containsPeanuts) : items
  return Number(list.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2))
}

export function isWithinBudget(total: number, cap: number): boolean {
  return total <= cap
}


