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

var ESC_KEYCODE = 27;

var mapPinMain = document.querySelector('.map__pin--main');

var mapBlock = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');
var mapCardTmp = document.querySelector('#pin');
var mapPinTmp = mapCardTmp.content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var sentenceList = [];
var avatarList = [];

var mainPinDataSize = mapPinMain.getBoundingClientRect();

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

mapPinMain.addEventListener('click', function () {
  mapBlock.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  outputPinCoordinate(mainPinDataSize.left + ', ' + mainPinDataSize.top);
  outputMapPins();
});

function getRandomInt(max, min) {
  return Math.floor((Math.random()) * (max - min + 1) + min);
}

function compare() {
  return Math.random() - 0.5;
}

function createAvatarList() {
  for (var i = 1; i <= 8; i++) {
    avatarList.push('img/avatars/user0' + i + '.png');
  }
}
createAvatarList();

function takeRandomArrayElement(array) {
  return array.sort(compare).pop();
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
  var offsetX = PIN_WIDTH / 2;
  var randomX = getRandomInt(mapBlock.offsetWidth - offsetX, 0 + offsetX);
  var randomY = getRandomInt(630 - PIN_HEIGHT, 130 + PIN_HEIGHT);

  return {
    locationX: randomX - offsetX,
    locationY: randomY - PIN_HEIGHT,
    addressX: randomX,
    addressY: randomY
  };
}

function getMapPin(object, index) {
  var pin = mapPinTmp.cloneNode(true);
  var img = pin.querySelector('img');

  img.src = object.author.avatar;
  img.alt = object.offer.title;
  pin.style.left = object.location.x + 'px';
  pin.style.top = object.location.y + 'px';

  pin.setAttribute('data-index-pin', index);

  pin.addEventListener('click', outputMapCard);

  return pin;
}

function createObjectsPins() {
  var dataList = [];

  for (var i = 0; i < 8; i++) {
    var coordLocation = getRandomLocationCoord();

    var dataPin = {
      author: {
        avatar: takeRandomArrayElement(avatarList)
      },
      offer: {
        title: takeRandomArrayElement(OFFER_TITLE_LIST),
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
      location: {x: coordLocation.locationX, y: coordLocation.locationY}
    };

    dataPin.offer.address = coordLocation.addressX + ', ' + coordLocation.addressY;

    dataList.push(dataPin);
  }

  return dataList;
}
sentenceList = createObjectsPins();

function outputMapPins() {
  var mapPinContainer = document.createDocumentFragment();

  for (var i = 0; i < sentenceList.length; i++) {
    mapPinContainer.appendChild(getMapPin(sentenceList[i], i));
  }

  mapPins.appendChild(mapPinContainer);
}

var addressField = document.querySelector('#address');
function outputPinCoordinate(address) {
  addressField.value = address;
}

function closeEscMapCard(e) {
  if (e.keyCode === ESC_KEYCODE && getOpenMapCard()) {
    closeMapCard();
  }
}

function getOpenMapCard() {
  return document.querySelector('.map__card') || false;
}

function closeMapCard() {
  var mapCard = getOpenMapCard();
  mapCard.parentElement.removeChild(mapCard);
  document.removeEventListener('keyup', closeEscMapCard);
}

function outputMapCard(e) {
  var indexPin = +e.currentTarget.dataset['indexPin'];
  var mapCard = getOpenMapCard();

  if (mapCard) {
    if (+mapCard.dataset['indexPinCard'] === indexPin) {
      return;
    }
    closeMapCard();
  }

  var sentence = sentenceList[indexPin];
  var cardTmp = document.querySelector('#card');
  var card = cardTmp.content.querySelector('.map__card').cloneNode(true);
  var sentenceOfferType = '';

  outputPinCoordinate(sentence.offer.address);

  card.setAttribute('data-index-pin-card', indexPin);

  card.querySelector('.popup__title').textContent = sentence.offer.title;
  card.querySelector('.popup__text--address').textContent = sentence.offer.address;
  card.querySelector('.popup__text--price').textContent = sentence.offer.price + 'Р/ночь';

  switch (sentence.offer.type) {
    case 'palace':
      sentenceOfferType = 'Дворец';
      break;
    case 'flat':
      sentenceOfferType = 'Квартира';
      break;
    case 'house':
      sentenceOfferType = 'Дом';
      break;
    case 'bungalo':
      sentenceOfferType = 'Бунгало';
      break;
    default:
      sentenceOfferType = 'Неизвестно';
  }

  card.querySelector('.popup__type').textContent = sentenceOfferType;

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

  card.querySelector('.popup__avatar').src = sentence.author.avatar;

  card.querySelector('.popup__close').addEventListener('click', closeMapCard);
  document.addEventListener('keyup', closeEscMapCard);

  mapBlock.insertBefore(card, document.querySelector('.map__filters-container'));
}
