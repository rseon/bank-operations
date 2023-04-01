import {deepMerge} from "@/helpers/index";

export const getOptions = (options = {}) => {
    let settings = {
        responsive: true,
        plugins: {
            autocolors: {
                mode: 'data'
            }
        },
    }

    if (options.title) {
        settings.plugins.title = {
            display: true,
            text: options.title,
        }
        delete options.title
    }

    return deepMerge(settings, options)
}