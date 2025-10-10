import axios from "axios";
import Navbar from "../../components/Navbar";
import { useProduct } from "../../contexts/ProductContext";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { data } from "react-router-dom";

const Reports = () => {
  const { sidebar, backendUrl, leads, fetchLeaders } = useProduct();
  const [totalLeadInPipeLine, setTotalLeadInPipeLine] = useState();
  const [leadClosed, setLeadClosed] = useState();

  const fetchPipelineLeads = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/v1/report/pipeline");
      if (data) {
        setTotalLeadInPipeLine(data);
      }
    } catch (error) {
      toast.error("Failed to fetch the toal leads in pipeline");
    }
  };

  const fetchClosedLeads = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/v1/report/last-week");
      if (data) {
        setLeadClosed(data.length);
      }
    } catch (error) {
      toast.error("No Leads Closed Within Last Seven Days");
    }
  };

  const leadByStatus = useMemo(() => {
    const grouped = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      "Proposal Sent": 0,
      Closed: 0,
    };

    leads.forEach((lead) => {
      if (grouped[lead.status] !== undefined) {
        grouped[lead.status] += 1;
      }
    });
    return grouped;
  }, [leads]);

  const pipelineVsClosedData = {
    labels: ["Leads In Pipeline", "Closed Leads"],
    datasets: [
      {
        label: "Leads",
        data: [totalLeadInPipeLine?.totalLeadsInPipeline, leadClosed],
        backgroundColor: [ "#00C49F", "#AA66CC"],
      },
    ],
  };

    const closedBySalesAgent = {
    labels: ["Leads In Pipeline", "Lead closed by slaes agent"],
    datasets: [
      {
        label: "Leads",
        data: [totalLeadInPipeLine?.totalLeadsInPipeline, leadClosed],
        backgroundColor: ["#FFBB28", "#00C49F"],
      },
    ],
  };

  const leadStatusData = {
    labels: ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"],
    datasets: [
      {
        label: "Leads By Status",
        data: [
          leadByStatus["New"],
          leadByStatus["Qualified"],
          leadByStatus["Contacted"],
          leadByStatus["Proposal Sent"],
          leadByStatus["Closed"],
        ],
        backgroundColor: [
          "#0088FE",
          "#00C49F",
          "#FFBB28",
          "#FF8042",
          "#AA66CC",
        ],
      },
    ],
  };

  useEffect(() => {
    fetchPipelineLeads();
    fetchClosedLeads();
    fetchLeaders();
  }, [backendUrl]);


  return (
    <div className="dashboard-bg">
      <Navbar />
      <div className="dashboard-container">
        {sidebar()}

        <main className="dashboard-main">
          <h2 className="text-center">Report Overview</h2>

          <div className="report-grid">

            <div className="report-card pie-chart">
              <p className="text-center">Total Leads Closed and in Pipeline</p>
              <div>
                <h5 className="text-center">Pie Chart</h5>
                <Pie data={pipelineVsClosedData} />
              </div>
            </div>

            <div className="report-card">
              <p className="text-center">Lead Status Distribution</p>
              <div>
                <h5 className="text-center">Bar Chart</h5>
                <Bar data={leadStatusData} />
              </div>
            </div>

            <div className="report-card">
              <p className="text-center">Leads Closed by Sales Agent</p>
              <div>
                <h5 className="text-center">Bar Chart</h5>
                <Bar data={closedBySalesAgent} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
