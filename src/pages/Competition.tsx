import { useState } from "react";

const TOURNAMENT_TRICKS: Record<string, string[]> = {
  "10級~6級": ["大皿", "大皿", "小皿", "小皿", "ろうそく", "ろうそく", "とめけん", "とめけん", "飛行機", "飛行機"],
  "5級~2級": ["飛行機", "飛行機", "ふりけん", "ふりけん", "日本一周", "日本一周", "世界一周", "世界一周", "灯台", "灯台"],
  "1級、準初段": ["飛行機", "ふりけん", "日本一周", "世界一周", "灯台", "村一周", "県一周", "けん先すべり", "空中ブランコ", "日本二周(連続)"],
  "初段、二段": ["世界一周", "灯台", "けん先すべり", "地球まわし", "さか落とし", "うらふりけん", "宇宙一周", "うぐいす", "つるしとめけん", "はねけん"],
  "三段、4段": ["けん先すべり", "地球まわし", "さか落とし", "うらふりけん", "宇宙一周", "うぐいす", "つるしとめけん", "ふりけん～はねけん", "一回転飛行機", "一回転灯台"],
  "5段以上": ["宇宙一周", "つるしとめけん", "ふりけん～はねけん", "一回転飛行機", "一回転灯台", "すべり止め極意", "うぐいすの谷渡り", "灯台とんぼ返り", "つるし一回転飛行機", "二回転灯台"]
};

const SHIKOKU_STAGES = ["予選", "トーナメント", "決勝"];
const CLASS_LIST = ["10級~6級", "5級~2級", "1級、準初段", "初段、二段", "三段、4段", "5段以上"];

interface CompetitionProps {
  onBack: () => void;
}

