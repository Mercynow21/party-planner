import { useEffect, useMemo, useState } from 'react'
import { templates } from './templates'
import { autoBalance, getSuggestions } from './budget'

type Item = {
  id: string
  name: string
  price: number
  quantity: number
  containsPeanuts?: boolean
}

type ScheduleSlot = {
  minute: number
  text: string
}

const BUDGET_CAP = 30
const STUDENT_COUNT = 24

function getDefaultItems(): Item[] {
  return [
    { id: 'pretzels', name: 'Pretzel Twists (15 oz)', price: 2.5, quantity: 2, containsPeanuts: false },
    { id: 'apples', name: 'Apples (12 medium)', price: 0.5, quantity: 12, containsPeanuts: false },
    { id: 'lemonade', name: 'Frozen Lemonade Concentrate', price: 1.25, quantity: 4, containsPeanuts: false },
    { id: 'cups', name: '9 oz Cups (50 ct)', price: 3.0, quantity: 1, containsPeanuts: false },
    { id: 'plates', name: 'Small Plates (24 ct)', price: 2.5, quantity: 1, containsPeanuts: false },
    { id: 'napkins', name: 'Napkins (100 ct)', price: 1.5, quantity: 1, containsPeanuts: false },
    { id: 'ice', name: 'Bag of Ice (7 lb)', price: 2.0, quantity: 1, containsPeanuts: false },
    { id: 'wipes', name: 'Hand Wipes / Sanitizer', price: 2.99, quantity: 1, containsPeanuts: false },
  ]
}

function getDefaultSchedule(): ScheduleSlot[] {
  const labels: Record<number, string> = {}
  // 00-04 Welcome & setup
  for (let m = 0; m <= 4; m++) labels[m] = 'Welcome, sanitize hands, find seats'
  // 05-09 Expectations & helpers
  for (let m = 5; m <= 9; m++) labels[m] = 'Ground rules and assign helpers'
  // 10-19 Snack 1
  for (let m = 10; m <= 19; m++) labels[m] = 'Snack 1: Pretzels'
  // 20-29 Snack 2 + Drink
  for (let m = 20; m <= 29; m++) labels[m] = 'Snack 2: Apple halves + Lemonade'
  // 30-39 Game 1
  for (let m = 30; m <= 39; m++) labels[m] = 'Game 1: Freeze Dance'
  // 40-49 Game 2
  for (let m = 40; m <= 49; m++) labels[m] = 'Game 2: Four Corners'
  // 50-54 Photo & thank yous
  for (let m = 50; m <= 54; m++) labels[m] = 'Group photo + thank yous'
  // 55-59 Cleanup
  for (let m = 55; m <= 59; m++) labels[m] = 'Cleanup: tables, trash, sweep'

  return Array.from({ length: 60 }, (_, i) => ({ minute: i, text: labels[i] || '' }))
}

