import Link from "next/link";
import {useRouter} from "next/router";

export default function HeaderComponent() {
    const router = useRouter()

    const showModal = () => {
        const { Modal } = require("bootstrap")
        const myModal = new Modal("#createModal")
        myModal.show()
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
                        {router.pathname === '/' &&
                            <button className="btn btn-outline-primary" onClick={showModal}>
                                ➕ New operation
                            </button>
                        }
                    </div>
                </header>
            </div>
        </>
    )
    return (
        <>
            <div className="container">
                <header className="d-flex flex-wrap py-3 mb-4 border-bottom">
                    <span className="me-md-auto fs-4">
                        🏦 Bank operations
                    </span>
                    <ul className="nav">
                        <li>
                            <button className="btn btn-outline-primary" onClick={showModal}>
                                ➕ New operation
                            </button>
                        </li>
                    </ul>
                </header>
            </div>
        </>
    )
}
