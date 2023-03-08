import {dbGet, dbSave, formatDate} from "@/helpers/index";
import {lastDayOfMonth} from "date-fns";

export const DB_FILTERS = 'filters'


export const getFiltersData = () => {
	const today = new Date()
	return dbGet(DB_FILTERS, {
		from: formatDate(today, 'yyyy-MM-01'),
		to: formatDate(lastDayOfMonth(today), 'yyyy-MM-dd'),
		type: '',
		recipient: '',
		detail: '',
	})
}
export const setFiltersData = (filters) => {
	return dbSave(DB_FILTERS, filters)
}

export const filterOperations = (operations, filters = {}) => {
	return operations.filter(op => {
		if (filters.from && filters.to) {
			if (op.date > filters.to || op.date < filters.from) {
				return false
			}
		}
		if (filters.from && !filters.to && op.date < filters.from) {
			return false
		}
		if (!filters.from && filters.to && op.date > filters.to) {
			return false
		}
		if (filters.type && op.type.toLowerCase() !== filters.type.toLowerCase()) {
			return false
		}
		if (filters.recipient && op.recipient.toLowerCase() !== filters.recipient.toLowerCase()) {
			return false
		}
		if (filters.detail && !op.detail.toLowerCase().includes(filters.detail.toLowerCase())) {
			return false
		}
		return true
	})
}
