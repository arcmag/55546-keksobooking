'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  function dataSave() {
    window.main.createMessage('Данные успешно отправлены на сервер!', 'success');
  }

  function dataError() {
    window.main.createMessage('Не удалось сохранить данные на сервер!', 'error');
  }

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

  filterHousingType.addEventListener('change', filterData);
  filterPrice.addEventListener('change', filterData);
  filterRooms.addEventListener('change', filterData);
  filterGuests.addEventListener('change', filterData);
  filterFeatures.addEventListener('change', filterData);

  var debounceTimer = null;

  window.photoLoad.loadFile('#avatar', '.ad-form-header__preview img');
  window.photoLoad.loadFile('#images', '.ad-form__photo', function (fileBlock, previewBlock, result) {
    var img = document.createElement('img');
    img.src = result;

    previewBlock.appendChild(img);
  });

  function filterData() {
    window.card.closeMapCard();

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
        } else if (filterPrice.value === 'low' && price < 10000) {
          status = true;
        } else if (filterPrice.value === 'middle' && (price >= 10000 && price <= 50000)) {
          status = true;
        } else if (filterPrice.value === 'high' && price > 50000) {
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

  selectTimein.addEventListener('change', syncSelectsTime);
  selectTimeout.addEventListener('change', syncSelectsTime);

  function syncSelectsTime(evt) {
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

  function formReset() {
    window.pin.setMainPinCoordinate();
    window.pin.destroyMapPins();
    adForm.reset();
    disabledFormFields(true);
    window.main.disabledPage();
  }

  function roomChange(evt) {
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
    for (var i = 0; i < openedOptionsList.length; i++) {
      var data = optionList[openedOptionsList[i]];
      var option = document.createElement('option');

      option.value = data.value;
      option.textContent = data.text;

      container.appendChild(option);
    }

    housingCapacityField.innerHTML = '';
    housingCapacityField.appendChild(container);
  }

  var minPrice = 0;
  var maxPrice = 1000000;
  function housingTypeChange(evt) {
    priceField.placeholder = minPrice = ({
      bungalo: 0,
      flat: 1000,
      house: 5000,
      palace: 10000
    })[evt ? evt.currentTarget.value : 'flat'];
  }

  housingRoomsField.addEventListener('change', roomChange);
  housingType.addEventListener('change', housingTypeChange);

  function outputPinCoordinate(address) {
    addressField.value = address;
  }

  btnReset.addEventListener('click', formReset);
  btnSubmit.addEventListener('click', function (evt) {
    evt.preventDefault();

    var textError = '';

    if (titleField.value.length < 30 || titleField.value.length > 100) {
      textError = 'Минимальная длинна заголовка должна быть 30 символов, но не превышать 100 символов!';
    }

    var currentPrice = +priceField.value;
    if (currentPrice < minPrice || currentPrice > maxPrice || !currentPrice) {
      textError = 'Минимальная допустимая цена для данного типа жилья ' + minPrice + ', а максимальная ' + maxPrice + '!';
    }

    if (textError) {
      window.main.createMessage('Ошибка: ' + textError, 'error');
      return;
    }

    window.backend.save(new FormData(adForm), dataSave, dataError);
    formReset();
  });

  roomChange();
  housingTypeChange();
  disabledFormFields(true);

  window.form = {
    outputPinCoordinate: outputPinCoordinate,
    disabledFormFields: disabledFormFields
  };
}());
