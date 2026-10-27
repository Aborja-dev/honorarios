import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type Plugin,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export const COLORES_ESTATUS = ['#0B6623', '#1E40AF', '#C09A53', '#991B1B']

const ETIQUETAS_ESTATUS = [
  'Autorizados',
  'Cancelación anticipada',
  'En proceso',
  'Cancelado por vencimiento',
]

const pieSliceLabelsPlugin: Plugin<'pie'> = {
  id: 'pieSliceLabels',
  afterDraw(chart) {
    const { ctx } = chart

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex)

      meta.data.forEach((element, index) => {
        const valor = dataset.data[index]
        if (typeof valor !== 'number' || valor === 0) return

        const { x, y } = element.tooltipPosition(true)
        if (x === null || y === null) return

        ctx.save()
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 15px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
        ctx.shadowBlur = 4
        ctx.shadowOffsetX = 1
        ctx.shadowOffsetY = 1
        ctx.fillText(valor.toString(), x, y)
        ctx.restore()
      })
    })
  },
}

export interface ChartEstatusProps {
  datos: number[]
}

export function ChartEstatus({ datos }: ChartEstatusProps) {
  const grafico = {
    labels: ETIQUETAS_ESTATUS,
    datasets: [
      {
        data: datos,
        backgroundColor: COLORES_ESTATUS,
        borderColor: '#FFFFFF',
        borderWidth: 2.5,
      },
    ],
  }

  const opciones: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.label}: ${Number(context.raw)}%`,
        },
      },
    },
  }

  return (
    <div className="honorarios-grafico">
      <Pie data={grafico} options={opciones} plugins={[pieSliceLabelsPlugin]} />
    </div>
  )
}

export default ChartEstatus