function App() {
  const [items, setItems] = useState<Item[]>(getDefaultItems())
  const [peanutFreeOnly, setPeanutFreeOnly] = useState<boolean>(true)
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(getDefaultSchedule())

  const filteredItems = useMemo(
    () => (peanutFreeOnly ? items.filter(i => !i.containsPeanuts) : items),
    [items, peanutFreeOnly]
  )

  const total = useMemo(
    () => filteredItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [filteredItems]
  )

  function addItem() {
    const newItem: Item = {
      id: Math.random().toString(36).slice(2),
      name: '',
      price: 0,
      quantity: 1,
      containsPeanuts: false,
    }
    setItems(prev => [newItem, ...prev])
  }

  function updateItem(id: string, patch: Partial<Item>) {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...patch } : i)))
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function generateMarkdown(): string {
    const header = `# Party Planner\nBudget cap: $${BUDGET_CAP}\nStudents: ${STUDENT_COUNT}\n\n`
    const itemsMd = filteredItems
      .map(i => `- ${i.name || 'Item'} x${i.quantity} @ $${i.price.toFixed(2)} = $${(i.price * i.quantity).toFixed(2)}`)
      .join('\n')
    const perStudent = total / STUDENT_COUNT
    const totalsMd = `\n\nTotal: $${total.toFixed(2)}${total > BUDGET_CAP ? ' (over cap!)' : ''}\nPer student: $${perStudent.toFixed(2)}`
    const scheduleMd = `\n\n## Schedule (60 minutes)\n` +
      schedule.map(s => `${s.minute.toString().padStart(2, '0')}: ${s.text || ''}`).join('\n')
    return header + itemsMd + totalsMd + scheduleMd
  }

  function exportMarkdown() {
    const md = generateMarkdown()
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'party-plan.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function copyMarkdown() {
    const md = generateMarkdown()
    try {
      await navigator.clipboard.writeText(md)
      alert('Markdown copied to clipboard')
    } catch {
      const ta = document.createElement('textarea')
      ta.value = md
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      alert('Markdown copied to clipboard')
    }
  }

  function printPlan() {
    window.print()
  }

  function resetToTemplate() {
    setItems(getDefaultItems())
    setSchedule(getDefaultSchedule())
    setPeanutFreeOnly(true)
  }

  // Persistence
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('pp_items_v1')
      const savedSchedule = localStorage.getItem('pp_schedule_v1')
      const savedFilter = localStorage.getItem('pp_peanutFilter_v1')
      if (savedItems) setItems(JSON.parse(savedItems))
      if (savedSchedule) setSchedule(JSON.parse(savedSchedule))
      if (savedFilter) setPeanutFreeOnly(JSON.parse(savedFilter))
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try { localStorage.setItem('pp_items_v1', JSON.stringify(items)) } catch { /* ignore */ }
  }, [items])
  useEffect(() => {
    try { localStorage.setItem('pp_schedule_v1', JSON.stringify(schedule)) } catch { /* ignore */ }
  }, [schedule])
  useEffect(() => {
    try { localStorage.setItem('pp_peanutFilter_v1', JSON.stringify(peanutFreeOnly)) } catch { /* ignore */ }
  }, [peanutFreeOnly])

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-sky-700">Party Planner</h1>
          <div className="flex gap-2 flex-wrap items-center">
            <select
              className="border rounded px-2 py-2 text-sm"
              onChange={(e) => {
                const t = templates.find(t => t.id === e.target.value)
                if (t) setItems(t.items)
              }}
              defaultValue=""
            >
              <option value="" disabled>Choose template</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <button
              className="px-3 py-2 rounded bg-teal-500 text-white hover:bg-teal-600"
              onClick={() => setItems(prev => autoBalance(prev, BUDGET_CAP))}
            >Auto-balance</button>
            <button
              className="px-3 py-2 rounded bg-emerald-500 text-white hover:bg-emerald-600"
              onClick={copyMarkdown}
            >Copy Markdown</button>
            <button
              className="px-3 py-2 rounded bg-sky-500 text-white hover:bg-sky-600"
              onClick={exportMarkdown}
            >Download .md</button>
            <button
              className="px-3 py-2 rounded bg-fuchsia-500 text-white hover:bg-fuchsia-600"
              onClick={printPlan}
            >Print</button>
            <button
              className="px-3 py-2 rounded bg-slate-200 text-slate-800 hover:bg-slate-300"
              onClick={resetToTemplate}
            >Reset</button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl shadow p-4 border border-pink-50/80">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sky-700">Items</h2>
              <button className="text-sm px-3 py-1 rounded bg-emerald-500 text-white" onClick={addItem}>Add Item</button>
            </div>
            <div className="space-y-3">
              {filteredItems.map(item => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    className="col-span-4 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    placeholder="Name"
                    value={item.name}
                    onChange={e => updateItem(item.id, { name: e.target.value })}
                  />
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    className="col-span-3 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    placeholder="Price"
                    value={item.price}
                    onChange={e => updateItem(item.id, { price: Number(e.target.value) })}
                  />
                  <input
                    type="number"
                    min={1}
                    className="col-span-2 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={e => updateItem(item.id, { quantity: Number(e.target.value) })}
                  />
                  <label className="col-span-2 inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!item.containsPeanuts}
                      onChange={e => updateItem(item.id, { containsPeanuts: e.target.checked })}
                    />
                    Contains peanuts
                  </label>
                  <button className="col-span-1 text-red-600" onClick={() => removeItem(item.id)}>✕</button>
                </div>
              ))}
            </div>
          </div>

          <aside className="bg-white rounded-2xl shadow p-4 space-y-3 border border-sky-50/80">
            <h2 className="font-semibold">Budget</h2>
            <div className={`text-3xl font-bold ${total > BUDGET_CAP ? 'text-red-600' : 'text-emerald-700'}`}>
              ${total.toFixed(2)} / ${BUDGET_CAP.toFixed(2)}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${BUDGET_CAP - total >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                Remaining: ${Math.max(0, (BUDGET_CAP - total)).toFixed(2)}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-sky-100 text-sky-700">
                Per student: ${(total / STUDENT_COUNT).toFixed(2)}
              </span>
            </div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={peanutFreeOnly} onChange={e => setPeanutFreeOnly(e.target.checked)} />
              Peanut-allergy filter
            </label>
            {total > BUDGET_CAP && (
              <div className="text-sm text-red-600">Over budget! Adjust quantities or prices.</div>
            )}
          </aside>
        </section>

        <section className="bg-white rounded-2xl shadow p-4 border border-violet-50/80">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sky-700">60-minute Schedule</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {schedule.map(slot => (
              <div key={slot.minute} className="flex items-center gap-2">
                <div className="w-12 text-xs text-slate-500">{slot.minute.toString().padStart(2, '0')}:</div>
                <input
                  className="flex-1 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
                  placeholder="Activity"
                  value={slot.text}
                  onChange={e => setSchedule(prev => prev.map(s => s.minute === slot.minute ? { ...s, text: e.target.value } : s))}
                />
              </div>
            ))}
          </div>
        </section>

        {getSuggestions(items, BUDGET_CAP).length > 0 && (
          <section className="bg-white rounded-2xl shadow p-4 border border-emerald-50/80">
            <h2 className="font-semibold mb-2">Smart Suggestions</h2>
            <ul className="list-disc ml-5 text-sm space-y-1">
              {getSuggestions(items, BUDGET_CAP).map((s, idx) => (
                <li key={idx}>{s.message}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}

export default App
