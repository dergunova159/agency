$(document).ready(function() {
  route(); 
});

route = function () {
  const currPage = localStorage.getItem("page");
  switch(currPage) {
    case "tours": 
      loadPage("tours.html");
      break;
    case "review": 
      loadPage("review.html");
      break;
    case "about":       
      loadPage("about.html");
      break;
    default: 
      loadPage("main.html");
  }
}

loadPage = function (page, func) {
  const path = "../templates/";
  $(".main").load(path+page, func)
}

menuClick = function(page) {
  localStorage.setItem("page", page);
  route();
}