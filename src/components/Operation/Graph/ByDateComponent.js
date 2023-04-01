import {useEffect, useMemo, useState} from "react";
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    Title,
    LineController,
    BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import {getOptions} from "@/helpers/graph";
import {currency, formatDate} from "@/helpers";

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    Title,
    LineController,
    BarController
);

export default function GraphByDate({ operations }) {

    const [data, setData] = useState(null)
    const [chart, setChart] = useState(null)
    const [reload, setReload] = useState(0)

    const tooltip = useMemo(() => {
        return {
            callbacks: {
                label: (context) => {
                    let label = context.dataset.label || ''
                    return `Total: ${currency(context.parsed.y)}`
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
            const key = formatDate(op.date, 'dd/MM/yyyy')
            infos.chartData.set(key, op.amount + (infos.chartData.get(key) || 0))
            infos.count[key] = 1 + (infos.count[key] || 0)
        })

        const dataSorted = new Map([...infos.chartData.entries()].sort())

        setChart({
            labels: [...dataSorted.keys()],
            datasets: [{
                label: 'Operations',
                data: [...dataSorted.values()],
            }],
        })
        setData(infos)
        setReload(reload + 1)
    }, [operations])

    return chart
        ? <Chart
            key={reload}
            type="bar"
            data={chart}
            options={getOptions({
                title: 'Operations',
                plugins: {tooltip},
                maintainAspectRatio: false,
            })}
            redraw={true}
            height="100%"
        />
        : null
}
