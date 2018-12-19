'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  function checkFile(file) {
    var fileName = file.name.toLowerCase();

    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  }

  function loadFile(fileFieldSelector, filePreviewSelector, callback) {
    var fileChooser = document.querySelector(fileFieldSelector);
    var preview = document.querySelector(filePreviewSelector);

    fileChooser.addEventListener('change', function () {
      var file = fileChooser.files[0];

      if (checkFile(file)) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          if (callback) {
            callback(fileChooser, preview, reader.result);
          } else {
            preview.src = reader.result;
          }
        });

        reader.readAsDataURL(file);
      }
    });
  }

  loadFile('#avatar', '.ad-form-header__preview img');
  loadFile('#images', '.ad-form__photo', function (fileBlock, previewBlock, result) {
    var img = document.createElement('img');
    img.src = result;

    previewBlock.appendChild(img);
  });

}());
