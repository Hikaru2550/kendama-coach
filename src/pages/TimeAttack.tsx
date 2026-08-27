import { useState, useEffect, useRef } from "react";

interface TimeAttackProps {
  onBack: () => void;
}

export default function TimeAttack({ onBack }: TimeAttackProps) {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [laps, setLaps] = useState<number[]>([]);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time;
      timerRef.current = window.setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    } else {
      if (timerRef.current) window.clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isRunning, time]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleLap = () => {
    if (!isRunning) return;
    setLaps(prev => [...prev, time]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const miliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${miliseconds.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ 
      width: "100vw", height: "100vh", maxHeight: "100svh",
      display: "flex", flexDirection: "column", background: "#ffffff", 
      color: "#0f172a", overflow: "hidden", boxSizing: "border-box", padding: "6px",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
    }}>
      {/* 上部ヘッダー */}
      <header style={{ 
        display: "flex", alignItems: "center", height: "35px", 
        borderBottom: "1px solid #e2e8f0", marginBottom: "6px" 
      }}>
        <button 
          onClick={onBack} 
          style={{ 
            margin: 0, padding: "4px 12px", fontSize: "12px", fontWeight: "bold",
            background: "#ffffff", color: "#0f172a", border: "1px solid #cbd5e1", 
            borderRadius: "4px", cursor: "pointer", transition: "all 0.1s"
          }}
        >
          ⬅ メメニューへ戻る
        </button>
        <span style={{ marginLeft: "15px", fontSize: "10px", fontWeight: "700", letterSpacing: "2px", color: "#94a3b8", fontFamily: "monospace" }}>
          SYS.LOC // TIME_VERTICAL_V3.0
        </span>
      </header>

      {/* メインレイアウト（スマホの縦画面用に上下分割構造へアップデート） */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", height: "calc(100% - 41px)", overflow: "hidden" }}>
        
        {/* 上側：ストップウォッチメインパネル（全体の高さを固定して重なりを完全防止） */}
        <div style={{ 
          background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", 
          padding: "16px 12px", display: "flex", flexDirection: "column", 
          alignItems: "center", justifyContent: "center", boxSizing: "border-box",
          height: "45%" // 画面の上45%をストップウォッチエリアに固定
        }}>
          <span style={{ fontSize: "9px", color: "#94a3b8", fontWeight: "bold", letterSpacing: "3px", marginBottom: "4px", fontFamily: "monospace" }}>
            &gt;_ RUNNING_DATETIME
          </span>
          
          {/* 縦画面の幅にバシッと収まる、最大級かつ洗練された等幅ITフォント（はみ出し・上下切れ対策済み） */}
          <div style={{ 
            fontSize: "76px", 
            fontWeight: "400", 
            fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace", 
            fontVariantNumeric: "tabular-nums", 
            color: "#0f172a", 
            letterSpacing: "1px", 
            textAlign: "center",
            width: "100%",
            whiteSpace: "nowrap",
            lineHeight: "1.1",
            margin: "4px 0"
          }}>
            {formatTime(time)}
          </div>

          {/* スマホ縦持ち時に、親指が最も押しやすい位置に引き上げたコントロールボタン */}
          <div style={{ 
            display: "flex", gap: "10px", width: "100%", maxWidth: "340px", 
            marginTop: "12px"
          }}>
            <button 
              onClick={handleStartStop} 
              style={{
                flex: 1, height: "46px", borderRadius: "6px", border: "none", fontSize: "14px", fontWeight: "700", cursor: "pointer",
                background: "#0f172a",
                color: "#ffffff",
                boxShadow: isRunning ? "0 4px 12px rgba(15,23,42,0.15)" : "none",
                transition: "all 0.1s",
                letterSpacing: "1.5px",
                fontFamily: "monospace"
              }}
            >
              {isRunning ? "EXEC_STOP" : "EXEC_START"}
            </button>
            
            <button 
              onClick={isRunning ? handleLap : handleReset} 
              style={{
                width: "100px", height: "46px", borderRadius: "6px", 
                border: "1px solid #cbd5e1", fontSize: "13px", fontWeight: "700", cursor: "pointer",
                background: "#ffffff",
                color: "#0f172a",
                transition: "all 0.1s",
                letterSpacing: "1.5px",
                fontFamily: "monospace"
              }}
            >
              {isRunning ? "LAP" : "RESET"}
            </button>
          </div>
        </div>

        {/* 下側：ラップタイムログリスト（残りの高さを使ってスクロール表示） */}
        <div style={{ 
          background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", 
          padding: "12px 14px", display: "flex", flexDirection: "column", 
          height: "55%", overflow: "hidden", boxSizing: "border-box"
        }}>
          <h3 style={{ 
            margin: "0 0 8px 0", fontSize: "10px", fontWeight: "700", letterSpacing: "2px",
            borderBottom: "1px solid #e2e8f0", paddingBottom: "6px", color: "#94a3b8", fontFamily: "monospace"
          }}>
            LOG_BUFFER ({laps.length})
          </h3>
          
          {/* ラップログ（最新が一番上に来るように表示され、文字切れ・上下切れなし） */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column-reverse", gap: "6px" }}>
            {laps.length === 0 ? (
              <div style={{ margin: "auto", color: "#94a3b8", fontSize: "11px", letterSpacing: "1px", fontFamily: "monospace" }}>
                NO_LOGGED_DATA
              </div>
            ) : (
              laps.map((lapTime, index) => (
                <div 
                  key={index} 
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center", 
                    padding: "10px 14px", background: "#ffffff", borderRadius: "6px", 
                    border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
                  }}
                >
                  <strong style={{ fontSize: "11px", color: "#64748b", fontFamily: "monospace" }}>
                    LOG_{String(index + 1).padStart(2, "0")}
                  </strong>
                  <span style={{ 
                    fontFamily: "'SFMono-Regular', Consolas, monospace", 
                    fontVariantNumeric: "tabular-nums",
                    fontSize: "20px", 
                    fontWeight: "bold", 
                    color: "#0f172a",
                    letterSpacing: "0.5px",
                    lineHeight: "1.2"
                  }}>
                    {formatTime(lapTime)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
