import {CHECKBOX_STATES, isEmpty} from "@/helpers"
import {filterOperations, getFiltersData, getSortByData, setSortByData} from "@/helpers/filter"
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
	const tableComponent = useRef()
	const { operations } = data

	// Filters
	const [filtered, setFiltered] = useState([])
	const [filters, setFilters] = useState({})
	const [sortBy, setSortBy] = useState()

	useEffect(() => {
		setFilters(getFiltersData)
		setSortBy(getSortByData)
	}, [])

	useEffect(() => {
		setFiltered(filterOperations(operations, filters, sortBy))
	}, [operations, filters, sortBy])

	const onUpdatedLocal = () => {
		tableComponent.current?.setCheckboxChecked(CHECKBOX_STATES.empty)
		tableComponent.current?.setListChecked([])
		toolbarComponent.current?.setForBulk([])
		onUpdated()
	}

	const saveSortBy = (newSortBy) => {
		setSortBy(newSortBy)
		setSortByData(newSortBy)
	}

	return (
		<>
			{!isEmpty(operations) &&
				<FormComponent
					ref={formComponent}
					modalId="editModal"
					modalTitle="Edit operation"
					method='update'
					data={data}
					onSubmitted={onUpdatedLocal}
				/>
			}

			<ToolbarComponent
				ref={toolbarComponent}
				data={data}
				filtered={filtered}
				filters={filters}
				setFilters={setFilters}
				onUpdated={onUpdatedLocal}
			/>

			<TableComponent
				ref={tableComponent}
				data={data}
				filtered={filtered}
				formComponent={formComponent}
				toolbarComponent={toolbarComponent}
				sortBy={sortBy}
				setSortBy={saveSortBy}
			/>
		</>
	)
}
