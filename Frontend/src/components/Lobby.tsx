import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

export const Lobby = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string>("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedRoomId = roomId.replace(/\s/g, "");
    navigate(`/room/${parsedRoomId}`);
  };
  return (
    <>
      <Navbar></Navbar>
      <div className="lobby">
        <div className="card">
          <span> 👋🏻 Create or Join a Room 🎦 </span>
          <form id="join-form" onSubmit={handleFormSubmit}>
            <input
              type="text"
              required
              placeholder="Enter room ID"
              onChange={(e) => {
                setRoomId(e.target.value);
              }}
            />
            <button type="submit"> Join Room</button>
          </form>
        </div>
      </div>
    </>
  );
};
