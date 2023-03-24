import React from "react";

import $ from "jquery";

import { rutaApi } from "../../../config/Config";
import { useState } from "react";


export default function CrearAdministradores(){

  //Capturamos los datos.

  const [administradores, crearAdministrador] = useState({
    usuario: "", 
    password: ""
  })

  //onChange

  const cambiaFormPost = e => {
    crearAdministrador({
    ...administradores, [e.target.name]: e.target.value})
  }

  //onSubmit

  const submitPost = async e => {
    $('.alert').remove();

    e.preventDefault();
    console.log("admins", administradores);

    const {usuario, password} = administradores;
    // Validamos que el campo usuario no venga vacio.
    if(usuario === ""){
      $(".invalid-usuario").show()
      $(".invalid-usuario").html("Completa este campo");
      return;
    }

    const expUsuario = /^(?=.*[A-Za-z]).{2,6}$/;

    if(!expUsuario.test(usuario)){
      $(".invalid-usuario").show()
      $(".invalid-usuario").html("Utiliza un formato que coincida con el solicitado.");

      return;
    }

    const expPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

    if(!expPassword.test(password)){
      $(".invalid-password").show()
      $(".invalid-password").html("Utiliza un formato que coincida con el solicitado.");

      return;
    }

    //Ejecutamos la funcion POST
    const result = await postData(administradores);

    if(result.status === 400){
      $(".modal-footer").before(`<div class="alert alert-danger">${result.mensaje}</div>`)
    }

    if(result.status === 200){
      $(".modal-footer").before(`<div class="alert alert-success">${result.mensaje}</div>`)
      $('button[type="submit"]').remove();

      setTimeout(() => {window.location.href= "/";}, 3000); 
    }
  }


  console.log(administradores);
  //Retornamos vista del componente
  return (
    <div className="modal" id="crearAdmin">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Crear administrador</h4>
            <button type="button" className="close" data-dismiss="modal">&times;</button>
          </div>

          <form  onChange={cambiaFormPost} onSubmit={submitPost}>
            <div className="modal-body">
              <div className="form-group">
                  <label className="small text-secondary" htmlFor="usuario">* Minimo dos caracteres, maximos 6 sin numeros</label>
                  <div className="input-group mb-3">
                    <div className="input-group-append input-group-text w-100">
                      <i className="fas fa-user mr-2"></i>
                      <input type="text" 
                      id="usuario" 
                      className="form-control text-lowercase" 
                      name="usuario"
                      placeholder="Ingrese el usuario" 
                      minLength="2" 
                      maxLength="6" 
                      pattern="(?=.*[A-Za-z]).{2,6}" 
                      required/>
                      <div className="invalid-feedback invalid-usuario"></div>
                    </div> 
                  </div>
              </div>

              <div className="form-group">
                  <label className="small text-secondary" htmlFor="password">* Minimo 8 caracteres, letras en mayuscula, en minuscula y numeros</label>
                  <div className="input-group mb-3 " >
                    <div className="input-group-append input-group-text w-100">
                      <i className="fas fa-key mr-2"></i>
                      <input type="password" 
                      id="password" 
                      className="form-control" 
                      name="password"
                      placeholder="Ingrese la contraseña" 
                      minLength="8" 
                      pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}" 
                      required/>
                      <div className="invalid-feedback invalid-usuario"></div>
                    </div> 
                  </div>
              </div>
            </div>

            <div className="modal-footer d-flex justify-content-between">
              <div>
                <button type="button" className="btn btn-danger" data-dismiss="modal">Cerrar</button>
              </div>
              <div>
                <button type="submit" className="btn btn-primary">Enviar</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

//Peticion post de administradores

const postData = data => {
  const url = `${rutaApi}/crear-administrador`;
  const token = localStorage.getItem("ACCESS_TOKEN");
  const params = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Authorization": token, 
      "Content-Type" : "application/json"
    }
  }

  return fetch(url, params)
  .then(response => {
    return response.json();

  }).then(result => {
    return result;

  }).catch(err => {
    return err;

  })
} 
