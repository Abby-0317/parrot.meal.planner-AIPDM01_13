# Spec Delta

## Purpose

提供鸚鵡飲食規劃 App 可啟動、可導覽且可恢復的最小產品骨架，讓後續功能能共用一致的本地資料入口與空資料狀態。

## ADDED Requirements

### Requirement: App provides a mobile-first home shell
系統 SHALL 提供以 390px 手機寬度為基準的首頁骨架，並保留後續首頁、菜單與鳥寶檔案入口的導覽位置。

#### Scenario: First visit opens the home shell
- **WHEN** 使用者首次開啟 App
- **THEN** 系統顯示首頁骨架，且不要求登入或外部帳號

#### Scenario: Narrow viewport remains usable
- **WHEN** 使用者以 390px 或更窄的瀏覽器視窗開啟首頁
- **THEN** 內容不產生水平溢出，主要操作仍可在畫面內完成

### Requirement: App persists the MVP local data envelope
系統 SHALL 以版本化的本地資料容器保存鳥寶資料與應用程式狀態，且讀取失敗時 SHALL 回到安全的空資料狀態。

#### Scenario: Stored bird data is restored
- **WHEN** 使用者完成鳥寶建檔後重新整理頁面
- **THEN** 系統恢復該鳥寶資料，不要求重新輸入

#### Scenario: Invalid local data is isolated
- **WHEN** 本地資料不存在、版本不相容或內容無法解析
- **THEN** 系統清除本次讀取結果並顯示空資料狀態，不阻塞首頁載入

### Requirement: Empty state guides the next action
當系統沒有任何鳥寶資料時，首頁 SHALL 明確告知使用者先建立鳥寶，並提供進入建檔流程的操作。

#### Scenario: No bird profile exists
- **WHEN** 使用者開啟沒有鳥寶資料的首頁
- **THEN** 系統顯示清楚說明「先建立鳥寶，才能產生專屬飲食建議」、唯一主要操作按鈕「建立第一隻鳥寶」，以及可辨識的空飯碗圖示或插圖；點擊主要按鈕後直接進入建檔表單，且不顯示需要指定鳥寶才能使用的菜單操作

#### Scenario: Empty-state action is reachable by keyboard or touch
- **WHEN** 使用者以鍵盤或手機觸控操作首頁空狀態
- **THEN** 「建立第一隻鳥寶」按鈕具備至少 44px 觸控尺寸、可見焦點狀態與可理解的可及名稱，且不需點擊插圖或小圖示才能進入建檔

### Requirement: App shell preserves a predictable return path
首頁與建檔表單 SHALL 共用一致的 App shell；未保存的建檔流程必須有明確返回首頁的動線，且不得把返回誤當成送出。

#### Scenario: User returns from an unsaved profile
- **WHEN** 使用者在建檔表單點擊「返回」且尚未送出
- **THEN** 系統回到首頁空狀態，不建立或修改鳥寶資料；若已有輸入內容，先顯示可取消的離開確認
