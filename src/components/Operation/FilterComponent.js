import {deepEqual, formatDate} from "@/helpers";
import {getFiltersBase, setFiltersData} from "@/helpers/filter";
import {useEffect, useMemo, useState} from "react";

const OperationFilterComponent = ({
    data,
    filters,
    setFilters
}) => {
    const { types, recipients, years, months } = data
    const [isThisMonth, setIsThisMonth] = useState(false)
    const [hasFilter, setHasFilter] = useState(false)

    const today = useMemo(() => new Date(), [])

    useEffect(() => {
        setIsThisMonth(formatDate(today, 'yyyy-MM') === `${filters.year}-${filters.month}`)
        setHasFilter(!deepEqual(filters, getFiltersBase()))
    }, [filters, today])

    const onChange = (event) => {
        updateFilter(event.target.name, event.target.value)
    }

    const updateFilter = (name, value) => {
        setFilters((state) => {
            const newFilters = {
                ...state,
                [name]: value
            }
            setFiltersData(newFilters)
            return newFilters
        })
    }

    const eraseFilters = () => {
        setFilters(() => {
            const newFilters = getFiltersBase()
            setFiltersData(newFilters)
            return newFilters
        })
    }

    const filterOnCurrentMonth = () => {
        updateFilter('year', formatDate(today, 'yyyy'))
        updateFilter('month', formatDate(today, 'MM'))
    }

    return (
        <div className="mb-3 card bg-light">
            <div className="card-body">
                <div className="row">
                    <div className="col-4">
                        <div className="mb-2">
                            <label htmlFor="filter_year" className="form-label">Year</label>
                            <select name="year" id="filter_year" className="form-control" value={filters.year} onChange={onChange} autoComplete="off">
                                {years.map((year, idx) => (
                                    <option key={idx} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="mb-2">
                            <label htmlFor="filter_month" className="form-label">Month</label>
                            <select name="month" id="filter_month" className="form-control" value={filters.month} onChange={onChange} autoComplete="off">
                                <option value=""></option>
                                {[...months.keys()].map((idx) => (
                                    <option key={idx} value={idx}>{months.get(idx)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="row mt-4">
                            <div className="col-6 mt-2">
                                {!isThisMonth &&
                                    <button className="btn btn-light" onClick={filterOnCurrentMonth}>
                                        <small>📅 This month</small>
                                    </button>
                                }
                            </div>
                            <div className="col-6 mt-2 text-end">
                                {hasFilter &&
                                    <button className="btn btn-light" onClick={eraseFilters}>
                                        <small>Reset filters</small>
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <label htmlFor="filter_type" className="form-label">Type</label>
                        <select name="type" id="filter_type" className="form-control" value={filters.type} onChange={onChange} autoComplete="off">
                            <option value=""></option>
                            {types.map((type, idx) => (
                                <option key={idx} value={type}>{type}</option>
                            ))}
                        </select>
                        {filters.type !== '' &&
                            <button className="btn btn-link p-0" onClick={() => updateFilter('type', '')}>
                                <small>Reset filter</small>
                            </button>
                        }
                    </div>
                    <div className="col-3">
                        <label htmlFor="filter_type" className="form-label">Recipient</label>
                        <select name="recipient" id="filter_recipient" className="form-control" value={filters.recipient} onChange={onChange} autoComplete="off">
                            <option value=""></option>
                            {recipients.map((recipient, idx) => (
                                <option key={idx} value={recipient}>{recipient}</option>
                            ))}
                        </select>
                        {filters.recipient !== '' &&
                            <button className="btn btn-link p-0" onClick={() => updateFilter('recipient', '')}>
                                <small>Reset filter</small>
                            </button>
                        }
                    </div>
                    <div className="col-3">
                        <label htmlFor="filter_detail" className="form-label">Detail</label>
                        <input id="filter_detail" name="detail" type="search" className="form-control" value={filters.detail} onChange={onChange} autoComplete="off" />
                        {filters.detail !== '' &&
                            <button className="btn btn-link p-0" onClick={() => updateFilter('detail', '')}>
                                <small>Reset filter</small>
                            </button>
                        }
                    </div>
                    <div className="col-3">
                        <label htmlFor="filter_type" className="form-label">Balance</label>
                        <select name="balance" id="filter_balance" className="form-control" value={filters.balance} onChange={onChange} autoComplete="off">
                            <option value=""></option>
                            <option value="credit">Credit only</option>
                            <option value="debit">Debit only</option>
                        </select>
                        {filters.balance !== '' &&
                            <button className="btn btn-link p-0" onClick={() => updateFilter('balance', '')}>
                                <small>Reset filter</small>
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OperationFilterComponent