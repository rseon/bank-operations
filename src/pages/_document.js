import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang="en" className="h-100">
			<Head />
			<body className="d-flex flex-column h-100">
				<main className="flex-shrink-0">
					<Main />
				</main>
				<footer className="footer mt-auto py-3 bg-light">
					<div className="container text-muted small">
						Made with 🧡 and
						{' '} <a href="https://nextjs.org/" className="text-muted text-decoration-none" target="_blank">Next.js</a>,
						{' '} deployed with <a href="https://vercel.com/" className="text-muted text-decoration-none" target="_blank">Vercel</a>
						{' '} and hosted on <a href="https://github.com/rseon/bank-operations" className="text-muted text-decoration-none" target="_blank">Github</a>.
					</div>
				</footer>
				<NextScript />
			</body>
		</Html>
	)
}
