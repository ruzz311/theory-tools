import { createContext, ReactNode, useContext, useState } from "react";

/**
 * Audio Provider
 */

export interface AudioContextType {
  audioCtx: AudioContext;
  // signin: (user: string, callback: VoidFunction) => void;
  getAudioCtx: () => void
}

// Audio context used by the AudioProvider
const ReactAudioContext = createContext<AudioContextType>(null!);

/**
 * useAuth Hook to access auth context within components
 * @returns 
 */
export const useAudioCtx = () => useContext(ReactAudioContext);

/**
 * App Access to the AudioContext Provider.
 * @param param0 
 * @returns 
 */
export function AudioProvider({ children }: { children: ReactNode }) {
  const [audioCtx, setAudioCtx] = useState<AudioContext>(new AudioContext());

  const getAudioCtx = () => {
    audioCtx.resume();
    if (!audioCtx) {
      setAudioCtx(new AudioContext())
    }
  }

  return <ReactAudioContext.Provider value={{ audioCtx, getAudioCtx }}>{children}</ReactAudioContext.Provider>;
}