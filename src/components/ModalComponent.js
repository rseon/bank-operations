import ClientOnlyPortal from "@/components/ClientOnlyPortal";
import {forwardRef, useImperativeHandle} from "react";

export default forwardRef(function ModalComponent({ id, title, children }, ref) {
    const close = () => {
        document.getElementById(id).querySelector('.btn-close').click()
    }

    useImperativeHandle(ref, () => ({
        close
    }))

    return (
        <ClientOnlyPortal selector="#modal">
            <div className="modal fade" id={id} tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {title}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </ClientOnlyPortal>
    )
})
