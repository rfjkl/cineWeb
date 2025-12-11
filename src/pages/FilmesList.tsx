import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { Filme } from '../types'

export default function FilmesList(){
  const [filmes, setFilmes] = useState<Filme[]>([])
  const load = async ()=> setFilmes(await api.get('filmes'))
  useEffect(()=>{ load() }, [])
  const handleDelete = async (id?: number)=>{
    if(!id) return
    if(!confirm('Excluir filme?')) return
    await api.del(`filmes/${id}`)
    await load()
  }
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Filmes</h2>
        <Link className="btn btn-primary" to="/filmes/novo">+ Novo</Link>
      </div>
      <div className="row">
        {filmes && filmes.length === 0 && <div className="col-12">Nenhum filme cadastrado.</div>}
        {filmes.map(f=>(
          <div key={f.id} className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{f.titulo}</h5>
                <p className="card-text">{f.sinopse}</p>
                <p className="card-text"><small className="text-muted">{f.genero} • {f.duracao} min • {f.classificacao} anos</small></p>
                <div className="d-flex justify-content-between">
                  <Link className="btn btn-sm btn-outline-secondary" to={`/filmes/editar/${f.id}`}>Editar</Link>
                  <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(f.id)}>Excluir</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
