import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import { Filme } from '../types'
import { FilmeSchema } from '../schemas'
import { z } from 'zod'

export default function FilmeForm(){
  const params = useParams()
  const navigate = useNavigate()
  const editId = params.id
  const [form, setForm] = useState<Filme>({ titulo:'', sinopse:'', classificacao:0, duracao:0, genero:'', datasExibicao:[] })
  const [errors, setErrors] = useState<Record<string,string>>({})
  useEffect(()=>{
    if(editId){
      api.get(`filmes/${editId}`).then((f: any)=> setForm(f))
    }
  },[editId])

  const setField = (k: keyof Filme, v: any) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = FilmeSchema.safeParse(form)
    if(!result.success){
      const zErr: Record<string,string> = {}
      result.error.errors.forEach(err => { if(err.path[0]) zErr[String(err.path[0])] = err.message })
      setErrors(zErr)
      return
    }
    setErrors({})
    if(editId) await api.put(`filmes/${editId}`, form)
    else await api.post('filmes', form)
    navigate('/filmes')
  }

  return (
    <div>
      <h2>{editId ? 'Editar' : 'Novo'} Filme</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input className={`form-control ${errors.titulo ? 'is-invalid' : ''}`} value={form.titulo} onChange={e=>setField('titulo', e.target.value)} />
          {errors.titulo && <div className="invalid-feedback">{errors.titulo}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Sinopse</label>
          <textarea className={`form-control ${errors.sinopse ? 'is-invalid' : ''}`} value={form.sinopse} onChange={e=>setField('sinopse', e.target.value)} />
          {errors.sinopse && <div className="invalid-feedback">{errors.sinopse}</div>}
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Classificação</label>
            <input type="number" className={`form-control ${errors.classificacao ? 'is-invalid' : ''}`} value={form.classificacao} onChange={e=>setField('classificacao', Number(e.target.value))} />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Duração (min)</label>
            <input type="number" className={`form-control ${errors.duracao ? 'is-invalid' : ''}`} value={form.duracao} onChange={e=>setField('duracao', Number(e.target.value))} />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Gênero</label>
            <input className={`form-control ${errors.genero ? 'is-invalid' : ''}`} value={form.genero} onChange={e=>setField('genero', e.target.value)} />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Datas de exibição (YYYY-MM-DD, separadas por vírgula)</label>
          <input className={`form-control ${errors.datasExibicao ? 'is-invalid' : ''}`} value={form.datasExibicao.join(',')} onChange={e=>setField('datasExibicao', e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} />
          {errors.datasExibicao && <div className="invalid-feedback">{errors.datasExibicao}</div>}
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-primary" type="submit">Salvar</button>
          <button className="btn btn-secondary" type="button" onClick={()=>navigate('/filmes')}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
