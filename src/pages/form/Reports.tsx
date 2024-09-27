import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const ReportPage = () => {
  // Sample data for the charts
  const voterData = {
    labels: ["Male", "Female", "Non-binary"],
    datasets: [
      {
        label: "Voter Demographics",
        data: [300, 450, 50],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  const surveyData = {
    labels: ["Question 1", "Question 2", "Question 3", "Question 4"],
    datasets: [
      {
        label: "Survey Results",
        data: [65, 59, 80, 81],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const voterTrendData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Voter Registration Trends",
        data: [50, 60, 70, 80, 90, 100],
        fill: false,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,0.4)",
      },
    ],
  };

  const surveyDistributionData = {
    labels: [
      "Strongly Agree",
      "Agree",
      "Neutral",
      "Disagree",
      "Strongly Disagree",
    ],
    datasets: [
      {
        label: "Survey Distribution",
        data: [20, 30, 25, 15, 10],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF9F40",
          "#4BC0C0",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF9F40",
          "#4BC0C0",
        ],
      },
    ],
  };

  return (
    <div className="p-4 w-3/4">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      <form className="mb-8">
        <div className="mb-4">
          <label className="block mb-2">
            Filter by Date:
            <input type="date" className="border p-2 block w-full mt-1" />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            Filter by Category:
            <select className="border p-2 block w-full mt-1">
              <option value="voters">Voters</option>
              <option value="survey">Survey</option>
            </select>
          </label>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
      </form>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Voter Demographics</h2>
        <Pie data={voterData} />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Survey Results</h2>
        <Bar data={surveyData} />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Voter Registration Trends
        </h2>
        <Line data={voterTrendData} />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Survey Distribution</h2>
        <Doughnut data={surveyDistributionData} />
      </div>
    </div>
  );
};

export default ReportPage;
