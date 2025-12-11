const BASE = 'http://localhost:3000'

async function request(path: string, opts?: RequestInit) {
  const res = await fetch(`${BASE}/${path}`, opts)
  if (!res.ok) throw new Error((await res.text()) || res.statusText)
  return res.json().catch(()=>null)
}

export const api = {
  get: <T = any>(path: string) => request(path),
  post: <T = any>(path: string, body?: any) => request(path, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) }),
  put: <T = any>(path: string, body?: any) => request(path, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) }),
  del: (path: string) => fetch(`${BASE}/${path}`, { method: 'DELETE' })
}
