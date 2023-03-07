import {currency, DB_NAME, dbSave, exportCSV, exportJson, formatDate, importCSV, importJson, isEmpty, nl2br} from "@/helpers"
import OperationFormComponent from "@/components/OperationFormComponent"
import {useEffect, useRef} from "react"

/**
 * @todo Add filters
 * @todo Add pagination
 * @todo Inline creation
 * @todo Inline edition
 */

export default function OperationListComponent({
	data,
	onUpdated,
}) {
	const { operations, credit, debit, balance } = data

	const formComponent = useRef()

	useEffect(() => {
		const { Dropdown } = require("bootstrap")
		const dropdownElementList = document.querySelectorAll('.dropdown-toggle')
		const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new Dropdown(dropdownToggleEl))
	}, [])

	const editOperation = (operation) => {
		formComponent.current?.setOperation(operation)

		const { Modal } = require("bootstrap")
		const myModal = new Modal("#editModal")
		myModal.show()
	}

	const exportData = (format) => {
		/**
		 * @todo Export with filters
		 */

		switch (format) {
			case 'json':
				exportJson(operations)
				break
			case 'csv':
				exportCSV(operations)
				break
		}
	}

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

		if (!isEmpty(operations) && !confirm('This will overwrite all data. Continue?')) {
			return
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			// @todo Accents has problems !

			let result
			switch (file.type) {
				case 'text/csv':
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
				dbSave(DB_NAME, result)
				onUpdated()
			}
		};
		reader.readAsBinaryString(file);
	}

	return (
		<>
			{!isEmpty(operations) &&
				<OperationFormComponent
					ref={formComponent}
					modalId="editModal"
					modalTitle="Edit operation"
					method='update'
					data={data}
					onSubmitted={onUpdated}
				/>
			}

			<div className="text-end mb-3">
				<input className="d-none" type="file" accept="applicatoin/json,.json,text/csv,.csv" id="import" onChange={handleImport} />
				<button className="btn btn-outline-info btn-sm" onClick={importData}>
					⬆️ Import
				</button>

				{!isEmpty(operations) &&
					<div className="btn-group ms-2">
						<button type="button" className="btn btn-sm btn-outline-info dropdown-toggle" data-bs-toggle="dropdown">
							⬇️ Export
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
				}
			</div>

			<table className="table table-striped table-hover">
				<thead className="table-light">
					<tr>
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
								<button className="btn btn-outline-info btn-sm mb-3" onClick={importData}>
									⬆️ Import your data
								</button>
							</td>
						</tr>
					}
					{operations.map((op, idx) => (
						<tr key={idx}>
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
								<button className="btn btn-link btn-sm text-decoration-none" onClick={() => editOperation(op)}>
									✏️
								</button>
							</td>
						</tr>
					))}
				</tbody>
				{!isEmpty(operations) &&
					<tfoot className="table-light">
						<tr>
							<td colSpan={4} className="text-end">
								Balance : {' '}
								<strong className={`text-${balance >= 0 ? 'success' : 'danger'}`}>
									{currency(balance)}
								</strong>
							</td>
							<td className="text-end text-nowrap">
								<strong className="text-danger">
									{currency(debit)}
								</strong>
							</td>
							<td className="text-end text-nowrap">
								<strong className="text-success">
									{currency(credit)}
								</strong>
							</td>
							<td></td>
						</tr>
					</tfoot>
				}
			</table>
		</>
	)
}
