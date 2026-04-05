import { useOperation } from '@/providers/operation'
import { useMemo } from 'react'
import { currency, DIRECT_DEBIT_LABEL } from '@/helpers'

export default function DirectDebitList({ className, onSetDirectDebit }) {
  const { operations } = useOperation()

  const directDebits = useMemo(() => {
    return operations
      // Sort operations by date
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      // Get only those in past 6 months
      .filter(op => {
        const now = new Date()

        const start = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        const startStr = start.toISOString().slice(0, 10)

        return op.date >= startStr
      })
      // Get only direct debits
      .filter(op => op.type === DIRECT_DEBIT_LABEL)
      // Get only the last operations
      .filter(((op, idx, self) => idx === self.findIndex(t => t.category === op.category)))
      // Sort by categories
      .sort((a, b) => a.category.localeCompare(b.category))
  }, [operations])

  return (
    <div className={`list-group ${className}`}>
      {directDebits.length > 0 && (
        <>
          {directDebits.map((op, idx) => (
            <button
              key={idx}
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => onSetDirectDebit(op)}
            >
              <div className="d-flex justify-content-between align-items-center">
                {op.category}
                <span className="badge text-bg-primary rounded-pill">{currency(op.amount)}</span>
              </div>
            </button>
          ))}
        </>
      )}
    </div>
  )
}
