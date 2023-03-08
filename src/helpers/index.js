import {parseJSON, format} from 'date-fns'

export const CHECKBOX_STATES = {
	checked: 'Checked',
	indeterminate: 'Indeterminate',
	empty: 'Empty',
}

export const downloadFile = (content, filename) => {
	const link = document.createElement("a")
	link.setAttribute("href", encodeURI(content))
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
	return `${amount.toString().replace('.', ',')} €`
}

export const isEmpty = (array) => array.length === 0

export const nl2br = (str) => {
	if (typeof str === 'undefined' || str === null) {
		return ''
	}
	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2')
}


export const dbGet = (item, defaultValue = []) => {
	return JSON.parse(localStorage.getItem(item) || JSON.stringify(defaultValue))
}

export const dbSave = (item, data) => {
	return localStorage.setItem(item, JSON.stringify(data))
}
