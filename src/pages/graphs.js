import {useMemo, useState} from "react";
import GraphByBalance from "@/components/Operation/Graph/ByBalanceComponent";
import GraphByDate from "@/components/Operation/Graph/ByDateComponent";
import GraphByCategory from "@/components/Operation/Graph/ByCategoryComponent";
import GraphBySubCategory from "@/components/Operation/Graph/BySubCategoryComponent";
import GraphByType from "@/components/Operation/Graph/ByTypeComponent";
import {isEmpty} from "@/helpers";
import FilterComponent from "@/components/Operation/FilterComponent";
import Layout from "@/pages/_layout";
import {useOperation} from "@/providers/operation";

export default function Page() {
    const {operations, filtered, filters} = useOperation()

    const nbFilters = useMemo(() => {
        return Object.values(filters).filter(f => f !== '').length
    }, [filters])

    const [showFilters, setShowFilters] = useState(false)

    return (
        <Layout
            metas={{
                title: "Graphs"
            }}
        >
            {!isEmpty(operations) && (
                <>
                    <div className="mb-3">
                        <button className="btn btn-outline-info btn-sm" onClick={() => setShowFilters(!showFilters)}>
                            {showFilters && '🛠️ Hide filters'}
                            {!showFilters && '🛠️ Show filters'}
                            {nbFilters > 0 && ` (${nbFilters})`}
                        </button>

                        <span className="text-muted ms-3">
                            {filtered.length !== operations.length && (
                                <>
                                    <strong>{filtered.length}</strong> operations / {operations.length}
                                </>
                            )}
                            {filtered.length === operations.length && (
                                <>
                                    <strong>{operations.length}</strong> operations
                                </>
                            )}
                        </span>
                    </div>
                    {showFilters && (
                        <FilterComponent />
                    )}
                </>
            )}
            {!isEmpty(filtered) &&
                <>
                    <div className="row">
                        <div className="col-6 mb-5">
                            <GraphByBalance />
                            <GraphByType />
                        </div>
                        <div className="col-6 mb-5">
                            <GraphByDate />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 mb-5">
                            <GraphByCategory />
                        </div>
                        <div className="col-6 mb-5">
                            <GraphBySubCategory />
                        </div>
                    </div>
                </>
            }
            {isEmpty(filtered) &&
                <div className="alert alert-info">
                    No operation to display
                </div>
            }
        </Layout>
    )
}
