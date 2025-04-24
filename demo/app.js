document.addEventListener('DOMContentLoaded', (event) => {
    const codeEditorElement = document.getElementById('code-editor');
    const runButton = document.getElementById('run-button');
    const gameCanvasId = 'game-canvas';
    let currentGameInstance = null; // 保存當前遊戲實例

    // 初始化 CodeMirror
    const editor = CodeMirror.fromTextArea(codeEditorElement, {
        lineNumbers: true,
        mode: "javascript",
        theme: "mbo", // 使用 mbo 主題，與 docs/index.html 保持一致
        // 可以添加更多 CodeMirror 配置
    });

    // 從 snake.js 加載初始代碼到編輯器
    fetch('snake.js')
        .then(response => response.text())
        .then(code => {
            editor.setValue(code);
        })
        .catch(err => {
            console.error('無法加載 snake.js:', err);
            // 使用反引號定義多行字符串，確保換行正確
            editor.setValue(`// 無法加載 snake.js\nfunction runSnakeGame(Game) {\n    // 請在此處編寫你的代碼\n}`);
        });


    // 執行按鈕點擊事件
    runButton.addEventListener('click', () => {
        const userCode = editor.getValue();

        // 停止上一個遊戲實例（如果存在）
        if (currentGameInstance && typeof currentGameInstance.stop === 'function') {
            try {
                currentGameInstance.stop();
            } catch (e) {
                console.error("停止舊遊戲實例時出錯:", e);
            }
        }
        currentGameInstance = null; // 清除引用

        // 清除舊的 Canvas 內容 (如果引擎沒有提供 Game.clear())
        // 這一步可能需要根據 EngineJS 的具體行為調整
        const canvas = document.getElementById(gameCanvasId);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
               ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        } else {
            console.error(`找不到 ID 為 "${gameCanvasId}" 的 canvas 元素`);
            return; // 如果找不到 canvas，則不繼續執行
        }


        try {
            if (typeof Engine === 'undefined') {
                alert("錯誤：找不到 Engine 函數。請確保 engine.js 或 engine-min.js 已正確加載。");
                return;
            }
            const runGameFunction = new Function(userCode);
            runGameFunction();
            console.log("代碼已執行");
            canvas.focus();

        } catch (error) {
            console.error("執行代碼時出錯:", error);
            alert("代碼執行錯誤: \n" + error.message);
        }
    });

    // 頁面加載時自動執行一次 (可選)
    // fetch('snake.js').then(response => response.text()).then(() => runButton.click());

}); 