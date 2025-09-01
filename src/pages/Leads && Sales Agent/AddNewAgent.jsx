import { useState } from "react";
import Navbar from "../../components/Navbar";
import { useProduct } from "../../contexts/ProductContext";
import axios from "axios";
import { toast } from "react-toastify";

const AddNewAgent = () => {
  const { sidebar, backendUrl, navigate } = useProduct();
  const [newAgentData, setNewAgentData] = useState({ name: "", email: "" });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setNewAgentData({ ...newAgentData, [name]: value });
  };

  const submitFormHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/v1/agents",
        newAgentData
      );
      if (data.error) {
        toast.error(data.error);
        return;
      }
      toast.success("New Agent Added Successfully");
      navigate("/sales-agent");
    } catch (error) {
      console.log("Error adding new agent data");
    }
  };

  return (
    <div className="dashboard-bg">
      <Navbar />
      <div className="dashboard-container">
        {sidebar()}

        <main className="dashboard-main align-items-center">
          <h2>Add New Sales Agent</h2>

          <div className="leadAdd-form">
            <form onSubmit={submitFormHandler}>
              <div className="lead-input-div">
                <label htmlFor="">Agent Name:</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={newAgentData.name}
                  onChange={onChangeHandler}
                />
              </div>
              <br />

              <div className="lead-input-div">
                <label htmlFor="">Email Address:</label>
                <input
                  type="text"
                  name="email"
                  required
                  value={newAgentData.email}
                  onChange={onChangeHandler}
                />
              </div>
              <br />

              <button type="submit">Create Agent</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddNewAgent;
