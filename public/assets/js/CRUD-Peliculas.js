var nombre = localStorage.getItem("name");
var token = localStorage.getItem("token");


const validateTxt = (txt) => { 
 
    if (txt.length === 0) {
        document.querySelector("#alertas").innerHTML = 
    `<div class="alert alert-danger" role="alert">
       El campo "Titulo de la pelicula" es requerido
     </div>`;
     document.querySelector("#alertas2").innerHTML = 
     `<div class="alert alert-danger" role="alert">
        El campo "Titulo de la pelicula" es requerido
      </div>`;
       return false
    } 
    return true
 };


const checarSesion = ()=>{
    if(nombre == null){
    location.href="./Login.html";
    }
    document.querySelector("#usuario").innerHTML = nombre;
};

const cerrarSesion = ()=>{
    localStorage.clear();
    location.href="./Login.html";
};

const cargarPeliculas = async()=>{

    let respuesta = await fetch("http://localhost:8080/api/trailer/?limit=15",{
        credentials: 'same-origin',
        headers: {
        'Content-Type': 'application/json'}
    });
    let RegistrosHTML=``;
    let resultado = await respuesta.json();

    let contador = 0;

    await console.log(resultado);

    resultado.trailers.forEach(fila => {

        RegistrosHTML+=`
        <tr class="justify-content-center">
        <td hidden>${resultado.trailers[contador].uid}</td>
        <td>${resultado.trailers[contador].title}</td>
        <td>${resultado.trailers[contador].year}</td>
        <td>${resultado.trailers[contador].directors}</td>
        <td>${resultado.trailers[contador].cast}</td>
        <td>${resultado.trailers[contador].rating}</td>
        <td><img src="${resultado.trailers[contador].img.imgURL}" alt="" width = "200px"></td>
        <td><iframe width="auto" src="${resultado.trailers[contador].trailer_link}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></td>
        <td><button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#editarModal" onclick="buscarPeliculaPorId('${resultado.trailers[contador].uid}')"><i class="bi bi-pencil-square p-1"></i></i></button></td>
        <td><button class="btn btn-danger" onclick="eliminarPelicula('${resultado.trailers[contador].uid}')"><i class="bi bi-trash p-1"></i></i></button></td>
        </tr>
        `
        contador++;
    });

    document.querySelector("#ListaPeliculas").innerHTML = RegistrosHTML;
};


document.querySelector("#agregarForm").addEventListener("submit", async function(e){

    e.preventDefault();

    let title = document.querySelector("#title").value;
    let year = parseInt(document.querySelector("#year").value);
    let directors = document.querySelector("#director").value;
    let cast = document.querySelector("#cast").value;
    let rating = parseInt(document.querySelector("#rating").value);
    const img = document.querySelector("#img");
    let trailer_link = document.querySelector("#link").value;
    
    if(validateTxt(title) == true){
    
        const datos = new FormData();
        
        await console.log(img.files);

        await datos.append("title", title);
        await datos.append("year", year);
        await datos.append("directors", directors);
        await datos.append("cast", cast);
        await datos.append("rating", rating);
        await datos.append("img", img.files[0]);
        await datos.append("trailer_link", trailer_link);
        
        let respuesta = await fetch("http://localhost:8080/api/trailer",{
            method: 'POST',
            mode: 'cors',
            body: datos,
            credentials: 'same-origin',
            headers: {
            "x-token":token}
        });
    
        cargarPeliculas();
    };

});

// const agregarPelicula = async() =>{
// }; 

const eliminarPelicula = async (peliculaID)=>{

    let respuesta = await fetch("http://localhost:8080/api/trailer/"+peliculaID,{
        method: 'DELETE',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
        'Content-Type': 'application/json',
        "x-token":token}
    });

    cargarPeliculas();
};

const buscarPeliculaPorId = async (peliculaID)=>{

    let respuesta = await fetch("http://localhost:8080/api/trailer/"+peliculaID,{
        method: 'GET',
        credentials: 'same-origin',
        headers: {
        'Content-Type': 'application/json',
        "x-token":token}
    });
    console.log(respuesta);
    let resultado = await respuesta.json();
    console.log(resultado);
    document.querySelector("#idPelicula").value = resultado.trailer.uid;
    document.querySelector("#titleEditar").value = resultado.trailer.title;
    document.querySelector("#yearEditar").value = resultado.trailer.year;
    document.querySelector("#directorEditar").value = resultado.trailer.directors;
    document.querySelector("#castEditar").value = resultado.trailer.cast;
    document.querySelector("#ratingEditar").value = resultado.trailer.rating;
    document.querySelector("#linkEditar").value = resultado.trailer.trailer_link;

    
};


document.querySelector("#editarForm").addEventListener('submit',async function(){

    let id = document.querySelector("#idPelicula").value;
    let title = document.querySelector("#titleEditar").value;
    let year = parseInt(document.querySelector("#yearEditar").value);
    let director = document.querySelector("#directorEditar").value;
    let cast = document.querySelector("#castEditar").value;
    let img = document.querySelector("#imgEditar");
    let rating = parseInt(document.querySelector("#ratingEditar").value);
    let trailer_link = document.querySelector("#linkEditar").value;
    if(validateTxt(title) == true){
        
        const datos = new FormData();
        
        datos.append("img", img.files[0]);
        datos.append("title", title);
        datos.append("year", year);
        datos.append("directors", director);
        datos.append("cast", cast);
        datos.append("rating", rating);
        datos.append("trailer_link", trailer_link);

        let respuesta = await fetch("http://localhost:8080/api/trailer/"+id,{
            method: 'PUT',
            mode: 'cors',
            body: datos,
            credentials: 'same-origin',
            headers: {
            "x-token":token}
        });
    
        cargarPeliculas();
    };

}); 
