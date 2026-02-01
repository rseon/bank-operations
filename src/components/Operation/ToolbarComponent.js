import {formatDateFromFormat, isEmpty} from "@/helpers";
import {forwardRef, useImperativeHandle, useMemo, useState} from "react";
import FilterComponent from "@/components/Operation/FilterComponent";
import {removeOperations} from "@/helpers/operation";
import {useOperation} from "@/providers/operation";
import {exportCsv, exportJson} from "@/helpers/file";

const OperationToolbarComponent = ({
    listChecked,
    onUpdated
}, ref) => {

    const {operations, filtered, filters} = useOperation()

    const [showFilters, setShowFilters] = useState(false)
    const [forBulk, setForBulk] = useState([])

    const nbFilters = useMemo(() => {
        return Object.values(filters).filter(f => f !== '').length
    }, [filters])

    const filtersAsString = useMemo(() => {
        let newFilters = {...filters}
        if (newFilters.year) {
            if (newFilters.month) {
                newFilters = {
                    date: `${formatDateFromFormat(filters.month, 'MM', 'MMMM')} ${filters.year}`,
                    ...filters
                }
                delete newFilters.year
                delete newFilters.month
            }
        }

        return Object.keys(newFilters)
            .filter(k => newFilters[k] !== null && newFilters[k] !== '')
            .map(k => {
                const key = k.charAt(0).toUpperCase() + k.slice(1)
                let value = newFilters[k]
                if (k === "month") {
                    value = formatDateFromFormat(value, 'MM', 'MMMM')
                }
                return `${key} <strong>${value}</strong>`
            })
            .join(' / ')
    }, [filters])

    useImperativeHandle(ref, () => ({
        setForBulk
    }))

    const exportData = (format, which = 'filtered') => {
        let rows
        switch (which) {
            case 'selected':
                rows = filtered.filter(r => listChecked.includes(r.id))
                break
            case 'filtered':
            default:
                rows = filtered
                break
        }

        switch (format) {
            case 'json':
                exportJson(rows, filters)
                break
            case 'csv':
                exportCsv(rows)
                break
        }
    }

    const deleteSelected = () => {
        if (confirm('This will erase selected data. Continue ?')) {
            removeOperations(forBulk)
            onUpdated()
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between">
                <div>
                    {!isEmpty(operations) &&
                        <>
                            <button className="btn btn-outline-info btn-sm" onClick={() => setShowFilters(!showFilters)}>
                                {showFilters && '🛠️ Hide filters'}
                                {!showFilters && '🛠️ Show filters'}
                                {nbFilters > 0 && ` (${nbFilters})`}
                            </button>

                            <span className="text-muted ms-3">
                                {filtered.length !== operations.length && (
                                    <>
                                        <strong>{filtered.length}</strong> operations / {operations.length}
                                    </>
                                )}
                                {filtered.length === operations.length && (
                                    <>
                                        <strong>{operations.length}</strong> operations
                                    </>
                                )}
                            </span>

                            <small className="text-body-tertiary ms-3" dangerouslySetInnerHTML={{ __html: filtersAsString }} />
                        </>
                    }
                </div>
                <div className="text-end mb-3">
                    {!isEmpty(forBulk) &&
                        <>
                            <div className="btn-group ms-2">
                                <button type="button" className="btn btn-sm btn-outline-warning dropdown-toggle" data-bs-toggle="dropdown">
                                    🗑️ Delete selected ({forBulk.length})
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end p-0">
                                    <li>
                                        <button className="dropdown-item" onClick={deleteSelected}>
                                            Confirm deletion
                                            <small className="text-muted"><br/>⚠️ No turning back !</small>
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className="btn-group ms-2">
                                <button type="button" className="btn btn-sm btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
                                    ⏬ Export selected ({forBulk.length})
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end p-0">
                                    <li>
                                        <button className="dropdown-item" onClick={() => exportData('json', 'selected')}>
                                            JSON
                                            <small className="text-muted"><br/>To be reimported in this app</small>
                                        </button>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider m-0" />
                                    </li>
                                    <li>
                                        <button className="dropdown-item" onClick={() => exportData('csv', 'selected')}>
                                            CSV
                                            <small className="text-muted"><br/>Human readable</small>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </>
                    }

                    {isEmpty(forBulk) && !isEmpty(filtered) &&
                        <>
                            <div className="btn-group ms-2">
                                <button type="button" className="btn btn-sm btn-outline-info dropdown-toggle" data-bs-toggle="dropdown">
                                    ⏬ Export these {filtered.length} rows
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end p-0">
                                    <li>
                                        <button className="dropdown-item" onClick={() => exportData('json')}>
                                            JSON
                                            <small className="text-muted"><br/>To be reimported in this app</small>
                                        </button>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider m-0" />
                                    </li>
                                    <li>
                                        <button className="dropdown-item" onClick={() => exportData('csv')}>
                                            CSV
                                            <small className="text-muted"><br/>Human readable</small>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </>
                    }


                </div>
            </div>
            {!isEmpty(operations) && showFilters && (
                <FilterComponent />
            )}
        </>
    )
}

export default forwardRef(OperationToolbarComponent)