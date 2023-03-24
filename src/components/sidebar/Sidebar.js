import React from "react";


import Image from './AdminLTELogo.png'
import Image2 from './userdef.jpg'
export default function Sidebar (){
  const usuario = localStorage.getItem("USUARIO")


  return (
  <aside className="main-sidebar sidebar-dark-primary elevation-4">
    <a href="/#" className="brand-link" style={{textDecoration:"none"}}>
      <img alt="AdminLTE Logo" className="brand-image img-cricle elevation-3" style={{opacity: 0.8}} src={Image}/>
      <span className="brand-text font-weight-light" >GDI</span>
    </a>
    <div className="sidebar">
      <div className="user-panel mt-3 pb-3 mb-3 d-flex">
        <div className="image">
          <img className="img-circle elevation-2" src={Image2} alt="user" />
        </div>
        <div className="info">
          <a href="/#" className="d-block" style={{textDecoration:"none"}}>
            {usuario}
          </a>
        </div>
      </div>
      <nav className="mt-2">
        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <li className="nav-item">
            <a href="/" className="nav-link">
              <i className="nav-icon fas fa-user-lock"></i>
              <p>Administradores</p>
            </a>
          </li>

          <li className="nav-item">
            <a href="/slide" className="nav-link">
              <i className="nav-icon fas fa-sliders-h"></i>
              <p>Gestor Slide</p>
            </a>
          </li>

          <li className="nav-item">
            <a href="/galeria" className="nav-link">
              <i className="nav-icon fas fa-images"></i>
              <p>Gestor Galeria</p>
            </a>
          </li>

          <li className="nav-item">
            <a href="/articulos" className="nav-link">
              <i className="nav-icon far fa-file"></i>
              <p>Gestor Articulos</p>
            </a>
          </li>

          <li className="nav-item">
            <a href="/usuarios" className="nav-link">
              <i className="nav-icon fas fa-users"></i>
              <p>Gestor usuarios</p>
            </a>
          </li>
        </ul>
      </nav>

    </div>
  </aside>

  );
} 