import axios from "axios";
import Navbar from "../../components/Navbar";
import { useProduct } from "../../contexts/ProductContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SalesAgent = () => {
  const { sidebar, backendUrl, navigate, leads } = useProduct();
  const [salesAgentsList, setSalesAgentsList] = useState([]);
  const [leadsList, setLeadsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSalesAgentList = async (e) => {
    try {
      const { data } = await axios.get(backendUrl + "/v1/agents");
      if (data?.salesAgentsList) {
        setSalesAgentsList(data.salesAgentsList);
      } else {
        setSalesAgentsList([]);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchLeadsOfSalesAgent = (salesAgentId) => {
  //   const filteredLeads = leads.filter(
  //     (lead) => lead.salesAgent.id === salesAgentId
  //   );
  //   setLeadsList(filteredLeads);
  // };

  useEffect(() => {
    fetchSalesAgentList();
    // fetchLeadsOfSalesAgent();
  }, []);

  console.log(leads);
  console.log(salesAgentsList);

  return (
    <div className="dashboard-bg">
      <Navbar />
      <div className="dashboard-container">
        {sidebar()}

        <main className="dashboard-main">
          <div className="sales-div">
            <h2>Sales Agents List</h2>
            <button
              type="button"
              onClick={() => navigate("/add-new-agent")}
              className="sales-add-btn"
            >
              Add New Agent
            </button>
            <span className="badge-primary">
              Total Agents: {salesAgentsList.length}
            </span>
          </div>
          {loading ? (
            <p className="text-center mt-3">Loading sales agents...</p>
          ) : salesAgentsList.length > 0 ? (
            <div>
              {salesAgentsList ? (
                <div className="sales-cards py-2">
                  {salesAgentsList.map((agent) => {
                    const leadsList = leads.filter(
                      (lead) => lead.salesAgent.id === agent._id
                    );
                    return (
                      <div key={agent._id} className="mb-2 sales-cards">
                        <div className="list-div p-3 shadow-sm rounded bg-white">
                          <p className="mb-0">
                            <b>Name: </b>
                            {agent.name}
                            <br />
                            <b>Email: </b>
                            {agent.email}
                          </p>
                          <hr />
                          <div>
                            {leadsList.length > 0 ? (
                              <div>
                                <p className="text-center">
                                  Leads Assigned to {agent.name}
                                </p>
                                {leadsList.map((lead, index) => (
                                  <p>
                                    <b>Lead {index + 1}</b> - {" "}
                                      {lead.name} - [Status: {lead.status}]
                                  </p>
                                ))}
                              </div>
                            ) : (
                              <p className="text-center mt-4">
                                No Leads Assigned to {agent.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted">No Sales Agents found</p>
              )}
            </div>
          ) : (
            <p>No Sales Agents found</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default SalesAgent;
