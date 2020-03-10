
let libraries;
var modal = document.getElementById('myModal');
var addBtn = document.getElementById("addBtn");
var span = document.getElementsByClassName("close")[0];
var tags = [];


 const popup = () => {
    modal.style.display = "block";
 }

 const popup_close = () => {
     modal.style.display = "none";
 }



 const selected_lib = (tag) => {
    $("#search_results_contatier").empty();

    var searchedLib = libraries.filter(library => library.tag.includes(tag));
    if(tag==''){
        searchedLib=libraries;
    }
    $('#cards-box').empty();
    searchedLib.map(library =>$('#cards-box').append(
                    `<div class="card fixed-width">\
                    <div class="card-body">\
                    <button onclick="delete_card('${library.name}')">X</button>\
                    <h5 class="card-title">${library.name}</h5>\
                    <h6 class="card-subtitle mb-2 text-muted">${library.tag}</h6>\
                    <p class="card-text">${library.description}</p>\
                    <a href="${library.url}" class="card-link">github</a>\
                    </div>\
                    </div> `
                    ));

 }



 const add_card = () => {

     //ajax서버통신.
    url_input = $("#url-input").val();
    memo = $("#memo-input").val();
    tag = $("#tag-input").val();

     $.ajax({
        type: "POST",
	    url: "/add",
	    data: {url_give : url_input, memo_give: memo, tag_give: tag},
	    success: function(response){
			popup_close();
			$("#url-input").val('');
			$("#memo-input").val('');
			$("#tag-input").val('');
			alert('추가되었습니다!');
			window.location.reload();
	  }
     })
 }
 const delete_card = (card_name) => {

    $.ajax({
        type:"POST",
        url:"/deletecard",
        data:{card_name_give : card_name},
        success: function(response){
            window.location.reload();
        }
    })
 }

const loadmain = () => {
    $.ajax({
        type:"GET",
        url:"/loadmain",
        data:{},
        success: function(response){
            libraries = response['libraries'];
            for(let i=0;i<libraries.length;i++){
                make_card(libraries[i]);
                libraries[i].tag.map(function(tag){
                   if(!tags.includes(tag)){
                        tags.push(tag);
                   }
                });
            }
             $('#search_input')
             .keyup(function(){
                if($(this).val()==''){
                    selected_lib('');
                }
             })
             .autocomplete({
             source: tags,
             select: function(event, ui){
                console.log(ui.item.value);
                selected_lib(ui.item.value)
                }

         });
        }

    })


}

function make_card(library){
    let tmp_html = `<div class="card fixed-width">\
                    <div class="card-body">\
                    <button onclick="delete_card('${library.name}')">X</button>
                    <h5 class="card-title">${library.name}</h5>\
                    <h6 class="card-subtitle mb-2 text-muted">${library.tag}</h6>\
                    <p class="card-text">${library.description}</p>\
                    <a href="${library.url}" class="card-link">github</a>\
                  </div>\
                </div> `;
     $('#cards-box').append(tmp_html);

}

 window.onclick = function(event) {
     if (event.target == modal) {
         modal.style.display = "none";
     }
 }

  loadmain();

// $(function(){
//    var autocomplete_text = ["자동완성기능","Autocomplete","개발로짜","국이"];
//
//})