# Spec Delta

## Purpose

在首頁提供飼主能快速理解的環境狀態提示，並持續顯示健康使用邊界，避免把日常鮮食建議誤解為獸醫診療指示。

## ADDED Requirements

### Requirement: Home shows temperature and humidity card
首頁 SHALL 顯示目前氣溫、濕度、資料時間與一段依環境狀態產生的鸚鵡日常照護小語。

#### Scenario: Normal environment is shown
- **WHEN** 本地環境資料為一般舒適範圍
- **THEN** 系統顯示氣溫與濕度數值，並顯示一般照護提示，不使用警示色誤導使用者

#### Scenario: Temperature or humidity needs attention
- **WHEN** 氣溫偏低、偏高或濕度偏高
- **THEN** 系統在小卡上顯示對應的注意提示，並使用 `#A55704` 作為重點提醒色

### Requirement: Health card uses safe local data source
Sprint 1 的首頁健康小卡 SHALL 使用可替換的本地環境資料來源，不得要求天氣 API、定位權限或登入才能顯示。

#### Scenario: External weather service is unavailable
- **WHEN** App 沒有網路或未設定外部天氣服務
- **THEN** 系統仍以本地假資料顯示小卡，並不顯示錯誤頁或要求使用者授權定位

### Requirement: Home displays fixed health disclaimer
首頁 SHALL 在主要內容底部固定顯示「僅供健康日常鮮食參考，病鳥請遵照獸醫指示」。

#### Scenario: Disclaimer is visible on home
- **WHEN** 使用者瀏覽首頁且頁面有鳥寶或空狀態
- **THEN** 使用者可以在首頁底部看到完整免責文字，文字不可被首頁狀態隱藏
