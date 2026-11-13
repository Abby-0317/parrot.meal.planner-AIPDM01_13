# Design

## Context

目前專案沒有前端應用程式碼，只有 `PRD.md`、`DESIGN.md`、`backend/species.json` 與 `backend/seeds.json`。本設計以 390px mobile-first 介面為基準，遵循 `DESIGN.md` 的色彩、圓角、觸控尺寸與六種品種色票；使用者資料只保存在瀏覽器 LocalStorage。

## Goals / Non-Goals

**Goals:**

- 建立可恢復的 Empty、Select Bird、Draft、Saved 狀態流程。
- 以 `bird_id` 與 `target_bird_id` 隔離每隻鳥的草稿、菜單與份量。
- 將種子資料正規化為根物件中的 `foods`、`food_categories`、`banned_foods`，並由 `species.json` 提供品種規則。
- 讓菜單計算可測試、可重算，且所有生鮮顯示都能追溯到克數與標準單位。
- 讓首頁、菜單列表、採買清單、備餐、照顧紀錄與鳥聚點共享同一份本地狀態。

**Non-Goals:**

- 不串接天氣、地圖、定位、登入、雲端同步或外部店家資料。
- 不提供未列出的鸚鵡品種、處方飲食、自由輸入食材或刪除鳥寶。
- 不把滋養丸與穀物／種子納入採買清單與備餐步驟。

## Decisions

### 1. 唯讀種子資料與標準化載入

使用啟動時載入的 `species.json` 與 `seeds.json` 作為唯一基礎資料來源。`seeds.json` 根物件固定包含 `food_categories`、`foods` 與 `banned_foods`；載入時建立以 `food_id`、`category` 與 `species_id` 查詢的索引。這比把食材規則散落在元件中更容易驗證，也能避免 Smart Swap 繞過安全規則。

### 2. 以鳥寶為根的本地資料模型

LocalStorage 使用版本化根物件保存 `birds`、`draftMenusByBirdId`、`menuHistoryByBirdId`、`activeMenuIdByBirdId` 與 `careRecords`。每筆菜單都保存 `bird_id`、週期週一日期、每日食材明細、狀態與 `modifiedAt`；照顧紀錄不保存 `bird_id`。備餐勾選只放在目前畫面狀態，不寫入 LocalStorage。

### 3. 純函式菜單計算流程

菜單計算拆成可獨立測試的步驟：驗證 `target_bird_id` → 讀取鳥寶與品種規則 → 計算每日總克數 → 依 macro ratios 分配 → 依週頻率與禁用規則選材 → 每類別最多兩種平均分配 → 以 `grams_per_unit` 換算並四捨五入 → 產生七日草稿。重新生成使用新的輪替結果，不依賴畫面元件狀態。

### 4. 安全規則集中在候選池

所有生成與 Smart Swap 都先建立安全候選池：排除 `banned_foods`、品種 `banned_categories`、超過 `max_weekly_freq` 的食材，再套用相同 `category` 與營養用途篩選。沒有足夠候選時只減少種類，不放寬安全條件。

### 5. 以狀態驅動畫面，而非複製菜單資料

首頁只渲染每個 `bird_id` 的使用中菜單；菜單列表渲染該鳥的歷史版本。編輯、套用、更新都透過狀態轉換完成，避免在首頁、菜單列表與採買清單各自保存一份可互相矛盾的資料。

### 6. 計算結果與顯示單位分離

內部保留克數與原始食材資料，顯示層依食材類型決定格式：生鮮使用正規化後的「小塊／片／顆」及 `unit_scale_hint`；滋養丸與穀物／種子只顯示克數。採買清單依每日已四捨五入的實際單位重新加總，避免畫面與清單不一致。

### 7. 頁面組成與導覽

以首頁、菜單、鳥寶檔案、每日照顧紀錄、鳥聚點五個入口組成簡單導覽。首頁在無鳥寶時直接導向建檔；有鳥寶但無使用中菜單時隱藏採買與備餐區塊。所有互動控件至少 44px 高，沿用 `DESIGN.md` 的暖米白背景、深森林綠主色、焦糖橘提醒色與白色卡片。

## Risks / Trade-offs

- [Risk] `seeds.json` 的安全資料若格式不一致，生成可能失敗 → 啟動時做 schema 驗證，缺少 `foods` 或 `banned_foods` 時顯示資料錯誤，不進入生成流程。
- [Risk] 四捨五入後小型鸚鵡的實際份量可能略高於理論克數 → 將理論克數、顯示單位與 `unit_scale_hint` 分開保存，並在介面以約略份量呈現。
- [Risk] 體重同步會改變歷史菜單的顯示結果 → 儲存體重前使用者必須確認警示，並對該鳥寶所有版本執行同一套可重算流程。
- [Risk] 目前沒有外部天氣資料 → 使用固定範圍的本地假資料，並把天氣來源封裝成可替換介面。
- [Risk] 照顧紀錄是家庭共用，可能不適合需要逐鳥追蹤的使用者 → MVP 明確不綁定鳥寶，未來若要逐鳥追蹤需另開規格變更。
