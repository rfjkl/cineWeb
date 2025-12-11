import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { Lanche } from '../types'

export default function LanchesList(){
  const [lanches, setLanches] = useState<Lanche[]>([])
  const load = async ()=> setLanches(await api.get('lanches'))
  useEffect(()=>{ load() }, [])

  const handleDelete = async (id?: number)=>{
    if(!id) return
    if(!confirm('Excluir lanche?')) return
    await api.del(`lanches/${id}`)
    await load()
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>Lanches</h2>
        <Link className="btn btn-primary" to="/lanches/novo">+ Novo</Link>
      </div>

      <table className="table">
        <thead>
          <tr><th>#</th><th>Nome</th><th>Preço</th><th></th></tr>
        </thead>
        <tbody>
          {lanches.map(l=>(
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.nome}</td>
              <td>R$ {l.preco.toFixed(2)}</td>
              <td>
                <Link className="btn btn-sm btn-outline-secondary me-2" to={`/lanches/editar/${l.id}`}>Editar</Link>
                <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(l.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
