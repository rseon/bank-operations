import {isEmpty} from "@/helpers"
import {filterOperations, getFiltersData} from "@/helpers/filter"
import FormComponent from "@/components/Operation/FormComponent"
import {useEffect, useRef, useState} from "react"
import ToolbarComponent from "@/components/Operation/ToolbarComponent";
import TableComponent from "@/components/Operation/TableComponent";

export default function ListComponent({
	data,
	onUpdated,
}) {
	const formComponent = useRef()
	const toolbarComponent = useRef()
	const { operations } = data

	// Filters
	const [filtered, setFiltered] = useState([])
	const [filters, setFilters] = useState({})
	useEffect(() => {
		setFilters(getFiltersData())
	}, [])

	useEffect(() => {
		setFiltered(filterOperations(operations, filters))
	}, [operations, filters])

	return (
		<>
			{!isEmpty(operations) &&
				<FormComponent
					ref={formComponent}
					modalId="editModal"
					modalTitle="Edit operation"
					method='update'
					data={data}
					onSubmitted={onUpdated}
				/>
			}

			<ToolbarComponent
				ref={toolbarComponent}
				data={data}
				filtered={filtered}
				filters={filters}
				setFilters={setFilters}
				onUpdated={onUpdated}
			/>

			<TableComponent
				data={data}
				filtered={filtered}
				formComponent={formComponent}
				toolbarComponent={toolbarComponent}
			/>
		</>
	)
}
