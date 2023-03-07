import { parseJSON, format } from 'date-fns'

const DB_NAME = 'operations'

export const formatDate = (date, formatDate = 'dd/MM/yyyy') => {
	if (!date) return null
	const dateParsed = parseJSON(new Date(date))
	return format(dateParsed, formatDate)
}

export const currency = (amount) => {
	return `${amount.toString().replace('.', ',')} €`
}

export const isEmpty = (array) => array.length === 0

export const trigger = (event, element) => {
	element.dispatchEvent(new MouseEvent(event))
}

export const nl2br = (str) => {
	if (typeof str === 'undefined' || str === null) {
		return ''
	}
	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2')
}

export const getOperationData = () => {
	let operations = dbGet(DB_NAME)
		.sort((a, b) => new Date(b.date) - new Date(a.date))

	let types = []
	let recipients = []
	operations.forEach(op => {
		if (!types.includes(op.type)) {
			types.push(op.type)
		}
		if (!recipients.includes(op.recipient)) {
			recipients.push(op.recipient)
		}
	})

	types = types.sort()
	recipients = recipients.sort()

	let debit = 0, credit = 0, balance = 0
	operations.forEach(op => {
		const amount = parseFloat(op.amount)
		if (amount < 0) {
			debit += amount
		}
		else {
			credit += amount
		}
		balance += amount
	})

	return {
		types,
		recipients,
		operations,
		debit: Math.round(debit * 100) / 100,
		credit: Math.round(credit * 100) / 100,
		balance: Math.round(balance * 100) / 100,
	}
}

export const createOperation = (data) => {
	let stored = dbGet(DB_NAME)
	stored.push(data)
	return dbSave(DB_NAME, stored)
}

export const updateOperation = (id, data) => {
	const operations = dbGet(DB_NAME)
	const idx = operations.findIndex(op => op.id === id)
	if (idx !== -1) {
		operations[idx] = {
			...operations[idx],
			...data
		}
	}
	dbSave(DB_NAME, operations)
}

export const destroyOperation = (id) => {
	let operations = dbGet(DB_NAME)
	operations = operations.filter(op => op.id !== id)
	dbSave(DB_NAME, operations)
}

export const dbGet = (item) => {
	return JSON.parse(localStorage.getItem(item) || '[]')
}

export const dbSave = (item, data) => {
	return localStorage.setItem(item, JSON.stringify(data))
}