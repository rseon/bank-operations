export default function HeaderComponent() {

	const showModal = () => {
		const { Modal } = require("bootstrap");
		const myModal = new Modal("#createModal");
		myModal.show();
	};

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
