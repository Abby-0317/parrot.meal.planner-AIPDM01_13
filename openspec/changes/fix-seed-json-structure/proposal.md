# Proposal

## Why

`backend/seeds.json` 目前不是有效的 JSON：多筆食材資料沒有共同的根結構，食材物件之間也缺少逗號，因此解析器無法載入。另有第一筆糙米資料缺少 `food_id`，可能造成後續辨識不一致。

## What Changes

- 將食材資料整理為 `foods` 陣列，並與 `banned_foods` 一起放在單一根物件中。
- 為糙米資料補上唯一的 `food_id`。
- 保留現有食材內容與禁用食材清單，不新增應用程式功能。

## Capabilities

### New Capabilities

無。

### Modified Capabilities

無。本次只修正靜態種子資料檔案，沒有改變系統行為需求。

## Impact

- 影響 `backend/seeds.json` 的資料格式與完整性。
- 專案目前未找到讀取此檔案的程式碼，因此採用根物件包含 `foods` 與 `banned_foods` 的結構；本次不涉及 API、依賴套件或應用程式邏輯。
