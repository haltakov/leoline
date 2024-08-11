/** @type {import('next').NextConfig} */

import fs from "fs/promises";
import path from "path";

async function copyVadFiles() {
  console.log("Copying VAD files...");

  try {
    await fs.access(".next/static/vad/");
  } catch {
    await fs.mkdir(".next/static/vad/", { recursive: true });
  }

  const wasmFiles = (await fs.readdir("node_modules/onnxruntime-web/dist/")).filter(
    (file) => path.extname(file) === ".wasm"
  );

  await Promise.all([
    fs.copyFile(
      "node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js",
      ".next/static/vad/vad.worklet.bundle.min.js"
    ),
    fs.copyFile("node_modules/@ricky0123/vad-web/dist/silero_vad.onnx", ".next/static/vad/silero_vad.onnx"),
    ...wasmFiles.map((file) => fs.copyFile(`node_modules/onnxruntime-web/dist/${file}`, `.next/static/vad/${file}`)),
  ]);

  console.log("Copying VAD files done.");
}

const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    copyVadFiles();

    return config;
  },
};

export default nextConfig;
