# Spec Delta

## Purpose

提供菜單以外的日常照顧入口，包括首頁環境提醒、家庭共用照顧紀錄與不可互動的鳥聚點展示，同時維持本輪 MVP 的簡潔範圍。

## ADDED Requirements

### Requirement: Show local mock weather guidance
首頁 SHALL 使用本地假資料產生 18–32°C 與 40–80% 濕度；每次載入可重新產生，且只顯示一項提醒，優先順序為低溫保暖、高濕度通風、高溫降溫，均未觸發時顯示「今日環境舒適」。

#### Scenario: Low temperature and humidity are present
- **WHEN** 假資料同時符合低溫與高濕度門檻
- **THEN** 只顯示低溫保暖提醒

#### Scenario: Conditions are normal
- **WHEN** 溫度高於 20°C 且低於 30°C、濕度低於 70%
- **THEN** 顯示「今日環境舒適」

### Requirement: Keep health disclaimer in the menu section
首頁所有菜單區塊之後 SHALL 統一顯示小字、淺色的「僅供健康日常鮮食參考，病鳥請遵照獸醫指示」補充文字；無使用中菜單時不顯示菜單區塊與其免責文字。

#### Scenario: Multiple menu sections are shown
- **WHEN** 首頁顯示一個以上使用中菜單
- **THEN** 免責文字在所有菜單區塊底部只顯示一次

### Requirement: Manage household care records
系統 SHALL 提供全家庭共用的照顧紀錄新增、列表查看與刪除；紀錄不得綁定鳥寶或品種。日期、標題、心情、活動量必填，內容與飲食狀況選填，日期不得為未來日期。

#### Scenario: User creates a care record
- **WHEN** 使用者填寫日期、標題、心情與活動量並儲存
- **THEN** 系統建立一筆不綁定任何鳥寶的紀錄

#### Scenario: User rates mood and activity
- **WHEN** 使用者建立或編輯照顧紀錄
- **THEN** 心情與活動量各以 1–5 個固定 ICON 選項選取

### Requirement: Show non-interactive bird spot cards
系統 SHALL 顯示鸚鵡咖啡廳、鳥醫院與鸚鵡用品店三個固定展示卡片；本輪 SHALL 不提供點擊、地圖、定位或外部店家資料。

#### Scenario: User views bird spots
- **WHEN** 使用者開啟鳥聚點畫面
- **THEN** 顯示三個不可點擊的固定展示卡片

### Requirement: Persist household records locally
照顧紀錄 SHALL 儲存在 LocalStorage，重新整理或重新開啟 App 後仍可查看；鳥聚點不需儲存互動狀態。

#### Scenario: Reload restores care records
- **WHEN** 使用者重新整理 App
- **THEN** 先前儲存的照顧紀錄仍存在
