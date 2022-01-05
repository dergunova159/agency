const btn = $("#review-btn");
const textArea = $("#review-input");
const errorDiv = $(".error-div");

function testInputs() {
  const val = textArea.val();
  errorDiv.empty();
  if(val.length) {
    return true;
  }
  showError();
  return false;
}

function showError() {
  errorDiv.append(`<span>Не введен текст отзыва</span>`);
}

btn.on("click", function () {
  if(!testInputs()) return;
  $.ajax({
    type: "POST",
    url: "../php/api.php",
    dataType: "json",
    data: {
      action: "addReview",
      reviewText: textArea.val(),
    },
    success: function(data) {
      loadReviews(data);
    },
    error: function(error) {
      console.log(error);
    }
  });
});

function loadReviews() {
  $.ajax({
    type: "POST",
    url: "../php/api.php",
    dataType: "json",
    data: {
      action: "prevReviews",
    },
    success: function (data) {
      refreshReviews(data);
    },
    error: function (error) {
      console.log(error);
    }
  });
}

function getReviewItem(item) {
  return `
    <div class="review-item flexCol">
      <div class="review-date"><b>Дата отзыва: ${item.review_data}</b></div>
      <div class="review-text">${item.review_text}</div>
    </div>
  `;
}

function refreshReviews(res) {
  const list = $(".review-list");
  list.empty();
  if(res.length) {
    res.forEach(elem => {
      list.append(getReviewItem(elem));
    });
  }
  else {
    list.append(`<h3>Нет отзывов</h3>`)
  }
}

loadReviews();