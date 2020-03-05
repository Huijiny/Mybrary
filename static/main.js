
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



 const click_search_lib = (tag) => {
    $("#search_input").val(tag);
    $("#search_results_contatier").empty();

    var searched_lib = libraries.filter(library => library.tag.includes(tag));
    $('#cards-box').empty();
    searched_lib.map(library =>$('#cards-box').append(
                    `<div class="card fixed-width">\
                    <div class="card-body">\
                    <h5 class="card-title">${library.name}</h5>\
                    <h6 class="card-subtitle mb-2 text-muted">${library.tag}</h6>\
                    <p class="card-text">${library.description}</p>\
                    <a href="${library.url}" class="card-link">github</a>\
                    </div>\
                    </div> `
                    ));

 }

 const search_filter = () => {

    value = $('#search_input').val();
    if(value === ''){
        click_search_lib('');
    }else{
        let filtered = tags.filter(tag => tag.includes(value));
         $("#search_results_contatier").empty();
        filtered.map(tag => $("#search_results_contatier").append(`<li class="search-result-dropdown" onclick="click_search_lib('${tag}')">${tag}</li>`));
    }
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
                if(libraries[i].tag.indexOf(",")===-1){
                    tags.push(libraries[i].tag);
                }else{
                   tmp=libraries[i].tag.split(",");
                   let trimedArr = tmp.map(s => s.trim());
                   tags = tags.concat(trimedArr);
                }
                tags=Array.from(new Set(tags));
            }

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
