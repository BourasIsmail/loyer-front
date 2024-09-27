"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {};

const PieChart = ({
  labels,
  colors,
  dataSet,
}: {
  labels: string[];
  colors: string[];
  dataSet: number[];
}) => {
  const data = {
    labels: labels,
    datasets: [
      {
        data: dataSet,
        backgroundColor: colors,
      },
    ],
  };
  return <Pie className="m-auto" data={data} options={options}></Pie>;
};

export default PieChart;
