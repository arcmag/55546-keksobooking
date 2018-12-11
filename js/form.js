'use strict';

(function () {
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

  function roomChange(e) {
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
    })[e ? +e.currentTarget.value : 1] || [];

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
  function housingTypeChange(e) {
    priceField.placeholder = ({
      bungalo: 0,
      flat: 1000,
      house: 5000,
      palace: 10000
    })[e ? e.currentTarget.value : 'flat'];
  }

  housingRoomsField.addEventListener('change', roomChange);
  housingType.addEventListener('change', housingTypeChange);

  addressField.disabled = true;
  function outputPinCoordinate(address) {
    addressField.value = address;
  }

  btnReset.addEventListener('click', formReset);
  btnSubmit.addEventListener('click', function (e) {
    e.preventDefault();

    var textError = '';

    if (titleField.value.length < 30 || titleField.value.length > 100) {
      textError = 'Минимальная длинна заголовка должна быть 30 символов, но не превышать 10 символов!';
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
