import axios from "axios";
import Navbar from "../../components/Navbar";
import { useProduct } from "../../contexts/ProductContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SalesAgent = () => {
  const { sidebar, backendUrl, navigate } = useProduct();
  const [salesAgentsList, setSalesAgentsList] = useState([]);
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

  useEffect(() => {
    fetchSalesAgentList();
  }, []);

  return (
    <div className="dashboard-bg">
      <Navbar />
      <div className="dashboard-container">
        {sidebar()}

        <main className="dashboard-main">
          <div className="sales-div">
            <h2>Sales Agent List</h2>
            <button type="button" onClick={() => navigate('/add-new-agent')} className="sales-add-btn">
              Add New Agent
            </button>
            <span className="badge-primary">Total Agents: {salesAgentsList.length}</span>
          </div>
          {loading ? (
            <p>Loading sales agents...</p>
          ) : salesAgentsList.length > 0 ? (
            <div>
              {salesAgentsList ? (
                <div className="sales-cards py-2">
                  {salesAgentsList.map((agent) => (
                    <div key={agent._id}  className="mb-2">
                      <div
                        className="list-div p-3 shadow-sm rounded bg-white"
                      >
                        <p className="mb-0">
                          <b>Name: </b>
                          {agent.name}
                          <br />
                          <b>Email: </b>
                          {agent.email}
                        </p>
                      </div>
                    </div>
                  ))}
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
