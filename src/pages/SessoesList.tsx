import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { Sessao, Filme, Sala } from '../types'

export default function SessoesList(){
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [salas, setSalas] = useState<Sala[]>([])
  const load = async ()=>{
    const s = await api.get('sessoes') || []
    setSessoes(s)
    setFilmes(await api.get('filmes') || [])
    setSalas(await api.get('salas') || [])
  }
  useEffect(()=>{ load() }, [])
  const findFilme = (id?: number)=> filmes.find(f=>f.id===id)
  const findSala = (id?: number)=> salas.find(s=>s.id===id)
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Sessões</h2>
        <Link className="btn btn-primary" to="/sessoes/novo">+ Novo</Link>
      </div>
      <table className="table">
        <thead><tr><th>#</th><th>Filme</th><th>Sala</th><th>Data/Hora</th><th>Ações</th></tr></thead>
        <tbody>
          {sessoes.map(s=>(
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{findFilme(s.filmeId)?.titulo || '—'}</td>
              <td>{findSala(s.salaId)?.numero || '—'}</td>
              <td>{new Date(s.dataHora).toLocaleString()}</td>
              <td>
                <Link className="btn btn-sm btn-outline-secondary me-2" to={`/sessoes/editar/${s.id}`}>Editar</Link>
                <Link className="btn btn-sm btn-success" to={`/sessoes/vender/${s.id}`}>Vender Ingresso</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
