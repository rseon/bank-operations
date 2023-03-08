import {CHECKBOX_STATES, currency, formatDate, isEmpty, nl2br} from "@/helpers"
import {getBalanceTotal, getCreditTotal, getDebitTotal} from "@/helpers/operation"
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";

const TableComponent = ({
	data,
	filtered,
	formComponent,
	toolbarComponent,
}, ref) => {
	const { operations } = data
	const [totals, setTotals] = useState({
		credit: 0,
		debit: 0,
		balance: 0,
	})
	const checkboxAll = useRef()
	const [isAllChecked, setIsAllChecked] = useState(CHECKBOX_STATES.empty)
	const [listChecked, setListChecked] = useState([])
	const [nbFiltered, setNbFiltered] = useState(0)

	useImperativeHandle(ref, () => ({
		setCheckboxChecked,
		setListChecked
	}))

	useEffect(() => {
		setTotals({
			credit: getCreditTotal(filtered),
			debit: getDebitTotal(filtered),
			balance: getBalanceTotal(filtered),
		})
		setNbFiltered(filtered.length)
	}, [filtered])

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

	const importData = () => {
		toolbarComponent.current?.importData()
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
		<table className="table table-striped table-hover">
			<thead className="table-light">
				<tr>
					{nbFiltered > 1 &&
						<th width={1}>
							<input ref={checkboxAll} value="*" type="checkbox" className="form-check-input" onChange={handleCheckbox} />
						</th>
					}
					<th width={1}>Date</th>
					<th width={1}>Type</th>
					<th width={1}>Recipient</th>
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
								<button className="btn btn-outline-info btn-sm mb-3 ms-4" onClick={importData}>
									⬆️ Import your data
								</button>
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
							{op.recipient}
						</td>
						<td className="text-nowrap" dangerouslySetInnerHTML={{ __html: nl2br(op.detail) }} />
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

export default forwardRef(TableComponent)