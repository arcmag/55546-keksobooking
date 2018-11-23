'use strict';

var OFFER_TITLE_LIST = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var OFFER_TYPE_LIST = ['palace', 'flat', 'house', 'bungalo'];

var OFFER_FEATURES_LIST = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var OFFER_FIX_TIME_LIST = ['12:00', '13:00', '14:00'];

var OFFER_PHOTOS_LIST = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var mapBlock = document.querySelector('.map');
var mapCardTmp = document.querySelector('#pin');
var mapPinTmp = mapCardTmp.content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var sentenceList = [];

mapBlock.classList.remove('.map--faded');


function getRandomInt(max, min) {
  return Math.floor((Math.random()) * (max - min + 1) + min);
}

function compare() {
  return Math.random() - 0.5;
}

function getRandomAuthorAvatar() {
  return 'img/avatars/user0' + getRandomInt(8, 1) + '.png';
}

function getRandomOfferTitle() {
  return OFFER_TITLE_LIST.sort(compare).pop();
}

function getRandomArrayElement(array) {
  return array[getRandomInt(array.length - 1, 0)];
}

function getRandomPhotoList() {
  return OFFER_PHOTOS_LIST.slice().sort(compare);
}

function getRandomFeaturesList() {
  return OFFER_FEATURES_LIST.slice().sort(compare).slice(0, getRandomInt(OFFER_FEATURES_LIST.length - 1, 1));
}

function getRandomLocationCoord() {
  var pinX = parseInt(getComputedStyle(mapBlock).width, 10) - mapPinTmp.querySelector('img').width;

  return {
    y: getRandomInt(630, 130),
    x: getRandomInt(pinX, 0)
  };
}

function getMapPin(object) {
  var pin = mapPinTmp.cloneNode(true);

  pin.src = object.author.avatar;
  pin.alt = object.offer.title;
  pin.style.left = object.location.x + 'px';
  pin.style.top = object.location.y + 'px';

  return pin;
}

function createObjectsPins() {
  for (var i = 0; i < 8; i++) {
    var dataPin = {
      author: {
        avatar: getRandomAuthorAvatar()
      },
      offer: {
        title: getRandomOfferTitle(),
        price: getRandomInt(1000000, 1000),
        type: getRandomArrayElement(OFFER_TYPE_LIST),
        rooms: getRandomInt(5, 1),
        guests: getRandomInt(10, 1),
        checkin: getRandomArrayElement(OFFER_FIX_TIME_LIST),
        checkout: getRandomArrayElement(OFFER_FIX_TIME_LIST),
        features: getRandomFeaturesList(),
        description: '',
        photos: getRandomPhotoList()
      },
      location: getRandomLocationCoord()
    };

    dataPin.offer.address = dataPin.location.x + ', ' + dataPin.location.y;

    sentenceList.push(dataPin);
  }
}
createObjectsPins();

function outputMapPins() {
  var mapPinContainer = document.createDocumentFragment();

  for (var i = 0; i < sentenceList.length; i++) {
    mapPinContainer.appendChild(getMapPin(sentenceList[i]));
  }

  mapPins.appendChild(mapPinContainer);
}
outputMapPins();

function outputMapCard() {
  var sentence = sentenceList[0];
  var cardTmp = document.querySelector('#card');
  var card = cardTmp.content.querySelector('.map__card').cloneNode(true);

  card.querySelector('.popup__title').textContent = sentence.offer.title;
  card.querySelector('.popup__text--address').textContent = sentence.offer.address;
  card.querySelector('.popup__text--price').textContent = sentence.offer.price + 'Р/ночь';

  card.querySelector('.popup__type').textContent = ({
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  })[sentence.offer.type];

  card.querySelector('.popup__text--capacity').textContent = sentence.offer.rooms + ' комнаты для ' + sentence.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + sentence.offer.checkin + ', выезд до ' + sentence.offer.checkout;
  card.querySelector('.popup__features').textContent = sentence.offer.features;
  card.querySelector('.popup__description').textContent = sentence.offer.description;

  var photosCardBlock = card.querySelector('.popup__photos');
  var photoCardTmp = photosCardBlock.querySelector('.popup__photo').cloneNode(true);
  photosCardBlock.innerHTML = '';

  for (var i = 0; i < sentence.offer.photos.length; i++) {
    var cardImg = photoCardTmp.cloneNode(true);
    cardImg.src = sentence.offer.photos[i];
    photosCardBlock.appendChild(cardImg);
  }

  card.querySelector('.popup__avatar').textContent = sentence.author.avatar;

  mapBlock.insertBefore(card, document.querySelector('.map__filters-container'));
}
outputMapCard();
