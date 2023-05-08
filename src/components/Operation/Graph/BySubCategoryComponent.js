/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useMemo, useState} from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors, Title } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {getOptions} from "@/helpers/graph";
import {currency, percent} from "@/helpers";
import autocolors from 'chartjs-plugin-autocolors';
import {useOperation} from "@/providers/operation";

ChartJS.register(ArcElement, Tooltip, Legend, Colors, Title, autocolors);

export default function GraphBySubCategory() {

    const {filtered: operations} = useOperation()
    const [chartData, setChartData] = useState(null)
    const [chart, setChart] = useState(null)
    const [reload, setReload] = useState(0)

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
            chartData: new Map(),
            count: {},
            total: operations.length
        }

        operations.forEach(op => {
            const key = op.subcat || "Uncategorized"
            infos.chartData.set(key, parseFloat(op.amount) + (infos.chartData.get(key) || 0))
            infos.count[key] = 1 + (infos.count[key] || 0)
        })

        const dataSorted = new Map([...infos.chartData.entries()].sort())

        setChart({
            labels: [...dataSorted.keys()],
            datasets: [{
                data: [...dataSorted.values()],
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
                title: 'Operations by sub-category',
                plugins: {tooltip}
            })}
            redraw={true}
        />
        : null
}
