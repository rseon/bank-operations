import {CHECKBOX_STATES, isEmpty} from "@/helpers"
import {filterOperations, getFiltersData, getSortByData, setSortByData} from "@/helpers/filter"
import {useEffect, useRef, useState} from "react"
import ToolbarComponent from "@/components/Operation/ToolbarComponent";
import TableComponent from "@/components/Operation/TableComponent";
import ModalComponent from "@/components/ModalComponent";
import FormOnlyComponent from "@/components/Operation/FormComponent";

export default function OperationListComponent({
    data,
    onUpdated,
}) {
    const formComponent = useRef()
    const toolbarComponent = useRef()
    const tableComponent = useRef()
    const modalComponent = useRef()
    const { operations } = data

    // Filters
    const [filtered, setFiltered] = useState([])
    const [filters, setFilters] = useState({})
    const [sortBy, setSortBy] = useState([])
    const [listChecked, setListChecked] = useState([])

    useEffect(() => {
        setFilters(getFiltersData)
        setSortBy(getSortByData)
    }, [])

    useEffect(() => {
        setFiltered(filterOperations(operations, filters, sortBy))
    }, [operations, filters, sortBy])

    const onUpdatedLocal = () => {
        tableComponent.current?.setCheckboxChecked(CHECKBOX_STATES.empty)
        toolbarComponent.current?.setForBulk([])
        setListChecked([])
        modalComponent.current?.close()
        onUpdated()
    }

    const saveSortBy = (newSortBy) => {
        setSortBy(newSortBy)

        if (typeof newSortBy === 'function') {
            setSortByData(newSortBy(sortBy))
        }
        else {
            setSortByData(newSortBy)
        }
    }

    return (
        <>
            {!isEmpty(operations) &&
                <ModalComponent id="editModal" title="Edit operation" ref={modalComponent}>
                    <FormOnlyComponent
                        ref={formComponent}
                        method="update"
                        data={data}
                        onSubmitted={onUpdatedLocal}
                    />
                </ModalComponent>
            }

            <ToolbarComponent
                ref={toolbarComponent}
                data={data}
                filtered={filtered}
                filters={filters}
                setFilters={setFilters}
                onUpdated={onUpdatedLocal}
                listChecked={listChecked}
            />

            <TableComponent
                ref={tableComponent}
                data={data}
                filtered={filtered}
                formComponent={formComponent}
                toolbarComponent={toolbarComponent}
                sortBy={sortBy}
                setSortBy={saveSortBy}
                listChecked={listChecked}
                setListChecked={setListChecked}
            />
        </>
    )
}
