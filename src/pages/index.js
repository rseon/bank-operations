import Layout from "@/pages/_layout";
import {useRef, useState} from "react";
import {CHECKBOX_STATES, isEmpty} from "@/helpers";
import ModalComponent from "@/components/ModalComponent";
import FormComponent from "@/components/Operation/FormComponent";
import ToolbarComponent from "@/components/Operation/ToolbarComponent";
import TableComponent from "@/components/Operation/TableComponent";
import {useOperation} from "@/providers/operation";

export default function Page() {
    const {operations, reloadList} = useOperation()

    const [listChecked, setListChecked] = useState([])

    const formComponent = useRef()
    const toolbarComponent = useRef()
    const tableComponent = useRef()
    const modalComponent = useRef()

    const onUpdated = () => {
        tableComponent.current?.setCheckboxChecked(CHECKBOX_STATES.empty)
        toolbarComponent.current?.setForBulk([])
        setListChecked([])
        modalComponent.current?.close()
        reloadList()
    }

    return (
        <Layout
            metas={{
                title: "Operations"
            }}
        >
            {!isEmpty(operations) &&
                <ModalComponent id="editModal" title="Edit operation" ref={modalComponent}>
                    <FormComponent
                        ref={formComponent}
                        method="update"
                        onSubmitted={onUpdated}
                    />
                </ModalComponent>
            }

            <ToolbarComponent
                ref={toolbarComponent}
                listChecked={listChecked}
            />

            <TableComponent
                ref={tableComponent}
                formComponent={formComponent}
                toolbarComponent={toolbarComponent}
                listChecked={listChecked}
                setListChecked={setListChecked}
            />
        </Layout>
    )
}