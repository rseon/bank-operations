import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {getOperationData} from "@/helpers/operation";
import {filterOperations, getFiltersData, getSortByData, setSortByData} from "@/helpers/filter";

const Context = createContext()

const OperationProvider = ({children}) => {
    const [data, setData] = useState({})
    const [filtered, setFiltered] = useState([])
    const [filters, setFilters] = useState({})
    const [sortBy, setSortBy] = useState([])

    const operations = useMemo(() => {
        return data.operations || []
    }, [data])

    const reloadList = () => {
        setData(getOperationData())
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

    useEffect(() => {
        reloadList()
    }, [])

    useEffect(() => {
        setFilters(getFiltersData())
        setSortBy(getSortByData())
    }, [])

    useEffect(() => {
        setFiltered(filterOperations(operations, filters, sortBy))
    }, [operations, filters, sortBy])

    return <Context.Provider value={{
        operations,
        data, reloadList,
        filtered, setFiltered,
        filters, setFilters,
        sortBy, saveSortBy,
    }}>{children}</Context.Provider>
}

export const useOperation = () => useContext(Context)

export default OperationProvider