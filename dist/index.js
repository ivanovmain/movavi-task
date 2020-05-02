"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//полифил findeIndex ie11
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function value(predicate) {
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

var cartButton = document.querySelector('#js-cart-button');
var overlay = document.querySelector('#js-overlay');
var cartControl = document.querySelector('#js-cart__control');
var cartItems = document.querySelector('#js-cart__items');
var cartPrice = document.querySelector('#js-cart-price');
var totalPrice = document.querySelector('#js-total-price');
var deleteCartBtn = document.querySelector('#js-cart-delete-all');
var card1 = document.querySelector('#js-purchase-card-1');
var card2 = document.querySelector('#js-purchase-card-2');
var popupButton = document.querySelector('#js-popup__button');
var popup = document.querySelector('#js-popup'); //Реализация таймера

var saleOn;
var timer;
var date;
var timeStart;

if (localStorage.getItem("sale") === null) {
  localStorage.setItem("sale", "show");
  date = new Date();
  timeStart = date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();
  localStorage.setItem("timeStart", timeStart);
  document.cookie = "sale=true; max-age=900";
}

if (localStorage.getItem("sale") === "hidden") {
  saleOn = false;
} else {
  timeStart = Number(localStorage.getItem('timeStart')) + 900;
  var dateCurent = new Date();
  var timeCurent = dateCurent.getHours() * 60 * 60 + dateCurent.getMinutes() * 60 + dateCurent.getSeconds();
  timer = timeStart - timeCurent;
  saleOn = true;
  localStorage.setItem("sale", "show");
  var interaval = setInterval(function () {
    if (document.cookie === "") {
      saleOn = false;
      localStorage.setItem("sale", "hidden");
      renderCart();
      console.log("delete");

      if (!saleOn && localStorage.getItem('showPopup') === null) {
        popup.classList.add('popup--active');
        localStorage.setItem('showPopup', 'yes');
      }

      clearInterval(interaval);
    }

    timer -= 1;
    renderPriceForCard(card1, items[0]);
    renderPriceForCard(card2, items[1]);
  }, 1000);
}

var items = [{
  id: '0000001',
  title: 'Video Suite',
  saleCost: 1990,
  cost: 3770
}, {
  id: '0000002',
  title: 'Video Suite + Photo Editor',
  saleCost: 2490,
  cost: 5060
}];
var cart = [];

if (JSON.parse(localStorage.getItem("cart")) == undefined) {
  localStorage.setItem('cart', JSON.stringify(cart));
} else {
  cart = _toConsumableArray(JSON.parse(localStorage.getItem("cart")));
}

cartButton.addEventListener('click', function () {
  overlay.classList.toggle('overlay--active');
});
cartControl.addEventListener('click', function () {
  overlay.classList.toggle('overlay--active');
});
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('purchase-card__button')) {
    if (cart.findIndex(function (item) {
      return item.id === e.target.dataset.id;
    }) === -1) {
      addCart(e.target.dataset.id);
      renderCart();
    }
  }

  if (e.target.classList.contains('cart__item-delete')) {
    if (cart.findIndex(function (item) {
      return item.id === e.target.dataset.id;
    }) !== -1) {
      deleteCartItem(e.target.dataset.id);
      renderCart();
    }
  }

  if (e.target.classList.contains('cart__delete-all')) {
    deleteCartAll();
    renderCart();
  }
});
renderCart(); //popup

popupButton.addEventListener('click', function () {
  popup.classList.remove('popup--active');
});

function addCart(id) {
  cart.push(items.filter(function (item) {
    return item.id === id;
  })[0]);
}

function renderElement(item) {
  var id = item.id,
      title = item.title,
      cost = item.cost,
      saleCost = item.saleCost;
  var costItem = saleOn ? saleCost : cost;
  var theFirstChild = cartItems.firstChild;
  var cartItem = document.createElement("div");
  cartItem.classList.add('cart__item');
  cartItem.innerHTML = "\n        <div class=\"cart__item\">\n          <div class=\"cart__item-container\">\n            <img class=\"cart__item-img\" src=\"./img/cart-item.png\" alt=\"Cart item\">\n            <div class=\"cart__item-inner\">\n              <h3 class=\"cart__item-title\">".concat(title, "</h3>\n              <div class=\"cart__item-price\">").concat(costItem, " \u0440\u0443\u0431.</div>\n            </div>\n          </div>\n          <div class=\"cart__button-wrapper\">\n            <button class=\"cart__delete cart__item-delete\" data-id=\"").concat(id, "\">Delete</button>\n          </div>\n        </div>\n        ");
  cartItems.insertBefore(cartItem, theFirstChild);
}

function renderCart() {
  cartItems.innerHTML = '';
  cart.forEach(function (el) {
    renderElement(el);
  });
  var price = cart.reduce(function (acc, next) {
    if (saleOn) {
      return acc + next.saleCost;
    } else {
      return acc + next.cost;
    }
  }, 0);
  cartPrice.innerHTML = price;
  totalPrice.innerHTML = price;
  localStorage.setItem('cart', JSON.stringify(cart));
}

function deleteCartItem(id) {
  var idx = cart.findIndex(function (item) {
    return item.id === id;
  });
  cart = [].concat(_toConsumableArray(cart.slice(0, idx)), _toConsumableArray(cart.slice(idx + 1)));
}

function deleteCartAll() {
  cart.length = 0;
}

function renderPriceForCard(card, item) {
  var saleCost = item.saleCost,
      cost = item.cost;
  var oldPrice = "\n    <div class=\"purchase-card__old-price\">\n      <span>".concat(cost, "</span> \u0440\u0443\u0431.\n    </div>\n    ");
  var curentPriceValue = saleOn ? saleCost : cost;
  var curentPrice = "\n    <div class=\"purchase-card__price\">\n      <span>".concat(curentPriceValue, "</span>\n      <span class=\"purchase-card__price-valuta\">\n        \u0440\u0443\u0431.\n      </span>\n    </div>\n  ");
  var watch = timer;
  var min = Math.floor(watch / 60);
  var sec = watch % 60;
  var message = "\n    <div class=\"purchase-card__timer-massage\">\n      Offer valid until ".concat(min, " \u043C\u0438\u043D. ").concat(sec, " cec.\n    </div>\n  ");
  card.innerHTML = '';
  var theFirstChild = card.firstChild;
  var cardInfo = document.createElement("div");
  cardInfo.classList.add('purchase-card__inner');
  cardInfo.innerHTML = "\n        ".concat(saleOn ? oldPrice : '', "\n        ").concat(curentPrice, "\n        ").concat(saleOn ? message : '', "\n        ");
  card.insertBefore(cardInfo, theFirstChild);
}

renderPriceForCard(card1, items[0]);
renderPriceForCard(card2, items[1]);