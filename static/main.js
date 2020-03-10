
let libraries;
var modal = document.getElementById('myModal');
var addBtn = document.getElementById("addBtn");
var span = document.getElementsByClassName("close")[0];
var tags = [];


 const popup = () => {addLibModal.style.display = "block";}
 const popup_close = () => {addLibModal.style.display = "none";}
 const detail_popup_close = () =>{libDetailModal.style.display="none";}




 const selected_lib = (tag) => {
    $("#search_results_contatier").empty();

    var searchedLib = libraries.filter(library => library.tag.includes(tag));
    if(tag==''){
        searchedLib=libraries;
    }
    $('#cards-box').empty();
    searchedLib.map(library =>$('#cards-box').append(
                    `<div class="card" >\
                    <div class="card-body">\
                    <span style="float:right"><button class="card-del-button" onclick="delete_card('${library.name}')">X</button></span>\
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
            console.log(response);
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
    let tmp_html = `<div class="card" >\
                    <div class="card-body">\
                    <div style="float:right"><button class="card-del-button" onclick="delete_card('${library.name}')">X</button></div>\
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


  $(document).ready(function(){
    loadmain();
    //// 이 코드 왜 안먹어
    $("#cards-box").on("click",".card",function(event){
        libDetailModal.style.display="block";
        var lib_name = $(this).find("h5")[0].innerHTML;

        var lib = libraries.filter(library => library.name===lib_name);

        $(".popup_title #detail_title").html(lib_name);
        $("#url-label").html(lib[0].url);
        $("#url-label").attr('href',lib[0].url);
        var dtag = '';
        lib[0].tag.map(t => {dtag += ` #${t}`;})
        $("#tag-label").html(dtag);

        $("#memo-label").html(lib[0].memo);

    });

  });