import { useMicVAD } from "@ricky0123/vad-react";
import { getVADConfig } from "../config";
import useBrowser from "@/frontend/browser/hooks/useBrowser";

export interface Props {
  onSpeechStart: () => any;
  onSpeechEnd: (audio: Float32Array) => any;
  onSpeechMisfire: () => any;
}

const useVAD = ({ onSpeechStart, onSpeechEnd, onSpeechMisfire }: Props) => {
  const browserType = useBrowser();

  const {
    userSpeaking: isRecording,
    pause: pauseListen,
    start: startListen,
    loading: isVADLoading,
    errored: isVADError,
  } = useMicVAD({
    startOnLoad: true,
    positiveSpeechThreshold: 0.8,
    minSpeechFrames: 4,
    redemptionFrames: 20,
    onSpeechStart,
    onSpeechEnd,
    onVADMisfire: onSpeechMisfire,
    ...getVADConfig(browserType),
  });

  return { isRecording, isVADLoading, isVADError, startListen, pauseListen };
};

export default useVAD;
