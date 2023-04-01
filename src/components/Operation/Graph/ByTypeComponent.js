/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useMemo, useState} from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors, Title } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {getOptions} from "@/helpers/graph";
import {currency} from "@/helpers";
import autocolors from 'chartjs-plugin-autocolors';

ChartJS.register(ArcElement, Tooltip, Legend, Colors, Title, autocolors);

export default function GraphByType({ operations }) {

    const [data, setData] = useState(null)
    const [chart, setChart] = useState(null)
    const [reload, setReload] = useState(0)

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
            chartData: new Map(),
            count: {}
        }

        operations.forEach(op => {
            const key = op.type
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
        setData(infos)
        setReload(reload + 1)
    }, [operations])

    return chart
        ? <Doughnut
            key={reload}
            data={chart}
            options={getOptions({
                title: 'Operations by type',
                plugins: {
                    tooltip
                }
            })}
            redraw={true}
        />
        : null
}
