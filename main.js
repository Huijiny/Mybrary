
var modal = document.getElementById('myModal');
var addBtn = document.getElementById("addBtn");
var span = document.getElementsByClassName("close")[0];               

 const popup = () => {
     modal.style.display = "block";
     console.log("dd");
 }

 const close = () => {
     modal.style.display = "none";
 }

 window.onclick = function(event) {
     if (event.target == modal) {
         modal.style.display = "none";
     }
 }
