# Spec Delta

## ADDED Requirements

### Requirement: Bird profile list is owned by the parrot profiles tab
App SHALL 將鳥寶建檔列表、新增鳥寶入口與既有鳥寶摘要集中在「鸚鵡檔案」分頁，其他分頁不得再各自維護另一份鳥寶列表。

#### Scenario: User opens parrot profiles
- **WHEN** 使用者點選「鸚鵡檔案」分頁
- **THEN** App SHALL 顯示所有已儲存鳥寶、每隻鳥寶的基本辨識資訊，以及新增鳥寶的入口

#### Scenario: User has no bird profile
- **WHEN** 使用者進入「鸚鵡檔案」且本地沒有鳥寶資料
- **THEN** App SHALL 顯示引導建立第一隻鳥寶的空狀態，且操作後仍停留在鸚鵡檔案流程

### Requirement: A selected bird can start a seven-day menu
鳥寶檔案 SHALL 提供針對單一指定鳥寶的一鍵生成七日菜單入口，並在送出前明確顯示目前選取的鳥寶。

#### Scenario: User starts menu generation for one bird
- **WHEN** 使用者在某隻鳥寶的檔案卡片點選七日菜單入口
- **THEN** App SHALL 將該鳥寶的 `bird_id` 帶入菜單流程，且不得以其他鳥寶或上一次選取的鳥寶代替

#### Scenario: User has multiple birds
- **WHEN** 使用者擁有兩隻以上鳥寶並從其中一隻啟動菜單
- **THEN** 產生流程 SHALL 只顯示並套用被點選鳥寶的種類、食性與營養條件

### Requirement: Bird profile screens use real profile fields in the Stitch layout
鳥寶建檔與檔案畫面 SHALL 依 `DESIGN.md` 第 8 節的介紹區、單張表單卡及鳥寶摘要／編輯卡結構呈現；欄位與數值 SHALL 取自目前支援的本地資料模型。

#### Scenario: User creates or edits a bird profile
- **WHEN** 使用者開啟建檔或編輯畫面
- **THEN** App SHALL 提供名稱、品種、體重及目前支援的生日欄位與儲存／取消操作，不得把 Stitch 範例中的性別、腳環、晶片或示範體重顯示為已保存資料
