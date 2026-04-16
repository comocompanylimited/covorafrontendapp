const BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
const API_KEY   = process.env.EXPO_PUBLIC_API_KEY   || '';
const STORE_ID  = process.env.EXPO_PUBLIC_STORE_ID  || 'covora';
const TIMEOUT   = 12000;

export const isApiConfigured = () => !!BASE_URL;

const buildHeaders = () => {
  const h = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (API_KEY)  h['X-API-Key']  = API_KEY;
  if (STORE_ID) h['X-Store-ID'] = STORE_ID;
  return h;
};

const withTimeout = (promise) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), TIMEOUT)
    ),
  ]);

export const apiGet = async (path, params = {}) => {
  if (!BASE_URL) throw new Error('API_NOT_CONFIGURED');

  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });

  const res = await withTimeout(fetch(url.toString(), { method: 'GET', headers: buildHeaders() }));

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json();
};

export const apiPost = async (path, body = {}) => {
  if (!BASE_URL) throw new Error('API_NOT_CONFIGURED');

  const res = await withTimeout(
    fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    })
  );

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json();
};

export const apiPut = async (path, body = {}) => {
  if (!BASE_URL) throw new Error('API_NOT_CONFIGURED');

  const res = await withTimeout(
    fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    })
  );

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json();
};

export const apiDelete = async (path) => {
  if (!BASE_URL) throw new Error('API_NOT_CONFIGURED');

  const res = await withTimeout(
    fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers: buildHeaders() })
  );

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.status === 204 ? {} : res.json().catch(() => ({}));
};

export const extractList = (response) => {
  if (Array.isArray(response)) return response;
  if (response?.results && Array.isArray(response.results)) return response.results;
  if (response?.data && Array.isArray(response.data)) return response.data;
  if (response?.items && Array.isArray(response.items)) return response.items;
  if (response?.products && Array.isArray(response.products)) return response.products;
  return [];
};
