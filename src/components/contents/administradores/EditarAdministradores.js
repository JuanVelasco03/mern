import React from "react";

import $ from "jquery";
import Swal from 'sweetalert2';
import { rutaApi } from "../../../config/Config";
import { useState } from "react";


export default function EditarAdministradores(){

  // Capturamos los datos.

  const [administradores, editarAdministrador] = useState({
    usuario: "", 
    password: "",
    id : ""
  })

  //onChange

  const cambiaFormPost = e => {
    editarAdministrador({
    ...administradores, [e.target.name]: e.target.value})
  }

  //onSubmit

  const submitPut = async e => {
    $('.alert').remove();

    e.preventDefault();

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

    if(password !== ""){
    const expPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

    if(!expPassword.test(password)){
      $(".invalid-password").show()
      $(".invalid-password").html("Utiliza un formato que coincida con el solicitado.");

      return;
      }
    }

    // Ejecutamos la funcion put
    const result = await putData(administradores);

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
  // Retornamos vista del componente

  // Capturamos datos para editar

  $(document).on("click", ".editarInputs", function(e){
    e.preventDefault();
    let data = $(this).attr("data").split(',');
    $("#editarUsuario").val(data[1])
    
    editarAdministrador({
      "usuario" : $("#editarUsuario").val(),
      "password" : $("#editarPassword").val(),
      "id" : data[0]
    })
  })

  // Capturamos datos para borrar

  $(document).on("click", ".borrarInput", function(e){
    e.preventDefault();
    let data = $(this).attr("data").split(',')[0];

    //Preguntamos si estamos seguro de borrar
    Swal.fire({
      title: '¿Estas seguro de eliminar este registro?',
      text: "Si no lo esta, puede cancelar la accion",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar registro',
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const borrarAdministrador = async () => {

          // Ejecutamos la funcion delete
          const result = await deleteData(data);
    
          if(result.status === 400){
            Swal.fire({
              type: "error",
              title: result.mensaje,
              showConfirmButton: true,
              confirmButtonText: "Cerrar"

            }).then(function(result){
              if(result.value){
              window.location.href = '/';
              }
            })
          }
    
          if(result.status === 200){
            Swal.fire({
              type: "success",
              title: result.mensaje,
              showConfirmButton: true,
              confirmButtonText: "Cerrar"

            }).then(function(result){
              if(result.value){
              window.location.href = '/';
              }
            })
          }
        }
        borrarAdministrador();
      }
    })
  })
  return (
    <div className="modal" id="editarAdmin">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Crear administrador</h4>
            <button type="button" className="close" data-dismiss="modal">&times;</button>
          </div>

          <form onChange={cambiaFormPost} onSubmit={submitPut}>
            <div className="modal-body">
              <div className="form-group">
                  <label className="small text-secondary" htmlFor="editarUsuario">* Minimo dos caracteres, maximos 6 sin numeros</label>
                  <div className="input-group mb-3">
                    <div className="input-group-append input-group-text w-100">
                      <i className="fas fa-user mr-2"></i>
                      <input type="text" 
                      id="editarUsuario" 
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
                  <label className="small text-secondary" htmlFor="editarPassword">* Minimo 8 caracteres, letras en mayuscula, en minuscula y numeros</label>
                  <div className="input-group mb-3 " >
                    <div className="input-group-append input-group-text w-100">
                      <i className="fas fa-key mr-2"></i>
                      <input type="password" 
                      id="editarPassword" 
                      className="form-control" 
                      name="password"
                      placeholder="Ingrese la contraseña" 
                      minLength="8" 
                      pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}" 
                      />
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

//Peticion put de administradores
const putData = data => {
  const url = `${rutaApi}/editar-administrador/${data.id}`;
  const token = localStorage.getItem("ACCESS_TOKEN");
  const params = {
    method: "PUT",
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

//Peticion delete de administradores
const deleteData = data => {
  const url = `${rutaApi}/borrar-administrador/${data}`;
  const token = localStorage.getItem("ACCESS_TOKEN");
  const params = {
    method: "DELETE",
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
