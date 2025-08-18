"use client";

import { useRef, useEffect, useState } from "react";
import { Circle, LineChart, Pencil, Square, Eraser } from "lucide-react";
import { IconButton } from "./iconButton";
import { Game } from "@/app/draw/Game";

export type Tool = "circle" | "rect" | "pencil" | "line" | "erase";

const cursorMap: Record<Tool, string> = {
  pencil: "crosshair",
  line: "crosshair",
  rect: "crosshair",
  circle: "crosshair",
  erase: "url('/eraser-cursor.svg') 8 8, auto",
};

function IconBar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
}) {
  return (
    <div style={{ position: "fixed", top: 10, left: 10 }}>
      <div className="flex gap-3">
        <IconButton
          icon={<LineChart />}
          onClick={() => setSelectedTool("line")}
          activated={selectedTool === "line"}
        />
        <IconButton
          icon={<Circle />}
          onClick={() => setSelectedTool("circle")}
          activated={selectedTool === "circle"}
        />
        <IconButton
          icon={<Square />}
          onClick={() => setSelectedTool("rect")}
          activated={selectedTool === "rect"}
        />
        <IconButton
          icon={<Pencil />}
          onClick={() => setSelectedTool("pencil")}
          activated={selectedTool === "pencil"}
        />
        <IconButton
          icon={<Eraser />}
          onClick={() => setSelectedTool("erase")}
          activated={selectedTool === "erase"}
        />
      </div>
    </div>
  );
}

export interface CanvasProps {
  roomId: string;
  socket: WebSocket;
  width: number;
  height: number;
  shapes: any[]; // added
  onShapeCreate: (shape: any) => Promise<void>; // added
  onShapeErase: (shapeId: number) => Promise<void>; // added
}

export function Canvas({
  roomId,
  socket,
  width,
  height,
  shapes,
  onShapeCreate,
  onShapeErase,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");

  useEffect(() => {
    if (!canvasRef.current) return;
    // Map server shapes (with data payload) to drawable shapes for the Game engine
    const drawableShapes = (shapes || []).map((shape: any) => {
      if (shape && typeof shape === "object" && "data" in shape) {
        return { type: shape.type, ...(shape.data || {}) };
      }
      return shape;
    });

    // Translate erase-by-index from Game to erase-by-id for the backend
    const eraseByIndex = async (shapeIndex: number) => {
      const serverShape = (shapes || [])[shapeIndex];
      if (!serverShape || typeof serverShape.id === "undefined") return;
      await onShapeErase(serverShape.id);
    };

    const g = new Game(
      canvasRef.current,
      roomId,
      socket,
      drawableShapes,
      onShapeCreate,
      eraseByIndex
    );
    setGame(g);

    return () => g.destroy();
  }, [canvasRef, roomId, socket, width, height, shapes, onShapeCreate, onShapeErase]);

  useEffect(() => {
    if (!game) return;
    const drawableShapes = (shapes || []).map((shape: any) => {
      if (shape && typeof shape === "object" && "data" in shape) {
        return { type: shape.type, ...(shape.data || {}) };
      }
      return shape;
    });
    game.syncShapesFromServer(drawableShapes as any);
  }, [shapes, game]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.cursor = cursorMap[selectedTool];
    }
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-500"
      />
      <IconBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
}
