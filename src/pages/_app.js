import '@/styles/globals.css'
import {useEffect} from "react";
import {provider, ProviderComposer} from "@/providers/providerComposer";
import OperationProvider from "@/providers/operation";

export default function App({ Component, pageProps }) {
    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min");
    }, []);

    return (
        <ProviderComposer providers={[
            provider(OperationProvider),
        ]}>
            <Component {...pageProps} />
        </ProviderComposer>
    )
}
