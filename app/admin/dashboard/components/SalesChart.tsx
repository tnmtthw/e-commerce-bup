import React, { useState } from "react";
import useSWR from "swr";
import {
  Card,
  CardBody,
  Button,
  ButtonGroup,
  CardHeader,
} from "@nextui-org/react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import SalesChartLoading from "./SalesChartLoading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface Order {
  total_price: number;
  created_at: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SalesChart = () => {
  const { data: orders = [], error } = useSWR<Order[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/dboard/orders-only`,
    fetcher,
  );

  const [timeFrame, setTimeFrame] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("daily");

  if (error) return <SalesChartLoading/>;
  if (!orders) return <SalesChartLoading/>;

  // Helper functions to group orders by time frame
  const groupByTimeFrame = (timeFrame: string) => {
    const groupedData: { [key: string]: number } = {};

    orders.forEach((order) => {
      const date = new Date(order.created_at);

      let key;
      switch (timeFrame) {
        case "daily":
          key = date.toLocaleDateString();
          break;
        case "weekly":
          const week = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
          key = week;
          break;
        case "monthly":
          key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          break;
        case "yearly":
          key = `${date.getFullYear()}`;
          break;
        default:
          key = date.toLocaleDateString();
      }

      if (groupedData[key]) {
        groupedData[key] += order.total_price;
      } else {
        groupedData[key] = order.total_price;
      }
    });

    return groupedData;
  };

  // Prepare data for the chart based on the selected time frame
  const groupedOrders = groupByTimeFrame(timeFrame);
  const chartData = {
    labels: Object.keys(groupedOrders),
    datasets: [
      {
        label: `Sales (${timeFrame})`,
        data: Object.values(groupedOrders),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Sales Chart (${timeFrame})`,
      },
    },
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex justify-center mb-4">
          <ButtonGroup>
            <Button
              onClick={() => setTimeFrame("daily")}
              color={timeFrame === "daily" ? "primary" : "default"}
            >
              Daily
            </Button>
            <Button
              onClick={() => setTimeFrame("weekly")}
              color={timeFrame === "weekly" ? "primary" : "default"}
            >
              Weekly
            </Button>
            <Button
              onClick={() => setTimeFrame("monthly")}
              color={timeFrame === "monthly" ? "primary" : "default"}
            >
              Monthly
            </Button>
            <Button
              onClick={() => setTimeFrame("yearly")}
              color={timeFrame === "yearly" ? "primary" : "default"}
            >
              Yearly
            </Button>
          </ButtonGroup>
        </CardHeader>
        <CardBody>
          <Line data={chartData} options={chartOptions} />
        </CardBody>
      </Card>
    </div>
  );
};

export default SalesChart;
