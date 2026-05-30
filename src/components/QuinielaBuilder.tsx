import { useEffect, useState } from 'react'
import api from '../api'

export default function QuinielaBuilder({ token, participant }: { token: string; participant: any }){
  const [bracket, setBracket] = useState<any[]>([])
  const [selections, setSelections] = useState<Record<number,number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(()=>{
    setLoading(true); setError(null)
    api.getBracket(token).then((r:any)=>setBracket(r.bracket||[])).catch(e=>setError(e?.message||JSON.stringify(e))).finally(()=>setLoading(false))
  },[token])

  // Helpers to resolve teams in later rounds according to selections
  function buildOrderMap() {
    const map: Record<number, any> = {}
    for (const stage of bracket) {
      for (const m of stage.matches) {
        map[m.matchOrder] = m
      }
    }
    return map
  }

  function findTeamById(idFootballTeam: number) {
    for (const stage of bracket) {
      for (const m of stage.matches) {
        if (m.homeTeam && m.homeTeam.idFootballTeam === idFootballTeam) return m.homeTeam
        if (m.awayTeam && m.awayTeam.idFootballTeam === idFootballTeam) return m.awayTeam
      }
    }
    return null
  }

  const feeders: Record<number, number[]> = {
    9: [1,2], 10: [3,4], 11: [5,6], 12: [7,8],
    13: [9,10], 14: [11,12],
    16: [13,14], // final
  }

  function resolveMatchTeams(m: any, orderMap: Record<number, any>) {
    // return objects { homeTeam, awayTeam }
    if (m.homeTeam || m.awayTeam) return { homeTeam: m.homeTeam, awayTeam: m.awayTeam }

    const feedersFor = feeders[m.matchOrder]
    if (!feedersFor) return { homeTeam: null, awayTeam: null }

    // For rounds use winners of feeder matches
    const t1 = orderMap[feedersFor[0]]
    const t2 = orderMap[feedersFor[1]]
    const winner1 = getWinnerOfMatch(t1)
    const winner2 = getWinnerOfMatch(t2)
    return { homeTeam: winner1, awayTeam: winner2 }
  }

  function getWinnerOfMatch(match: any) {
    if (!match) return null
    // if user selected a winner for this match, use that team
    const sel = selections[match.idMatch]
    if (sel) return findTeamById(sel) || { idFootballTeam: sel, name: 'Equipo ' + sel }
    // otherwise if match.homeTeam exists return homeTeam as placeholder
    if (match.homeTeam && match.awayTeam) return null
    return null
  }

  // removed getLoserOfMatch to avoid unused symbol; third place no longer supported

  function togglePick(matchId:number, teamId:number){
    setSelections(s=>({ ...s, [matchId]: s[matchId]===teamId? undefined as any : teamId }))
  }

  async function submit(){
    setSubmitting(true)
    try{
      const predictions = Object.entries(selections).map(([matchId, predictedWinnerId])=>({ matchId: Number(matchId), predictedWinnerId }))
      await api.postQuiniela(token, { participantId: participant.idParticipant, predictions })
      alert('Quiniela enviada correctamente')
    }catch(e:any){
      alert('Error: '+ (e?.message||JSON.stringify(e)))
    }finally{ setSubmitting(false) }
  }

  if(loading) return <div>Cargando bracket...</div>
  if(error) return <div style={{color:'red'}}>{error}</div>

  const orderMap = buildOrderMap()

  return (
    <div>
      <h2>Crear Quiniela — {participant.name}</h2>
      {bracket.filter((stage:any)=>stage.stage !== 'tercer_lugar').map((stage:any)=>(
        <div key={stage.stage} style={{marginBottom:16}}>
          <h4>{stage.stage}</h4>
          <ul>
            {stage.matches.map((m:any)=>{
              const resolved = resolveMatchTeams(m, orderMap)
              const home = resolved.homeTeam
              const away = resolved.awayTeam
              return (
                <li key={m.idMatch} style={{marginBottom:6}}>
                  <span>{home?.name || 'TBD'} vs {away?.name || 'TBD'}</span>
                  <div style={{display:'inline-block', marginLeft:8}}>
                    { (home || away) ? (
                      <>
                        {home && <button onClick={()=>togglePick(m.idMatch, home.idFootballTeam)} style={{background: selections[m.idMatch]===home.idFootballTeam? '#cfc':'#fff'}}>{home.name}</button>}
                        {away && <button onClick={()=>togglePick(m.idMatch, away.idFootballTeam)} style={{background: selections[m.idMatch]===away.idFootballTeam? '#cfc':'#fff', marginLeft:6}}>{away.name}</button>}
                      </>
                    ) : <em>Partido sin definir (placeholder)</em> }
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      <button disabled={submitting} onClick={submit}>Enviar quiniela</button>
    </div>
  )
}
