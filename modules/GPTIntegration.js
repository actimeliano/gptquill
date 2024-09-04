export class GPTIntegration {
    constructor() {
        this.sessionId = Date.now().toString();
    }

    async editWithGPT(text, prompt, range) {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are a helpful assistant that edits text based on user instructions." },
                    { role: "user", content: `Edit the following text based on this instruction: ${prompt}\n\nText: ${text}` }
                ],
                session_id: this.sessionId,
                original_text: text,
                user_prompt: prompt
            }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data.text;
    }

    async approveEdit() {
        const response = await fetch('/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: this.sessionId }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data.status === 'approved';
    }

    async redoEdit() {
        const response = await fetch('/redo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: this.sessionId }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data.text;
    }

    async cancelEdit() {
        const response = await fetch('/cancel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: this.sessionId }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data.text;
    }
}