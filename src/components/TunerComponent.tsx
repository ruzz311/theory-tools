
import React, { useEffect, useState } from "react";

import AudioProcessor, { IAudioDataParams } from "../util/AudioProcessor";
import { useAudioCtx } from '../util/AudioProvider';

export default function Tuner() {
  const { audioCtx } = useAudioCtx();
  const [ad, setAudioData] = useState<IAudioDataParams>();
  //{ frequency: 0, octave: 0, note: teoria.note('A4'), noteName: 'A4' }
  let ap:AudioProcessor;

  // create an audioProcessor.
  if (audioCtx) {
    ap = new AudioProcessor({
      audioContext: audioCtx,
      onAudioData: setAudioData
    });

    // TODO: consolidate logic here so it calls attached as soon as it's instanciated.
    ap.attached();
  }

  // clean up audio when "onComponentWillUnmount"
  useEffect(() => () => {
    ap.detached();
  })

  return <pre style={{
      width: '100%',
      display: 'block'
    }}>{JSON.stringify({ cents: ad?.cents, freq: ad?.note.fq(), name: ad?.note.name(), noteName: ad?.noteName }, null, 4)}</pre>
}


