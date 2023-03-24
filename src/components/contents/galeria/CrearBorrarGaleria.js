import React, { useState } from 'react';
import {rutaApi} from '../../../config/Config';
import $ from 'jquery';
import notie from 'notie';
import Swal from 'sweetalert2';

export default function CrearBorrarGaleria(){

  const [galeria, crearGaleria] = useState({
		foto:  null
	})

  const cambiaFormPost = e => {

		let fotos = $("#foto").get(0).files;

		for(let i = 0; i < fotos.length; i++){
		
			/*=============================================
		    VALIDAMOS EL FORMATO DE LA foto SEA JPG O PNG
		    =============================================*/

		    if(fotos[i]["type"] !== "image/jpeg" && fotos[i]["type"] !== "image/png"){

		    	$("#foto").val("");

		    	notie.alert({

		    		type: 3,
		    		text:'¡ERROR: La foto debe estar en formato JPG o PNG!',
		    		time: 7


		    	})

		    	$(".vistaGaleria").html("");

		    	return;

		    }else if(fotos[i]["size"] > 2000000){

		    	$("#foto").val("");

		    	notie.alert({

		    		type: 3,
		    		text:'¡ERROR: La foto no debe pesar más de 2MB!',
		    		time: 7


		    	})

		    	$(".vistaGaleria").html("");	

		    	return;

		    }else{

		    	let datosArchivo = new FileReader();
		    	datosArchivo.readAsDataURL(fotos[i]);

		    	$(datosArchivo).on("load", function(event){

		    		let rutaArchivo = event.target.result;		
		    		
		    		$(".vistaGaleria").append(`

						<div class="col-6 pt-2">

							<img src="${rutaArchivo}" class="img-fluid">

						</div>

		    		`)

		    		crearGaleria({

		    			'foto': fotos
		    		
		    		})

		    	})
		    	    	
		    }

		}
		
	}


  const submitPost = async e => {
		e.preventDefault();	

    console.log('galeria:', galeria)

    const {foto} = galeria;

    for(let i = 0; i < foto.length; i++){

      /*=============================================
      Validamos si no viene imagen Slide
      =============================================*/

      $('.alert').remove();

      if(foto[i] === null){

        $(".invalid-imagen").show();
        $(".invalid-imagen").html("Este campo no puede ir vacio");

        return;

      }

      /*=============================================
      EJECTUAMOS SERVICIO POST 
      =============================================*/

      const result = await postData(foto[i]);

      if(result.status === 400){

        $(".modal-footer").before(`<div class="alert alert-danger">${result.mensaje}</div>`)
      
      }

      if(result.status === 200){

        $(".modal-footer").before(`<div class="alert alert-success mx-3">${result.mensaje}</div>`)

        $('button[type="submit"]').remove();

        setTimeout(()=>{window.location.href= "/galeria";},3000)

      }
    }
  }

  //Limpiar formulario

  $(document).on("click", ".limpiarFormulario", function(){

		$(".modal").find('form')[0].reset();

    $(".vistaGaleria").html("");	

	})

    //Capturamos datos para borrar
	$(document).on("click", ".borrarRegistro", function(e){
		e.preventDefault();
		let data = $(this).attr("data")
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
        const borrarGaleria = async () => {

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
              window.location.href = '/galeria';
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
              window.location.href = '/galeria';
              }
            })
          }
        }
        borrarGaleria();
      }
    })
	})

  return(
    <div className="modal fade" id="crearGaleria">
      <div className="modal-dialog content">
        <div className="modal-content">

          <div className="modal-header">
            <h4 className="modal-title">Crear Galeria</h4>
            <button type='button' className='close' data-dismiss="modal">x</button>
          </div>
          <form onChange={cambiaFormPost} onSubmit={submitPost} encType="multipart/form-data">

            <div className="modal-body">
            {/* //Entrada para las fotos */}
              <div className="form-group">
              <label className="small text-secondary" htmlFor="foto">*Peso Max. 2MB | Formato: JPG o PNG</label>
              <input 
                id="foto"
                type="file" 
                className="form-control-file border" 
                name="foto"
                multiple 
                required
              />
              <div className="invalid-feedback invalid-foto"></div>

              <div className='vistaGaleria row'></div>
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
  );
}

/*=============================================
PETICIÓN POST SLIDE
=============================================*/

const postData = data =>{

	const url = `${rutaApi}/crear-galeria`;
	const token = localStorage.getItem("ACCESS_TOKEN");
	
	let formData = new FormData();

	formData.append("archivo", data);


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

//Peticion delete de administradores
const deleteData = data => {
  const url = `${rutaApi}/borrar-galeria/${data}`;
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