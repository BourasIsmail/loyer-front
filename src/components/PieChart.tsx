"use client"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

const PieChart = ({
  labels,
  colors,
  dataSet,
}: {
  labels: string[]
  colors: string[]
  dataSet: number[]
}) => {
  const data = {
    labels: labels,
    datasets: [
      {
        data: dataSet,
        backgroundColor: colors,
        borderColor: colors.map((color) => color + "20"),
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverBorderColor: "#ffffff",
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((context.parsed / total) * 100).toFixed(1)
            return `${context.label}: ${context.parsed} (${percentage}%)`
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
      },
    },
  }

  return (
    <div className="h-64 flex items-center justify-center">
      <Pie data={data} options={options} />
    </div>
  )
}

export default PieChart
