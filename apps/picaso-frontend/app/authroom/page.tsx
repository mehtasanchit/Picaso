"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "../config";

export default function AuthRoom() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [roomSlug, setRoomSlug] = useState("");

  const createRoom = async () => {
    if (!roomName.trim()) return alert("Enter a room name");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to create a room");
        return;
      }

      const res = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name: roomName }, // request body
        {
          headers: {
            authorization: token, // header
          },
        }
      );

      const roomId = res.data.roomId;
      alert(`Room created: ${roomId}`);
      setRoomName("");
      router.push(`/canvas/${roomId}`);
    } catch (err) {
      console.error(err);
      alert("Error creating room");
    }
  };

  const joinRoom = async () => {
    if (!roomSlug.trim()) return alert("Enter a room slug");
    try {
      const res = await axios.get(
        `${HTTP_BACKEND}/room/:slug?slug=${roomSlug}`
      );
      const roomId = res.data.roomId;
      if (roomId) {
        alert(`Joined room: ${res.data.roomId}`);
        setRoomSlug("");
        router.push(`/canvas/${roomId}`);
      } else {
        alert("room does not exist");
      }
    } catch (err) {
      console.error(err);
      alert("Error joining room");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-lg p-6">
        {/* Create Room */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">
            Create a Room
          </h2>
          <input
            type="text"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none text-white"
          />
          <button
            onClick={createRoom}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
          >
            Create Room
          </button>
        </div>

        {/* Join Room */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-green-400">
            Join a Room
          </h2>
          <input
            type="text"
            placeholder="Room slug"
            value={roomSlug}
            onChange={(e) => setRoomSlug(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none text-white"
          />
          <button
            onClick={joinRoom}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
