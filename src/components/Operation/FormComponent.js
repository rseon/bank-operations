import {forwardRef, useImperativeHandle, useMemo, useRef, useState} from "react"
import { DIRECT_DEBIT_LABEL, formatDate } from '@/helpers'
import {createOperation, destroyOperation, updateOperation} from "@/helpers/operation"
import {useOperation} from "@/providers/operation";
import MarkdownToolbar from "@/components/MarkdownToolbar";
import DirectDebitList from '@/components/Operation/DirectDebitListComponent'

const OperationFormComponent = ({
    method,
    onSubmitted,
}, ref) => {

    const inputDetail = useRef(null)

    const {data} = useOperation()

    const { types, categories, subcats } = useMemo(() => {
        return data
    }, [data])

    const defaultValues = {
        date: formatDate(new Date(), 'yyyy-MM-dd'),
        amount: '',
        type: '',
        category: '',
        subcat: '',
        detail: '',
    }

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState(defaultValues)
    const [isUpdate, setIsUpdate] = useState(false)
    const [showDirectDebit, setShowDirectDebit] = useState(false)

    const setOperation = (operation) => {
        setIsUpdate(true)
        setFormData({
            id: operation.id,
            date: formatDate(operation.date, 'yyyy-MM-dd') || '',
            amount: operation.amount || '',
            type: operation.type || '',
            category: operation.category || '',
            subcat: operation.subcat || '',
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

        let category = categories.find(r => {
            return r.toLowerCase() === formData.category.toLowerCase()
        })
        if (category) {
            formData.category = category
        }

        let subcat = subcats.find(r => {
            return r.toLowerCase() === formData.subcat.toLowerCase()
        })
        if (subcat) {
            formData.subcat = subcat
        }

        if (method === 'create') {
            createOperation({
                id: Date.now(),
                amount: formData.amount,
                date: formData.date,
                detail: formData.detail,
                type: formData.type,
                category: formData.category,
                subcat: formData.subcat,
            })
        }

        if (method === 'update') {
            updateOperation(formData.id, {
                amount: formData.amount,
                date: formData.date,
                detail: formData.detail,
                type: formData.type,
                category: formData.category,
                subcat: formData.subcat,
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

    const setDirectDebit = ({ category, amount }) => {
        updateValue('category', category)
        updateValue('amount', amount)
        updateValue('type', DIRECT_DEBIT_LABEL)
        setShowDirectDebit(false)
    }

    const resetForm = () => {
        setFormData(defaultValues)
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-6">
                        <button type="button" className="btn btn-link btn-sm text-decoration-none" onClick={() => setShowDirectDebit(!showDirectDebit)}>
                            Existing direct debit
                        </button>
                    </div>
                    <div className="col-6 text-end">
                        <button type="button" className="btn btn-link btn-sm text-decoration-none" onClick={() => resetForm()}>
                            Clear
                        </button>
                    </div>
                </div>

                {showDirectDebit && (
                  <DirectDebitList
                    className="mb-2"
                    onSetDirectDebit={value => setDirectDebit(value)}
                  />
                )}

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
                    <div className="col-4">
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
                    <div className="col-4">
                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">Category</label>
                            <input id="category" name="category" list="categories" value={formData.category} className="form-control" required disabled={loading} onChange={updateField} autoComplete="off" />
                            <datalist id="categories">
                                {categories.map((category, idx) => (
                                    <option key={idx} value={category} />
                                ))}
                            </datalist>
                            <span className="form-text">Example: <em>Car</em>...</span>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="mb-3">
                            <label htmlFor="subcat" className="form-label">
                                Sub-category <span className="form-text">optional</span>
                            </label>
                            <input id="subcat" name="subcat" list="subcats" value={formData.subcat} className="form-control" disabled={loading} onChange={updateField} autoComplete="off" />
                            <datalist id="subcats">
                                {subcats.map((subcat, idx) => (
                                    <option key={idx} value={subcat} />
                                ))}
                            </datalist>
                            <span className="form-text">Example: <em>Parking</em>...</span>
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
                    {loading && <span className="spinner-border spinner-border-sm me-2" />}
                    {!loading && <span className="me-2">💾</span>}
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