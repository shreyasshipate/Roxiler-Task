import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Stat = () => {
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [combinedData, setCombinedData] = useState({});
  const [month, setMonth] = useState(3); // default month is March
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pieResponse = await axios.get(
          `http://localhost:5000/pie-chart?month=${month}`
        );
        const barResponse = await axios.get(
          `http://localhost:5000/bar-chart?month=${month}`
        );
        const combinedResponse = await axios.get(
          `http://localhost:5000/combined-data?month=${month}`
        );

        const pieData = pieResponse.data;
        const barData = barResponse.data;
        const combinedData = combinedResponse.data;

        const formattedPieData = Object.keys(pieData).map((key) => ({
          name: key,
          value: pieData[key],
        }));

        const formattedBarData = Object.keys(barData).map((key) => ({
          name: key,
          value: barData[key],
        }));

        setPieChartData(formattedPieData);
        setBarChartData(formattedBarData);
        setCombinedData(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [month]);

  return (
    <div>
      {/* sales Data for month logic */}
      <div style={{ paddingLeft: "40px" }}>
        <h1>Sales Data for Month: {month}</h1>
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          style={{
            width: 200,
            display: "flex",
            borderBlock: "bordered",
          }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>
      <br></br>
      <br></br>
      <h2 style={{ paddingLeft: "40px" }}>Combined Data: Sales Overview</h2>
      <div style={{ paddingLeft: "40px", textDecorationStyle: "solid" }}>
        <h3>Total Transactions: {combinedData.statsData?.totalTransactions}</h3>
        <h3>Total Sold Items: {combinedData.statsData?.totalSoldItems}</h3>
        <h3>Total Unsold Items: {combinedData.statsData?.totalUnsoldItems}</h3>
        <h3>Total Sale Amount: ${combinedData.statsData?.totalSaleAmount}</h3>
        <br></br>
      </div>

      {/* Pie-Chart Showing logic */}

      <div style={{ display: "flex", flexDirection: "initial" }}>
        <div style={{ paddingLeft: "40px" }}>
          <div>
            <h2>Pie Chart: Sales Category Distribution</h2>

            <br></br>
          </div>

          <PieChart width={400} height={400}>
            <Pie
              data={pieChartData}
              cx={200}
              cy={200}
              labelLine={false}
              label
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
      <div>
        <br></br>
        <br></br>
        <br></br>
      </div>

      {/* Bar-Chart Showing logic */}
      <div style={{ paddingLeft: "40px" }}>
        <h2>Bar Chart: Price Range Distribution</h2>
        <br></br>
        <br></br>
        <br></br>
      </div>
      <div>
        <br></br>
        <br></br>
        <br></br>
      </div>
      <BarChart width={700} height={400} data={barChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default Stat;
