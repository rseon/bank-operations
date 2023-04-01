import HeaderComponent from "@/components/HeaderComponent"
import ListComponent from "@/components/Operation/ListComponent"
import {useEffect, useState} from "react"
import {getOperationData} from "@/helpers/operation";

export default function Home() {
    const [data, setData] = useState({
        types: [],
        recipients: [],
        operations: [],
        balance: 0,
        years: [],
    })

    const loadList = () => {
        setData(getOperationData)
    }

    useEffect(() => {
        loadList()
    }, [])

    return (
        <>
            <HeaderComponent data={data} loadList={loadList} />

            <div className="container">
                <ListComponent
                    data={data}
                    onUpdated={loadList}
                />
            </div>
        </>
    )
}
