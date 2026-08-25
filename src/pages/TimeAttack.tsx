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
      {/* ITインジケーター風ヘッダー */}
      <header style={{ 
        display: "flex", alignItems: "center", height: "35px", 
        borderBottom: "1px solid #e2e8f0", marginBottom: "6px" 
      }}>
        <button 
          onClick={onBack} 
          style={{ 
            margin: 0, padding: "4px 12px", fontSize: "11px", fontWeight: "bold",
            background: "#ffffff", color: "#0f172a", border: "1px solid #cbd5e1", 
            borderRadius: "4px", cursor: "pointer", transition: "all 0.1s",
            letterSpacing: "1px", fontFamily: "monospace"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "#f1f5f9"}
          onMouseOut={(e) => e.currentTarget.style.background = "#ffffff"}
        >
          ⬅ メニューへ戻る
        </button>
        <span style={{ marginLeft: "15px", fontSize: "10px", fontWeight: "700", letterSpacing: "2px", color: "#94a3b8", fontFamily: "monospace" }}>
          
        </span>
      </header>

      {/* メインレイアウト */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "10px", height: "calc(100% - 41px)", overflow: "hidden" }}>
        
        {/* 左側：メインストップウォッチ（上下左右の完全中央寄せに構造をアップデート） */}
        <div style={{ 
          background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", 
          padding: "16px", display: "flex", flexDirection: "column", 
          alignItems: "center", justifyContent: "center", // コンテンツを完全に真ん中（センター）に集約
          boxSizing: "border-box", height: "100%"
        }}>
          {/* 中央のコンテナ：数字とボタンを近くに配置して塊（カタマリ）にする */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            
            {/* ラベル */}
            <span style={{ fontSize: "9px", color: "#94a3b8", fontWeight: "bold", letterSpacing: "3px", marginBottom: "8px", fontFamily: "monospace" }}>
              &gt;
            </span>
            
            {/* IT硬派フォント表示（不要な余白を完全に削ったタイト設計） */}
            <div style={{ 
              fontSize: "105px", 
              fontWeight: "400", 
              fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace", 
              fontVariantNumeric: "tabular-nums", 
              color: "#0f172a", 
              letterSpacing: "1px", 
              textAlign: "center",
              width: "100%",
              whiteSpace: "nowrap",
              lineHeight: "0.95" // 縦のラインをキュッと引き締める
            }}>
              {formatTime(time)}
            </div>

            {/* ボタンエリア（数字のすぐ下に最適な距離感で結合） */}
            <div style={{ 
              display: "flex", gap: "12px", width: "100%", maxWidth: "340px", 
              marginTop: "24px" // 数字との間隔を美しく保つ
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
                onMouseOver={(e) => { e.currentTarget.style.background = "#1e293b" }}
                onMouseOut={(e) => { e.currentTarget.style.background = "#0f172a" }}
              >
                {isRunning ? "STOP" : "START"}
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
                onMouseOver={(e) => e.currentTarget.style.background = "#f1f5f9"}
                onMouseOut={(e) => e.currentTarget.style.background = "#ffffff"}
              >
                {isRunning ? "LAP" : "RESET"}
              </button>
            </div>

          </div>
        </div>

        {/* 右側：ラップタイムログリスト */}
        <div style={{ 
          background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", 
          padding: "16px", display: "flex", flexDirection: "column", overflow: "hidden" 
        }}>
          <h3 style={{ 
            margin: "0 0 12px 0", fontSize: "10px", fontWeight: "700", letterSpacing: "2px",
            borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", color: "#94a3b8", fontFamily: "monospace"
          }}>
            LOG_BUFFER ({laps.length})
          </h3>
          
          {/* ラップログ */}
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
                    padding: "12px 16px", background: "#ffffff", borderRadius: "6px", 
                    border: "1px solid #e2e8f0"
                  }}
                >
                  <strong style={{ fontSize: "11px", color: "#64748b", fontFamily: "monospace" }}>
                    LOG_{String(index + 1).padStart(2, "0")}
                  </strong>
                  <span style={{ 
                    fontFamily: "'SFMono-Regular', Consolas, monospace", 
                    fontVariantNumeric: "tabular-nums",
                    fontSize: "22px", 
                    fontWeight: "bold", 
                    color: "#0f172a",
                    letterSpacing: "0.5px"
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
