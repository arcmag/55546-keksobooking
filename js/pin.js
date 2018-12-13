'use strict';

(function () {
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

  function dataLoad(e) {
    outputMapPins(window.main.sentenceList = e);
  }

  function dataError() {
    window.main.createMessage('Не удалось загрузить данные с сервера!', 'error');
  }

  function getMapPin(object, index) {
    var pin = mapPinTmp.cloneNode(true);
    var img = pin.querySelector('img');

    img.src = object.author.avatar;
    img.alt = object.offer.title;
    pin.style.left = object.location.x + 'px';
    pin.style.top = object.location.y + 'px';

    pin.setAttribute('data-index-pin', index);

    pin.addEventListener('click', window.card.outputMapCard);

    return pin;
  }

  function outputMapPins(dataPins) {
    var mapPinContainer = document.createDocumentFragment();

    for (var i = 0; i < dataPins.length; i++) {
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

  var MAX_PIN_TOP = 630;
  var MIN_PIN_TOP = 130;

  mapPinMain.addEventListener('mousedown', mousePinDown);
  function mousePinDown(e) {
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
      x: e.clientX - mapPinMain.offsetLeft,
      y: e.clientY - mapPinMain.offsetTop
    };

    document.addEventListener('mousemove', mousePinMove);
    document.addEventListener('mouseup', mousePinUp);
  }

  function mousePinMove(e) {
    var x = e.clientX - dataDragMainPin.x;
    var y = e.clientY - dataDragMainPin.y;

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

  function mousePinUp() {
    document.removeEventListener('mousemove', mousePinMove);
    document.removeEventListener('mouseup', mousePinUp);

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
    setMainPinCoordinate: setMainPinCoordinate,
    destroyMapPins: destroyMapPins,
  };
}());
