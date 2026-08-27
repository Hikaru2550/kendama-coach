import { useState, useEffect, useRef } from "react";

interface MoshikameProps {
  onBack: () => void;
}

export default function Moshikame({ onBack }: MoshikameProps) {
  const [count, setCount] = useState<number>(0);
  const [isMetroPlaying, setIsMetroPlaying] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(135); 
  const [beat, setBeat] = useState<number>(0); 
  const [isFlash, setIsFlash] = useState<boolean>(false); 

  const audioCtxRef = useRef<AudioContext | null>(null);
  const metroTimerRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const currentBeatRef = useRef<number>(0);

  const handleCountUp = () => {
    setCount(count + 1);
  };

  const playClick = (time: number, isFirstBeat: boolean) => {
    if (!audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    osc.frequency.setValueAtTime(isFirstBeat ? 1000 : 600, time);
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    osc.start(time);
    osc.stop(time + 0.08);
  };

  useEffect(() => {
    if (!isMetroPlaying) {
      if (metroTimerRef.current) window.clearInterval(metroTimerRef.current);
      setBeat(0);
      return;
    }
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();

    nextNoteTimeRef.current = audioCtxRef.current.currentTime;
    currentBeatRef.current = 0;

    metroTimerRef.current = window.setInterval(() => {
      while (nextNoteTimeRef.current < audioCtxRef.current!.currentTime + 0.1) {
        playClick(nextNoteTimeRef.current, currentBeatRef.current === 0);
        const displayBeat = currentBeatRef.current + 1;
        const delay = (nextNoteTimeRef.current - audioCtxRef.current!.currentTime) * 1000;
        setTimeout(() => {
          setBeat(displayBeat);
          setIsFlash(true);
          setTimeout(() => setIsFlash(false), 60);
        }, Math.max(0, delay));
        nextNoteTimeRef.current += 60.0 / bpm;
        currentBeatRef.current = (currentBeatRef.current + 1) % 4; 
      }
    }, 25);

    return () => {
      if (metroTimerRef.current) window.clearInterval(metroTimerRef.current);
    };
  }, [isMetroPlaying, bpm]);

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", background: "#ffffff", color: "#0f172a", overflow: "hidden", boxSizing: "border-box", padding: "6px", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
      <header style={{ display: "flex", alignItems: "center", height: "35px", borderBottom: "1px solid #e2e8f0", marginBottom: "6px" }}>
        <button onClick={onBack} style={{ margin: 0, padding: "4px 12px", fontSize: "12px", fontWeight: "bold", background: "#ffffff", color: "#0f172a", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer" }}>
          ⬅ メニューへ戻る
        </button>
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", height: "calc(100% - 41px)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "6px", height: "40%", minHeight: "150px", boxSizing: "border-box" }}>
          
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "bold", fontFamily: "monospace" }}>RECOVERY</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <button onClick={(e) => { e.stopPropagation(); if (count > 0) setCount(count - 1); }} disabled={count === 0} style={{ width: "100%", height: "32px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: count === 0 ? "not-allowed" : "pointer", fontFamily: "monospace", fontSize: "11px" }}>[ -1 ]</button>
              <button onClick={(e) => { e.stopPropagation(); if (window.confirm("リセットしますか？")) setCount(0); }} style={{ width: "100%", height: "32px", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontFamily: "monospace", fontSize: "11px" }}>RESET</button>
            </div>
          </div>

          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", fontWeight: "bold", fontFamily: "monospace" }}>BPM: {bpm}</span>
              <div style={{ display: "flex", gap: "2px" }}>
                <button onClick={(e) => { e.stopPropagation(); setBpm(b => Math.max(40, b - 5)); }} style={{ padding: "2px 6px", background: "white", border: "1px solid #cbd5e1", cursor: "pointer", fontSize: "11px", borderRadius: "3px" }}>-5</button>
                <button onClick={(e) => { e.stopPropagation(); setBpm(b => Math.min(200, b + 5)); }} style={{ padding: "2px 6px", background: "white", border: "1px solid #cbd5e1", cursor: "pointer", fontSize: "11px", borderRadius: "3px" }}>+5</button>
              </div>
            </div>
            <input type="range" min="60" max="200" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", cursor: "pointer", margin: "4px 0" }} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <button onClick={(e) => { e.stopPropagation(); setIsMetroPlaying(!isMetroPlaying); }} style={{ flex: 1, height: "34px", background: isMetroPlaying ? "#0f172a" : "#e2e8f0", color: isMetroPlaying ? "#ffffff" : "#0f172a", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontFamily: "monospace", fontSize: "11px" }}>
                {isMetroPlaying ? "STOP" : "START"}
              </button>
              <div style={{ display: "flex", gap: "3px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: beat === 1 ? "#0f172a" : "#e2e8f0" }} />
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: beat === 2 ? "#64748b" : "#e2e8f0" }} />
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: beat === 3 ? "#64748b" : "#e2e8f0" }} />
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: beat === 4 ? "#64748b" : "#e2e8f0" }} />
              </div>
            </div>
          </div>
        </div>

        <div onClick={handleCountUp} style={{ flex: 1, background: isFlash ? "#f1f5f9" : "#f8fafc", border: isFlash ? "1px solid #94a3b8" : "1px solid #e2e8f0", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", userSelect: "none" }}>
          <span style={{ fontSize: "9px", color: "#94a3b8", fontWeight: "bold", letterSpacing: "3px", marginBottom: "4px", fontFamily: "monospace" }}>&gt;_ COUNTER_DATAVIEW</span>
          <div style={{ fontSize: "120px", fontWeight: "400", fontFamily: "'SFMono-Regular', Consolas, monospace", fontVariantNumeric: "tabular-nums", color: "#0f172a", letterSpacing: "1px", lineHeight: "1.0", textAlign: "center" }}>
            {count}
          </div>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "bold", marginTop: "12px" }}>ここをタップしてカウント</span>
        </div>
      </div>
    </div>
  );
}
