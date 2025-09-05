import axios from "axios";
import Navbar from "../../components/Navbar";
import { useProduct } from "../../contexts/ProductContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Leads = () => {
  const {
    sidebar,
    leads,
    setLeads,
    fetchLeaders,
    backendUrl,
    salesAgentData,
    statusFilter,
    setStatusFilter,
    filteredLeads,
    setFilteredLeads,
    handleStatusChnage,
    getSalesAgent,
  } = useProduct();
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");
  const [editLeadId, setEditLeadId] = useState(null);
  const [updatedLeadData, setUpdatedLeadData] = useState({});

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const fetchCommentsPerLead = async (leadId) => {
    try {
      const { data } = await axios.get(
        backendUrl + `/v1/leads/${leadId}/comments`
      );
      setComments((prev) => ({ ...prev, [leadId]: data }));
    } catch (error) {
      console.log("Error fetching comment");
    }
  };

  const startEditing = (lead) => {
    setEditLeadId(lead.id);
    setUpdatedLeadData({
      name: lead.name,
      source: lead.source,
      salesAgent: lead.salesAgent?.id || "",
      status: lead.status,
      tags: lead.tags,
      timeToClose: lead.timeToClose,
      priority: lead.priority,
    });
  };

  const cancelEditing = () => {
    setEditLeadId(null);
  };

  useEffect(() => {
    if (leads.length > 0) {
      leads.forEach((lead) => {
        fetchCommentsPerLead(lead.id);
      });
    }
    if (!statusFilter) {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter((lead) => lead.status === statusFilter));
    }
    getSalesAgent();
  }, [leads, backendUrl, statusFilter]);

  const addComment = async (leadId, commentText, authorId) => {
    if (!commentText || !authorId) return;
    try {
      const { data } = await axios.post(
        backendUrl + `/v1/leads/${leadId}/comments`,
        { commentText, authorId }
      );
      if (data) {
        setComments((prev) => ({
          ...prev,
          [leadId]: [...(prev[leadId] || []), data],
        }));
        toast.success("Comment Added Successfully");
      }
    } catch (error) {
      toast.error("Error while submitting comment");
    }
  };

  const updateLead = async (leadId) => {
    try {
      const { data } = await axios.put(
        backendUrl + `/v1/leads/${leadId}`,
        updatedLeadData
      );
      if (data) {
        toast.success("Lead Data Updated Successfully");
        fetchLeaders();
        cancelEditing();
      }
    } catch (error) {
      toast.error("Error while editing lead data", error.message);
    }
  };

  const sortedLeads = [...filteredLeads].sort((a, b) => {
  if (a.status === "Closed" && b.status !== "Closed") return 1; 
  if (a.status !== "Closed" && b.status === "Closed") return -1; 
  return 0; 
});
  console.log(leads);
  console.log(updatedLeadData);

  return (
    <div className="dashboard-bg">
      <Navbar />
      <div className="dashboard-container">
        {sidebar()}

        <div className="dashboard-main">
          <h2 className="text-center">Lead Details</h2>

          <div className="filter-section mb-3 mt-3 justify-content-between">
            <div>
              <label htmlFor="status" className="fs-5">
                Filter By Status:
              </label>
              <select
                onChange={(e) => handleStatusChnage(e.target.value)}
                name=""
                id="status"
                className=""
                style={{ width: "250px" }}
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
            </div>
            <button
              type="button"
              className="verify-btn py-2"
              onClick={() => navigate("/add-new-lead")}
              style={{ width: "200px" }}
            >
              Add New Lead
            </button>
          </div>

          <div>
            {sortedLeads.length > 0 ? (
              <>
                <div className="leads-grid mt-2">
                  {sortedLeads.map((lead) => (
                    <div className="lead-card-div" key={lead.id}>
                      <div className="">
                        <p>
                          <b>Lead Name: </b>
                          {editLeadId === lead.id ? (
                            <input
                              type="text"
                              name="name"
                              value={updatedLeadData.name || ""}
                              onChange={(e) =>
                                setUpdatedLeadData((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                            />
                          ) : (
                            <span>{lead.name}</span>
                          )}
                        </p>
                      </div>

                      <div>
                        <p>
                          <b>Sales Agent: </b>
                          {editLeadId === lead.id ? (
                            <select
                              name="salesAgent"
                              value={updatedLeadData.salesAgent || ""}
                              onChange={(e) =>
                                setUpdatedLeadData((prev) => ({
                                  ...prev,
                                  salesAgent: e.target.value,
                                }))
                              }
                            >
                              <option value="">Select Agent</option>
                              {salesAgentData.map((agent) => (
                                <option key={agent._id} value={agent._id}>
                                  {agent.name} - {agent._id}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span>{lead.salesAgent?.name}</span>
                          )}
                        </p>
                      </div>

                      <div>
                        <p>
                          <b>Lead Source: </b>
                          {editLeadId === lead.id ? (
                            <select
                              type="text"
                              name="source"
                              value={updatedLeadData.source || ""}
                              onChange={(e) =>
                                setUpdatedLeadData((prev) => ({
                                  ...prev,
                                  source: e.target.value,
                                }))
                              }
                            >
                              <option value="" defaultChecked>
                                Select Source
                              </option>
                              <option value="Website">Website</option>
                              <option value="Referral">Referral</option>
                              <option value="Cold Call">Cold Call</option>
                              <option value="Advertisement">
                                Advertisement
                              </option>
                              <option value="Email">Email</option>
                              <option value="Other">Other</option>
                            </select>
                          ) : (
                            <span>{lead?.source}</span>
                          )}
                        </p>
                      </div>

                      <div>
                        <p>
                          <b>Lead Status: </b>
                          {editLeadId === lead.id ? (
                            <select
                              type="text"
                              name="status"
                              value={updatedLeadData.status || ""}
                              onChange={(e) =>
                                setUpdatedLeadData((prev) => ({
                                  ...prev,
                                  status: e.target.value,
                                }))
                              }
                            >
                              <option value="" defaultChecked>
                                Select Status
                              </option>
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Qualified">Qualified</option>
                              <option value="Proposal Sent">
                                Proposal Sent
                              </option>
                              <option value="Closed">Closed</option>
                            </select>
                          ) : (
                            <span>{lead?.status}</span>
                          )}
                        </p>
                      </div>

                      <div>
                        <p>
                          <b>Priority: </b>
                          {editLeadId === lead.id ? (
                            <select
                              type="text"
                              name="priority"
                              value={updatedLeadData.priority || ""}
                              onChange={(e) =>
                                setUpdatedLeadData((prev) => ({
                                  ...prev,
                                  priority: e.target.value,
                                }))
                              }
                            >
                              <option value="" defaultChecked>
                                Select Priority
                              </option>
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                            </select>
                          ) : (
                            <span>{lead?.priority}</span>
                          )}
                        </p>
                      </div>

                      <div>
                        <p>
                          <b>Time to close: </b>
                          {editLeadId === lead.id ? (
                            <input
                              type="number"
                              name="timeToClose"
                              value={updatedLeadData.timeToClose || ""}
                              onChange={(e) =>
                                setUpdatedLeadData((prev) => ({
                                  ...prev,
                                  timeToClose: Number(e.target.value),
                                }))
                              }
                            />
                          ) : (
                            <span>{lead?.timeToClose}</span>
                          )}
                        </p>
                      </div>

                      {editLeadId === lead.id ? (
                        <>
                          <button
                            onClick={cancelEditing}
                            className="edit-btn py-2 mt-2"
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            onClick={() => updateLead(lead.id)}
                            className="edit-btn py-2 mt-2"
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEditing(lead)}
                          className="edit-btn py-2"
                        >
                          Edit Lead Data
                        </button>
                      )}
                      <div>
                        <h4 className="text-center py-3">Comments</h4>
                        {comments[lead.id]?.length > 0 ? (
                          comments[lead.id].map((comment, index) => (
                            <div key={comment.id}>
                              <div className="d-flex gap-2">
                                <p>
                                  <b>{comment.author}</b>
                                </p>{" "}
                                -{" "}
                                <p>
                                  {new Date(comment.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <p>
                                <b>Comment: </b>
                                {comment.commentText}
                              </p>
                              {index < comments[lead.id].length - 1 && <hr />}
                            </div>
                          ))
                        ) : (
                          <p>No Comments</p>
                        )}
                      </div>
                      <div className="py-2">
                        <textarea
                          type="text"
                          value={commentText[lead.id] || ""}
                          onChange={(e) =>
                            setCommentText((prev) => ({
                              ...prev,
                              [lead.id]: e.target.value,
                            }))
                          }
                          rows={3}
                          placeholder="Add New Comment"
                          className="text-center"
                          style={{ width: "100%" }}
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            await addComment(
                              lead.id,
                              commentText[lead.id],
                              lead.salesAgent.id
                            );
                            setCommentText((prev) => ({
                              ...prev,
                              [lead.id]: "",
                            }));
                          }}
                          className="edit-btn py-2 mt-1"
                        >
                          Submit Comment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center mt-2">No Active Leads Found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leads;
