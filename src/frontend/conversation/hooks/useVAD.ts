import { useMicVAD } from "@ricky0123/vad-react";
import { getVADConfig } from "../config";
import useBrowser from "@/frontend/browser/hooks/useBrowser";

export interface Props {
  onSpeechStart: () => any;
  onSpeechEnd: (audio: Float32Array) => any;
}

const useVAD = ({ onSpeechStart, onSpeechEnd }: Props) => {
  const browserType = useBrowser();

  const {
    userSpeaking: isRecording,
    pause: pauseListen,
    start: startListen,
    loading: isVADLoading,
    errored: isVADError,
  } = useMicVAD({
    startOnLoad: true,
    positiveSpeechThreshold: 0.6,
    minSpeechFrames: 4,
    onSpeechStart,
    onSpeechEnd,
    ...getVADConfig(browserType),
  });

  return { isRecording, isVADLoading, isVADError, startListen, pauseListen };
};

export default useVAD;
