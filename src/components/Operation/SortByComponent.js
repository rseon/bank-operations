export default function OperationSortByComponent({ sortBy, setSortBy, field }) {
	const toggleSort = () => {

		let direction = sortBy.direction
		if (sortBy.field === field) {
			direction = direction === 'asc' ? 'desc' : 'asc'
		}

		setSortBy({
			field,
			direction
		})
	}

	return (
		<>
			{sortBy && sortBy.field === field && (
				<>
					{sortBy.direction === 'asc' && <button className="btn btn-link btn-sm text-decoration-none p-0 ms-2" onClick={toggleSort}>⬆️</button>}
					{sortBy.direction === 'desc' && <button className="btn btn-link btn-sm text-decoration-none p-0 ms-2" onClick={toggleSort}>⬇️</button>}
				</>
			)}
			{sortBy && sortBy.field !== field && (
				<button className="btn btn-link btn-sm text-decoration-none p-0 ms-2" onClick={toggleSort}>↕️</button>
			)}
		</>
	)
}