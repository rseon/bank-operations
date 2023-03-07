import { parseJSON, format } from 'date-fns'

export const DB_NAME = 'operations'

const downloadFile = (content, filename) => {
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

export const importJson = (content) => {
	return JSON.parse(content)
}

export const exportJson = (operations) => {
	downloadFile(
		'data:application/json,' + JSON.stringify(operations),
		`bank_operations_${Date.now()}.json`
	)
}


export const importCSV = (content) => {
	const rows = content.split("\n")
	rows.shift()

	const idxPrefix = Date.now()
	return rows
		.filter(r => r.trim().length > 0)
		.map((r, idx) => {
			let [
				date,
				type,
				recipient,
				detail,
				debit,
				credit
			] = r.split(';')

			credit = credit.replace('\r', '')
				.replace(',', '.')
				.replace('.00', '')

			debit = debit.replace(',', '.')
				.replace('.00', '')

			const amount = credit !== '' ? credit : debit

			console.log({
				date,
				type,
				recipient,
				detail,
				amount,
			})

			return {
				id: `${idxPrefix}${idx}`,
				date,
				type,
				recipient,
				detail,
				amount,
			}
		})
}

export const exportCSV = (operations) => {
	const rows = [
		{
			date: 'Date',
			type: 'Type',
			recipient: 'Recipient',
			detail: 'Detail',
			debit: 'Debit',
			credit: 'Credit',
		},
		...operations.map(op => {
			const amount = parseFloat(op.amount)
			let debit = null,
				credit = null
			if (amount < 0) {
				debit = amount
			}
			else {
				credit = amount
			}
			return {
				date: op.date,
				type: op.type,
				recipient: op.recipient,
				detail: op.detail,
				debit,
				credit,
			}
		})
	]
		.map(r => Object.values(r).join(';'))
		.join("\n")

	downloadFile(
		'data:text/csv,' + rows,
		`bank_operations_${Date.now()}.csv`
	)
}
