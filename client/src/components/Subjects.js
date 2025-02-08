import React, { useState, useEffect } from "react";
import api from "../api";

const Subjects = ({ subjects, setSubjects }) => {
  const [subjectName, setSubjectName] = useState(""); 

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get("/subjects");
        setSubjects(response.data); 
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };
    fetchSubjects();
  }, [setSubjects]);

  // Handle form submission
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!subjectName.trim()) {
        alert("Please enter a subject name.");
        return;
      }
      console.log("New subject created:", subjectName);
      await api.post("/subjects", {
        subject_name: subjectName,
      });

      // Fetch updated subjects after creating a new one
      const response = await api.get("/subjects");
      setSubjects(response.data.map((subject) => ({
        id: subject.id,
        name: subject.subject_name,
      })));

      setSubjectName("");
      alert("Subject created successfully!");
    } catch (err) {
      console.log("Error creating subject:", err);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Subjects</h1>
      <p>Manage your subjects here.</p>

      {/* Form to add a new subject */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label
            htmlFor="subjectName"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Subject Name:
          </label>
          <input
            type="text"
            id="subjectName"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Enter subject name"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create Subject
        </button>
      </form>

      {/* Table to display subjects */}
      <div style={{ marginTop: "20px" }}>
        <h2>Subject List</h2>
        {subjects.length === 0 ? (
          <p>No subjects available.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Name
                </th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {subject.id}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {subject.subject_name} {/* Access subject name correctly */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Subjects;
