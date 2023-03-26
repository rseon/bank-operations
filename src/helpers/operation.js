import {dbGet, dbSave, downloadFile} from "@/helpers/index"
const version = require('../../package.json').version

export const DB_NAME = 'operations'


export const getOperationData = () => {
	let operations = dbGet(DB_NAME, [])
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

	return {
		types,
		recipients,
		operations,
	}
}

export const setOperationsData = (operations) => {
	return dbSave(DB_NAME, operations)
}

export const removeOperations = (to_remove) => {
	const operations = dbGet(DB_NAME)
		.filter(op => !to_remove.includes(op.id))

	setOperationsData(operations)
}

export const getCreditTotal = (operations) => {
	const credit = operations.reduce((acc, op) => {
		const amount = parseFloat(op.amount)
		return acc + (amount >= 0 ? amount : 0)
	}, 0)
	return Math.round(credit * 100) / 100
}

export const getDebitTotal = (operations) => {
	const debit = operations.reduce((acc, op) => {
		const amount = parseFloat(op.amount)
		return acc + (amount < 0 ? amount : 0)
	}, 0)
	return Math.round(debit * 100) / 100
}

export const getBalanceTotal = (operations) => {
	const balance = operations.reduce((acc, op) => {
		return acc + parseFloat(op.amount)
	}, 0)
	return Math.round(balance * 100) / 100
}

export const createOperation = (data) => {
	let stored = dbGet(DB_NAME)
	stored.push(data)
	setOperationsData(stored)
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
	setOperationsData(operations)
}

export const destroyOperation = (id) => {
	let operations = dbGet(DB_NAME)
	operations = operations.filter(op => op.id !== id)
	setOperationsData(operations)
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
			] = r.split(';').map(c => decodeURIComponent(escape(c)))

			credit = credit.replace('\r', '')
				.replace(',', '.')
				.replace('.00', '')

			debit = debit.replace(',', '.')
				.replace('.00', '')

			const amount = credit !== '' ? credit : debit

			return {
				id: `${idxPrefix}${idx}`,
				date,
				type,
				recipient,
				detail: detail.replace('[_n]', "\n"),
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
				detail: op.detail.replace("\n", "[_n]"),
				debit,
				credit,
			}
		})
	]
		.map(r => Object.values(r).join(';'))
		.join("\n")

	downloadFile(
		'data:text/csv;charset=utf-8,' + encodeURI(rows),
		`bank_operations_${Date.now()}.csv`
	)
}


export const importJson = (content) => {
	const uint8Array = new Uint8Array(content.length);
	for (let i = 0; i < content.length; i++) {
		uint8Array[i] = content.charCodeAt(i);
	}

	const decodedContent = new TextDecoder("utf-8").decode(uint8Array);

	const json = JSON.parse(decodedContent)
	if (json.meta && json.operations) {
		return json.operations
	}
	return json
}

export const exportJson = (operations) => {
	let json = {
		meta: {
			date: new Date(),
			version
		},
		operations
	}

	downloadFile(
		'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json)),
		`bank_operations_${Date.now()}.json`
	)
}

