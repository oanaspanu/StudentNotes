import React, { useState, useEffect, useCallback } from "react";
import SimpleMDE from "react-simplemde-editor";
import "simplemde/dist/simplemde.min.css";
import api from "../api";

const Notes = () => {
  const [markdownText, setMarkdownText] = useState("");
  const [notes, setNotes] = useState([]);
  const [uploadedFileLink, setUploadedFileLink] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [viewIndex, setViewIndex] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [subjects, setSubjects] = useState([]);

  // Use useCallback to memoize the fetchNotes function
  const fetchNotes = useCallback(async () => {
    try {
      const response = await api.get("/notes", {
        params: selectedSubjectId ? { subjectId: selectedSubjectId } : {},
      });
      setNotes(response.data);
    } catch (err) {
      console.error("Error fetching notes:", err.response ? err.response.data : err.message);
    }
  }, [selectedSubjectId]);

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/subjects"); 
      setSubjects(response.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchSubjects();
  }, [selectedSubjectId, fetchNotes]);

  const handleSave = async () => {
  try {
    let fileLink = uploadedFileLink; 
    if (uploadedFileLink instanceof File) {
      const formData = new FormData();
      formData.append("file", uploadedFileLink);

      const uploadResponse = await api.post("/notes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fileLink = uploadResponse.data.link;
    }
    const newNote = {
      text: markdownText || "",
      subjectId: selectedSubjectId || null,
      link: fileLink || "",
      fileName: uploadedFileName || "",
    };

    if (editIndex !== null) {
      const noteId = notes[editIndex].id;
      await api.put(`/notes/${noteId}`, newNote);
      alert("Note updated successfully!");
    } else {
      await api.post("/notes", newNote);
      alert("Note saved successfully!");
    }

    fetchNotes();
    setMarkdownText("");
    setUploadedFileLink("");
    setUploadedFileName("");
    setEditIndex(null);
  } catch (error) {
    console.error("Error saving note:", error);
    alert("An error occurred while saving the note.");
  }
};

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const fileLink = URL.createObjectURL(file);

    setUploadedFileLink(fileLink); 
    setUploadedFileName(file.name); 
  };

  const handleEdit = (index) => {
    const selectedNote = notes[index];
    setEditIndex(index);
    setMarkdownText(selectedNote.text || "");
    setUploadedFileLink(selectedNote.link || "");
    setUploadedFileName(selectedNote.fileName || "");
    setViewIndex(null);
  };

  const handleDelete = async (index) => {
    const noteId = notes[index].id;

    try {
      await api.delete(`/notes/${noteId}`);
      const updatedNotes = notes.filter((_, i) => i !== index);
      setNotes(updatedNotes);
      alert("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleView = (index) => {
    setViewIndex(index);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Study Notes</h1>
      {/* Subject Filter */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="subjectFilter" style={{ marginRight: "10px" }}>
          Filter by Subject:
        </label>
        <select
          id="subjectFilter"
          value={selectedSubjectId || ""}
          onChange={(e) => setSelectedSubjectId(e.target.value || null)}
          style={{ padding: "5px", borderRadius: "4px" }}
        >
          <option value="">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.subject_name}
            </option>
          ))}
        </select>
      </div>

      {viewIndex !== null ? (
        <div>
          <h2>View Note</h2>
          <div
            style={{
              whiteSpace: "pre-wrap",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              backgroundColor: "#f9f9f9",
              marginBottom: "10px",
            }}
          >
            {notes[viewIndex]?.text || "No content available"}
          </div>
          {notes[viewIndex]?.link && (
            <p>
              Attached File:{" "}
              <a
                href={notes[viewIndex].link}
                target="_blank"
                rel="noopener noreferrer"
                download={notes[viewIndex].fileName || "file"}
              >
                {notes[viewIndex].fileName || "Download"}
              </a>
            </p>
          )}
          <button onClick={() => setViewIndex(null)} style={{ padding: "10px 20px" }}>
            Back to Notes List
          </button>
        </div>
      ) : (
        <>
          <div>
            <SimpleMDE
              value={markdownText}
              onChange={(value) => setMarkdownText(value)}
              options={{
                autofocus: true,
                placeholder: "Start writing your notes...",
                spellChecker: false,
              }}
            />
            <button onClick={handleSave} style={{ marginTop: "10px", padding: "10px 20px" }}>
              {editIndex !== null ? "Update Note" : "Save Note"}
            </button>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h2>Upload File</h2>
            <input type="file" accept=".txt,.md,.pdf" onChange={handleFileUpload} />
            {uploadedFileName && <p><strong>Uploaded File:</strong> {uploadedFileName}</p>}
          </div>

          <div style={{ marginTop: "20px" }}>
            <h2>Saved Notes</h2>
            {notes.length === 0 ? (
              <p>No notes saved yet.</p>
            ) : (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {notes.map((note, index) => (
                  <li
                    key={note.id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      marginBottom: "10px",
                      padding: "10px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <p><strong>Note {index + 1}:</strong></p>
                    <div style={{ whiteSpace: "pre-wrap", marginBottom: "10px" }}>
                      {note.text?.length > 200 ? note.text.slice(0, 200) + "..." : note.text}
                    </div>
                    {note.link && (
                      <p>
                        Attached File:{" "}
                        <a href={note.link} target="_blank" rel="noopener noreferrer">
                          Open {note.fileName || "file"}
                        </a>
                      </p>
                    )}
                    <button onClick={() => handleView(index)} style={{ marginRight: "10px" }}>
                      View
                    </button>
                    <button onClick={() => handleEdit(index)} style={{ marginRight: "10px" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(index)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Notes;
