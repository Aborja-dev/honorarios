import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type Plugin,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const centerTextPlugin: Plugin<'doughnut'> = {
  id: 'centerText',
  beforeDraw(chart) {
    const { width, height, ctx } = chart
    const dataset = chart.data.datasets[0]
    const total = (dataset?.data ?? []).reduce<number>(
      (acumulado, valor) => (typeof valor === 'number' ? acumulado + valor : acumulado),
      0,
    )

    ctx.save()
    ctx.font = 'bold 28px sans-serif'
    ctx.fillStyle = '#58112C'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(total.toLocaleString(), width / 2, height / 2 - 10)

    ctx.font = '500 14px sans-serif'
    ctx.fillStyle = '#71717A'
    ctx.fillText('Contratos', width / 2, height / 2 + 18)
    ctx.restore()
  },
}

export interface ChartAsignacionProps {
  asignados: number
  pendientes: number
}

export function ChartAsignacion({ asignados, pendientes }: ChartAsignacionProps) {
  const datos = {
    labels: ['Asignado', 'Pendiente'],
    datasets: [
      {
        data: [asignados, pendientes],
        backgroundColor: ['#58112C', '#F3E8EE'],
        borderColor: ['#FFFFFF', '#FFFFFF'],
        borderWidth: 2,
        cutout: '76%',
      },
    ],
  }

  const opciones: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.label}: ${Number(context.raw)} contratos`,
        },
      },
    },
  }

  return (
    <div className="honorarios-grafico">
      <Doughnut data={datos} options={opciones} plugins={[centerTextPlugin]} />
    </div>
  )
}

export default ChartAsignacion
