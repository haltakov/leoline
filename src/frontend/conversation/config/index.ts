import { BrowserType } from "@/frontend/browser/types";
import { ReactRealTimeVADOptions } from "@ricky0123/vad-react";

export const getVADConfig = (browserType: BrowserType): Partial<ReactRealTimeVADOptions> => ({
  workletURL: "/_next/static/vad/vad.worklet.bundle.min.js",
  modelURL: "/_next/static/vad/silero_vad.onnx",
  ortConfig(ort) {
    ort.env.wasm = {
      wasmPaths: {
        "ort-wasm-simd-threaded.wasm": "/_next/static/vad/ort-wasm-simd-threaded.wasm",
        "ort-wasm-simd.wasm": "/_next/static/vad/ort-wasm-simd.wasm",
        "ort-wasm.wasm": "/_next/static/vad/ort-wasm.wasm",
        "ort-wasm-threaded.wasm": "/_next/static/vad/ort-wasm-threaded.wasm",
      },
      numThreads: browserType === BrowserType.SAFARI ? 1 : 4,
    };
  },
});
