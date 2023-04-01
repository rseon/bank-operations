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
    let formatted = (Math.round(amount * 100) / 100)
        .toLocaleString()
        .toString()
        .replace(/(\,00)|(\.00)/, '')

    const comma = formatted.match(/(\.)|(\,)/)
    if (comma) {
        const [unit, decimals] = formatted.split(comma[0])
        formatted = `${unit}${comma[0]}${decimals.padEnd(2, '0')}`
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