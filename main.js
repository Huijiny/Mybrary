

var modal = document.getElementById('myModal');
var addBtn = document.getElementById("addBtn");
var span = document.getElementsByClassName("close")[0]; 

 const popup = () => {
    modal.style.display = "block";
 }

  const popup_close = () => {
    modal.style.display = "none";
  }

 const add = () => {
     //ajax서버통신.
     let url = $("#url-input").val();
     
     console.log(url);
     //alert('추가되었습니다');
 }

 window.onclick = function(event) {
     if (event.target == modal) {
         modal.style.display = "none";
     }
 }
