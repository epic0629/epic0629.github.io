# Epic's Vibe Coding Wall

邁向工人AI之路 — 每完成一個 coding，就會點亮一格。

## 概要

10x10 互動式成就牆，展示 vibe coding 專案進度。
部署在 GitHub Pages：https://epic0629.github.io

## 技術棧

純 HTML / CSS / JS，零依賴，不需 build。

## 檔案結構

- `index.html` — 主頁面（header + grid + modal + tooltip）
- `style.css` — 樣式（淺色主題 #bce2e8、CSS Grid、動畫、RWD）
- `script.js` — 互動邏輯（fetch data.json → 渲染格子 → tooltip/modal）
- `data.json` — 專案資料（position、color、name、description、tech、url）
- `suica.png` — 吉祥物頭像

## 如何新增專案

在 `data.json` 的 `cells` 陣列新增一筆：

```json
{
  "position": 99,
  "name": "新專案名稱",
  "category": "project",
  "color": "#hex色碼",
  "description": "專案簡介",
  "tech": ["技術1", "技術2"],
  "url": "https://...",
  "completed": "2026-03"
}
```

position 為 0~99（10x10 格子索引），push 後 GitHub Pages 自動部署。

## 目前狀態

- 18 / 100 格已點亮
- 持續新增中

## 設計決策備忘

- 背景色 #bce2e8（淺藍）
- 格子未點亮：半透明白 rgba(255,255,255,0.4)
- 格子點亮：使用者指定色碼 + box-shadow 光暈 + 呼吸動畫
- 標題漸層：#1a5276 → #6c3483 → #c0392b
- Modal 白底毛玻璃
- Suica 企鵝 40px 放標題左側
