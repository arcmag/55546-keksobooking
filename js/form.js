'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;

  var MIN_TITLE_LENGTH = 30;
  var MAX_TITLE_LENGTH = 100;

  var MAX_AVAILABLE_PRICE = 1000000;

  var adForm = document.querySelector('.ad-form');
  var fieldsetsForm = adForm.querySelectorAll('fieldset');

  var addressField = document.querySelector('#address');
  var titleField = document.querySelector('#title');

  var housingType = document.querySelector('#type');
  var priceField = document.querySelector('#price');

  var housingRoomsField = document.querySelector('#room_number');
  var housingCapacityField = document.querySelector('#capacity');
  var btnSubmit = document.querySelector('.ad-form__submit');
  var btnReset = document.querySelector('.ad-form__reset');

  var filterHousingType = document.querySelector('#housing-type');
  var filterPrice = document.querySelector('#housing-price');
  var filterRooms = document.querySelector('#housing-rooms');
  var filterGuests = document.querySelector('#housing-guests');
  var filterFeatures = document.querySelector('#housing-features');
  var filterFeaturesList = filterFeatures.querySelectorAll('input');

  filterHousingType.addEventListener('change', onFormFilterChange);
  filterPrice.addEventListener('change', onFormFilterChange);
  filterRooms.addEventListener('change', onFormFilterChange);
  filterGuests.addEventListener('change', onFormFilterChange);
  filterFeatures.addEventListener('change', onFormFilterChange);

  function dataSave() {
    window.main.createMessage('Данные успешно отправлены на сервер!', 'success');
  }

  function dataError() {
    window.main.createMessage('Не удалось сохранить данные на сервер!', 'error');
  }

  var debounceTimer = null;
  function onFormFilterChange() {
    window.card.onCardCloseClick();

    function filter() {
      var featuresList = [];
      for (var i = 0; i < filterFeaturesList.length; i++) {
        if (filterFeaturesList[i].checked) {
          featuresList.push(filterFeaturesList[i].value);
        }
      }

      var filteredArr = window.main.sentenceList.filter(function (e) {
        return e.offer.type === filterHousingType.value || filterHousingType.value === 'any';
      }).filter(function (e) {
        var price = e.offer.price;
        var status = false;

        if (filterPrice.value === 'any') {
          status = true;
        } else if (filterPrice.value === 'low' && price < LOW_PRICE) {
          status = true;
        } else if (filterPrice.value === 'middle' && (price >= LOW_PRICE && price <= HIGH_PRICE)) {
          status = true;
        } else if (filterPrice.value === 'high' && price > HIGH_PRICE) {
          status = true;
        }

        return status;
      }).filter(function (e) {
        return e.offer.rooms === +filterRooms.value || filterRooms.value === 'any';
      }).filter(function (e) {
        return e.offer.guests === +filterGuests.value || filterGuests.value === 'any';
      }).filter(function (e) {
        return featuresList.every(function (ell) {
          return e.offer.features.indexOf(ell) !== -1;
        });
      });

      window.pin.destroyMapPins();
      window.pin.outputMapPins(filteredArr);
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(filter, DEBOUNCE_INTERVAL);
  }

  var selectTimein = document.querySelector('#timein');
  var selectTimeout = document.querySelector('#timeout');

  selectTimein.addEventListener('change', onSelectTimeSyncChange);
  selectTimeout.addEventListener('change', onSelectTimeSyncChange);
  function onSelectTimeSyncChange(evt) {
    var elem = evt.currentTarget;

    if (elem === selectTimein) {
      selectTimeout.value = elem.value;
    } else {
      selectTimein.value = elem.value;
    }
  }

  function disabledFormFields(status) {
    for (var i = 0; i < fieldsetsForm.length; i++) {
      fieldsetsForm[i].disabled = status;
    }
  }

  function onFormResetClick() {
    window.pin.setMainPinCoordinate();
    window.pin.destroyMapPins();
    adForm.reset();
    disabledFormFields(true);
    window.main.disabledPage();
  }

  function onSelectRoomChange(evt) {
    var optionList = [
      {value: 3, text: 'для 3 гостей'},
      {value: 2, text: 'для 2 гостей'},
      {value: 1, text: 'для 1 гостя'},
      {value: 0, text: 'не для гостей'}
    ];

    var openedOptionsList = ({
      '1': [2],
      '2': [1, 2],
      '3': [0, 1, 2],
      '100': [3]
    })[evt ? +evt.currentTarget.value : 1] || [];

    var container = document.createDocumentFragment();
    openedOptionsList.forEach(function (item) {
      var data = optionList[item];
      var option = document.createElement('option');

      option.value = data.value;
      option.textContent = data.text;

      container.appendChild(option);
    });


    housingCapacityField.innerHTML = '';
    housingCapacityField.appendChild(container);
  }

  var minAvailablePrice = 0;
  function onSelectHousingTypeChange(evt) {
    priceField.placeholder = minAvailablePrice = ({
      bungalo: 0,
      flat: 1000,
      house: 5000,
      palace: 10000
    })[evt ? evt.currentTarget.value : 'flat'];
  }

  housingRoomsField.addEventListener('change', onSelectRoomChange);
  housingType.addEventListener('change', onSelectHousingTypeChange);

  function outputPinCoordinate(address) {
    addressField.value = address;
  }

  btnReset.addEventListener('click', onFormResetClick);
  btnSubmit.addEventListener('click', function (evt) {
    evt.preventDefault();

    var titleText = titleField.value.trim();
    var textError = '';

    if (titleText.length < MIN_TITLE_LENGTH || titleText.length > MAX_TITLE_LENGTH) {
      textError = 'Минимальная длинна заголовка должна быть 30 символов, но не превышать 100 символов!';
    }

    var currentPrice = +priceField.value;
    if (currentPrice < minAvailablePrice || currentPrice > MAX_AVAILABLE_PRICE || !currentPrice) {
      textError = 'Минимальная допустимая цена для данного типа жилья ' + minAvailablePrice + ', а максимальная ' + MAX_AVAILABLE_PRICE + '!';
    }

    if (textError) {
      window.main.createMessage('Ошибка: ' + textError, 'error');
      return;
    }

    window.backend.save(new FormData(adForm), dataSave, dataError);
    onFormResetClick();
  });

  onSelectRoomChange();
  onSelectHousingTypeChange();
  disabledFormFields(true);

  window.form = {
    outputPinCoordinate: outputPinCoordinate,
    disabledFormFields: disabledFormFields
  };
}());
