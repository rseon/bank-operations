import {useEffect, useMemo, useState} from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors, Title } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {getOptions} from "@/helpers/graph";

ChartJS.register(ArcElement, Tooltip, Legend, Colors, Title);

export default function GraphByType({ operations }) {

    const [chart, setChart] = useState(null)
    const [reload, setReload] = useState(0)

    useEffect(() => {
        const data = new Map()
        operations.forEach(op => {
            let nb = data.get(op.type) || 0
            data.set(op.type, ++nb)
        })

        const dataSorted = new Map([...data.entries()].sort())

        setChart({
            labels: [...dataSorted.keys()],
            datasets: [{
                label: 'Nb operations',
                data: [...dataSorted.values()],
            }],
        })
        setReload(reload + 1)
    }, [operations])

    return chart
        ? <Doughnut
            key={reload}
            data={chart}
            options={getOptions({ title: 'Operations by type' })}
            redraw={true}
        />
        : null
}
