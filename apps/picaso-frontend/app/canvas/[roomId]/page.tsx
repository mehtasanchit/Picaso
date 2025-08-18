
import { RoomCanvas } from "@/components/Roomcanvas";


export default async function CanvasPage({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  const roomId = (await params).roomId;
  console.log(roomId);
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        position: "relative",
        backgroundColor: "black",
      }}
    >
      <RoomCanvas roomId={roomId} />
      
    </div>
  );
}

