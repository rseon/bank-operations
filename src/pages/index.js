import HeaderComponent from "@/components/HeaderComponent";
import OperationFormComponent from "@/components/OperationFormComponent";
import ToastComponent from "@/components/ToastComponent";
import {useEffect, useState} from "react";
import OperationListComponent from "@/components/OperationListComponent";

export default function Home() {
	const [loading, setLoading] = useState(false)
	const [operations, setOperations] = useState([])
	const [types, setTypes] = useState([])
	const [recipients, setRecipients] = useState([])
	const [balance, setBalance] = useState(0)

	const loadList = () => {
		setLoading(true)
		fetch('/api/operation', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then(result => {
				setOperations(result.operations)
				setTypes(result.types)
				setRecipients(result.recipients)
				setBalance(result.balance)
			})
			.catch(err => {
				alert(`Error! ${err}`)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	useEffect(() => {
		loadList()
	}, [])

	return (
		<>
			<HeaderComponent />
			<OperationFormComponent
				modalId="createModal"
				modalTitle="New operation"
				endpoint="/api/operation"
				method="POST"
				types={types}
				recipients={recipients}
				onSubmitted={loadList}
			/>
			<ToastComponent id="liveToast" title="Bravo!" body="Operation saved successfully!" />

			<div className="container">
				<OperationListComponent
					loading={loading}
					types={types}
					recipients={recipients}
					operations={operations}
					balance={balance}
					onUpdated={loadList}
				/>
			</div>
		</>
	)
}
