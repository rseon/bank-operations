import {CHECKBOX_STATES, currency, formatDate, isEmpty} from "@/helpers"
import {getBalanceTotal, getCreditTotal, getDebitTotal} from "@/helpers/operation"
import {forwardRef, useImperativeHandle, useMemo, useRef, useState} from "react";
import SortByComponent from "@/components/Operation/SortByComponent";
import {useOperation} from "@/providers/operation";
import Link from "next/link";
import {parseMarkdown} from "@/helpers/markdown";

const OperationTableComponent = ({
    formComponent,
    toolbarComponent,
    listChecked,
    setListChecked,
}, ref) => {
    const {operations, filtered} = useOperation()

    const totals = useMemo(() => {
        let filteredAndChecked = filtered
        if (!isEmpty(listChecked)) {
            filteredAndChecked = filteredAndChecked.filter(op => listChecked.includes(op.id))
        }

        return {
            credit: getCreditTotal(filteredAndChecked),
            debit: getDebitTotal(filteredAndChecked),
            balance: getBalanceTotal(filteredAndChecked),
        }
    }, [filtered, listChecked])

    const nbFiltered = useMemo(() => {
        return filtered.length
    }, [filtered])

    const checkboxAll = useRef()
    const [isAllChecked, setIsAllChecked] = useState(CHECKBOX_STATES.empty)

    useImperativeHandle(ref, () => ({
        setCheckboxChecked,
    }))

    const showModalOperation = (operation = null) => {
        let modalId = '#createModal'
        if (operation) {
            modalId = "#editModal"
            formComponent.current?.setOperation(operation)
        }

        const { Modal } = require("bootstrap")
        const myModal = new Modal(modalId)
        myModal.show()
    }

    const setCheckboxChecked = (type) => {
        setIsAllChecked(type)
        const checkbox = checkboxAll.current
        if (!checkbox) {
            return
        }
        switch (type) {
            case CHECKBOX_STATES.empty:
                checkbox.checked = false
                checkbox.indeterminate = false
                break
            case CHECKBOX_STATES.checked:
                checkbox.checked = true
                checkbox.indeterminate = false
                break
            case CHECKBOX_STATES.indeterminate:
                checkbox.checked = false
                checkbox.indeterminate = true
                break
        }
    }

    const handleCheckbox = (event) => {
        const value = event.target.value
        const checked = event.target.checked

        let list = []
        if (value === '*') {
            checkboxAll.current.indeterminate = false
            checkboxAll.current.checked = checked
            if (checked) {
                setIsAllChecked(CHECKBOX_STATES.checked)
                list = filtered.map(f => f.id)
            }
            else {
                setIsAllChecked(CHECKBOX_STATES.empty)
                list = []
            }
        }
        else {
            list = [...listChecked, value]
            if (!checked) {
                list = list.filter(id => id !== value)
            }

            switch (list.length) {
                case 0:
                    setIsAllChecked(CHECKBOX_STATES.empty)
                    checkboxAll.current.checked = false
                    checkboxAll.current.indeterminate = false
                    break
                case filtered.length:
                    setIsAllChecked(CHECKBOX_STATES.checked)
                    checkboxAll.current.checked = true
                    checkboxAll.current.indeterminate = false
                    break
                default:
                    setIsAllChecked(CHECKBOX_STATES.indeterminate)
                    checkboxAll.current.checked = false
                    checkboxAll.current.indeterminate = true
                    break
            }
        }

        setListChecked(list)
        toolbarComponent.current?.setForBulk(list)
    }

    return (
        <table className="table table-striped table-hover table-sticky-header table-sticky-footer">
            <thead className="table-light">
                <tr>
                    {nbFiltered > 1 &&
                        <th width={1}>
                            <input ref={checkboxAll} value="*" type="checkbox" className="form-check-input" onChange={handleCheckbox} />
                        </th>
                    }
                    <th width={1} className="text-nowrap">
                        Date
                        {nbFiltered > 1 && <SortByComponent field="date" />}
                    </th>
                    <th width={1} className="text-nowrap">
                        Type
                        {nbFiltered > 1 && <SortByComponent field="type" />}
                    </th>
                    <th width={1} className="text-nowrap">
                        Category
                        {nbFiltered > 1 && <SortByComponent field="category" />}
                    </th>
                    {/* @todo Hide subcategory
                    <th width={1} className="text-nowrap">
                        Sub-category
                        {nbFiltered > 1 && <SortByComponent field="subcat" />}
                    </th>
                    */}
                    <th>Detail</th>
                    <th width={1}>Debit</th>
                    <th width={1}>Credit</th>
                    <th width={1}></th>
                </tr>
            </thead>
            <tbody className="table-group-divider">
                {isEmpty(operations) &&
                    <tr>
                        <td colSpan={10} className="text-center p-5 bg-light">
                            <span className="text-info">No operation</span>
                            <span className="text-muted">
                                <br/>
                                <br/>
                                <strong>Note :</strong> All data is saved locally on your browser : nothing is sent to any server !<br/>
                                This means that if you use another browser, the data will not be present.
                                <br />
                                <br />
                                You can however export and/or import your data.
                            </span>
                            <br />
                            <br />

                            <div className="d-flex justify-content-center">
                                <button className="btn btn-outline-primary btn-sm mb-3 me-4" onClick={() => showModalOperation()}>
                                    ➕ Create first operation
                                </button>
                                - or -
                                <Link href="/import" className="btn btn-outline-info btn-sm mb-3 ms-4">
                                    📂 Import your data
                                </Link>
                            </div>

                        </td>
                    </tr>
                }
                {!isEmpty(operations) && isEmpty(filtered) &&
                    <tr>
                        <td colSpan={10} className="text-center p-5 bg-light">
                            <span className="text-info">No operation matching criterias</span>
                        </td>
                    </tr>
                }
                {filtered.map((op, idx) => (
                    <tr key={idx}>
                        {nbFiltered > 1 &&
                            <th width={1}>
                                <input type="checkbox" value={op.id} className="form-check-input" checked={listChecked.includes(op.id)} onChange={handleCheckbox} />
                            </th>
                        }
                        <td className="text-nowrap">
                            {formatDate(op.date)}
                        </td>
                        <td className="text-nowrap">
                            {op.type}
                        </td>
                        <td className="text-nowrap">
                            {op.category}
                        </td>
                        {/* @todo Hide subcategory
                        <td className="text-nowrap">
                            {op.subcat}
                        </td>
                        */}
                        <td className="text-nowrap" dangerouslySetInnerHTML={{ __html: parseMarkdown(op.detail) }} />
                        <td className="text-nowrap text-end">
                            {op.amount < 0 && (
                                <strong className="text-danger">
                                    {currency(op.amount)}
                                </strong>
                            )}
                        </td>
                        <td className="text-nowrap text-end">
                            {op.amount >= 0 && (
                                <strong className="text-success">
                                    {currency(op.amount)}
                                </strong>
                            )}
                        </td>
                        <td>
                            <button className="btn btn-link btn-sm text-decoration-none" onClick={() => showModalOperation(op)}>
                                ✏️
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
            {!isEmpty(filtered) &&
                <tfoot className="table-light">
                    <tr>
                        {/* @todo Hide subcategory <td colSpan={nbFiltered > 1 ? 6 : 5} className="text-end">*/}
                        <td colSpan={nbFiltered > 1 ? 5 : 4} className="text-end">
                            Balance : {' '}
                            <strong className={`text-${totals.balance >= 0 ? 'success' : 'danger'}`}>
                                {currency(totals.balance)}
                            </strong>
                        </td>
                        <td className="text-end text-nowrap">
                            <strong className="text-danger">
                                {currency(totals.debit)}
                            </strong>
                        </td>
                        <td className="text-end text-nowrap">
                            <strong className="text-success">
                                {currency(totals.credit)}
                            </strong>
                        </td>
                        <td></td>
                    </tr>
                </tfoot>
            }
        </table>
    )
}

export default forwardRef(OperationTableComponent)