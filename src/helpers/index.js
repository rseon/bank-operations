import {parseJSON, format} from 'date-fns'

export const CHECKBOX_STATES = {
    checked: 'Checked',
    indeterminate: 'Indeterminate',
    empty: 'Empty',
}

export const downloadFile = (content, filename) => {
    const link = document.createElement("a")
    link.setAttribute("href", content)
    link.setAttribute("download", filename)
    document.body.appendChild(link)

    link.click()
}

export const formatDate = (date, formatDate = 'dd/MM/yyyy') => {
    if (!date) return null
    const dateParsed = parseJSON(new Date(date))
    return format(dateParsed, formatDate)
}

export const currency = (amount) => {
    let formatted = amount.toString()
        .replace('.', ',')
        .replace(',00', '')

    if (formatted.includes(',')) {
        const [unit, decimals] = formatted.split(',')
        formatted = `${unit},${decimals.padEnd(2, '0')}`
    }

    return `${formatted} €`
}

export const isEmpty = (array) => array.length === 0

export const nl2br = (str) => {
    if (typeof str === 'undefined' || str === null) {
        return ''
    }
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2')
}


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