import { Tool } from "@/components/maincanvas";

type RectShape = { type: "rect"; x: number; y: number; width: number; height: number };
type CircleShape = { type: "circle"; centerX: number; centerY: number; radius: number };
type LineShape = { type: "line"; startX: number; startY: number; endX: number; endY: number };
type PencilShape = { type: "pencil"; points: { x: number; y: number }[] };

type Shape = RectShape | CircleShape | LineShape | PencilShape;

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private shapes: Shape[] = [];
  private roomId: string;
  private clicked = false;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tool = "circle";
  private currentPencilPoints: { x: number; y: number }[] = [];

  socket: WebSocket;
  onShapeCreate: (shape: any) => Promise<void>;
  onShapeErase: (shapeId: number) => Promise<void>;

  constructor(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket,
    shapes: Shape[],
    onShapeCreate: (shape: any) => Promise<void>,
    onShapeErase: (shapeId: number) => Promise<void>
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.roomId = roomId;
    this.socket = socket;
    this.shapes = shapes;
    this.onShapeCreate = onShapeCreate;
    this.onShapeErase = onShapeErase;

    this.initSocketHandlers();
    this.initMouseHandlers();
    this.redraw();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDown);
    this.canvas.removeEventListener("mouseup", this.mouseUp);
    this.canvas.removeEventListener("mousemove", this.mouseMove);
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  
  syncShapesFromServer(newShapes: Shape[]) {
    if (!Array.isArray(newShapes)) return;
    const shouldReplace = this.shapes.length === 0 || newShapes.length >= this.shapes.length;
    if (!shouldReplace) return;
    this.shapes = newShapes;
    this.redraw();
  }

  getShapeCount() {
    return this.shapes.length;
  }

  

  private initSocketHandlers() {
    this.socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "ADD_SHAPE") {
        this.shapes.push(msg.shape);
        this.redraw();
      } else if (msg.type === "DELETE_SHAPE") {
        this.shapes = this.shapes.filter((_, idx) => idx !== msg.index);
        this.redraw();
      }
    };
  }

  private redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.shapes.forEach((shape) => {
      this.ctx.strokeStyle = "white";

      if (shape.type === "rect") {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "pencil" && shape.points) {
        this.ctx.beginPath();
        shape.points.forEach((pt, idx) => {
          if (idx === 0) this.ctx.moveTo(pt.x, pt.y);
          else this.ctx.lineTo(pt.x, pt.y);
        });
        this.ctx.stroke();
        this.ctx.closePath();
      }
    });
  }

  private mouseDown = (e: MouseEvent) => {
    this.clicked = true;
    this.startX = e.offsetX;
    this.startY = e.offsetY;

    if (this.selectedTool === "erase") {
      this.eraseAt(e.offsetX, e.offsetY);
    }

    if (this.selectedTool === "pencil") {
      this.currentPencilPoints = [{ x: e.offsetX, y: e.offsetY }];
    }
  };

  private mouseMove = (e: MouseEvent) => {
    if (!this.clicked) return;

    if (this.selectedTool === "pencil") {
      this.currentPencilPoints.push({ x: e.offsetX, y: e.offsetY });
      this.redraw();
      this.ctx.beginPath();
      this.currentPencilPoints.forEach((pt, idx) => {
        if (idx === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      });
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (this.selectedTool === "erase") {
      this.eraseAt(e.offsetX, e.offsetY);
    } else {
      this.redraw();
      this.ctx.strokeStyle = "white";
      if (this.selectedTool === "rect") {
        const dx = e.offsetX - this.startX;
        const dy = e.offsetY - this.startY;
        const x = dx >= 0 ? this.startX : this.startX + dx;
        const y = dy >= 0 ? this.startY : this.startY + dy;
        this.ctx.strokeRect(x, y, Math.abs(dx), Math.abs(dy));
      } else if (this.selectedTool === "circle") {
        const dx = e.offsetX - this.startX;
        const dy = e.offsetY - this.startY;
        const radius = Math.min(Math.abs(dx), Math.abs(dy)) / 2;
        const centerX = this.startX + Math.sign(dx) * radius;
        const centerY = this.startY + Math.sign(dy) * radius;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (this.selectedTool === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  };

  private mouseUp = async (e: MouseEvent) => {
    if (this.selectedTool === "erase") {
      this.clicked = false;
      return;
    }

    let shape: Shape | null = null;
    let shapeData: any = null;

    if (this.selectedTool === "rect") {
      const dx = e.offsetX - this.startX;
      const dy = e.offsetY - this.startY;
      const x = dx >= 0 ? this.startX : this.startX + dx;
      const y = dy >= 0 ? this.startY : this.startY + dy;
      const width = Math.abs(dx);
      const height = Math.abs(dy);
      shape = { type: "rect", x, y, width, height };
      shapeData = { x, y, width, height };
    } else if (this.selectedTool === "circle") {
      const dx = e.offsetX - this.startX;
      const dy = e.offsetY - this.startY;
      const radius = Math.min(Math.abs(dx), Math.abs(dy)) / 2;
      const centerX = this.startX + Math.sign(dx) * radius;
      const centerY = this.startY + Math.sign(dy) * radius;
      shape = { type: "circle", centerX, centerY, radius };
      shapeData = { centerX, centerY, radius };
    } else if (this.selectedTool === "line") {
      shape = { type: "line", startX: this.startX, startY: this.startY, endX: e.offsetX, endY: e.offsetY };
      shapeData = { startX: shape.startX, startY: shape.startY, endX: shape.endX, endY: shape.endY };
    } else if (this.selectedTool === "pencil") {
      shape = { type: "pencil", points: this.currentPencilPoints };
      shapeData = { points: this.currentPencilPoints };
      this.currentPencilPoints = [];
    }

    if (shape) {
      this.shapes.push(shape);
      this.redraw();
      await this.onShapeCreate({ roomId: this.roomId, type: shape.type, data: shapeData });
      this.socket.send(JSON.stringify({ type: "ADD_SHAPE", roomId: this.roomId, shape }));
    }

    this.clicked = false;
  };

  private eraseAt = async (x: number, y: number) => {
    // Prefer erasing the topmost (most recently drawn) shape under the cursor
    let idx = -1;
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const s = this.shapes[i];
      let hit = false;
      if (s.type === "rect") hit = x >= s.x && x <= s.x + s.width && y >= s.y && y <= s.y + s.height;
      else if (s.type === "circle") hit = Math.hypot(x - s.centerX, y - s.centerY) <= s.radius;
      else if (s.type === "line") {
        const A = x - s.startX, B = y - s.startY;
        const C = s.endX - s.startX, D = s.endY - s.startY;
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        const param = lenSq !== 0 ? dot / lenSq : -1;
        const xx = param < 0 ? s.startX : param > 1 ? s.endX : s.startX + param * C;
        const yy = param < 0 ? s.startY : param > 1 ? s.endY : s.startY + param * D;
        hit = Math.hypot(x - xx, y - yy) < 5;
      } else if (s.type === "pencil" && s.points) {
        hit = s.points.some(pt => Math.hypot(pt.x - x, pt.y - y) < 5);
      }
      if (hit) { idx = i; break; }
    }

    if (idx !== -1) {
      this.shapes.splice(idx, 1);
      this.redraw();
      await this.onShapeErase(idx);
      this.socket.send(JSON.stringify({ type: "DELETE_SHAPE", roomId: this.roomId, index: idx }));
    }
    
  };

  private initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDown);
    this.canvas.addEventListener("mouseup", this.mouseUp);
    this.canvas.addEventListener("mousemove", this.mouseMove);
  }
}





