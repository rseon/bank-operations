import {useEffect, useState} from "react";
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
import {formatDate} from "@/helpers";

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

    const [chart, setChart] = useState(null)
    const [reload, setReload] = useState(0)

    useEffect(() => {
        const byDate = new Map()
        operations.forEach(op => {
            const date = formatDate(op.date, 'yyyy-MM-dd')
            let nb = byDate.get(date) || 0
            byDate.set(date, ++nb)
        })

        const byDateSorted = new Map([...byDate.entries()].sort())

        setChart({
            labels: [...byDateSorted.keys()],
            datasets: [
                {
                    type: 'line',
                    label: 'Nb operations',
                    data: [...byDateSorted.values()],
                },
            ],
        })
        setReload(reload + 1)
    }, [operations])

    return chart
        ? <Chart
            key={reload}
            type="line"
            data={chart}
            options={getOptions({
                title: 'Operations',
            })}
            redraw={true}
        />
        : null
}
