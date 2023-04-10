import Layout from "@/pages/_layout";
import {fileIsJson, formatCsv, formatJson, getHumanReadableSize, getTypeByMime} from "@/helpers/file";
import {useMemo, useState} from "react";
import {currency, deepEqual, formatDate, isEmpty, nl2br} from "@/helpers";
import {useOperation} from "@/providers/operation";
import {useRouter} from "next/router";
import {setOperationsData} from "@/helpers/operation";

export default function Page() {

    const router = useRouter();
    const { operations, reloadList } = useOperation()
    const [file, setFile] = useState()
    const [content, setContent] = useState()

    const operationsToImport = useMemo(() => {
        if (!file || !content) {
            return []
        }
        const ops = fileIsJson(file)
            ? (content.operations || [])
            : (content || [])

        return ops.map((row, idx) => {
            row.id = Date.now() + idx
            row.exists = !!operations.find(operation => {
                const rowCopy = {...row}
                const opCopy = {...operation}
                delete rowCopy.id
                delete rowCopy.exists
                delete opCopy.id
                delete opCopy.exists
                rowCopy.amount = parseFloat(rowCopy.amount)
                return deepEqual(opCopy, rowCopy)
            })
            return row
        })
    }, [file, content, operations])

    const newOperationsToImport = useMemo(() => {
        return operationsToImport.filter(op => !op.exists).map(row => {
            delete row.exists
            return row
        })
    }, [operationsToImport])

    const importData = () => {
        const input = document.getElementById('import')
        input.value = ''
        input.click()
    }

    const handleImport = (e) => {
        const file = e.target.files[0]
        if (!file) {
            return
        }

        setFile(file)

        const reader = new FileReader();
        reader.onload = (e) => {
            let result
            switch (file.type) {
                case 'text/csv':
                case 'application/vnd.ms-excel':
                    result = formatCsv(e.target.result)
                    break
                case 'application/json':
                    result = formatJson(e.target.result)
                    break
                default:
                    alert(`File type ${file.type} invalid`)
                    break
            }

            if (result) {
                setContent(result)
            }
        };
        reader.readAsBinaryString(file);
    }

    const validateImport = () => {
        // Merge if existing operations
        let nbRows = newOperationsToImport.length
        if (!isEmpty(operations)) {
            if (nbRows > 0) {
                setOperationsData([
                    ...newOperationsToImport,
                    ...operations,
                ])
            }
        }
        else {
            setOperationsData(newOperationsToImport)
        }

        reloadList()

        router.push('/')
        alert(`${nbRows} rows added!`)
    }

    const cancelImport = () => {
        setContent(null)
    }

    return (
        <Layout
            metas={{
                title: "Import"
            }}
        >
            {!content &&
                <>
                    <div className="alert alert-info">
                        Import your operations from <strong>CSV</strong> or <strong>JSON</strong> file.
                    </div>
                    <div className="alert alert-light">
                        <h4 className="alert-heading">🚨 CSV import tips</h4>
                        <p>In order to import CSV file, your file must :</p>
                        <ul className="mb-0">
                            <li>Be a CSV file (and not an Excel / Calc file)</li>
                            <li>Use the <span className="badge text-bg-light">;</span> as a separator</li>
                            <li>
                                Have these columns in this order :
                                <span className="badge text-bg-light ms-1 text-uppercase">date</span>
                                <span className="badge text-bg-light ms-1 text-uppercase">type</span>
                                <span className="badge text-bg-light ms-1 text-uppercase">recipient</span>
                                <span className="badge text-bg-light ms-1 text-uppercase">detail</span>
                                <span className="badge text-bg-light ms-1 text-uppercase">debit</span>
                                <span className="badge text-bg-light ms-1 text-uppercase">credit</span>
                            </li>
                        </ul>
                    </div>
                    <div className="d-grid gap-2 col-6 mx-auto my-5">
                        <input className="d-none" type="file" accept="application/json,text/csv" id="import" onChange={handleImport} />
                        <button className="btn btn-primary btn-lg" onClick={importData}>
                            📂 Import your file
                        </button>
                    </div>
                </>
            }
            {content &&
                <>
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                        <div>
                            <span className="badge text-bg-primary text-uppercase me-1">{getTypeByMime(file.type)}</span>
                            <strong>{file.name}</strong>
                            <small className="badge bg-info ms-2">{getHumanReadableSize(file.size)}</small>
                            {fileIsJson(file) && content.meta &&
                                <>
                                    <span className="badge text-bg-dark text-uppercase ms-1">{content.meta.version}</span>
                                    <span className="badge text-bg-light text-uppercase ms-1">{formatDate(content.meta.date, 'dd/MM/yyyy HH:mm')}</span>
                                </>
                            }
                            <small className="badge bg-success ms-2">{operationsToImport.length} rows</small>
                        </div>

                        <button className="btn btn-outline-danger" onClick={cancelImport}>
                            Cancel import
                        </button>
                    </div>

                    <div className="alert alert-info">
                        View the content of your file here. If everything looks good, you can import them.<br/>
                        <strong>Note:</strong> rows in green already exists and will not be imported
                    </div>

                    <div className="table-responsive table-responsive-height mb-3">
                        <table className="table table-hover table-sticky-header mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th width={1}>Date</th>
                                    <th width={1}>Type</th>
                                    <th width={1}>Recipient</th>
                                    <th>Detail</th>
                                    <th width={1}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isEmpty(operationsToImport) &&
                                    <tr>
                                        <td colSpan={10} className="text-center p-5 bg-light">
                                            <span className="text-info">There is no operation in file to import in this file</span>
                                        </td>
                                    </tr>
                                }
                                {operationsToImport.map((op, idx) => (
                                    <tr key={idx} className={op.exists ? 'table-success opacity-50' : ''}>
                                        <td className="text-nowrap">
                                            {formatDate(op.date)}
                                        </td>
                                        <td className="text-nowrap">
                                            {op.type}
                                        </td>
                                        <td className="text-nowrap">
                                            {op.recipient}
                                        </td>
                                        <td className="text-nowrap" dangerouslySetInnerHTML={{ __html: nl2br(op.detail) }} />
                                        <td className="text-nowrap text-end">
                                            {currency(op.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {!isEmpty(operationsToImport) && isEmpty(newOperationsToImport) &&
                        <div className="alert alert-warning">
                            All operations already exists, no new operation to import
                        </div>
                    }

                    {!isEmpty(newOperationsToImport) &&
                        <div className="d-grid gap-2 col-6 mx-auto my-5">
                            <button className="btn btn-outline-success btn-lg" onClick={validateImport}>
                                ✔️ Confirm import {newOperationsToImport.length} rows
                            </button>
                        </div>
                    }
                </>
            }
        </Layout>
    )
}