import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { Pedido } from '../types'

export default function PedidosList(){
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  useEffect(()=>{ api.get('pedidos').then(setPedidos) }, [])

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>Pedidos</h2>
      </div>

      <table className="table">
        <thead><tr><th>#</th><th>Data</th><th></th></tr></thead>
        <tbody>
          {pedidos.map(p=>(
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{new Date(p.data).toLocaleString()}</td>
              <td>
                <Link className="btn btn-sm btn-outline-secondary"
                  to={`/pedidos/${p.id}`}>Ver detalhes</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}