export default function Competition({ onBack }: CompetitionProps) {
  const [subPage, setSubPage] = useState<string>("menu");
  const [class1P, setClass1P] = useState<string>("初段、二段");
  const [class2P, setClass2P] = useState<string>("5級~2級");
  const [selectedNumber, setSelectedNumber] = useState<number>(0);

  const [shikokuStage, setShikokuStage] = useState<string>("予選");
  const [shikokuNumber, setShikokuNumber] = useState<number>(0);
  if (subPage === "handicap") {
    const trick1P = selectedNumber > 0 ? (TOURNAMENT_TRICKS[class1P]?.[selectedNumber - 1] || "---") : "番号を選択";
    const trick2P = selectedNumber > 0 ? (TOURNAMENT_TRICKS[class2P]?.[selectedNumber - 1] || "---") : "番号を選択";

    const btn = (num: number) => (
      <button onClick={() => setSelectedNumber(num)} style={{ flex: 1, borderRadius: "6px", fontSize: "14px", fontWeight: "bold", cursor: "pointer", border: selectedNumber === num ? "2px solid #aa3bff" : "1px solid #cbd5e1", background: selectedNumber === num ? "#aa3bff" : "white", color: selectedNumber === num ? "white" : "#0f172a" }}>{num}</button>
    );

    return (
      <div style={{ width: "100vw", height: "100vh", maxHeight: "100svh", display: "flex", flexDirection: "column", background: "#ffffff", color: "#0f172a", overflow: "hidden", boxSizing: "border-box", padding: "6px", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
        <header style={{ display: "flex", alignItems: "center", height: "35px", borderBottom: "1px solid #e2e8f0", marginBottom: "4px" }}>
          <button onClick={() => { setSubPage("menu"); setSelectedNumber(0); }} style={{ margin: 0, padding: "4px 12px", fontSize: "12px", fontWeight: "bold", background: "#ffffff", color: "#0f172a", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer" }}>⬅ メニューへ戻る</button>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", gap: "4px", height: "35px" }}>{btn(1)} {btn(2)} {btn(3)} {btn(4)} {btn(5)}</div>
            <div style={{ display: "flex", gap: "4px", height: "35px" }}>{btn(6)} {btn(7)} {btn(8)} {btn(9)} {btn(10)}</div>
          </div>
        </div>
        <div style={{ flex: 1, display: "grid", gridTemplateRows: "1fr 1fr", gap: "6px", overflow: "hidden" }}>
          <div style={{ background: "#f8fafc", borderLeft: "6px solid #ff4b4b", borderTop: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "12px", boxSizing: "border-box" }}>
            <span style={{ fontSize: "11px", color: "#ff4b4b", fontWeight: "bold", fontFamily: "monospace", marginBottom: "6px" }}>&gt;_ PLAYER_1 ({class1P})</span>
            <div style={{ fontSize: "22px", fontWeight: "700", fontFamily: "'SFMono-Regular', Consolas, monospace", color: "#0f172a", textAlign: "center", width: "100%", whiteSpace: "normal", wordBreak: "break-word", lineHeight: "1.4", padding: "0 6px" }}>{trick1P}</div>
          </div>
          <div style={{ background: "#f8fafc", borderLeft: "6px solid #1e88e5", borderTop: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "12px", boxSizing: "border-box" }}>
            <span style={{ fontSize: "11px", color: "#1e88e5", fontWeight: "bold", fontFamily: "monospace", marginBottom: "6px" }}>&gt;_ PLAYER_2 ({class2P})</span>
            <div style={{ fontSize: "22px", fontWeight: "700", fontFamily: "'SFMono-Regular', Consolas, monospace", color: "#0f172a", textAlign: "center", width: "100%", whiteSpace: "normal", wordBreak: "break-word", lineHeight: "1.4", padding: "0 6px" }}>{trick2P}</div>
          </div>
        </div>
      </div>
    );
  }

  if (subPage === "shikoku") {
    const currentTrick = shikokuNumber > 0 ? (TOURNAMENT_TRICKS[shikokuStage]?.[shikokuNumber - 1] || "---") : "番号を選択してください";
    const sBtn = (num: number) => (
      <button onClick={() => setShikokuNumber(num)} style={{ flex: 1, borderRadius: "6px", fontSize: "14px", fontWeight: "bold", cursor: "pointer", border: shikokuNumber === num ? "2px solid #00c853" : "1px solid #cbd5e1", background: shikokuNumber === num ? "#00c853" : "white", color: shikokuNumber === num ? "white" : "#0f172a" }}>{num}</button>
    );

    return (
      <div style={{ width: "100vw", height: "100vh", maxHeight: "100svh", display: "flex", flexDirection: "column", background: "#ffffff", color: "#0f172a", overflow: "hidden", boxSizing: "border-box", padding: "6px", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
        <header style={{ display: "flex", alignItems: "center", height: "35px", borderBottom: "1px solid #e2e8f0", marginBottom: "4px" }}>
          <button onClick={() => { setSubPage("menu"); setShikokuNumber(0); }} style={{ margin: 0, padding: "4px 12px", fontSize: "12px", fontWeight: "bold", background: "#ffffff", color: "#0f172a", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer" }}>⬅ メニューへ戻る</button>
        </header>
        <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "6px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#ffffff", padding: "6px 10px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "12px", color: "#00c853", fontWeight: "bold", whiteSpace: "nowrap" }}>🏆 ステージ選択:</span>
            <select value={shikokuStage} onChange={(e) => { setShikokuStage(e.target.value); setShikokuNumber(0); }} style={{ flex: 1, padding: "2px", border: "none", fontSize: "13px", fontWeight: "bold", background: "none", color: "#0f172a", cursor: "pointer" }}>
              {SHIKOKU_STAGES.map(stage => <option key={stage} value={stage}>{stage} の技リスト</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", gap: "4px", height: "35px" }}>{sBtn(1)} {sBtn(2)} {sBtn(3)} {sBtn(4)} {sBtn(5)}</div>
            <div style={{ display: "flex", gap: "4px", height: "35px" }}>{sBtn(6)} {sBtn(7)} {sBtn(8)} {sBtn(9)} {sBtn(10)}</div>
          </div>
        </div>
        <div style={{ flex: 1, background: "#f8fafc", borderLeft: "6px solid #00c853", borderTop: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", boxSizing: "border-box", overflow: "hidden" }}>
          <span style={{ fontSize: "11px", color: "#00c853", fontWeight: "bold", fontFamily: "monospace", marginBottom: "8px" }}>&gt;_ SHIKOKU_CHAMPIONSHIP // {shikokuStage.toUpperCase()}</span>
          <div style={{ fontSize: "24px", fontWeight: "700", fontFamily: "'SFMono-Regular', Consolas, monospace", color: "#0f172a", textAlign: "center", width: "100%", whiteSpace: "normal", wordBreak: "break-word", lineHeight: "1.4", padding: "0 6px" }}>{currentTrick}</div>
        </div>
      </div>
    );
  }

  if (subPage !== "menu" && subPage !== "shikoku" && subPage !== "handicap") {
    return (
      <div className="app">
        <header className="header"><button className="back-button" onClick={() => setSubPage("menu")}>⬅ 大会メニューへ戻る</button><h1>選技画面</h1></header>
        <main className="menu"><p>準備中...</p></main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header"><button className="back-button" onClick={onBack}>⬅ 戻る</button><h1>大会・選技</h1></header>
      <main className="menu">
        <button className="menu-button" onClick={() => setSubPage("handicap")}><span>🎴</span><strong>ハンデ付き選技</strong><small>段位に応じた技を2画面で表示</small></button>
        <button className="menu-button" onClick={() => setSubPage("shikoku")}><span>🏆</span><strong>四国大会</strong><small>予選・トーナメント・決勝の選技</small></button>
        <button className="menu-button" onClick={() => setSubPage("class")}><span>🔴</span><strong>クラス別大会</strong><small>クラス別の選技</small></button>
      </main>
    </div>
  );
}
