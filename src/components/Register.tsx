import { useState } from 'react'
import api from '../api'

export default function Register({ onRegistered }: { onRegistered: (participant: any, token: string) => void }) {
  const [name, setName] = useState('')
  const token = 'TEAM-ROCKET'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any | null>(null)

  async function submit(e: any) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const participant = await api.postParticipant(token, { name })
      onRegistered(participant, token)
    } catch (err: any) {
      // err may include status and body from api.handleResponse
      const info = {
        message: err?.message || String(err),
        status: err?.status,
        body: err?.body || null
      }
      setError(info)
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h2>Registrar participante</h2>
      <form onSubmit={submit}>
        <div>
          <label>Token de equipo</label>
          <input value={token} disabled title="Token fijado: TEAM-ROCKET" />
        </div>
        <div>
          <label>Nombre</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Juan Pérez" required />
        </div>
        <button disabled={loading}>{loading? 'Registrando...':'Registrar'}</button>
      </form>
      {error && (
        <div style={{color:'red'}}>
          <div><strong>Error:</strong> {error.message}</div>
          {error.status && <div><strong>Status:</strong> {error.status}</div>}
          {error.body && <pre style={{whiteSpace:'pre-wrap',fontSize:12}}>{typeof error.body === 'string'? error.body : JSON.stringify(error.body, null, 2)}</pre>}
        </div>
      )}
    </div>
  )
}
