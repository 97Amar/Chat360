const BASE_URL = 'http://localhost:4000';

const fetchClient = {
  post: async (url: string, body: unknown, signal?: AbortSignal) => {
    return fetch(`${BASE_URL}/${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal, // MUST stay here
      cache: 'no-store', // prevent any caching of the stream
    });
  },
};

export default fetchClient;