import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { Sessao, Filme, Sala, Ingresso } from '../types'

export default function VendaIngresso(){
  const params = useParams()
  const navigate = useNavigate()
  const id = Number(params.id)
  const [sessao, setSessao] = useState<Sessao | null>(null)
  const [filme, setFilme] = useState<Filme | null>(null)
  const [sala, setSala] = useState<Sala | null>(null)
  const [tipo, setTipo] = useState<'Inteira'|'Meia'>('Inteira')
  const [valor, setValor] = useState<number>(0)
  const base = 20
  useEffect(()=>{
    if(!id) return
    api.get(`sessoes/${id}`).then((s:any)=> { setSessao(s); if(s){ api.get(`filmes/${s.filmeId}`).then((f:any)=>setFilme(f)); api.get(`salas/${s.salaId}`).then((sa:any)=>setSala(sa)) } })
  },[id])

  useEffect(()=>{
    setValor(tipo === 'Inteira' ? base : base/2)
  },[tipo])

  const handleVenda = async ()=>{
    if(!sessao) return
    const ingresso: Partial<Ingresso> = { sessaoId: sessao.id as number, tipo, valor }
    await api.post('ingressos', ingresso)
    alert('Ingresso vendido! Valor R$ ' + valor.toFixed(2))
    navigate('/sessoes')
  }

  if(!sessao) return <div>Carregando...</div>

  return (
    <div>
      <h2>Vender ingresso</h2>
      <p><strong>Filme:</strong> {filme?.titulo}</p>
      <p><strong>Sala:</strong> {sala?.numero}</p>
      <p><strong>Data/Hora:</strong> {new Date(sessao.dataHora).toLocaleString()}</p>

      <div className="mb-3">
        <label className="form-label">Tipo</label>
        <select className="form-select" value={tipo} onChange={e=>setTipo(e.target.value as any)}>
          <option value="Inteira">Inteira</option>
          <option value="Meia">Meia</option>
        </select>
      </div>

      <p>Valor: R$ {valor.toFixed(2)}</p>

      <div className="d-flex gap-2">
        <button className="btn btn-success" onClick={handleVenda}>Confirmar Venda</button>
        <button className="btn btn-secondary" onClick={()=>navigate('/sessoes')}>Cancelar</button>
      </div>
    </div>
  )
}
