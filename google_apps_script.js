function doGet(e) {
    const action = e.parameter.action;

    if (action === 'getQuestions') {
        return getQuestions(e.parameter.id);
    }

    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
    // Handle POST requests for submitting results
    // data is expected in the post body

    try {
        const data = JSON.parse(e.postData.contents);
        if (data.action === 'submitResults') {
            return submitResults(data);
        }
        return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
    }
}

function getQuestions(userId) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const qSheet = ss.getSheetByName("題目"); // "Questions" sheet

    // Assumes headers are in row 1: ID, Question, A, B, C, D, Answer
    // Data starts row 2.
    const data = qSheet.getDataRange().getValues();
    const headers = data.shift(); // remove header

    // Randomly select N questions
    const N = 5; // Or pass via param
    const selected = [];
    const indices = [];

    while (selected.length < N && selected.length < data.length) {
        const idx = Math.floor(Math.random() * data.length);
        if (indices.includes(idx)) continue;
        indices.push(idx);

        const row = data[idx];
        selected.push({
            id: row[0], // Assuming col 0 is ID
            question: row[1],
            options: {
                A: row[2],
                B: row[3],
                C: row[4],
                D: row[5]
            },
            answer: row[6] // Correct answer
        });
    }

    // Return JSON
    return ContentService.createTextOutput(JSON.stringify({
        questions: selected
    })).setMimeType(ContentService.MimeType.JSON);
}

function submitResults(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const aSheet = ss.getSheetByName("回答"); // "Answers" sheet

    // Headers: ID, Play Count, Total Score, Max Score, First Pass Score, Attempts to Pass, Last Played
    // Check if user exists
    const existingData = aSheet.getDataRange().getValues();
    let rowIndex = -1;

    for (let i = 1; i < existingData.length; i++) {
        if (existingData[i][0] == data.id) {
            rowIndex = i + 1; // 1-based index
            break;
        }
    }

    const timestamp = new Date();

    if (rowIndex > 0) {
        // Update existing
        // ID(0), Count(1), Total(2), Max(3), FirstPass(4), AttemptsToPass(5), LastPlayed(6)
        const currentRow = existingData[rowIndex - 1];
        let count = currentRow[1] + 1;
        let totalScore = currentRow[2] + data.score;
        let maxScore = Math.max(currentRow[3], data.score);
        let firstPassScore = currentRow[4];
        let attemptsToPass = currentRow[5];

        // Logic for First Pass: if currently passed and never passed before
        // If firstPassScore is empty/null, it means not passed yet (or we can use attemptsToPass logic)
        const alreadyPassed = firstPassScore !== "" && firstPassScore !== null;

        if (data.passed && !alreadyPassed) {
            firstPassScore = data.score;
            attemptsToPass = count;
        }

        // Update row
        aSheet.getRange(rowIndex, 2, 1, 6).setValues([[
            count, totalScore, maxScore, firstPassScore, attemptsToPass, timestamp
        ]]);

    } else {
        // New User
        let firstPassScore = data.passed ? data.score : "";
        let attemptsToPass = data.passed ? 1 : "";

        aSheet.appendRow([
            data.id,
            1, // Count
            data.score, // Total
            data.score, // Max
            firstPassScore,
            attemptsToPass,
            timestamp
        ]);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
}
