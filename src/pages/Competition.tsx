import { useState } from "react";

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

  if (subPage === "handicap") {
    const trick1P = selectedNumber > 0 ? (TOURNAMENT_TRICKS[class1P]?.[selectedNumber - 1] || "---") : "番号を選択";
    const trick2P = selectedNumber > 0 ? (TOURNAMENT_TRICKS[class2P]?.[selectedNumber - 1] || "---") : "番号を選択";

    // 各番号ボタンを描画する共通の部品
    const btn = (num: number) => (
      <button 
        onClick={() => setSelectedNumber(num)} 
        style={{ 
          flex: 1, borderRadius: "6px", fontSize: "14px", fontWeight: "bold", cursor: "pointer",
          border: selectedNumber === num ? "2px solid #aa3bff" : "1px solid #cbd5e1", 
          background: selectedNumber === num ? "#aa3bff" : "white", 
          color: selectedNumber === num ? "white" : "#0f172a" 
        }}
      >
        {num}
      </button>
    );

    return (
      <div style={{ width: "100vw", height: "100vh", maxHeight: "100svh", display: "flex", flexDirection: "column", background: "#ffffff", color: "#0f172a", overflow: "hidden", boxSizing: "border-box", padding: "6px", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
        <header style={{ display: "flex", alignItems: "center", height: "35px", borderBottom: "1px solid #e2e8f0", marginBottom: "4px" }}>
          <button onClick={() => { setSubPage("menu"); setSelectedNumber(0); }} style={{ margin: 0, padding: "4px 12px", fontSize: "12px", fontWeight: "bold", background: "#ffffff", color: "#0f172a", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer" }}>
            ⬅ メニューへ戻る
          </button>
        </header>

        <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "6px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "4px", background: "#ffffff", padding: "4px 8px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "11px", color: "#ff4b4b", fontWeight: "bold", whiteSpace: "nowrap" }}>🔴1人目:</span>
              <select value={class1P} onChange={(e) => setClass1P(e.target.value)} style={{ flex: 1, padding: "2px", border: "none", fontSize: "12px", fontWeight: "bold", background: "none" }}>
                {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "4px", background: "#ffffff", padding: "4px 8px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "11px", color: "#1e88e5", fontWeight: "bold", whiteSpace: "nowrap" }}>🔵2人目:</span>
              <select value={class2P} onChange={(e) => setClass2P(e.target.value)} style={{ flex: 1, padding: "2px", border: "none", fontSize: "12px", fontWeight: "bold", background: "none" }}>
                {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* 🛠️ バグの起きるループを完全に廃止し、1〜10番のボタンを手動で完璧に並べました */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", gap: "4px", height: "35px" }}>
              {btn(1)} {btn(2)} {btn(3)} {btn(4)} {btn(5)}
            </div>
            <div style={{ display: "flex", gap: "4px", height: "35px" }}>
              {btn(6)} {btn(7)} {btn(8)} {btn(9)} {btn(10)}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: "grid", gridTemplateRows: "1fr 1fr", gap: "6px", overflow: "hidden" }}>
          <div style={{ background: "#f8fafc", borderLeft: "6px solid #ff4b4b", borderTop: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px", boxSizing: "border-box" }}>
            <span style={{ fontSize: "11px", color: "#ff4b4b", fontWeight: "bold", fontFamily: "monospace" }}>&gt;_ PLAYER_1 ({class1P})</span>
            <div style={{ fontSize: selectedNumber > 0 ? "34px" : "16px", fontWeight: "bold", fontFamily: "'SFMono-Regular', Consolas, monospace", color: "#0f172a", textAlign: "center", marginTop: "8px", width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {trick1P}
            </div>
          </div>

          <div style={{ background: "#f8fafc", borderLeft: "6px solid #1e88e5", borderTop: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px", boxSizing: "border-box" }}>
            <span style={{ fontSize: "11px", color: "#1e88e5", fontWeight: "bold", fontFamily: "monospace" }}>&gt;_ PLAYER_2 ({class2P})</span>
            <div style={{ fontSize: selectedNumber > 0 ? "34px" : "16px", fontWeight: "bold", fontFamily: "'SFMono-Regular', Consolas, monospace", color: "#0f172a", textAlign: "center", marginTop: "8px", width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {trick2P}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (subPage !== "menu") {
    return (
      <div className="app">
        <header className="header">
          <button className="back-button" onClick={() => setSubPage("menu")}>⬅ 大会メニューへ戻る</button>
          <h1>選技画面</h1>
        </header>
        <main className="menu"><p>準備中...</p></main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <button className="back-button" onClick={onBack}>⬅ 戻る</button>
        <h1>大会・選技</h1>
      </header>
      <main className="menu">
        <button className="menu-button" onClick={() => setSubPage("handicap")}>
          <span>🎴</span><strong>ハンデ付き選技</strong><small>段位に応じた技を2画面で表示</small>
        </button>
        <button className="menu-button" onClick={() => setSubPage("shikoku")}>
          <span>🏆</span><strong>四国大会</strong><small>四国大会の選技</small>
        </button>
        <button className="menu-button" onClick={() => setSubPage("class")}>
          <span>🔴</span><strong>クラス別大会</strong><small>クラス別の選技</small>
        </button>
      </main>
    </div>
  );
}
