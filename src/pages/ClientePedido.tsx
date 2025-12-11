import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { Filme, Sessao, Sala, Lanche } from '../types'
import { useNavigate } from 'react-router-dom'

export default function ClientePedido() {
  const navigate = useNavigate()

  const [filmes, setFilmes] = useState<Filme[]>([])
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const [salas, setSalas] = useState<Sala[]>([])
  const [lanches, setLanches] = useState<Lanche[]>([])

  // Escolhas do cliente
  const [filmeId, setFilmeId] = useState<number>(0)
  const [sessaoId, setSessaoId] = useState<number>(0)
  const [qntInteira, setQntInteira] = useState(1)
  const [qntMeia, setQntMeia] = useState(0)
  const [lanchesSelecionados, setLanchesSelecionados] = useState<Record<number, number>>({})

  const valorInteira = 20
  const valorMeia = 10

  useEffect(() => {
    api.get('filmes').then(setFilmes)
    api.get('sessoes').then(setSessoes)
    api.get('salas').then(setSalas)
    api.get('lanches').then(setLanches)
  }, [])

  const sessoesFiltradas = sessoes.filter(s => s.filmeId === Number(filmeId))

  const totalIngressos =
    qntInteira * valorInteira +
    qntMeia * valorMeia

  const totalLanches = lanches.reduce((acc, lanche) => {
    const quant = lanchesSelecionados[lanche.id || 0] || 0
    return acc + quant * lanche.preco
  }, 0)

  const totalGeral = totalIngressos + totalLanches

  const alterarQuantidadeLanche = (id: number, quantidade: number) => {
    setLanchesSelecionados(prev => ({
      ...prev,
      [id]: quantidade
    }))
  }

  const finalizar = async () => {
    if (!sessaoId) {
      alert("Escolha uma sessão")
      return
    }

    // 1. Criar pedido
    const pedido = await api.post("pedidos", {
      data: new Date().toISOString()
    })

    // 2. Criar ingressos
    for (let i = 0; i < qntInteira; i++) {
      const ing = await api.post('ingressos', {
        sessaoId,
        tipo: 'Inteira',
        valor: valorInteira
      })

      await api.post('itempedidos', {
        pedidoId: pedido.id,
        tipo: 'ingresso',
        referenciaId: ing.id,
        quantidade: 1
      })
    }

    for (let i = 0; i < qntMeia; i++) {
      const ing = await api.post('ingressos', {
        sessaoId,
        tipo: 'Meia',
        valor: valorMeia
      })

      await api.post('itempedidos', {
        pedidoId: pedido.id,
        tipo: 'ingresso',
        referenciaId: ing.id,
        quantidade: 1
      })
    }

    // 3. Adicionar lanches ao pedido
    for (const id in lanchesSelecionados) {
      const quant = lanchesSelecionados[Number(id)]
      if (quant > 0) {
        await api.post('itempedidos', {
          pedidoId: pedido.id,
          tipo: 'lanche',
          referenciaId: Number(id),
          quantidade: quant
        })
      }
    }

    alert("Pedido realizado com sucesso!")
    navigate(`/pedidos/${pedido.id}`)
  }

  return (
    <div>
      <h2>Pedido do Cliente</h2>

      {/* FILME */}
      <div className="mb-3">
        <label>Filme</label>
        <select
          className="form-select"
          value={filmeId}
          onChange={(e) => setFilmeId(Number(e.target.value))}
        >
          <option value="0">Selecione...</option>
          {filmes.map(f => (
            <option key={f.id} value={f.id}>{f.titulo}</option>
          ))}
        </select>
      </div>

      {/* SESSÃO */}
      <div className="mb-3">
        <label>Sessão</label>
        <select
          className="form-select"
          value={sessaoId}
          onChange={(e) => setSessaoId(Number(e.target.value))}
        >
          <option value="0">Selecione...</option>
          {sessoesFiltradas.map(s => {
            const sala = salas.find(sl => sl.id === s.salaId)
            return (
              <option key={s.id} value={s.id}>
                {new Date(s.dataHora).toLocaleString()} - Sala {sala?.numero}
              </option>
            )
          })}
        </select>
      </div>

      {/* INGRESSOS */}
      <h4>Ingressos</h4>
      <div className="mb-2 d-flex gap-3">
        <div>
          <label>Inteira (R$ 20)</label>
          <input type="number" min="0" className="form-control"
            value={qntInteira}
            onChange={e => setQntInteira(Number(e.target.value))}
          />
        </div>

        <div>
          <label>Meia (R$ 10)</label>
          <input type="number" min="0" className="form-control"
            value={qntMeia}
            onChange={e => setQntMeia(Number(e.target.value))}
          />
        </div>
      </div>

      {/* LANCHES */}
      <h4 className="mt-4">Lanches</h4>

      {lanches.map(l => (
        <div key={l.id} className="mb-2 d-flex align-items-center gap-2">
          <span>{l.nome} - R$ {l.preco.toFixed(2)}</span>
          <input
            type="number"
            min="0"
            className="form-control w-25"
            value={lanchesSelecionados[l.id || 0] || 0}
            onChange={(e) => alterarQuantidadeLanche(l.id!, Number(e.target.value))}
          />
        </div>
      ))}

      {/* TOTAL */}
      <h3 className="mt-4">
        Total: R$ {totalGeral.toFixed(2)}
      </h3>

      <button className="btn btn-success mt-3" onClick={finalizar}>
        Finalizar Pedido
      </button>
    </div>
  )
}
