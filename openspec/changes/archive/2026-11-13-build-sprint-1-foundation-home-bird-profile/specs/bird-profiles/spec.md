# Spec Delta

## Purpose

讓飼主用最少欄位建立可供後續菜單功能使用的鳥寶檔案，確保每隻鳥都有可辨識的身份、品種、體重與系統判定的飲食群組。

## ADDED Requirements

### Requirement: User can create a minimal bird profile
系統 SHALL 讓使用者輸入鳥寶名字、品種、體重（克）與飲食類型，完成後建立唯一的 `bird_id`。

#### Scenario: Valid profile is submitted
- **WHEN** 使用者填入有效名字、六種品種之一、正數體重與飲食類型並送出
- **THEN** 系統建立鳥寶檔案、產生唯一 `bird_id`，並將使用者帶回首頁

#### Scenario: Required profile value is missing
- **WHEN** 使用者缺少名字、品種、體重或飲食類型其中一項
- **THEN** 系統指出缺少的欄位，且不建立不完整檔案

### Requirement: Profile validates name and weight safely
系統 SHALL 阻擋空白或僅含空格的名字、空值、零值、負數、非數字、無限值與不合理格式的體重，並在欄位旁以白話文字說明修正方式。

體重欄位 SHALL 顯示克數單位，使用適合手機數字輸入的控制項（`inputmode="decimal"`；可使用 `type="number"`），允許有效的小數體重；送出前與送出時都必須再次驗證，不能只依賴瀏覽器原生限制。輸入值必須是有限且大於 0 的數字，空值、只含空白、`-1`、`0`、非數字字串與貼上的無效值都不得保存。

#### Scenario: Invalid name or weight is entered
- **WHEN** 使用者輸入空白名字、零值、負數或非數字體重
- **THEN** 系統顯示對應錯誤，且保留表單內容供修正，不保存檔案

#### Scenario: Weight input is empty or malformed
- **WHEN** 使用者讓體重欄位保持空白、只輸入空白、貼上非數字內容、輸入無限值或輸入 0 以下的數字
- **THEN** 系統在體重欄位附近顯示白話錯誤「請輸入大於 0 的體重，例如 85.5 克」，將欄位標示為錯誤並阻止送出；修正前保留其他欄位內容

#### Scenario: Invalid submission moves focus to the first error
- **WHEN** 使用者點擊送出但有一個以上欄位無效
- **THEN** 系統不保存資料，將焦點移到第一個錯誤欄位，錯誤文字與欄位關聯並可被讀屏工具讀取；使用者修正後重新送出不需重新填寫其他欄位

#### Scenario: Duplicate name is entered
- **WHEN** 已有同名鳥寶且使用者再次輸入相同名字
- **THEN** 系統提醒名稱重複並要求確認或修改，資料仍以不同 `bird_id` 區分

### Requirement: Species selection determines diet group
系統 SHALL 只提供 `DESIGN.md` 定義的六種品種，並依品種規則自動帶入飲食群組；使用者不得自由輸入未驗證品種或覆寫系統群組。

#### Scenario: Supported species is selected
- **WHEN** 使用者選擇玄鳳、虎皮、愛情鳥、牡丹、太平洋或凱克
- **THEN** 系統顯示對應品種色票，並帶入該品種的飲食群組

#### Scenario: Unsupported species value is submitted
- **WHEN** 表單送出的品種不在六種支援清單中
- **THEN** 系統拒絕送出並要求重新選擇支援的品種

### Requirement: Created profile remains available locally
完成建檔的鳥寶資料 SHALL 可在重新整理後恢復，並能在首頁被選取或辨識；Sprint 1 不提供雲端同步。

#### Scenario: Profile is restored after refresh
- **WHEN** 使用者完成建檔並重新整理 App
- **THEN** 系統仍顯示鳥寶名字、品種、體重與飲食群組

#### Scenario: Multiple profiles are created
- **WHEN** 使用者建立兩隻以上鳥寶
- **THEN** 系統分別顯示每隻鳥的名稱與品種色票，且任何一筆資料不會覆蓋另一筆

### Requirement: Profile form supports one-handed mobile completion
建檔表單 SHALL 以單欄、由上到下的順序呈現；返回與送出為清楚分離的操作，所有可點擊控制項與品種選項觸控尺寸至少 44px。

#### Scenario: User completes or cancels the form on a phone
- **WHEN** 使用者以 390px 寬度單手操作建檔表單
- **THEN** 欄位不需水平捲動，送出按鈕在表單末端清楚可見且至少 44px 高，返回操作位於表單頂端或固定安全區並同樣至少 44px；有效送出後只建立一筆資料並回到首頁，取消則回到首頁且不保存
