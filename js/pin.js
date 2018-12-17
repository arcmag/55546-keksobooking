'use strict';

(function () {
  var MAX_PIN_TOP = 630;
  var MIN_PIN_TOP = 130;

  var mapCardTmp = document.querySelector('#pin');
  var mapPins = document.querySelector('.map__pins');
  var mapPinTmp = mapCardTmp.content.querySelector('.map__pin');

  var mapPinMain = document.querySelector('.map__pin--main');
  var mainPinDataSize = {
    left: parseInt(mapPinMain.style.left, 10),
    top: parseInt(mapPinMain.style.top, 10),
    width: parseInt(getComputedStyle(mapPinMain).width, 10),
    height: parseInt(getComputedStyle(mapPinMain).height, 10)
  };

  var pinElementsListHTML = [];
  var currentSentenceList = [];

  function dataLoad(evt) {
    window.main.sentenceList = evt;
    outputMapPins(window.main.sentenceList);
  }

  function dataError() {
    window.main.createMessage('Не удалось загрузить данные с сервера!', 'error');
  }

  function getCurrentSentenceList() {
    return currentSentenceList;
  }

  function getMapPin(object, index) {
    var pin = mapPinTmp.cloneNode(true);
    var img = pin.querySelector('img');

    img.src = object.author.avatar;
    img.alt = object.offer.title;
    pin.style.left = object.location.x + 'px';
    pin.style.top = object.location.y + 'px';

    pin.dataset.indexPin = index;

    pin.addEventListener('click', window.card.onOutputMapCard);

    return pin;
  }

  function outputMapPins(dataPins) {
    currentSentenceList = dataPins;
    var mapPinContainer = document.createDocumentFragment();

    var len = dataPins.length >= 5 ? 5 : dataPins.length;

    for (var i = 0; i < len; i++) {
      var pin = getMapPin(dataPins[i], i);
      pinElementsListHTML.push(pin);
      mapPinContainer.appendChild(pin);
    }

    mapPins.appendChild(mapPinContainer);
  }

  function destroyMapPins() {
    for (var i = 0; i < pinElementsListHTML.length; i++) {
      pinElementsListHTML[i].parentElement.removeChild(pinElementsListHTML[i]);
    }

    pinElementsListHTML = [];
  }

  // drag-n-drop логика для метки pin
  var mapBlockDataSize = window.main.mapBlock.getBoundingClientRect();
  var dataDragMainPin = {};

  mapPinMain.addEventListener('mousedown', mousePinDown);
  function mousePinDown(evt) {
    if (window.main.mapBlock.classList.contains('map--faded')) {
      window.main.openedPage();
      window.form.disabledFormFields(false);
      if (!window.main.sentenceList) {
        outputMapPins(window.main.sentenceList);
      } else {
        window.backend.load(dataLoad, dataError);
      }
    }

    dataDragMainPin = {
      x: evt.clientX - mapPinMain.offsetLeft,
      y: evt.clientY - mapPinMain.offsetTop
    };

    document.addEventListener('mousemove', onMousePinMove);
    document.addEventListener('mouseup', onMousePinUp);
  }

  function onMousePinMove(evt) {
    var x = evt.clientX - dataDragMainPin.x;
    var y = evt.clientY - dataDragMainPin.y;

    if (x >= mapBlockDataSize.width - mainPinDataSize.width) {
      x = mapBlockDataSize.width - mainPinDataSize.width;
    } else if (x <= 0) {
      x = 0;
    }

    if (y >= MAX_PIN_TOP) {
      y = MAX_PIN_TOP;
    } else if (y <= MIN_PIN_TOP) {
      y = MIN_PIN_TOP;
    }

    setMainPinCoordinate(x, y);
    window.form.outputPinCoordinate(Math.round(x + mainPinDataSize.width / 2) + ', ' + (y + mainPinDataSize.height));
  }

  function onMousePinUp() {
    document.removeEventListener('mousemove', onMousePinMove);
    document.removeEventListener('mouseup', onMousePinUp);

    var coord = getMainPinCoordinate();
    window.form.outputPinCoordinate(Math.round(coord.x + mainPinDataSize.width / 2) + ', ' + (coord.y + mainPinDataSize.height));
  }

  function setMainPinCoordinate(x, y) {
    if (typeof x !== 'number') {
      x = mainPinDataSize.left;
      y = mainPinDataSize.top;
    }

    mapPinMain.style.left = x + 'px';
    mapPinMain.style.top = y + 'px';
  }

  function getMainPinCoordinate() {
    return {
      x: parseInt(mapPinMain.style.left, 10),
      y: parseInt(mapPinMain.style.top, 10)
    };
  }

  window.pin = {
    getCurrentSentenceList: getCurrentSentenceList,
    setMainPinCoordinate: setMainPinCoordinate,
    outputMapPins: outputMapPins,
    destroyMapPins: destroyMapPins,
  };
}());
