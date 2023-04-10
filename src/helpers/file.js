import {formatDate, round} from "@/helpers/index";
const version = require('../../package.json').version

const CSV_SEPARATOR = ';'
const CSV_NEWLINE = "\n"
const CSV_NEWLINE_TEXT = "[_n]"

const TYPE_BY_MIME = {
    'application/json': "JSON",
    'text/csv': "CSV",
}

const downloadFile = (content, filename) => {
    const link = document.createElement("a")
    link.setAttribute("href", content)
    link.setAttribute("download", filename)
    document.body.appendChild(link)

    link.click()
}

export const importCsv = (content) => {
    const rows = content.split(CSV_NEWLINE)
    rows.shift()

    const idxPrefix = Date.now()
    return rows
        .filter(r => r.trim().length > 0)
        .map((r, idx) => {
            let [
                date,
                type,
                recipient,
                detail,
                debit,
                credit
            ] = r.split(CSV_SEPARATOR).map(c => {
                try {
                    return decodeURIComponent(escape(c))
                } catch (e) {
                    return c
                }
            })

            credit = credit.replace('\r', '')
                .replace(',', '.')
                .replace('.00', '')

            debit = debit.replace(',', '.')
                .replace('.00', '')

            const amount = credit !== '' ? credit : debit

            return {
                id: `${idxPrefix}${idx}`,
                date,
                type,
                recipient,
                detail: detail.replace(CSV_NEWLINE_TEXT, CSV_NEWLINE),
                amount,
            }
        })
}

export const formatCsv = (content) => {
    const rows = content.split(CSV_NEWLINE)
    rows.shift()

    const idxPrefix = Date.now()
    return rows
        .filter(r => r.trim().length > 0)
        .map((r, idx) => {
            let [
                date,
                type,
                recipient,
                detail,
                debit,
                credit
            ] = r.split(CSV_SEPARATOR).map(c => {
                try {
                    return decodeURIComponent(escape(c))
                } catch (e) {
                    return c
                }
            })

            credit = credit.replace('\r', '')
                .replace(',', '.')
                .replace('.00', '')

            debit = debit.replace(',', '.')
                .replace('.00', '')

            const amount = credit !== '' ? credit : debit

            return {
                id: `${idxPrefix}${idx}`,
                date,
                type,
                recipient,
                detail: detail.replace(CSV_NEWLINE_TEXT, CSV_NEWLINE),
                amount,
            }
        })
}

export const exportCsv = (operations) => {
    const rows = [
        {
            date: 'Date',
            type: 'Type',
            recipient: 'Recipient',
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
                recipient: op.recipient,
                detail: op.detail.replace(CSV_NEWLINE, CSV_NEWLINE_TEXT),
                debit,
                credit,
            }
        })
    ]
        .map(r => Object.values(r).join(CSV_SEPARATOR))
        .join(CSV_NEWLINE)

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