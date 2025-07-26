import React from "react";
import DoctorSidebar from "../components/Doctorsidebar";
import "../styles/casereview.css";

const dummyCases = [
  {
    id: 1,
    patientName: "John Doe",
    summary: "Fever, fatigue, dry cough for 3 days.",
    reviewed: false,
  },
  {
    id: 2,
    patientName: "Jane Smith",
    summary: "Back pain and leg stiffness, MRI requested.",
    reviewed: true,
  },
];

const CaseReview = () => {
  return (
    <div className="case-review-page">
      <div className="case-review-main">
        <h2 className="page-title">🩺 Case Review</h2>
        <div className="case-list">
          {dummyCases.map((caseItem) => (
            <div className="case-card" key={caseItem.id}>
              <div className="case-header">
                <h3>{caseItem.patientName}</h3>
                <span
                  className={`status ${caseItem.reviewed ? "reviewed" : "pending"}`}
                >
                  {caseItem.reviewed ? "Reviewed" : "Pending"}
                </span>
              </div>
              <p>{caseItem.summary}</p>
              <button className="review-btn">
                {caseItem.reviewed ? "View Details" : "Review Now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseReview;
