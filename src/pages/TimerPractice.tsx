import { useState, useEffect, useRef } from "react";

interface TimerPracticeProps {
  onBack: () => void;
}

export default function TimerPractice({ onBack }: TimerPracticeProps) {
  const [timeLeft, setTimeLeft] = useState<number>(600); 
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isAlarmActive, setIsAlarmActive] = useState<boolean>(false); 
  
  const timerRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const alarmIntervalRef = useRef<number | null>(null); 

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (timerRef.current) window.clearInterval(timerRef.current);
            startInfiniteAlarm(); 
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) window.clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    return () => {
      stopInfiniteAlarm();
    };
  }, []);

  const playBeep = (ctx: AudioContext, startTime: number) => {
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, startTime + i * 0.12);
      
      gain.gain.setValueAtTime(0, startTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.3, startTime + i * 0.12 + 0.02);
      gain.gain.linearRampToValueAtTime(0, startTime + i * 0.12 + 0.08);
      
      osc.start(startTime + i * 0.12);
      osc.stop(startTime + i * 0.12 + 0.1);
    }
  };

  const startInfiniteAlarm = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    setIsAlarmActive(true);
    playBeep(ctx, ctx.currentTime);

    alarmIntervalRef.current = window.setInterval(() => {
      if (ctx.state === "suspended") ctx.resume();
      playBeep(ctx, ctx.currentTime);
    }, 800);
  };

  const stopInfiniteAlarm = () => {
    setIsAlarmActive(false);
    if (alarmIntervalRef.current) {
      window.clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  };

  const handleStartStop = () => {
    if (isAlarmActive) {
      stopInfiniteAlarm();
      return;
    }
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    stopInfiniteAlarm();
    setTimeLeft(600); 
  };

  const setPresetTime = (minutes: number) => {
    setIsRunning(false);
    stopInfiniteAlarm();
    setTimeLeft(minutes * 60);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ 
      width: "100vw", height: "100vh", maxHeight: "100svh",
      display: "flex", flexDirection: "column", background: "#ffffff", 
      color: "#0f172a", overflow: "hidden", boxSizing: "border-box", padding: "6px",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
    }}>
      <header style={{ display: "flex", alignItems: "center", height: "35px", borderBottom: "1px solid #e2e8f0", marginBottom: "6px" }}>
        <button onClick={() => { stopInfiniteAlarm(); onBack(); }} style={{ margin: 0, padding: "4px 12px", fontSize: "12px", fontWeight: "bold", background: "#ffffff", color: "#0f172a", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer" }}>
          ⬅ メニューへ戻る
        </button>
        <span style={{ marginLeft: "15px", fontSize: "10px", fontWeight: "700", letterSpacing: "2px", color: "#94a3b8", fontFamily: "monospace" }}>
          SYS.LOC // COUNTDOWN_PRACTICE
        </span>
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", height: "calc(100% - 41px)", overflow: "hidden" }}>
        
        <div style={{ 
          background: isAlarmActive ? "#fff5f5" : "#f8fafc", 
          border: isAlarmActive ? "1px solid #fecaca" : "1px solid #e2e8f0", 
          borderRadius: "12px", padding: "16px 12px", display: "flex", flexDirection: "column", 
          alignItems: "center", justifyContent: "center", boxSizing: "border-box",
          height: "55%", transition: "all 0.2s"
        }}>
          <span style={{ fontSize: "9px", color: isAlarmActive ? "#ef4444" : "#94a3b8", fontWeight: "bold", letterSpacing: "3px", marginBottom: "4px", fontFamily: "monospace" }}>
            {isAlarmActive ? "⚠️ STATUS // ALARM_TRIGGERED" : ">_ TIME_LIMIT_COUNTDOWN"}
          </span>
          
          <div style={{ 
            fontSize: "90px", fontWeight: "300", 
            fontFamily: "'SFMono-Regular', Consolas, monospace", fontVariantNumeric: "tabular-nums", 
            color: timeLeft === 0 ? "#ef4444" : "#0f172a", letterSpacing: "2px", 
            textAlign: "center", width: "100%", whiteSpace: "nowrap", lineHeight: "1.1"
          }}>
            {formatTime(timeLeft)}
          </div>

          <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "340px", marginTop: "15px" }}>
            <button 
              onClick={handleStartStop} 
              disabled={timeLeft === 0 && !isAlarmActive}
              style={{
                flex: 1, height: "46px", borderRadius: "6px", border: "none", fontSize: "14px", fontWeight: "700", 
                background: isAlarmActive ? "#ef4444" : (timeLeft === 0 ? "#cbd5e1" : "#0f172a"), 
                color: "#ffffff",
                cursor: timeLeft === 0 && !isAlarmActive ? "not-allowed" : "pointer", 
                letterSpacing: "1.5px", fontFamily: "monospace",
                boxShadow: isAlarmActive ? "0 0 15px rgba(239,68,68,0.4)" : "none",
                transition: "all 0.1s"
              }}
            >
              {isAlarmActive ? "⚠️ ALARM_STOP" : (isRunning ? "TIMER_STOP" : "TIMER_START")}
            </button>
            <button 
              onClick={handleReset} 
              style={{
                width: "100px", height: "46px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", 
                fontWeight: "700", cursor: "pointer", background: "#ffffff", color: "#0f172a", letterSpacing: "1.5px", fontFamily: "monospace"
              }}
            >
              RESET
            </button>
          </div>
        </div>

        <div style={{ 
          background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", 
          padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px",
          height: "45%", boxSizing: "border-box", justifyContent: "center"
        }}>
          <span style={{ fontSize: "9px", color: "#94a3b8", fontWeight: "bold", letterSpacing: "2px", fontFamily: "monospace", textAlign: "center" }}>
            -- PRESET_TIME_SELECT --
          </span>
          
          <div style={{ display: "flex", gap: "6px", width: "100%", maxWidth: "340px", margin: "0 auto" }}>
            <button onClick={() => setPresetTime(3)} style={{ flex: 1, height: "36px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "monospace" }}>3 MIN</button>
            <button onClick={() => setPresetTime(5)} style={{ flex: 1, height: "36px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "monospace" }}>5 MIN</button>
            <button onClick={() => setPresetTime(10)} style={{ flex: 1, height: "36px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "monospace" }}>10 MIN</button>
          </div>

          <span style={{ fontSize: "9px", color: "#94a3b8", fontWeight: "bold", letterSpacing: "2px", fontFamily: "monospace", textAlign: "center", marginTop: "4px" }}>
            -- TIME_DIAL_ADJUST --
          </span>

          <div style={{ display: "flex", gap: "6px", width: "100%", maxWidth: "340px", margin: "0 auto" }}>
            <button onClick={() => setTimeLeft((t) => Math.max(0, t - 60))} style={{ flex: 1, height: "36px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a", fontSize: "12px", fontWeight: "bold", fontFamily: "monospace" }}>- 1 MIN</button>
            <button onClick={() => setTimeLeft((t) => t + 60)} style={{ flex: 1, height: "36px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a", fontSize: "12px", fontWeight: "bold", fontFamily: "monospace" }}>+ 1 MIN</button>
            <button onClick={() => setTimeLeft((t) => Math.max(0, t - 10))} style={{ flex: 1, height: "36px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#64748b", fontSize: "12px", fontWeight: "bold", fontFamily: "monospace" }}>- 10 SEC</button>
            <button onClick={() => setTimeLeft((t) => t + 10)} style={{ flex: 1, height: "36px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#64748b", fontSize: "12px", fontWeight: "bold", fontFamily: "monospace" }}>+ 10 SEC</button>
          </div>
        </div>

      </div>
    </div>
  );
}
