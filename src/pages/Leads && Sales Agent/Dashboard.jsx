import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useProduct } from "../../contexts/ProductContext";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { backendUrl } = useProduct();
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredLeads, setFilteredLeads] = useState([]);

  axios.defaults.withCredentials = true;

  const fetchLeaders = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/v1/leads`);
      if (Array.isArray(data)) {
        setLeads(data);
        setFilteredLeads(data);
      } else {
        toast.error("Failed to fetch leads");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // const leadersByStatus = async () => {
  //     try {
  //         const {data} = await axios.get(backendUrl + `/v1/leades/?status="${statusFilter}"`)
  //         if(data.success){
  //             setShowStatus(data)
  //         }else {
  //             console.log('Error fetching leads by status')
  //         }
  //     } catch (error) {
  //         console.log(error.message)
  //     }
  // }

  useEffect(() => {
    if (!statusFilter) {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter((lead) => lead.status === statusFilter));
    }
  }, [statusFilter, leads]);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  console.log(leads);

  return (
    <div className="dashboard-bg">
      <Navbar />

      <div className="dashboard-container">
        <aside className="dash-board-sidebar">
          <h5 className="sidebar-title">Dashboard Menu</h5>
          <ul className="sidebar-links">
            <li>
              <Link className="sidebar-link">Leads</Link>
            </li>
            <li>
              <Link className="sidebar-link">Sales Agents</Link>
            </li>
            <li>
              <Link className="sidebar-link">Reports</Link>
            </li>
            <li>
              <Link className="sidebar-link">Settings</Link>
            </li>
          </ul>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-header">
            <h2>📈 Leads Dashboard</h2>
            <span className="badge-primary">Total Leads: {leads.length}</span>
          </div>

          <div className="filter-section">
            <label htmlFor="status" className="form-label fs-5 fw-semibold">
              Filter By Status
            </label>
            <select
              onChange={(e) => setFilteredLeads(e.target.value)}
              name=""
              id="status"
              className="form-select form-control w-auto d-inline-block ms-2"
              value={statusFilter}
            >
              <option defaultChecked value="">
                Select Status
              </option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Closed">Closed</option>
            </select>
            <button className="verify-btn py-2 ms-3" style={{ width: "200px" }}>
              Add New Lead
            </button>
          </div>

          <div className="status-summary">
            <h3>Lead Status:</h3>
            {["New", "Contacted", "Qualified", "Proposal Sent", "Closed"].map(
              (status) => (
                <div>
                  <h6>{status}</h6>
                  <p>{statusCounts[status] || 0} Leads</p>
                </div>
              )
            )}
          </div>

          <div className="leads-grid">
            {filteredLeads.length === 0 ? (
              <p className="text-muted">No Leads available</p>
            ) : (
              filteredLeads.map((lead) => (
                <div key={lead._id} className="lead-card">
                  <h5 fw-bold>Name: {lead.name}</h5>
                  <p>Status: {lead.status}</p>
                  <p>Source: {lead.source}</p>
                  <p>Agent: {lead.salesAgent?.name || "Unassigned"}</p>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
