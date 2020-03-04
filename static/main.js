
var libraries;
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
    url_input = $("#url-input").val();
    memo = $("#memo-input").val();
    tag = $("#tag-input").val();

     $.ajax({
        type: "POST",
	    url: "/add",
	    data: {url_give : url_input, memo_give: memo, tag_give: tag},
	    success: function(response){
			console.log(response);
			popup_close();
			$("#url-input").val('');
			$("#memo-input").val('');
			$("#tag-input").val('');
			alert('추가되었습니다!');
	  }
     })
 }

const loadmain = () => {
    console.log("dd");
    $.ajax({
        type:"GET",
        url:"/loadmain",
        data:{},
        success: function(response){
            let library = response['libraries'];
            for(let i=0;i<library.length;i++){
                console.log(library[i]);
                make_card(library[i]);
            }
        }
    })
}

function make_card(library){
    let tmp_html = `<div class="card fixed-width">\
                    <div class="card-body">\
                    <h5 class="card-title">${library.name}</h5>\
                    <h6 class="card-subtitle mb-2 text-muted">${library.tag}</h6>\
                    <p class="card-text">${library.description}</p>\
                    <a href="${library.url}" class="card-link">github</a>\
                  </div>\
                </div> `;
     console.log(tmp_html);
     $('#cards-box').append(tmp_html);

}

 window.onclick = function(event) {
     if (event.target == modal) {
         modal.style.display = "none";
     }
 }

  loadmain();
