/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useMemo, useState} from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors, Title } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {getOptions} from "@/helpers/graph";
import {getBalanceTotal} from "@/helpers/operation";
import {currency, percent} from "@/helpers";
import {useOperation} from "@/providers/operation";

ChartJS.register(ArcElement, Tooltip, Legend, Colors, Title);

export default function GraphByBalance() {

    const {filtered: operations} = useOperation()
    const [chartData, setChartData] = useState(null)
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
                footer: (items) => {
                    const item = items[0]
                    return `${chartData.count[item.label]} / ${chartData.total} operations (${percent(chartData.count[item.label] / chartData.total * 100)})`
                }
            }
        }
    }, [chartData])

    useEffect(() => {
        const infos = {
            chartData: {
                Credit: 0,
                Debit: 0
            },
            count: {
                Credit: 0,
                Debit: 0
            },
            total: operations.length
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
        setChartData(infos)
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
