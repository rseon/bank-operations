import {useEffect, useMemo, useState} from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors, Title } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {getOptions} from "@/helpers/graph";
import {getBalanceTotal} from "@/helpers/operation";
import {currency} from "@/helpers";

ChartJS.register(ArcElement, Tooltip, Legend, Colors, Title);

export default function GraphByBalance({ operations }) {

    const [data, setData] = useState(null)
    const [chart, setChart] = useState(null)
    const [reload, setReload] = useState(0)

    const title = useMemo(() => {
        return `Balance (${currency(getBalanceTotal(operations))})`
    }, [operations])

    const tooltip = useMemo(() => {
        return {
            callbacks: {
                label: (context) => {
                    let label = context.dataset.label || ''
                    return `Total: ${currency(context.parsed)}`
                },
                title: (items) => {
                    const item = items[0]
                    return `${item.label} (${data.count[item.label]} operations)`
                }
            }
        }
    }, [data])

    useEffect(() => {
        const infos = {
            chartData: {
                Credit: 0,
                Debit: 0
            },
            count: {
                Credit: 0,
                Debit: 0
            }
        }

        operations.forEach(op => {
            const amount = parseFloat(op.amount)
            const key = (amount < 0 ? 'Debit' : 'Credit')
            infos.chartData[key] += amount
            infos.count[key] += 1
        })

        setChart({
            labels: Object.keys(infos.chartData),
            datasets: [{
                data: Object.values(infos.chartData),
            }],
        })
        setData(infos)
        setReload(reload + 1)
    }, [operations])

    return chart
        ? <Doughnut
            key={reload}
            data={chart}
            options={getOptions({
                title,
                plugins: {
                    tooltip,
                    autocolors: {
                        enabled: false
                    }
                }
            })}
            redraw={true}
        />
        : null
}
