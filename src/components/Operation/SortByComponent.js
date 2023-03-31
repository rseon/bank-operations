import {useMemo} from "react";

export default function OperationSortByComponent({ sortBy, setSortBy, field }) {

	const fieldSorted = useMemo(() => {
		return sortBy.filter(s => s.field === field)[0]
	}, [sortBy, field])


	const toggleSort = (e) => {
		let direction = 'asc'
		if (fieldSorted) {
			direction = fieldSorted.direction === 'asc' ? 'desc' : 'asc'
		}

		// Combine sorts
		if (e.ctrlKey) {
			setSortBy((state) => {
				let newSortBy = state.filter(s => s.field !== field)
				newSortBy.push({
					field,
					direction
				})
				return newSortBy
			})
		}
		else {
			setSortBy([{
				field,
				direction
			}])
		}
	}

	return (
		<>
			{fieldSorted && (
				<>
					{fieldSorted.direction === 'asc' && <button className="btn btn-link btn-sm text-decoration-none p-0 ms-2" onClick={toggleSort}>⬆️</button>}
					{fieldSorted.direction === 'desc' && <button className="btn btn-link btn-sm text-decoration-none p-0 ms-2" onClick={toggleSort}>⬇️</button>}
				</>
			)}
			{!fieldSorted && (
				<button className="btn btn-link btn-sm text-decoration-none p-0 ms-2" onClick={toggleSort}>↕️</button>
			)}
		</>
	)
}