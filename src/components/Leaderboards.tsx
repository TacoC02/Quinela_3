import { useEffect, useState } from 'react'
import api from '../api'

export function LeaderboardTeam({ token }:{ token:string }){
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{ setLoading(true); api.getLeaderboardToken(token).then(setRows).finally(()=>setLoading(false)) },[token])
  if(loading) return <div>Cargando ranking del equipo...</div>
  return (
    <div>
      <h3>Ranking del equipo</h3>
      <ol>
        {rows.map(r=> <li key={r.idParticipant}>{r.name} — {r.score} pts {r.submitted? '':'(no enviado)'}</li>)}
      </ol>
    </div>
  )
}

export function LeaderboardGeneral({ token }:{ token?:string }){
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{ setLoading(true); api.getLeaderboardGeneral(token).then(setRows).finally(()=>setLoading(false)) },[token])
  if(loading) return <div>Cargando ranking global...</div>
  return (
    <div>
      <h3>Ranking global</h3>
      <ol>
        {rows.map(r=> <li key={r.idParticipant}>{r.name} — {r.teamName || '—'} — {r.score} pts</li>)}
      </ol>
    </div>
  )
}

export default LeaderboardTeam
