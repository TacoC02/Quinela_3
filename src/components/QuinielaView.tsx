import { useEffect, useState } from 'react'
import api from '../api'

export default function QuinielaView({ token, participantId }:{ token:string, participantId:number }){
  const [data, setData] = useState<any|null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)

  useEffect(()=>{
    setLoading(true); setError(null)
    api.getQuiniela(token, participantId).then(setData).catch(e=>setError(e?.message||JSON.stringify(e))).finally(()=>setLoading(false))
  },[token, participantId])

  if(loading) return <div>Cargando quiniela...</div>
  if(error) return <div style={{color:'red'}}>{error}</div>
  if(!data) return null

  return (
    <div>
      <h2>Quiniela de {data.participant?.name}</h2>
      <div>Score: {data.score}</div>
      {data.bracket.map((stage:any)=>(
        <div key={stage.stage} style={{marginBottom:12}}>
          <h4>{stage.stage}</h4>
          <ul>
            {stage.matches.map((m:any)=> (
              <li key={m.idMatch}>
                <div>{m.homeTeam?.name || 'TBD'} vs {m.awayTeam?.name || 'TBD'}</div>
                <div>
                  Predicción: {m.prediction?.predictedWinner?.name || '—'}
                  {' '}| Resultado: {m.winner?.name || '—'}
                  {' '}| Acierto: {m.prediction?.isCorrect===null? 'Pendiente' : m.prediction?.isCorrect? '✅':'❌'}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
