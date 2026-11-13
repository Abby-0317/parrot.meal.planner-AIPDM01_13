---
name: parrot-test-loop
description: 執行鸚鵡 App 的自動化端到端測試、Playwright 手機版截圖與自動修復迴圈（Test Loop）。當使用者要求執行自動測試、畫面截圖驗收或呼叫 test loop 時使用。

---

# 鸚鵡 App 自動化測試與修復迴圈 (Parrot Test Loop)

當此技能被觸發時，請主代理（Main Thread）嚴格協調 `qa-inspector` 與 `builder` 兩個 Subagent 執行以下閉環流程，直到所有測試通過為止（最多重複 3 輪避免無窮迴圈）：

## 執行步驟

1. **派發自動測試與截圖（呼叫 `qa-inspector`）**
   - 指示 `qa-inspector` subagent 讀取專案中的 `e2e-testing.md` 與最新的 OpenSpec 規格。
   - 使用 Playwright MCP 以手機版視窗（390x844）開啟本地應用程式並執行測試劇本。
   - 將所有測試截圖儲存至 `./test-screenshots/` 資料夾，並檢視截圖是否符合 `AGENTS.md` 的視覺規範（背景 `#F8EADC`、主色 `#09251C`、警示色 `#A55704`）。

2. **評估結果與自動修復（若失敗則呼叫 `builder`）**
   - 如果 `qa-inspector` 回報任何功能異常、報錯、或截圖出現畫面破版／配色錯誤：
     - 立即將錯誤細節與截圖問題交辦給 `builder` subagent 進行程式碼修復。
     - 修復完成後，再次回到**步驟 1**，派 `qa-inspector` 重新測試並覆蓋更新截圖。

3. **產出白話文驗收總結**
   - 當所有測試項目均通過、截圖確認無誤後，用繁體中文與白話文向產品經理（使用者）報告：
     - 本次測試通過的功能清單。
     - 截圖檔案存放路徑（提醒使用者可直接點開查看）。
     - 詢問使用者是否要執行 Git Commit 存檔。