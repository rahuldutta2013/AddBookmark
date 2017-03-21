window.addEventListener('load',function(){
 overlay.style.display='none';
});
var bookMark=[];
var bookmarks=[];
var currentPage=1;
function PageRender(idx){
      var num=parseInt(idx);
      num-=1;
      if(num>=tocData.length)
      {
        alert("wrong input");
      }
      else {
        currentPage=num+1;
        $("iframe").attr("src",tocData[num].page);
      }
      disableButton();
      console.log(currentPage);
};

//----find the page number
function getPageNoFromInput(){
     $('input').keydown(function(event) {
        if (event.keyCode == 13) {
          var pageNumber=$("input").val();
          PageRender(pageNumber);
          }
      });
  };

//getting the next page index
function next(){
    $("#next").on('click',function(){
        currentPage++;
        PageRender(currentPage);
        disableButton();
        //console.log(currentPage);
     });

};
//getting the previous page index
function prev(){
    $("#prev").on('click',function(){
        currentPage--;
        PageRender(currentPage);
         disableButton();
        // console.log(currentPage);
     });
};
//making next and prev button disabled
function disableButton(){
    if(currentPage == 1){
        $('#prev').attr('disabled','true');
        $('#next').removeAttr('disabled');
    }
    else if(currentPage == tocData.length){
      $('#next').attr("disabled","disabled");
      $('#prev').removeAttr("disabled");
    }else{
        $('#next').removeAttr('disabled');
          $('#prev').removeAttr("disabled");
    }
};

//for bookmark
function bookmark(){
    $("#bookmark").on('click',function(){
          var bookMark = JSON.parse(localStorage.getItem("bookMark"));
              if($.inArray(currentPage, bookMark) == -1){
                bookMark.push(currentPage);
                  }else{
                            bookMark.splice(bookMark.indexOf(currentPage), 1);
                            if(bookMark.length == 0){
                                $('ul').html('');
                            }
                      }
            // storing bookmarks in local storage
            localStorage.setItem('bookMark', JSON.stringify(bookMark));
            var storedBookmarks = JSON.parse(localStorage.getItem("bookMark"));
            bookmarks = storedBookmarks;
            appendBookmark(storedBookmarks);
            console.log(storedBookmarks);
     });
};


function redirectPageFromBookmark(){
    $('ul li').on('click',function(){
        var pageNo = $(this).attr('value');
        PageRender(pageNo);
        console.log(pageNo);
    });
}

//change COLOR when bookmarked
function bookmarkColor(arr,currentPage){
    if($.inArray(currentPage, arr) != -1){
        console.log('yes');
        $('#bookmark').css('color','blue');
    }else {
        console.log('no');
        $('#bookmark').css('color','inherit');
    }
}

//change dom when bookmarked
 function appendBookmark(arr){
    var node ='';
    for (var i=0; i< arr.length; i++){
        node = node + '<li value='+arr[i]+'>'+tocData[arr[i]-1].pageName+'</li>';
        $('ul').html(node);
     }
     redirectPageFromBookmark();
 };

function toCheckBookmarksFromLocalStorage(){
    var storedBookmarks = JSON.parse(localStorage.getItem("bookMark"));
    if(storedBookmarks.length > 0){
          alert(storedBookmarks);
          appendBookmark(storedBookmarks);
    }else {
      alert('none');
    }
}

var tocData = [];
var getData = function(dataUrl) {
  return $.ajax({
    url: dataUrl,
    type:"GET",
    success:function(data,satus,xhr){
      return data;
     }
  });
};

$(document).ready(function() {
   var x = getData("pages.json");
   x.then(function(resp) {  //try
    tocData = resp;
    bindEventsAndLoadBookMarks();
   })
   .catch(function(err){  //catch
    console.log(err);
   })

   function bindEventsAndLoadBookMarks() {
     toCheckBookmarksFromLocalStorage();
     getPageNoFromInput();
     next();
     prev();
     disableButton();
     bookmark();
   }
});
