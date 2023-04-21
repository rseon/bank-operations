import {forwardRef, useImperativeHandle, useMemo, useRef, useState} from "react"
import {formatDate} from "@/helpers"
import {createOperation, destroyOperation, updateOperation} from "@/helpers/operation"
import {useOperation} from "@/providers/operation";
import MarkdownToolbar from "@/components/MarkdownToolbar";

const OperationFormComponent = ({
    method,
    onSubmitted,
}, ref) => {

    const inputDetail = useRef(null)

    const {
        operations,
        data, reloadList,
        filtered, setFiltered,
        filters, setFilters,
        sortBy, saveSortBy
    } = useOperation()

    const { types, recipients } = useMemo(() => {
        return data
    }, [data])

    const defaultValues = {
        date: formatDate(new Date(), 'yyyy-MM-dd'),
        amount: '',
        type: '',
        recipient: '',
        detail: '',
    }

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState(defaultValues)
    const [isUpdate, setIsUpdate] = useState(false)

    const setOperation = (operation) => {
        setIsUpdate(true)
        setFormData({
            id: operation.id,
            date: formatDate(operation.date, 'yyyy-MM-dd') || '',
            amount: operation.amount || '',
            type: operation.type || '',
            recipient: operation.recipient || '',
            detail: operation.detail || '',
        })
    }

    useImperativeHandle(ref, () => ({
        setOperation
    }))

    const updateField = (e) => {
        const { name, value } = e.target
        updateValue(name, value)
    }

    const updateValue = (name, value) => {
        setFormData(state => ({
            ...state,
            [name]: value
        }))
    }

    const showToast = () => {
        const { Toast } = require("bootstrap")
        const myToast = new Toast("#liveToast")
        myToast.show()
    }

    const handleSubmit = async (event) => {
        setLoading(true)
        event.preventDefault()

        let type = types.find(t => {
            return t.toLowerCase() === formData.type.toLowerCase()
        })
        if (type) {
            formData.type = type
        }

        let recipient = recipients.find(r => {
            return r.toLowerCase() === formData.recipient.toLowerCase()
        })
        if (recipient) {
            formData.recipient = recipient
        }

        if (method === 'create') {
            createOperation({
                id: Date.now(),
                amount: formData.amount,
                date: formData.date,
                detail: formData.detail,
                type: formData.type,
                recipient: formData.recipient,
            })
        }

        if (method === 'update') {
            updateOperation(formData.id, {
                amount: formData.amount,
                date: formData.date,
                detail: formData.detail,
                type: formData.type,
                recipient: formData.recipient,
            })
        }

        showToast()
        setLoading(false)
        setFormData(defaultValues)
        onSubmitted()
    }

    const deleteOperation = async () => {
        if (confirm('Are you sure to delete this operation ?')) {
            setLoading(true)

            destroyOperation(formData.id)

            showToast()
            setLoading(false)
            setFormData(defaultValues)
            onSubmitted()
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-6">
                        <div className="mb-3">
                            <label htmlFor="date" className="form-label">Date</label>
                            <input id="date" name="date" type="date" value={formData.date} className="form-control" required disabled={loading} onChange={updateField} autoComplete="off" />
                            <span className="form-text">Date of the operation</span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="mb-3">
                            <label htmlFor="amount" className="form-label">Amount</label>
                            <div className="input-group">
                                <input id="amount" name="amount" type="number" value={formData.amount} step="0.01" pattern="d+(.d{2})" className="form-control" required disabled={loading} onChange={updateField} autoComplete="off" />
                                <span className="input-group-text">€</span>
                            </div>
                            <span className="form-text">Amount of the operation. Can be negative using <code>-</code></span>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6">
                        <div className="mb-3">
                            <label htmlFor="type" className="form-label">Type</label>
                            <input id="type" name="type" list="types" value={formData.type} className="form-control" required disabled={loading} onChange={updateField} autoComplete="off" />
                            <datalist id="types">
                                {types.map((type, idx) => (
                                    <option key={idx} value={type} />
                                ))}
                            </datalist>
                            <span className="form-text">Example: <em>Credit card</em>, <em>Bank transfer</em>...</span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="mb-3">
                            <label htmlFor="recipient" className="form-label">Recipient</label>
                            <input id="recipient" name="recipient" list="recipients" value={formData.recipient} className="form-control" required disabled={loading} onChange={updateField} autoComplete="off" />
                            <datalist id="recipients">
                                {recipients.map((recipient, idx) => (
                                    <option key={idx} value={recipient} />
                                ))}
                            </datalist>
                            <span className="form-text">Example: <em>Insurance</em>, <em>Phone subscription</em>...</span>
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="detail" className="form-label">Description</label>
                    {inputDetail?.current &&
                        <MarkdownToolbar
                            input={inputDetail.current}
                            onMarkdown={(value) => updateValue('detail', value)}
                            allowed={['bold', 'italic', 'strike']}
                        />
                    }
                    <textarea id="detail" name="detail" ref={inputDetail} value={formData.detail} className="form-control" disabled={loading} onChange={updateField} autoComplete="off" rows={5} />
                </div>

                <button type="submit" className="btn btn-outline-primary btn-lg d-flex w-100 justify-content-center align-items-center" disabled={loading}>
                    {loading && <span className="spinner-border spinner-border-sm me-2" /> }
                    {!loading && <span className="me-2">💾</span> }
                    Save operation
                </button>
            </form>

            {isUpdate &&
                <button className="btn btn-outline-danger btn-sm mt-3" disabled={loading} onClick={deleteOperation}>
                    🗑️ Delete
                </button>
            }
        </>
    )
}

export default forwardRef(OperationFormComponent)