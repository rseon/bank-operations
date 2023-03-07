import {currency, formatDate, isEmpty, nl2br} from "@/helpers"
import OperationFormComponent from "@/components/OperationFormComponent"
import {useRef} from "react"

export default function OperationListComponent({
	data,
	onUpdated,
}) {
	const { operations, credit, debit, balance } = data

	const formComponent = useRef()

	const editOperation = (operation) => {
		formComponent.current?.setOperation(operation)

		const { Modal } = require("bootstrap");
		const myModal = new Modal("#editModal");
		myModal.show()
	}

	const exportData = () => {

		const rows = [
			{
				date: "Date",
				type: "Type",
				recipient: "Recipient",
				detail: "Detail",
				amount: "Amount",
			},
			...operations.map(op => {
				return {
					date: op.date,
					type: op.type,
					recipient: op.recipient,
					detail: op.detail,
					amount: op.amount,
				}
			})
		]

		const csvContent = 'data:text/csv;charset=utf-8,\ufeff' + rows.map(row => {
			return Object.values(row)
				.map(op => `"${op}"`)
				.join(';')
		}).join("\n")


		const link = document.createElement("a")
		link.setAttribute("href", encodeURI(csvContent))
		link.setAttribute("download", `bank_operations_${Date.now()}`)
		document.body.appendChild(link)

		link.click()
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

			{!isEmpty(operations) &&
				<div className="text-end">
					<button className="btn btn-outline-info btn-sm mb-3" onClick={exportData}>
						⬇️ Export
					</button>
				</div>
			}

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
							<td colSpan={10} className="text-center p-5 bg-light text-info">
								No operation
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
