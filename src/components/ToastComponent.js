export default function ToastComponent({ id, title, body }) {

	return (
		<div className="toast-container position-fixed p-3 top-0 end-0">
			<div id={id} className="toast">
				<div className="toast-header">
					<strong className="me-auto">{title}</strong>
					<button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
				</div>
				<div className="toast-body">
					{body}
				</div>
			</div>
		</div>
	)
}
