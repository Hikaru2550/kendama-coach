import { useState } from "react";

// クラス（級・段）ごとの、1〜10番の選技データ
const TOURNAMENT_TRICKS: Record<string, string[]> = {
  "10級~6級": ["大皿", "小皿", "中皿", "ろうそく", "とめけん", "（なし）", "（なし）", "（なし）", "（なし）", "（なし）"],
  "5級~1級": ["とめけん", "飛行機", "ふりけん", "日本一周", "世界一周", "灯台", "けん先すべり", "地球まわし", "さか落とし", "うぐいす"],
  "初段": ["世界一周", "灯台", "けん先すべり", "地球まわし", "さか落とし", "宇宙一周", "うぐいす", "はねけん", "一回転飛行機", "極意"],
  "二段": ["灯台", "けん先すべり", "地球まわし", "さか落とし", "宇宙一周", "うぐいす", "はねけん", "一回転飛行機", "一回転灯台", "レジ"],
  "三段以上": ["さか落とし", "宇宙一周", "うぐいす", "はねけん", "一回転飛行機", "一回転灯台", "すべり止め極意", "うぐいす渡り", "ちどり", "つるし"]
};

const CLASS_LIST = ["10級~6級", "5級~1級", "初段", "二段", "三段以上"];

interface CompetitionProps {
  onBack: () => void;
}

export default function Competition({ onBack }: CompetitionProps) {
  const [subPage, setSubPage] = useState<"menu" | "handicap" | "shikoku" | "class">("menu");
  const [class1P, setClass1P] = useState<string>("初段");
  const [class2P, setClass2P] = useState<string>("5級~1級");
  const [selectedNumber, setSelectedNumber] = useState<number>(0);

  // ■■■ 1. ハンデ付き選技（押しやすさ・バランス重視レイアウト） ■■■
  if (subPage === "handicap") {
    const trick1P = selectedNumber > 0 ? (TOURNAMENT_TRICKS[class1P]?.[selectedNumber - 1] || "---") : "番号を選択";
    const trick2P = selectedNumber > 0 ? (TOURNAMENT_TRICKS[class2P]?.[selectedNumber - 1] || "---") : "番号を選択";

    return (
      <div style={{ 
        width: "100vw", 
        height: "100vh", 
        maxHeight: "100svh",
        display: "flex", 
        flexDirection: "column", 
        background: "#f4f6f8",
        overflow: "hidden", 
        boxSizing: "border-box",
        padding: "6px"
      }}>
        {/* 上部エリア：ボタンサイズを大きくし、押しやすさを最優先に */}
        <div style={{ 
          background: "white", 
          padding: "6px 12px", 
          borderRadius: "8px", 
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          marginBottom: "6px",
          display: "flex",
          alignItems: "center",
          gap: "15px"
        }}>
          {/* 戻るボタン（押しやすいサイズ） */}
          <button className="back-button" onClick={() => { setSubPage("menu"); setSelectedNumber(0); }} style={{ margin: 0, padding: "6px 12px", fontSize: "14px", whiteSpace: "nowrap" }}>
            ⬅ メニュー
          </button>

          {/* 1〜10の選技番号（押しやすいように幅と高さをしっかり確保） */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px", flex: 1, justifyContent: "center" }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <button
                key={num}
                onClick={() => setSelectedNumber(num)}
                style={{
                  flex: "1",
                  maxWidth: "45px",
                  height: "38px",
                  borderRadius: "6px",
                  border: selectedNumber === num ? "2px solid #aa3bff" : "1px solid #bbb",
                  background: selectedNumber === num ? "#aa3bff" : "white",
                  color: selectedNumber === num ? "white" : "#222",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* 【大画面表示エリア】段位設定をそれぞれの画面内に移動 */}
        <div style={{ 
          flex: 1, 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: "6px",
          height: "calc(100% - 56px)",
          overflow: "hidden"
        }}>
          
          {/* 左画面：1人目結果（赤） */}
          <div style={{ 
            background: "#fff", 
            borderTop: "5px solid #ff4b4b", 
            borderRadius: "8px", 
            display: "flex",
            flexDirection: "column",
            height: "100%",
            boxSizing: "border-box",
            padding: "8px"
          }}>
            {/* 段位選択を画面内に内包 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #fee2e2", paddingBottom: "4px" }}>
              <span style={{ fontSize: "14px", color: "#ff4b4b", fontWeight: "bold" }}>🔴 1人目の段位</span>
              <select value={class1P} onChange={(e) => setClass1P(e.target.value)} style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "13px", border: "1px solid #ccc" }}>
                {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {/* 技名表示（文字サイズを少し抑えてきれいに中央配置） */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <div style={{ 
                fontSize: selectedNumber > 0 ? "24px" : "15px", 
                fontWeight: "bold", 
                color: selectedNumber > 0 ? "#222" : "#aaa",
                textAlign: "center",
                lineHeight: "1.3",
                padding: "0 10px"
              }}>
                {trick1P}
              </div>
            </div>
          </div>

          {/* 右画面：2人目結果（青） */}
          <div style={{ 
            background: "#fff", 
            borderTop: "5px solid #1e88e5", 
            borderRadius: "8px", 
            display: "flex",
            flexDirection: "column",
            height: "100%",
            boxSizing: "border-box",
            padding: "8px"
          }}>
            {/* 段位選択を画面内に内包 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #dbeafe", paddingBottom: "4px" }}>
              <span style={{ fontSize: "14px", color: "#1e88e5", fontWeight: "bold" }}>🔵 2人目の段位</span>
              <select value={class2P} onChange={(e) => setClass2P(e.target.value)} style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "13px", border: "1px solid #ccc" }}>
                {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {/* 技名表示 */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <div style={{ 
                fontSize: selectedNumber > 0 ? "24px" : "15px", 
                fontWeight: "bold", 
                color: selectedNumber > 0 ? "#222" : "#aaa",
                textAlign: "center",
                lineHeight: "1.3",
                padding: "0 10px"
              }}>
                {trick2P}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ■■■ 2. その他の通常の大会画面 ■■■
  if (subPage !== "menu") {
    return (
      <div className="app">
        <header className="header">
          <button className="back-button" onClick={() => setSubPage("menu")}>⬅ 大会メニューへ戻る</button>
          <h1>選技画面</h1>
        </header>
        <main className="menu">
          <p>準備中...</p>
        </main>
      </div>
    );
  }

  // ■■■ 3. 大会選択のメニュー画面 ■■■
  return (
    <div className="app">
      <header className="header">
        <button className="back-button" onClick={onBack}>⬅ 戻る</button>
        <h1>大会・選技</h1>
      </header>

      <main className="menu">
        <button className="menu-button" onClick={() => setSubPage("handicap")}>
          <span>🎴</span>
          <strong>ハンデ付き選技</strong>
          <small>段位に応じた技を2画面で表示</small>
        </button>

        <button className="menu-button" onClick={() => setSubPage("shikoku")}>
          <span>🏆</span>
          <strong>四国大会</strong>
          <small>四国大会の選技</small>
        </button>

        <button className="menu-button" onClick={() => setSubPage("class")}>
          <span>🔴</span>
          <strong>クラス別大会</strong>
          <small>クラス別の選技</small>
        </button>
      </main>
    </div>
  );
}
