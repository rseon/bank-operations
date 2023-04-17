import {parseJSON, format, parse} from 'date-fns'

export const CHECKBOX_STATES = {
    checked: 'Checked',
    indeterminate: 'Indeterminate',
    empty: 'Empty',
}

export const formatDate = (date, formatDate = 'dd/MM/yyyy', throwError = false) => {
    if (!date) {
        return null
    }

    const dateParsed = parseJSON(new Date(date))

    try {
        return format(dateParsed, formatDate)
    } catch (e) {
        if (throwError) {
            throw e
        }
    }
    return null
}

export const formatDateFromFormat = (date, formatFrom, formatTo = 'yyyy-MM-dd', throwError = false) => {
    const dateParsed = parse(date, formatFrom, new Date())
    try {
        return format(dateParsed, formatTo)
    } catch (e) {
        if (throwError) {
            throw e
        }
    }
    return null
}

export const currency = (amount, throwError = false) => {
    let formatted = round(amount)
        .toLocaleString()
        .toString()
        .replace(/(\,00)|(\.00)/, '')

    const comma = formatted.match(/(\.)|(\,)/)
    if (comma) {
        const [unit, decimals] = formatted.split(comma[0])
        formatted = `${unit}${comma[0]}${decimals.padEnd(2, '0')}`
    }

    if (formatted === "NaN") {
        if (throwError) {
            throw new Error(`Amount is NaN`)
        }
        return amount
    }

    return `${formatted} €`
}

export const isEmpty = (array) => array.length === 0

export const dbGet = (item, defaultValue = null) => {
    return JSON.parse(localStorage.getItem(item) || JSON.stringify(defaultValue))
}

export const dbSave = (item, data) => {
    return localStorage.setItem(item, JSON.stringify(data))
}

export const deepEqual = (x, y) => {
    const ok = Object.keys, tx = typeof x, ty = typeof y
    return x && y && tx === 'object' && tx === ty
        ? ok(x).length === ok(y).length && ok(x).every(k => deepEqual(x[k], y[k]))
        : x === y
}

export const isObject = (item) => {
    return item && typeof item === 'object' && !Array.isArray(item)
}

export const deepMerge = (target, ...sources) => {
    if (!sources.length) return target
    const source = sources.shift()

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} })
                deepMerge(target[key], source[key])
            } else {
                Object.assign(target, { [key]: source[key] })
            }
        }
    }

    return deepMerge(target, ...sources)
}

export const round = (value, decimals = 2) => {
    const factor = parseInt('1' + '0'.repeat(decimals))
    return Math.round(value * factor) / factor
}