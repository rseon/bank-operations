import {formatDate, formatDateFromFormat, round} from "@/helpers/index";
const version = require('../../package.json').version

const CSV_NEWLINE_TEXT = "[_n]"

export const CSV_UNKNOWN = "UNKNOWN"
export const CSV_NEWLINE_CRLF = "\r\n"
export const CSV_NEWLINE_CR = "\r"
export const CSV_NEWLINE_LF = "\n"
export const CSV_DELIMITER_COMMA = ","
export const CSV_DELIMITER_SEMI = ";"
export const CSV_DELIMITER_TAB = "\t"

const TYPE_BY_MIME = {
    'application/json': "JSON",
    'text/csv': "CSV",
    'application/vnd.ms-excel': "CSV",
}

const downloadFile = (content, filename) => {
    const link = document.createElement("a")
    link.setAttribute("href", content)
    link.setAttribute("download", filename)
    document.body.appendChild(link)

    link.click()
}

const detectRegexp = (content, rgxpArray) => {
    return rgxpArray.find(rgxp => content.match(new RegExp(rgxp)) !== null) || CSV_UNKNOWN
}

export const getBaseConfigForCsvFormat = () => {
    return {
        skip: 1,
        delimiter: ";",
        dateFormat: 'yyyy-MM-dd',
        newLine: CSV_NEWLINE_CRLF
    }
}

export const formatCsv = (content, options = {}) => {
    const config = {
        ...getBaseConfigForCsvFormat(),
        ...options
    }

    const rows = content.split(config.newLine)

    // Skip
    let skip = config.skip
    while(skip > 0) {
        rows.shift()
        --skip
    }

    const idxPrefix = Date.now()
    return rows
        .filter(r => r.trim().length > 0)
        .map((r, idx) => {
            let [
                date,
                type,
                category,
                subcat,
                detail,
                debit,
                credit
            ] = r.split(config.delimiter).map(c => {
                try {
                    return decodeURIComponent(escape(c)).trim()
                } catch (e) {
                    return c.trim()
                }
            })

            let amount = credit !== '' ? credit : '-' + debit
            amount = amount.replace(/(\s|€|$)/g, '')
                .replace(',', '.')
                .replace('.00', '')

            return {
                id: `${idxPrefix}${idx}`,
                date: formatDateFromFormat(date, config.dateFormat),
                type,
                category,
                subcat,
                detail: detail.replace(CSV_NEWLINE_TEXT, config.newLine),
                amount: parseFloat(amount),
            }
        })
}

export const detectCsvNewLine = (content) => {
    return detectRegexp(content, [CSV_NEWLINE_CRLF, CSV_NEWLINE_CR, CSV_NEWLINE_LF])
}

export const detectCsvDelimiter = (content) => {
    return detectRegexp(content, [CSV_DELIMITER_TAB, CSV_DELIMITER_SEMI, CSV_DELIMITER_COMMA])
}

export const exportCsv = (operations) => {
    const rows = [
        {
            date: 'Date',
            type: 'Type',
            category: 'Category',
            subcat: 'Sub-category',
            detail: 'Detail',
            debit: 'Debit',
            credit: 'Credit',
        },
        ...operations.map(op => {
            const amount = op.amount
            let debit = null,
                credit = null
            if (amount < 0) {
                debit = amount
            }
            else {
                credit = amount
            }
            return {
                date: op.date,
                type: op.type,
                category: op.category,
                subcat: op.subcat,
                detail: op.detail.replace(CSV_NEWLINE_CRLF, CSV_NEWLINE_TEXT),
                debit,
                credit,
            }
        })
    ]
        .map(r => Object.values(r).join(CSV_DELIMITER_SEMI))
        .join(CSV_NEWLINE_CRLF)

    downloadFile(
        'data:text/csv;charset=utf-8,' + encodeURI(rows),
        `Bank_Operations_${formatDate(Date.now(), 'yyyy-MM-dd_HH-mm')}.csv`
    )
}

export const formatJson = (content) => {
    const uint8Array = new Uint8Array(content.length);
    for (let i = 0; i < content.length; i++) {
        uint8Array[i] = content.charCodeAt(i);
    }

    const decodedContent = new TextDecoder("utf-8").decode(uint8Array);

    return JSON.parse(decodedContent)
}

export const exportJson = (operations, filters) => {
    let json = {
        meta: {
            date: new Date(),
            version,
            filters: Object.fromEntries(Object.entries(filters).filter(([k, v]) => v !== ''))
        },
        operations
    }

    downloadFile(
        'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json)),
        `Bank_Operations_${formatDate(Date.now(), 'yyyy-MM-dd_HH-mm')}.json`
    )
}

export const getTypeByMime = (mime) => {
    return TYPE_BY_MIME[mime] || "Unknown"
}

export const fileIsJson = (file) => {
    return getTypeByMime(file.type) === "JSON"
}

export const fileIsCsv = (file) => {
    return getTypeByMime(file.type) === "CSV"
}

export function getHumanReadableSize(sizeInBytes) {
    sizeInBytes = parseInt(sizeInBytes, 10)
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    if (sizeInBytes === 0) {
        return '0 ' + units[1];
    }
    let i = 0
    for (i; sizeInBytes > 1024; i++) {
        sizeInBytes /= 1024;
    }
    return round(sizeInBytes, 2)+' '+units[i];
}