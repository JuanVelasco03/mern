import React from "react";

export default function Error404 (){
  return(
    <div className="content-wrapper" style={{minHeight:"1589.56px"}}>
      <section className="content">
        <div className="error-page">
          <h2 className="headline text-warning"> 404 </h2>

          <div className="error-content pt-4">
            <h3>
              <i className="fas fa-exclamation-triangle text-warning"></i>{""}
              Oops! Pagina no encontrada
            </h3>
          </div>
        </div>
      </section>
    </div>
  );
}