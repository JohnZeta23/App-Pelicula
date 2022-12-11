var nombre = localStorage.getItem("name");
var token = localStorage.getItem("token");
 
 const emailValidator = (mail) => { //Validar Correo Electronico
 
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
 
    if (mail.length === 0) {
        document.querySelector("#alertas").innerHTML = 
        `<div class="alert alert-danger" role="alert">
        El campo Email es requerido
         </div>`;
       return false
    } else if (!emailPattern.test(mail)) {
        document.querySelector("#alertas").innerHTML = 
        `<div class="alert alert-danger" role="alert">
        Email invalido
         </div>`;
       return false;
    }
    return true
 };

const checarSesion = ()=>{
    if(nombre != null){
    location.href="./CRUD-Peliculas.html";
    }
 };

const Login = async ()=>{

    let correo = document.querySelector("#correo").value;
    let pass = document.querySelector("#password").value;
    if(emailValidator(correo) == true)
    {
        let datos = {
            email : correo,
            pass : pass
        }
    
        console.log(datos);
        
        let respuesta = await fetch("http://localhost:8080/api/auth/login",{
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(datos),
            credentials: 'same-origin',
            headers: {
            'Content-Type': 'application/json'}
        });
        
        let resultado = await respuesta.json();
    
        if(resultado != null){
            await localStorage.setItem("name",resultado.user.name);
            await localStorage.setItem("token", resultado.token);
            location.href="./CRUD-Peliculas.html";
        }
    };
};