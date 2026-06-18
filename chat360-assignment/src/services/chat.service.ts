import type { StreamChatOptions } from '../components/hooks/interface';
import fetchClient from './fetchClient';

export const chatService = {
  async streamChat({
    query,
    simulateDrop = false,
    simulateError = false,
    onToken,
    onDone,
    onError,
  }: StreamChatOptions): Promise<AbortController> {

    const controller = new AbortController();

    const params = new URLSearchParams();
    if (simulateDrop) params.append('simulateDrop', 'true');
    if (simulateError) params.append('simulateError', 'true');

    const res = await fetchClient.post(
      `api/chat/stream?${params.toString()}`,
      { message: query },
      controller.signal
    );

    if (!res.body) {
      onError('upstream', 'No stream body');
      return controller;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let buffer = '';
    let event = '';

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const clean = line.trim();
        if (!clean) continue;

        if (clean.startsWith('event:')) {
          event = clean.replace('event:', '').trim();
          continue;
        }

        if (clean.startsWith('data:')) {
          const data = clean.replace('data:', '').trim();

          try {
            const parsed = JSON.parse(data);

            if (event === 'token') {
              onToken(parsed.token);
            }

            if (event === 'done') {
              onDone();
              return controller;
            }

            if (event === 'error') {
              onError('upstream', parsed.message);
              return controller;
            }
          } catch (_e) { /* non-JSON data line — skip */ }
        }
      }
    }

    // only here if stream ends normally
    onDone();
    return controller;
  },
};