import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import Jimp from "jimp";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

interface Detection {
  label: string;
  score: number;
  box: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert image to buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Detect faces using HuggingFace
    console.log("Detecting faces...");
    const detections = await hf.objectDetection({
      model: "facebook/detr-resnet-50",
      data: buffer,
    }) as unknown as Detection[];

    console.log(`Found ${detections.length} objects`);

    // Filter only faces (persons)
    const faces = detections.filter(
      (d) => d.label === "person" && d.score > 0.5
    );

    console.log(`Found ${faces.length} faces`);

    // Load image with Jimp
    const jimpImage = await Jimp.read(buffer);
    const width = jimpImage.getWidth();
    const height = jimpImage.getHeight();

    // For MVP: Blur all detected faces
    // In a real implementation, you'd use smarter logic to determine
    // which faces are "background" vs "main subject"
    for (const face of faces) {
      const x = Math.floor(face.box.xmin * width);
      const y = Math.floor(face.box.ymin * height);
      const w = Math.floor((face.box.xmax - face.box.xmin) * width);
      const h = Math.floor((face.box.ymax - face.box.ymin) * height);

      // Extract face region, blur it, and composite back
      const faceRegion = jimpImage.clone().crop(x, y, w, h).blur(20);
      jimpImage.composite(faceRegion, x, y);
    }

    // Add watermark
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    jimpImage.print(
      font,
      width - 250,
      height - 50,
      {
        text: "FacePrivacy.ai",
        alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
        alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
      },
      230,
      40
    );

    // Convert to base64
    const processedBuffer = await jimpImage.getBufferAsync(Jimp.MIME_JPEG);
    const base64Image = processedBuffer.toString("base64");

    return NextResponse.json({
      processedImage: `data:image/jpeg;base64,${base64Image}`,
      facesDetected: faces.length,
    });
  } catch (error: any) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process image" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
