import {currency, DB_NAME, dbSave, formatDate, isEmpty, nl2br} from "@/helpers"
import OperationFormComponent from "@/components/OperationFormComponent"
import {useRef} from "react"

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

	const editOperation = (operation) => {
		formComponent.current?.setOperation(operation)

		const { Modal } = require("bootstrap")
		const myModal = new Modal("#editModal")
		myModal.show()
	}

	const exportData = () => {
		/**
		 * @todo Export with filters
		 */

		const jsonContent = 'data:application/json,' + JSON.stringify(operations)
		const link = document.createElement("a")
		link.setAttribute("href", encodeURI(jsonContent))
		link.setAttribute("download", `bank_operations_${Date.now()}.json`)
		document.body.appendChild(link)

		link.click()
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
			dbSave(DB_NAME, JSON.parse(e.target.result))
			onUpdated()
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
				<input className="d-none" type="file" accept="applicatoin/json,.json" id="import" onChange={handleImport} />
				<button className="btn btn-outline-info btn-sm mb-3" onClick={importData}>
					⬆️ Import
				</button>

				{!isEmpty(operations) &&
					<button className="btn btn-outline-info btn-sm mb-3 ms-2" onClick={exportData}>
						⬇️ Export
					</button>
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
