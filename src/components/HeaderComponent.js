import Link from "next/link";
import {useRouter} from "next/router";
import FormOnlyComponent from "@/components/Operation/FormComponent";
import ModalComponent from "@/components/ModalComponent";
import {useRef} from "react";

export default function HeaderComponent({ data, loadList }) {
    const router = useRouter()

    const modalComponent = useRef()

    const formCreateSubmitted = () => {
        modalComponent.current?.close()
        loadList()
    }

    return (
        <>
            <div className="container">
                <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                    <span className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none fs-4">
                        🏦 Bank operations
                    </span>
                    <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                        <li>
                            <Link href="/" className={`nav-link px-2 ${router.pathname === '/' ? 'link-primary' : 'link-secondary'}`}>Operations</Link>
                        </li>
                        <li>
                            <Link href="/graphs" className={`nav-link px-2 ${router.pathname === '/graphs' ? 'link-primary' : 'link-secondary'}`}>Graphs</Link>
                        </li>
                    </ul>
                    <div className="col-md-3 text-end">
                        <button className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#createModal">
                            ➕ New operation
                        </button>
                    </div>
                </header>
            </div>

            <ModalComponent id="createModal" title="New operation" ref={modalComponent}>
                <FormOnlyComponent
                    method="create"
                    data={data}
                    onSubmitted={formCreateSubmitted}
                />
            </ModalComponent>
        </>
    )
}
