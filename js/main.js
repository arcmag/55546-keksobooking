'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var mapBlock = document.querySelector('.map');

  function createMessage(messageText, status) {
    var tmp = document.querySelector('#' + status);
    var messageBlock = tmp.content.querySelector('.' + status).cloneNode(true);
    var messageBlocMessage = messageBlock.querySelector('.' + status + '__message');
    var messageBlockButton = false;

    if (messageText) {
      messageBlocMessage.textContent = messageText;
    }

    if (status === 'error') {
      messageBlockButton = messageBlock.querySelector('.error__button');
      messageBlockButton.addEventListener('click', onMessageBlockDestroyClick);
    }

    document.querySelector('main').appendChild(messageBlock);
    document.addEventListener('click', onMessageBlockDestroyClick);
    document.addEventListener('keyup', onMessageBlockDestroyKeyUp);

    function destroyMessageBlock() {
        document.removeEventListener('click', onMessageBlockDestroyClick);
        document.removeEventListener('keyup', onMessageBlockDestroyKeyUp);

        if (messageBlockButton) {
          messageBlockButton.removeEventListener('click', onMessageBlockDestroyClick);
        }

        messageBlock.parentElement.removeChild(messageBlock);
    }

    function onMessageBlockDestroyClick(evt) {
      var elem = evt.target;

      if (elem.classList.contains(status) || elem.classList.contains(status + '__button')) {
        destroyMessageBlock();
      }
    }

    function onMessageBlockDestroyKeyUp(evt) {
      if (evt.keyCode === window.main.ESC_KEYCODE) {
        destroyMessageBlock();
      }
    }
  }

  function openedPage() {
    mapBlock.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
  }

  function disabledPage() {
    mapBlock.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
  }

  window.main = {
    mapBlock: mapBlock,
    openedPage: openedPage,
    disabledPage: disabledPage,
    createMessage: createMessage,
    sentenceList: [],
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13
  };
}());
