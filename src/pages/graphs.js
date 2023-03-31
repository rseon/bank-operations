import HeaderComponent from "@/components/HeaderComponent"
import {useMemo} from "react";
import {getOperationData} from "@/helpers/operation";

export default function Graphs() {
	const data = useMemo(() => {
		const { operations } = getOperationData()

		const byRecipient = {}
		operations.forEach(op => {
			if (!(op.recipient in byRecipient)) {
				byRecipient[op.recipient] = []
			}
			byRecipient[op.recipient].push(op.amount)

		})

		console.log(byRecipient)
	}, [])

	return (
		<>
			<HeaderComponent />

			<div className="container">
				Hello world!
			</div>
		</>
	)
}
