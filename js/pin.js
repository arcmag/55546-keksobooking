'use strict';

(function () {
  var mapPinMain = document.querySelector('.map__pin--main');
  var mainPinDataSize = {
    left: parseInt(mapPinMain.style.left, 10),
    top: parseInt(mapPinMain.style.top, 10),
    width: parseInt(getComputedStyle(mapPinMain).width, 10),
    height: parseInt(getComputedStyle(mapPinMain).height, 10)
  };

  var mapBlockDataSize = window.main.mapBlock.getBoundingClientRect();

  var MAX_NUMBER_PIN = 5;

  var MAX_PIN_TOP = 630;
  var MIN_PIN_TOP = 130;

  var MAX_PIN_LEFT = mapBlockDataSize.width - mainPinDataSize.width;
  var MIN_PIN_LEFT = 0;

  var mapCardTmp = document.querySelector('#pin');
  var mapPins = document.querySelector('.map__pins');
  var mapPinTmp = mapCardTmp.content.querySelector('.map__pin');

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

    pin.addEventListener('click', window.card.onCardOutputClick);

    return pin;
  }

  function outputMapPins(dataPins) {
    currentSentenceList = dataPins;
    var mapPinContainer = document.createDocumentFragment();

    var numberPin = (dataPins.length >= MAX_NUMBER_PIN ? MAX_NUMBER_PIN : dataPins.length);
    dataPins.slice(0, numberPin).forEach(function (dataPin, i) {
      var pin = getMapPin(dataPin, i);
      pinElementsListHTML.push(pin);
      mapPinContainer.appendChild(pin);
    });

    mapPins.appendChild(mapPinContainer);
  }

  function destroyMapPins() {
    for (var i = 0; i < pinElementsListHTML.length; i++) {
      pinElementsListHTML[i].parentElement.removeChild(pinElementsListHTML[i]);
    }

    pinElementsListHTML = [];
  }

  var dataDragMainPin = {};
  mapPinMain.addEventListener('mousedown', onPinMouseDown);
  function onPinMouseDown(evt) {
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

    document.addEventListener('mousemove', onPinMouseMove);
    document.addEventListener('mouseup', onPinMouseUp);
  }

  function onPinMouseMove(evt) {
    var x = evt.clientX - dataDragMainPin.x;
    var y = evt.clientY - dataDragMainPin.y;

    if (x >= MAX_PIN_LEFT) {
      x = MAX_PIN_LEFT;
    } else if (x <= MIN_PIN_LEFT) {
      x = MIN_PIN_LEFT;
    }

    if (y >= MAX_PIN_TOP) {
      y = MAX_PIN_TOP;
    } else if (y <= MIN_PIN_TOP) {
      y = MIN_PIN_TOP;
    }

    setMainPinCoordinate(x, y);
    window.form.outputPinCoordinate(Math.round(x + mainPinDataSize.width / 2) + ', ' + (y + mainPinDataSize.height));
  }

  function onPinMouseUp() {
    document.removeEventListener('mousemove', onPinMouseMove);
    document.removeEventListener('mouseup', onPinMouseUp);

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
