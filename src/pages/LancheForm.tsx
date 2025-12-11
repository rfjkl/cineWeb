import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import { Lanche } from '../types'
import { LancheSchema } from '../schemas'

export default function LancheForm(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<Lanche>({ nome:'', preco:1 })
  const [errors, setErrors] = useState<Record<string,string>>({})

  useEffect(()=>{
    if(id) api.get(`lanches/${id}`).then(setForm)
  },[id])

  const submit = async (e: React.FormEvent)=>{
    e.preventDefault()
    const r = LancheSchema.safeParse(form)

    if(!r.success){
      const er: Record<string,string> = {}
      r.error.errors.forEach(e=> er[String(e.path[0])] = e.message)
      setErrors(er)
      return
    }

    if(id) await api.put(`lanches/${id}`, form)
    else await api.post('lanches', form)

    navigate('/lanches')
  }

  return (
    <div>
      <h2>{id ? 'Editar' : 'Novo'} Lanche</h2>
      <form onSubmit={submit}>

        <div className="mb-3">
          <label>Nome</label>
          <input className={`form-control ${errors.nome ? 'is-invalid':''}`} value={form.nome}
            onChange={e=>setForm({...form, nome:e.target.value})}/>
          {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
        </div>

        <div className="mb-3">
          <label>Preço</label>
          <input type="number" className={`form-control ${errors.preco ? 'is-invalid':''}`} 
            value={form.preco}
            onChange={e=>setForm({...form, preco:Number(e.target.value)})}/>
          {errors.preco && <div className="invalid-feedback">{errors.preco}</div>}
        </div>

        <button className="btn btn-primary">Salvar</button>
      </form>
    </div>
  )
}
