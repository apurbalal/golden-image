import { createCanvas, loadImage, registerFont } from "canvas";
import { NextRequest } from "next/server";
import backgroundImage from "../../../public/Frame.jpg";

function breakTextIntoLines(ctx: any, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

const compositeImageWithText = async (text: string) => {
  try {
    // Load the image into canvas
    const canvas = createCanvas(backgroundImage.width, backgroundImage.height);
    const ctx = canvas.getContext("2d");
    const font = "./public/Roboto-Regular.ttf";
    const image = await loadImage(`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/Frame.jpg`);
    registerFont(font, { family: "CustomFont" });
    
    ctx.drawImage(image, 0, 0);

    // Add the text to the image
    ctx.font = "70px CustomFont";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    const maxWidth = image.width - 100; // 20px padding on each side

    const lineHeight = 78; // font size + some padding
    const lines = breakTextIntoLines(ctx, text.trim(), maxWidth);
    const totalTextHeight = lines.length * lineHeight;

    // Start drawing from this y-coordinate to ensure text block is centered
    const startY = (image.height - totalTextHeight) / 2;
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], image.width / 2, startY + (i * lineHeight));
    }

    // Return the modified image as a buffer
    const buffer = canvas.toBuffer("image/png", { compressionLevel: 6 });
    return buffer;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title");
  if (title) {
    const buffer = await compositeImageWithText(title);
    if (buffer) {
      return new Response(buffer, {
        headers: {
          "Content-Type": "image/png",
        },
      });
    }
  }

  return new Response("Invalid request", { status: 400 });
};
