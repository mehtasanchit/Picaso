import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, SignInSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client"
import cors from "cors"
const app = express();
app.use(express.json());
app.use(cors());



app.post("/signup", async function (req, res) {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ error: parsedData.error.issues });
    }


    try {
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
        const user = await prismaClient.user.create({
            data: {
                name: parsedData.data.name,
                password: hashedPassword,
                email: parsedData.data.username
            }
        })
        res.json({
            userId: user.id
        })
    }
    catch (e) {
        res.status(411).json({
            message: "Usename already taken"
        })
    }

})

app.post("/signin", async function (req, res) {
    const parsedData = SignInSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ error: parsedData.error.issues });
    }
    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username
        }
    })
    if (!user) {
        return res.status(401).json({ message: "user does not exist" });
    }
    const passwordmatch = await bcrypt.compare(parsedData.data.password, user.password);
    if (!passwordmatch) {
        return res.status(401).json({ message: "password does not match" });
    }

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET);

    return res.json({
        token
    })
})

app.post("/room", middleware, async function (req, res) {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ error: parsedData.error.issues });
    }
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({ error: "Admin ID is required" });
    }

    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        });

        res.json({
            roomId: room.id
        })
    }
    catch (e) {
        return res.status(400).json({ message: "room already exist" })
    }
})

app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        console.log(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        });

        res.json({
            messages
        })
    } catch (e) {
        console.log(e);
        res.json({
            messages: []
        })
    }

})

app.get("/room/:slug", async (req, res) => {
    const slug = req.query.slug as string;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        roomId:room?.id
    })
})




app.post("/shapes", async (req, res) => {
  try {
    const { roomId, type, data } = req.body;

    const shape = await prismaClient.shape.create({
      data: {
        roomId,
        type,
        data,
      },
    });

    res.json(shape);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create shape" });
  }
});


app.post("/shapes/:id/erase", async (req, res) => {
  try {
    const { id } = req.params;

    const shape = await prismaClient.shape.update({
      where: { id: Number(id) },
      data: { erased: true },
    });

    res.json(shape);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to erase shape" });
  }
});


app.get("/shapes/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;

    const shapes = await prismaClient.shape.findMany({
      where: {
        roomId: Number(roomId),
        erased: false, // only return non-erased shapes
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(shapes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch shapes" });
  }
});



app.listen(3001);