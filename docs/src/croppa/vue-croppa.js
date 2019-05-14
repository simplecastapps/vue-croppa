/*
 * vue-croppa v1.3.8
 * https://github.com/zhanziyang/vue-croppa
 * 
 * Copyright (c) 2019 zhanziyang
 * Released under the ISC license
 */
  
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Croppa = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var canvasExifOrientation = createCommonjsModule(function (module, exports) {
(function (root, factory) {
    if (typeof undefined === 'function' && undefined.amd) {
        undefined([], factory);
    } else {
        module.exports = factory();
    }
}(commonjsGlobal, function () {
  'use strict';

  function drawImage(img, orientation, x, y, width, height) {
    if (!/^[1-8]$/.test(orientation)) throw new Error('orientation should be [1-8]');

    if (x == null) x = 0;
    if (y == null) y = 0;
    if (width == null) width = img.width;
    if (height == null) height = img.height;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    ctx.save();
    switch (+orientation) {
      // 1 = The 0th row is at the visual top of the image, and the 0th column is the visual left-hand side.
      case 1:
          break;

      // 2 = The 0th row is at the visual top of the image, and the 0th column is the visual right-hand side.
      case 2:
         ctx.translate(width, 0);
         ctx.scale(-1, 1);
         break;

      // 3 = The 0th row is at the visual bottom of the image, and the 0th column is the visual right-hand side.
      case 3:
          ctx.translate(width, height);
          ctx.rotate(180 / 180 * Math.PI);
          break;

      // 4 = The 0th row is at the visual bottom of the image, and the 0th column is the visual left-hand side.
      case 4:
          ctx.translate(0, height);
          ctx.scale(1, -1);
          break;

      // 5 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual top.
      case 5:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(90 / 180 * Math.PI);
          ctx.scale(1, -1);
          break;

      // 6 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual top.
      case 6:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(90 / 180 * Math.PI);
          ctx.translate(0, -height);
          break;

      // 7 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual bottom.
      case 7:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(270 / 180 * Math.PI);
          ctx.translate(-width, height);
          ctx.scale(1, -1);
          break;

      // 8 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual bottom.
      case 8:
          canvas.width = height;
          canvas.height = width;
          ctx.translate(0, width);
          ctx.rotate(270 / 180 * Math.PI);
          break;
    }

    ctx.drawImage(img, x, y, width, height);
    ctx.restore();

    return canvas;
  }

  return {
    drawImage: drawImage
  };
}));
});

var u = {
  onePointCoord: function onePointCoord(point, vm) {
    var canvas = vm.canvas,
        quality = vm.quality;

    var rect = canvas.getBoundingClientRect();
    var clientX = point.clientX;
    var clientY = point.clientY;
    return {
      x: (clientX - rect.left) * quality,
      y: (clientY - rect.top) * quality
    };
  },
  getPointerCoords: function getPointerCoords(evt, vm) {
    var pointer = void 0;
    if (evt.touches && evt.touches[0]) {
      pointer = evt.touches[0];
    } else if (evt.changedTouches && evt.changedTouches[0]) {
      pointer = evt.changedTouches[0];
    } else {
      pointer = evt;
    }
    return this.onePointCoord(pointer, vm);
  },
  getPinchDistance: function getPinchDistance(evt, vm) {
    var pointer1 = evt.touches[0];
    var pointer2 = evt.touches[1];
    var coord1 = this.onePointCoord(pointer1, vm);
    var coord2 = this.onePointCoord(pointer2, vm);

    return Math.sqrt(Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2));
  },
  getPinchCenterCoord: function getPinchCenterCoord(evt, vm) {
    var pointer1 = evt.touches[0];
    var pointer2 = evt.touches[1];
    var coord1 = this.onePointCoord(pointer1, vm);
    var coord2 = this.onePointCoord(pointer2, vm);

    return {
      x: (coord1.x + coord2.x) / 2,
      y: (coord1.y + coord2.y) / 2
    };
  },
  imageLoaded: function imageLoaded(img) {
    return img.complete && img.naturalWidth !== 0;
  },
  rAFPolyfill: function rAFPolyfill() {
    // rAF polyfill
    if (typeof document == 'undefined' || typeof window == 'undefined') return;
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
        var id = window.setTimeout(function () {
          var arg = currTime + timeToCall;
          callback(arg);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }

    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  },
  toBlobPolyfill: function toBlobPolyfill() {
    if (typeof document == 'undefined' || typeof window == 'undefined' || !HTMLCanvasElement) return;
    var binStr, len, arr;
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function value(callback, type, quality) {
          binStr = atob(this.toDataURL(type, quality).split(',')[1]);
          len = binStr.length;
          arr = new Uint8Array(len);

          for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
          }

          callback(new Blob([arr], { type: type || 'image/png' }));
        }
      });
    }
  },
  eventHasFile: function eventHasFile(evt) {
    var dt = evt.dataTransfer || evt.originalEvent.dataTransfer;
    if (dt.types) {
      for (var i = 0, len = dt.types.length; i < len; i++) {
        if (dt.types[i] == 'Files') {
          return true;
        }
      }
    }

    return false;
  },
  getFileOrientation: function getFileOrientation(arrayBuffer) {
    var view = new DataView(arrayBuffer);
    if (view.getUint16(0, false) != 0xFFD8) return -2;
    var length = view.byteLength;
    var offset = 2;
    while (offset < length) {
      var marker = view.getUint16(offset, false);
      offset += 2;
      if (marker == 0xFFE1) {
        if (view.getUint32(offset += 2, false) != 0x45786966) return -1;
        var little = view.getUint16(offset += 6, false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        var tags = view.getUint16(offset, little);
        offset += 2;
        for (var i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) == 0x0112) {
            return view.getUint16(offset + i * 12 + 8, little);
          }
        }
      } else if ((marker & 0xFF00) != 0xFF00) break;else offset += view.getUint16(offset, false);
    }
    return -1;
  },
  parseDataUrl: function parseDataUrl(url) {
    var reg = /^data:([^;]+)?(;base64)?,(.*)/gmi;
    return reg.exec(url)[3];
  },
  base64ToArrayBuffer: function base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  },
  getRotatedImage: function getRotatedImage(img, orientation) {
    var _canvas = canvasExifOrientation.drawImage(img, orientation);
    var _img = new Image();
    _img.src = _canvas.toDataURL();
    return _img;
  },
  flipX: function flipX(ori) {
    if (ori % 2 == 0) {
      return ori - 1;
    }

    return ori + 1;
  },
  flipY: function flipY(ori) {
    var map = {
      1: 4,
      4: 1,
      2: 3,
      3: 2,
      5: 8,
      8: 5,
      6: 7,
      7: 6
    };

    return map[ori];
  },
  rotate90: function rotate90(ori) {
    var map = {
      1: 6,
      2: 7,
      3: 8,
      4: 5,
      5: 2,
      6: 3,
      7: 4,
      8: 1
    };

    return map[ori];
  },
  numberValid: function numberValid(n) {
    return typeof n === 'number' && !isNaN(n);
  }
};

Number.isInteger = Number.isInteger || function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

var initialImageType = String;
if (typeof window !== 'undefined' && window.Image) {
  initialImageType = [String, Image];
}

var props = {
  value: Object,
  width: {
    type: Number,
    default: 200,
    validator: function validator(val) {
      return val > 0;
    }
  },
  height: {
    type: Number,
    default: 200,
    validator: function validator(val) {
      return val > 0;
    }
  },
  placeholder: {
    type: String,
    default: 'Choose an image'
  },
  placeholderColor: {
    default: '#606060'
  },
  placeholderFontSize: {
    type: Number,
    default: 0,
    validator: function validator(val) {
      return val >= 0;
    }
  },
  canvasColor: {
    default: 'transparent'
  },
  quality: {
    type: Number,
    default: 2,
    validator: function validator(val) {
      return val > 0;
    }
  },
  zoomSpeed: {
    default: 3,
    type: Number,
    validator: function validator(val) {
      return val > 0;
    }
  },
  accept: String,
  fileSizeLimit: {
    type: Number,
    default: 0,
    validator: function validator(val) {
      return val >= 0;
    }
  },
  disabled: Boolean,
  disableDragAndDrop: Boolean,
  disableClickToChoose: Boolean,
  disableDragToMove: Boolean,
  disableScrollToZoom: Boolean,
  disablePinchToZoom: Boolean,
  disableRotation: Boolean,
  reverseScrollToZoom: Boolean,
  preventWhiteSpace: Boolean,
  showRemoveButton: {
    type: Boolean,
    default: true
  },
  removeButtonColor: {
    type: String,
    default: 'red'
  },
  removeButtonSize: {
    type: Number
  },
  initialImage: initialImageType,
  initialSize: {
    type: String,
    default: 'cover',
    validator: function validator(val) {
      return val === 'cover' || val === 'contain' || val === 'natural';
    }
  },
  initialPosition: {
    type: String,
    default: 'center',
    validator: function validator(val) {
      var valids = ['center', 'top', 'bottom', 'left', 'right'];
      return val.split(' ').every(function (word) {
        return valids.indexOf(word) >= 0;
      }) || /^-?\d+% -?\d+%$/.test(val);
    }
  },
  inputAttrs: Object,
  showLoading: Boolean,
  loadingSize: {
    type: Number,
    default: 20
  },
  loadingColor: {
    type: String,
    default: '#606060'
  },
  replaceDrop: Boolean,
  passive: Boolean,
  imageBorderRadius: {
    type: [Number, String],
    default: 0
  },
  autoSizing: Boolean,
  videoEnabled: Boolean
};

