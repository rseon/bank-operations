import {isEmpty} from "@/helpers";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import FilterComponent from "@/components/Operation/FilterComponent";
import {setOperationsData, exportCSV, exportJson, importCSV, importJson} from "@/helpers/operation";

const OperationListToolbarComponent = ({
	data,
	filtered,
	filters,
	setFilters,
	onUpdated,
}, ref) => {

	const { operations } = data
	const [nbFilters, setNbFilters] = useState(0)
	const [showFilters, setShowFilters] = useState(false)

	useEffect(() => {
		setNbFilters(Object.values(filters).filter(f => f !== '').length)
	}, [filters])

	useEffect(() => {
		const { Dropdown } = require("bootstrap")
		const dropdownElementList = document.querySelectorAll('.dropdown-toggle')
		const dropdownList = [...document.querySelectorAll('.dropdown-toggle')].map(dropdownToggleEl => new Dropdown(dropdownToggleEl))
	}, [])

	const importData = () => {
		const input = document.getElementById('import')
		input.value = ''
		input.click()
	}

	useImperativeHandle(ref, () => ({
		importData
	}))

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
				case 'application/vnd.ms-excel':
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
				setOperationsData(result)
				onUpdated()
			}
		};
		reader.readAsBinaryString(file);
	}

	const exportData = (format) => {
		switch (format) {
			case 'json':
				exportJson(filtered)
				break
			case 'csv':
				exportCSV(filtered)
				break
		}
	}

	const clearData = () => {
		if (confirm('This will erase all your data. Continue ?')) {
			setOperationsData([])
			onUpdated()
		}
	}

	return (
		<>
			<div className="d-flex justify-content-between">
				<div>
					{!isEmpty(operations) &&
						<button className="btn btn-outline-info btn-sm" onClick={() => setShowFilters(!showFilters)}>
							{showFilters && '🛠️ Hide filters'}
							{!showFilters && '🛠️ Show filters'}
							{nbFilters > 0 && ` (${nbFilters})`}
						</button>
					}
				</div>
				<div className="text-end mb-3">
					<input className="d-none" type="file" accept="application/json,.json,text/csv,.csv" id="import" onChange={handleImport} />
					<button className="btn btn-outline-info btn-sm" onClick={importData}>
						⬆️ Import
					</button>

					{!isEmpty(filtered) &&
						<>
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
							<div className="btn-group ms-2">
								<button type="button" className="btn btn-sm btn-outline-info dropdown-toggle" data-bs-toggle="dropdown">
									🗑️ Clear all
								</button>
								<ul className="dropdown-menu dropdown-menu-end p-0">
									<li>
										<button className="dropdown-item" onClick={clearData}>
											Confirm deletion
											<small className="text-muted"><br/>⚠️ No turning back !</small>
										</button>
									</li>
								</ul>
							</div>
						</>
					}
				</div>
			</div>
			{showFilters && (
				<FilterComponent
					data={data}
					filters={filters}
					setFilters={setFilters}
				/>
			)}
		</>
	)
}

export default forwardRef(OperationListToolbarComponent)