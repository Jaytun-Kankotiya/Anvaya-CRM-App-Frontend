import axios from "axios";
import Navbar from "../../components/Navbar";
import { useProduct } from "../../contexts/ProductContext";
import { useEffect, useState } from "react";

const Leads = () => {
  const { sidebar, leads, setLeads, fetchLeaders, backendUrl } = useProduct();
  const [comments, setComments] = useState({})

  useEffect(() => {

    const fetchComment = async () => {
    try {
        const commentsData = {}
        for(let lead of leads) {
            const { data } = await axios.get(backendUrl + `/v1/leads/${lead._id}/comments`);
            commentsData[lead._id] = data
        }
        setComments(commentsData)
    } catch (error) {
      console.log("Error fetching comment");
    }
  }
  if(leads.length > 0) {
    fetchComment()
  }
  }, [leads, backendUrl])

  console.log(comments)

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
                    <button className="edit-btn">Edit Lead Data</button>

                    <div className="mt-2 text-center">
                    <h4>Comments</h4>
                    {comments[lead._id]?.length > 0 ? (
                    comments[lead._id].map((comment) => (
                      <div key={comment._id}>
                        <p>{comment.commentText}</p>
                        <p>{comment.author}</p>
                      </div>
                    ))) : (
                        <p>No Comments</p>
                    )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No Leads Found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leads;
