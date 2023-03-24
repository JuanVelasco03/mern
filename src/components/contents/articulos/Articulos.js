import React from 'react';
import {rutaApi} from '../../../config/Config';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-responsive';



import CrearArticulos from './CrearArticulos';
import EditarBorrarArticulos from './EditarBorrarArticulos';

export default function Articulos(){

	
	const dataArticulos = async()=>{

		/*=============================================
		CREAMOS EL DATASET
		=============================================*/	

		const getArticulos = await getData();

		const dataSet = [];		

		getArticulos.data.forEach((articulo, index)=>{

			dataSet[index] = [(index+1),
								articulo.url+"+"+articulo.portada,
								articulo.url,
								articulo.titulo,
								articulo.intro,
								articulo.contenido,
								[articulo._id+"_",
								articulo.portada+"_",
								articulo.titulo+"_",
								articulo.intro+"_",
								articulo.url+"_",
								articulo.contenido
								]];

		})

		/*=============================================
		EJECUTAMOS DATATABLE
		=============================================*/	

		$(document).ready( function () {

			let tablaArticulos = $('.table').DataTable({

				data: dataSet,

				"columnDefs":[{

					"searchable":true,
					"orderable":true,
					"targets":0

				}],

				"order":[[0, "desc"]],

				columns: [
		            { title: "#" },
		            { title: "Portada",
		              render: function(data){

		              	return `<img src="${rutaApi}/mostrar-img-articulo/${data}" style="width:320px">`

		              }
		            },
		            { title: "URL" },
		            { title: "Título" },
		            { title: "Intro" },
		            { title: "Contenido" },
		            { title: "Acciones",
		              render: function(data){

		              	return `
							
							<a href="" class="editarInputs" data-toggle="modal" data-target="#editarArticulo" data='${data}'>

								<svg style="color:black; background:orange; border-radius:100%; width:35px; line-height:35px; text-align:center; padding:8px"

								aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pencil-alt" class="svg-inline--fa fa-pencil-alt fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path></svg>


							</a>

							<a href="" class="borrarRegistro" data='${data}'>

								
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

		        }
			});

			tablaArticulos.on("order.dt search.dt", function(){

				tablaArticulos.column(0, {search:"applied", order:"applied"})
				.nodes()
				.each(function(cell, i){

					cell.innerHTML = i+1

				})
			
			}).draw();

		})

	}

	dataArticulos();

	/*=============================================
	RETORNAMOS LA VISTA DEL COMPONENTE
	=============================================*/	

	return(

		<div className="content-wrapper" style={{minHeight: "494px" }}>

			<div className="content-header">

				<div className="container-fluid">

					<div className="row mb-2">
					
						<div className="col-sm-6">

							<h1 className="m-0 text-dark">Gestor Artículos</h1>

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

									<h5 className="m-0">

										<button className="btn btn-primary" data-toggle="modal" data-target="#crearArticulo">Crear nuevo artículo</button>

									</h5>

								</div>

								<div className="card-body">

									<table className="table table-striped dt-responsive" style={{"width":"100%"}}>

									{
										
										// <thead>
										// 	<tr>
										// 		<th>#</th>
										// 		<th>Portada</th>
										// 		<th>URL</th>
										// 		<th>Título</th>
										// 		<th>Intro</th>
										// 		<th>Contenido</th>
										// 		<th>Acciones</th>	
										// 	</tr>
										// </thead>

										// <tbody>
										// 	<tr>
										// 		<td>1</td>
										// 		<td>
										// 			<img src={Portada01} className="img-fluid" />
										// 		</td>
										// 		<td>
										// 			lorem-ipsum-1
										// 		</td>
										// 		<td>
										// 			Lorem Ipsum 1
										// 		</td>
										// 		<td>
										// 			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae accusa...
										// 		</td>
										// 		<td>
										// 			<h2>Lorem Ipsum 1</h2><img src="http://localhost:4000/mostrar-img/4810.jpg" className="py-3 img-fluid"/><div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam maxime id expedita commodi? Eius, accusantium neque placeat facere minus deserunt praesentium dolorem nulla nihil consectetur aliquid, quos quo quas reiciendis. Non dolorem, tempora rem obcaecati corporis. Nesciunt aliquid excepturi, sint odio. Vitae ipsum aliquid aperiam itaque repellat, maiores voluptatibus debitis dignissimos voluptas voluptates dolore, veritatis exercitationem dolorum eos, quae sunt.</div><br/><div>Voluptatum nobis delectus laborum corporis. Laborum asperiores voluptatum enim commodi nobis. Doloremque eligendi nisi amet maiores nihil iure dignissimos, labore iusto. Ut quas molestiae nihil reiciendis qui obcaecati totam facilis.</div><br/><div>Quo eum deleniti iure animi quod numquam autem, vitae fugiat, molestias cum repellat omnis, ea explicabo aspernatur. Earum asperiores quod, corrupti ipsa ullam aut eligendi dolor vero necessitatibus, architecto nostrum.</div><br/><div>Culpa similique necessitatibus velit perspiciatis quibusdam modi minima ab eligendi, nulla recusandae, maxime quis adipisci officia totam rem rerum ea voluptatem placeat ad amet cum corrupti! Sed, fugiat et nulla.</div>
										// 		</td>
										// 		<td>
										// 			<div className="btn-group">
					
										// 			  <button type="button" className="btn btn-warning rounded-circle mr-2">
										// 			  	<i className="nav-icon fas fa-pencil-alt"></i>
										// 			  </button>

										// 			  <button type="button" className="btn btn-danger rounded-circle">
										// 			  	<i className="nav-icon fas fa-trash"></i>
										// 			  </button>
													  
										// 			</div>
										// 		</td>	
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

			{/*=============================================
			VENTANA MODAL PARA LA CREACIÓN DE DATOS
			=============================================*/}

			<CrearArticulos/>

			{/*=============================================
			VENTANA MODAL PARA LA EDICIÓN DE DATOS
			=============================================*/}

			<EditarBorrarArticulos/>

		</div>

	)

}

/*=============================================
PETICIÓN GET ARTÍCULOS
=============================================*/	

const getData = ()=>{

	const url = `${rutaApi}/mostrar-articulos`;

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