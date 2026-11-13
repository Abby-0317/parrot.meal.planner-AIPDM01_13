# Spec Delta

## Purpose

讓使用者建立可被菜單流程唯一辨識的鳥寶資料，並以固定品種規則支援單鳥完整使用與多鳥資料隔離。

## ADDED Requirements

### Requirement: User can create a supported bird profile
系統 SHALL 讓使用者建立鳥寶名稱、六種支援品種、體重與選填生日；飲食群組 SHALL 由品種資料自動帶入，且不得讓使用者手動選擇。

#### Scenario: First launch creates the first bird
- **WHEN** 使用者開啟 App 且沒有任何鳥寶資料
- **THEN** 系統直接顯示建立第一隻鳥寶流程

#### Scenario: Unsupported species is unavailable
- **WHEN** 使用者建立鳥寶
- **THEN** 品種選項只包含玄鳳、虎皮、愛情鳥、牡丹、太平洋與凱克

### Requirement: Profile validation protects required data
系統 SHALL 要求名稱與品種，體重 SHALL 大於 0 且允許小數點後 1 位；生日可留白，但不得輸入未來日期。

#### Scenario: Invalid weight is rejected
- **WHEN** 使用者輸入 0 或負數體重並儲存
- **THEN** 系統拒絕儲存並提示體重必須大於 0

#### Scenario: Future birthday is rejected
- **WHEN** 使用者輸入未來日期並儲存
- **THEN** 系統拒絕儲存並顯示日期錯誤提示

### Requirement: Duplicate names require confirmation
系統 SHALL 在名稱與既有鳥寶重複時顯示「是否命名為相同名稱」警示；使用者確認後 SHALL 允許建立，取消則不得建立。

#### Scenario: User confirms duplicate name
- **WHEN** 使用者輸入既有鳥寶名稱並確認警示
- **THEN** 系統建立新的獨立 `bird_id`

### Requirement: Bird identity remains stable after creation
建立鳥寶後，品種 SHALL 不得修改；所有菜單與草稿 SHALL 以 `bird_id` 隔離，畫面可用鳥寶名稱、品種小字與品種色票辨識同名鳥寶。

#### Scenario: Same names remain distinguishable
- **WHEN** 多隻鳥寶使用相同名稱
- **THEN** 選鳥與菜單畫面仍以各自 `bird_id` 區分，並顯示品種色票與品種小字

### Requirement: Weight changes rescale all menus after confirmation
使用者儲存體重變更前，系統 SHALL 顯示會同步更新所有菜單的警示；確認後，該鳥寶的草稿、使用中菜單與所有歷史菜單 SHALL 依新體重重新計算份量。

#### Scenario: Weight update is confirmed
- **WHEN** 使用者確認體重同步警示
- **THEN** 該鳥寶所有菜單與草稿的份量依新體重更新

### Requirement: Profile data persists locally
鳥寶資料 SHALL 儲存在瀏覽器 LocalStorage，重新整理或重新開啟 App 後仍可讀取。

#### Scenario: Reload restores profiles
- **WHEN** 使用者重新整理 App
- **THEN** 已建立的鳥寶資料仍可被選取
