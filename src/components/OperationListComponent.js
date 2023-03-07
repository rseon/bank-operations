import {currency, formatDate, isEmpty, nl2br} from "@/helpers";
import OperationFormComponent from "@/components/OperationFormComponent";
import {useRef} from "react";

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
