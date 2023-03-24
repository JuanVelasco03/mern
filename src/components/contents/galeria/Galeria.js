import {React, useState} from "react";
import {rutaApi} from '../../../config/Config';
import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-bs4'
import 'datatables.net-responsive'
import CrearBorrarGaleria from "./CrearBorrarGaleria";


export default function Galeria(){


    const dataGaleria = async()=>{
  
      /*=============================================
      CREAMOS EL DATASET
      =============================================*/	
  
      const getGaleria = await getData();
  
      const dataSet = [];		
  
      getGaleria.data.forEach((galeria, index)=>{
  
        dataSet[index] = [(index+1),
                  galeria.foto,
                  galeria._id,
                  ];
  
      })
  
      /*=============================================
      EJECUTAMOS DATATABLE
      =============================================*/	
  $(document).ready(function(){
    $('.table').dataTable({
      data: dataSet,
      columns: [
        { title: "#" },
        { title: "Foto", 
        render: function(data){
          return `<img src="${rutaApi}/mostrar-img-galeria/${data}" style="width:320px">`

          }  
        },
        { title: "Acciones",
          render: function(data){
            return `

            <a href="" class="borrarRegistro" data="${data}">

              
              <svg style="color:white; background:#dc3545; border-radius:100%; width:35px; line-height:35px; text-align:center; padding:12px"

              aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash-alt" class="svg-inline--fa fa-trash-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path></svg>
            </a>`
          }
        }
    ],
      "language": {

      "sProcessing":     "Procesando...",
      "sLengthMenu":     "Mostrar _MENU_ registros",
      "sZeroRecords":    "No se encontraron resultados",
      "sEmptyTable":     "Ningún dato disponible en esta tabla",
      "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
      "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0",
      "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
      "sInfoPostFix":    "",
      "sSearch":         "Buscar:",
      "sUrl":            "",
      "sInfoThousands":  ",",
      "sLoadingRecords": "Cargando...",
      "oPaginate": {
          "sFirst":    "Primero",
          "sLast":     "Último",
          "sNext":     "Siguiente",
          "sPrevious": "Anterior"
      },
      "oAria": {
              "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
              "sSortDescending": ": Activar para ordenar la columna de manera descendente"
      }

    }});
  })
	}
	dataGaleria();

	/*=============================================
	RETORNAMOS LA VISTA DEL COMPONENTE
	=============================================*/	

  return(
    <div className="content-wrapper " style={{minHeight: "494px"}}>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0 text-dark">Gestor Galeria</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="container-fluid">
            <div className="row mb-2">
            <div className="col-lg-12">
                <div className="card card-primary card-outline">
                  <div className="card-header">
                    <button className="btn btn-primary mt-2 mb-2 limpiarFormulario" data-toggle="modal" data-target="#crearGaleria">Crear nueva foto</button>
                    <h5 className="m-0">Featured</h5>
                  </div>
                  <div className="card-body">
                      <table className="table table-striped dt-responsive" style={{"width":"100%"}}>
{/* {                        <thead>
                          <tr>
                            <th>#</th>
                            <th style={{"width":"320px"}}>Foto</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td><img src={foto01} alt="img" width="320px"/></td>
                            <td><div>
                              <button type="button" className="btn btn-warning rounded-circle mr-2">
                                <i className="nav-icon fas fa-pencil-alt"></i>  
                              </button>  
                              <button type="button" className="btn btn-danger rounded-circle ">
                                <i className="nav-icon fas fa-trash"></i>  
                              </button>  
                            </div></td>
                          </tr>
                        </tbody>} */}
                      </table>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      <CrearBorrarGaleria />
    </div>
  );
}

/*=============================================
PETICIÓN GET GALERIA
=============================================*/	

const getData = ()=>{

	const url = `${rutaApi}/mostrar-galeria`;

	const params = {

		method: "GET",
		headers: {
			"Content-Type": "application/json"
		}

	}

	return fetch(url, params).then(response=>{

		return response.json();

	}).then(result=>{

		return result;

	}).catch(err=>{

		return err;

	})

}