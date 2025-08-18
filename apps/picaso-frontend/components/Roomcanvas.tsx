"use client";

import { WS_URL, HTTP_BACKEND } from "@/app/config";
import { useEffect, useState } from "react";
import { Canvas } from "./maincanvas";

const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); // initial set
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
};

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [shapes, setShapes] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setJwt(token);
  }, []);

  const { width, height } = useWindowDimensions();

  useEffect(() => {
    const fetchShapes = async () => {
      try {
        const res = await fetch(`${HTTP_BACKEND}/shapes/${roomId}`);
        const data = await res.json();
        setShapes(data);
      } catch (err) {
        console.error("Failed to fetch shapes:", err);
      }
    };
    fetchShapes();
  }, [roomId]);

  useEffect(() => {
    if (!jwt) return;

    const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(jwt)}`);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
    };

    return () => {
      ws.close();
      console.log("RoomCanvas unmounted: socket closed");
    };
  }, [roomId, jwt]);

  const handleShapeCreate = async (shape: any) => {
    try {
      const res = await fetch(`${HTTP_BACKEND}/shapes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: Number(roomId),
          type: shape.type,
          data: shape.data,
        }),
      });
      const saved = await res.json();
      setShapes((prev) => [...prev, saved]);
    } catch (err) {
      console.error("Failed to save shape:", err);
    }
  };

  const handleShapeErase = async (shapeId: number) => {
    try {
      await fetch(`${HTTP_BACKEND}/shapes/${shapeId}/erase`, {
        method: "POST",
      });
      setShapes((prev) => prev.filter((s) => s.id !== shapeId));
    } catch (err) {
      console.error("Failed to erase shape:", err);
    }
  };

  if (!socket) {
    return <div>Connecting to Server....</div>;
  }

  return (
    <div>
      <Canvas
        roomId={roomId}
        socket={socket}
        width={width}
        height={height}
        shapes={shapes}
        onShapeCreate={handleShapeCreate}
        onShapeErase={handleShapeErase}
      />
    </div>
  );
}

