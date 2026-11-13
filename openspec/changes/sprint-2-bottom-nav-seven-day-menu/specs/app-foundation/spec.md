# Spec Delta

## ADDED Requirements

### Requirement: App provides four persistent bottom navigation tabs
App SHALL 在主要畫面提供固定於底部的四分頁導覽，分頁名稱依序為「首頁」、「鸚鵡檔案」、「照顧紀錄」與「鳥聚點」，並清楚標示目前所在分頁。

#### Scenario: User switches between primary tabs
- **WHEN** 使用者點選任一底部導覽分頁
- **THEN** App SHALL 切換到對應頁面、保留目前可保存的本地資料，並更新目前分頁的選取狀態

#### Scenario: Bottom navigation is usable on a phone
- **WHEN** App 在 390px 寬的手機檢視模式開啟
- **THEN** 四個導覽項目 SHALL 不重疊、不被內容遮住，且每個可操作區域至少為 44px

### Requirement: Care records and bird spots expose intentional empty states
「照顧紀錄」與「鳥聚點」在功能尚未開放時 SHALL 顯示簡約、可理解的空狀態，不得顯示空白頁或假造資料。

#### Scenario: User opens care records before the feature is available
- **WHEN** 使用者進入「照顧紀錄」分頁且沒有可呈現的紀錄功能
- **THEN** App SHALL 顯示符合 `DESIGN.md` 的空狀態標題、簡短說明與不可誤解為已完成的狀態訊息

#### Scenario: User opens bird spots before the feature is available
- **WHEN** 使用者進入「鳥聚點」分頁且沒有可呈現的聚點資料
- **THEN** App SHALL 顯示符合 `DESIGN.md` 的空狀態標題與簡短說明，並維持底部導覽可用

### Requirement: Navigation keeps a predictable return path
切換分頁或從分頁內的次要畫面返回時，App SHALL 回到對應分頁的可理解入口，不得因重新整理而遺失目前的本地鳥寶資料。

#### Scenario: User returns from a secondary screen
- **WHEN** 使用者從鳥寶檔案或菜單畫面返回
- **THEN** App SHALL 回到正確的父層分頁，並保留已儲存的鳥寶與菜單狀態

### Requirement: Shared shell follows the approved Stitch component layout
App SHALL 依 `DESIGN.md` 第 3、8 節呈現 390px 單欄版面、共用頁首與固定四分頁導覽，並使用 Stitch 目前主畫面的背景、主色、強調色與元件尺寸；菜單匯出稿的較早色值不得覆蓋共用色彩。

#### Scenario: Primary screen is viewed at phone width
- **WHEN** 使用者在 390×844px 手機視窗查看任一主要分頁
- **THEN** App SHALL 保留約 20px 內容邊距、頁首與底部安全空間，且可點元件至少有 44×44px 操作區域，不被固定導覽遮住

#### Scenario: Stitch screen contains sample content or alternate colors
- **WHEN** 開發者依 Stitch 畫面建立頁面
- **THEN** App SHALL 以 `DESIGN.md` 指定的 `#F4F1EA`、`#384D35`、`#B86A48` 和真實資料／空狀態呈現，不得把示範鳥寶、天氣或健康數值當成使用者資料