var events = {
  INIT_EVENT: 'init',
  FILE_CHOOSE_EVENT: 'file-choose',
  FILE_SIZE_EXCEED_EVENT: 'file-size-exceed',
  FILE_TYPE_MISMATCH_EVENT: 'file-type-mismatch',
  NEW_IMAGE_EVENT: 'new-image',
  NEW_IMAGE_DRAWN_EVENT: 'new-image-drawn',
  IMAGE_REMOVE_EVENT: 'image-remove',
  MOVE_EVENT: 'move',
  ZOOM_EVENT: 'zoom',
  DRAW_EVENT: 'draw',
  INITIAL_IMAGE_LOADED_EVENT: 'initial-image-loaded',
  LOADING_START_EVENT: 'loading-start',
  LOADING_END_EVENT: 'loading-end'
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var PCT_PER_ZOOM = 1 / 100000; // The amount of zooming everytime it happens, in percentage of image width.
var MIN_MS_PER_CLICK = 500; // If touch duration is shorter than the value, then it is considered as a click.
var CLICK_MOVE_THRESHOLD = 100; // If touch move distance is greater than this value, then it will by no mean be considered as a click.
var MIN_WIDTH = 10; // The minimal width the user can zoom to.
var DEFAULT_PLACEHOLDER_TAKEUP = 2 / 3; // Placeholder text by default takes up this amount of times of canvas width.
var PINCH_ACCELERATION = 1; // The amount of times by which the pinching is more sensitive than the scolling

var syncData = ['imgData', 'img', 'imgSet', 'originalImage', 'naturalHeight', 'naturalWidth', 'orientation', 'scaleRatio'];
// const DEBUG = false

var component = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { ref: "wrapper", class: 'croppa-container ' + (_vm.img ? 'croppa--has-target' : '') + ' ' + (_vm.passive ? 'croppa--passive' : '') + ' ' + (_vm.disabled ? 'croppa--disabled' : '') + ' ' + (_vm.disableClickToChoose ? 'croppa--disabled-cc' : '') + ' ' + (_vm.disableDragToMove && _vm.disableScrollToZoom ? 'croppa--disabled-mz' : '') + ' ' + (_vm.fileDraggedOver ? 'croppa--dropzone' : ''), on: { "dragenter": function dragenter($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleDragEnter($event);
        }, "dragleave": function dragleave($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleDragLeave($event);
        }, "dragover": function dragover($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleDragOver($event);
        }, "drop": function drop($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleDrop($event);
        } } }, [_c('input', _vm._b({ ref: "fileInput", staticStyle: { "height": "1px", "width": "1px", "overflow": "hidden", "margin-left": "-99999px", "position": "absolute" }, attrs: { "type": "file", "accept": _vm.accept, "disabled": _vm.disabled }, on: { "change": _vm._handleInputChange } }, 'input', _vm.inputAttrs, false)), _vm._v(" "), _c('div', { staticClass: "slots", staticStyle: { "width": "0", "height": "0", "visibility": "hidden" } }, [_vm._t("initial"), _vm._v(" "), _vm._t("placeholder")], 2), _vm._v(" "), _c('canvas', { ref: "canvas", on: { "click": function click($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleClick($event);
        }, "dblclick": function dblclick($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleDblClick($event);
        }, "touchstart": function touchstart($event) {
          $event.stopPropagation();return _vm._handlePointerStart($event);
        }, "mousedown": function mousedown($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerStart($event);
        }, "pointerstart": function pointerstart($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerStart($event);
        }, "touchend": function touchend($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerEnd($event);
        }, "touchcancel": function touchcancel($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerEnd($event);
        }, "mouseup": function mouseup($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerEnd($event);
        }, "pointerend": function pointerend($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerEnd($event);
        }, "pointercancel": function pointercancel($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerEnd($event);
        }, "touchmove": function touchmove($event) {
          $event.stopPropagation();return _vm._handlePointerMove($event);
        }, "mousemove": function mousemove($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerMove($event);
        }, "pointermove": function pointermove($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerMove($event);
        }, "pointerleave": function pointerleave($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerLeave($event);
        }, "DOMMouseScroll": function DOMMouseScroll($event) {
          $event.stopPropagation();return _vm._handleWheel($event);
        }, "wheel": function wheel($event) {
          $event.stopPropagation();return _vm._handleWheel($event);
        }, "mousewheel": function mousewheel($event) {
          $event.stopPropagation();return _vm._handleWheel($event);
        } } }), _vm._v(" "), _vm.showRemoveButton && _vm.img && !_vm.passive ? _c('svg', { staticClass: "icon icon-remove", style: 'top: -' + _vm.height / 40 + 'px; right: -' + _vm.width / 40 + 'px', attrs: { "viewBox": "0 0 1024 1024", "version": "1.1", "xmlns": "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink", "width": _vm.removeButtonSize || _vm.width / 10, "height": _vm.removeButtonSize || _vm.width / 10 }, on: { "click": _vm.remove } }, [_c('path', { attrs: { "d": "M511.921231 0C229.179077 0 0 229.257846 0 512 0 794.702769 229.179077 1024 511.921231 1024 794.781538 1024 1024 794.702769 1024 512 1024 229.257846 794.781538 0 511.921231 0ZM732.041846 650.633846 650.515692 732.081231C650.515692 732.081231 521.491692 593.683692 511.881846 593.683692 502.429538 593.683692 373.366154 732.081231 373.366154 732.081231L291.761231 650.633846C291.761231 650.633846 430.316308 523.500308 430.316308 512.196923 430.316308 500.696615 291.761231 373.523692 291.761231 373.523692L373.366154 291.918769C373.366154 291.918769 503.453538 430.395077 511.881846 430.395077 520.349538 430.395077 650.515692 291.918769 650.515692 291.918769L732.041846 373.523692C732.041846 373.523692 593.447385 502.547692 593.447385 512.196923 593.447385 521.412923 732.041846 650.633846 732.041846 650.633846Z", "fill": _vm.removeButtonColor } })]) : _vm._e(), _vm._v(" "), _vm.showLoading && _vm.loading ? _c('div', { staticClass: "sk-fading-circle", style: _vm.loadingStyle }, _vm._l(12, function (i) {
      return _c('div', { key: i, class: 'sk-circle' + i + ' sk-circle' }, [_c('div', { staticClass: "sk-circle-indicator", style: { backgroundColor: _vm.loadingColor } })]);
    })) : _vm._e(), _vm._v(" "), _vm._t("default")], 2);
  }, staticRenderFns: [],
  model: {
    prop: 'value',
    event: events.INIT_EVENT
  },

  props: props,

  data: function data() {
    return {
      canvas: null,
      ctx: null,
      originalImage: null,
      img: null,
      video: null,
      dragging: false,
      lastMovingCoord: null,
      imgData: {
        width: 0,
        height: 0,
        startX: 0,
        startY: 0
      },
      fileDraggedOver: false,
      tabStart: 0,
      scrolling: false,
      pinching: false,
      rotating: false,
      pinchDistance: 0,
      supportTouch: false,
      pointerMoved: false,
      pointerStartCoord: null,
      naturalWidth: 0,
      naturalHeight: 0,
      scaleRatio: null,
      orientation: 1,
      userMetadata: null,
      imageSet: false,
      currentPointerCoord: null,
      currentIsInitial: false,
      loading: false,
      realWidth: 0, // only for when autoSizing is on
      realHeight: 0, // only for when autoSizing is on
      chosenFile: null,
      useAutoSizing: false
    };
  },


  computed: {
    outputWidth: function outputWidth() {
      var w = this.useAutoSizing ? this.realWidth : this.width;

      // HACK FOR NOW.  THIS IS ASSUMING A 1-TO-1 RATIO
      if (this.naturalWidth > this.width || this.naturalHeight > this.height) {
        return this.naturalWidth > this.naturalHeight ? this.naturalWidth : this.naturalHeight;
      }

      return w * this.quality;
    },
    outputHeight: function outputHeight() {
      var h = this.useAutoSizing ? this.realHeight : this.height;

      // HACK FOR NOW.  THIS IS ASSUMING A 1-TO-1 RATIO
      if (this.naturalHeight > this.height || this.naturalWidth > this.width) {
        return this.naturalWidth > this.naturalHeight ? this.naturalWidth : this.naturalHeight;
      }

      return h * this.quality;
    },
    computedPlaceholderFontSize: function computedPlaceholderFontSize() {
      return this.placeholderFontSize * this.quality;
    },
    aspectRatio: function aspectRatio() {
      return this.naturalWidth / this.naturalHeight;
    },
    loadingStyle: function loadingStyle() {
      return {
        width: this.loadingSize + 'px',
        height: this.loadingSize + 'px',
        right: '15px',
        bottom: '10px'
      };
    }
  },

  mounted: function mounted() {
    var _this = this;

    this._initialize();
    u.rAFPolyfill();
    u.toBlobPolyfill();

    var supports = this.supportDetection();
    if (!supports.basic) {
      console.warn('Your browser does not support vue-croppa functionality.');
    }

    if (this.passive) {
      this.$watch('value._data', function (data) {
        var set$$1 = false;
        if (!data) return;
        for (var key in data) {
          if (syncData.indexOf(key) >= 0) {
            var val = data[key];
            if (val !== _this[key]) {
              _this.$set(_this, key, val);
              set$$1 = true;
            }
          }
        }
        if (set$$1) {
          if (!_this.img) {
            _this.remove();
          } else {
            _this.$nextTick(function () {
              _this._draw();
            });
          }
        }
      }, {
        deep: true
      });
    }

    this.useAutoSizing = !!(this.autoSizing && this.$refs.wrapper && getComputedStyle);
    if (this.useAutoSizing) {
      this._autoSizingInit();
    }
  },
  beforeDestroy: function beforeDestroy() {
    if (this.useAutoSizing) {
      this._autoSizingRemove();
    }
  },


  watch: {
    outputWidth: function outputWidth() {
      this.onDimensionChange();
    },
    outputHeight: function outputHeight() {
      this.onDimensionChange();
    },
    canvasColor: function canvasColor() {
      if (!this.img) {
        this._setPlaceholders();
      } else {
        this._draw();
      }
    },
    imageBorderRadius: function imageBorderRadius() {
      if (this.img) {
        this._draw();
      }
    },
    placeholder: function placeholder() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    placeholderColor: function placeholderColor() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    computedPlaceholderFontSize: function computedPlaceholderFontSize() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    preventWhiteSpace: function preventWhiteSpace(val) {
      if (val) {
        this.imageSet = false;
      }
      this._placeImage();
    },
    scaleRatio: function scaleRatio(val, oldVal) {
      if (this.passive) return;
      if (!this.img) return;
      if (!u.numberValid(val)) return;

      var x = 1;
      if (u.numberValid(oldVal) && oldVal !== 0) {
        x = val / oldVal;
      }
      var pos = this.currentPointerCoord || {
        x: this.imgData.startX + this.imgData.width / 2,
        y: this.imgData.startY + this.imgData.height / 2
      };
      this.imgData.width = this.naturalWidth * val;
      this.imgData.height = this.naturalHeight * val;

      if (!this.userMetadata && this.imageSet && !this.rotating) {
        var offsetX = (x - 1) * (pos.x - this.imgData.startX);
        var offsetY = (x - 1) * (pos.y - this.imgData.startY);
        this.imgData.startX = this.imgData.startX - offsetX;
        this.imgData.startY = this.imgData.startY - offsetY;
      }

      if (this.preventWhiteSpace) {
        this._preventZoomingToWhiteSpace();
        this._preventMovingToWhiteSpace();
      }
    },

    'imgData.width': function imgDataWidth(val, oldVal) {
      // if (this.passive) return
      if (!u.numberValid(val)) return;
      this.scaleRatio = val / this.naturalWidth;
      if (this.hasImage()) {
        if (Math.abs(val - oldVal) > val * (1 / 100000)) {
          this.emitEvent(events.ZOOM_EVENT);
          this._draw();
        }
      }
    },
    'imgData.height': function imgDataHeight(val) {
      // if (this.passive) return
      if (!u.numberValid(val)) return;
      this.scaleRatio = val / this.naturalHeight;
    },
    'imgData.startX': function imgDataStartX(val) {
      // if (this.passive) return
      if (this.hasImage()) {
        this.$nextTick(this._draw);
      }
    },
    'imgData.startY': function imgDataStartY(val) {
      // if (this.passive) return
      if (this.hasImage()) {
        this.$nextTick(this._draw);
      }
    },
    loading: function loading(val) {
      if (this.passive) return;
      if (val) {
        this.emitEvent(events.LOADING_START_EVENT);
      } else {
        this.emitEvent(events.LOADING_END_EVENT);
      }
    },
    autoSizing: function autoSizing(val) {
      this.useAutoSizing = !!(this.autoSizing && this.$refs.wrapper && getComputedStyle);
      if (val) {
        this._autoSizingInit();
      } else {
        this._autoSizingRemove();
      }
    }
  },

  methods: {
    emitEvent: function emitEvent() {
      // console.log(args[0])
      this.$emit.apply(this, arguments);
    },
    getCanvas: function getCanvas() {
      return this.canvas;
    },
    getContext: function getContext() {
      return this.ctx;
    },
    getChosenFile: function getChosenFile() {
      return this.chosenFile || this.$refs.fileInput.files[0];
    },
    move: function move(offset) {
      if (!offset || this.passive) return;
      var oldX = this.imgData.startX;
      var oldY = this.imgData.startY;
      this.imgData.startX += offset.x;
      this.imgData.startY += offset.y;
      if (this.preventWhiteSpace) {
        this._preventMovingToWhiteSpace();
      }
      if (this.imgData.startX !== oldX || this.imgData.startY !== oldY) {
        this.emitEvent(events.MOVE_EVENT);
        this._draw();
      }
    },
    moveUpwards: function moveUpwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: 0, y: -amount });
    },
    moveDownwards: function moveDownwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: 0, y: amount });
    },
    moveLeftwards: function moveLeftwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: -amount, y: 0 });
    },
    moveRightwards: function moveRightwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: amount, y: 0 });
    },
    zoom: function zoom() {
      var zoomIn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var acceleration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      if (this.passive) return;
      var realSpeed = this.zoomSpeed * acceleration;
      var speed = this.outputWidth * PCT_PER_ZOOM * realSpeed;
      var x = 1;
      if (zoomIn) {
        x = 1 + speed;
      } else if (this.imgData.width > MIN_WIDTH) {
        x = 1 - speed;
      }

      this.scaleRatio *= x;
    },
    zoomIn: function zoomIn() {
      this.zoom(true);
    },
    zoomOut: function zoomOut() {
      this.zoom(false);
    },
    rotate: function rotate() {
      var step = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      if (this.disableRotation || this.disabled || this.passive) return;
      step = parseInt(step);
      if (isNaN(step) || step > 3 || step < -3) {
        console.warn('Invalid argument for rotate() method. It should one of the integers from -3 to 3.');
        step = 1;
      }
      this._rotateByStep(step);
    },
    flipX: function flipX() {
      if (this.disableRotation || this.disabled || this.passive) return;
      this._setOrientation(2);
    },
    flipY: function flipY() {
      if (this.disableRotation || this.disabled || this.passive) return;
      this._setOrientation(4);
    },
    refresh: function refresh() {
      this.$nextTick(this._initialize);
    },
    hasImage: function hasImage() {
      return !!this.imageSet;
    },
    applyMetadata: function applyMetadata(metadata) {
      if (!metadata || this.passive) return;
      this.userMetadata = metadata;
      var ori = metadata.orientation || this.orientation || 1;
      this._setOrientation(ori, true);
    },
    generateDataUrl: function generateDataUrl(type, compressionRate) {
      if (!this.hasImage()) return '';
      return this.canvas.toDataURL(type, compressionRate);
    },
    generateBlob: function generateBlob(callback, mimeType, qualityArgument) {
      if (!this.hasImage()) {
        callback(null);
        return;
      }
      this.canvas.toBlob(callback, mimeType, qualityArgument);
    },
    promisedBlob: function promisedBlob() {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (typeof Promise == 'undefined') {
        console.warn('No Promise support. Please add Promise polyfill if you want to use this method.');
        return;
      }
      return new Promise(function (resolve, reject) {
        try {
          _this2.generateBlob.apply(_this2, [function (blob) {
            resolve(blob);
          }].concat(args));
        } catch (err) {
          reject(err);
        }
      });
    },
    getMetadata: function getMetadata() {
      if (!this.hasImage()) return {};
      var _imgData = this.imgData,
          startX = _imgData.startX,
          startY = _imgData.startY;


      return {
        startX: startX,
        startY: startY,
        scale: this.scaleRatio,
        orientation: this.orientation
      };
    },
    supportDetection: function supportDetection() {
      if (typeof window === 'undefined') return;
      var div = document.createElement('div');
      return {
        'basic': window.requestAnimationFrame && window.File && window.FileReader && window.FileList && window.Blob,
        'dnd': 'ondragstart' in div && 'ondrop' in div
      };
    },
    chooseFile: function chooseFile() {
      if (this.passive) return;
      this.$refs.fileInput.click();
    },
    remove: function remove() {
      if (!this.imageSet) return;
      this._setPlaceholders();

      var hadImage = this.img != null;
      this.originalImage = null;
      this.img = null;
      this.$refs.fileInput.value = '';
      this.imgData = {
        width: 0,
        height: 0,
        startX: 0,
        startY: 0
      };
      this.orientation = 1;
      this.scaleRatio = null;
      this.userMetadata = null;
      this.imageSet = false;
      this.chosenFile = null;
      if (this.video) {
        this.video.pause();
        this.video = null;
      }

      if (hadImage) {
        this.emitEvent(events.IMAGE_REMOVE_EVENT);
      }
    },
    addClipPlugin: function addClipPlugin(plugin) {
      if (!this.clipPlugins) {
        this.clipPlugins = [];
      }
      if (typeof plugin === 'function' && this.clipPlugins.indexOf(plugin) < 0) {
        this.clipPlugins.push(plugin);
      } else {
        throw Error('Clip plugins should be functions');
      }
    },
    emitNativeEvent: function emitNativeEvent(evt) {
      this.emitEvent(evt.type, evt);
    },
    setFile: function setFile(file) {
      this._onNewFileIn(file);
    },
    _setContainerSize: function _setContainerSize() {
      if (this.useAutoSizing) {
        this.realWidth = +getComputedStyle(this.$refs.wrapper).width.slice(0, -2);
        this.realHeight = +getComputedStyle(this.$refs.wrapper).height.slice(0, -2);
      }
    },
    _autoSizingInit: function _autoSizingInit() {
      this._setContainerSize();
      window.addEventListener('resize', this._setContainerSize);
    },
    _autoSizingRemove: function _autoSizingRemove() {
      this._setContainerSize();
      window.removeEventListener('resize', this._setContainerSize);
    },
    _initialize: function _initialize() {
      this.canvas = this.$refs.canvas;
      this._setSize();
      this.canvas.style.backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : typeof this.canvasColor === 'string' ? this.canvasColor : '';
      this.ctx = this.canvas.getContext('2d');
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = "high";
      this.ctx.webkitImageSmoothingEnabled = true;
      this.ctx.msImageSmoothingEnabled = true;
      this.ctx.imageSmoothingEnabled = true;
      this.originalImage = null;
      this.img = null;
      this.$refs.fileInput.value = '';
      this.imageSet = false;
      this.chosenFile = null;
      this._setInitial();
      if (!this.passive) {
        this.emitEvent(events.INIT_EVENT, this);
      }
    },
    _setSize: function _setSize() {
      this.canvas.width = this.outputWidth;
      this.canvas.height = this.outputHeight;
      this.canvas.style.width = (this.useAutoSizing ? this.realWidth : this.width) + 'px';
      this.canvas.style.height = (this.useAutoSizing ? this.realHeight : this.height) + 'px';
    },
    _rotateByStep: function _rotateByStep(step) {
      var orientation = 1;
      switch (step) {
        case 1:
          orientation = 6;
          break;
        case 2:
          orientation = 3;
          break;
        case 3:
          orientation = 8;
          break;
        case -1:
          orientation = 8;
          break;
        case -2:
          orientation = 3;
          break;
        case -3:
          orientation = 6;
          break;
      }
      this._setOrientation(orientation);
    },
    _setImagePlaceholder: function _setImagePlaceholder() {
      var _this3 = this;

      var img = void 0;
      if (this.$slots.placeholder && this.$slots.placeholder[0]) {
        var vNode = this.$slots.placeholder[0];
        var tag = vNode.tag,
            elm = vNode.elm;

        if (tag == 'img' && elm) {
          img = elm;
        }
      }

      if (!img) return;

      var onLoad = function onLoad() {
        _this3.ctx.drawImage(img, 0, 0, _this3.outputWidth, _this3.outputHeight);
      };

      if (u.imageLoaded(img)) {
        onLoad();
      } else {
        img.onload = onLoad;
      }
    },
    _setTextPlaceholder: function _setTextPlaceholder() {
      var ctx = this.ctx;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      var defaultFontSize = this.outputWidth * DEFAULT_PLACEHOLDER_TAKEUP / this.placeholder.length;
      var fontSize = !this.computedPlaceholderFontSize || this.computedPlaceholderFontSize == 0 ? defaultFontSize : this.computedPlaceholderFontSize;
      ctx.font = fontSize + 'px sans-serif';
      ctx.fillStyle = !this.placeholderColor || this.placeholderColor == 'default' ? '#606060' : this.placeholderColor;
      ctx.fillText(this.placeholder, this.outputWidth / 2, this.outputHeight / 2);
    },
    _setPlaceholders: function _setPlaceholders() {
      this._paintBackground();
      this._setImagePlaceholder();
      this._setTextPlaceholder();
    },
    _setInitial: function _setInitial() {
      var _this4 = this;

      var src = void 0,
          img = void 0;
      if (this.$slots.initial && this.$slots.initial[0]) {
        var vNode = this.$slots.initial[0];
        var tag = vNode.tag,
            elm = vNode.elm;

        if (tag == 'img' && elm) {
          img = elm;
        }
      }
      if (this.initialImage && typeof this.initialImage === 'string') {
        src = this.initialImage;
        img = new Image();
        if (!/^data:/.test(src) && !/^blob:/.test(src)) {
          img.setAttribute('crossOrigin', 'anonymous');
        }
        img.src = src;
      } else if (_typeof(this.initialImage) === 'object' && this.initialImage instanceof Image) {
        img = this.initialImage;
      }
      if (!src && !img) {
        this._setPlaceholders();
        return;
      }
      this.currentIsInitial = true;
      if (u.imageLoaded(img)) {
        // this.emitEvent(events.INITIAL_IMAGE_LOADED_EVENT)
        this._onload(img, +img.dataset['exifOrientation'], true);
      } else {
        this.loading = true;
        img.onload = function () {
          // this.emitEvent(events.INITIAL_IMAGE_LOADED_EVENT)
          _this4._onload(img, +img.dataset['exifOrientation'], true);
        };

        img.onerror = function () {
          _this4._setPlaceholders();
        };
      }
    },
    _onload: function _onload(img) {
      var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var initial = arguments[2];

      if (this.imageSet) {
        this.remove();
      }
      this.originalImage = img;
      this.img = img;

      if (isNaN(orientation)) {
        orientation = 1;
      }

      this._setOrientation(orientation);

      if (initial) {
        this.emitEvent(events.INITIAL_IMAGE_LOADED_EVENT);
      }
    },
    _onVideoLoad: function _onVideoLoad(video, initial) {
      var _this5 = this;

      this.video = video;
      var canvas = document.createElement('canvas');
      var videoWidth = video.videoWidth,
          videoHeight = video.videoHeight;

      canvas.width = videoWidth;
      canvas.height = videoHeight;
      var ctx = canvas.getContext('2d');
      this.loading = false;
      var drawFrame = function drawFrame(initial) {
        if (!_this5.video) return;
        ctx.drawImage(_this5.video, 0, 0, videoWidth, videoHeight);
        var frame = new Image();
        frame.src = canvas.toDataURL();
        frame.onload = function () {
          _this5.img = frame;
          // this._placeImage()
          if (initial) {
            _this5._placeImage();
          } else {
            _this5._draw();
          }
        };
      };
      drawFrame(true);
      var keepDrawing = function keepDrawing() {
        _this5.$nextTick(function () {
          drawFrame();
          if (!_this5.video || _this5.video.ended || _this5.video.paused) return;
          requestAnimationFrame(keepDrawing);
        });
      };
      this.video.addEventListener('play', function () {
        requestAnimationFrame(keepDrawing);
      });
    },
    _handleClick: function _handleClick(evt) {
      this.emitNativeEvent(evt);
      if (!this.hasImage() && !this.disableClickToChoose && !this.disabled && !this.supportTouch && !this.passive) {
        this.chooseFile();
      }
    },
    _handleDblClick: function _handleDblClick(evt) {
      this.emitNativeEvent(evt);
      if (this.videoEnabled && this.video) {
        if (this.video.paused || this.video.ended) {
          this.video.play();
        } else {
          this.video.pause();
        }
        return;
      }
    },
    _handleInputChange: function _handleInputChange() {
      var input = this.$refs.fileInput;
      if (!input.files.length || this.passive) return;

      var file = input.files[0];
      this._onNewFileIn(file);
    },
    _onNewFileIn: function _onNewFileIn(file) {
      var _this6 = this;

      this.currentIsInitial = false;
      this.loading = true;
      this.emitEvent(events.FILE_CHOOSE_EVENT, file);
      this.chosenFile = file;
      if (!this._fileSizeIsValid(file)) {
        this.loading = false;
        this.emitEvent(events.FILE_SIZE_EXCEED_EVENT, file);
        return false;
      }
      if (!this._fileTypeIsValid(file)) {
        this.loading = false;
        this.emitEvent(events.FILE_TYPE_MISMATCH_EVENT, file);
        var type = file.type || file.name.toLowerCase().split('.').pop();
        return false;
      }

      if (typeof window !== 'undefined' && typeof window.FileReader !== 'undefined') {
        var fr = new FileReader();
        fr.onload = function (e) {
          var fileData = e.target.result;
          var base64 = u.parseDataUrl(fileData);
          var isVideo = /^video/.test(file.type);
          if (isVideo) {
            var video = document.createElement('video');
            video.src = fileData;
            fileData = null;
            if (video.readyState >= video.HAVE_FUTURE_DATA) {
              _this6._onVideoLoad(video);
            } else {
              video.addEventListener('canplay', function () {
                console.log('can play event');
                _this6._onVideoLoad(video);
              }, false);
            }
          } else {
            var orientation = 1;
            try {
              orientation = u.getFileOrientation(u.base64ToArrayBuffer(base64));
            } catch (err) {}
            if (orientation < 1) orientation = 1;
            var img = new Image();
            img.src = fileData;
            fileData = null;
            img.onload = function () {
              _this6._onload(img, orientation);
              _this6.emitEvent(events.NEW_IMAGE_EVENT);
            };
          }
        };
        fr.readAsDataURL(file);
      }
    },
    _fileSizeIsValid: function _fileSizeIsValid(file) {
      if (!file) return false;
      if (!this.fileSizeLimit || this.fileSizeLimit == 0) return true;

      return file.size < this.fileSizeLimit;
    },
    _fileTypeIsValid: function _fileTypeIsValid(file) {
      var acceptableMimeType = this.videoEnabled && /^video/.test(file.type) && document.createElement('video').canPlayType(file.type) || /^image/.test(file.type);
      if (!acceptableMimeType) return false;
      if (!this.accept) return true;
      var accept = this.accept;
      var baseMimetype = accept.replace(/\/.*$/, '');
      var types = accept.split(',');
      for (var i = 0, len = types.length; i < len; i++) {
        var type = types[i];
        var t = type.trim();
        if (t.charAt(0) == '.') {
          if (file.name.toLowerCase().split('.').pop() === t.toLowerCase().slice(1)) return true;
        } else if (/\/\*$/.test(t)) {
          var fileBaseType = file.type.replace(/\/.*$/, '');
          if (fileBaseType === baseMimetype) {
            return true;
          }
        } else if (file.type === type) {
          return true;
        }
      }

      return false;
    },
    _placeImage: function _placeImage(applyMetadata) {
      if (!this.img) return;
      var imgData = this.imgData;

      this.naturalWidth = this.img.naturalWidth;
      this.naturalHeight = this.img.naturalHeight;

      imgData.startX = u.numberValid(imgData.startX) ? imgData.startX : 0;
      imgData.startY = u.numberValid(imgData.startY) ? imgData.startY : 0;

      if (this.preventWhiteSpace) {
        this._aspectFill();
      } else if (!this.imageSet) {
        if (this.initialSize == 'contain') {
          this._aspectFit();
        } else if (this.initialSize == 'natural') {
          this._naturalSize();
        } else {
          this._aspectFill();
        }
      } else {
        this.imgData.width = this.naturalWidth * this.scaleRatio;
        this.imgData.height = this.naturalHeight * this.scaleRatio;
      }

      if (!this.imageSet) {
        if (/top/.test(this.initialPosition)) {
          imgData.startY = 0;
        } else if (/bottom/.test(this.initialPosition)) {
          imgData.startY = this.outputHeight - imgData.height;
        }

        if (/left/.test(this.initialPosition)) {
          imgData.startX = 0;
        } else if (/right/.test(this.initialPosition)) {
          imgData.startX = this.outputWidth - imgData.width;
        }

        if (/^-?\d+% -?\d+%$/.test(this.initialPosition)) {
          var result = /^(-?\d+)% (-?\d+)%$/.exec(this.initialPosition);
          var x = +result[1] / 100;
          var y = +result[2] / 100;
          imgData.startX = x * (this.outputWidth - imgData.width);
          imgData.startY = y * (this.outputHeight - imgData.height);
        }
      }

      applyMetadata && this._applyMetadata();

      if (applyMetadata && this.preventWhiteSpace) {
        this.zoom(false, 0);
      } else {
        this.move({ x: 0, y: 0 });
        this._draw();
      }
    },
    _aspectFill: function _aspectFill() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var canvasRatio = this.outputWidth / this.outputHeight;
      var scaleRatio = void 0;

      if (this.aspectRatio > canvasRatio) {
        scaleRatio = imgHeight / this.outputHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.outputHeight;
        this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
        this.imgData.startY = 0;
      } else {
        scaleRatio = imgWidth / this.outputWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.outputWidth;
        this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
        this.imgData.startX = 0;
      }
    },
    _aspectFit: function _aspectFit() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var canvasRatio = this.outputWidth / this.outputHeight;
      var scaleRatio = void 0;
      if (this.aspectRatio > canvasRatio) {
        scaleRatio = imgWidth / this.outputWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.outputWidth;
        this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
        this.imgData.startX = 0;
      } else {
        scaleRatio = imgHeight / this.outputHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.outputHeight;
        this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
        this.imgData.startY = 0;
      }
    },
    _naturalSize: function _naturalSize() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      this.imgData.width = imgWidth;
      this.imgData.height = imgHeight;
      this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
      this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
    },
    _handlePointerStart: function _handlePointerStart(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      this.supportTouch = true;
      this.pointerMoved = false;
      var pointerCoord = u.getPointerCoords(evt, this);
      this.pointerStartCoord = pointerCoord;

      if (this.disabled) return;
      // simulate click with touch on mobile devices
      if (!this.hasImage() && !this.disableClickToChoose) {
        this.tabStart = new Date().valueOf();
        return;
      }
      // ignore mouse right click and middle click
      if (evt.which && evt.which > 1) return;

      if (!evt.touches || evt.touches.length === 1) {
        this.dragging = true;
        this.pinching = false;
        var coord = u.getPointerCoords(evt, this);
        this.lastMovingCoord = coord;
      }

      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
        this.dragging = false;
        this.pinching = true;
        this.pinchDistance = u.getPinchDistance(evt, this);
      }

      var cancelEvents = ['mouseup', 'touchend', 'touchcancel', 'pointerend', 'pointercancel'];
      for (var i = 0, len = cancelEvents.length; i < len; i++) {
        var e = cancelEvents[i];
        document.addEventListener(e, this._handlePointerEnd);
      }
    },
    _handlePointerEnd: function _handlePointerEnd(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      var pointerMoveDistance = 0;
      if (this.pointerStartCoord) {
        var pointerCoord = u.getPointerCoords(evt, this);
        pointerMoveDistance = Math.sqrt(Math.pow(pointerCoord.x - this.pointerStartCoord.x, 2) + Math.pow(pointerCoord.y - this.pointerStartCoord.y, 2)) || 0;
      }
      if (this.disabled) return;
      if (!this.hasImage() && !this.disableClickToChoose) {
        var tabEnd = new Date().valueOf();
        if (pointerMoveDistance < CLICK_MOVE_THRESHOLD && tabEnd - this.tabStart < MIN_MS_PER_CLICK && this.supportTouch) {
          this.chooseFile();
        }
        this.tabStart = 0;
        return;
      }

      this.dragging = false;
      this.pinching = false;
      this.pinchDistance = 0;
      this.lastMovingCoord = null;
      this.pointerMoved = false;
      this.pointerStartCoord = null;
    },
    _handlePointerMove: function _handlePointerMove(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      this.pointerMoved = true;
      if (!this.hasImage()) return;
      var coord = u.getPointerCoords(evt, this);
      this.currentPointerCoord = coord;

      if (this.disabled || this.disableDragToMove) return;

      evt.preventDefault();
      if (!evt.touches || evt.touches.length === 1) {
        if (!this.dragging) return;
        if (this.lastMovingCoord) {
          this.move({
            x: coord.x - this.lastMovingCoord.x,
            y: coord.y - this.lastMovingCoord.y
          });
        }
        this.lastMovingCoord = coord;
      }

      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
        if (!this.pinching) return;
        var distance = u.getPinchDistance(evt, this);
        var delta = distance - this.pinchDistance;
        this.zoom(delta > 0, PINCH_ACCELERATION);
        this.pinchDistance = distance;
      }
    },
    _handlePointerLeave: function _handlePointerLeave(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      this.currentPointerCoord = null;
    },
    _handleWheel: function _handleWheel(evt) {
      var _this7 = this;

      this.emitNativeEvent(evt);
      if (this.passive) return;
      if (this.disabled || this.disableScrollToZoom || !this.hasImage()) return;
      evt.preventDefault();
      this.scrolling = true;
      if (evt.wheelDelta < 0 || evt.deltaY > 0 || evt.detail > 0) {
        this.zoom(this.reverseScrollToZoom);
      } else if (evt.wheelDelta > 0 || evt.deltaY < 0 || evt.detail < 0) {
        this.zoom(!this.reverseScrollToZoom);
      }
      this.$nextTick(function () {
        _this7.scrolling = false;
      });
    },
    _handleDragEnter: function _handleDragEnter(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      if (this.disabled || this.disableDragAndDrop || !u.eventHasFile(evt)) return;
      if (this.hasImage() && !this.replaceDrop) return;
      this.fileDraggedOver = true;
    },
    _handleDragLeave: function _handleDragLeave(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      this.fileDraggedOver = false;
    },
    _handleDragOver: function _handleDragOver(evt) {
      this.emitNativeEvent(evt);
    },
    _handleDrop: function _handleDrop(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      if (this.hasImage() && !this.replaceDrop) {
        return;
      }
      this.fileDraggedOver = false;

      var file = void 0;
      var dt = evt.dataTransfer;
      if (!dt) return;
      if (dt.items) {
        for (var i = 0, len = dt.items.length; i < len; i++) {
          var item = dt.items[i];
          if (item.kind == 'file') {
            file = item.getAsFile();
            break;
          }
        }
      } else {
        file = dt.files[0];
      }

      if (file) {
        this._onNewFileIn(file);
      }
    },
    _preventMovingToWhiteSpace: function _preventMovingToWhiteSpace() {
      if (this.imgData.startX > 0) {
        this.imgData.startX = 0;
      }
      if (this.imgData.startY > 0) {
        this.imgData.startY = 0;
      }
      if (this.outputWidth - this.imgData.startX > this.imgData.width) {
        this.imgData.startX = -(this.imgData.width - this.outputWidth);
      }
      if (this.outputHeight - this.imgData.startY > this.imgData.height) {
        this.imgData.startY = -(this.imgData.height - this.outputHeight);
      }
    },
    _preventZoomingToWhiteSpace: function _preventZoomingToWhiteSpace() {
      if (this.imgData.width < this.outputWidth) {
        this.scaleRatio = this.outputWidth / this.naturalWidth;
      }

      if (this.imgData.height < this.outputHeight) {
        this.scaleRatio = this.outputHeight / this.naturalHeight;
      }
    },
    _setOrientation: function _setOrientation() {
      var _this8 = this;

      var orientation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;
      var applyMetadata = arguments[1];

      var useOriginal = applyMetadata;
      if (orientation > 1 || useOriginal) {
        if (!this.img) return;
        this.rotating = true;
        // u.getRotatedImageData(useOriginal ? this.originalImage : this.img, orientation)
        var _img = u.getRotatedImage(useOriginal ? this.originalImage : this.img, orientation);
        _img.onload = function () {
          _this8.img = _img;
          _this8._placeImage(applyMetadata);
        };
      } else {
        this._placeImage(applyMetadata);
      }

      if (orientation == 2) {
        // flip x
        this.orientation = u.flipX(this.orientation);
      } else if (orientation == 4) {
        // flip y
        this.orientation = u.flipY(this.orientation);
      } else if (orientation == 6) {
        // 90 deg
        this.orientation = u.rotate90(this.orientation);
      } else if (orientation == 3) {
        // 180 deg
        this.orientation = u.rotate90(u.rotate90(this.orientation));
      } else if (orientation == 8) {
        // 270 deg
        this.orientation = u.rotate90(u.rotate90(u.rotate90(this.orientation)));
      } else {
        this.orientation = orientation;
      }

      if (useOriginal) {
        this.orientation = orientation;
      }
    },
    _paintBackground: function _paintBackground() {
      var backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : this.canvasColor;
      this.ctx.fillStyle = backgroundColor;
      this.ctx.clearRect(0, 0, this.outputWidth, this.outputHeight);
      this.ctx.fillRect(0, 0, this.outputWidth, this.outputHeight);
    },
    _draw: function _draw() {
      var _this9 = this;

      this.$nextTick(function () {
        if (typeof window !== 'undefined' && window.requestAnimationFrame) {
          requestAnimationFrame(_this9._drawFrame);
        } else {
          _this9._drawFrame();
        }
      });
    },
    _drawFrame: function _drawFrame() {
      if (!this.img) return;
      this.loading = false;
      var ctx = this.ctx;
      var _imgData2 = this.imgData,
          startX = _imgData2.startX,
          startY = _imgData2.startY,
          width = _imgData2.width,
          height = _imgData2.height;


      this._paintBackground();
      ctx.drawImage(this.img, startX, startY, width, height);

      if (this.preventWhiteSpace) {
        this._clip(this._createContainerClipPath);
        // this._clip(this._createImageClipPath)
      }

      this.emitEvent(events.DRAW_EVENT, ctx);
      if (!this.imageSet) {
        this.imageSet = true;
        this.emitEvent(events.NEW_IMAGE_DRAWN_EVENT);
      }
      this.rotating = false;
    },
    _clipPathFactory: function _clipPathFactory(x, y, width, height) {
      var ctx = this.ctx;
      var radius = typeof this.imageBorderRadius === 'number' ? this.imageBorderRadius : !isNaN(Number(this.imageBorderRadius)) ? Number(this.imageBorderRadius) : 0;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    },
    _createContainerClipPath: function _createContainerClipPath() {
      var _this10 = this;

      this._clipPathFactory(0, 0, this.outputWidth, this.outputHeight);
      if (this.clipPlugins && this.clipPlugins.length) {
        this.clipPlugins.forEach(function (func) {
          func(_this10.ctx, 0, 0, _this10.outputWidth, _this10.outputHeight);
        });
      }
    },


    // _createImageClipPath () {
    //   let { startX, startY, width, height } = this.imgData
    //   let w = width
    //   let h = height
    //   let x = startX
    //   let y = startY
    //   if (w < h) {
    //     h = this.outputHeight * (width / this.outputWidth)
    //   }
    //   if (h < w) {
    //     w = this.outputWidth * (height / this.outputHeight)
    //     x = startX + (width - this.outputWidth) / 2
    //   }
    //   this._clipPathFactory(x, startY, w, h)
    // },

    _clip: function _clip(createPath) {
      var ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.globalCompositeOperation = 'destination-in';
      createPath();
      ctx.fill();
      ctx.restore();
    },
    _applyMetadata: function _applyMetadata() {
      var _this11 = this;

      if (!this.userMetadata) return;
      var _userMetadata = this.userMetadata,
          startX = _userMetadata.startX,
          startY = _userMetadata.startY,
          scale = _userMetadata.scale;


      if (u.numberValid(startX)) {
        this.imgData.startX = startX;
      }

      if (u.numberValid(startY)) {
        this.imgData.startY = startY;
      }

      if (u.numberValid(scale)) {
        this.scaleRatio = scale;
      }

      this.$nextTick(function () {
        _this11.userMetadata = null;
      });
    },
    onDimensionChange: function onDimensionChange() {
      if (!this.img) {
        this._initialize();
      } else {
        if (this.preventWhiteSpace) {
          this.imageSet = false;
        }
        this._setSize();
        this._placeImage();
      }
    }
  }
};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var defaultOptions = {
  componentName: 'croppa'
};

