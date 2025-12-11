import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import { Sessao, Filme, Sala } from '../types'

export default function VendaIngresso(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [sessao, setSessao] = useState<Sessao|null>(null)
  const [filme, setFilme] = useState<Filme|null>(null)
  const [sala, setSala] = useState<Sala|null>(null)
  const [tipo, setTipo] = useState<'Inteira'|'Meia'>('Inteira')
  const base = 20
  const valor = tipo === 'Inteira' ? base : base/2

  useEffect(()=>{
    if(id){
      api.get(`sessoes/${id}`).then((s:any)=>{
        setSessao(s)
        api.get(`filmes/${s.filmeId}`).then(setFilme)
        api.get(`salas/${s.salaId}`).then(setSala)
      })
    }
  },[id])

  const vender = async ()=>{
    if(!sessao) return

    const ingresso = await api.post('ingressos',{
      sessaoId: sessao.id,
      tipo,
      valor
    })

    const pedido = await api.post('pedidos', {
      data: new Date().toISOString()
    })

    await api.post('itempedidos', {
      pedidoId: pedido.id,
      tipo: 'ingresso',
      referenciaId: ingresso.id,
      quantidade: 1
    })

    alert('Ingresso vendido!')
    navigate('/pedidos')
  }

  if(!sessao) return <div>Carregando...</div>

  return (
    <div>
      <h2>Venda de Ingresso</h2>
      <p><strong>Filme:</strong> {filme?.titulo}</p>
      <p><strong>Sala:</strong> {sala?.numero}</p>
      <p><strong>Data/Hora:</strong> {new Date(sessao.dataHora).toLocaleString()}</p>

      <div className="mb-3">
        <label>Tipo</label>
        <select className="form-select" value={tipo} onChange={e=>setTipo(e.target.value as any)}>
          <option value="Inteira">Inteira</option>
          <option value="Meia">Meia</option>
        </select>
      </div>

      <p>Valor: R$ {valor.toFixed(2)}</p>

      <button className="btn btn-success" onClick={vender}>Finalizar venda</button>
    </div>
  )
}
