import fetch from "node-fetch";

app.post("/generate", upload.single("roomImage"), async (req, res) => {
  try {
    const marbleName = req.body.marbleName || "white Italian marble";

    const prompt = `
Realistic luxury interior with ${marbleName} flooring or wall.
Maintain realistic lighting, perspective and furniture.
`;

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "stability-ai/sdxl",
        input: { prompt }
      })
    });

    const data = await response.json();

    res.json({
      success: true,
      imageUrl: data.output?.[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});