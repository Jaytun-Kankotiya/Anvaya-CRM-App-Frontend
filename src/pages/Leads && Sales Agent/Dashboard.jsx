import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useProduct } from "../../contexts/ProductContext";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { backendUrl, sidebar, leads, setLeads, fetchLeaders, filteredLeads, setFilteredLeads, statusFilter, setStatusFilter, handleStatusChnage } = useProduct();
  

  const navigate = useNavigate()

  axios.defaults.withCredentials = true;

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
  }, {})



  return (
    <div className="dashboard-bg">
      <Navbar />

      <div className="dashboard-container">
       { sidebar()}

        <main className="dashboard-main">
          <div className="dashboard-header">
            <h2>📈 Leads Dashboard</h2>
            <span className="badge-primary">Total Leads: {leads.length}</span>
          </div>

          <div className="filter-section mb-3">
              <label htmlFor="status" className="fs-5">
                Filter By Status:
              </label>
              <select
                onChange={(e) => handleStatusChnage(e.target.value)}
                name=""
                id="status"
                className=""
                value={statusFilter}
              >
                <option defaultChecked value="">
                  All
                </option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Closed">Closed</option>
              </select>
            <button type="button" className="verify-btn py-2" onClick={() => navigate('/add-new-lead')} style={{ width: "200px" }}>
              Add New Lead
            </button>
          </div>

          <div>
            <h3>Lead Status:</h3>
            <div className="status-summary">
              {["New", "Contacted", "Qualified", "Proposal Sent", "Closed"].map(
                (status) => (
                  <div className="status-card">
                    <h6>{status}</h6>
                    <p>{statusCounts[status] || 0} Leads</p>
                  </div>
                )
              )}
            </div>
          </div>

            <h3 className="leads-list">List of Leads:</h3>
            <div className="leads-grid">
              {filteredLeads.length === 0 ? (
                <p className="empty-text">No Leads available</p>
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
