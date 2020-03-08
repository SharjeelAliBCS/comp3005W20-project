function init_menu_content(){
  requestData("/cart");
}

function requestData(url){

  var request = $.ajax({
    url: url,
    data: "query",
    dataType: "json"
  });

  request.done(function (req) {
    var data = JSON.parse(req);
    switch(url){
      case "/genreData":
        populateGenreSelect(data);
        break;
      case "/cart":
        populateOrderTab(data.items);
        break;
    }

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}

function populateOrderTab(data){
  console.log(data)

  let div = document.getElementById('cart');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  for (let i in data) {
    isbn = data[i].id;
    let book = data[i].volumeInfo;
    //console.log(data[i]);

    //let hyperlink = 'https://pokemontcg.io/cards/' + card.id

    let divCard = document.createElement('div');

    // divCard.className = 'row';
    if(book.title!=null && book.imageLinks!=null && book.authors!=null){
      bookPrice = "CDN $"+19.99;

      onclk = '"openBookPage(\''+data[i].id+'\')" ';
      qtyId = "qty"+isbn;

      divCard.innerHTML = ""
      + '<div>'
          + '<div class="book-row">'

            + '<div class="book-col book-left">'
              + '<div role="button" id="' + book.title + '" class="card" style="width:100px; height:140px;">'
                + '<div class="img-card" onclick=' +onclk+ '><img src= ' + book.imageLinks.thumbnail + ' style="width:100px; height:140px;"></img></div></a>'
              +'</div>'
            + '</div>'

            + '<div class="book-col book-right">'
              + '<p class="cart-delete">remove</p>'
              +'<div class="cart-quantity">'
                + '<b onclick="changeCartQuantity(false,\''+qtyId+'\')" class="cart-quantity-button">-</b>'
                + '<input type="text" class="cart-quantity-text" id="'+qtyId+'">'
                + '<b onclick="changeCartQuantity(true,\''+qtyId+'\')" class="cart-quantity-button">+</b>'
              +'</div>'
              + '<p class="cart-book-price">' + bookPrice +'</p>'
            + '</div>'

          +'</div>'

          + '<div class="cart-book-info">'
            + '<p onclick=' +onclk+ ' class="cart-book-title">' + book.title + '</p>'
          + '</div>'

      + '</div>'

      console.log(divCard)

      document.getElementById('cart').appendChild(divCard);
      document.getElementById(qtyId).value = 1;

    }

  }
  document.getElementById('subtotal').innerHTML = `Subtotal: CDN $${80}`;
  document.getElementById('totalItems').innerHTML = `Total items: ${data.length}`;



}

function changeCartQuantity(increase,id){
  textInput = document.getElementById(id);
  val = parseInt(textInput.value, 10);

  if(increase){
    console.log("increasing...");
    textInput.value = val+1;
  }
  else if(val>1){
    console.log("decreasing...");
    textInput.value =val-1;
  }

}

function openBookPage(isbn){
  console.log(isbn+ " page opened!");

  localStorage.setItem('ISBN', isbn);
  window.location.href = "BookPage.html";
}
