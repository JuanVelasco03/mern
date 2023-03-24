import React, { useState } from "react";
import { rutaApi } from "../../config/Config";
import $ from "jquery";

export default function Login(){
  /*=================================================================================
  Hook para iniciar sesion
  ================================================================================= */
  const [administradores, iniciarSesion] = useState({
    usuario: "",
    password: ""
  });

  /*=================================================================================
  Capturamos cambios del formulario para ejecutar la funcion del hook
  ================================================================================= */
  const cambiaForm = e => {
    iniciarSesion({
    ...administradores, [e.target.name]: e.target.value})
  }
  /*=================================================================================
  Ejecutamos el submit
  ================================================================================= */

  const login = async e => {
    $(".alert").remove();
    e.preventDefault();
   const result = await loginApi(administradores)

   if(result.status !== 200){
      $("button[type='submit']").before(`<div class="alert alert-danger">El usuario o la contraseña es incorrecta</div>`)
   }else{
      localStorage.setItem("ACCESS_TOKEN", result.token)
      localStorage.setItem("ID", result.data._id)
      localStorage.setItem("USUARIO", result.data.usuario)

      window.location.href = "/";
   }

   console.log(result);

  }



  console.log(administradores);
  return (
  <div className="login-page" style={{minHeight:"512.391"}}>
    <div className="login-box">
      <div className="login-logo">
          <b>Gestor Imagenes</b>
      </div>
      <div className="card">
        <div className="card-body login-card-body">
          <p className="login-box-msg">Llena los campos para iniciar sesion</p>
          <form onChange={cambiaForm} onSubmit={login}>
            <div className="input-group mb-3">
              <input type="text" className="form-control" placeholder="usuario" name="usuario" />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-user"></span>
                </div>
              </div>
            </div>
            <div className="input-group mb-3">
              <input type="password" className="form-control" placeholder="Password" name="password"/>
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-lock"></span>
                </div>
              </div>
            </div>
                <button type="submit" className="btn btn-primary btn-block">Ingresar</button>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}

/*=================================================================================
PETICION POST DEL LOGIN
================================================================================= */

const loginApi =  (data) => {
  const url = `${rutaApi}/login`;
  const params = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
    "Content-Type": "application/json"
    }
  }
  return  fetch(url, params).then(response => {
    return response.json();
  }).then(
    result => {
      return result;
    }
  ).catch(err => {
    return err;
  })
}