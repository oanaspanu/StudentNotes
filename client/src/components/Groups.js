import React, { useState, useEffect } from "react";
import api from "../api";
import "../style/Groups.css";

const Groups = () => {
  const [groups, setGroups] = useState([]); 
  const [colleagues, setColleagues] = useState([]); 
  const [notes, setNotes] = useState([]); 
  const [selectedColleagues, setSelectedColleagues] = useState([]); 
  const [selectedNotes, setSelectedNotes] = useState([]); 
  const [newGroupName, setNewGroupName] = useState(""); 
  const [message, setMessage] = useState(""); 
  const [deletingGroup, setDeletingGroup] = useState(null); 

  // Fetch all groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/groups");
        setGroups(response.data); // Set the groups
      } catch (error) {
        setMessage("Failed to fetch groups.");
      }
    };
    fetchGroups();
  }, []);

  // Fetch colleagues and notes when the component mounts
  useEffect(() => {
    const fetchColleaguesAndNotes = async () => {
      try {
        const colleagueResponse = await api.get("/users");
        setColleagues(colleagueResponse.data); // Set the colleagues

        const noteResponse = await api.get("/notes");
        setNotes(noteResponse.data); // Set the notes
      } catch (error) {
        setMessage("Failed to fetch colleagues or notes.");
      }
    };
    fetchColleaguesAndNotes();
  }, []);

  // Handle creating a new group
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      setMessage("Group name cannot be empty!");
      return;
    }

    try {
      const response = await api.post("/groups", {
        groupName: newGroupName,
      });
      setMessage(response.data.message);
      setNewGroupName(""); 
      setGroups([...groups, response.data.group]); 
    } catch (error) {
      setMessage("Failed to create group.");
    }
  };

  // Handle deleting a group
  const handleDeleteGroup = async (groupId) => {
    try {
      await api.delete(`/groups/${groupId}`);
      setGroups(groups.filter((group) => group.id !== groupId)); 
      setMessage("Group deleted successfully!");
    } catch (error) {
      setMessage("Failed to delete group.");
    }
    setDeletingGroup(null); 
  };

  // Handle inviting colleagues to a group
  const handleInviteColleagues = async (groupId) => {
    if (selectedColleagues.length === 0) {
      setMessage("Please select colleagues to invite.");
      return;
    }

    console.log("Inviting colleagues:", selectedColleagues);  
    try {
      await api.post(`/groups/${groupId}/invite`, {
        colleagueEmails: selectedColleagues,
      });
      setMessage("Colleagues invited successfully!");
    } catch (error) {
      setMessage("Failed to invite colleagues.");
      console.error(error);  
    }
  };

  const handleShareNotes = async (groupId) => {
    if (selectedNotes.length === 0) {
      setMessage("Please select notes to share.");
      return;
    }

    console.log("Sharing notes:", selectedNotes);  
    try {
      await api.post(`/groups/${groupId}/notes`, { noteIds: selectedNotes });
      setMessage("Notes shared successfully!");
    } catch (error) {
      setMessage("Failed to share notes.");
      console.error(error);  
    }
  };

  return (
    <div className="container">
      <h1 className="title">Study Groups</h1>

      <div className="group-creation">
        <h2>Create a Group</h2>
        <input
          type="text"
          placeholder="Enter group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <button className="create-btn" onClick={handleCreateGroup}>
          Create Group
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      <h2>Your Groups</h2>
      <ul className="group-list">
        {groups.map((group) => (
          <li key={group.id} className="group-item">
            <span className="group-name">{group?.name || ""}</span>

            <div className="actions">
              <div className="invite">
                <h3>Invite Colleagues</h3>
                <select
                  multiple
                  onChange={(e) =>
                    setSelectedColleagues(
                      [...e.target.selectedOptions].map((option) => option.value)
                    )
                  }
                >
                  {colleagues.map((colleague) => (
                    <option key={colleague.id} value={colleague.email}>
                      {colleague.name}
                    </option>
                  ))}
                </select>
                <button className="invite-btn" onClick={() => handleInviteColleagues(group.id)}>
                  Invite
                </button>
              </div>

              <div className="share-notes">
                <h3>Share Notes</h3>
                <select
                  multiple
                  onChange={(e) =>
                    setSelectedNotes(
                      [...e.target.selectedOptions].map((option) => option.value)
                    )
                  }
                >
                  {notes.map((note) => (
                    <option key={note.id} value={note.id}>
                      {note.text} {/* Changed from title to text */}
                    </option>
                  ))}
                </select>
                <button className="share-btn" onClick={() => handleShareNotes(group.id)}>
                  Share Notes
                </button>
              </div>

              <button
                className="delete-btn"
                onClick={() => setDeletingGroup(group.id)}
              >
                Delete Group
              </button>
            </div>

            {deletingGroup === group.id && (
              <div className="confirmation">
                <p>Are you sure you want to delete this group?</p>
                <button
                  className="confirm-delete"
                  onClick={() => handleDeleteGroup(group.id)}
                >
                  Yes, Delete
                </button>
                <button
                  className="cancel-delete"
                  onClick={() => setDeletingGroup(null)}
                >
                  Cancel
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Groups;
