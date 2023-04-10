import {dbGet, dbSave, round} from "@/helpers/index"

export const DB_NAME = 'operations'

export const getOperationsFromDb = () => {
    return dbGet(DB_NAME, [])
        .map(op => {
            op.id = op.id.toString()
            op.amount = parseFloat(op.amount)
            return op
        })
}

export const getOperationData = () => {
    let types = [], recipients = [], years = []

    const operations = getOperationsFromDb().map(op => {
        if (!types.includes(op.type)) {
            types.push(op.type)
        }
        if (!recipients.includes(op.recipient)) {
            recipients.push(op.recipient)
        }

        const year = op.date.split('-')[0]
        if (!years.includes(year)) {
            years.push(year)
        }
        return op
    })

    types = types.sort()
    recipients = recipients.sort()
    years = years.sort().reverse()

    const monthNames = [...Array(12).keys()]
        .map(key => new Date(0, key).toLocaleString('en', { month: 'long' }))

    const months = new Map()
    monthNames.forEach((month, i) => {
        months.set((i + 1).toString().padStart(2, "0"), month)
    })

    return {
        types,
        recipients,
        operations,
        years,
        months,
    }
}

export const setOperationsData = (operations) => {
    return dbSave(DB_NAME, operations)
}

export const removeOperations = (to_remove) => {
    const operations = getOperationsFromDb()
        .filter(op => !to_remove.includes(op.id))

    setOperationsData(operations)
}

export const getCreditTotal = (operations) => {
    return round(operations.reduce((acc, op) => {
        return acc + (op.amount >= 0 ? op.amount : 0)
    }, 0))
}

export const getDebitTotal = (operations) => {
    return round(operations.reduce((acc, op) => {
        return acc + (op.amount < 0 ? op.amount : 0)
    }, 0))
}

export const getBalanceTotal = (operations) => {
    return round(operations.reduce((acc, op) => {
        return acc + op.amount
    }, 0))
}

export const createOperation = (data) => {
    let stored = getOperationsFromDb()
    stored.push(data)
    setOperationsData(stored)
}

export const updateOperation = (id, data) => {
    const operations = getOperationsFromDb()
    const idx = operations.findIndex(op => op.id === id)
    if (idx !== -1) {
        operations[idx] = {
            ...operations[idx],
            ...data
        }
    }
    setOperationsData(operations)
}

export const destroyOperation = (id) => {
    let operations = getOperationsFromDb()
    operations = operations.filter(op => op.id !== id)
    setOperationsData(operations)
}
