# Spec Delta

## Purpose

讓使用者能以指定鳥寶為對象，安全地取得一份可在日常備餐中使用的七日菜單，並在產生前後看懂限制、份量與營養狀態。

## ADDED Requirements

### Requirement: User can generate a seven-day menu for a selected bird
系統 SHALL 依指定鳥寶的種類、食性與已保存資料產生連續七天的菜單，並讓每一天都能辨識日期、餐次與食材。

#### Scenario: Valid bird generates a menu
- **WHEN** 使用者已選定資料完整的鳥寶並點選一鍵生成
- **THEN** 系統 SHALL 產生七天菜單，每天包含可辨識的餐次與食材，且結果綁定該鳥寶的 `bird_id`

#### Scenario: Generated menu is stored locally
- **WHEN** 七日菜單成功產生
- **THEN** App SHALL 將結果以該鳥寶為索引保存於本地，重新整理後仍能從該鳥寶查看，不得覆蓋其他鳥寶的菜單

### Requirement: Menu generation performs the AC4 safety preflight
系統 SHALL 在產生菜單前檢查指定鳥寶、必要食性資料與可用食材；任一條件不滿足時不得產生可執行菜單。

#### Scenario: No bird is selected
- **WHEN** 使用者未指定鳥寶就啟動生成
- **THEN** 系統 SHALL 攔截操作，提示先選擇鳥寶，且不建立菜單資料

#### Scenario: Bird data or food data is incomplete
- **WHEN** 指定鳥寶缺少種類／食性必要資料，或可用食材資料無法讀取
- **THEN** 系統 SHALL 顯示可理解的錯誤與下一步，且不顯示看似完整的七日菜單

### Requirement: Toxic foods are blocked by a global blacklist
菜單產生器 SHALL 對所有鳥種套用劇毒食材黑名單；黑名單食材不得出現在建議、替換結果或已保存菜單中。

#### Scenario: Candidate contains a toxic food
- **WHEN** 產生候選菜單或替換食材時命中劇毒黑名單
- **THEN** 系統 SHALL 移除該食材、改用符合食性的安全候選，並在無安全候選時攔截該餐次

#### Scenario: Saved menu contains a blocked food
- **WHEN** 使用者嘗試保存含黑名單食材的菜單
- **THEN** 系統 SHALL 拒絕保存並指出被攔截的食材

### Requirement: Diet rules are isolated per bird species
系統 SHALL 以目前鳥寶的鳥種與食性建立菜單規則邊界，不得把另一隻鳥寶的允許食材、禁忌或營養條件帶入目前菜單。

#### Scenario: User switches between different bird species
- **WHEN** 使用者先查看一隻鳥的菜單，再從另一鳥寶啟動生成
- **THEN** 系統 SHALL 重新套用新鳥寶規則，並排除只適用於前一鳥寶的食材與條件

#### Scenario: Nectar-eating bird is selected
- **WHEN** 指定鳥寶的食性為吸蜜鸚鵡
- **THEN** 系統 SHALL 套用限鐵規則，菜單與營養檢查不得使用未通過限鐵條件的食材或組合

### Requirement: Menu portions use practical kitchen units
菜單 SHALL 以「小塊」、「片」或「顆」等生活化單位表達食材份量，並在需要判斷大小時顯示 1 元硬幣比例尺提示。

#### Scenario: User reads a menu portion
- **WHEN** 使用者查看任一天的食材份量
- **THEN** App SHALL 顯示至少一個生活化切配單位，避免只顯示無法直接操作的抽象數值

#### Scenario: Portion needs a size reference
- **WHEN** 食材份量的大小會影響備餐判斷
- **THEN** App SHALL 在該份量附近顯示「以 1 元硬幣為比例尺」的圖像或文字提示

### Requirement: Menu shows the AC1 nutrition green light
系統 SHALL 在每日菜單與七日總覽顯示營養綠燈狀態，並說明通過、需留意或未通過的原因；綠燈是規則檢查結果，不得宣稱醫療診斷。

#### Scenario: Daily menu meets nutrition rules
- **WHEN** 某日菜單通過目前鳥種的營養規則檢查
- **THEN** App SHALL 顯示綠燈與簡短通過說明，且可辨識其對應日期

#### Scenario: Nutrition rule is not met
- **WHEN** 某日菜單未達成營養規則或資料不足以判斷
- **THEN** App SHALL 顯示非綠燈狀態、可理解的原因與建議修正方向，不得把該日標示為安全通過

### Requirement: Menu screens present the approved seven-day structure
菜單畫面 SHALL 依 `DESIGN.md` 第 8 節呈現使用中菜單、其他已存菜單與建立入口；建立流程 SHALL 明確呈現指定鳥寶、七日日期列、單日食材替換與儲存／取消操作。

#### Scenario: User reviews stored menus
- **WHEN** 使用者進入菜單清單
- **THEN** App SHALL 先顯示使用中菜單及其鳥寶、食材與營養摘要，再顯示其他已存菜單及建立入口，且使用中狀態清楚可辨

#### Scenario: User adjusts one day's menu
- **WHEN** 使用者選定鳥寶並切換至某一天調整食材
- **THEN** App SHALL 標示目前日期及五個等量替換選項中的單一選取項，並在儲存前維持既有安全檢查
