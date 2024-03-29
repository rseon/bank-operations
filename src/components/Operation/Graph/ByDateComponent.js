/* eslint-disable react-hooks/exhaustive-deps */
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
import {useOperation} from "@/providers/operation";

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

export default function GraphByDate() {

    const {filtered: operations} = useOperation()
    const [chartData, setChartData] = useState(null)
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
                    return `${formatDate(item.label, 'dd/MM/yyyy')} (${chartData.count[item.label]} operations)`
                }
            }
        }
    }, [chartData])

    useEffect(() => {
        const infos = {
            chartData: new Map(),
            count: {}
        }

        operations.forEach(op => {
            const key = formatDate(op.date, 'yyyy-MM-dd')
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
        setChartData(infos)
        setReload(reload + 1)
    }, [operations])

    return chart
        ? <Chart
            key={reload}
            type="bar"
            data={chart}
            options={getOptions({
                title: 'Operations',
                plugins: {
                    tooltip,
                    autocolors: {
                        enabled: false
                    }
                },
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            callback: function(val, index) {
                                return formatDate(this.getLabelForValue(val), 'dd/MM/yyyy')
                            }
                        }
                    },
                    y: {
                        ticks: {
                            callback: function(val, index) {
                                return currency(val)
                            }
                        }
                    }
                }
            })}
            redraw={true}
            height="100%"
        />
        : null
}
