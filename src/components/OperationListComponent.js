import {currency, formatDate, isEmpty, nl2br} from "@/helpers";
import OperationFormComponent from "@/components/OperationFormComponent";
import {useRef} from "react";

export default function OperationListComponent({
	loading = false,
	operations = [],
	types = [],
	recipients = [],
	balance = 0,
	onUpdated,
}) {

	const formComponent = useRef()

	const editOperation = (operation) => {
		console.log(formComponent)

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
					endpoint="/api/operation"
					method='PUT'
					types={types}
					recipients={recipients}
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
						<th width={1}>Amount</th>
						<th width={1}></th>
					</tr>
					{!isEmpty(operations) &&
						<tr>
							<th>

							</th>
							<th>
								<select className="form-select">
									<option value=""></option>
									{types.map(t => (
										<option key={t.id} value={t.id}>{t.name}</option>
									))}
								</select>
							</th>
							<th>
								<select className="form-select">
									<option value=""></option>
									{recipients.map(r => (
										<option key={r.id} value={r.id}>{r.name}</option>
									))}
								</select>
							</th>
							<th>
								<input type="search" className="form-control" placeholder="Search..."/>
							</th>
							<th>
								<input type="search" className="form-control" placeholder="Search..."/>
							</th>
							<th></th>
						</tr>
					}
				</thead>
				<tbody className="table-group-divider">
					{loading &&
						<tr>
							<td colSpan={10} className="text-center p-5 bg-light text-info">
								<span className="spinner-border text-primary" />
							</td>
						</tr>
					}
					{!loading && isEmpty(operations) &&
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
								{op.type.name}
							</td>
							<td className="text-nowrap">
								{op.recipient.name}
							</td>
							<td className="text-nowrap" dangerouslySetInnerHTML={{ __html: nl2br(op.detail) }} />
							<td className="text-end">
								<strong className={`text-${op.amount >= 0 ? 'success' : 'danger'}`}>
									{currency(op.amount)}
								</strong>
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
								Balance :
							</td>
							<td className="text-end">
								<strong className={`text-${balance >= 0 ? 'success' : 'danger'}`}>
									{currency(balance)}
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
