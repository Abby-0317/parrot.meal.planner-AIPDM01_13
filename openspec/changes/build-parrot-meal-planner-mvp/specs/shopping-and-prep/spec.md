# Spec Delta

## Purpose

將所有使用中菜單中的生鮮食材轉成可執行的一週採買清單與週日備餐順序，讓使用者能直接依實際顯示份量準備食材。

## ADDED Requirements

### Requirement: Aggregate active fresh foods only
採買清單 SHALL 加總所有鳥寶使用中菜單的生鮮食材；草稿、非使用中歷史菜單、滋養丸與穀物／種子 SHALL 不納入。

#### Scenario: Multiple active menus are present
- **WHEN** 多隻鳥寶各有一份使用中菜單
- **THEN** 清單依食材合併計算所有生鮮食材份量

#### Scenario: No active menu exists
- **WHEN** 使用者尚未有任何使用中菜單
- **THEN** 首頁隱藏採買清單與備餐步驟區塊

### Requirement: Show weight and estimated units
每項採買食材 SHALL 顯示食材名稱、依每日菜單四捨五入後單位換算的總重量與預估單位數。

#### Scenario: Food appears on the shopping list
- **WHEN** 生鮮食材出現在使用中菜單
- **THEN** 清單顯示該食材的總重量與預估單位數

### Requirement: Create an ephemeral Sunday prep checklist
系統 SHALL 依準備順序顯示可勾選的週日 30 分鐘備餐步驟，例如清洗、蒸煮、切配與分裝；步驟勾選狀態不得寫入 LocalStorage。

#### Scenario: User checks a prep step
- **WHEN** 使用者在目前頁面勾選備餐步驟
- **THEN** 該步驟在目前畫面標示完成，但重新整理或離開後重設
