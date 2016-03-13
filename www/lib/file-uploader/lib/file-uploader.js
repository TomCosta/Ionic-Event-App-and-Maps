(function($) {

  $.declare('fileUploader', {
    defaults: {
      formId: 'fileUploaderForm',
      action: window.location.href,
      method: 'POST',
      postKey: 'file',
      progressTemplate: '<div class="progress">Uploading...</div>',
      completeTemplateImage: '<img/>',
      completeTemplateOther: '<p>The file has been uploaded &#x2714;</p>',
      images: ['jpg', 'png', 'bmp', 'gif', 'jpeg'],
      allow: [],
      validateFunction: null,
      processData: null,
      zIndex: 2,
      dropZone: 'this',
      iframeValidation: null,
      updateProgress: function(event) {},
      onUploadError: function() {
        alert('Error');
      },
      onInvalidFileType: function() {
        alert('Please select a file with a ' + this.allow.join(', ') + ' extension');
      },
      showProgress: function() {
        this.el.html(this.progressTemplate);
      },
      showComplete: function(data) {
        var extension = this.getExtension(data);
        var file = (this.processData) ? this.processData(data) : data;
        var isImage = $.inArray(extension, this.images) > -1;

        if (file) {
          if (isImage) {
            this.el
              .html(this.completeTemplateImage)
              .find('img')
              .attr('src', file);
          }
          else {
            this.el.html(this.completeTemplateOther);
          }
        }
      }
    },

    init: function() {
      this.supportsFileApi = (typeof window.FileReader !== 'undefined');

      this.el.css('cursor', 'pointer');

      this.setupFramejax();

      if (this.supportsFileApi) {
        this.setupFileApi();
      }
    },

    setupFramejax: function() {
      var self = this;

      $('#' + this.formId).remove();
      this.el.off('mousemove');

      var form = $('<form/>')
        .attr({
          action: this.action,
          method: this.method,
          enctype: 'multipart/form-data',
          id: this.formId
        })
        .appendTo('body');

      var input = $('<input/>')
        .attr({
          name: this.postKey,
          type: 'file'
        })
        .css({
          opacity: '0',
          cursor: 'pointer',
          position: 'absolute',
          zIndex: this.zIndex
        })
        .on('change', function(e) {
          var filename = e.target.value;

          if (!self.checkType(filename)) {
            self.onInvalidFileType.apply(self);
            return;
          }

          self.el.trigger('fileSelect');
          self.showProgress.apply(self);
          form.submit();
        })
        .appendTo(form);

      this.el.on('mousemove', function(e) {
        var h = input.height();
        var w = input.width();

        if (typeof e.pageY == 'undefined' && typeof e.clientX == 'number' && document.documentElement) {
          e.pageX = e.clientX + document.documentElement.scrollLeft;
          e.pageY = e.clientY + document.documentElement.scrollTop;
        }

        input.css({
          top: e.pageY - (h / 2),
          left: e.pageX - (w - 30)
        });
      });

      input.on('mouseenter', function() {
        clearTimeout(input.data('timer'));
        if (!input.data('hovering')) {
          self.el.trigger('fileUploaderMouseIn');
        }

        input.data('hovering', true);
      }).on('mouseleave', function() {
        var timer = setTimeout(function() {
          self.el.trigger('fileUploaderMouseOut');
          input.data('hovering', false);
        }, 500);
        input.data('timer', timer);
      });

      form
        .framejax({
          validate: self.iframeValidation
        })
        .on('complete', function(e, results) {
          self.showComplete.call(self, results);
          self.el.trigger('complete', results);
        })
        .on('framejax.error', self.onUploadError.bind(self));
    },

    checkType: function(file) {
      if(this.validateFunction) {
        return this.validateFunction.call(this, file);
      }
      return !this.allow.length || $.inArray(this.getExtension(file), this.allow) !== -1;
    },

    setupFileApi: function() {
      var self = this;

      if (self.dropZone === 'this') {
        self.dropZone = self.el;
      } else {
        self.dropZone = $(self.dropZone);
      }

      self.dropZone.bind('dragenter, dragover', function(event){
        event.stopPropagation();
        event.preventDefault();
        event.originalEvent.dataTransfer.dropEffect = 'copy';
        self.emit('over');
      });

      self.dropZone.bind('dragleave', function() {
        self.emit('out');
      });

      self.dropZone.bind('drop', function(event) {
        event.stopPropagation();
        event.preventDefault();

        var file = event.originalEvent.dataTransfer.files[0];

        if (!self.checkType(file.name)) {
          self.onInvalidFileType.apply(self);
          return;
        }

        self.upload(file);
      });
    },

    getExtension: function(file) {
      return file.split('.').pop().toLowerCase();
    },

    upload: function(file) {
      var formData = new FormData();
      var self = this;
      var xhr = new XMLHttpRequest();

      formData.append(this.postKey, file);

      self.showProgress.apply(self);

      xhr.open('POST', self.action, true);
      xhr.upload.onprogress = self.updateProgress;
      xhr.onload = function(event) {
        self.showComplete.call(self, this.responseText, this, event);
        self.el.trigger('complete', this.responseText);

        if (event.currentTarget.status !== 200) {
          self.onUploadError.apply(self, arguments);
        }
      };

      xhr.send(formData);
    }
  });
})(window.jQuery);
