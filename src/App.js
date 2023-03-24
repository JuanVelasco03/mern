import React from 'react';
import {Routes, Route} from 'react-router-dom'
import jwtDecode from 'jwt-decode';

//Componente login
import Login from './components/auth/Login';

import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';
import Administradores from './components/contents/administradores/Administradores';
import Footer from './components/footer/Footer';

import Slide from './components/contents/slide/Slide';
import Galeria from './components/contents/galeria/Galeria';
import Articulos from './components/contents/articulos/Articulos';
import Usuarios from './components/contents/usuarios/Usuarios';
import Error404 from './components/contents/error404/Error404';


export default function App() {
  const auth = getAccessToken();
  if(!auth){
    return <Login />
  }


  return (
    <div className="sidebar-mini">
      <div className="wrapper">
        <Header />
        <Sidebar/>
        <Footer/>
        <Routes>
          <Route exact path='/' element={<Administradores/>} />
          <Route exact path='/slide' element={<Slide/>} />
          <Route exact path='/galeria' element={<Galeria/>} />
          <Route exact path='/articulos' element={<Articulos/>} />
          <Route exact path='/usuarios' element={<Usuarios/>} />
          <Route element={<Error404/>} />
        </Routes>
      </div>

    </div>
  );
}

const getAccessToken = () => {
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  const id = localStorage.getItem("ID");
  const usuario = localStorage.getItem("USUARIO");



  if(!accessToken || accessToken === null || !id || id === null || !usuario || usuario === null){
    return false;
  }

  const metaToken = jwtDecode(accessToken);

  if(!metaToken.data){
    return false;
  }

  if(tokenExpira(accessToken, metaToken) || metaToken.data._id !== id || metaToken.data.usuario !== usuario){
    return false;
  }else{
    return true;
  }
}

/*=================================================================================
FUNCION PARA VERIFICAR LA FECHA DE EXPIRACION DEL TOKEN
================================================================================= */

const tokenExpira = (accessToken, metaToken) => {
  const seconds = 60;

  const {exp} = metaToken;

  const now = (Date.now()+ seconds/1000)

  return exp > now;
}



