import axios from "axios";
import Navbar from "../../components/Navbar";
import { useProduct } from "../../contexts/ProductContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddNewLead = () => {
  const { sidebar, backendUrl } = useProduct();
  const [salesAgentData, setSalesAgentsData] = useState([]);
  const [leadData, setLeadData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "",
    tags: "",
    priority: "",
    timeToClose: "",
  });

  const navigate = useNavigate()

  const getSalesAgent = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/v1/agents");
      if (data.success) {
        setSalesAgentsData(data.salesAgentsList);
      } else {
        console.log("Error fetching sales Agents data");
      }
    } catch (error) {
      console.log("Failed to fetch the Sales Agents");
    }
  };

  useEffect(() => {
    getSalesAgent();
  }, []);


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setLeadData({ ...leadData, [name]: value });
  };

  const postNewLead = async (e) => {
    e.preventDefault()
    try {
        const {data} = await axios.post(backendUrl + '/v1/leads/add', leadData)
        if(data.error) {
            toast.error(data.error)
            return
        }
        toast.success(data.message)
        navigate('/anvaya-dashboard')
    } catch (error) {
        console.log("Error adding new lead data")
        toast.error(error.response?.data?.error || "Something went wrong");
    }
  }


  return (
    <div className="dashboard-bg">
      <Navbar />
      <div className="dashboard-container">
        {sidebar()}

        <main className="dashboard-main align-items-center">
          <h2>Add New Lead</h2>

          <div className="leadAdd-form">
            <form onSubmit={postNewLead}>
              <div className="lead-input-div">
                <label htmlFor="">Lead Name:</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Full Name"
                  onChange={handleFormChange}
                  value={leadData.name}
                />
              </div><br />

              <div className="lead-input-div">
                <label >Lead Source:</label>
                <select
                  name="source"
                  id="source"
                  required
                  value={leadData.source}
                  onChange={handleFormChange}
                >
                  <option value="" defaultChecked>
                    Select source
                  </option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Email">Email</option>
                  <option value="Other">Other</option>
                </select>
              </div><br />

              <div className="lead-input-div">
                <label htmlFor="">Sales Agent:</label>
                <select
                  name="salesAgent"
                  id="agents"
                  required
                  value={leadData.salesAgent}
                  onChange={handleFormChange}
                >
                  <option value="" >
                    Select Agent
                  </option>
                  {salesAgentData.map((agent) =>( 
                    <option key={agent._id} value={agent._id}>{agent.name} - {agent._id}</option>
                  ))}
                </select>
              </div><br />

              <div className="lead-input-div">
                <label htmlFor="">Lead Status:</label>
                <select
                  name="status"
                  id=""
                  required
                  value={leadData.status}
                  onChange={handleFormChange}
                >
                  <option value="" defaultChecked>
                    Select Status
                  </option>
                  <option value="New" defaultChecked>
                    New
                  </option>
                  <option value="Contacted" defaultChecked>
                    Contacted
                  </option>
                  <option value="Qualified" defaultChecked>
                    Qualified
                  </option>
                  <option value="Proposal Sent" defaultChecked>
                    Proposal Sent
                  </option>
                  <option value="Closed" defaultChecked>
                    Closed
                  </option>
                </select>
              </div><br />

              <div className="lead-input-div">
                <label htmlFor="">Priority:</label>
                <select
                  name="priority"
                  id=""
                  required
                  value={leadData.priority}
                  onChange={handleFormChange}
                >
                  <option value="" defaultChecked>
                    Select Priority
                  </option>
                  <option value="High" defaultChecked>
                    High
                  </option>
                  <option value="Medium" defaultChecked>
                    Medium
                  </option>
                  <option value="Low" defaultChecked>
                    Low
                  </option>
                </select>
              </div><br />

              <div className="lead-input-div">
                <label htmlFor="">Time to Close:</label>
                <input
                  name="timeToClose"
                  type="number"
                  required
                  placeholder="Number of Days"
                  value={leadData.timeToClose}
                  onChange={handleFormChange}
                />
              </div><br />

              <div className="lead-input-div">
                <label htmlFor="">Tag:</label>
                <select
                  name="tags"
                  id=""
                  required
                  value={leadData.tags}
                  onChange={handleFormChange}
                >
                  <option value="" defaultChecked>
                    Select Tags
                  </option>
                  <option value="High Value">High Value</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
              </div><br />

              <button type="submit">Add New Lead</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddNewLead;
