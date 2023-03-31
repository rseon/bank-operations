import {dbGet, dbSave, formatDate} from "@/helpers/index";

export const DB_FILTERS = 'filters'
export const DB_SORT_BY = 'sort_by'

export const getFiltersBase = () => {
	const today = new Date()
	return {
		year: formatDate(today, 'yyyy'),
		month: formatDate(today, 'MM'),
		type: '',
		recipient: '',
		detail: '',
	}
}


export const getFiltersData = () => {
	return dbGet(DB_FILTERS, getFiltersBase())
}

export const setFiltersData = (filters) => {
	return dbSave(DB_FILTERS, filters)
}

export const filterOperations = (operations, filters = {}, sortBy = []) => {
	return operations.filter(op => {
		if (filters.year) {
			if (filters.month) {
				if (op.date > `${filters.year}-${filters.month}-31` || op.date < `${filters.year}-${filters.month}-01`) {
					return false
				}
			}
			else {
				if (op.date < `${filters.year}-01-01` || op.date > `${filters.year}-12-31`) {
					return false
				}
			}
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
	}).sort(sortMultipleFields(sortBy))
}

export const getSortByData = () => {
	return dbGet(DB_SORT_BY, [{
		field: 'date',
		direction: 'desc',
	}])
}
export const setSortByData = (sortBy) => {
	return dbSave(DB_SORT_BY, sortBy)
}

const sortMultipleFields = (fields) => {
	return (a, b) => {
		return fields.map(({field, direction}) => {
			switch (field) {
				case 'date':
					return direction === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
				default:
					return direction === 'asc' ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field])
			}
		}).reduce((p, n) => p ? p : n, 0)
	}
}
