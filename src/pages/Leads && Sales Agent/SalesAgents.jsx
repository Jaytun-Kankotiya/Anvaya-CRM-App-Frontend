import axios from "axios";
import Navbar from "../../components/Navbar";
import { useProduct } from "../../contexts/ProductContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SalesAgent = () => {
  const { sidebar, backendUrl } = useProduct();
  const [salesAgentsList, setSalesAgentsList] = useState();
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

  console.log(salesAgentsList);

  return (
    <div className="dashboard-bg">
      <Navbar />
      <div className="d-flex">
        {sidebar()}

        <main className="sales-main-div w-100">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2>Sales Agent List</h2>
            <button type="button" className="sales-add-btn">
              Add New Agent
            </button>
          </div>
          {loading ? (
            <p>Loading sales agents...</p>
          ) : salesAgentsList.length > 0 ? (
            <div>
              {salesAgentsList ? (
                <div className="row py-2">
                  {salesAgentsList.map((agent) => (
                    <div key={agent._id}  className="col-md-3 mb-3">
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
