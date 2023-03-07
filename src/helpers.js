import { parseJSON, format } from 'date-fns'

export const formatDate = (date, formatDate = 'dd/MM/yyyy') => {
	if (!date) return null
	const dateParsed = parseJSON(date)
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
		return '';
	}
	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2');
}

export const apiHandler = (handler) => {
	return async (req, res) => {
		const method = req.method.toLowerCase()
		if (!handler[method]) {
			return res.status(405).end(`Method ${req.method} Not Allowed`)
		}
		try {
			await handler[method](req, res)
		} catch (err) {
			if (typeof (err) === 'string') {
				return res.status(400).json({ message: err })
			}
			if (err.status) {
				return res.status(err.status).json({ message: err.message })
			}
			return res.status(500).json({ message: err.message })
		}
	}
}