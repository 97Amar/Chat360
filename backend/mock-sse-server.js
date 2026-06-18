// Mock SSE chat server for the Chat360 frontend take-home assignment.
// Run: npm install express cors && node mock-sse-server.js

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Canned responses, picked at random, to stand in for an LLM.
const RESPONSES = [
    "Thanks for reaching out. Let me look into that for you. Based on what you've described, here are a few things worth checking: first your account settings, then your billing details, and if the issue persists our support team can dig deeper into the logs.",
    "I understand the frustration here. Let's walk through what's happening step by step and get this resolved together.",
    "Sure, here's a breakdown of the pricing tiers and what's included in each plan, along with a recommendation based on typical usage patterns for a team your size."
];

function pickResponse() {
    return RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
}

app.post('/api/chat/stream', (req, res) => {
    console.log('[Server] POST /api/chat/stream received:', req.body);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.flushHeaders();

    const simulateDrop = req.query.simulateDrop === 'true';
    const simulateError = req.query.simulateError === 'true';

    if (simulateError) {
        console.log('[Server] Simulating error');
        res.write(`event: error\ndata: ${JSON.stringify({ message: 'Upstream model unavailable' })}\n\n`);
        return res.end();
    }

    const words = pickResponse().split(' ');
    let i = 0;
    console.log('[Server] Starting interval for response with', words.length, 'tokens');

    const interval = setInterval(() => {
        if (simulateDrop && i === Math.floor(words.length / 2)) {
            console.log('[Server] Simulating drop');
            clearInterval(interval);
            res.destroy(); // simulate a dropped connection mid-stream
            return;
        }

        if (i >= words.length) {
            console.log('[Server] Stream done');
            res.write(`event: done\ndata: {}\n\n`);
            clearInterval(interval);
            return res.end();
        }

        console.log('[Server] Sending token:', words[i]);
        res.write(`event: token\ndata: ${JSON.stringify({ token: words[i] + ' ' })}\n\n`);
        i++;
    }, 80);

    // req.on('close', () => {
    //     console.log('[Server] Client closed connection');
    //     clearInterval(interval);
    // });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Mock SSE server running on http://localhost:${PORT}`));
