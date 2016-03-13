/*!
 * file-uploader - jQuery file upload plugin
 * v0.9.0
 * https://github.com/jgallen23/file-uploader/
 * copyright First + Third 2015
 * MIT License
*/
/*!
 * fidel - a ui view controller
 * v2.2.5
 * https://github.com/jgallen23/fidel
 * copyright Greg Allen 2014
 * MIT License
*/
(function(w, $) {
  var _id = 0;
  var Fidel = function(obj) {
    this.obj = obj;
  };

  Fidel.prototype.__init = function(options) {
    $.extend(this, this.obj);
    this.id = _id++;
    this.namespace = '.fidel' + this.id;
    this.obj.defaults = this.obj.defaults || {};
    $.extend(this, this.obj.defaults, options);
    $('body').trigger('FidelPreInit', this);
    this.setElement(this.el || $('<div/>'));
    if (this.init) {
      this.init();
    }
    $('body').trigger('FidelPostInit', this);
  };
  Fidel.prototype.eventSplitter = /^(\w+)\s*(.*)$/;

  Fidel.prototype.setElement = function(el) {
    this.el = el;
    this.getElements();
    this.dataElements();
    this.delegateEvents();
    this.delegateActions();
  };

  Fidel.prototype.find = function(selector) {
    return this.el.find(selector);
  };

  Fidel.prototype.proxy = function(func) {
    return $.proxy(func, this);
  };

  Fidel.prototype.getElements = function() {
    if (!this.elements)
      return;

    for (var selector in this.elements) {
      var elemName = this.elements[selector];
      this[elemName] = this.find(selector);
    }
  };

  Fidel.prototype.dataElements = function() {
    var self = this;
    this.find('[data-element]').each(function(index, item) {
      var el = $(item);
      var name = el.data('element');
      self[name] = el;
    });
  };

  Fidel.prototype.delegateEvents = function() {
    if (!this.events)
      return;
    for (var key in this.events) {
      var methodName = this.events[key];
      var match = key.match(this.eventSplitter);
      var eventName = match[1], selector = match[2];

      var method = this.proxy(this[methodName]);

      if (selector === '') {
        this.el.on(eventName + this.namespace, method);
      } else {
        if (this[selector] && typeof this[selector] != 'function') {
          this[selector].on(eventName + this.namespace, method);
        } else {
          this.el.on(eventName + this.namespace, selector, method);
        }
      }
    }
  };

  Fidel.prototype.delegateActions = function() {
    var self = this;
    self.el.on('click'+this.namespace, '[data-action]', function(e) {
      var el = $(this);
      var action = el.attr('data-action');
      if (self[action]) {
        self[action](e, el);
      }
    });
  };

  Fidel.prototype.on = function(eventName, cb) {
    this.el.on(eventName+this.namespace, cb);
  };

  Fidel.prototype.one = function(eventName, cb) {
    this.el.one(eventName+this.namespace, cb);
  };

  Fidel.prototype.emit = function(eventName, data, namespaced) {
    var ns = (namespaced) ? this.namespace : '';
    this.el.trigger(eventName+ns, data);
  };

  Fidel.prototype.hide = function() {
    if (this.views) {
      for (var key in this.views) {
        this.views[key].hide();
      }
    }
    this.el.hide();
  };
  Fidel.prototype.show = function() {
    if (this.views) {
      for (var key in this.views) {
        this.views[key].show();
      }
    }
    this.el.show();
  };

  Fidel.prototype.destroy = function() {
    this.el.empty();
    this.emit('destroy');
    this.el.unbind(this.namespace);
  };

  Fidel.declare = function(obj) {
    var FidelModule = function(el, options) {
      this.__init(el, options);
    };
    FidelModule.prototype = new Fidel(obj);
    return FidelModule;
  };

  //for plugins
  Fidel.onPreInit = function(fn) {
    $('body').on('FidelPreInit', function(e, obj) {
      fn.call(obj);
    });
  };
  Fidel.onPostInit = function(fn) {
    $('body').on('FidelPostInit', function(e, obj) {
      fn.call(obj);
    });
  };
  w.Fidel = Fidel;
})(window, window.jQuery || window.Zepto);

(function($) {
  $.declare = function(name, obj) {

    $.fn[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      var options = args.shift();
      var methodValue;
      var els;

      els = this.each(function() {
        var $this = $(this);

        var data = $this.data(name);

        if (!data) {
          var View = Fidel.declare(obj);
          var opts = $.extend({}, options, { el: $this });
          data = new View(opts);
          $this.data(name, data); 
        }
        if (typeof options === 'string') {
          methodValue = data[options].apply(data, args);
        }
      });

      return (typeof methodValue !== 'undefined') ? methodValue : els;
    };

    $.fn[name].defaults = obj.defaults || {};

  };

  $.Fidel = window.Fidel;

})(jQuery);
/*!
 * framejax - jQuery plugin to submit multipart forms through an iframe
 * v0.2.2
 * https://github.com/jgallen23/framejax/
 * copyright Greg Allen 2015
 * MIT License
*/
(function($) {
  var lastId = 0;
  var createiFrame = function(id) {
    return $('<iframe name="'+id+'" />')
      .attr({
        id: id,
        name: id,
        width: 0,
        height: 0
      })
      .css('display', 'none')
      .appendTo('body');
  };

  $.fn.framejax = function(opts) {
    var validate = opts.validate || function() {
      return true;
    };

    return this.each(function() {
      var el = $(this);
      if (el[0].tagName != 'FORM')
        throw new Error('all selectors must be form tags');

      var submit = function() {
        var id = '__framejax__' + lastId++;
        var iframe = createiFrame(id);

        iframe.on('load', function() {
          var $body = $(this).contents().find('body');
          var results = $body.html();
          var eventName = 'framejax.success';

          el.trigger('complete', results);

          if (!validate($(this))) {
            eventName = 'framejax.error';
          }
          el.trigger(eventName, [iframe, $body]);

          //cleanup
          iframe.remove();
        });

        el.attr('target', id);
      };

      el.on('submit', submit);
      el.on('framejaxSubmit', submit);
    });
  };
})(window.jQuery);

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
