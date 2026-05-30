import { useState } from 'react';
import './App.css';
import Register from './components/Register'
import ParticipantCheck from './components/ParticipantCheck'
import QuinielaBuilder from './components/QuinielaBuilder'
import QuinielaView from './components/QuinielaView'
import { LeaderboardTeam, LeaderboardGeneral } from './components/Leaderboards'

export default function App(){
  // El token de equipo está fijado a TEAM-ROCKET por defecto
  const [token, setToken] = useState<string | null>('TEAM-ROCKET')
  const [participant, setParticipant] = useState<any|null>(null)
  const [view, setView] = useState<'home'|'check'|'builder'|'view'|'leaderboards'>('home')

  return (
    <div className="contenedor-principal" style={{padding:20}}>
      <h1>🏆 Quiniela del Mundial</h1>
      <nav style={{marginBottom:12}}>
        <button onClick={()=>setView('home')}>Inicio</button>
        <button onClick={()=>setView('check')}>Ver participantes</button>
        <button onClick={()=>setView('leaderboards')}>Leaderboards</button>
      </nav>

      {view==='home' && (
        <div>
          <p>Registra un participante con el token de equipo provisto por la organización.</p>
          <Register onRegistered={(p,t)=>{ setParticipant(p); setToken(t); setView('builder') }} />
        </div>
      )}

      {view==='check' && token && (
        <ParticipantCheck token={token} onSelect={(p)=>{ setParticipant(p); setView(p.quinielaSubmitted? 'view':'builder') }} />
      )}

      {view==='builder' && token && participant && (
        <QuinielaBuilder token={token} participant={participant} />
      )}

      {view==='view' && token && participant && (
        <QuinielaView token={token} participantId={participant.idParticipant} />
      )}

      {view==='leaderboards' && token && (
        <div>
          <LeaderboardTeam token={token} />
          <LeaderboardGeneral token={token} />
        </div>
      )}

      {!token && view!=='home' && (
        <div style={{color:'orange'}}>Introduce un token desde la pantalla de inicio para usar estas vistas.</div>
      )}
    </div>
  )
}