var VueCroppa = {
  install: function install(Vue, options) {
    options = objectAssign({}, defaultOptions, options);
    var version = Number(Vue.version.split('.')[0]);
    if (version < 2) {
      throw new Error('vue-croppa supports vue version 2.0 and above. You are using Vue@' + version + '. Please upgrade to the latest version of Vue.');
    }
    var componentName = options.componentName || 'croppa';

    // registration
    Vue.component(componentName, component);
  },

  component: component
};

return VueCroppa;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIHBhcnNlRGF0YVVybCAodXJsKSB7XHJcbiAgICBjb25zdCByZWcgPSAvXmRhdGE6KFteO10rKT8oO2Jhc2U2NCk/LCguKikvZ21pXHJcbiAgICByZXR1cm4gcmVnLmV4ZWModXJsKVszXVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgbnVtYmVyVmFsaWQgKG4pIHtcclxuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKG4pXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9XHJcbiAgTnVtYmVyLmlzSW50ZWdlciB8fFxyXG4gIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJlxyXG4gICAgICBpc0Zpbml0ZSh2YWx1ZSkgJiZcclxuICAgICAgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXHJcbiAgICApXHJcbiAgfVxyXG5cclxudmFyIGluaXRpYWxJbWFnZVR5cGUgPSBTdHJpbmdcclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5JbWFnZSkge1xyXG4gIGluaXRpYWxJbWFnZVR5cGUgPSBbU3RyaW5nLCBJbWFnZV1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHZhbHVlOiBPYmplY3QsXHJcbiAgd2lkdGg6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaGVpZ2h0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2FudmFzQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICd0cmFuc3BhcmVudCdcclxuICB9LFxyXG4gIHF1YWxpdHk6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiBTdHJpbmcsXHJcbiAgZmlsZVNpemVMaW1pdDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gIGRpc2FibGVEcmFnQW5kRHJvcDogQm9vbGVhbixcclxuICBkaXNhYmxlQ2xpY2tUb0Nob29zZTogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ1RvTW92ZTogQm9vbGVhbixcclxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxyXG4gIGRpc2FibGVQaW5jaFRvWm9vbTogQm9vbGVhbixcclxuICBkaXNhYmxlUm90YXRpb246IEJvb2xlYW4sXHJcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcclxuICBzaG93UmVtb3ZlQnV0dG9uOiB7XHJcbiAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgZGVmYXVsdDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdyZWQnXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25TaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICB9LFxyXG4gIGluaXRpYWxJbWFnZTogaW5pdGlhbEltYWdlVHlwZSxcclxuICBpbml0aWFsU2l6ZToge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ2NvdmVyJyxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID09PSAnY292ZXInIHx8IHZhbCA9PT0gJ2NvbnRhaW4nIHx8IHZhbCA9PT0gJ25hdHVyYWwnXHJcbiAgICB9XHJcbiAgfSxcclxuICBpbml0aWFsUG9zaXRpb246IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdjZW50ZXInLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHZhciB2YWxpZHMgPSBbJ2NlbnRlcicsICd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnXVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHZhbC5zcGxpdCgnICcpLmV2ZXJ5KHdvcmQgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHZhbGlkcy5pbmRleE9mKHdvcmQpID49IDBcclxuICAgICAgICB9KSB8fCAvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodmFsKVxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgfSxcclxuICBpbnB1dEF0dHJzOiBPYmplY3QsXHJcbiAgc2hvd0xvYWRpbmc6IEJvb2xlYW4sXHJcbiAgbG9hZGluZ1NpemU6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwXHJcbiAgfSxcclxuICBsb2FkaW5nQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICcjNjA2MDYwJ1xyXG4gIH0sXHJcbiAgcmVwbGFjZURyb3A6IEJvb2xlYW4sXHJcbiAgcGFzc2l2ZTogQm9vbGVhbixcclxuICBpbWFnZUJvcmRlclJhZGl1czoge1xyXG4gICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgIGRlZmF1bHQ6IDBcclxuICB9LFxyXG4gIGF1dG9TaXppbmc6IEJvb2xlYW4sXHJcbiAgdmlkZW9FbmFibGVkOiBCb29sZWFuLFxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgSU5JVF9FVkVOVDogJ2luaXQnLFxuICBGSUxFX0NIT09TRV9FVkVOVDogJ2ZpbGUtY2hvb3NlJyxcbiAgRklMRV9TSVpFX0VYQ0VFRF9FVkVOVDogJ2ZpbGUtc2l6ZS1leGNlZWQnLFxuICBGSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQ6ICdmaWxlLXR5cGUtbWlzbWF0Y2gnLFxuICBORVdfSU1BR0VfRVZFTlQ6ICduZXctaW1hZ2UnLFxuICBORVdfSU1BR0VfRFJBV05fRVZFTlQ6ICduZXctaW1hZ2UtZHJhd24nLFxuICBJTUFHRV9SRU1PVkVfRVZFTlQ6ICdpbWFnZS1yZW1vdmUnLFxuICBNT1ZFX0VWRU5UOiAnbW92ZScsXG4gIFpPT01fRVZFTlQ6ICd6b29tJyxcbiAgRFJBV19FVkVOVDogJ2RyYXcnLFxuICBJTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVDogJ2luaXRpYWwtaW1hZ2UtbG9hZGVkJyxcbiAgTE9BRElOR19TVEFSVF9FVkVOVDogJ2xvYWRpbmctc3RhcnQnLFxuICBMT0FESU5HX0VORF9FVkVOVDogJ2xvYWRpbmctZW5kJ1xufVxuIiwiPHRlbXBsYXRlPlxyXG4gIDxkaXYgcmVmPVwid3JhcHBlclwiXHJcbiAgICA6Y2xhc3M9XCJgY3JvcHBhLWNvbnRhaW5lciAke2ltZyA/ICdjcm9wcGEtLWhhcy10YXJnZXQnIDogJyd9ICR7cGFzc2l2ZSA/ICdjcm9wcGEtLXBhc3NpdmUnIDogJyd9ICR7ZGlzYWJsZWQgPyAnY3JvcHBhLS1kaXNhYmxlZCcgOiAnJ30gJHtkaXNhYmxlQ2xpY2tUb0Nob29zZSA/ICdjcm9wcGEtLWRpc2FibGVkLWNjJyA6ICcnfSAke2Rpc2FibGVEcmFnVG9Nb3ZlICYmIGRpc2FibGVTY3JvbGxUb1pvb20gPyAnY3JvcHBhLS1kaXNhYmxlZC1teicgOiAnJ30gJHtmaWxlRHJhZ2dlZE92ZXIgPyAnY3JvcHBhLS1kcm9wem9uZScgOiAnJ31gXCJcclxuICAgIEBkcmFnZW50ZXIuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdFbnRlclwiXHJcbiAgICBAZHJhZ2xlYXZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVEcmFnTGVhdmVcIlxyXG4gICAgQGRyYWdvdmVyLnN0b3AucHJldmVudD1cIl9oYW5kbGVEcmFnT3ZlclwiXHJcbiAgICBAZHJvcC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJvcFwiPlxyXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCJcclxuICAgICAgOmFjY2VwdD1cImFjY2VwdFwiXHJcbiAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcclxuICAgICAgdi1iaW5kPVwiaW5wdXRBdHRyc1wiXHJcbiAgICAgIHJlZj1cImZpbGVJbnB1dFwiXHJcbiAgICAgIEBjaGFuZ2U9XCJfaGFuZGxlSW5wdXRDaGFuZ2VcIlxyXG4gICAgICBzdHlsZT1cImhlaWdodDoxcHg7d2lkdGg6MXB4O292ZXJmbG93OmhpZGRlbjttYXJnaW4tbGVmdDotOTk5OTlweDtwb3NpdGlvbjphYnNvbHV0ZTtcIiAvPlxyXG4gICAgPGRpdiBjbGFzcz1cInNsb3RzXCJcclxuICAgICAgc3R5bGU9XCJ3aWR0aDogMDsgaGVpZ2h0OiAwOyB2aXNpYmlsaXR5OiBoaWRkZW47XCI+XHJcbiAgICAgIDxzbG90IG5hbWU9XCJpbml0aWFsXCI+PC9zbG90PlxyXG4gICAgICA8c2xvdCBuYW1lPVwicGxhY2Vob2xkZXJcIj48L3Nsb3Q+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCJcclxuICAgICAgQGNsaWNrLnN0b3AucHJldmVudD1cIl9oYW5kbGVDbGlja1wiXHJcbiAgICAgIEBkYmxjbGljay5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRGJsQ2xpY2tcIlxyXG4gICAgICBAdG91Y2hzdGFydC5zdG9wPVwiX2hhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgIEBtb3VzZWRvd24uc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgIEBwb2ludGVyc3RhcnQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgIEB0b3VjaGVuZC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgIEB0b3VjaGNhbmNlbC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgIEBtb3VzZXVwLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgQHBvaW50ZXJlbmQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICBAcG9pbnRlcmNhbmNlbC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgIEB0b3VjaG1vdmUuc3RvcD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgIEBtb3VzZW1vdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgQHBvaW50ZXJtb3ZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgIEBwb2ludGVybGVhdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJMZWF2ZVwiXHJcbiAgICAgIEBET01Nb3VzZVNjcm9sbC5zdG9wPVwiX2hhbmRsZVdoZWVsXCJcclxuICAgICAgQHdoZWVsLnN0b3A9XCJfaGFuZGxlV2hlZWxcIlxyXG4gICAgICBAbW91c2V3aGVlbC5zdG9wPVwiX2hhbmRsZVdoZWVsXCI+PC9jYW52YXM+XHJcbiAgICA8c3ZnIGNsYXNzPVwiaWNvbiBpY29uLXJlbW92ZVwiXHJcbiAgICAgIHYtaWY9XCJzaG93UmVtb3ZlQnV0dG9uICYmIGltZyAmJiAhcGFzc2l2ZVwiXHJcbiAgICAgIEBjbGljaz1cInJlbW92ZVwiXHJcbiAgICAgIDpzdHlsZT1cImB0b3A6IC0ke2hlaWdodC80MH1weDsgcmlnaHQ6IC0ke3dpZHRoLzQwfXB4YFwiXHJcbiAgICAgIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCJcclxuICAgICAgdmVyc2lvbj1cIjEuMVwiXHJcbiAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxyXG4gICAgICA6d2lkdGg9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCJcclxuICAgICAgOmhlaWdodD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIj5cclxuICAgICAgPHBhdGggZD1cIk01MTEuOTIxMjMxIDBDMjI5LjE3OTA3NyAwIDAgMjI5LjI1Nzg0NiAwIDUxMiAwIDc5NC43MDI3NjkgMjI5LjE3OTA3NyAxMDI0IDUxMS45MjEyMzEgMTAyNCA3OTQuNzgxNTM4IDEwMjQgMTAyNCA3OTQuNzAyNzY5IDEwMjQgNTEyIDEwMjQgMjI5LjI1Nzg0NiA3OTQuNzgxNTM4IDAgNTExLjkyMTIzMSAwWk03MzIuMDQxODQ2IDY1MC42MzM4NDYgNjUwLjUxNTY5MiA3MzIuMDgxMjMxQzY1MC41MTU2OTIgNzMyLjA4MTIzMSA1MjEuNDkxNjkyIDU5My42ODM2OTIgNTExLjg4MTg0NiA1OTMuNjgzNjkyIDUwMi40Mjk1MzggNTkzLjY4MzY5MiAzNzMuMzY2MTU0IDczMi4wODEyMzEgMzczLjM2NjE1NCA3MzIuMDgxMjMxTDI5MS43NjEyMzEgNjUwLjYzMzg0NkMyOTEuNzYxMjMxIDY1MC42MzM4NDYgNDMwLjMxNjMwOCA1MjMuNTAwMzA4IDQzMC4zMTYzMDggNTEyLjE5NjkyMyA0MzAuMzE2MzA4IDUwMC42OTY2MTUgMjkxLjc2MTIzMSAzNzMuNTIzNjkyIDI5MS43NjEyMzEgMzczLjUyMzY5MkwzNzMuMzY2MTU0IDI5MS45MTg3NjlDMzczLjM2NjE1NCAyOTEuOTE4NzY5IDUwMy40NTM1MzggNDMwLjM5NTA3NyA1MTEuODgxODQ2IDQzMC4zOTUwNzcgNTIwLjM0OTUzOCA0MzAuMzk1MDc3IDY1MC41MTU2OTIgMjkxLjkxODc2OSA2NTAuNTE1NjkyIDI5MS45MTg3NjlMNzMyLjA0MTg0NiAzNzMuNTIzNjkyQzczMi4wNDE4NDYgMzczLjUyMzY5MiA1OTMuNDQ3Mzg1IDUwMi41NDc2OTIgNTkzLjQ0NzM4NSA1MTIuMTk2OTIzIDU5My40NDczODUgNTIxLjQxMjkyMyA3MzIuMDQxODQ2IDY1MC42MzM4NDYgNzMyLjA0MTg0NiA2NTAuNjMzODQ2WlwiXHJcbiAgICAgICAgOmZpbGw9XCJyZW1vdmVCdXR0b25Db2xvclwiPjwvcGF0aD5cclxuICAgIDwvc3ZnPlxyXG4gICAgPGRpdiBjbGFzcz1cInNrLWZhZGluZy1jaXJjbGVcIlxyXG4gICAgICA6c3R5bGU9XCJsb2FkaW5nU3R5bGVcIlxyXG4gICAgICB2LWlmPVwic2hvd0xvYWRpbmcgJiYgbG9hZGluZ1wiPlxyXG4gICAgICA8ZGl2IDpjbGFzcz1cImBzay1jaXJjbGUke2l9IHNrLWNpcmNsZWBcIlxyXG4gICAgICAgIHYtZm9yPVwiaSBpbiAxMlwiXHJcbiAgICAgICAgOmtleT1cImlcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlLWluZGljYXRvclwiXHJcbiAgICAgICAgICA6c3R5bGU9XCJ7YmFja2dyb3VuZENvbG9yOiBsb2FkaW5nQ29sb3J9XCI+PC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8c2xvdD48L3Nsb3Q+XHJcbiAgPC9kaXY+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c2NyaXB0PlxyXG5pbXBvcnQgdSBmcm9tICcuL3V0aWwnXHJcbmltcG9ydCBwcm9wcyBmcm9tICcuL3Byb3BzJ1xyXG5pbXBvcnQgZXZlbnRzIGZyb20gJy4vZXZlbnRzJ1xyXG5cclxuY29uc3QgUENUX1BFUl9aT09NID0gMSAvIDEwMDAwMCAvLyBUaGUgYW1vdW50IG9mIHpvb21pbmcgZXZlcnl0aW1lIGl0IGhhcHBlbnMsIGluIHBlcmNlbnRhZ2Ugb2YgaW1hZ2Ugd2lkdGguXHJcbmNvbnN0IE1JTl9NU19QRVJfQ0xJQ0sgPSA1MDAgLy8gSWYgdG91Y2ggZHVyYXRpb24gaXMgc2hvcnRlciB0aGFuIHRoZSB2YWx1ZSwgdGhlbiBpdCBpcyBjb25zaWRlcmVkIGFzIGEgY2xpY2suXHJcbmNvbnN0IENMSUNLX01PVkVfVEhSRVNIT0xEID0gMTAwIC8vIElmIHRvdWNoIG1vdmUgZGlzdGFuY2UgaXMgZ3JlYXRlciB0aGFuIHRoaXMgdmFsdWUsIHRoZW4gaXQgd2lsbCBieSBubyBtZWFuIGJlIGNvbnNpZGVyZWQgYXMgYSBjbGljay5cclxuY29uc3QgTUlOX1dJRFRIID0gMTAgLy8gVGhlIG1pbmltYWwgd2lkdGggdGhlIHVzZXIgY2FuIHpvb20gdG8uXHJcbmNvbnN0IERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQID0gMiAvIDMgLy8gUGxhY2Vob2xkZXIgdGV4dCBieSBkZWZhdWx0IHRha2VzIHVwIHRoaXMgYW1vdW50IG9mIHRpbWVzIG9mIGNhbnZhcyB3aWR0aC5cclxuY29uc3QgUElOQ0hfQUNDRUxFUkFUSU9OID0gMSAvLyBUaGUgYW1vdW50IG9mIHRpbWVzIGJ5IHdoaWNoIHRoZSBwaW5jaGluZyBpcyBtb3JlIHNlbnNpdGl2ZSB0aGFuIHRoZSBzY29sbGluZ1xyXG5cclxuY29uc3Qgc3luY0RhdGEgPSBbJ2ltZ0RhdGEnLCAnaW1nJywgJ2ltZ1NldCcsICdvcmlnaW5hbEltYWdlJywgJ25hdHVyYWxIZWlnaHQnLCAnbmF0dXJhbFdpZHRoJywgJ29yaWVudGF0aW9uJywgJ3NjYWxlUmF0aW8nXVxyXG4vLyBjb25zdCBERUJVRyA9IGZhbHNlXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbW9kZWw6IHtcclxuICAgIHByb3A6ICd2YWx1ZScsXHJcbiAgICBldmVudDogZXZlbnRzLklOSVRfRVZFTlRcclxuICB9LFxyXG5cclxuICBwcm9wczogcHJvcHMsXHJcblxyXG4gIGRhdGEgKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgY2FudmFzOiBudWxsLFxyXG4gICAgICBjdHg6IG51bGwsXHJcbiAgICAgIG9yaWdpbmFsSW1hZ2U6IG51bGwsXHJcbiAgICAgIGltZzogbnVsbCxcclxuICAgICAgdmlkZW86IG51bGwsXHJcbiAgICAgIGRyYWdnaW5nOiBmYWxzZSxcclxuICAgICAgbGFzdE1vdmluZ0Nvb3JkOiBudWxsLFxyXG4gICAgICBpbWdEYXRhOiB7XHJcbiAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgaGVpZ2h0OiAwLFxyXG4gICAgICAgIHN0YXJ0WDogMCxcclxuICAgICAgICBzdGFydFk6IDBcclxuICAgICAgfSxcclxuICAgICAgZmlsZURyYWdnZWRPdmVyOiBmYWxzZSxcclxuICAgICAgdGFiU3RhcnQ6IDAsXHJcbiAgICAgIHNjcm9sbGluZzogZmFsc2UsXHJcbiAgICAgIHBpbmNoaW5nOiBmYWxzZSxcclxuICAgICAgcm90YXRpbmc6IGZhbHNlLFxyXG4gICAgICBwaW5jaERpc3RhbmNlOiAwLFxyXG4gICAgICBzdXBwb3J0VG91Y2g6IGZhbHNlLFxyXG4gICAgICBwb2ludGVyTW92ZWQ6IGZhbHNlLFxyXG4gICAgICBwb2ludGVyU3RhcnRDb29yZDogbnVsbCxcclxuICAgICAgbmF0dXJhbFdpZHRoOiAwLFxyXG4gICAgICBuYXR1cmFsSGVpZ2h0OiAwLFxyXG4gICAgICBzY2FsZVJhdGlvOiBudWxsLFxyXG4gICAgICBvcmllbnRhdGlvbjogMSxcclxuICAgICAgdXNlck1ldGFkYXRhOiBudWxsLFxyXG4gICAgICBpbWFnZVNldDogZmFsc2UsXHJcbiAgICAgIGN1cnJlbnRQb2ludGVyQ29vcmQ6IG51bGwsXHJcbiAgICAgIGN1cnJlbnRJc0luaXRpYWw6IGZhbHNlLFxyXG4gICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgcmVhbFdpZHRoOiAwLCAvLyBvbmx5IGZvciB3aGVuIGF1dG9TaXppbmcgaXMgb25cclxuICAgICAgcmVhbEhlaWdodDogMCwgLy8gb25seSBmb3Igd2hlbiBhdXRvU2l6aW5nIGlzIG9uXHJcbiAgICAgIGNob3NlbkZpbGU6IG51bGwsXHJcbiAgICAgIHVzZUF1dG9TaXppbmc6IGZhbHNlLFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBvdXRwdXRXaWR0aCAoKSB7XHJcbiAgICAgIGNvbnN0IHcgPSB0aGlzLnVzZUF1dG9TaXppbmcgPyB0aGlzLnJlYWxXaWR0aCA6IHRoaXMud2lkdGhcclxuXHJcbiAgICAgIC8vIEhBQ0sgRk9SIE5PVy4gIFRISVMgSVMgQVNTVU1JTkcgQSAxLVRPLTEgUkFUSU9cclxuICAgICAgaWYgKHRoaXMubmF0dXJhbFdpZHRoID4gdGhpcy53aWR0aCB8fCB0aGlzLm5hdHVyYWxIZWlnaHQgPiB0aGlzLmhlaWdodCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hdHVyYWxXaWR0aCA+IHRoaXMubmF0dXJhbEhlaWdodCA/IHRoaXMubmF0dXJhbFdpZHRoIDogdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB3ICogdGhpcy5xdWFsaXR5XHJcbiAgICB9LFxyXG5cclxuICAgIG91dHB1dEhlaWdodCAoKSB7XHJcbiAgICAgIGNvbnN0IGggPSB0aGlzLnVzZUF1dG9TaXppbmcgPyB0aGlzLnJlYWxIZWlnaHQgOiB0aGlzLmhlaWdodFxyXG5cclxuICAgICAgLy8gSEFDSyBGT1IgTk9XLiAgVEhJUyBJUyBBU1NVTUlORyBBIDEtVE8tMSBSQVRJT1xyXG4gICAgICBpZiAodGhpcy5uYXR1cmFsSGVpZ2h0ID4gdGhpcy5oZWlnaHQgfHwgdGhpcy5uYXR1cmFsV2lkdGggPiB0aGlzLndpZHRoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmF0dXJhbFdpZHRoID4gdGhpcy5uYXR1cmFsSGVpZ2h0ID8gdGhpcy5uYXR1cmFsV2lkdGggOiB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGggKiB0aGlzLnF1YWxpdHlcclxuICAgIH0sXHJcblxyXG4gICAgY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXJGb250U2l6ZSAqIHRoaXMucXVhbGl0eVxyXG4gICAgfSxcclxuXHJcbiAgICBhc3BlY3RSYXRpbyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm5hdHVyYWxXaWR0aCAvIHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkaW5nU3R5bGUgKCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHdpZHRoOiB0aGlzLmxvYWRpbmdTaXplICsgJ3B4JyxcclxuICAgICAgICBoZWlnaHQ6IHRoaXMubG9hZGluZ1NpemUgKyAncHgnLFxyXG4gICAgICAgIHJpZ2h0OiAnMTVweCcsXHJcbiAgICAgICAgYm90dG9tOiAnMTBweCdcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICBtb3VudGVkICgpIHtcclxuICAgIHRoaXMuX2luaXRpYWxpemUoKVxyXG4gICAgdS5yQUZQb2x5ZmlsbCgpXHJcbiAgICB1LnRvQmxvYlBvbHlmaWxsKClcclxuXHJcbiAgICBsZXQgc3VwcG9ydHMgPSB0aGlzLnN1cHBvcnREZXRlY3Rpb24oKVxyXG4gICAgaWYgKCFzdXBwb3J0cy5iYXNpYykge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHZ1ZS1jcm9wcGEgZnVuY3Rpb25hbGl0eS4nKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnBhc3NpdmUpIHtcclxuICAgICAgdGhpcy4kd2F0Y2goJ3ZhbHVlLl9kYXRhJywgKGRhdGEpID0+IHtcclxuICAgICAgICBsZXQgc2V0ID0gZmFsc2VcclxuICAgICAgICBpZiAoIWRhdGEpIHJldHVyblxyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICBpZiAoc3luY0RhdGEuaW5kZXhPZihrZXkpID49IDApIHtcclxuICAgICAgICAgICAgbGV0IHZhbCA9IGRhdGFba2V5XVxyXG4gICAgICAgICAgICBpZiAodmFsICE9PSB0aGlzW2tleV0pIHtcclxuICAgICAgICAgICAgICB0aGlzLiRzZXQodGhpcywga2V5LCB2YWwpXHJcbiAgICAgICAgICAgICAgc2V0ID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzZXQpIHtcclxuICAgICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMuX2RyYXcoKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSwge1xyXG4gICAgICAgICAgZGVlcDogdHJ1ZVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51c2VBdXRvU2l6aW5nID0gISEodGhpcy5hdXRvU2l6aW5nICYmIHRoaXMuJHJlZnMud3JhcHBlciAmJiBnZXRDb21wdXRlZFN0eWxlKVxyXG4gICAgaWYgKHRoaXMudXNlQXV0b1NpemluZykge1xyXG4gICAgICB0aGlzLl9hdXRvU2l6aW5nSW5pdCgpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgYmVmb3JlRGVzdHJveSAoKSB7XHJcbiAgICBpZiAodGhpcy51c2VBdXRvU2l6aW5nKSB7XHJcbiAgICAgIHRoaXMuX2F1dG9TaXppbmdSZW1vdmUoKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBvdXRwdXRXaWR0aDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLm9uRGltZW5zaW9uQ2hhbmdlKClcclxuICAgIH0sXHJcbiAgICBvdXRwdXRIZWlnaHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5vbkRpbWVuc2lvbkNoYW5nZSgpXHJcbiAgICB9LFxyXG4gICAgY2FudmFzQ29sb3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5fZHJhdygpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBpbWFnZUJvcmRlclJhZGl1czogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAodGhpcy5pbWcpIHtcclxuICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHBsYWNlaG9sZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcGxhY2Vob2xkZXJDb2xvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHByZXZlbnRXaGl0ZVNwYWNlICh2YWwpIHtcclxuICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoKVxyXG4gICAgfSxcclxuICAgIHNjYWxlUmF0aW8gKHZhbCwgb2xkVmFsKSB7XHJcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgaWYgKCF1Lm51bWJlclZhbGlkKHZhbCkpIHJldHVyblxyXG5cclxuICAgICAgdmFyIHggPSAxXHJcbiAgICAgIGlmICh1Lm51bWJlclZhbGlkKG9sZFZhbCkgJiYgb2xkVmFsICE9PSAwKSB7XHJcbiAgICAgICAgeCA9IHZhbCAvIG9sZFZhbFxyXG4gICAgICB9XHJcbiAgICAgIHZhciBwb3MgPSB0aGlzLmN1cnJlbnRQb2ludGVyQ29vcmQgfHwge1xyXG4gICAgICAgIHg6IHRoaXMuaW1nRGF0YS5zdGFydFggKyB0aGlzLmltZ0RhdGEud2lkdGggLyAyLFxyXG4gICAgICAgIHk6IHRoaXMuaW1nRGF0YS5zdGFydFkgKyB0aGlzLmltZ0RhdGEuaGVpZ2h0IC8gMlxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoICogdmFsXHJcbiAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHQgKiB2YWxcclxuXHJcbiAgICAgIGlmICghdGhpcy51c2VyTWV0YWRhdGEgJiYgdGhpcy5pbWFnZVNldCAmJiAhdGhpcy5yb3RhdGluZykge1xyXG4gICAgICAgIGxldCBvZmZzZXRYID0gKHggLSAxKSAqIChwb3MueCAtIHRoaXMuaW1nRGF0YS5zdGFydFgpXHJcbiAgICAgICAgbGV0IG9mZnNldFkgPSAoeCAtIDEpICogKHBvcy55IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSlcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gdGhpcy5pbWdEYXRhLnN0YXJ0WCAtIG9mZnNldFhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WSAtIG9mZnNldFlcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICB0aGlzLl9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgdGhpcy5fcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAnaW1nRGF0YS53aWR0aCc6IGZ1bmN0aW9uICh2YWwsIG9sZFZhbCkge1xyXG4gICAgICAvLyBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgaWYgKCF1Lm51bWJlclZhbGlkKHZhbCkpIHJldHVyblxyXG4gICAgICB0aGlzLnNjYWxlUmF0aW8gPSB2YWwgLyB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICBpZiAodGhpcy5oYXNJbWFnZSgpKSB7XHJcbiAgICAgICAgaWYgKE1hdGguYWJzKHZhbCAtIG9sZFZhbCkgPiAodmFsICogKDEgLyAxMDAwMDApKSkge1xyXG4gICAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLlpPT01fRVZFTlQpXHJcbiAgICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAnaW1nRGF0YS5oZWlnaHQnOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIC8vIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICBpZiAoIXUubnVtYmVyVmFsaWQodmFsKSkgcmV0dXJuXHJcbiAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHZhbCAvIHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgfSxcclxuICAgICdpbWdEYXRhLnN0YXJ0WCc6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgLy8gaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkpIHtcclxuICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLl9kcmF3KVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgJ2ltZ0RhdGEuc3RhcnRZJzogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAvLyBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSkge1xyXG4gICAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMuX2RyYXcpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBsb2FkaW5nICh2YWwpIHtcclxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuTE9BRElOR19TVEFSVF9FVkVOVClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuTE9BRElOR19FTkRfRVZFTlQpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBhdXRvU2l6aW5nICh2YWwpIHtcclxuICAgICAgdGhpcy51c2VBdXRvU2l6aW5nID0gISEodGhpcy5hdXRvU2l6aW5nICYmIHRoaXMuJHJlZnMud3JhcHBlciAmJiBnZXRDb21wdXRlZFN0eWxlKVxyXG4gICAgICBpZiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fYXV0b1NpemluZ0luaXQoKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuX2F1dG9TaXppbmdSZW1vdmUoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZW1pdEV2ZW50ICguLi5hcmdzKSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3NbMF0pXHJcbiAgICAgIHRoaXMuJGVtaXQoLi4uYXJncyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldENhbnZhcyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNhbnZhc1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRDb250ZXh0ICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY3R4XHJcbiAgICB9LFxyXG5cclxuICAgIGdldENob3NlbkZpbGUgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jaG9zZW5GaWxlIHx8IHRoaXMuJHJlZnMuZmlsZUlucHV0LmZpbGVzWzBdXHJcbiAgICB9LFxyXG5cclxuICAgIG1vdmUgKG9mZnNldCkge1xyXG4gICAgICBpZiAoIW9mZnNldCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICBsZXQgb2xkWCA9IHRoaXMuaW1nRGF0YS5zdGFydFhcclxuICAgICAgbGV0IG9sZFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZXHJcbiAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggKz0gb2Zmc2V0LnhcclxuICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSArPSBvZmZzZXQueVxyXG4gICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgIHRoaXMuX3ByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYICE9PSBvbGRYIHx8IHRoaXMuaW1nRGF0YS5zdGFydFkgIT09IG9sZFkpIHtcclxuICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuTU9WRV9FVkVOVClcclxuICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBtb3ZlVXB3YXJkcyAoYW1vdW50ID0gMSkge1xyXG4gICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiAtYW1vdW50IH0pXHJcbiAgICB9LFxyXG5cclxuICAgIG1vdmVEb3dud2FyZHMgKGFtb3VudCA9IDEpIHtcclxuICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogYW1vdW50IH0pXHJcbiAgICB9LFxyXG5cclxuICAgIG1vdmVMZWZ0d2FyZHMgKGFtb3VudCA9IDEpIHtcclxuICAgICAgdGhpcy5tb3ZlKHsgeDogLWFtb3VudCwgeTogMCB9KVxyXG4gICAgfSxcclxuXHJcbiAgICBtb3ZlUmlnaHR3YXJkcyAoYW1vdW50ID0gMSkge1xyXG4gICAgICB0aGlzLm1vdmUoeyB4OiBhbW91bnQsIHk6IDAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgem9vbSAoem9vbUluID0gdHJ1ZSwgYWNjZWxlcmF0aW9uID0gMSkge1xyXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgbGV0IHJlYWxTcGVlZCA9IHRoaXMuem9vbVNwZWVkICogYWNjZWxlcmF0aW9uXHJcbiAgICAgIGxldCBzcGVlZCA9ICh0aGlzLm91dHB1dFdpZHRoICogUENUX1BFUl9aT09NKSAqIHJlYWxTcGVlZFxyXG4gICAgICBsZXQgeCA9IDFcclxuICAgICAgaWYgKHpvb21Jbikge1xyXG4gICAgICAgIHggPSAxICsgc3BlZWRcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPiBNSU5fV0lEVEgpIHtcclxuICAgICAgICB4ID0gMSAtIHNwZWVkXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2NhbGVSYXRpbyAqPSB4XHJcbiAgICB9LFxyXG5cclxuICAgIHpvb21JbiAoKSB7XHJcbiAgICAgIHRoaXMuem9vbSh0cnVlKVxyXG4gICAgfSxcclxuXHJcbiAgICB6b29tT3V0ICgpIHtcclxuICAgICAgdGhpcy56b29tKGZhbHNlKVxyXG4gICAgfSxcclxuXHJcbiAgICByb3RhdGUgKHN0ZXAgPSAxKSB7XHJcbiAgICAgIGlmICh0aGlzLmRpc2FibGVSb3RhdGlvbiB8fCB0aGlzLmRpc2FibGVkIHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIHN0ZXAgPSBwYXJzZUludChzdGVwKVxyXG4gICAgICBpZiAoaXNOYU4oc3RlcCkgfHwgc3RlcCA+IDMgfHwgc3RlcCA8IC0zKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdJbnZhbGlkIGFyZ3VtZW50IGZvciByb3RhdGUoKSBtZXRob2QuIEl0IHNob3VsZCBvbmUgb2YgdGhlIGludGVnZXJzIGZyb20gLTMgdG8gMy4nKVxyXG4gICAgICAgIHN0ZXAgPSAxXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5fcm90YXRlQnlTdGVwKHN0ZXApXHJcbiAgICB9LFxyXG5cclxuICAgIGZsaXBYICgpIHtcclxuICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24oMilcclxuICAgIH0sXHJcblxyXG4gICAgZmxpcFkgKCkge1xyXG4gICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbig0KVxyXG4gICAgfSxcclxuXHJcbiAgICByZWZyZXNoICgpIHtcclxuICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5faW5pdGlhbGl6ZSlcclxuICAgIH0sXHJcblxyXG4gICAgaGFzSW1hZ2UgKCkge1xyXG4gICAgICByZXR1cm4gISF0aGlzLmltYWdlU2V0XHJcbiAgICB9LFxyXG5cclxuICAgIGFwcGx5TWV0YWRhdGEgKG1ldGFkYXRhKSB7XHJcbiAgICAgIGlmICghbWV0YWRhdGEgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBtZXRhZGF0YVxyXG4gICAgICB2YXIgb3JpID0gbWV0YWRhdGEub3JpZW50YXRpb24gfHwgdGhpcy5vcmllbnRhdGlvbiB8fCAxXHJcbiAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKG9yaSwgdHJ1ZSlcclxuICAgIH0sXHJcbiAgICBnZW5lcmF0ZURhdGFVcmwgKHR5cGUsIGNvbXByZXNzaW9uUmF0ZSkge1xyXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuICcnXHJcbiAgICAgIHJldHVybiB0aGlzLmNhbnZhcy50b0RhdGFVUkwodHlwZSwgY29tcHJlc3Npb25SYXRlKVxyXG4gICAgfSxcclxuXHJcbiAgICBnZW5lcmF0ZUJsb2IgKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KSB7XHJcbiAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbClcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG4gICAgICB0aGlzLmNhbnZhcy50b0Jsb2IoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpXHJcbiAgICB9LFxyXG5cclxuICAgIHByb21pc2VkQmxvYiAoLi4uYXJncykge1xyXG4gICAgICBpZiAodHlwZW9mIFByb21pc2UgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oJ05vIFByb21pc2Ugc3VwcG9ydC4gUGxlYXNlIGFkZCBQcm9taXNlIHBvbHlmaWxsIGlmIHlvdSB3YW50IHRvIHVzZSB0aGlzIG1ldGhvZC4nKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIHRoaXMuZ2VuZXJhdGVCbG9iKChibG9iKSA9PiB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoYmxvYilcclxuICAgICAgICAgIH0sIC4uLmFyZ3MpXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICByZWplY3QoZXJyKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0TWV0YWRhdGEgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuIHt9XHJcbiAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZIH0gPSB0aGlzLmltZ0RhdGFcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgc3RhcnRYLFxyXG4gICAgICAgIHN0YXJ0WSxcclxuICAgICAgICBzY2FsZTogdGhpcy5zY2FsZVJhdGlvLFxyXG4gICAgICAgIG9yaWVudGF0aW9uOiB0aGlzLm9yaWVudGF0aW9uXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc3VwcG9ydERldGVjdGlvbiAoKSB7XHJcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICdiYXNpYyc6IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgJiYgd2luZG93LkZpbGUgJiYgd2luZG93LkZpbGVSZWFkZXIgJiYgd2luZG93LkZpbGVMaXN0ICYmIHdpbmRvdy5CbG9iLFxyXG4gICAgICAgICdkbmQnOiAnb25kcmFnc3RhcnQnIGluIGRpdiAmJiAnb25kcm9wJyBpbiBkaXZcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjaG9vc2VGaWxlICgpIHtcclxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LmNsaWNrKClcclxuICAgIH0sXHJcblxyXG4gICAgcmVtb3ZlICgpIHtcclxuICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSByZXR1cm5cclxuICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuXHJcbiAgICAgIGxldCBoYWRJbWFnZSA9IHRoaXMuaW1nICE9IG51bGxcclxuICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gbnVsbFxyXG4gICAgICB0aGlzLmltZyA9IG51bGxcclxuICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQudmFsdWUgPSAnJ1xyXG4gICAgICB0aGlzLmltZ0RhdGEgPSB7XHJcbiAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgaGVpZ2h0OiAwLFxyXG4gICAgICAgIHN0YXJ0WDogMCxcclxuICAgICAgICBzdGFydFk6IDBcclxuICAgICAgfVxyXG4gICAgICB0aGlzLm9yaWVudGF0aW9uID0gMVxyXG4gICAgICB0aGlzLnNjYWxlUmF0aW8gPSBudWxsXHJcbiAgICAgIHRoaXMudXNlck1ldGFkYXRhID0gbnVsbFxyXG4gICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcclxuICAgICAgdGhpcy5jaG9zZW5GaWxlID0gbnVsbFxyXG4gICAgICBpZiAodGhpcy52aWRlbykge1xyXG4gICAgICAgIHRoaXMudmlkZW8ucGF1c2UoKVxyXG4gICAgICAgIHRoaXMudmlkZW8gPSBudWxsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChoYWRJbWFnZSkge1xyXG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5JTUFHRV9SRU1PVkVfRVZFTlQpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgYWRkQ2xpcFBsdWdpbiAocGx1Z2luKSB7XHJcbiAgICAgIGlmICghdGhpcy5jbGlwUGx1Z2lucykge1xyXG4gICAgICAgIHRoaXMuY2xpcFBsdWdpbnMgPSBbXVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh0eXBlb2YgcGx1Z2luID09PSAnZnVuY3Rpb24nICYmIHRoaXMuY2xpcFBsdWdpbnMuaW5kZXhPZihwbHVnaW4pIDwgMCkge1xyXG4gICAgICAgIHRoaXMuY2xpcFBsdWdpbnMucHVzaChwbHVnaW4pXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0NsaXAgcGx1Z2lucyBzaG91bGQgYmUgZnVuY3Rpb25zJylcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBlbWl0TmF0aXZlRXZlbnQgKGV2dCkge1xyXG4gICAgICB0aGlzLmVtaXRFdmVudChldnQudHlwZSwgZXZ0KTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0RmlsZSAoZmlsZSkge1xyXG4gICAgICB0aGlzLl9vbk5ld0ZpbGVJbihmaWxlKVxyXG4gICAgfSxcclxuXHJcbiAgICBfc2V0Q29udGFpbmVyU2l6ZSAoKSB7XHJcbiAgICAgIGlmICh0aGlzLnVzZUF1dG9TaXppbmcpIHtcclxuICAgICAgICB0aGlzLnJlYWxXaWR0aCA9ICtnZXRDb21wdXRlZFN0eWxlKHRoaXMuJHJlZnMud3JhcHBlcikud2lkdGguc2xpY2UoMCwgLTIpXHJcbiAgICAgICAgdGhpcy5yZWFsSGVpZ2h0ID0gK2dldENvbXB1dGVkU3R5bGUodGhpcy4kcmVmcy53cmFwcGVyKS5oZWlnaHQuc2xpY2UoMCwgLTIpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX2F1dG9TaXppbmdJbml0ICgpIHtcclxuICAgICAgdGhpcy5fc2V0Q29udGFpbmVyU2l6ZSgpXHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9zZXRDb250YWluZXJTaXplKVxyXG4gICAgfSxcclxuXHJcbiAgICBfYXV0b1NpemluZ1JlbW92ZSAoKSB7XHJcbiAgICAgIHRoaXMuX3NldENvbnRhaW5lclNpemUoKVxyXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fc2V0Q29udGFpbmVyU2l6ZSlcclxuICAgIH0sXHJcblxyXG4gICAgX2luaXRpYWxpemUgKCkge1xyXG4gICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJHJlZnMuY2FudmFzXHJcbiAgICAgIHRoaXMuX3NldFNpemUoKVxyXG4gICAgICB0aGlzLmNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJ3RyYW5zcGFyZW50JyA6ICh0eXBlb2YgdGhpcy5jYW52YXNDb2xvciA9PT0gJ3N0cmluZycgPyB0aGlzLmNhbnZhc0NvbG9yIDogJycpXHJcbiAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICB0aGlzLmN0eC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLmN0eC5pbWFnZVNtb290aGluZ1F1YWxpdHkgPSBcImhpZ2hcIjtcclxuICAgICAgdGhpcy5jdHgud2Via2l0SW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgdGhpcy5jdHgubXNJbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLmN0eC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLm9yaWdpbmFsSW1hZ2UgPSBudWxsXHJcbiAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC52YWx1ZSA9ICcnXHJcbiAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxyXG4gICAgICB0aGlzLmNob3NlbkZpbGUgPSBudWxsXHJcbiAgICAgIHRoaXMuX3NldEluaXRpYWwoKVxyXG4gICAgICBpZiAoIXRoaXMucGFzc2l2ZSkge1xyXG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5JTklUX0VWRU5ULCB0aGlzKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9zZXRTaXplICgpIHtcclxuICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLm91dHB1dFdpZHRoXHJcbiAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMub3V0cHV0SGVpZ2h0XHJcbiAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gKHRoaXMudXNlQXV0b1NpemluZyA/IHRoaXMucmVhbFdpZHRoIDogdGhpcy53aWR0aCkgKyAncHgnXHJcbiAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9ICh0aGlzLnVzZUF1dG9TaXppbmcgPyB0aGlzLnJlYWxIZWlnaHQgOiB0aGlzLmhlaWdodCkgKyAncHgnXHJcbiAgICB9LFxyXG5cclxuICAgIF9yb3RhdGVCeVN0ZXAgKHN0ZXApIHtcclxuICAgICAgbGV0IG9yaWVudGF0aW9uID0gMVxyXG4gICAgICBzd2l0Y2ggKHN0ZXApIHtcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDZcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgb3JpZW50YXRpb24gPSAzXHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgIG9yaWVudGF0aW9uID0gOFxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgb3JpZW50YXRpb24gPSA4XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgLTI6XHJcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDNcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgY2FzZSAtMzpcclxuICAgICAgICAgIG9yaWVudGF0aW9uID0gNlxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbihvcmllbnRhdGlvbilcclxuICAgIH0sXHJcblxyXG4gICAgX3NldEltYWdlUGxhY2Vob2xkZXIgKCkge1xyXG4gICAgICBsZXQgaW1nXHJcbiAgICAgIGlmICh0aGlzLiRzbG90cy5wbGFjZWhvbGRlciAmJiB0aGlzLiRzbG90cy5wbGFjZWhvbGRlclswXSkge1xyXG4gICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyWzBdXHJcbiAgICAgICAgbGV0IHsgdGFnLCBlbG0gfSA9IHZOb2RlXHJcbiAgICAgICAgaWYgKHRhZyA9PSAnaW1nJyAmJiBlbG0pIHtcclxuICAgICAgICAgIGltZyA9IGVsbVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFpbWcpIHJldHVyblxyXG5cclxuICAgICAgdmFyIG9uTG9hZCA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHUuaW1hZ2VMb2FkZWQoaW1nKSkge1xyXG4gICAgICAgIG9uTG9hZCgpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW1nLm9ubG9hZCA9IG9uTG9hZFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9zZXRUZXh0UGxhY2Vob2xkZXIgKCkge1xyXG4gICAgICB2YXIgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnXHJcbiAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJ1xyXG4gICAgICBsZXQgZGVmYXVsdEZvbnRTaXplID0gdGhpcy5vdXRwdXRXaWR0aCAqIERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQIC8gdGhpcy5wbGFjZWhvbGRlci5sZW5ndGhcclxuICAgICAgbGV0IGZvbnRTaXplID0gKCF0aGlzLmNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSB8fCB0aGlzLmNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSA9PSAwKSA/IGRlZmF1bHRGb250U2l6ZSA6IHRoaXMuY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplXHJcbiAgICAgIGN0eC5mb250ID0gZm9udFNpemUgKyAncHggc2Fucy1zZXJpZidcclxuICAgICAgY3R4LmZpbGxTdHlsZSA9ICghdGhpcy5wbGFjZWhvbGRlckNvbG9yIHx8IHRoaXMucGxhY2Vob2xkZXJDb2xvciA9PSAnZGVmYXVsdCcpID8gJyM2MDYwNjAnIDogdGhpcy5wbGFjZWhvbGRlckNvbG9yXHJcbiAgICAgIGN0eC5maWxsVGV4dCh0aGlzLnBsYWNlaG9sZGVyLCB0aGlzLm91dHB1dFdpZHRoIC8gMiwgdGhpcy5vdXRwdXRIZWlnaHQgLyAyKVxyXG4gICAgfSxcclxuXHJcbiAgICBfc2V0UGxhY2Vob2xkZXJzICgpIHtcclxuICAgICAgdGhpcy5fcGFpbnRCYWNrZ3JvdW5kKClcclxuICAgICAgdGhpcy5fc2V0SW1hZ2VQbGFjZWhvbGRlcigpXHJcbiAgICAgIHRoaXMuX3NldFRleHRQbGFjZWhvbGRlcigpXHJcbiAgICB9LFxyXG5cclxuICAgIF9zZXRJbml0aWFsICgpIHtcclxuICAgICAgbGV0IHNyYywgaW1nXHJcbiAgICAgIGlmICh0aGlzLiRzbG90cy5pbml0aWFsICYmIHRoaXMuJHNsb3RzLmluaXRpYWxbMF0pIHtcclxuICAgICAgICBsZXQgdk5vZGUgPSB0aGlzLiRzbG90cy5pbml0aWFsWzBdXHJcbiAgICAgICAgbGV0IHsgdGFnLCBlbG0gfSA9IHZOb2RlXHJcbiAgICAgICAgaWYgKHRhZyA9PSAnaW1nJyAmJiBlbG0pIHtcclxuICAgICAgICAgIGltZyA9IGVsbVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5pbml0aWFsSW1hZ2UgJiYgdHlwZW9mIHRoaXMuaW5pdGlhbEltYWdlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHNyYyA9IHRoaXMuaW5pdGlhbEltYWdlXHJcbiAgICAgICAgaW1nID0gbmV3IEltYWdlKClcclxuICAgICAgICBpZiAoIS9eZGF0YTovLnRlc3Qoc3JjKSAmJiAhL15ibG9iOi8udGVzdChzcmMpKSB7XHJcbiAgICAgICAgICBpbWcuc2V0QXR0cmlidXRlKCdjcm9zc09yaWdpbicsICdhbm9ueW1vdXMnKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpbWcuc3JjID0gc3JjXHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuaW5pdGlhbEltYWdlID09PSAnb2JqZWN0JyAmJiB0aGlzLmluaXRpYWxJbWFnZSBpbnN0YW5jZW9mIEltYWdlKSB7XHJcbiAgICAgICAgaW1nID0gdGhpcy5pbml0aWFsSW1hZ2VcclxuICAgICAgfVxyXG4gICAgICBpZiAoIXNyYyAmJiAhaW1nKSB7XHJcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG4gICAgICB0aGlzLmN1cnJlbnRJc0luaXRpYWwgPSB0cnVlXHJcbiAgICAgIGlmICh1LmltYWdlTG9hZGVkKGltZykpIHtcclxuICAgICAgICAvLyB0aGlzLmVtaXRFdmVudChldmVudHMuSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQpXHJcbiAgICAgICAgdGhpcy5fb25sb2FkKGltZywgK2ltZy5kYXRhc2V0WydleGlmT3JpZW50YXRpb24nXSwgdHJ1ZSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlXHJcbiAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgIC8vIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5JTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVClcclxuICAgICAgICAgIHRoaXMuX29ubG9hZChpbWcsICtpbWcuZGF0YXNldFsnZXhpZk9yaWVudGF0aW9uJ10sIHRydWUpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbWcub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9vbmxvYWQgKGltZywgb3JpZW50YXRpb24gPSAxLCBpbml0aWFsKSB7XHJcbiAgICAgIGlmICh0aGlzLmltYWdlU2V0KSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmUoKVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IGltZ1xyXG4gICAgICB0aGlzLmltZyA9IGltZ1xyXG5cclxuICAgICAgaWYgKGlzTmFOKG9yaWVudGF0aW9uKSkge1xyXG4gICAgICAgIG9yaWVudGF0aW9uID0gMVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbihvcmllbnRhdGlvbilcclxuXHJcbiAgICAgIGlmIChpbml0aWFsKSB7XHJcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9vblZpZGVvTG9hZCAodmlkZW8sIGluaXRpYWwpIHtcclxuICAgICAgdGhpcy52aWRlbyA9IHZpZGVvXHJcbiAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXHJcbiAgICAgIGNvbnN0IHsgdmlkZW9XaWR0aCwgdmlkZW9IZWlnaHQgfSA9IHZpZGVvXHJcbiAgICAgIGNhbnZhcy53aWR0aCA9IHZpZGVvV2lkdGhcclxuICAgICAgY2FudmFzLmhlaWdodCA9IHZpZGVvSGVpZ2h0XHJcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXHJcbiAgICAgIGNvbnN0IGRyYXdGcmFtZSA9IChpbml0aWFsKSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnZpZGVvKSByZXR1cm5cclxuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMudmlkZW8sIDAsIDAsIHZpZGVvV2lkdGgsIHZpZGVvSGVpZ2h0KVxyXG4gICAgICAgIGNvbnN0IGZyYW1lID0gbmV3IEltYWdlKClcclxuICAgICAgICBmcmFtZS5zcmMgPSBjYW52YXMudG9EYXRhVVJMKClcclxuICAgICAgICBmcmFtZS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmltZyA9IGZyYW1lXHJcbiAgICAgICAgICAvLyB0aGlzLl9wbGFjZUltYWdlKClcclxuICAgICAgICAgIGlmIChpbml0aWFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoKVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fZHJhdygpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGRyYXdGcmFtZSh0cnVlKVxyXG4gICAgICBjb25zdCBrZWVwRHJhd2luZyA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgICBkcmF3RnJhbWUoKVxyXG4gICAgICAgICAgaWYgKCF0aGlzLnZpZGVvIHx8IHRoaXMudmlkZW8uZW5kZWQgfHwgdGhpcy52aWRlby5wYXVzZWQpIHJldHVyblxyXG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGtlZXBEcmF3aW5nKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKCdwbGF5JywgKCkgPT4ge1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShrZWVwRHJhd2luZylcclxuICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgX2hhbmRsZUNsaWNrIChldnQpIHtcclxuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxyXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSAmJiAhdGhpcy5kaXNhYmxlZCAmJiAhdGhpcy5zdXBwb3J0VG91Y2ggJiYgIXRoaXMucGFzc2l2ZSkge1xyXG4gICAgICAgIHRoaXMuY2hvb3NlRmlsZSgpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX2hhbmRsZURibENsaWNrIChldnQpIHtcclxuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxyXG4gICAgICBpZiAodGhpcy52aWRlb0VuYWJsZWQgJiYgdGhpcy52aWRlbykge1xyXG4gICAgICAgIGlmICh0aGlzLnZpZGVvLnBhdXNlZCB8fCB0aGlzLnZpZGVvLmVuZGVkKSB7XHJcbiAgICAgICAgICB0aGlzLnZpZGVvLnBsYXkoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnZpZGVvLnBhdXNlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX2hhbmRsZUlucHV0Q2hhbmdlICgpIHtcclxuICAgICAgbGV0IGlucHV0ID0gdGhpcy4kcmVmcy5maWxlSW5wdXRcclxuICAgICAgaWYgKCFpbnB1dC5maWxlcy5sZW5ndGggfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cclxuXHJcbiAgICAgIGxldCBmaWxlID0gaW5wdXQuZmlsZXNbMF1cclxuICAgICAgdGhpcy5fb25OZXdGaWxlSW4oZmlsZSlcclxuICAgIH0sXHJcblxyXG4gICAgX29uTmV3RmlsZUluIChmaWxlKSB7XHJcbiAgICAgIHRoaXMuY3VycmVudElzSW5pdGlhbCA9IGZhbHNlXHJcbiAgICAgIHRoaXMubG9hZGluZyA9IHRydWVcclxuICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLkZJTEVfQ0hPT1NFX0VWRU5ULCBmaWxlKVxyXG4gICAgICB0aGlzLmNob3NlbkZpbGUgPSBmaWxlO1xyXG4gICAgICBpZiAoIXRoaXMuX2ZpbGVTaXplSXNWYWxpZChmaWxlKSkge1xyXG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLkZJTEVfU0laRV9FWENFRURfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH1cclxuICAgICAgaWYgKCF0aGlzLl9maWxlVHlwZUlzVmFsaWQoZmlsZSkpIHtcclxuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5GSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgbGV0IHR5cGUgPSBmaWxlLnR5cGUgfHwgZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5GaWxlUmVhZGVyICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGxldCBmciA9IG5ldyBGaWxlUmVhZGVyKClcclxuICAgICAgICBmci5vbmxvYWQgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgbGV0IGZpbGVEYXRhID0gZS50YXJnZXQucmVzdWx0XHJcbiAgICAgICAgICBjb25zdCBiYXNlNjQgPSB1LnBhcnNlRGF0YVVybChmaWxlRGF0YSlcclxuICAgICAgICAgIGNvbnN0IGlzVmlkZW8gPSAvXnZpZGVvLy50ZXN0KGZpbGUudHlwZSlcclxuICAgICAgICAgIGlmIChpc1ZpZGVvKSB7XHJcbiAgICAgICAgICAgIGxldCB2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJylcclxuICAgICAgICAgICAgdmlkZW8uc3JjID0gZmlsZURhdGFcclxuICAgICAgICAgICAgZmlsZURhdGEgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodmlkZW8ucmVhZHlTdGF0ZSA+PSB2aWRlby5IQVZFX0ZVVFVSRV9EQVRBKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5fb25WaWRlb0xvYWQodmlkZW8pXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjYW4gcGxheSBldmVudCcpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vblZpZGVvTG9hZCh2aWRlbylcclxuICAgICAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBvcmllbnRhdGlvbiA9IDFcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBvcmllbnRhdGlvbiA9IHUuZ2V0RmlsZU9yaWVudGF0aW9uKHUuYmFzZTY0VG9BcnJheUJ1ZmZlcihiYXNlNjQpKVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHsgfVxyXG4gICAgICAgICAgICBpZiAob3JpZW50YXRpb24gPCAxKSBvcmllbnRhdGlvbiA9IDFcclxuICAgICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBmaWxlRGF0YVxyXG4gICAgICAgICAgICBmaWxlRGF0YSA9IG51bGw7XHJcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgb3JpZW50YXRpb24pXHJcbiAgICAgICAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLk5FV19JTUFHRV9FVkVOVClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmci5yZWFkQXNEYXRhVVJMKGZpbGUpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX2ZpbGVTaXplSXNWYWxpZCAoZmlsZSkge1xyXG4gICAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZVxyXG4gICAgICBpZiAoIXRoaXMuZmlsZVNpemVMaW1pdCB8fCB0aGlzLmZpbGVTaXplTGltaXQgPT0gMCkgcmV0dXJuIHRydWVcclxuXHJcbiAgICAgIHJldHVybiBmaWxlLnNpemUgPCB0aGlzLmZpbGVTaXplTGltaXRcclxuICAgIH0sXHJcblxyXG4gICAgX2ZpbGVUeXBlSXNWYWxpZCAoZmlsZSkge1xyXG4gICAgICBjb25zdCBhY2NlcHRhYmxlTWltZVR5cGUgPSAodGhpcy52aWRlb0VuYWJsZWQgJiYgL152aWRlby8udGVzdChmaWxlLnR5cGUpICYmIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJykuY2FuUGxheVR5cGUoZmlsZS50eXBlKSkgfHwgL15pbWFnZS8udGVzdChmaWxlLnR5cGUpXHJcbiAgICAgIGlmICghYWNjZXB0YWJsZU1pbWVUeXBlKSByZXR1cm4gZmFsc2VcclxuICAgICAgaWYgKCF0aGlzLmFjY2VwdCkgcmV0dXJuIHRydWVcclxuICAgICAgbGV0IGFjY2VwdCA9IHRoaXMuYWNjZXB0XHJcbiAgICAgIGxldCBiYXNlTWltZXR5cGUgPSBhY2NlcHQucmVwbGFjZSgvXFwvLiokLywgJycpXHJcbiAgICAgIGxldCB0eXBlcyA9IGFjY2VwdC5zcGxpdCgnLCcpXHJcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0eXBlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIGxldCB0eXBlID0gdHlwZXNbaV1cclxuICAgICAgICBsZXQgdCA9IHR5cGUudHJpbSgpXHJcbiAgICAgICAgaWYgKHQuY2hhckF0KDApID09ICcuJykge1xyXG4gICAgICAgICAgaWYgKGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcuJykucG9wKCkgPT09IHQudG9Mb3dlckNhc2UoKS5zbGljZSgxKSkgcmV0dXJuIHRydWVcclxuICAgICAgICB9IGVsc2UgaWYgKC9cXC9cXCokLy50ZXN0KHQpKSB7XHJcbiAgICAgICAgICB2YXIgZmlsZUJhc2VUeXBlID0gZmlsZS50eXBlLnJlcGxhY2UoL1xcLy4qJC8sICcnKVxyXG4gICAgICAgICAgaWYgKGZpbGVCYXNlVHlwZSA9PT0gYmFzZU1pbWV0eXBlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChmaWxlLnR5cGUgPT09IHR5cGUpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH0sXHJcblxyXG4gICAgX3BsYWNlSW1hZ2UgKGFwcGx5TWV0YWRhdGEpIHtcclxuICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgIHZhciBpbWdEYXRhID0gdGhpcy5pbWdEYXRhXHJcblxyXG4gICAgICB0aGlzLm5hdHVyYWxXaWR0aCA9IHRoaXMuaW1nLm5hdHVyYWxXaWR0aFxyXG4gICAgICB0aGlzLm5hdHVyYWxIZWlnaHQgPSB0aGlzLmltZy5uYXR1cmFsSGVpZ2h0XHJcblxyXG4gICAgICBpbWdEYXRhLnN0YXJ0WCA9IHUubnVtYmVyVmFsaWQoaW1nRGF0YS5zdGFydFgpID8gaW1nRGF0YS5zdGFydFggOiAwXHJcbiAgICAgIGltZ0RhdGEuc3RhcnRZID0gdS5udW1iZXJWYWxpZChpbWdEYXRhLnN0YXJ0WSkgPyBpbWdEYXRhLnN0YXJ0WSA6IDBcclxuXHJcbiAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgdGhpcy5fYXNwZWN0RmlsbCgpXHJcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMuaW1hZ2VTZXQpIHtcclxuICAgICAgICBpZiAodGhpcy5pbml0aWFsU2l6ZSA9PSAnY29udGFpbicpIHtcclxuICAgICAgICAgIHRoaXMuX2FzcGVjdEZpdCgpXHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmluaXRpYWxTaXplID09ICduYXR1cmFsJykge1xyXG4gICAgICAgICAgdGhpcy5fbmF0dXJhbFNpemUoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLl9hc3BlY3RGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGggKiB0aGlzLnNjYWxlUmF0aW9cclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0ICogdGhpcy5zY2FsZVJhdGlvXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghdGhpcy5pbWFnZVNldCkge1xyXG4gICAgICAgIGlmICgvdG9wLy50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xyXG4gICAgICAgICAgaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgfSBlbHNlIGlmICgvYm90dG9tLy50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xyXG4gICAgICAgICAgaW1nRGF0YS5zdGFydFkgPSB0aGlzLm91dHB1dEhlaWdodCAtIGltZ0RhdGEuaGVpZ2h0XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoL2xlZnQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICBpbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICB9IGVsc2UgaWYgKC9yaWdodC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0gdGhpcy5vdXRwdXRXaWR0aCAtIGltZ0RhdGEud2lkdGhcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gL14oLT9cXGQrKSUgKC0/XFxkKyklJC8uZXhlYyh0aGlzLmluaXRpYWxQb3NpdGlvbilcclxuICAgICAgICAgIHZhciB4ID0gK3Jlc3VsdFsxXSAvIDEwMFxyXG4gICAgICAgICAgdmFyIHkgPSArcmVzdWx0WzJdIC8gMTAwXHJcbiAgICAgICAgICBpbWdEYXRhLnN0YXJ0WCA9IHggKiAodGhpcy5vdXRwdXRXaWR0aCAtIGltZ0RhdGEud2lkdGgpXHJcbiAgICAgICAgICBpbWdEYXRhLnN0YXJ0WSA9IHkgKiAodGhpcy5vdXRwdXRIZWlnaHQgLSBpbWdEYXRhLmhlaWdodClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGFwcGx5TWV0YWRhdGEgJiYgdGhpcy5fYXBwbHlNZXRhZGF0YSgpXHJcblxyXG4gICAgICBpZiAoYXBwbHlNZXRhZGF0YSAmJiB0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgdGhpcy56b29tKGZhbHNlLCAwKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IDAgfSlcclxuICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfYXNwZWN0RmlsbCAoKSB7XHJcbiAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5vdXRwdXRXaWR0aCAvIHRoaXMub3V0cHV0SGVpZ2h0XHJcbiAgICAgIGxldCBzY2FsZVJhdGlvXHJcblxyXG4gICAgICBpZiAodGhpcy5hc3BlY3RSYXRpbyA+IGNhbnZhc1JhdGlvKSB7XHJcbiAgICAgICAgc2NhbGVSYXRpbyA9IGltZ0hlaWdodCAvIHRoaXMub3V0cHV0SGVpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGggLyBzY2FsZVJhdGlvXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMub3V0cHV0SGVpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5vdXRwdXRXaWR0aCkgLyAyXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzY2FsZVJhdGlvID0gaW1nV2lkdGggLyB0aGlzLm91dHB1dFdpZHRoXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodCAvIHNjYWxlUmF0aW9cclxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm91dHB1dFdpZHRoXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KSAvIDJcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9hc3BlY3RGaXQgKCkge1xyXG4gICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgIGxldCBjYW52YXNSYXRpbyA9IHRoaXMub3V0cHV0V2lkdGggLyB0aGlzLm91dHB1dEhlaWdodFxyXG4gICAgICBsZXQgc2NhbGVSYXRpb1xyXG4gICAgICBpZiAodGhpcy5hc3BlY3RSYXRpbyA+IGNhbnZhc1JhdGlvKSB7XHJcbiAgICAgICAgc2NhbGVSYXRpbyA9IGltZ1dpZHRoIC8gdGhpcy5vdXRwdXRXaWR0aFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyBzY2FsZVJhdGlvXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5vdXRwdXRXaWR0aFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLm91dHB1dEhlaWdodCkgLyAyXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzY2FsZVJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHNjYWxlUmF0aW9cclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9uYXR1cmFsU2l6ZSAoKSB7XHJcbiAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGhcclxuICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodFxyXG4gICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcclxuICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KSAvIDJcclxuICAgIH0sXHJcblxyXG4gICAgX2hhbmRsZVBvaW50ZXJTdGFydCAoZXZ0KSB7XHJcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcclxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIHRoaXMuc3VwcG9ydFRvdWNoID0gdHJ1ZVxyXG4gICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IGZhbHNlXHJcbiAgICAgIGxldCBwb2ludGVyQ29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICB0aGlzLnBvaW50ZXJTdGFydENvb3JkID0gcG9pbnRlckNvb3JkXHJcblxyXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgIC8vIHNpbXVsYXRlIGNsaWNrIHdpdGggdG91Y2ggb24gbW9iaWxlIGRldmljZXNcclxuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UpIHtcclxuICAgICAgICB0aGlzLnRhYlN0YXJ0ID0gbmV3IERhdGUoKS52YWx1ZU9mKClcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG4gICAgICAvLyBpZ25vcmUgbW91c2UgcmlnaHQgY2xpY2sgYW5kIG1pZGRsZSBjbGlja1xyXG4gICAgICBpZiAoZXZ0LndoaWNoICYmIGV2dC53aGljaCA+IDEpIHJldHVyblxyXG5cclxuICAgICAgaWYgKCFldnQudG91Y2hlcyB8fCBldnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxyXG4gICAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyICYmICF0aGlzLmRpc2FibGVQaW5jaFRvWm9vbSkge1xyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMucGluY2hpbmcgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gdS5nZXRQaW5jaERpc3RhbmNlKGV2dCwgdGhpcylcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGNhbmNlbEV2ZW50cyA9IFsnbW91c2V1cCcsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCcsICdwb2ludGVyZW5kJywgJ3BvaW50ZXJjYW5jZWwnXVxyXG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY2FuY2VsRXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGUgPSBjYW5jZWxFdmVudHNbaV1cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGUsIHRoaXMuX2hhbmRsZVBvaW50ZXJFbmQpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX2hhbmRsZVBvaW50ZXJFbmQgKGV2dCkge1xyXG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXHJcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICBsZXQgcG9pbnRlck1vdmVEaXN0YW5jZSA9IDBcclxuICAgICAgaWYgKHRoaXMucG9pbnRlclN0YXJ0Q29vcmQpIHtcclxuICAgICAgICBsZXQgcG9pbnRlckNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICBwb2ludGVyTW92ZURpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvaW50ZXJDb29yZC54IC0gdGhpcy5wb2ludGVyU3RhcnRDb29yZC54LCAyKSArIE1hdGgucG93KHBvaW50ZXJDb29yZC55IC0gdGhpcy5wb2ludGVyU3RhcnRDb29yZC55LCAyKSkgfHwgMFxyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UpIHtcclxuICAgICAgICBsZXQgdGFiRW5kID0gbmV3IERhdGUoKS52YWx1ZU9mKClcclxuICAgICAgICBpZiAoKHBvaW50ZXJNb3ZlRGlzdGFuY2UgPCBDTElDS19NT1ZFX1RIUkVTSE9MRCkgJiYgdGFiRW5kIC0gdGhpcy50YWJTdGFydCA8IE1JTl9NU19QRVJfQ0xJQ0sgJiYgdGhpcy5zdXBwb3J0VG91Y2gpIHtcclxuICAgICAgICAgIHRoaXMuY2hvb3NlRmlsZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGFiU3RhcnQgPSAwXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgICB0aGlzLnBpbmNoaW5nID0gZmFsc2VcclxuICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gMFxyXG4gICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IG51bGxcclxuICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSBmYWxzZVxyXG4gICAgICB0aGlzLnBvaW50ZXJTdGFydENvb3JkID0gbnVsbFxyXG4gICAgfSxcclxuXHJcbiAgICBfaGFuZGxlUG9pbnRlck1vdmUgKGV2dCkge1xyXG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXHJcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IHRydWVcclxuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkpIHJldHVyblxyXG4gICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICB0aGlzLmN1cnJlbnRQb2ludGVyQ29vcmQgPSBjb29yZFxyXG5cclxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ1RvTW92ZSkgcmV0dXJuXHJcblxyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIGlmICghdGhpcy5kcmFnZ2luZykgcmV0dXJuXHJcbiAgICAgICAgaWYgKHRoaXMubGFzdE1vdmluZ0Nvb3JkKSB7XHJcbiAgICAgICAgICB0aGlzLm1vdmUoe1xyXG4gICAgICAgICAgICB4OiBjb29yZC54IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueCxcclxuICAgICAgICAgICAgeTogY29vcmQueSAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLnlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gY29vcmRcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiAhdGhpcy5kaXNhYmxlUGluY2hUb1pvb20pIHtcclxuICAgICAgICBpZiAoIXRoaXMucGluY2hpbmcpIHJldHVyblxyXG4gICAgICAgIGxldCBkaXN0YW5jZSA9IHUuZ2V0UGluY2hEaXN0YW5jZShldnQsIHRoaXMpXHJcbiAgICAgICAgbGV0IGRlbHRhID0gZGlzdGFuY2UgLSB0aGlzLnBpbmNoRGlzdGFuY2VcclxuICAgICAgICB0aGlzLnpvb20oZGVsdGEgPiAwLCBQSU5DSF9BQ0NFTEVSQVRJT04pXHJcbiAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gZGlzdGFuY2VcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfaGFuZGxlUG9pbnRlckxlYXZlIChldnQpIHtcclxuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxyXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgdGhpcy5jdXJyZW50UG9pbnRlckNvb3JkID0gbnVsbFxyXG4gICAgfSxcclxuXHJcbiAgICBfaGFuZGxlV2hlZWwgKGV2dCkge1xyXG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXHJcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVTY3JvbGxUb1pvb20gfHwgIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuXHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgIHRoaXMuc2Nyb2xsaW5nID0gdHJ1ZVxyXG4gICAgICBpZiAoZXZ0LndoZWVsRGVsdGEgPCAwIHx8IGV2dC5kZWx0YVkgPiAwIHx8IGV2dC5kZXRhaWwgPiAwKSB7XHJcbiAgICAgICAgdGhpcy56b29tKHRoaXMucmV2ZXJzZVNjcm9sbFRvWm9vbSlcclxuICAgICAgfSBlbHNlIGlmIChldnQud2hlZWxEZWx0YSA+IDAgfHwgZXZ0LmRlbHRhWSA8IDAgfHwgZXZ0LmRldGFpbCA8IDApIHtcclxuICAgICAgICB0aGlzLnpvb20oIXRoaXMucmV2ZXJzZVNjcm9sbFRvWm9vbSlcclxuICAgICAgfVxyXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zY3JvbGxpbmcgPSBmYWxzZVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuXHJcbiAgICBfaGFuZGxlRHJhZ0VudGVyIChldnQpIHtcclxuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxyXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ0FuZERyb3AgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxyXG4gICAgICBpZiAodGhpcy5oYXNJbWFnZSgpICYmICF0aGlzLnJlcGxhY2VEcm9wKSByZXR1cm5cclxuICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSB0cnVlXHJcbiAgICB9LFxyXG5cclxuICAgIF9oYW5kbGVEcmFnTGVhdmUgKGV2dCkge1xyXG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXHJcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICBpZiAoIXRoaXMuZmlsZURyYWdnZWRPdmVyIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cclxuICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSBmYWxzZVxyXG4gICAgfSxcclxuXHJcbiAgICBfaGFuZGxlRHJhZ092ZXIgKGV2dCkge1xyXG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXHJcbiAgICB9LFxyXG5cclxuICAgIF9oYW5kbGVEcm9wIChldnQpIHtcclxuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxyXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgaWYgKCF0aGlzLmZpbGVEcmFnZ2VkT3ZlciB8fCAhdS5ldmVudEhhc0ZpbGUoZXZ0KSkgcmV0dXJuXHJcbiAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMucmVwbGFjZURyb3ApIHtcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG4gICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXHJcblxyXG4gICAgICBsZXQgZmlsZVxyXG4gICAgICBsZXQgZHQgPSBldnQuZGF0YVRyYW5zZmVyXHJcbiAgICAgIGlmICghZHQpIHJldHVyblxyXG4gICAgICBpZiAoZHQuaXRlbXMpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZHQuaXRlbXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgIGxldCBpdGVtID0gZHQuaXRlbXNbaV1cclxuICAgICAgICAgIGlmIChpdGVtLmtpbmQgPT0gJ2ZpbGUnKSB7XHJcbiAgICAgICAgICAgIGZpbGUgPSBpdGVtLmdldEFzRmlsZSgpXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZpbGUgPSBkdC5maWxlc1swXVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZmlsZSkge1xyXG4gICAgICAgIHRoaXMuX29uTmV3RmlsZUluKGZpbGUpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX3ByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UgKCkge1xyXG4gICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCA+IDApIHtcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRZID4gMCkge1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMub3V0cHV0V2lkdGggLSB0aGlzLmltZ0RhdGEuc3RhcnRYID4gdGhpcy5pbWdEYXRhLndpZHRoKSB7XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5vdXRwdXRXaWR0aClcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5vdXRwdXRIZWlnaHQgLSB0aGlzLmltZ0RhdGEuc3RhcnRZID4gdGhpcy5pbWdEYXRhLmhlaWdodCkge1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLm91dHB1dEhlaWdodClcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfcHJldmVudFpvb21pbmdUb1doaXRlU3BhY2UgKCkge1xyXG4gICAgICBpZiAodGhpcy5pbWdEYXRhLndpZHRoIDwgdGhpcy5vdXRwdXRXaWR0aCkge1xyXG4gICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHRoaXMub3V0cHV0V2lkdGggLyB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5pbWdEYXRhLmhlaWdodCA8IHRoaXMub3V0cHV0SGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdGhpcy5vdXRwdXRIZWlnaHQgLyB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfc2V0T3JpZW50YXRpb24gKG9yaWVudGF0aW9uID0gNiwgYXBwbHlNZXRhZGF0YSkge1xyXG4gICAgICB2YXIgdXNlT3JpZ2luYWwgPSBhcHBseU1ldGFkYXRhXHJcbiAgICAgIGlmIChvcmllbnRhdGlvbiA+IDEgfHwgdXNlT3JpZ2luYWwpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICB0aGlzLnJvdGF0aW5nID0gdHJ1ZVxyXG4gICAgICAgIC8vIHUuZ2V0Um90YXRlZEltYWdlRGF0YSh1c2VPcmlnaW5hbCA/IHRoaXMub3JpZ2luYWxJbWFnZSA6IHRoaXMuaW1nLCBvcmllbnRhdGlvbilcclxuICAgICAgICB2YXIgX2ltZyA9IHUuZ2V0Um90YXRlZEltYWdlKHVzZU9yaWdpbmFsID8gdGhpcy5vcmlnaW5hbEltYWdlIDogdGhpcy5pbWcsIG9yaWVudGF0aW9uKVxyXG4gICAgICAgIF9pbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5pbWcgPSBfaW1nXHJcbiAgICAgICAgICB0aGlzLl9wbGFjZUltYWdlKGFwcGx5TWV0YWRhdGEpXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoYXBwbHlNZXRhZGF0YSlcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9yaWVudGF0aW9uID09IDIpIHtcclxuICAgICAgICAvLyBmbGlwIHhcclxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5mbGlwWCh0aGlzLm9yaWVudGF0aW9uKVxyXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDQpIHtcclxuICAgICAgICAvLyBmbGlwIHlcclxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5mbGlwWSh0aGlzLm9yaWVudGF0aW9uKVxyXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDYpIHtcclxuICAgICAgICAvLyA5MCBkZWdcclxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKVxyXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDMpIHtcclxuICAgICAgICAvLyAxODAgZGVnXHJcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKSlcclxuICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA4KSB7XHJcbiAgICAgICAgLy8gMjcwIGRlZ1xyXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHUucm90YXRlOTAodS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKSkpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh1c2VPcmlnaW5hbCkge1xyXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvblxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9wYWludEJhY2tncm91bmQgKCkge1xyXG4gICAgICBsZXQgYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICd0cmFuc3BhcmVudCcgOiB0aGlzLmNhbnZhc0NvbG9yXHJcbiAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvclxyXG4gICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXHJcbiAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxyXG4gICAgfSxcclxuXHJcbiAgICBfZHJhdyAoKSB7XHJcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xyXG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX2RyYXdGcmFtZSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5fZHJhd0ZyYW1lKClcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIF9kcmF3RnJhbWUgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcclxuICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmltZ0RhdGFcclxuXHJcbiAgICAgIHRoaXMuX3BhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KVxyXG5cclxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICB0aGlzLl9jbGlwKHRoaXMuX2NyZWF0ZUNvbnRhaW5lckNsaXBQYXRoKVxyXG4gICAgICAgIC8vIHRoaXMuX2NsaXAodGhpcy5fY3JlYXRlSW1hZ2VDbGlwUGF0aClcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLkRSQVdfRVZFTlQsIGN0eClcclxuICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSB7XHJcbiAgICAgICAgdGhpcy5pbWFnZVNldCA9IHRydWVcclxuICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuTkVXX0lNQUdFX0RSQVdOX0VWRU5UKVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMucm90YXRpbmcgPSBmYWxzZVxyXG4gICAgfSxcclxuXHJcbiAgICBfY2xpcFBhdGhGYWN0b3J5ICh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICBsZXQgcmFkaXVzID0gdHlwZW9mIHRoaXMuaW1hZ2VCb3JkZXJSYWRpdXMgPT09ICdudW1iZXInID9cclxuICAgICAgICB0aGlzLmltYWdlQm9yZGVyUmFkaXVzIDpcclxuICAgICAgICAhaXNOYU4oTnVtYmVyKHRoaXMuaW1hZ2VCb3JkZXJSYWRpdXMpKSA/IE51bWJlcih0aGlzLmltYWdlQm9yZGVyUmFkaXVzKSA6IDBcclxuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICBjdHgubW92ZVRvKHggKyByYWRpdXMsIHkpO1xyXG4gICAgICBjdHgubGluZVRvKHggKyB3aWR0aCAtIHJhZGl1cywgeSk7XHJcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyB3aWR0aCwgeSwgeCArIHdpZHRoLCB5ICsgcmFkaXVzKTtcclxuICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGgsIHkgKyBoZWlnaHQgLSByYWRpdXMpO1xyXG4gICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4ICsgd2lkdGgsIHkgKyBoZWlnaHQsIHggKyB3aWR0aCAtIHJhZGl1cywgeSArIGhlaWdodCk7XHJcbiAgICAgIGN0eC5saW5lVG8oeCArIHJhZGl1cywgeSArIGhlaWdodCk7XHJcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHkgKyBoZWlnaHQsIHgsIHkgKyBoZWlnaHQgLSByYWRpdXMpO1xyXG4gICAgICBjdHgubGluZVRvKHgsIHkgKyByYWRpdXMpO1xyXG4gICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5LCB4ICsgcmFkaXVzLCB5KTtcclxuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBfY3JlYXRlQ29udGFpbmVyQ2xpcFBhdGggKCkge1xyXG4gICAgICB0aGlzLl9jbGlwUGF0aEZhY3RvcnkoMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXHJcbiAgICAgIGlmICh0aGlzLmNsaXBQbHVnaW5zICYmIHRoaXMuY2xpcFBsdWdpbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5jbGlwUGx1Z2lucy5mb3JFYWNoKGZ1bmMgPT4ge1xyXG4gICAgICAgICAgZnVuYyh0aGlzLmN0eCwgMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBfY3JlYXRlSW1hZ2VDbGlwUGF0aCAoKSB7XHJcbiAgICAvLyAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmltZ0RhdGFcclxuICAgIC8vICAgbGV0IHcgPSB3aWR0aFxyXG4gICAgLy8gICBsZXQgaCA9IGhlaWdodFxyXG4gICAgLy8gICBsZXQgeCA9IHN0YXJ0WFxyXG4gICAgLy8gICBsZXQgeSA9IHN0YXJ0WVxyXG4gICAgLy8gICBpZiAodyA8IGgpIHtcclxuICAgIC8vICAgICBoID0gdGhpcy5vdXRwdXRIZWlnaHQgKiAod2lkdGggLyB0aGlzLm91dHB1dFdpZHRoKVxyXG4gICAgLy8gICB9XHJcbiAgICAvLyAgIGlmIChoIDwgdykge1xyXG4gICAgLy8gICAgIHcgPSB0aGlzLm91dHB1dFdpZHRoICogKGhlaWdodCAvIHRoaXMub3V0cHV0SGVpZ2h0KVxyXG4gICAgLy8gICAgIHggPSBzdGFydFggKyAod2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcclxuICAgIC8vICAgfVxyXG4gICAgLy8gICB0aGlzLl9jbGlwUGF0aEZhY3RvcnkoeCwgc3RhcnRZLCB3LCBoKVxyXG4gICAgLy8gfSxcclxuXHJcbiAgICBfY2xpcCAoY3JlYXRlUGF0aCkge1xyXG4gICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgY3R4LnNhdmUoKVxyXG4gICAgICBjdHguZmlsbFN0eWxlID0gJyNmZmYnXHJcbiAgICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24taW4nXHJcbiAgICAgIGNyZWF0ZVBhdGgoKVxyXG4gICAgICBjdHguZmlsbCgpXHJcbiAgICAgIGN0eC5yZXN0b3JlKClcclxuICAgIH0sXHJcblxyXG4gICAgX2FwcGx5TWV0YWRhdGEgKCkge1xyXG4gICAgICBpZiAoIXRoaXMudXNlck1ldGFkYXRhKSByZXR1cm5cclxuICAgICAgdmFyIHsgc3RhcnRYLCBzdGFydFksIHNjYWxlIH0gPSB0aGlzLnVzZXJNZXRhZGF0YVxyXG5cclxuICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc3RhcnRYKSkge1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSBzdGFydFhcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc3RhcnRZKSkge1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSBzdGFydFlcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc2NhbGUpKSB7XHJcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gc2NhbGVcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgIHRoaXMudXNlck1ldGFkYXRhID0gbnVsbFxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuXHJcbiAgICBvbkRpbWVuc2lvbkNoYW5nZSAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICB0aGlzLl9pbml0aWFsaXplKClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3NldFNpemUoKVxyXG4gICAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlIGxhbmc9XCJzdHlsdXNcIj5cclxuLmNyb3BwYS1jb250YWluZXJcclxuICBkaXNwbGF5IGlubGluZS1ibG9ja1xyXG4gIGN1cnNvciBwb2ludGVyXHJcbiAgdHJhbnNpdGlvbiBhbGwgMC4zc1xyXG4gIHBvc2l0aW9uIHJlbGF0aXZlXHJcbiAgZm9udC1zaXplIDBcclxuICBhbGlnbi1zZWxmIGZsZXgtc3RhcnRcclxuICBiYWNrZ3JvdW5kLWNvbG9yICNlNmU2ZTZcclxuXHJcbiAgY2FudmFzXHJcbiAgICB0cmFuc2l0aW9uIGFsbCAwLjNzXHJcblxyXG4gICY6aG92ZXJcclxuICAgIG9wYWNpdHkgMC43XHJcblxyXG4gICYuY3JvcHBhLS1kcm9wem9uZVxyXG4gICAgYm94LXNoYWRvdyBpbnNldCAwIDAgMTBweCBsaWdodG5lc3MoYmxhY2ssIDIwJSlcclxuXHJcbiAgICBjYW52YXNcclxuICAgICAgb3BhY2l0eSAwLjVcclxuXHJcbiAgJi5jcm9wcGEtLWRpc2FibGVkLWNjXHJcbiAgICBjdXJzb3IgZGVmYXVsdFxyXG5cclxuICAgICY6aG92ZXJcclxuICAgICAgb3BhY2l0eSAxXHJcblxyXG4gICYuY3JvcHBhLS1oYXMtdGFyZ2V0XHJcbiAgICBjdXJzb3IgbW92ZVxyXG5cclxuICAgICY6aG92ZXJcclxuICAgICAgb3BhY2l0eSAxXHJcblxyXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkLW16XHJcbiAgICAgIGN1cnNvciBkZWZhdWx0XHJcblxyXG4gICYuY3JvcHBhLS1kaXNhYmxlZFxyXG4gICAgY3Vyc29yIG5vdC1hbGxvd2VkXHJcblxyXG4gICAgJjpob3ZlclxyXG4gICAgICBvcGFjaXR5IDFcclxuXHJcbiAgJi5jcm9wcGEtLXBhc3NpdmVcclxuICAgIGN1cnNvciBkZWZhdWx0XHJcblxyXG4gICAgJjpob3ZlclxyXG4gICAgICBvcGFjaXR5IDFcclxuXHJcbiAgc3ZnLmljb24tcmVtb3ZlXHJcbiAgICBwb3NpdGlvbiBhYnNvbHV0ZVxyXG4gICAgYmFja2dyb3VuZCB3aGl0ZVxyXG4gICAgYm9yZGVyLXJhZGl1cyA1MCVcclxuICAgIGZpbHRlciBkcm9wLXNoYWRvdygtMnB4IDJweCAycHggcmdiYSgwLCAwLCAwLCAwLjcpKVxyXG4gICAgei1pbmRleCAxMFxyXG4gICAgY3Vyc29yIHBvaW50ZXJcclxuICAgIGJvcmRlciAycHggc29saWQgd2hpdGVcclxuPC9zdHlsZT5cclxuXHJcbjxzdHlsZSBsYW5nPVwic2Nzc1wiPlxyXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdG9iaWFzYWhsaW4vU3BpbktpdC9ibG9iL21hc3Rlci9zY3NzL3NwaW5uZXJzLzEwLWZhZGluZy1jaXJjbGUuc2Nzc1xyXG4uc2stZmFkaW5nLWNpcmNsZSB7XHJcbiAgJGNpcmNsZUNvdW50OiAxMjtcclxuICAkYW5pbWF0aW9uRHVyYXRpb246IDFzO1xyXG5cclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcblxyXG4gIC5zay1jaXJjbGUge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgdG9wOiAwO1xyXG4gIH1cclxuXHJcbiAgLnNrLWNpcmNsZSAuc2stY2lyY2xlLWluZGljYXRvciB7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIG1hcmdpbjogMCBhdXRvO1xyXG4gICAgd2lkdGg6IDE1JTtcclxuICAgIGhlaWdodDogMTUlO1xyXG4gICAgYm9yZGVyLXJhZGl1czogMTAwJTtcclxuICAgIGFuaW1hdGlvbjogc2stY2lyY2xlRmFkZURlbGF5ICRhbmltYXRpb25EdXJhdGlvbiBpbmZpbml0ZSBlYXNlLWluLW91dCBib3RoO1xyXG4gIH1cclxuXHJcbiAgQGZvciAkaSBmcm9tIDIgdGhyb3VnaCAkY2lyY2xlQ291bnQge1xyXG4gICAgLnNrLWNpcmNsZSN7JGl9IHtcclxuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnIC8gJGNpcmNsZUNvdW50ICogKCRpIC0gMSkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQGZvciAkaSBmcm9tIDIgdGhyb3VnaCAkY2lyY2xlQ291bnQge1xyXG4gICAgLnNrLWNpcmNsZSN7JGl9IC5zay1jaXJjbGUtaW5kaWNhdG9yIHtcclxuICAgICAgYW5pbWF0aW9uLWRlbGF5OiAtJGFuaW1hdGlvbkR1cmF0aW9uICsgJGFuaW1hdGlvbkR1cmF0aW9uIC8gJGNpcmNsZUNvdW50ICogKCRpIC0gMSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbkBrZXlmcmFtZXMgc2stY2lyY2xlRmFkZURlbGF5IHtcclxuICAwJSxcclxuICAzOSUsXHJcbiAgMTAwJSB7XHJcbiAgICBvcGFjaXR5OiAwO1xyXG4gIH1cclxuICA0MCUge1xyXG4gICAgb3BhY2l0eTogMTtcclxuICB9XHJcbn1cclxuPC9zdHlsZT5cclxuXHJcbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJpbXBvcnQgY29tcG9uZW50IGZyb20gJy4vY3JvcHBlci52dWUnXHJcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbidcclxuXHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xyXG4gIGNvbXBvbmVudE5hbWU6ICdjcm9wcGEnXHJcbn1cclxuXHJcbmNvbnN0IFZ1ZUNyb3BwYSA9IHtcclxuICBpbnN0YWxsOiBmdW5jdGlvbiAoVnVlLCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucylcclxuICAgIGxldCB2ZXJzaW9uID0gTnVtYmVyKFZ1ZS52ZXJzaW9uLnNwbGl0KCcuJylbMF0pXHJcbiAgICBpZiAodmVyc2lvbiA8IDIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGB2dWUtY3JvcHBhIHN1cHBvcnRzIHZ1ZSB2ZXJzaW9uIDIuMCBhbmQgYWJvdmUuIFlvdSBhcmUgdXNpbmcgVnVlQCR7dmVyc2lvbn0uIFBsZWFzZSB1cGdyYWRlIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBWdWUuYClcclxuICAgIH1cclxuICAgIGxldCBjb21wb25lbnROYW1lID0gb3B0aW9ucy5jb21wb25lbnROYW1lIHx8ICdjcm9wcGEnXHJcblxyXG4gICAgLy8gcmVnaXN0cmF0aW9uXHJcbiAgICBWdWUuY29tcG9uZW50KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudClcclxuICB9LFxyXG5cclxuICBjb21wb25lbnRcclxufVxyXG5leHBvcnQgZGVmYXVsdCBWdWVDcm9wcGEiXSwibmFtZXMiOlsiZGVmaW5lIiwidGhpcyIsInBvaW50Iiwidm0iLCJjYW52YXMiLCJxdWFsaXR5IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwibGVmdCIsInRvcCIsImV2dCIsInBvaW50ZXIiLCJ0b3VjaGVzIiwiY2hhbmdlZFRvdWNoZXMiLCJvbmVQb2ludENvb3JkIiwicG9pbnRlcjEiLCJwb2ludGVyMiIsImNvb3JkMSIsImNvb3JkMiIsIk1hdGgiLCJzcXJ0IiwicG93IiwieCIsInkiLCJpbWciLCJjb21wbGV0ZSIsIm5hdHVyYWxXaWR0aCIsImRvY3VtZW50Iiwid2luZG93IiwibGFzdFRpbWUiLCJ2ZW5kb3JzIiwibGVuZ3RoIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjYWxsYmFjayIsImN1cnJUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJ0aW1lVG9DYWxsIiwibWF4IiwiaWQiLCJzZXRUaW1lb3V0IiwiYXJnIiwiaXNBcnJheSIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsIkhUTUxDYW52YXNFbGVtZW50IiwiYmluU3RyIiwibGVuIiwiYXJyIiwidG9CbG9iIiwiZGVmaW5lUHJvcGVydHkiLCJ0eXBlIiwiYXRvYiIsInRvRGF0YVVSTCIsInNwbGl0IiwiVWludDhBcnJheSIsImkiLCJjaGFyQ29kZUF0IiwiQmxvYiIsImR0IiwiZGF0YVRyYW5zZmVyIiwib3JpZ2luYWxFdmVudCIsInR5cGVzIiwiYXJyYXlCdWZmZXIiLCJ2aWV3IiwiRGF0YVZpZXciLCJnZXRVaW50MTYiLCJieXRlTGVuZ3RoIiwib2Zmc2V0IiwibWFya2VyIiwiZ2V0VWludDMyIiwibGl0dGxlIiwidGFncyIsInVybCIsInJlZyIsImV4ZWMiLCJiYXNlNjQiLCJiaW5hcnlTdHJpbmciLCJieXRlcyIsImJ1ZmZlciIsIm9yaWVudGF0aW9uIiwiX2NhbnZhcyIsIkNhbnZhc0V4aWZPcmllbnRhdGlvbiIsImRyYXdJbWFnZSIsIl9pbWciLCJJbWFnZSIsInNyYyIsIm9yaSIsIm1hcCIsIm4iLCJpc05hTiIsIk51bWJlciIsImlzSW50ZWdlciIsInZhbHVlIiwiaXNGaW5pdGUiLCJmbG9vciIsImluaXRpYWxJbWFnZVR5cGUiLCJTdHJpbmciLCJ2YWwiLCJCb29sZWFuIiwidmFsaWRzIiwiZXZlcnkiLCJpbmRleE9mIiwid29yZCIsInRlc3QiLCJQQ1RfUEVSX1pPT00iLCJNSU5fTVNfUEVSX0NMSUNLIiwiQ0xJQ0tfTU9WRV9USFJFU0hPTEQiLCJNSU5fV0lEVEgiLCJERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCIsIlBJTkNIX0FDQ0VMRVJBVElPTiIsInN5bmNEYXRhIiwicmVuZGVyIiwiZXZlbnRzIiwiSU5JVF9FVkVOVCIsInByb3BzIiwidyIsInVzZUF1dG9TaXppbmciLCJyZWFsV2lkdGgiLCJ3aWR0aCIsIm5hdHVyYWxIZWlnaHQiLCJoZWlnaHQiLCJoIiwicmVhbEhlaWdodCIsInBsYWNlaG9sZGVyRm9udFNpemUiLCJsb2FkaW5nU2l6ZSIsIl9pbml0aWFsaXplIiwickFGUG9seWZpbGwiLCJ0b0Jsb2JQb2x5ZmlsbCIsInN1cHBvcnRzIiwic3VwcG9ydERldGVjdGlvbiIsImJhc2ljIiwid2FybiIsInBhc3NpdmUiLCIkd2F0Y2giLCJkYXRhIiwic2V0Iiwia2V5IiwiJHNldCIsInJlbW92ZSIsIiRuZXh0VGljayIsIl9kcmF3IiwiYXV0b1NpemluZyIsIiRyZWZzIiwid3JhcHBlciIsImdldENvbXB1dGVkU3R5bGUiLCJfYXV0b1NpemluZ0luaXQiLCJfYXV0b1NpemluZ1JlbW92ZSIsIm9uRGltZW5zaW9uQ2hhbmdlIiwiX3NldFBsYWNlaG9sZGVycyIsImltYWdlU2V0IiwiX3BsYWNlSW1hZ2UiLCJvbGRWYWwiLCJ1IiwibnVtYmVyVmFsaWQiLCJwb3MiLCJjdXJyZW50UG9pbnRlckNvb3JkIiwiaW1nRGF0YSIsInN0YXJ0WCIsInN0YXJ0WSIsInVzZXJNZXRhZGF0YSIsInJvdGF0aW5nIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJwcmV2ZW50V2hpdGVTcGFjZSIsIl9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSIsIl9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlIiwic2NhbGVSYXRpbyIsImhhc0ltYWdlIiwiYWJzIiwiZW1pdEV2ZW50IiwiWk9PTV9FVkVOVCIsIkxPQURJTkdfU1RBUlRfRVZFTlQiLCJMT0FESU5HX0VORF9FVkVOVCIsIiRlbWl0IiwiY3R4IiwiY2hvc2VuRmlsZSIsImZpbGVJbnB1dCIsImZpbGVzIiwib2xkWCIsIm9sZFkiLCJNT1ZFX0VWRU5UIiwiYW1vdW50IiwibW92ZSIsInpvb21JbiIsImFjY2VsZXJhdGlvbiIsInJlYWxTcGVlZCIsInpvb21TcGVlZCIsInNwZWVkIiwib3V0cHV0V2lkdGgiLCJ6b29tIiwic3RlcCIsImRpc2FibGVSb3RhdGlvbiIsImRpc2FibGVkIiwicGFyc2VJbnQiLCJfcm90YXRlQnlTdGVwIiwiX3NldE9yaWVudGF0aW9uIiwibWV0YWRhdGEiLCJjb21wcmVzc2lvblJhdGUiLCJtaW1lVHlwZSIsInF1YWxpdHlBcmd1bWVudCIsImFyZ3MiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImdlbmVyYXRlQmxvYiIsImJsb2IiLCJlcnIiLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwiRmlsZSIsIkZpbGVSZWFkZXIiLCJGaWxlTGlzdCIsImNsaWNrIiwiaGFkSW1hZ2UiLCJvcmlnaW5hbEltYWdlIiwidmlkZW8iLCJwYXVzZSIsIklNQUdFX1JFTU9WRV9FVkVOVCIsInBsdWdpbiIsImNsaXBQbHVnaW5zIiwicHVzaCIsIkVycm9yIiwiZmlsZSIsIl9vbk5ld0ZpbGVJbiIsInNsaWNlIiwiX3NldENvbnRhaW5lclNpemUiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIl9zZXRTaXplIiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjYW52YXNDb2xvciIsImdldENvbnRleHQiLCJpbWFnZVNtb290aGluZ0VuYWJsZWQiLCJpbWFnZVNtb290aGluZ1F1YWxpdHkiLCJ3ZWJraXRJbWFnZVNtb290aGluZ0VuYWJsZWQiLCJtc0ltYWdlU21vb3RoaW5nRW5hYmxlZCIsIl9zZXRJbml0aWFsIiwib3V0cHV0SGVpZ2h0IiwiJHNsb3RzIiwicGxhY2Vob2xkZXIiLCJ2Tm9kZSIsInRhZyIsImVsbSIsIm9uTG9hZCIsImltYWdlTG9hZGVkIiwib25sb2FkIiwidGV4dEJhc2VsaW5lIiwidGV4dEFsaWduIiwiZGVmYXVsdEZvbnRTaXplIiwiZm9udFNpemUiLCJjb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemUiLCJmb250IiwiZmlsbFN0eWxlIiwicGxhY2Vob2xkZXJDb2xvciIsImZpbGxUZXh0IiwiX3BhaW50QmFja2dyb3VuZCIsIl9zZXRJbWFnZVBsYWNlaG9sZGVyIiwiX3NldFRleHRQbGFjZWhvbGRlciIsImluaXRpYWwiLCJpbml0aWFsSW1hZ2UiLCJzZXRBdHRyaWJ1dGUiLCJiYWJlbEhlbHBlcnMudHlwZW9mIiwiY3VycmVudElzSW5pdGlhbCIsIl9vbmxvYWQiLCJkYXRhc2V0IiwibG9hZGluZyIsIm9uZXJyb3IiLCJJTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVCIsInZpZGVvV2lkdGgiLCJ2aWRlb0hlaWdodCIsImRyYXdGcmFtZSIsImZyYW1lIiwia2VlcERyYXdpbmciLCJlbmRlZCIsInBhdXNlZCIsImVtaXROYXRpdmVFdmVudCIsImRpc2FibGVDbGlja1RvQ2hvb3NlIiwic3VwcG9ydFRvdWNoIiwiY2hvb3NlRmlsZSIsInZpZGVvRW5hYmxlZCIsInBsYXkiLCJpbnB1dCIsIkZJTEVfQ0hPT1NFX0VWRU5UIiwiX2ZpbGVTaXplSXNWYWxpZCIsIkZJTEVfU0laRV9FWENFRURfRVZFTlQiLCJfZmlsZVR5cGVJc1ZhbGlkIiwiRklMRV9UWVBFX01JU01BVENIX0VWRU5UIiwibmFtZSIsInRvTG93ZXJDYXNlIiwicG9wIiwiZnIiLCJlIiwiZmlsZURhdGEiLCJ0YXJnZXQiLCJyZXN1bHQiLCJwYXJzZURhdGFVcmwiLCJpc1ZpZGVvIiwicmVhZHlTdGF0ZSIsIkhBVkVfRlVUVVJFX0RBVEEiLCJfb25WaWRlb0xvYWQiLCJsb2ciLCJnZXRGaWxlT3JpZW50YXRpb24iLCJiYXNlNjRUb0FycmF5QnVmZmVyIiwiTkVXX0lNQUdFX0VWRU5UIiwicmVhZEFzRGF0YVVSTCIsImZpbGVTaXplTGltaXQiLCJzaXplIiwiYWNjZXB0YWJsZU1pbWVUeXBlIiwiY2FuUGxheVR5cGUiLCJhY2NlcHQiLCJiYXNlTWltZXR5cGUiLCJyZXBsYWNlIiwidCIsInRyaW0iLCJjaGFyQXQiLCJmaWxlQmFzZVR5cGUiLCJhcHBseU1ldGFkYXRhIiwiX2FzcGVjdEZpbGwiLCJpbml0aWFsU2l6ZSIsIl9hc3BlY3RGaXQiLCJfbmF0dXJhbFNpemUiLCJpbml0aWFsUG9zaXRpb24iLCJfYXBwbHlNZXRhZGF0YSIsImltZ1dpZHRoIiwiaW1nSGVpZ2h0IiwiY2FudmFzUmF0aW8iLCJhc3BlY3RSYXRpbyIsInBvaW50ZXJNb3ZlZCIsInBvaW50ZXJDb29yZCIsImdldFBvaW50ZXJDb29yZHMiLCJwb2ludGVyU3RhcnRDb29yZCIsInRhYlN0YXJ0IiwidmFsdWVPZiIsIndoaWNoIiwiZHJhZ2dpbmciLCJwaW5jaGluZyIsImNvb3JkIiwibGFzdE1vdmluZ0Nvb3JkIiwiZGlzYWJsZVBpbmNoVG9ab29tIiwicGluY2hEaXN0YW5jZSIsImdldFBpbmNoRGlzdGFuY2UiLCJjYW5jZWxFdmVudHMiLCJfaGFuZGxlUG9pbnRlckVuZCIsInBvaW50ZXJNb3ZlRGlzdGFuY2UiLCJ0YWJFbmQiLCJkaXNhYmxlRHJhZ1RvTW92ZSIsInByZXZlbnREZWZhdWx0IiwiZGlzdGFuY2UiLCJkZWx0YSIsImRpc2FibGVTY3JvbGxUb1pvb20iLCJzY3JvbGxpbmciLCJ3aGVlbERlbHRhIiwiZGVsdGFZIiwiZGV0YWlsIiwicmV2ZXJzZVNjcm9sbFRvWm9vbSIsImRpc2FibGVEcmFnQW5kRHJvcCIsImV2ZW50SGFzRmlsZSIsInJlcGxhY2VEcm9wIiwiZmlsZURyYWdnZWRPdmVyIiwiaXRlbXMiLCJpdGVtIiwia2luZCIsImdldEFzRmlsZSIsInVzZU9yaWdpbmFsIiwiZ2V0Um90YXRlZEltYWdlIiwiZmxpcFgiLCJmbGlwWSIsInJvdGF0ZTkwIiwiY2xlYXJSZWN0IiwiZmlsbFJlY3QiLCJfZHJhd0ZyYW1lIiwiX2NsaXAiLCJfY3JlYXRlQ29udGFpbmVyQ2xpcFBhdGgiLCJEUkFXX0VWRU5UIiwiTkVXX0lNQUdFX0RSQVdOX0VWRU5UIiwicmFkaXVzIiwiaW1hZ2VCb3JkZXJSYWRpdXMiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJxdWFkcmF0aWNDdXJ2ZVRvIiwiY2xvc2VQYXRoIiwiX2NsaXBQYXRoRmFjdG9yeSIsImZvckVhY2giLCJjcmVhdGVQYXRoIiwic2F2ZSIsImdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiIsImZpbGwiLCJyZXN0b3JlIiwic2NhbGUiLCJkZWZhdWx0T3B0aW9ucyIsIlZ1ZUNyb3BwYSIsIlZ1ZSIsIm9wdGlvbnMiLCJhc3NpZ24iLCJ2ZXJzaW9uIiwiY29tcG9uZW50TmFtZSIsImNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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
