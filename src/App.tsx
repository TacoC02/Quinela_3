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
  const [view, setView] = useState<'home'|'check'|'builder'|'view'|'leaderboards-team'|'leaderboards-global'>('home')

  return (
    <div className="contenedor-principal">
      <div className="app-header">
        <div className="team-badge">
          <div className="logo">R</div>
          <div>
            <h2>TEAM ROCKET</h2>
            <div style={{fontSize:12,color:'var(--muted)'}}>Quiniela Oficial</div>
          </div>
        </div>

        <div className="nav-buttons">
          <button onClick={()=>setView('home')}>Inicio</button>
          <button onClick={()=>setView('check')}>Ver participantes</button>
          <button className="primary" onClick={()=>setView('leaderboards-team')}>Leaderboards (Equipo)</button>
          <button onClick={()=>setView('leaderboards-global')}>Leaderboards (Global)</button>
        </div>
      </div>

      <div className="bracket-layout">
        <div className="bracket-side">
          {/* left decorative column */}
        </div>

        <div className="bracket-center panel">
          {view==='home' && (
            <div>
              <p style={{color:'var(--muted)'}}>Registra un participante con el token de equipo provisto por la organización.</p>
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

          {view==='leaderboards-team' && token && (
            <div>
              <LeaderboardTeam token={token} />
            </div>
          )}

          {view==='leaderboards-global' && (
            <div>
              <LeaderboardGeneral token={token || undefined} />
            </div>
          )}

          {!token && view!=='home' && (
            <div style={{color:'orange'}}>Introduce un token desde la pantalla de inicio para usar estas vistas.</div>
          )}
        </div>

        <div className="bracket-side">
          <div style={{display:'flex',justifyContent:'center'}}>
            <div className="trophy">🏆</div>
          </div>
        </div>
      </div>

      {view==='check' && token && (
        <ParticipantCheck token={token} onSelect={(p)=>{ setParticipant(p); setView(p.quinielaSubmitted? 'view':'builder') }} />
      )}

      {view==='builder' && token && participant && (
        <QuinielaBuilder token={token} participant={participant} />
      )}

      {view==='view' && token && participant && (
        <QuinielaView token={token} participantId={participant.idParticipant} />
      )}

      {view==='leaderboards-team' && token && (
        <div>
          <LeaderboardTeam token={token} />
        </div>
      )}

      {view==='leaderboards-global' && (
        <div>
          <LeaderboardGeneral token={token || undefined} />
        </div>
      )}

      {!token && view!=='home' && (
        <div style={{color:'orange'}}>Introduce un token desde la pantalla de inicio para usar estas vistas.</div>
      )}
    </div>
  )
}