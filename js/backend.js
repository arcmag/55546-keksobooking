'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';

  function load(onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError();
      }
    });
    xhr.addEventListener('error', onError);

    xhr.open('GET', URL + '/data');
    xhr.send();
  }

  function save(data, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad();
      } else {
        onError();
      }
    });
    xhr.addEventListener('error', onError);

    xhr.open('POST', URL);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    save: save
  };
}());
