import { useState, useEffect, useRef } from "react";

interface TimerPracticeProps {
  onBack: () => void;
}

export default function TimerPractice({ onBack }: TimerPracticeProps) {
  const [timeLeft, setTimeLeft] = useState<number>(600); // 初期値：10分 (600秒)
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  const timerRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // カウントダウン処理
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (timerRef.current) window.clearInterval(timerRef.current);
            playAlarm(); // 0秒でアラームを鳴らす
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

  // 電子アラーム音を生成して鳴らす機能
  const playAlarm = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;
    
    // ピピピピッ、ピピピピッ と2回セットで鳴らすトリガー
    const beep = (startTime: number) => {
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, startTime + i * 0.15); // 高いピピッという音
        
        gain.gain.setValueAtTime(0, startTime + i * 0.15);
        gain.gain.linearRampToValueAtTime(0.3, startTime + i * 0.15 + 0.02);
        gain.gain.linearRampToValueAtTime(0, startTime + i * 0.15 + 0.1);
        
        osc.start(startTime + i * 0.15);
        osc.stop(startTime + i * 0.15 + 0.12);
      }
    };

    beep(now);
    beep(now + 0.8); // 0.8秒後にもう一回ピピピピッ
  };

  const handleStartStop = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(600); // 10分にリセット
  };

  const setPresetTime = (minutes: number) => {
    setIsRunning(false);
    setTimeLeft(minutes * 60);
  };

  // 表示用に 「分:秒」 の形式に変換
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
      {/* ヘッダー */}
      <header style={{ display: "flex", alignItems: "center", height: "35px", borderBottom: "1px solid #e2e8f0", marginBottom: "6px" }}>
        <button onClick={onBack} style={{ margin: 0, padding: "4px 12px", fontSize: "12px", fontWeight: "bold", background: "#ffffff", color: "#0f172a", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer" }}>
          ⬅ メニューへ戻る
        </button>
        <span style={{ marginLeft: "15px", fontSize: "10px", fontWeight: "700", letterSpacing: "2px", color: "#94a3b8", fontFamily: "monospace" }}>
          SYS.LOC // COUNTDOWN_PRACTICE
        </span>
      </header>

      {/* メイン画面（スマホ縦画面用レイアウト） */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", height: "calc(100% - 41px)", overflow: "hidden" }}>
        
        {/* 上側：タイマー表示 ＆ 操作ボタン（上下左右の完全中央寄せ） */}
        <div style={{ 
          background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", 
          padding: "16px 12px", display: "flex", flexDirection: "column", 
          alignItems: "center", justifyContent: "center", boxSizing: "border-box",
          height: "60%" 
        }}>
          <span style={{ fontSize: "9px", color: "#94a3b8", fontWeight: "bold", letterSpacing: "3px", marginBottom: "4px", fontFamily: "monospace" }}>
            &gt;_ TIME_LIMIT_COUNTDOWN
          </span>
          
          {/* 超巨大ITフォントのタイマー表示 */}
          <div style={{ 
            fontSize: "90px", fontWeight: "300", 
            fontFamily: "'SFMono-Regular', Consolas, monospace", fontVariantNumeric: "tabular-nums", 
            color: timeLeft === 0 ? "#ef4444" : "#0f172a", letterSpacing: "2px", 
            textAlign: "center", width: "100%", whiteSpace: "nowrap", lineHeight: "1.1"
          }}>
            {formatTime(timeLeft)}
          </div>

          {/* コントロールボタン */}
          <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "340px", marginTop: "15px" }}>
            <button 
              onClick={handleStartStop} 
              disabled={timeLeft === 0}
              style={{
                flex: 1, height: "46px", borderRadius: "6px", border: "none", fontSize: "14px", fontWeight: "700", 
                background: timeLeft === 0 ? "#cbd5e1" : "#0f172a", color: "#ffffff",
                cursor: timeLeft === 0 ? "not-allowed" : "pointer", letterSpacing: "1.5px", fontFamily: "monospace"
              }}
            >
              {isRunning ? "TIMER_STOP" : "TIMER_START"}
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

        {/* 下側：プリセット時間変更パネル（片手でポンポン選べる設計） */}
        <div style={{ 
          background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", 
          padding: "12px 14px", display: "flex", flexDirection: "column", gap: "10px",
          height: "40%", boxSizing: "border-box", justifyContent: "center"
        }}>
          <span style={{ fontSize: "9px", color: "#94a3b8", fontWeight: "bold", letterSpacing: "2px", fontFamily: "monospace", textAlign: "center" }}>
            -- PRESET_TIME_SELECT --
          </span>
          
          {/* 3分、5分、10分のクイックボタン */}
          <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "340px", margin: "0 auto" }}>
            <button onClick={() => setPresetTime(3)} style={{ flex: 1, height: "40px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "monospace" }}>3 MIN</button>
            <button onClick={() => setPresetTime(5)} style={{ flex: 1, height: "40px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "monospace" }}>5 MIN</button>
            <button onClick={() => setPresetTime(10)} style={{ flex: 1, height: "40px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "monospace" }}>10 MIN</button>
          </div>

          {/* 1分ずつ微調整するボタン */}
          <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "340px", margin: "0 auto" }}>
            <button onClick={() => setTimeLeft((t) => Math.max(0, t - 60))} style={{ flex: 1, height: "36px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#64748b", fontSize: "12px", fontWeight: "bold" }}>- 1 MIN</button>
            <button onClick={() => setTimeLeft((t) => t + 60)} style={{ flex: 1, height: "36px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#64748b", fontSize: "12px", fontWeight: "bold" }}>+ 1 MIN</button>
          </div>
        </div>

      </div>
    </div>
  );
}
