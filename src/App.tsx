import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import FilmesList from './pages/FilmesList'
import FilmeForm from './pages/FilmeForm'
import SalasList from './pages/SalasList'
import SalaForm from './pages/SalaForm'
import SessoesList from './pages/SessoesList'
import SessaoForm from './pages/SessaoForm'
import VendaIngresso from './pages/VendaIngresso'
import LanchesList from './pages/LancheList'
import LancheForm from './pages/LancheForm'
import PedidosList from './pages/PedidosList'
import PedidoDetalhes from './pages/PedidoDetalhes'
import ClientePedido from "./pages/ClientePedido"


export default function App(){
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/filmes" replace />} />
        <Route path="/filmes" element={<FilmesList />} />
        <Route path="/filmes/novo" element={<FilmeForm />} />
        <Route path="/filmes/editar/:id" element={<FilmeForm />} />

        <Route path="/salas" element={<SalasList />} />
        <Route path="/salas/novo" element={<SalaForm />} />
        <Route path="/salas/editar/:id" element={<SalaForm />} />

        <Route path="/sessoes" element={<SessoesList />} />
        <Route path="/sessoes/novo" element={<SessaoForm />} />
        <Route path="/sessoes/editar/:id" element={<SessaoForm />} />
        <Route path="/sessoes/vender/:id" element={<VendaIngresso />} />

        <Route path="/lanches" element={<LanchesList />} />
        <Route path="/lanches/novo" element={<LancheForm />} />
        <Route path="/lanches/editar/:id" element={<LancheForm />} />

        <Route path="/pedidos" element={<PedidosList />} />
        <Route path="/pedidos/:id" element={<PedidoDetalhes />} />
        <Route path="/cliente/pedido" element={<ClientePedido />} />

      </Routes>
    </Layout>
  )
}
