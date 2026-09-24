/**
 * Image generation tool for Google Antigravity / Gemini image models.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { createHash } from "node:crypto";

export function createImageGenerateTool(poolManager, sendImageRequestFn) {
  return {
    name: "antigravity_image_generate",
    description:
      "Generate frontend image assets using Google Antigravity (Gemini 3.1 Flash Image) from the multi-account pool. Automatically saves to workspace assets folder and returns relative path for use in HTML/React code.",
    parameters: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "Detailed description of the image to generate, including style, lighting, subjects, and colors.",
        },
        filename: {
          type: "string",
          description: "Optional output filename, e.g. hero-bg.png, feature-chart.png. Defaults to generated name.",
        },
        output_dir: {
          type: "string",
          description: "Optional output directory relative to project root. Defaults to assets/images.",
        },
      },
      required: ["prompt"],
    },
    output: {
      schema: {
        type: "object",
        properties: {
          path: { type: "string" },
          filename: { type: "string" },
          prompt: { type: "string" },
          markdown: { type: "string" },
        },
      },
      render: (value) => [
        {
          type: "text",
          text: `Generated image: ${value.path}\n\n${value.markdown}`,
        },
      ],
    },
    execute: async (args) => {
      const prompt = String(args.prompt || "").trim();
      if (!prompt) throw new Error("Image prompt must not be empty.");

      const outputDir = args.output_dir || poolManager.imageOutputDir || "./assets/images";
      const hash = createHash("md5").update(prompt + Date.now()).digest("hex").slice(0, 8);
      const filename = args.filename
        ? args.filename.endsWith(".png") || args.filename.endsWith(".jpg")
          ? args.filename
          : `${args.filename}.png`
        : `img-${hash}.png`;

      const targetPath = join(outputDir, filename);
      const absPath = resolve(process.cwd(), targetPath);

      // Call Google Cloud Code Assist through the pool
      const result = await sendImageRequestFn(prompt);
      if (!result?.base64) {
        throw new Error(result?.error || "Failed to generate image from Google Antigravity.");
      }

      await mkdir(dirname(absPath), { recursive: true });
      await writeFile(absPath, Buffer.from(result.base64, "base64"));

      return {
        path: targetPath,
        absolutePath: absPath,
        filename,
        prompt,
        usedAccount: result.accountEmail,
        markdown: `![${filename}](${targetPath})`,
      };
    },
  };
}
