import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(){
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">CineWeb</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/filmes">Filmes</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/salas">Salas</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/sessoes">Sessões</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
