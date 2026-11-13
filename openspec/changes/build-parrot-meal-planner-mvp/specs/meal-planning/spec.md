# Spec Delta

## Purpose

讓使用者在指定鳥寶後取得受安全規則約束的週一至週日菜單，並可在草稿中有限度調整、儲存與管理歷史版本。

## ADDED Requirements

### Requirement: Menu generation requires a target bird
系統 SHALL 在生成前要求使用者選擇鳥寶名稱，並以對應的 `target_bird_id` 作為菜單資料隔離依據；未指定時不得生成。

#### Scenario: User generates for a selected bird
- **WHEN** 使用者選擇鳥寶名稱並按下生成
- **THEN** 系統只依該 `target_bird_id` 的品種、體重與規則生成菜單

#### Scenario: User generates without selection
- **WHEN** 使用者尚未選擇鳥寶而嘗試生成
- **THEN** 系統攔截操作並要求先選擇鳥寶

### Requirement: Generate a Monday-to-Sunday menu
系統 SHALL 生成當週週一至週日完整菜單；即使在週中生成，也不得改成從當天起算七天，當日只作醒目標示。

#### Scenario: Menu is generated midweek
- **WHEN** 使用者在週三生成菜單
- **THEN** 菜單仍顯示本週週一至週日

### Requirement: Calculate portions from bird weight and species ratios
系統 SHALL 以 `體重 × daily_intake_ratio` 計算每日總食物重量，再依 `macro_ratios` 分配；滋養丸與穀物／種子以克顯示，生鮮食材以 `grams_per_unit` 轉為標準單位並四捨五入，最低顯示 1 個單位。

#### Scenario: Small bird portion is below one unit
- **WHEN** 生鮮食材計算量低於一個顯示單位
- **THEN** 系統顯示至少 1 個標準單位

### Requirement: Fresh food unit labels are normalized
系統 SHALL 將生鮮食材顯示單位正規化為「小塊」、「片」或「顆」；小朵、小段、半顆與小匙暫轉為小塊，並附帶 `unit_scale_hint`。

#### Scenario: Fresh food is displayed
- **WHEN** 菜單包含生鮮食材
- **THEN** 顯示食材名稱、標準單位、換算後數量與品種對應的 `unit_scale_hint`

### Requirement: Rotate foods within safety and frequency rules
重新生成時，系統 SHALL 依 `max_weekly_freq`、品種 `banned_categories`、全域 `banned_foods` 與安全食材池重新輪替；若候選不足， SHALL 減少食材種類但維持該類別營養比例。

#### Scenario: Candidate pool is limited
- **WHEN** 分類中符合規則的食材不足
- **THEN** 系統減少該類別食材種類並完成生成，不突破安全或頻率規則

### Requirement: Mix at most two foods per fresh category per day
同一日同一生鮮類別 SHALL 最多混搭 2 種食材；混搭時類別目標克數 SHALL 平均分配，再各自依 `grams_per_unit` 四捨五入。

#### Scenario: Category has two foods
- **WHEN** 系統為同一類別安排兩種生鮮食材
- **THEN** 兩種食材各分配該類別 50% 目標克數並顯示整數單位

### Requirement: Smart Swap is constrained to the same nutrition role
Smart Swap SHALL 只提供與原食材相同 `category`、相同營養用途、未觸發品種禁用分類與全域禁用清單、且未超過 `max_weekly_freq` 的候選；替換只影響當天，並維持該週該類別目標克數。

#### Scenario: User swaps one day’s food
- **WHEN** 使用者在草稿中選擇替換食材
- **THEN** 系統只更新當天該筆食材，依新 `grams_per_unit` 重算單位並維持目標克數

### Requirement: Drafts are isolated and recoverable
每隻鳥寶 SHALL 各自保留一份草稿；草稿離開頁面或重新整理後 SHALL 可從 LocalStorage 恢復，切換鳥寶不得覆蓋其他鳥寶草稿。

#### Scenario: User returns to a draft
- **WHEN** 使用者離開後重新開啟同一鳥寶的菜單編輯
- **THEN** 系統恢復該鳥寶原有草稿

### Requirement: Save and apply menu history
系統 SHALL 保留建立的新菜單歷史版本；每隻鳥寶只能有一份使用中菜單。套用歷史菜單時，舊使用中標記 SHALL 移除但版本仍保留。編輯既有版本 SHALL 覆蓋該版本，並顯示修改日。

#### Scenario: User applies a historical menu
- **WHEN** 使用者點擊「套用此菜單」
- **THEN** 該版本標記為使用中、首頁更新，且同一鳥寶其他版本不再標記使用中

### Requirement: Editing actions depend on active status
非使用中菜單編輯後 SHALL 提供「套用此菜單／儲存」；使用中菜單編輯後 SHALL 提供「更新／返回」，更新後立即同步首頁、採買清單與備餐步驟。

#### Scenario: Active menu is updated
- **WHEN** 使用者編輯使用中菜單並按下「更新」
- **THEN** 修改立即生效並同步所有相關畫面
