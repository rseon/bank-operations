export const getOptions = (options = {}) => {
    const settings = {
        responsive: true,
        plugins: {},
    }

    if (options.title) {
        settings.plugins.title = {
            display: true,
            text: options.title,
        }
    }

    return settings
}