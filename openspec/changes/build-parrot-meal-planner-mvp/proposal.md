# Proposal

## Why

目前專案只有產品、視覺與種子資料，尚未有可操作的前端狀態流程或本地邏輯。需要先建立以單鳥完整使用為優先、同時支援多鳥隔離的 MVP 規格，讓菜單生成、Smart Swap、採買備餐與照顧紀錄能在不依賴雲端服務的情況下安全運作。

## What Changes

- 建立鳥寶建檔、選鳥與編輯流程；品種由六種固定選項組成，飲食群組由系統自動帶入。
- 建立 `Empty → Select Bird → Draft → Saved` 菜單狀態機，生成前強制指定 `target_bird_id`。
- 依 `species.json`、`seeds.json` 與鳥寶體重生成週一至週日菜單，生鮮食材以標準單位顯示，滋養丸與穀物／種子以克顯示。
- 建立受限 Smart Swap，只能選擇相同分類、相同營養用途且通過安全與頻率規則的食材。
- 建立歷史菜單、使用中菜單、首頁分區、採買清單與週日備餐步驟。
- 建立首頁假天氣提醒、全域安全禁食規則、健康免責文字，以及每日照顧紀錄與鳥聚點展示畫面。
- 使用唯讀種子資料與 LocalStorage 保存鳥寶、草稿、菜單歷史與照顧紀錄；不串接天氣 API、地圖或雲端帳號。

## Capabilities

### New Capabilities

- `bird-profiles`: 建立與編輯鳥寶資料、品種色票、體重同步與鳥寶隔離。
- `meal-planning`: 生成七日菜單、Smart Swap、草稿狀態、歷史版本與使用中菜單。
- `shopping-and-prep`: 依使用中菜單彙總生鮮採買重量／單位數與備餐步驟。
- `care-and-home`: 首頁健康提醒、每日照顧紀錄與鳥聚點展示內容。

### Modified Capabilities

- None.

## Impact

- 新增前端頁面、狀態機、菜單／安全規則邏輯與 LocalStorage 資料層。
- 整合並規範 `backend/seeds.json` 與 `backend/species.json` 的讀取格式：食材欄位使用 `foods`，根物件包含 `banned_foods`；品種資料包含六種獨立 `species_id`。
- 依 `DESIGN.md` 使用 390px mobile-first 版面、指定核心色彩與六種品種色票。
- 不新增外部 API、登入系統或雲端資料庫。
