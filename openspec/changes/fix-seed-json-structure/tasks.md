# Tasks

## 1. 修正種子資料

- [x] 1.1 將 `backend/seeds.json` 整理為根物件，包含 `foods` 陣列及 `banned_foods` 清單，並為糙米補上 `food_id`；以 JSON 解析器確認檔案可成功讀取。
- [x] 1.2 確認 8 筆食材資料及 7 項禁用食材均保留，且每筆食材都有 `food_id`、`name_zh`、`category`、`prep_note`、`grams_per_unit`、`unit_label` 與 `max_weekly_freq` 欄位。
