import axios from "axios";
import Navbar from "../../components/Navbar";
import { useProduct } from "../../contexts/ProductContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Leads = () => {
  const { sidebar, leads, setLeads, fetchLeaders, backendUrl } = useProduct();
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");

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
        // addComment(lead.id)
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
                      {lead.name}
                    </p>
                    <p>
                      <b>Sales Agent: </b>
                      {lead.salesAgent.name}
                    </p>
                    <p>
                      <b>Lead Source: </b>
                      {lead.source}
                    </p>
                    <p>
                      <b>Lead Status: </b>
                      {lead.status}
                    </p>
                    <p>
                      <b>Priority: </b>
                      {lead.priority}
                    </p>
                    <p>
                      <b>Time to close: </b>
                      {lead.timeToClose}
                    </p>
                    <button className="edit-btn py-2">Edit Lead Data</button>
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
