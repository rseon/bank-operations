import {dbGet, dbSave, round} from "@/helpers/index"

export const DB_NAME = 'operations'

export const getOperationsFromDb = () => {
    return dbGet(DB_NAME, [])
        .map(op => {
            op.id = op.id.toString()
            op.amount = parseFloat(op.amount)
            if (!op.category && op.recipient) {
                op.category = op.recipient
                delete op.recipient
            }
            op.category = op.category || ''
            op.subcat = op.subcat || ''
            return op
        })
}

export const getOperationData = () => {
    let types = [], categories = [], years = [], subcats = []

    const operations = getOperationsFromDb().map(op => {
        if (op.type && !types.includes(op.type)) {
            types.push(op.type)
        }
        if (op.category && !categories.includes(op.category)) {
            categories.push(op.category)
        }
        if (op.subcat && !subcats.includes(op.subcat)) {
            subcats.push(op.subcat)
        }

        const year = op.date.split('-')[0]
        if (!years.includes(year)) {
            years.push(year)
        }
        return op
    })

    types = types.sort()
    categories = categories.sort()
    subcats = subcats.sort()
    years = years.sort().reverse()

    const monthNames = [...Array(12).keys()]
        .map(key => new Date(0, key).toLocaleString('en', { month: 'long' }))

    const months = new Map()
    monthNames.forEach((month, i) => {
        months.set((i + 1).toString().padStart(2, "0"), month)
    })

    return {
        types,
        categories,
        subcats,
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
