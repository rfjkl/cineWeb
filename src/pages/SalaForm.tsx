import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import { Sala } from '../types'
import { SalaSchema } from '../schemas'

export default function SalaForm(){
  const params = useParams()
  const navigate = useNavigate()
  const editId = params.id
  const [form, setForm] = useState<Sala>({ numero:1, capacidade:1 })
  const [errors, setErrors] = useState<Record<string,string>>({})
  useEffect(()=>{
    if(editId) api.get(`salas/${editId}`).then((s:any)=> setForm(s))
  },[editId])
  const handleSubmit = async (e: React.FormEvent)=>{
    e.preventDefault()
    const r = SalaSchema.safeParse(form)
    if(!r.success){
      const zErr: Record<string,string> = {}
      r.error.errors.forEach(err=> { if(err.path[0]) zErr[String(err.path[0])] = err.message })
      setErrors(zErr)
      return
    }
    setErrors({})
    if(editId) await api.put(`salas/${editId}`, form)
    else await api.post('salas', form)
    navigate('/salas')
  }
  return (
    <div>
      <h2>{editId ? 'Editar' : 'Nova'} Sala</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Número</label>
          <input type="number" className={`form-control ${errors.numero ? 'is-invalid' : ''}`} value={form.numero} onChange={e=>setForm({...form, numero: Number(e.target.value)})} />
          {errors.numero && <div className="invalid-feedback">{errors.numero}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Capacidade</label>
          <input type="number" className={`form-control ${errors.capacidade ? 'is-invalid' : ''}`} value={form.capacidade} onChange={e=>setForm({...form, capacidade: Number(e.target.value)})} />
          {errors.capacidade && <div className="invalid-feedback">{errors.capacidade}</div>}
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" type="submit">Salvar</button>
          <button className="btn btn-secondary" type="button" onClick={()=>navigate('/salas')}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
