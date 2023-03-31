import HeaderComponent from "@/components/HeaderComponent"
import FormComponent from "@/components/Operation/FormComponent"
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
            <HeaderComponent />
            <FormComponent
                modalId="createModal"
                modalTitle="New operation"
                method="create"
                data={data}
                onSubmitted={loadList}
            />

            <div className="container">
                <ListComponent
                    data={data}
                    onUpdated={loadList}
                />
            </div>
        </>
    )
}
