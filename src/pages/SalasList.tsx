import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { Sala } from '../types'

export default function SalasList(){
  const [salas, setSalas] = useState<Sala[]>([])
  const load = async ()=> setSalas(await api.get('salas'))
  useEffect(()=>{ load() }, [])
  const handleDelete = async (id?: number)=>{
    if(!id) return
    if(!confirm('Excluir sala?')) return
    await api.del(`salas/${id}`)
    await load()
  }
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Salas</h2>
        <Link className="btn btn-primary" to="/salas/novo">+ Nova</Link>
      </div>
      <table className="table">
        <thead><tr><th>#</th><th>Número</th><th>Capacidade</th><th>Ação</th></tr></thead>
        <tbody>
          {salas.map(s=>(
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.numero}</td>
              <td>{s.capacidade}</td>
              <td>
                <Link className="btn btn-sm btn-outline-secondary me-2" to={`/salas/editar/${s.id}`}>Editar</Link>
                <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(s.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
