//полифил findeIndex ie11
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var thisArg = arguments[1];
      var k = 0;
      while (k < len) {
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        k++;
      }
      return -1;
    }
  });
}
const cartButton = document.querySelector('#js-cart-button');
const overlay = document.querySelector('#js-overlay');
const cartControl = document.querySelector('#js-cart__control');
const cartItems = document.querySelector('#js-cart__items');
const cartPrice = document.querySelector('#js-cart-price');
const totalPrice = document.querySelector('#js-total-price');
const deleteCartBtn = document.querySelector('#js-cart-delete-all');
const card1 = document.querySelector('#js-purchase-card-1')
const card2 = document.querySelector('#js-purchase-card-2')
const popupButton = document.querySelector('#js-popup__button');
const popup = document.querySelector('#js-popup');

//Реализация таймера
let saleOn; 
let timer; 
let date; 
let timeStart;
if (localStorage.getItem("sale") === null) {
  localStorage.setItem("sale", "show");
  date = new Date();
  timeStart = date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()
  localStorage.setItem("timeStart", timeStart);
  document.cookie = "sale=true; max-age=900";
  
}
if (localStorage.getItem("sale") === "hidden") {
  saleOn = false;
} else {
  timeStart = Number(localStorage.getItem('timeStart')) + 900;
  let dateCurent = new Date();
  let timeCurent = dateCurent.getHours() * 60 * 60 + dateCurent.getMinutes() * 60 + dateCurent.getSeconds();
  timer = timeStart - timeCurent;
  saleOn = true;
  localStorage.setItem("sale", "show");
  const interaval = setInterval(() => {
    if (document.cookie === "") {
      saleOn = false;
      localStorage.setItem("sale", "hidden");
      renderCart();
      console.log("delete");
      if(!saleOn && localStorage.getItem('showPopup') === null){
        popup.classList.add('popup--active')
        localStorage.setItem('showPopup', 'yes')
      }
      clearInterval(interaval);
    }  
    timer -= 1;
    renderPriceForCard(card1, items[0]);
    renderPriceForCard(card2, items[1]);
  }, 1000);
}


const items = [
  {
    id: '0000001',
    title: 'Video Suite',
    saleCost: 1990,
    cost: 3770 
  },
  {
    id: '0000002',
    title: 'Video Suite + Photo Editor',
    saleCost: 2490,
    cost: 5060 
  }
]
let cart = [];
if(JSON.parse(localStorage.getItem("cart")) == undefined){
  localStorage.setItem('cart', JSON.stringify(cart));
}else{
  cart = [...JSON.parse(localStorage.getItem("cart"))];
}

cartButton.addEventListener('click', () => {
  overlay.classList.toggle('overlay--active')
})
cartControl.addEventListener('click', () => {
  overlay.classList.toggle('overlay--active')
})

document.addEventListener('click', (e) => {
  if(e.target.classList.contains('purchase-card__button')){
    if(cart.findIndex((item)=>item.id === e.target.dataset.id) === -1){
      addCart(e.target.dataset.id);
      renderCart()
    }
  }
  if(e.target.classList.contains('cart__item-delete')){
    if(cart.findIndex((item)=>item.id === e.target.dataset.id) !== -1){
      deleteCartItem(e.target.dataset.id);
      renderCart()
    }
  }
  if(e.target.classList.contains('cart__delete-all')){
   deleteCartAll();
   renderCart()
  }
})
renderCart();

//popup
popupButton.addEventListener('click', () => {
  popup.classList.remove('popup--active')
})


function addCart(id){
  cart.push(items.filter((item) => item.id === id)[0]);
}
function renderElement(item) {
  const {id, title, cost, saleCost} = item;
  const costItem = saleOn ? saleCost : cost;
  const theFirstChild = cartItems.firstChild;
  let cartItem = document.createElement("div");
        cartItem.classList.add('cart__item');
        cartItem.innerHTML = `
        <div class="cart__item">
          <div class="cart__item-container">
            <img class="cart__item-img" src="./img/cart-item.png" alt="Cart item">
            <div class="cart__item-inner">
              <h3 class="cart__item-title">${title}</h3>
              <div class="cart__item-price">${costItem} руб.</div>
            </div>
          </div>
          <div class="cart__button-wrapper">
            <button class="cart__delete cart__item-delete" data-id="${id}">Delete</button>
          </div>
        </div>
        `;
  
  cartItems.insertBefore(cartItem, theFirstChild);
}

function renderCart(){
  cartItems.innerHTML = '';
  cart.forEach((el) => {
    renderElement(el)
  }) 
  const price = cart.reduce((acc, next) => {
    if(saleOn){
      return acc + next.saleCost
    }else{
      return acc + next.cost
    }
  }, 0)
  cartPrice.innerHTML = price;
  totalPrice.innerHTML = price;
  localStorage.setItem('cart', JSON.stringify(cart));
}

function deleteCartItem(id){
  const idx = cart.findIndex((item) => item.id === id)
  cart = [
    ...cart.slice(0, idx),
    ...cart.slice(idx + 1)
  ]
}
function deleteCartAll(){
  cart.length = 0;
}

function renderPriceForCard(card, item){
  const {saleCost, cost} = item;
  const oldPrice = `
    <div class="purchase-card__old-price">
      <span>${cost}</span> руб.
    </div>
    `
  let curentPriceValue = saleOn ? saleCost : cost;  
  const curentPrice = `
    <div class="purchase-card__price">
      <span>${curentPriceValue}</span>
      <span class="purchase-card__price-valuta">
        руб.
      </span>
    </div>
  `
  let watch = timer;
  let min = Math.floor(watch / 60);
  let sec = watch % 60
  let message = `
    <div class="purchase-card__timer-massage">
      Offer valid until ${min} мин. ${sec} cec.
    </div>
  `
  card.innerHTML = '';
  const theFirstChild = card.firstChild;
  let cardInfo = document.createElement("div");
        cardInfo.classList.add('purchase-card__inner');
        cardInfo.innerHTML = `
        ${saleOn ? oldPrice : ''}
        ${curentPrice}
        ${saleOn ? message : ''}
        `;
  
  card.insertBefore(cardInfo, theFirstChild);
}

renderPriceForCard(card1, items[0]);
renderPriceForCard(card2, items[1]);