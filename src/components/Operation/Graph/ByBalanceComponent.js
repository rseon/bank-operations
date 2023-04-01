import {useEffect, useMemo, useState} from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors, Title } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {getOptions} from "@/helpers/graph";
import {getBalanceTotal} from "@/helpers/operation";
import {currency} from "@/helpers";

ChartJS.register(ArcElement, Tooltip, Legend, Colors, Title);

export default function GraphByBalance({ operations }) {

    const [chart, setChart] = useState(null)
    const [reload, setReload] = useState(0)

    const title = useMemo(() => {
        return `Balance (${currency(getBalanceTotal(operations))})`
    }, [operations])

    useEffect(() => {
        const data = {
            Credit: 0,
            Debit: 0
        }
        operations.forEach(op => {
            const amount = parseFloat(op.amount);
            data[(amount < 0 ? 'Debit' : 'Credit')] += amount
        })

        setChart({
            labels: Object.keys(data),
            datasets: [{
                label: 'Nb operations',
                data: Object.values(data),
            }],
        })
        setReload(reload + 1)
    }, [operations])

    return chart
        ? <Doughnut
            key={reload}
            data={chart}
            options={getOptions({ title })}
            redraw={true}
        />
        : null
}
