import axios from "axios";
import Navbar from "../../components/Navbar";
import { useProduct } from "../../contexts/ProductContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Leads = () => {
  const { sidebar, leads, setLeads, fetchLeaders, backendUrl, salesAgentData } = useProduct();
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");
  const [editLead, setEditLead] = useState(false);
  const [updatedLeadData, setUpdatedLeadData] = useState({name: '', source: '', salesAgent: '', status: '', tags: '', timeToClose: '', priority: ''});

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

  useEffect(() => {
    if (leads.length > 0) {
      leads.forEach((lead) => {
        fetchCommentsPerLead(lead.id);
      });
    }
  }, [leads, backendUrl]);

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
        const {data} = await axios.put(backendUrl + `/v1/leads/${leadId}`, updatedLeadData)
        if(data) {
            toast.success("Lead Data Updated Successfully")
        }
    } catch (error) {
        toast.error("Error while editing lead data")
    }
  }

  console.log(leads);
  console.log(commentText);

  return (
    <div className="dashboard-bg">
      <Navbar />
      <div className="dashboard-container">
        {sidebar()}

        <div className="dashboard-main">
          <h2 className="text-center">Lead Details</h2>

          <div>
            {leads.length > 0 ? (
              <div className="leads-grid mt-2">
                {leads.map((lead) => (
                  <div className="lead-card-div" key={lead._id}>
                    <p>
                      <b>Lead Name: </b>
                      {editLead ? <input type="text" disabled={!editLead} name="name" value={lead?.name ?? ""} onChange={(e) => setUpdatedLeadData((prev) => ({...prev, name: e.target.value}))} /> : <span>{lead.name}</span> }
                    </p>
                    <p> 
                      <b>Sales Agent: </b>
                      {editLead ? (
                        <select
                        name="salesAgent"
                        value={updatedLeadData.salesAgent}
                        onChange={(e) => setUpdatedLeadData((prev) => ({...prev, name: e.target.value}))}
                        >
                        <option value="" >Select Agent</option>
                        {salesAgentData.map((agent) =>( 
                            <option key={agent._id} value={agent._id}>{agent.name} - {agent._id}</option>
                        ))}
                        </select>
                      ) : (
                        <span>{lead.salesAgent.name}</span>
                      )}
                    </p>
                    <p>
                      <b>Lead Source: </b>
                      {editLead ? (
                      <select type="text" name="source" value={updatedLeadData.source} onChange={(e) => setUpdatedLeadData((prev) => ({...prev, name: e.target.value}))} >
                        <option value="" defaultChecked>Select Source</option>
                        <option value="Website">Website</option>
                        <option value="Referral">Referral</option>
                        <option value="Cold Call">Cold Call</option>
                        <option value="Advertisement">Advertisement</option>
                        <option value="Email">Email</option>
                        <option value="Other">Other</option>
                      </select>) : (
                        <span>{lead.source}</span>)}
                    </p>
                    <p>
                      <b>Lead Status: </b>
                      {editLead ? (
                      <select type="text" name="status" value={updatedLeadData.status} onChange={(e) => setUpdatedLeadData((prev) => ({...prev, name: e.target.value}))} >
                        <option value="" defaultChecked>Select Status</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Closed">Closed</option>
                      </select>) : (
                        <span>{lead.status}</span>)}
                    </p>
                    <p>
                      <b>Priority: </b>
                      {editLead ? (
                      <select type="text" name="priority" value={updatedLeadData.priority} onChange={(e) => setUpdatedLeadData((prev) => ({...prev, name: e.target.value}))} >
                        <option value="" defaultChecked>Select Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>) : (
                        <span>{lead.priority}</span>)}
                    </p>
                    <p>
                      <b>Time to close: </b>
                      {editLead ? <input type="number" disabled={!editLead} name="name" value={lead?.timeToClose ?? ""} onChange={(e) => setUpdatedLeadData((prev) => ({...prev, name: e.target.value}))} /> : <span>{lead.timeToClose}</span> }
                    </p>
                    <button className="edit-btn py-2" onClick={() => setEditLead((prev) => !prev)}>{editLead ? 'Cancel' : 'Edit Lead Data'}</button>
                    {editLead ? <button className="edit-btn py-2 mt-2">Submit Update</button> : ''}
                    <div>
                      <h4 className="text-center py-3">Comments</h4>
                      {comments[lead.id]?.length > 0 ? (
                        comments[lead.id].map((comment, index) => (
                          <div key={comment.id}>
                            <div className="d-flex gap-2">
                              <p><b>{comment.author}</b></p> -{" "}
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
                            await
                            addComment(
                            lead.id,
                            commentText[lead.id],
                            lead.salesAgent.id
                          );
                          setCommentText((prev) => ({
                            ...prev,
                            [lead.id]: ""
                          }))
                        }}
                        className="edit-btn py-2 mt-1"
                      >
                        Submit Comment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center mt-2">No Leads Found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leads;
