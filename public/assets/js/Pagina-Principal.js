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
        <td><iframe width="560" height="315" src="${resultado.trailers[contador].trailer_link}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></td>
        <td><ul>
        <img src="${resultado.trailers[contador].img.imgURL}" alt="">
        <li>Titulo: ${resultado.trailers[contador].title}</li>
        <li>Año de lanzamiento: ${resultado.trailers[contador].year}</li>
        <li>Director(res): ${resultado.trailers[contador].directors}</li>
        <li>Cast: ${resultado.trailers[contador].cast}</li>
        <li>Cast: ${resultado.trailers[contador].rating}</li>
        </ul></td>
        </tr>
        `
        contador++;
    });

    document.querySelector("#ListaPeliculas").innerHTML = RegistrosHTML;
};