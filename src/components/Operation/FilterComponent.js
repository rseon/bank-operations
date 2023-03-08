import {lastDayOfMonth} from "date-fns";
import {formatDate} from "@/helpers";
import {setFiltersData} from "@/helpers/filter";

const OperationListToolbarComponent = ({
	data,
	filters,
	setFilters
}) => {
	const { types, recipients } = data

	const onChange = (event) => {
		updateFilter(event.target.name, event.target.value)
	}

	const updateFilter = (name, value) => {
		setFilters((state) => {
			const newFilters = {
				...state,
				[name]: value
			}
			setFiltersData(newFilters)
			return newFilters
		})
	}

	const setCurrentMonth = () => {
		const today = new Date()

		updateFilter('from', formatDate(today, 'yyyy-MM-01'))
		updateFilter('to', formatDate(lastDayOfMonth(today), 'yyyy-MM-dd'))
	}

	return (
		<div className="mb-3 card bg-light">
			<div className="card-body">
				<div className="row">
					<div className="col">
						<div className="mb-2">
							<label htmlFor="filter_from" className="form-label">From</label>
							<input id="filter_from" name="from" type="date" className="form-control" value={filters.from} max={filters.to} onChange={onChange} autoComplete="off" />
						</div>
						<div className="mb-2">
							<label htmlFor="filter_to" className="form-label">To</label>
							<input id="filter_to" name="to" type="date" className="form-control" value={filters.to} min={filters.from} onChange={onChange} autoComplete="off" />
						</div>
						<button className="btn btn-link p-0" onClick={setCurrentMonth}>
							<small>Set current month</small>
						</button>
					</div>
					<div className="col">
						<label htmlFor="filter_type" className="form-label">Type</label>
						<select name="type" id="filter_type" className="form-control" value={filters.type} onChange={onChange} autoComplete="off">
							<option value=""></option>
							{types.map((type, idx) => (
								<option key={idx} value={type}>{type}</option>
							))}
						</select>
					</div>
					<div className="col">
						<label htmlFor="filter_type" className="form-label">Recipient</label>
						<select name="recipient" id="filter_recipient" className="form-control" value={filters.recipient} onChange={onChange} autoComplete="off">
							<option value=""></option>
							{recipients.map((recipient, idx) => (
								<option key={idx} value={recipient}>{recipient}</option>
							))}
						</select>
					</div>
					<div className="col">
						<label htmlFor="filter_detail" className="form-label">Detail</label>
						<input id="filter_detail" name="detail" type="search" className="form-control" value={filters.detail} onChange={onChange} autoComplete="off" />
					</div>
				</div>
			</div>
		</div>
	)
}

export default OperationListToolbarComponent