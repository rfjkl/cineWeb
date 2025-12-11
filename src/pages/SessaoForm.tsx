import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import { Sessao, Filme, Sala } from '../types'
import { SessaoSchema } from '../schemas'

export default function SessaoForm(){
  const params = useParams()
  const navigate = useNavigate()
  const editId = params.id
  const [form, setForm] = useState<Sessao>({ filmeId:0, salaId:0, dataHora: '' })
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [salas, setSalas] = useState<Sala[]>([])
  const [errors, setErrors] = useState<Record<string,string>>({})
  useEffect(()=>{
    api.get('filmes').then((f:any)=> setFilmes(f || []))
    api.get('salas').then((s:any)=> setSalas(s || []))
    if(editId) api.get(`sessoes/${editId}`).then((s:any)=> setForm(s))
  },[editId])

  const handleSubmit = async (e: React.FormEvent)=>{
    e.preventDefault()
    const r = SessaoSchema.safeParse(form)
    if(!r.success){
      const zErr: Record<string,string> = {}
      r.error.errors.forEach(err=> { if(err.path[0]) zErr[String(err.path[0])] = err.message })
      setErrors(zErr)
      return
    }
    setErrors({})
    if(editId) await api.put(`sessoes/${editId}`, form)
    else await api.post('sessoes', form)
    navigate('/sessoes')
  }

  return (
    <div>
      <h2>{editId ? 'Editar' : 'Nova'} Sessão</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Filme</label>
          <select className={`form-select ${errors.filmeId ? 'is-invalid' : ''}`} value={form.filmeId} onChange={e=>setForm({...form, filmeId: Number(e.target.value)})}>
            <option value={0}>-- selecione --</option>
            {filmes.map(f=> <option key={f.id} value={f.id}>{f.titulo}</option>)}
          </select>
          {errors.filmeId && <div className="invalid-feedback">{errors.filmeId}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Sala</label>
          <select className={`form-select ${errors.salaId ? 'is-invalid' : ''}`} value={form.salaId} onChange={e=>setForm({...form, salaId: Number(e.target.value)})}>
            <option value={0}>-- selecione --</option>
            {salas.map(s=> <option key={s.id} value={s.id}>Sala {s.numero}</option>)}
          </select>
          {errors.salaId && <div className="invalid-feedback">{errors.salaId}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Data e Hora</label>
          <input type="datetime-local" className={`form-control ${errors.dataHora ? 'is-invalid' : ''}`} value={form.dataHora} onChange={e=>setForm({...form, dataHora: e.target.value})} />
          {errors.dataHora && <div className="invalid-feedback">{errors.dataHora}</div>}
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-primary" type="submit">Salvar</button>
          <button className="btn btn-secondary" type="button" onClick={()=>navigate('/sessoes')}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
