import React, { useState } from 'react';
import {rutaApi} from '../../../config/Config';
import $ from 'jquery';
import notie from 'notie';
import Swal from 'sweetalert2';


export default function EditaBorarSlide(){

  //hook para capturar datos
  const [slide, editarSlide] = useState({
    archivo:  null,
		titulo: "",
		descripcion: "",
    id: ""
  })

  //onChange
  const cambiaFormPut = e => {

    if($("#editarImagen").val()){
      let imagen = $("#editarImagen").get(0).files[0];
	
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

	    		editarSlide({

	    			'imagen': imagen,
	    			'titulo': $("#editarTitulo").val(),
	    			'descripcion': $("#editarDescripcion").val(),
            'id':$("#editarId").val()

	    		})

	    	})
	    	    	
	    }

    }else{
      editarSlide({
        'imagen': null,
        'titulo': $("#editarTitulo").val(),
        'descripcion': $("#editarDescripcion").val(),
        'id':$("#editarId").val()
      })
    }

    
  }

  //onSubmit
  const submitPut = async e => {
    $('.alert').remove();
    e.preventDefault();

		const {imagen, titulo, descripcion, id} = slide;

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

    //Ejecutamos el servicion put

		const result = await putData(slide, slide.id);
		console.log('slide:', slide.id)


		if(result.status === 400){

			$(".modal-footer").before(`<div class="alert alert-danger">${result.mensaje}</div>`)

		}

		if(result.status === 200){

			$(".modal-footer").before(`<div class="alert alert-success mx-3">${result.mensaje}</div>`)

			$('button[type="submit"]').remove();

			setTimeout(()=>{window.location.href= "/slide";},3000)

		}


  }

  //Capturamos datos para editar
  $(document).on("click", ".editarInputs", function(e){

    e.preventDefault()

    let data = $(this).attr("data").split("_,");

    $("#editarId").val(data[0]);
    $(".previsualizarImg").attr("src", `${rutaApi}/mostrar-img/${data[1]}`)
    $("#editarTitulo").val(data[2]);
    $("#editarDescripcion").val(data[3]);

		editarSlide({

			'imagen': null,
			'titulo': data[2],
			'descripcion': data[3],
			'id': data[0]

		})

  })

  //Capturamos datos para borrar
	$(document).on("click", ".borrarRegistro", function(e){
		e.preventDefault();
		let data = $(this).attr("data").split("_,")[0]
		console.log('data:', data)

		Swal.fire({
      title: '¿Estas seguro de eliminar este slide?',
      text: "Si no lo esta, puede cancelar la accion",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar registro',
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const borrarSlide = async () => {

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
              window.location.href = '/slide';
              }
            })
          }
        }
        borrarSlide();
      }
    })
	})


  /*=============================================
	Retorno de la vista
	=============================================*/
  return(

		<div className="modal fade" id="editarSlide">

			<div className="modal-dialog">

				<div className="modal-content">

					<div className="modal-header">
						<h4 className="modal-title">Editar Slide</h4>
						<button type="button" className="close" data-dismiss="modal">×</button>
					</div>

					<form onChange={cambiaFormPut} onSubmit={submitPut} encType="multipart/form-data">

						<div className="modal-body">

							<input type="hidden" id="editarId"/>

							{/*ENTRADA IMAGEN*/}

							<div className="form-group">

								<label className="small text-secondary" htmlFor="editarImagen">*Peso Max. 2MB | Formato: JPG o PNG</label>

								<input 
									id="editarImagen"
									type="file" 
									className="form-control-file border" 
									name="imagen" 
								/>

								<div className="invalid-feedback invalid-imagen"></div>

								<img className="previsualizarImg img-fluid"/>

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
					              	pattern="([0-9a-zA-Z ]).{1,30}" 
					              
					              	/>

					              <div className="invalid-feedback invalid-titulo"></div>

								</div>

							</div>

							{/*ENTRADA DESCRIPCIÓN*/}

							<div className="form-group">

								<label className="small text-secondary" htmlFor="editarDescripcion">* No ingresar caracteres especiales, solo letras y números</label>

								<div className="input-group mb-3">
		              
					              <div className="input-group-append input-group-text">               
					                 <i className="fas fa-file-alt"></i>
					              </div>

					              <input 
					              	id="editarDescripcion"
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

//Peticion put para el slide

const putData = (data, id) =>{

  
	const url = `${rutaApi}/editar-slide/${data.id}`;
	const token = localStorage.getItem("ACCESS_TOKEN");

  console.log(data);
	
	let formData = new FormData();

	formData.append("archivo", data.imagen);
	formData.append("titulo", data.titulo);
	formData.append("descripcion", data.descripcion);


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

//Peticion delete de administradores
const deleteData = data => {
  const url = `${rutaApi}/borrar-slide/${data}`;
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