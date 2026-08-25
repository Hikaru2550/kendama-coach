import { useState } from "react";
import Competition from "./pages/Competition";
import TimeAttack from "./pages/TimeAttack";
import Moshikame from "./pages/Moshikame";

import "./App.css";
function App() {
  const [page, setPage] = useState("home");
  if (page === "competition") {
  return <Competition onBack={() => setPage("home")} />;
}
  if (page === "timeAttack") {
  return <TimeAttack onBack={() => setPage("home")} />;
}
  if (page === "moshikame") {
  return <Moshikame onBack={() => setPage("home")} />;
}


  return (
    
    <div className="app">
      <header className="header">
        <h1>KENDAMA COACH</h1>
        <p>けん玉指導員サポート</p>
      </header>

      <main className="menu">
        <button
  className="menu-button"
  onClick={() => setPage("competition")}
>
  <span>🏆</span>
  <strong>大会・選技</strong>
  <small>ハンデ戦・各大会の技を表示</small>
</button>

        <button className="menu-button" onClick={() => setPage("timeAttack")}>
  <span>⏱️</span>
  <strong>タイム競技</strong>
  <small>タイムエントリー</small>
</button>


        <button className="menu-button" onClick={() => setPage("moshikame")}>
  <span>🔢</span>
  <strong>もしかめ</strong>
  <small>もしかめカウント</small>
</button>


        <button className="menu-button">
          <span>📚</span>
          <strong>技一覧</strong>
          <small>段位・級位・大会別</small>
        </button>

        <button className="menu-button">
          <span>💰</span>
          <strong>料金・手続き</strong>
          <small>合格後の費用などを確認</small>
        </button>
      </main>
    </div>
  );
}

export default App;