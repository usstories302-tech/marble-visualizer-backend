import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

fal.config({
  credentials: process.env.FAL_KEY
});

app.get("/", (req, res) => {
  res.send("Marble Visualizer Backend Running");
});

app.post("/generate", upload.single("roomImage"), async (req, res) => {
  try {
    const marbleName = req.body.marbleName || "white Italian marble";

    const prompt = `
Create a realistic interior marble visualization.
Apply ${marbleName} to the main visible floor or wall surface.
Keep furniture, room layout, lighting, shadows, camera angle and perspective natural.
Do not change the room structure.
Make it look like a premium marble showroom preview.
`;

    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt,
        image_size: "landscape_4_3",
        num_images: 1
      }
    });

    const imageUrl = result.data.images?.[0]?.url;

    if (!imageUrl) {
      return res.status(500).json({
        success: false,
        message: "No image returned from fal.ai"
      });
    }

    res.json({
      success: true,
      imageUrl
    });

  } catch (error) {
    console.error("Generation Error:", error);
    res.status(500).json({
      success: false,
      message: "Image generation failed"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});