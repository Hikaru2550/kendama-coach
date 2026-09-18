import { useState } from "react";

// 📚 今後いくらでも追加できる技の一覧データ
const TRICK_LISTS_DATA: Record<string, string[]> = {
  "タイム競技B": [
    "前振りろうそく",
    "県一周",
    "日本二周",
    "世界二周",
    "ヨーロッパ一周",
    "地球まわし",
    "うぐいすけん",
    "はねけん",
    "一回転飛行機",
    "さか落とし"
  ],
  // 💡 今後ここに新しいジャンルを増やすだけで自動的にボタンが増えます！
  "級位の技(準備中)": ["大皿", "小皿", "中皿", "ろうそく", "とめけん"],
  "段位の技(準備中)": ["世界一周", "灯台", "地球まわし", "うぐいす", "はねけん"]
};

interface TricksProps {
  onBack: () => void;
}

export default function Tricks({ onBack }: TricksProps) {
  // "menu" ならジャンル選択ボタン一覧、それ以外ならその技リストを表示
  const [subPage, setSubPage] = useState<string>("menu");

  // メインのボタン一覧メニュー画面
  if (subPage === "menu") {
    return (
      <div className="app">
        <header className="header" style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <button className="back-button" onClick={onBack} style={{ position: "absolute", left: "10px" }}>⬅ 戻る</button>
          <h1 style={{ margin: 0 }}>📚 技一覧</h1>
        </header>
        <main className="menu">
          {Object.keys(TRICK_LISTS_DATA).map((category) => (
            <button
              key={category}
              className="menu-button"
              onClick={() => setSubPage(category)}
              style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "16px" }}
            >
              <strong style={{ fontSize: "16px" }}>{category}</strong>
              <small style={{ marginTop: "4px", color: "#64748b" }}>一覧を確認する</small>
            </button>
          ))}
        </main>
      </div>
    );
  }
  // ボタンが押されたら、そのジャンルの技一覧リストを縦並びで表示
  const activeTricks = TRICK_LISTS_DATA[subPage] || [];

  return (
    <div style={{ width: "100vw", height: "100vh", maxHeight: "100svh", display: "flex", flexDirection: "column", background: "#ffffff", color: "#0f172a", overflow: "hidden", boxSizing: "border-box", padding: "6px", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
      <header style={{ display: "flex", alignItems: "center", height: "35px", borderBottom: "1px solid #e2e8f0", marginBottom: "6px" }}>
        <button onClick={() => setSubPage("menu")} style={{ margin: 0, padding: "4px 12px", fontSize: "12px", fontWeight: "bold", background: "#ffffff", color: "#0f172a", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer" }}>⬅ メニューへ戻る</button>
      </header>

      <div style={{ flex: 1, background: "#f8fafc", borderLeft: "6px solid #2563eb", borderTop: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px", boxSizing: "border-box", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <span style={{ fontSize: "10px", color: "#2563eb", fontWeight: "bold", fontFamily: "monospace", marginBottom: "8px" }}>&gt;_ TRICK_LIST // {subPage.toUpperCase()}</span>
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px", paddingRight: "2px" }}>
          {activeTricks.map((trick, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", background: "#ffffff", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: "bold", color: "#2563eb", width: "24px" }}>{String(index + 1).padStart(2, "0")}</span>
              <span style={{ fontSize: "15px", fontWeight: "bold", color: "#0f172a" }}>{trick}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
