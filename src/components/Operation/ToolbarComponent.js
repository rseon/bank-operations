import {deepEqual, isEmpty} from "@/helpers";
import {forwardRef, useImperativeHandle, useMemo, useState} from "react";
import FilterComponent from "@/components/Operation/FilterComponent";
import {setOperationsData, exportCSV, exportJson, importCSV, importJson, removeOperations} from "@/helpers/operation";
import {useOperation} from "@/providers/operation";

const OperationToolbarComponent = ({
    listChecked
}, ref) => {

    const {operations, filtered, filters} = useOperation()

    const [showFilters, setShowFilters] = useState(false)
    const [forBulk, setForBulk] = useState([])

    const nbFilters = useMemo(() => {
        return Object.values(filters).filter(f => f !== '').length
    }, [filters])

    const importData = () => {
        const input = document.getElementById('import')
        input.value = ''
        input.click()
    }

    useImperativeHandle(ref, () => ({
        importData,
        setForBulk
    }))

    const handleImport = (e) => {
        const file = e.target.files[0]
        if (!file) {
            return
        }

        if (!isEmpty(operations) && !confirm('This will add missing data. Continue?')) {
            return
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            let result
            switch (file.type) {
                case 'text/csv':
                case 'application/vnd.ms-excel':
                    result = importCSV(e.target.result)
                    break
                case 'application/json':
                    result = importJson(e.target.result)
                    break
                default:
                    alert(`File type ${file.type} invalid`)
                    break
            }

            if (result) {
                // Merge if existing operations
                let nbRows = result.length
                if (!isEmpty(operations)) {
                    const resultFiltered = result.filter(row => {
                        return !operations.find(operation => {
                            const rowWithoutId = {...row}
                            const operationWithoutId = {...operation}
                            delete rowWithoutId.id
                            delete operationWithoutId.id
                            return deepEqual(operationWithoutId, rowWithoutId)
                        })
                    })

                    nbRows = resultFiltered.length

                    if (nbRows > 0) {
                        setOperationsData([
                            ...resultFiltered,
                            ...operations,
                        ])
                    }
                }
                else {
                    setOperationsData(result)
                }
                onUpdated()

                if (nbRows > 0) {
                    alert(`${nbRows} rows added!`)
                }
                else {
                    alert(`No row added.`)
                }
            }
        };
        reader.readAsBinaryString(file);
    }

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
                exportCSV(rows)
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
                                <button type="button" className="btn btn-sm btn-outline-info dropdown-toggle" data-bs-toggle="dropdown">
                                    ⬇️ Export selected ({forBulk.length})
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

                    {isEmpty(forBulk) &&
                        <>
                            <input className="d-none" type="file" accept="application/json,.json,text/csv,.csv" id="import" onChange={handleImport} />
                            <button className="btn btn-outline-info btn-sm" onClick={importData}>
                                ⬆️ Import
                            </button>

                            {!isEmpty(filtered) &&
                                <>
                                    <div className="btn-group ms-2">
                                        <button type="button" className="btn btn-sm btn-outline-info dropdown-toggle" data-bs-toggle="dropdown">
                                            ⬇️ Export these {filtered.length} rows
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