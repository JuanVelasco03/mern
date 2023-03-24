import React, { useState } from 'react';
import {rutaApi} from '../../../config/Config';
import $ from 'jquery';
import notie from 'notie';
import 'notie/dist/notie.css';

export default function CrearSlide(){

	/*=============================================
	HOOK para capturar datos
	=============================================*/

	const [slide, crearSlide] = useState({

		imagen:  null,
		titulo: "",
		descripcion: ""

	})

	/*=============================================
	OnChange
	=============================================*/

	const cambiaFormPost = e => {

		let imagen = $("#imagen").get(0).files[0];
		
		/*=============================================
	    VALIDAMOS EL FORMATO DE LA IMAGEN SEA JPG O PNG
	    =============================================*/

	    if(imagen["type"] !== "image/jpeg" && imagen["type"] !== "image/png"){

	    	$("#imagen").val("");

	    	notie.alert({

	    		type: 3,
	    		text:'¡ERROR: La imagen debe estar en formato JPG o PNG!',
	    		time: 7


	    	})

	    	$(".previsualizarImg").attr("src", "");

	    	return;

	    }else if(imagen["size"] > 2000000){

	    	$("#imagen").val("");

	    	notie.alert({

	    		type: 3,
	    		text:'¡ERROR: La imagen no debe pesar más de 2MB!',
	    		time: 7


	    	})

	    	$(".previsualizarImg").attr("src", "");	

	    	return;

	    }else{

	    	let datosArchivo = new FileReader();
	    	datosArchivo.readAsDataURL(imagen);

	    	$(datosArchivo).on("load", function(event){

	    		let rutaArchivo = event.target.result;		
	    		
	    		$(".previsualizarImg").attr("src", rutaArchivo)

	    		crearSlide({

	    			'imagen': imagen,
	    			'titulo': $("#titulo").val(),
	    			'descripcion': $("#descripcion").val()

	    		})

	    	})
	    	    	
	    }

	}

	/*=============================================
	OnSubmit
	=============================================*/

	const submitPost = async e => {

		$('.alert').remove();

		e.preventDefault();	

		const {imagen, titulo, descripcion} = slide;

		/*=============================================
		Validamos si no viene imagen Slide
		=============================================*/

		if(imagen === null){

			$(".invalid-imagen").show();
			$(".invalid-imagen").html("La imagen no puede ir vacía");

			return;

		}

		/*=============================================
		Validamos Expresión regular del titulo
		=============================================*/

		if(titulo !== ""){

			const expTitulo = /^([0-9a-zA-Z ]).{1,30}$/;

			if(!expTitulo.test(titulo)){

				$(".invalid-titulo").show();
				$(".invalid-titulo").html("Utiliza un formato que coincida con el solicitado");

				return;
			
			}
		}

		/*=============================================
		Validamos Expresión regular de la descripcion
		=============================================*/

		if(descripcion !== ""){

			const expDescripcion = /^([0-9a-zA-Z ]).{1,100}$/;

			if(!expDescripcion.test(descripcion)){

				$(".invalid-descripcion").show();
				$(".invalid-descripcion").html("Utiliza un formato que coincida con el solicitado");

				return;
			
			}
		}

		/*=============================================
		EJECTUAMOS SERVICIO POST 
		=============================================*/

		const result = await postData(slide);

		if(result.status === 400){

			$(".modal-footer").before(`<div class="alert alert-danger">${result.mensaje}</div>`)
		
		}

		if(result.status === 200){

			$(".modal-footer").before(`<div class="alert alert-success mx-3">${result.mensaje}</div>`)

			$('button[type="submit"]').remove();

			setTimeout(()=>{window.location.href= "/slide";},3000)

		}
		
	}

	/*=============================================
	Limpiar Formulario
	=============================================*/

	$(document).on("click", ".limpiarFormulario", function(){

		$(".modal").find('form')[0].reset();

		$(".previsualizarImg").attr("src", "");

	})

	/*=============================================
	Retorno de la vista
	=============================================*/

	return(

		<div className="modal fade" id="crearSlide">

			<div className="modal-dialog">

				<div className="modal-content">

					<div className="modal-header">
						<h4 className="modal-title">Crear Slide</h4>
						<button type="button" className="close" data-dismiss="modal">×</button>
					</div>

					<form onChange={cambiaFormPost} onSubmit={submitPost} encType="multipart/form-data">

						<div className="modal-body">

							{/*ENTRADA IMAGEN*/}

							<div className="form-group">

								<label className="small text-secondary" htmlFor="imagen">*Peso Max. 2MB | Formato: JPG o PNG</label>

								<input 
									id="imagen"
									type="file" 
									className="form-control-file border" 
									name="imagen" 
									required
								/>

								<div className="invalid-feedback invalid-imagen"></div>

								<img className="previsualizarImg img-fluid"/>

							</div>

							{/*ENTRADA TÍTULO*/}

							<div className="form-group">

								<label className="small text-secondary" htmlFor="titulo">* No ingresar caracteres especiales, solo letras y números</label>

								<div className="input-group mb-3">

					              <div className="input-group-append input-group-text">               
					                 <i className="fas fa-heading"></i>
					              </div>

					              <input 
					              	id="titulo"
					              	type="text" 
					              	className="form-control" 
					              	name="titulo" 
					              	placeholder="Ingrese el título*"				
					              	pattern="([0-9a-zA-Z ]).{1,30}" 
					              
					              	/>

					              <div className="invalid-feedback invalid-titulo"></div>

								</div>

							</div>

							{/*ENTRADA DESCRIPCIÓN*/}

							<div className="form-group">

								<label className="small text-secondary" htmlFor="descripcion">* No ingresar caracteres especiales, solo letras y números</label>

								<div className="input-group mb-3">
		              
					              <div className="input-group-append input-group-text">               
					                 <i className="fas fa-file-alt"></i>
					              </div>

					              <input 
					              	id="descripcion"
					              	type="text" 
					              	className="form-control" 
					              	name="descripcion"
					              	placeholder="Ingrese la descripcion*"
					              	pattern="([0-9a-zA-Z ]).{1,100}"
					              	/>

					              <div className="invalid-feedback invalid-descripcion"></div>
							
								</div>

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
PETICIÓN POST SLIDE
=============================================*/

const postData = data =>{

	const url = `${rutaApi}/crear-slide`;
	const token = localStorage.getItem("ACCESS_TOKEN");
	
	let formData = new FormData();

	formData.append("archivo", data.imagen);
	formData.append("titulo", data.titulo);
	formData.append("descripcion", data.descripcion);


	const params = {

		method: "POST",
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