import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'
import { ItemPedido, Ingresso, Lanche, Pedido } from '../types'

export default function PedidoDetalhes(){
  const { id } = useParams()
  const [pedido, setPedido] = useState<Pedido|null>(null)
  const [itens, setItens] = useState<ItemPedido[]>([])
  const [ingressos, setIngressos] = useState<Ingresso[]>([])
  const [lanches, setLanches] = useState<Lanche[]>([])

  useEffect(()=>{
    if(id){
      api.get(`pedidos/${id}`).then(setPedido)
      api.get('itempedidos').then((all:any)=>{
        setItens(all.filter((i:any)=>i.pedidoId == Number(id)))
      })
      api.get('ingressos').then(setIngressos)
      api.get('lanches').then(setLanches)
    }
  },[id])

  const resolveItem = (i:ItemPedido)=>{
    if(i.tipo === 'ingresso'){
      const ingresso = ingressos.find(x=>x.id===i.referenciaId)
      return `Ingresso ${ingresso?.tipo} - R$ ${ingresso?.valor}`
    }
    const lanche = lanches.find(x=>x.id===i.referenciaId)
    return `${lanche?.nome} - R$ ${(lanche?.preco||0).toFixed(2)}`
  }

  const total = itens.reduce((acc,i)=>{
    if(i.tipo==='ingresso'){
      const ing = ingressos.find(x=>x.id===i.referenciaId)
      return acc + (ing?.valor||0)
    }else{
      const lan = lanches.find(x=>x.id===i.referenciaId)
      return acc + (lan?.preco||0)*i.quantidade
    }
  },0)

  return (
    <div>
      <h2>Pedido #{pedido?.id}</h2>
      <p>Data: {new Date(pedido?.data||'').toLocaleString()}</p>

      <h4>Itens</h4>
      <ul className="list-group mb-3">
        {itens.map(i=>(
          <li key={i.id} className="list-group-item d-flex justify-content-between">
            <span>{resolveItem(i)} x {i.quantidade}</span>
          </li>
        ))}
      </ul>

      <h4>Total: R$ {total.toFixed(2)}</h4>
    </div>
  )
}
