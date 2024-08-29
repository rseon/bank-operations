import {dbGet, dbSave, formatDate} from "@/helpers/index";

export const DB_FILTERS = 'filters'
export const DB_SORT_BY = 'sortby'

export const getFiltersBase = () => {
    const today = new Date()
    return {
        year: formatDate(today, 'yyyy'),
        month: formatDate(today, 'MM'),
        type: '',
        category: '',
        subcat: '',
        detail: '',
        balance: '',
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
        else {
            if (filters.month) {
                if (op.date.split('-')[1] !== filters.month) {
                    return false
                }
            }
        }
        if (filters.type && op.type.toLowerCase() !== filters.type.toLowerCase()) {
            return false
        }
        if (filters.category && op.category.toLowerCase() !== filters.category.toLowerCase()) {
            return false
        }
        if (filters.subcat && op.subcat.toLowerCase() !== filters.subcat.toLowerCase()) {
            return false
        }
        if (filters.detail && !op.detail.toLowerCase().includes(filters.detail.toLowerCase())) {
            return false
        }
        if (filters.balance) {
            if (filters.balance === 'credit' && op.amount < 0) {
                return false
            }
            if (filters.balance === 'debit' && op.amount > 0) {
                return false
            }
        }
        return true
    }).sort(sortMultipleFields(sortBy))
}

export const getSortByData = () => {
    let sortBy = dbGet(DB_SORT_BY, withSortById([
        {field: 'date', direction: 'desc'},
    ]))
    if (!Array.isArray(sortBy)) {
        sortBy = [sortBy]
    }
    return sortBy
}

export const setSortByData = (sortBy) => {
    return dbSave(DB_SORT_BY, sortBy)
}

export const withSortById = (sortBy) => {
    sortBy = sortBy.filter(s => s.field !== 'id')
    sortBy.push({field: 'id', direction: 'desc'})
    return sortBy
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
