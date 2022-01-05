const btn = $("#action");
const startDate = $("#startDate");
const endDate = $("#endDate");
const cost = $("#cost");
const errorDiv = $(".error-div");

function testInputs() {
  errorDiv.empty();
  console.log(cost.val());
  if(!startDate.val().length || !endDate.val().length || !cost.val().length) {
    showError("Не введены параметры");
    return false;
  }
  else if(Date.parse(startDate.val()) > Date.parse(endDate.val())) {
    showError("Дата начала не может быть больше конечного");
    return false;
  }
  if(cost.val() < 0) {
    showError("Цена должна быть положительным числом");
    return false;
  }
  return true;
}

function showError(text) {
  errorDiv.append(`<span>${text}</span>`);
}

btn.on("click", function () {
  if(!testInputs()) return;
  $.ajax({
    type: "POST",
    url: "../php/api.php",
    dataType: "json",
    data: {
      action: "toursParam",
      startDate: startDate.val(),
      endDate: endDate.val(),
      cost: cost.val(),
    },
    success: function(data) {
      refreshPage(data);
    },
    error: function(error) {
      console.log(error);
    }
  });
});

function refreshPage(res) {
  var searchRes = $(".search-res");
  searchRes.empty();
  if(res.length) {
    res.forEach(elem => {
      searchRes.append(getTourItem(elem));
    });
  }
  else {
    searchRes.append(`<h3>Нет подходящих туров</h3>`)
  }
}

function getTourItem(item) {
  return `
    <div class="search-item flexRow">
      <div class="tour-img"><img src="../${item.img_src}" alt="photo"/></div>  
      <div class="tour-info flexCol">
        <div class="tour-name"><h3>Название: ${item.tour_name}</h3></div>
        <div class="tour-days"><h3>Количество дней: ${item.tour_days}</h3></div>
        <div class="tour-cost"><h3>Стоимость: ${item.tour_cost}</h3></div>
        <div class="tour-date"><h3>Дата вылета: ${item.tour_date}</h3></div>
        <button id="tour-request">Оставить заявку</button>
      </div>
    </div>
  `;
}