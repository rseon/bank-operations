import HeaderComponent from "@/components/HeaderComponent"
import {getOperationData, getOperationsFromDb} from "@/helpers/operation";
import GraphByRecipient from "@/components/Operation/Graph/ByRecipientComponent";
import {useEffect, useRef, useState} from "react";
import GraphByType from "@/components/Operation/Graph/ByTypeComponent";
import GraphByBalance from "@/components/Operation/Graph/ByBalanceComponent";
import GraphByDate from "@/components/Operation/Graph/ByDateComponent";
import ToolbarComponent from "@/components/Operation/ToolbarComponent";
import {filterOperations, getFiltersData} from "@/helpers/filter";
import {CHECKBOX_STATES, isEmpty} from "@/helpers";
import FilterComponent from "@/components/Operation/FilterComponent";

export default function Graphs() {
    const [data, setData] = useState(null)
    const [filtered, setFiltered] = useState([])
    const [filters, setFilters] = useState({})
    const [nbFilters, setNbFilters] = useState(0)
    const [showFilters, setShowFilters] = useState(false)

    const toolbarComponent = useRef()

    useEffect(() => {
        setData(getOperationData())
    }, [])

    useEffect(() => {
        setFilters(getFiltersData())
    }, [])

    useEffect(() => {
        if (data) {
            setFiltered(filterOperations(data.operations, filters))
        }
    }, [data, filters])

    useEffect(() => {
        setNbFilters(Object.values(filters).filter(f => f !== '').length)
    }, [filters])

    return (
        <>
            <HeaderComponent />

            <div className="container">
                {data &&
                    <>
                        <div className="mb-3">
                            <button className="btn btn-outline-info btn-sm" onClick={() => setShowFilters(!showFilters)}>
                                {showFilters && '🛠️ Hide filters'}
                                {!showFilters && '🛠️ Show filters'}
                                {nbFilters > 0 && ` (${nbFilters})`}
                            </button>

                            <span className="text-muted ms-3">
                                {filtered.length !== data.operations.length && (
                                    <>
                                        <strong>{filtered.length}</strong> operations / {data.operations.length}
                                    </>
                                )}
                                {filtered.length === data.operations.length && (
                                    <>
                                        <strong>{data.operations.length}</strong> operations
                                    </>
                                )}
                            </span>
                        </div>
                        {!isEmpty(data.operations) && showFilters && (
                            <FilterComponent
                                data={data}
                                filters={filters}
                                setFilters={setFilters}
                            />
                        )}
                        {!isEmpty(filtered) &&
                            <>
                                <div className="row">
                                    <div className="col-6 mb-5">
                                        <GraphByBalance operations={filtered} />
                                    </div>
                                    <div className="col-6 mb-5">
                                        <GraphByDate operations={filtered} />
                                    </div>
                                    <div className="col-6 mb-5">
                                        <GraphByType operations={filtered} />
                                    </div>
                                    <div className="col-6 mb-5">
                                        <GraphByRecipient operations={filtered} />
                                    </div>
                                </div>
                            </>
                        }
                        {isEmpty(filtered) &&
                            <div className="alert alert-info">
                                No operation to display
                            </div>
                        }
                    </>
                }
            </div>
        </>
    )
}
