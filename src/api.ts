const BASE = import.meta.env.VITE_API_URL || 'https://hackathon-quiniela.onrender.com'

function headers(token?: string) {
  const h: Record<string,string> = { 'Content-Type': 'application/json' }
  if (token) h['x-team-token'] = token
  return h
}

async function handleResponse(res: Response) {
  const text = await res.text()
  let body: any = text
  try { body = text ? JSON.parse(text) : null } catch { body = text }
  if (!res.ok) {
    const message = (body && body.message) ? body.message : (typeof body === 'string' ? body : JSON.stringify(body))
    const err: any = new Error(`${res.status} ${res.statusText}: ${message}`)
    err.status = res.status
    err.body = body
    throw err
  }
  return body
}

export async function postParticipant(token: string, body: { name: string; photoUrl?: string }) {
  const res = await fetch(`${BASE}/participants`, { method: 'POST', headers: headers(token), body: JSON.stringify(body) })
  return handleResponse(res)
}

export async function getParticipants(token: string) {
  const res = await fetch(`${BASE}/participants`, { headers: headers(token) })
  return handleResponse(res)
}

export async function getBracket(token: string) {
  const res = await fetch(`${BASE}/matches/bracket`, { headers: headers(token) })
  return handleResponse(res)
}

export async function postQuiniela(token: string, body: { participantId: number; predictions: Array<{ matchId:number; predictedWinnerId:number }> }) {
  const res = await fetch(`${BASE}/quiniela`, { method: 'POST', headers: headers(token), body: JSON.stringify(body) })
  return handleResponse(res)
}

export async function getQuiniela(token: string, participantId: number|string) {
  const res = await fetch(`${BASE}/quiniela/${participantId}`, { headers: headers(token) })
  return handleResponse(res)
}

export async function getQuinielaMock(token?: string) {
  const res = await fetch(`${BASE}/quiniela/mock`, { headers: headers(token) })
  return handleResponse(res)
}

export async function getLeaderboardToken(token: string) {
  const res = await fetch(`${BASE}/leaderboard/token`, { headers: headers(token) })
  return handleResponse(res)
}

export async function getLeaderboardGeneral(token?: string) {
  const res = await fetch(`${BASE}/leaderboard/general`, { headers: headers(token) })
  return handleResponse(res)
}

export default {
  postParticipant,
  getParticipants,
  getBracket,
  postQuiniela,
  getQuiniela,
  getQuinielaMock,
  getLeaderboardToken,
  getLeaderboardGeneral,
}
