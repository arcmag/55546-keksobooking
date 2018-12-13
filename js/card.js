'use strict';

(function () {
  function closeEscMapCard(e) {
    if (e.keyCode === window.main.ESC_KEYCODE && getOpenMapCard()) {
      closeMapCard();
    }
  }

  function getOpenMapCard() {
    return document.querySelector('.map__card') || false;
  }

  function closeMapCard() {
    var mapCard = getOpenMapCard();

    if (!mapCard) {
      return;
    }

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

    var sentence = window.pin.getCurrentSentenceList()[indexPin];
    var cardTmp = document.querySelector('#card');
    var card = cardTmp.content.querySelector('.map__card').cloneNode(true);

    card.setAttribute('data-index-pin-card', indexPin);

    card.querySelector('.popup__title').textContent = sentence.offer.title;
    card.querySelector('.popup__text--address').textContent = sentence.offer.address;
    card.querySelector('.popup__text--price').textContent = sentence.offer.price + 'Р/ночь';

    card.querySelector('.popup__type').textContent = ({
      palace: 'Дворец',
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало'
    })[sentence.offer.type] || 'Неизвестно';

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

    window.main.mapBlock.insertBefore(card, document.querySelector('.map__filters-container'));
  }

  window.card = {
    outputMapCard: outputMapCard,
    closeMapCard: closeMapCard
  };
}());
