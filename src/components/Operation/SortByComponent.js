import {useMemo} from "react";
import {withSortById} from "@/helpers/filter";
import {useOperation} from "@/providers/operation";

export default function OperationSortByComponent({ field }) {

    const { sortBy, saveSortBy } = useOperation()

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
            saveSortBy((state) => {
                let newSortBy = state.filter(s => s.field !== field)
                newSortBy.push({
                    field,
                    direction
                })
                return withSortById(newSortBy)
            })
        }
        else {
            saveSortBy(withSortById([{
                field,
                direction
            }]))
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