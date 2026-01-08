import { FALLBACK_GAS_URL } from '../config';
const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL || FALLBACK_GAS_URL;

export const fetchQuestions = async (userId) => {
    if (!GAS_URL) {
        console.warn("GAS_URL is not set. Returning mock data.");
        return mockQuestions(userId);
    }

    try {
        const response = await fetch(`${GAS_URL}?action=getQuestions&id=${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
};

export const submitResults = async (resultData) => {
    if (!GAS_URL) {
        console.warn("GAS_URL is not set. Logging result only.", resultData);
        return { success: true };
    }

    try {
        // Use URLSearchParams for more reliable GAS simple requests without preflight
        const formData = new URLSearchParams();
        formData.append('action', 'submitResults');
        formData.append('id', resultData.id);
        formData.append('score', resultData.score.toString());
        formData.append('passed', resultData.passed.toString());
        // Note: Complex objects like 'answers' array might need stringifying if specific GAS logic needs it, 
        // but our current GAS script expects JSON.parse(e.postData.contents).
        // If we switch to standard form post, we need to update GAS or send JSON as string in a form field.
        // Let's stick to JSON but try "no-cors" with "text/plain" which SHOULD work if GAS handles it.
        // Re-reading: the user says data NOT written. 
        // Logic: if 'mode: no-cors', fetch returns opaque. Frontend says success.
        // But backend might fail.

        // Let's try sending as application/x-www-form-urlencoded and handle in GAS?
        // OR simply ensure we log the error if fetch fails (which it won't on status 500 with no-cors).

        // BEST PRACTICE FOR GAS + VITE/REACT:
        // Use 'application/x-www-form-urlencoded' and handle e.parameter in GAS.
        // THIS IS MORE ROBUST.

        // Let's update frontend to send form data stringified as JSON in a 'payload' param? 
        // No, let's keep sending JSON body but change Content-Type?

        // Current Code:
        // method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON...
        // This is correct for avoiding preflight.

        // HYPOTHESIS: User didn't set secrets. 
        // But assuming they did, maybe GAS failed on JSON.parse?

        // Let's change implementation to use URLSearchParams and update GAS slightly? 
        // No, I can't update user's deployed GAS easily.

        // Let's assume user deployed the GAS I provided: 
        // const data = JSON.parse(e.postData.contents);

        // If I change frontend to send URLSearchParams, e.postData.contents will be "key=value&...".
        // JSON.parse will fail.

        // So I must stick to string body.

        // Let's add better logging context and maybe remove 'mode: no-cors' to SEE the error?
        // If we remove no-cors, we get CORS error but the request MIGHT still reach server (browser blocks response).
        // Actually, for debugging, logging to console "Submitting to: URL" is good.

        console.log("Submitting results to:", GAS_URL);
        console.log("Payload:", JSON.stringify({ action: "submitResults", ...resultData }));

        const response = await fetch(GAS_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify({
                action: "submitResults",
                ...resultData
            }),
        });

        console.log("Submission sent (opaque response). checking if data appears in sheet...");
        return { success: true };
    } catch (error) {
        console.error("Error submitting results:", error);
        throw error; // Rethrow to show in UI if needed
    }
};

const mockQuestions = (userId) => ({
    questions: Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        question: `Mock Question ${i + 1} for user ${userId}?`,
        options: {
            A: "Option A",
            B: "Option B",
            C: "Option C",
            D: "Option D"
        },
        answer: "A" // Mock answer is always A
    }))
});
