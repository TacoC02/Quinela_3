import { useEffect, useState } from 'react'
import api from '../api'

export default function ParticipantCheck({ token, onSelect }:{ token:string, onSelect:(participant:any)=>void }){
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)

  useEffect(()=>{
    setLoading(true); setError(null)
    api.getParticipants(token).then(setList).catch(e=>setError(e?.message||JSON.stringify(e))).finally(()=>setLoading(false))
  },[token])

  if(loading) return <div>Cargando participantes...</div>
  if(error) return <div style={{color:'red'}}>{error}</div>

  return (
    <div>
      <h3>Participantes del equipo</h3>
      <ul>
        {list.map(p=> (
          <li key={p.idParticipant}>
            {p.name} — {p.quinielaSubmitted? 'Enviada':'Pendiente'}
            <button onClick={()=>onSelect(p)} style={{marginLeft:8}}>Seleccionar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
