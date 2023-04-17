import Layout from "@/pages/_layout";
import {fileIsCsv, fileIsJson, formatCsv, formatJson, getBaseConfigForCsvFormat, getHumanReadableSize, getTypeByMime} from "@/helpers/file";
import {useMemo, useState} from "react";
import {currency, deepEqual, formatDate, formatDateFromFormat, isEmpty} from "@/helpers";
import {useOperation} from "@/providers/operation";
import {useRouter} from "next/router";
import {setOperationsData} from "@/helpers/operation";
import parseMarkdown from "@/helpers/markdown";

export default function Page() {

    const router = useRouter();
    const { operations, reloadList } = useOperation()
    const [file, setFile] = useState()
    const [content, setContent] = useState()
    const [rawContent, setRawContent] = useState()
    const [configure, setConfigure] = useState(false)
    const [configuration, setConfiguration] = useState(getBaseConfigForCsvFormat())
    const [showDateFormats, setShowDateFormats] = useState(false)
    const [contentErrors, setContentErrors] = useState(new Set())

    const operationsToImport = useMemo(() => {
        if (!file || !content || configure) {
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
    }, [file, content, operations, configure])

    const newOperationsToImport = useMemo(() => {
        return operationsToImport.filter(op => !op.exists).map(row => {
            delete row.exists
            return row
        }).map(op => {
            try {
                formatDateFromFormat(op.date, configuration.dateFormat, 'dd/MM/yyyy', true)
                formatDate(op.date, 'dd/MM/yyyy', true)
                currency(op.amount, true)
            } catch (e) {
                setContentErrors(state => {
                    return new Set(state.add(`${e.constructor.name} : ${e.message}`))
                })
            }

            return op
        })
    }, [operationsToImport, setContentErrors, configuration])

    const errors = useMemo(() => {
        return [...contentErrors.values()]
    }, [contentErrors])

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

        setConfigure(false)
        setFile(file)

        const reader = new FileReader();
        reader.onload = (e) => {
            switch (getTypeByMime(file.type)) {
                case 'CSV':
                    setConfigure(true)
                    setRawContent(e.target.result)
                    break
                case 'JSON':
                    setContent(formatJson(e.target.result))
                    break
                default:
                    alert(`File type ${file.type} invalid`)
                    break
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
        setRawContent(null)
        setConfigure(false)
        setContentErrors(new Set())
    }

    const onChangeConfiguration = (event) => {
        setConfiguration((state) => {
            return {
                ...state,
                [event.target.name]: event.target.value
            }
        })
    }

    const testDateFormat = () => {
        const format = configuration.dateFormat || 'yyyy-MM-dd';
        try {
            const current = formatDate(new Date(), format, true)
            alert(current)
        } catch (error) {
            alert(`Format "${format}" is invalid (${error})`)
        }
    }

    const validateConfiguration = () => {
        setContent(formatCsv(rawContent, configuration))
        setConfigure(false)
    }

    return (
        <Layout
            metas={{
                title: "Import"
            }}
        >
            {!content && !configure &&
                <>
                    <div className="alert alert-info">
                        Import your operations from <strong>CSV</strong> or <strong>JSON</strong> file.<br/>
                        Don&apos;t worry: a visualization step will be displayed before the file is processed.
                    </div>
                    <div className="alert alert-light">
                        <h4 className="alert-heading">🚨 CSV import tips</h4>
                        In order to properly import a CSV file, it must be a text file (not an Excel / Calc file) with <code>.csv</code> extension.<br/>
                        In addition, it must contain the following columns in this exact order:
                        <span className="badge text-bg-light ms-1 text-uppercase">date</span>
                        <span className="badge text-bg-light ms-1 text-uppercase">type</span>
                        <span className="badge text-bg-light ms-1 text-uppercase">recipient</span>
                        <span className="badge text-bg-light ms-1 text-uppercase">detail</span>
                        <span className="badge text-bg-light ms-1 text-uppercase">debit</span>
                        <span className="badge text-bg-light ms-1 text-uppercase">credit</span>
                    </div>
                    <div className="d-grid gap-2 col-6 mx-auto my-5">
                        <input className="d-none" type="file" accept="application/json,text/csv" id="import" onChange={handleImport} />
                        <button className="btn btn-primary btn-lg" onClick={importData}>
                            📂 Import your file
                        </button>
                    </div>
                </>
            }
            {(content || configure) &&
                <>
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                        <div>
                            <span className="badge text-bg-primary text-uppercase me-1" title="File type">{getTypeByMime(file.type)}</span>
                            <strong>{file.name}</strong>
                            <small className="badge bg-info ms-2" title="File size">{getHumanReadableSize(file.size)}</small>
                            {fileIsJson(file) && content.meta &&
                                <>
                                    <span className="badge text-bg-dark text-uppercase ms-1" title="Version used of this tool for backup">{content.meta.version}</span>
                                    <span className="badge text-bg-light text-uppercase ms-1" title="Date of backup">{formatDate(content.meta.date, 'dd/MM/yyyy HH:mm')}</span>
                                </>
                            }
                            {!isEmpty(operationsToImport) &&
                                <small className="badge bg-success ms-2">{operationsToImport.length} rows</small>
                            }
                        </div>

                        <div>
                            {!configure && fileIsCsv(file) &&
                                <button className="btn btn-outline-warning me-3" onClick={() => setConfigure(true)}>
                                    ◀️ Back to configuration
                                </button>
                            }

                            <button className="btn btn-outline-danger" onClick={cancelImport}>
                                Cancel import
                            </button>
                        </div>
                    </div>
                    {configure &&
                        <>
                            <div className="row mb-3">
                                <div className="col-4">
                                    <label htmlFor="config_skip" className="form-label">Number of lines to skip at the beginning of the file</label>
                                    <div className="input-group">
                                        <input id="config_skip" name="skip" type="number" min={0} className="form-control" value={configuration.skip} onChange={onChangeConfiguration} autoComplete="off" />
                                        <span className="input-group-text">rows</span>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="config_delimiter" className="form-label">Column delimiter</label>
                                    <select name="delimiter" id="config_delimiter" className="form-control" value={configuration.delimiter} onChange={onChangeConfiguration} autoComplete="off">
                                        <option value=";">;</option>
                                        <option value=",">,</option>
                                    </select>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="config_dateformat" className="form-label">Date format</label>
                                    <input type="text" name="dateFormat" id="config_dateformat" className="form-control" value={configuration.dateFormat} onChange={onChangeConfiguration} autoComplete="off" />
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-link p-0" onClick={() => setShowDateFormats(!showDateFormats)}>
                                            <small>
                                                {showDateFormats && "Hide date formats"}
                                                {!showDateFormats && "Show date formats"}
                                            </small>
                                        </button>
                                        <button className="btn btn-link p-0" onClick={testDateFormat}>
                                            <small>Test date format</small>
                                        </button>
                                    </div>

                                    {showDateFormats &&
                                        <div className="alert alert-light">
                                            <ul className="mb-0 list-unstyled">
                                                <li><code>yyyy</code> : Year with 4 digits</li>
                                                <li><code>MM</code> : Month with 2 digits</li>
                                                <li><code>dd</code> : Day of the month with 2 digits</li>
                                            </ul>
                                            <a href="https://date-fns.org/v2.29.3/docs/format" target="_blank">
                                                All formats
                                            </a>
                                        </div>
                                    }
                                </div>
                            </div>
                            <button className="btn btn-outline-success" onClick={validateConfiguration}>
                                Continue ▶️
                            </button>
                        </>
                    }
                    {!configure && content &&
                        <>
                            <div className="alert alert-info">
                                View the content of your file here. If everything looks good, you can import them.

                                {operationsToImport.length !== newOperationsToImport.length &&
                                    <>
                                        <br/>
                                        <strong>Note:</strong> rows in green already exists and will not be imported.
                                    </>
                                }
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
                                                <td className="text-nowrap" dangerouslySetInnerHTML={{ __html: parseMarkdown(op.detail) }} />
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

                            {!isEmpty(errors) &&
                                <div className="alert alert-danger">
                                    <p>There seems to be some problems in the content, please correct them before downloading the file again :</p>
                                    <ul className="mb-0">
                                        {errors.map((err, idx) => (
                                            <li key={idx}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            }

                            {isEmpty(errors) && !isEmpty(newOperationsToImport) &&
                                <div className="d-grid gap-2 col-6 mx-auto my-5">
                                    <button className="btn btn-outline-success btn-lg" onClick={validateImport}>
                                        ✔️ Confirm import {newOperationsToImport.length} rows
                                    </button>
                                </div>
                            }
                        </>
                    }
                </>
            }

        </Layout>
    )
}