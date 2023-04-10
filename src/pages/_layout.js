import Head from "next/head"
import HeaderComponent from "@/components/HeaderComponent";
import ToastComponent from "@/components/ToastComponent";
import {useMemo} from "react";

// Prevent direct access from URL
export function getServerSideProps() {
    return {
        notFound: true
    }
}

export default function Layout({ children, metas }) {
    const metaTitle = useMemo(() => {
        const defaultTitle = "Bank operations"
        let { title } = metas
        if (title) {
            title += ' | ' + defaultTitle
        }
        return title
    }, [metas])

    return (
        <>
            <Head>
                <title>{metaTitle}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex-shrink-0">
                <ToastComponent id="liveToast" title="Bravo!" body="Operation saved successfully!" />

                <HeaderComponent />

                <div className="container">
                    {children}
                </div>
            </main>
            <footer className="footer mt-auto py-3 bg-light">
                <div className="container text-muted small">
                    Made with 🧡 and
                    {' '} <a href="https://nextjs.org/" className="text-muted text-decoration-none" target="_blank">Next.js</a>,
                    {' '} deployed with <a href="https://vercel.com/" className="text-muted text-decoration-none" target="_blank">Vercel</a>
                    {' '} and hosted on <a href="https://github.com/rseon/bank-operations" className="text-muted text-decoration-none" target="_blank">Github</a>.
                </div>
            </footer>

            <div id="modal" />
        </>
    )
}