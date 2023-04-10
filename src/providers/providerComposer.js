export const ProviderComposer = ({ providers, children}) => {
    return (
        <>
            {providers.reduceRight((acc, current) => {
                const [Provider, props] = current
                return <Provider {...props}>{acc}</Provider>
            }, children)}
        </>
    )
}

export const provider = (provider, props = {}) => [provider, props]
