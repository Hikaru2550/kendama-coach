import { useState } from "react";
import Competition from "./pages/Competition";
import TimeAttack from "./pages/TimeAttack";
import Moshikame from "./pages/Moshikame";
import TimerPractice from "./pages/TimerPractice"; 
import Tricks from "./pages/Tricks"; // 💡新画面「技一覧」の読み込み
import "./App.css";

export default function App() {
  const [page, setPage] = useState<"home" | "competition" | "timeAttack" | "moshikame" | "timerPractice" | "tricks">("home");

  // 1. 大会・選技画面
  if (page === "competition") {
    return <Competition onBack={() => setPage("home")} />;
  }

  // 2. タイム競技画面
  if (page === "timeAttack") {
    return <TimeAttack onBack={() => setPage("home")} />;
  }

  // 3. もしかめ画面
  if (page === "moshikame") {
    return <Moshikame onBack={() => setPage("home")} />;
  }

  // 4. 制限時間練習画面
  if (page === "timerPractice") {
    return <TimerPractice onBack={() => setPage("home")} />;
  }

  // 5. 技一覧画面（新しく作成したTricksコンポーネントを呼び出すように変更）
  if (page === "tricks") {
    return <Tricks onBack={() => setPage("home")} />;
  }

  // 🔴 メインメニュー
  return (
    <div className="app">
      <header className="header">
        <h1>けん玉コーチ</h1>
      </header>

      <main className="menu">
        {/* 1番目のボタン */}
        <button className="menu-button" onClick={() => setPage("competition")}>
          <span>🎴</span>
          <strong>大会・選技</strong>
          <small>段位に応じたハンデ選技など</small>
        </button>

        {/* 2番目のボタン */}
        <button className="menu-button" onClick={() => setPage("timeAttack")}>
          <span>⏱️</span>
          <strong>タイム競技</strong>
          <small>競技用ストップウォッチ</small>
        </button>

        {/* 3番目のボタン */}
        <button className="menu-button" onClick={() => setPage("moshikame")}>
          <span>🔢</span>
          <strong>もしかめ</strong>
          <small>メトロノーム付きカウンター</small>
        </button>

        {/* 4番目のボタン */}
        <button className="menu-button" onClick={() => setPage("tricks")}>
          <span>📚</span>
          <strong>技一覧</strong>
          <small>級・段位の技データを閲覧</small>
        </button>

        {/* 5番目のボタン */}
        <button className="menu-button" onClick={() => setPage("timerPractice")}>
          <span>⏳</span>
          <strong>制限時間練習</strong>
          <small>10分間練習・0秒アラーム付き</small>
        </button>
      </main>
    </div>
  );
}
