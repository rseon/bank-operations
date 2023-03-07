import HeaderComponent from "@/components/HeaderComponent";
import OperationFormComponent from "@/components/OperationFormComponent";
import ToastComponent from "@/components/ToastComponent";
import OperationListComponent from "@/components/OperationListComponent";
import {useEffect, useState} from "react";
import {getOperationData} from "@/helpers";

export default function Home() {
	const [data, setData] = useState({
		types: [],
		recipients: [],
		operations: [],
		balance: 0,
	})

	const loadList = () => {
		setData(getOperationData())
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
				method="create"
				data={data}
				onSubmitted={loadList}
			/>
			<ToastComponent id="liveToast" title="Bravo!" body="Operation saved successfully!" />

			<div className="container">
				<OperationListComponent
					data={data}
					onUpdated={loadList}
				/>
			</div>
		</>
	)
}
