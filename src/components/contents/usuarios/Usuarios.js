import React from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-responsive';
import { rutaApi } from '../../../config/Config';

export default function Usuarios(){

	const dataUsuarios = async()=>{

		/*=============================================
		CREAMOS EL DATASET
		=============================================*/	

		const getUsuarios = await getData();

		const dataSet = [];		

		getUsuarios.data.forEach((usuario, index)=>{

			dataSet[index] = [(index+1),
								usuario.usuario,
								usuario.email];

		})

		/*=============================================
		EJECUTAMOS DATATABLE
		=============================================*/	

		$(document).ready( function () {

			let tablaUsuarios = $('.table').DataTable({

				data: dataSet,

				"columnDefs":[{

					"searchable":true,
					"orderable":true,
					"targets":0

				}],

				"order":[[0, "desc"]],

				columns: [
		            { title: "#" },
		            { title: "Usuario" },
		            { title: "Email" }
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

		        }
			});

			tablaUsuarios.on("order.dt search.dt", function(){


				tablaUsuarios.column(0, {search:"applied", order:"applied"})
				.nodes()
				.each(function(cell, i){

					cell.innerHTML = i+1

				})
			
			}).draw();

		})

	}

	dataUsuarios();

	/*=============================================
	RETORNAMOS LA VISTA DEL COMPONENTE
	=============================================*/	

	return(

		<div className="content-wrapper" style={{minHeight: "494px" }}>

			<div className="content-header">

				<div className="container-fluid">

					<div className="row mb-2">
					
						<div className="col-sm-6">

							<h1 className="m-0 text-dark">Usuarios</h1>

						</div>
					
					</div>

				</div>

			</div>

			<div className="content">

				<div className="container-fluid">

					<div className="row">
						
						<div className="col-lg-12">

							<div className="card card-primary card-outline">

								<div className="card-header">
		

								</div>

								<div className="card-body">

									<table className="table table-striped dt-responsive" style={{"width":"100%"}}>
										
									{
										// <thead>
										// 	<tr>
										// 		<th>#</th>
										// 		<th>Usuario</th>
										// 		<th>Email</th>
													
										// 	</tr>
										// </thead>

										// <tbody>
										// 	<tr>
										// 		<td>1</td>
										// 		<td>juanito</td>
										// 		<td>juanito@gmail.com</td>
												
										// 	</tr>
										// </tbody>
									}

									</table>

								</div>

							</div>

						</div>

					</div>

				</div>

			</div>

		</div>

	)

}

/*=============================================
PETICIÓN GET ADMINISTRADORES
=============================================*/	

const getData = ()=>{

	const url = `${rutaApi}/mostrar-usuarios`;
	const token = localStorage.getItem("ACCESS_TOKEN");

	const params = {

		method: "GET",
		headers: {

			"Authorization": token,
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