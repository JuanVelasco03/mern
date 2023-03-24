import React, {useState} from 'react';
import {rutaApi} from '../../../config/Config';
import $ from 'jquery';
import notie from 'notie';
import Swal from 'sweetalert2';
// import 'summernote/dist/summernote-lite.css' 
// import 'summernote/dist/summernote-lite.js' 

export default function EditarBorrarArticulos(){

	/*=============================================
	Hook para capturar datos
	=============================================*/

	const [articulo, editarArticulo ] = useState({

		portada: null,
		url:"",
		titulo:"",
		intro:"",
		contenido:"",
		id: ""

	})

	/*=============================================
	OnChange
	=============================================*/

	const cambiaFormPut = e => {

		if($("#editarPortada").val()){

			let portada = $("#editarPortada").get(0).files[0];

			/*=============================================
		    VALIDAMOS EL FORMATO DE LA IMAGEN SEA JPG O PNG
		    =============================================*/

		    if(portada["type"] !== "image/jpeg" && portada["type"] !== "image/png"){

		    	$("#editarPortada").val("");

		    	notie.alert({

				    type: 3,
				    text: '¡ERROR: La imagen debe estar en formato JPG o PNG!',
				    time: 7

				 })

		        $(".previsualizarImg").attr("src", "");

		        return;

		    }else if(portada["size"] > 2000000){

		    	$("#editarPortada").val("");

		    	notie.alert({

				    type: 3,
				    text: '¡ERROR: La imagen no debe pesar más de 2MB!',
				    time: 7

				 })

		        $(".previsualizarImg").attr("src", "");

		        return;

		    }else{

		    	let datosArchivo = new FileReader();
		    	datosArchivo.readAsDataURL(portada);

		    	$(datosArchivo).on("load", function(event){

		    		let rutaArchivo = event.target.result;

		    		$(".previsualizarImg").attr("src", rutaArchivo);
					     
			     	editarArticulo({

						'portada' : portada,
						'url' : articulo.url,
						'titulo' : $("#editarTitulo").val(),
						'intro' : $("#editarIntro").val(),
						'contenido' : $("#editarContenido").val(),
						'id': $("#idArticulo").val()
						
					})
				  		
		    	})

		    }

		}else{

			editarArticulo({

				'portada' : null,
				'url' : articulo.url,
				'titulo' : $("#editarTitulo").val(),
				'intro' : $("#editarIntro").val(),
				'contenido' : $("#editarContenido").val(),
				'id': $("#idArticulo").val()
				
			})

		}

	}

	/*=============================================
	OnSubmit
	=============================================*/

	const submitPut = async e => {

		$('.alert').remove();

		e.preventDefault();	

		articulo.contenido = $("#editarContenido").val();

		const {titulo, intro, contenido} = articulo;

		/*=============================================
		Validamos que el campo no venga vacío
		=============================================*/

		if(titulo === ""){

			$(".invalid-titulo").show();
			$(".invalid-titulo").html("Completa este campo");

			return;
		
		}

		/*=============================================
		Validamos Expresión regular
		=============================================*/

		if(titulo !== ""){

			const expTitulo = /^([0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]).{1,30}$/;

			if(!expTitulo.test(titulo)){

				$(".invalid-titulo").show();
				$(".invalid-titulo").html("Utiliza un formato que coincida con el solicitado");

				return;
			
			}

		}

		/*=============================================
		Validamos que el campo no venga vacío
		=============================================*/

		if(intro === ""){

			$(".invalid-intro").show();
			$(".invalid-intro").html("Completa este campo");

			return;
		
		}

		/*=============================================
		Validamos Expresión regular
		=============================================*/

		if(intro !== ""){

			const expIntro = /^([(\\)\\=\\&\\$\\;\\-\\_\\*\\"\\<\\>\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]).{1,300}$/;

			if(!expIntro.test(intro)){

				$(".invalid-intro").show();
				$(".invalid-intro").html("Utiliza un formato que coincida con el solicitado");

				return;
			
			}
		}

		/*=============================================
		Validamos que el campo no venga vacío
		=============================================*/

		if(contenido === ""){

			$(".invalid-contenido").show();
			$(".invalid-contenido").html("Completa este campo");

			return;
		
		}

		/*=============================================
		Validamos Expresión regular
		=============================================*/

		if(contenido !== ""){

			const expContenido = /^([(\\)\\=\\&\\$\\;\\-\\_\\*\\"\\<\\>\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]).{1,}$/;

			if(!expContenido.test(contenido)){

				$(".invalid-contenido").show();
				$(".invalid-contenido").html("Utiliza un formato que coincida con el solicitado");

				return;
			
			}
		
		}

		/*=============================================
		EJECTUAMOS SERVICIO PUT 
		=============================================*/

		const result = await putData(articulo);

		if(result.status === 400){

			$(".modal-footer").before(`<div class="alert alert-danger">${result.mensaje}</div>`)

		}

		if(result.status === 200){

			$(".modal-footer").before(`<div class="alert alert-success">${result.mensaje}</div>`)
			
			$('button[type="submit"]').remove();

			setTimeout(()=>{window.location.href= "/articulos";},3000)
		}	

	}

	/*=============================================
	CAPTURAMOS DATOS PARA EDITAR
	=============================================*/

	$(document).on("click", ".editarInputs", function(e){

		e.preventDefault();

		let data = $(this).attr("data").split('_,');
		
		$("#idArticulo").val(data[0]);
		$(".previsualizarImg").attr("src", `${rutaApi}/mostrar-img-articulo/${data[4]}+${data[1]}`);		
		$("#editarTitulo").val(data[2]);
		$("#editarIntro").val(data[3]);
		$("#editarUrl").val(data[4]);
		$("#editarContenido").val(data[5]);

		$("#editarContenido").summernote({

			height:350
		
		});

		editarArticulo({

			'portada' : null,
			'url' : data[4],
			'titulo' : data[2],
			'intro' : data[3],
			'contenido' : data[5],
			'id': data[0]
			
		})

	})

	/*=============================================
	Capturar datos para borrar
	=============================================*/

	$(document).on("click", ".borrarRegistro", function(e){

		e.preventDefault();

		let data = $(this).attr("data").split("_,")[0];

		/*=============================================
		PREGUNTAMOS PRIMERO SI ESTAMOS SEGUROS DE BORRAR EL ADMINISTRADOR
		=============================================*/

		Swal.fire({
		  title: '¿Está seguro de eliminar este registro?',
		  text: "¡Si no lo está puede cancelar la acción!",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: '¡Si, eliminar registro!'
		}).then((result) => {
		  if (result.value) {

		  	/*=============================================
			EJECTUAMOS SERVICIO DELETE
			=============================================*/

			const borrarArticulo = async () =>{

				const result = await deleteData(data);

				if(result.status === 400){

					Swal.fire({
	                    type:"error",
	                    title: result.mensaje,
	                    showConfirmButton: true,
	                    confirmButtonText: "Cerrar"
		                    
		            }).then(function(result){

		             	if(result.value){

		             		window.location.href= "/articulos";

		             	}

		            })

				}

				if(result.status === 200){

					Swal.fire({
	                    type:"success",
	                    title: result.mensaje,
	                    showConfirmButton: true,
	                    confirmButtonText: "Cerrar"
		                    
		            }).then(function(result){

		             	if(result.value){

		             		window.location.href= "/articulos";

		             	}

		            })

				}

			}

			borrarArticulo();
	    
		  }

		})		

	})

	/*=============================================
	Retorno de la vista
	=============================================*/
	

	return(

		<div className="modal fade" id="editarArticulo">

			<div className="modal-dialog">

				<div className="modal-content">

					<div className="modal-header">
						<h4 className="modal-title">Editar Artículo</h4>
						<button type="button" className="close" data-dismiss="modal">×</button>
					</div>

					<form onChange={cambiaFormPut} onSubmit={submitPut} encType="multipart/form-data">

						<div className="modal-body">

							<input type="hidden" id="idArticulo" />

							{/*ENTRADA PORTADA*/}

							<div className="form-group">

								<label className="small text-secondary" htmlFor="editarPortada">*Peso Max. 2MB | Formato: JPG o PNG</label>

								<input 
									id="editarPortada"
									type="file" 
									className="form-control-file border" 
									name="portada" 

								/>

								<div className="invalid-feedback invalid-portada"></div>

								<img className="previsualizarImg img-fluid"/>

							</div>

							{/*ENTRADA URL*/}

							<div className="form-group">

								<label className="small text-secondary" htmlFor="editarUrl">La URL no se puede modificar</label>

								<div className="input-group mb-3">
		              
					              <div className="input-group-append input-group-text">               
					                 <i className="fas fa-link"></i>					                 
					              </div>

					              <input 
					              	id="editarUrl"
					              	type="text" 
					              	className="form-control inputUrl text-lowercase" 
					              	name="url"
					              	placeholder="Ingrese la url del artículo*"
					              	pattern="([0-9a-zA-Z-]).{1,50}"
					              	readOnly
					              	/>

					              <div className="invalid-feedback invalid-url"></div>
							
								</div>

							</div>

							{/*ENTRADA TÍTULO*/}

							<div className="form-group">

								<label className="small text-secondary" htmlFor="editarTitulo">* No ingresar caracteres especiales, solo letras y números</label>

								<div className="input-group mb-3">

					              <div className="input-group-append input-group-text">               
					                 <i className="fas fa-heading"></i>
					              </div>

					              <input 
					              	id="editarTitulo"
					              	type="text" 
					              	className="form-control" 
					              	name="titulo" 
					              	placeholder="Ingrese el título*"				
					              	pattern="([0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]).{1,30}" 
					              	required
					              
					              	/>

					              <div className="invalid-feedback invalid-titulo"></div>

								</div>

							</div>

							{/*ENTRADA INTRO*/}

							<div className="form-group">

								<label className="small text-secondary" htmlFor="editarIntro">* No ingresar caracteres especiales, solo letras y números</label>

								<div className="input-group mb-3">
		              
					              <div className="input-group-append input-group-text">               
					                 <i className="fas fa-file-alt"></i>				                 
					              </div>

					              <input 
					              	id="editarIntro"
					              	type="text" 
					              	className="form-control" 
					              	name="intro"
					              	placeholder="Ingrese la Intro del artículo*"
					              	pattern="([(\\)\\=\\&\\$\\-\\_\\*\\<\\>\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]).{1,300}"
					              	required
					              	/>

					              <div className="invalid-feedback invalid-intro"></div>
							
								</div>

							</div>

							{/*ENTRADA CONTENIDO*/}

							<div className="form-group">

								<label className="small text-secondary" htmlFor="editarContenido">Ingrese el contenido del artículo:</label>

								<textarea className="form-control summernote" rows="5" id="editarContenido" name="contenido"></textarea>

							</div>

						</div>

						<div className="modal-footer d-flex justify-content-between">

							<div>
								<button type="button" className="btn btn-danger" data-dismiss="modal">Cerrar</button>
							</div>

							<div>
								<button type="submit" className="btn btn-primary">Guardar</button>
							</div>

						</div>

					</form>

				</div>

			</div>

		</div>


	)


}

/*=============================================
PETICIÓN PUT Artículo
=============================================*/

const putData = data =>{

	const url = `${rutaApi}/editar-articulo/${data.id}`;
	const token = localStorage.getItem("ACCESS_TOKEN");
	
	let formData = new FormData();

	formData.append("archivo", data.portada);	
	formData.append("url", data.url);
	formData.append("titulo", data.titulo);
	formData.append("intro", data.intro);
	formData.append("contenido", data.contenido);

	const params = {

		method: "PUT",
		body:formData,
		headers: {

			"Authorization": token
		}
	}

	return fetch(url, params).then(response => {

		return response.json();

	}).then(result => {

		return result;	

	}).catch(err =>{

		return err.error;

	})

}

/*=============================================
PETICIÓN DELETE SARTÍCULO
=============================================*/

const deleteData = data =>{

	const url = `${rutaApi}/borrar-articulo/${data}`;
	const token = localStorage.getItem("ACCESS_TOKEN");
	const params = {

		method: "DELETE",
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
