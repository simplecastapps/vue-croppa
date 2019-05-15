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

      // HACK
      if (this.naturalWidth > this.width) {
        return this.naturalWidth;
      }

      return w * this.quality;
    },
    outputHeight: function outputHeight() {
      var h = this.useAutoSizing ? this.realHeight : this.height;

      // HACK
      if (this.naturalWidth > this.width) {
        return this.naturalWidth / this.width * this.height;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIHBhcnNlRGF0YVVybCAodXJsKSB7XHJcbiAgICBjb25zdCByZWcgPSAvXmRhdGE6KFteO10rKT8oO2Jhc2U2NCk/LCguKikvZ21pXHJcbiAgICByZXR1cm4gcmVnLmV4ZWModXJsKVszXVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgbnVtYmVyVmFsaWQgKG4pIHtcclxuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKG4pXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9XHJcbiAgTnVtYmVyLmlzSW50ZWdlciB8fFxyXG4gIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJlxyXG4gICAgICBpc0Zpbml0ZSh2YWx1ZSkgJiZcclxuICAgICAgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXHJcbiAgICApXHJcbiAgfVxyXG5cclxudmFyIGluaXRpYWxJbWFnZVR5cGUgPSBTdHJpbmdcclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5JbWFnZSkge1xyXG4gIGluaXRpYWxJbWFnZVR5cGUgPSBbU3RyaW5nLCBJbWFnZV1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHZhbHVlOiBPYmplY3QsXHJcbiAgd2lkdGg6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaGVpZ2h0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2FudmFzQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICd0cmFuc3BhcmVudCdcclxuICB9LFxyXG4gIHF1YWxpdHk6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiBTdHJpbmcsXHJcbiAgZmlsZVNpemVMaW1pdDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gIGRpc2FibGVEcmFnQW5kRHJvcDogQm9vbGVhbixcclxuICBkaXNhYmxlQ2xpY2tUb0Nob29zZTogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ1RvTW92ZTogQm9vbGVhbixcclxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxyXG4gIGRpc2FibGVQaW5jaFRvWm9vbTogQm9vbGVhbixcclxuICBkaXNhYmxlUm90YXRpb246IEJvb2xlYW4sXHJcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcclxuICBzaG93UmVtb3ZlQnV0dG9uOiB7XHJcbiAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgZGVmYXVsdDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdyZWQnXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25TaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICB9LFxyXG4gIGluaXRpYWxJbWFnZTogaW5pdGlhbEltYWdlVHlwZSxcclxuICBpbml0aWFsU2l6ZToge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ2NvdmVyJyxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID09PSAnY292ZXInIHx8IHZhbCA9PT0gJ2NvbnRhaW4nIHx8IHZhbCA9PT0gJ25hdHVyYWwnXHJcbiAgICB9XHJcbiAgfSxcclxuICBpbml0aWFsUG9zaXRpb246IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdjZW50ZXInLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHZhciB2YWxpZHMgPSBbJ2NlbnRlcicsICd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnXVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHZhbC5zcGxpdCgnICcpLmV2ZXJ5KHdvcmQgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHZhbGlkcy5pbmRleE9mKHdvcmQpID49IDBcclxuICAgICAgICB9KSB8fCAvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodmFsKVxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgfSxcclxuICBpbnB1dEF0dHJzOiBPYmplY3QsXHJcbiAgc2hvd0xvYWRpbmc6IEJvb2xlYW4sXHJcbiAgbG9hZGluZ1NpemU6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwXHJcbiAgfSxcclxuICBsb2FkaW5nQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICcjNjA2MDYwJ1xyXG4gIH0sXHJcbiAgcmVwbGFjZURyb3A6IEJvb2xlYW4sXHJcbiAgcGFzc2l2ZTogQm9vbGVhbixcclxuICBpbWFnZUJvcmRlclJhZGl1czoge1xyXG4gICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgIGRlZmF1bHQ6IDBcclxuICB9LFxyXG4gIGF1dG9TaXppbmc6IEJvb2xlYW4sXHJcbiAgdmlkZW9FbmFibGVkOiBCb29sZWFuLFxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgSU5JVF9FVkVOVDogJ2luaXQnLFxuICBGSUxFX0NIT09TRV9FVkVOVDogJ2ZpbGUtY2hvb3NlJyxcbiAgRklMRV9TSVpFX0VYQ0VFRF9FVkVOVDogJ2ZpbGUtc2l6ZS1leGNlZWQnLFxuICBGSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQ6ICdmaWxlLXR5cGUtbWlzbWF0Y2gnLFxuICBORVdfSU1BR0VfRVZFTlQ6ICduZXctaW1hZ2UnLFxuICBORVdfSU1BR0VfRFJBV05fRVZFTlQ6ICduZXctaW1hZ2UtZHJhd24nLFxuICBJTUFHRV9SRU1PVkVfRVZFTlQ6ICdpbWFnZS1yZW1vdmUnLFxuICBNT1ZFX0VWRU5UOiAnbW92ZScsXG4gIFpPT01fRVZFTlQ6ICd6b29tJyxcbiAgRFJBV19FVkVOVDogJ2RyYXcnLFxuICBJTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVDogJ2luaXRpYWwtaW1hZ2UtbG9hZGVkJyxcbiAgTE9BRElOR19TVEFSVF9FVkVOVDogJ2xvYWRpbmctc3RhcnQnLFxuICBMT0FESU5HX0VORF9FVkVOVDogJ2xvYWRpbmctZW5kJ1xufVxuIiwiPHRlbXBsYXRlPlxyXG4gIDxkaXYgcmVmPVwid3JhcHBlclwiXHJcbiAgICA6Y2xhc3M9XCJgY3JvcHBhLWNvbnRhaW5lciAke2ltZyA/ICdjcm9wcGEtLWhhcy10YXJnZXQnIDogJyd9ICR7cGFzc2l2ZSA/ICdjcm9wcGEtLXBhc3NpdmUnIDogJyd9ICR7ZGlzYWJsZWQgPyAnY3JvcHBhLS1kaXNhYmxlZCcgOiAnJ30gJHtkaXNhYmxlQ2xpY2tUb0Nob29zZSA/ICdjcm9wcGEtLWRpc2FibGVkLWNjJyA6ICcnfSAke2Rpc2FibGVEcmFnVG9Nb3ZlICYmIGRpc2FibGVTY3JvbGxUb1pvb20gPyAnY3JvcHBhLS1kaXNhYmxlZC1teicgOiAnJ30gJHtmaWxlRHJhZ2dlZE92ZXIgPyAnY3JvcHBhLS1kcm9wem9uZScgOiAnJ31gXCJcclxuICAgIEBkcmFnZW50ZXIuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdFbnRlclwiXHJcbiAgICBAZHJhZ2xlYXZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVEcmFnTGVhdmVcIlxyXG4gICAgQGRyYWdvdmVyLnN0b3AucHJldmVudD1cIl9oYW5kbGVEcmFnT3ZlclwiXHJcbiAgICBAZHJvcC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJvcFwiPlxyXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCJcclxuICAgICAgOmFjY2VwdD1cImFjY2VwdFwiXHJcbiAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcclxuICAgICAgdi1iaW5kPVwiaW5wdXRBdHRyc1wiXHJcbiAgICAgIHJlZj1cImZpbGVJbnB1dFwiXHJcbiAgICAgIEBjaGFuZ2U9XCJfaGFuZGxlSW5wdXRDaGFuZ2VcIlxyXG4gICAgICBzdHlsZT1cImhlaWdodDoxcHg7d2lkdGg6MXB4O292ZXJmbG93OmhpZGRlbjttYXJnaW4tbGVmdDotOTk5OTlweDtwb3NpdGlvbjphYnNvbHV0ZTtcIiAvPlxyXG4gICAgPGRpdiBjbGFzcz1cInNsb3RzXCJcclxuICAgICAgc3R5bGU9XCJ3aWR0aDogMDsgaGVpZ2h0OiAwOyB2aXNpYmlsaXR5OiBoaWRkZW47XCI+XHJcbiAgICAgIDxzbG90IG5hbWU9XCJpbml0aWFsXCI+PC9zbG90PlxyXG4gICAgICA8c2xvdCBuYW1lPVwicGxhY2Vob2xkZXJcIj48L3Nsb3Q+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCJcclxuICAgICAgQGNsaWNrLnN0b3AucHJldmVudD1cIl9oYW5kbGVDbGlja1wiXHJcbiAgICAgIEBkYmxjbGljay5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRGJsQ2xpY2tcIlxyXG4gICAgICBAdG91Y2hzdGFydC5zdG9wPVwiX2hhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgIEBtb3VzZWRvd24uc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgIEBwb2ludGVyc3RhcnQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgIEB0b3VjaGVuZC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgIEB0b3VjaGNhbmNlbC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgIEBtb3VzZXVwLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgQHBvaW50ZXJlbmQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICBAcG9pbnRlcmNhbmNlbC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgIEB0b3VjaG1vdmUuc3RvcD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgIEBtb3VzZW1vdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgQHBvaW50ZXJtb3ZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgIEBwb2ludGVybGVhdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJMZWF2ZVwiXHJcbiAgICAgIEBET01Nb3VzZVNjcm9sbC5zdG9wPVwiX2hhbmRsZVdoZWVsXCJcclxuICAgICAgQHdoZWVsLnN0b3A9XCJfaGFuZGxlV2hlZWxcIlxyXG4gICAgICBAbW91c2V3aGVlbC5zdG9wPVwiX2hhbmRsZVdoZWVsXCI+PC9jYW52YXM+XHJcbiAgICA8c3ZnIGNsYXNzPVwiaWNvbiBpY29uLXJlbW92ZVwiXHJcbiAgICAgIHYtaWY9XCJzaG93UmVtb3ZlQnV0dG9uICYmIGltZyAmJiAhcGFzc2l2ZVwiXHJcbiAgICAgIEBjbGljaz1cInJlbW92ZVwiXHJcbiAgICAgIDpzdHlsZT1cImB0b3A6IC0ke2hlaWdodC80MH1weDsgcmlnaHQ6IC0ke3dpZHRoLzQwfXB4YFwiXHJcbiAgICAgIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCJcclxuICAgICAgdmVyc2lvbj1cIjEuMVwiXHJcbiAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxyXG4gICAgICA6d2lkdGg9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCJcclxuICAgICAgOmhlaWdodD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIj5cclxuICAgICAgPHBhdGggZD1cIk01MTEuOTIxMjMxIDBDMjI5LjE3OTA3NyAwIDAgMjI5LjI1Nzg0NiAwIDUxMiAwIDc5NC43MDI3NjkgMjI5LjE3OTA3NyAxMDI0IDUxMS45MjEyMzEgMTAyNCA3OTQuNzgxNTM4IDEwMjQgMTAyNCA3OTQuNzAyNzY5IDEwMjQgNTEyIDEwMjQgMjI5LjI1Nzg0NiA3OTQuNzgxNTM4IDAgNTExLjkyMTIzMSAwWk03MzIuMDQxODQ2IDY1MC42MzM4NDYgNjUwLjUxNTY5MiA3MzIuMDgxMjMxQzY1MC41MTU2OTIgNzMyLjA4MTIzMSA1MjEuNDkxNjkyIDU5My42ODM2OTIgNTExLjg4MTg0NiA1OTMuNjgzNjkyIDUwMi40Mjk1MzggNTkzLjY4MzY5MiAzNzMuMzY2MTU0IDczMi4wODEyMzEgMzczLjM2NjE1NCA3MzIuMDgxMjMxTDI5MS43NjEyMzEgNjUwLjYzMzg0NkMyOTEuNzYxMjMxIDY1MC42MzM4NDYgNDMwLjMxNjMwOCA1MjMuNTAwMzA4IDQzMC4zMTYzMDggNTEyLjE5NjkyMyA0MzAuMzE2MzA4IDUwMC42OTY2MTUgMjkxLjc2MTIzMSAzNzMuNTIzNjkyIDI5MS43NjEyMzEgMzczLjUyMzY5MkwzNzMuMzY2MTU0IDI5MS45MTg3NjlDMzczLjM2NjE1NCAyOTEuOTE4NzY5IDUwMy40NTM1MzggNDMwLjM5NTA3NyA1MTEuODgxODQ2IDQzMC4zOTUwNzcgNTIwLjM0OTUzOCA0MzAuMzk1MDc3IDY1MC41MTU2OTIgMjkxLjkxODc2OSA2NTAuNTE1NjkyIDI5MS45MTg3NjlMNzMyLjA0MTg0NiAzNzMuNTIzNjkyQzczMi4wNDE4NDYgMzczLjUyMzY5MiA1OTMuNDQ3Mzg1IDUwMi41NDc2OTIgNTkzLjQ0NzM4NSA1MTIuMTk2OTIzIDU5My40NDczODUgNTIxLjQxMjkyMyA3MzIuMDQxODQ2IDY1MC42MzM4NDYgNzMyLjA0MTg0NiA2NTAuNjMzODQ2WlwiXHJcbiAgICAgICAgOmZpbGw9XCJyZW1vdmVCdXR0b25Db2xvclwiPjwvcGF0aD5cclxuICAgIDwvc3ZnPlxyXG4gICAgPGRpdiBjbGFzcz1cInNrLWZhZGluZy1jaXJjbGVcIlxyXG4gICAgICA6c3R5bGU9XCJsb2FkaW5nU3R5bGVcIlxyXG4gICAgICB2LWlmPVwic2hvd0xvYWRpbmcgJiYgbG9hZGluZ1wiPlxyXG4gICAgICA8ZGl2IDpjbGFzcz1cImBzay1jaXJjbGUke2l9IHNrLWNpcmNsZWBcIlxyXG4gICAgICAgIHYtZm9yPVwiaSBpbiAxMlwiXHJcbiAgICAgICAgOmtleT1cImlcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlLWluZGljYXRvclwiXHJcbiAgICAgICAgICA6c3R5bGU9XCJ7YmFja2dyb3VuZENvbG9yOiBsb2FkaW5nQ29sb3J9XCI+PC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8c2xvdD48L3Nsb3Q+XHJcbiAgPC9kaXY+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c2NyaXB0PlxyXG5pbXBvcnQgdSBmcm9tICcuL3V0aWwnXHJcbmltcG9ydCBwcm9wcyBmcm9tICcuL3Byb3BzJ1xyXG5pbXBvcnQgZXZlbnRzIGZyb20gJy4vZXZlbnRzJ1xyXG5cclxuY29uc3QgUENUX1BFUl9aT09NID0gMSAvIDEwMDAwMCAvLyBUaGUgYW1vdW50IG9mIHpvb21pbmcgZXZlcnl0aW1lIGl0IGhhcHBlbnMsIGluIHBlcmNlbnRhZ2Ugb2YgaW1hZ2Ugd2lkdGguXHJcbmNvbnN0IE1JTl9NU19QRVJfQ0xJQ0sgPSA1MDAgLy8gSWYgdG91Y2ggZHVyYXRpb24gaXMgc2hvcnRlciB0aGFuIHRoZSB2YWx1ZSwgdGhlbiBpdCBpcyBjb25zaWRlcmVkIGFzIGEgY2xpY2suXHJcbmNvbnN0IENMSUNLX01PVkVfVEhSRVNIT0xEID0gMTAwIC8vIElmIHRvdWNoIG1vdmUgZGlzdGFuY2UgaXMgZ3JlYXRlciB0aGFuIHRoaXMgdmFsdWUsIHRoZW4gaXQgd2lsbCBieSBubyBtZWFuIGJlIGNvbnNpZGVyZWQgYXMgYSBjbGljay5cclxuY29uc3QgTUlOX1dJRFRIID0gMTAgLy8gVGhlIG1pbmltYWwgd2lkdGggdGhlIHVzZXIgY2FuIHpvb20gdG8uXHJcbmNvbnN0IERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQID0gMiAvIDMgLy8gUGxhY2Vob2xkZXIgdGV4dCBieSBkZWZhdWx0IHRha2VzIHVwIHRoaXMgYW1vdW50IG9mIHRpbWVzIG9mIGNhbnZhcyB3aWR0aC5cclxuY29uc3QgUElOQ0hfQUNDRUxFUkFUSU9OID0gMSAvLyBUaGUgYW1vdW50IG9mIHRpbWVzIGJ5IHdoaWNoIHRoZSBwaW5jaGluZyBpcyBtb3JlIHNlbnNpdGl2ZSB0aGFuIHRoZSBzY29sbGluZ1xyXG5cclxuY29uc3Qgc3luY0RhdGEgPSBbJ2ltZ0RhdGEnLCAnaW1nJywgJ2ltZ1NldCcsICdvcmlnaW5hbEltYWdlJywgJ25hdHVyYWxIZWlnaHQnLCAnbmF0dXJhbFdpZHRoJywgJ29yaWVudGF0aW9uJywgJ3NjYWxlUmF0aW8nXVxyXG4vLyBjb25zdCBERUJVRyA9IGZhbHNlXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbW9kZWw6IHtcclxuICAgIHByb3A6ICd2YWx1ZScsXHJcbiAgICBldmVudDogZXZlbnRzLklOSVRfRVZFTlRcclxuICB9LFxyXG5cclxuICBwcm9wczogcHJvcHMsXHJcblxyXG4gIGRhdGEgKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgY2FudmFzOiBudWxsLFxyXG4gICAgICBjdHg6IG51bGwsXHJcbiAgICAgIG9yaWdpbmFsSW1hZ2U6IG51bGwsXHJcbiAgICAgIGltZzogbnVsbCxcclxuICAgICAgdmlkZW86IG51bGwsXHJcbiAgICAgIGRyYWdnaW5nOiBmYWxzZSxcclxuICAgICAgbGFzdE1vdmluZ0Nvb3JkOiBudWxsLFxyXG4gICAgICBpbWdEYXRhOiB7XHJcbiAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgaGVpZ2h0OiAwLFxyXG4gICAgICAgIHN0YXJ0WDogMCxcclxuICAgICAgICBzdGFydFk6IDBcclxuICAgICAgfSxcclxuICAgICAgZmlsZURyYWdnZWRPdmVyOiBmYWxzZSxcclxuICAgICAgdGFiU3RhcnQ6IDAsXHJcbiAgICAgIHNjcm9sbGluZzogZmFsc2UsXHJcbiAgICAgIHBpbmNoaW5nOiBmYWxzZSxcclxuICAgICAgcm90YXRpbmc6IGZhbHNlLFxyXG4gICAgICBwaW5jaERpc3RhbmNlOiAwLFxyXG4gICAgICBzdXBwb3J0VG91Y2g6IGZhbHNlLFxyXG4gICAgICBwb2ludGVyTW92ZWQ6IGZhbHNlLFxyXG4gICAgICBwb2ludGVyU3RhcnRDb29yZDogbnVsbCxcclxuICAgICAgbmF0dXJhbFdpZHRoOiAwLFxyXG4gICAgICBuYXR1cmFsSGVpZ2h0OiAwLFxyXG4gICAgICBzY2FsZVJhdGlvOiBudWxsLFxyXG4gICAgICBvcmllbnRhdGlvbjogMSxcclxuICAgICAgdXNlck1ldGFkYXRhOiBudWxsLFxyXG4gICAgICBpbWFnZVNldDogZmFsc2UsXHJcbiAgICAgIGN1cnJlbnRQb2ludGVyQ29vcmQ6IG51bGwsXHJcbiAgICAgIGN1cnJlbnRJc0luaXRpYWw6IGZhbHNlLFxyXG4gICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgcmVhbFdpZHRoOiAwLCAvLyBvbmx5IGZvciB3aGVuIGF1dG9TaXppbmcgaXMgb25cclxuICAgICAgcmVhbEhlaWdodDogMCwgLy8gb25seSBmb3Igd2hlbiBhdXRvU2l6aW5nIGlzIG9uXHJcbiAgICAgIGNob3NlbkZpbGU6IG51bGwsXHJcbiAgICAgIHVzZUF1dG9TaXppbmc6IGZhbHNlLFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBvdXRwdXRXaWR0aCAoKSB7XHJcbiAgICAgIGNvbnN0IHcgPSB0aGlzLnVzZUF1dG9TaXppbmcgPyB0aGlzLnJlYWxXaWR0aCA6IHRoaXMud2lkdGhcclxuXHJcbiAgICAgIC8vIEhBQ0tcclxuICAgICAgaWYgKHRoaXMubmF0dXJhbFdpZHRoID4gdGhpcy53aWR0aCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdyAqIHRoaXMucXVhbGl0eVxyXG4gICAgfSxcclxuXHJcbiAgICBvdXRwdXRIZWlnaHQgKCkge1xyXG4gICAgICBjb25zdCBoID0gdGhpcy51c2VBdXRvU2l6aW5nID8gdGhpcy5yZWFsSGVpZ2h0IDogdGhpcy5oZWlnaHRcclxuXHJcbiAgICAgIC8vIEhBQ0tcclxuICAgICAgaWYgKHRoaXMubmF0dXJhbFdpZHRoID4gdGhpcy53aWR0aCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hdHVyYWxXaWR0aCAvIHRoaXMud2lkdGggKiB0aGlzLmhlaWdodFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gaCAqIHRoaXMucXVhbGl0eVxyXG4gICAgfSxcclxuXHJcbiAgICBjb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemUgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlckZvbnRTaXplICogdGhpcy5xdWFsaXR5XHJcbiAgICB9LFxyXG5cclxuICAgIGFzcGVjdFJhdGlvICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMubmF0dXJhbFdpZHRoIC8gdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRpbmdTdHlsZSAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgd2lkdGg6IHRoaXMubG9hZGluZ1NpemUgKyAncHgnLFxyXG4gICAgICAgIGhlaWdodDogdGhpcy5sb2FkaW5nU2l6ZSArICdweCcsXHJcbiAgICAgICAgcmlnaHQ6ICcxNXB4JyxcclxuICAgICAgICBib3R0b206ICcxMHB4J1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcblxyXG4gIG1vdW50ZWQgKCkge1xyXG4gICAgdGhpcy5faW5pdGlhbGl6ZSgpXHJcbiAgICB1LnJBRlBvbHlmaWxsKClcclxuICAgIHUudG9CbG9iUG9seWZpbGwoKVxyXG5cclxuICAgIGxldCBzdXBwb3J0cyA9IHRoaXMuc3VwcG9ydERldGVjdGlvbigpXHJcbiAgICBpZiAoIXN1cHBvcnRzLmJhc2ljKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdnVlLWNyb3BwYSBmdW5jdGlvbmFsaXR5LicpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucGFzc2l2ZSkge1xyXG4gICAgICB0aGlzLiR3YXRjaCgndmFsdWUuX2RhdGEnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGxldCBzZXQgPSBmYWxzZVxyXG4gICAgICAgIGlmICghZGF0YSkgcmV0dXJuXHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGRhdGEpIHtcclxuICAgICAgICAgIGlmIChzeW5jRGF0YS5pbmRleE9mKGtleSkgPj0gMCkge1xyXG4gICAgICAgICAgICBsZXQgdmFsID0gZGF0YVtrZXldXHJcbiAgICAgICAgICAgIGlmICh2YWwgIT09IHRoaXNba2V5XSkge1xyXG4gICAgICAgICAgICAgIHRoaXMuJHNldCh0aGlzLCBrZXksIHZhbClcclxuICAgICAgICAgICAgICBzZXQgPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNldCkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5fZHJhdygpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCB7XHJcbiAgICAgICAgICBkZWVwOiB0cnVlXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVzZUF1dG9TaXppbmcgPSAhISh0aGlzLmF1dG9TaXppbmcgJiYgdGhpcy4kcmVmcy53cmFwcGVyICYmIGdldENvbXB1dGVkU3R5bGUpXHJcbiAgICBpZiAodGhpcy51c2VBdXRvU2l6aW5nKSB7XHJcbiAgICAgIHRoaXMuX2F1dG9TaXppbmdJbml0KClcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBiZWZvcmVEZXN0cm95ICgpIHtcclxuICAgIGlmICh0aGlzLnVzZUF1dG9TaXppbmcpIHtcclxuICAgICAgdGhpcy5fYXV0b1NpemluZ1JlbW92ZSgpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIG91dHB1dFdpZHRoOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMub25EaW1lbnNpb25DaGFuZ2UoKVxyXG4gICAgfSxcclxuICAgIG91dHB1dEhlaWdodDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLm9uRGltZW5zaW9uQ2hhbmdlKClcclxuICAgIH0sXHJcbiAgICBjYW52YXNDb2xvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGltYWdlQm9yZGVyUmFkaXVzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmltZykge1xyXG4gICAgICAgIHRoaXMuX2RyYXcoKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcGxhY2Vob2xkZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwbGFjZWhvbGRlckNvbG9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHJldmVudFdoaXRlU3BhY2UgKHZhbCkge1xyXG4gICAgICBpZiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5fcGxhY2VJbWFnZSgpXHJcbiAgICB9LFxyXG4gICAgc2NhbGVSYXRpbyAodmFsLCBvbGRWYWwpIHtcclxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICBpZiAoIXUubnVtYmVyVmFsaWQodmFsKSkgcmV0dXJuXHJcblxyXG4gICAgICB2YXIgeCA9IDFcclxuICAgICAgaWYgKHUubnVtYmVyVmFsaWQob2xkVmFsKSAmJiBvbGRWYWwgIT09IDApIHtcclxuICAgICAgICB4ID0gdmFsIC8gb2xkVmFsXHJcbiAgICAgIH1cclxuICAgICAgdmFyIHBvcyA9IHRoaXMuY3VycmVudFBvaW50ZXJDb29yZCB8fCB7XHJcbiAgICAgICAgeDogdGhpcy5pbWdEYXRhLnN0YXJ0WCArIHRoaXMuaW1nRGF0YS53aWR0aCAvIDIsXHJcbiAgICAgICAgeTogdGhpcy5pbWdEYXRhLnN0YXJ0WSArIHRoaXMuaW1nRGF0YS5oZWlnaHQgLyAyXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGggKiB2YWxcclxuICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodCAqIHZhbFxyXG5cclxuICAgICAgaWYgKCF0aGlzLnVzZXJNZXRhZGF0YSAmJiB0aGlzLmltYWdlU2V0ICYmICF0aGlzLnJvdGF0aW5nKSB7XHJcbiAgICAgICAgbGV0IG9mZnNldFggPSAoeCAtIDEpICogKHBvcy54IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WClcclxuICAgICAgICBsZXQgb2Zmc2V0WSA9ICh4IC0gMSkgKiAocG9zLnkgLSB0aGlzLmltZ0RhdGEuc3RhcnRZKVxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYIC0gb2Zmc2V0WFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZIC0gb2Zmc2V0WVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgIHRoaXMuX3ByZXZlbnRab29taW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB0aGlzLl9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgICdpbWdEYXRhLndpZHRoJzogZnVuY3Rpb24gKHZhbCwgb2xkVmFsKSB7XHJcbiAgICAgIC8vIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICBpZiAoIXUubnVtYmVyVmFsaWQodmFsKSkgcmV0dXJuXHJcbiAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHZhbCAvIHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkpIHtcclxuICAgICAgICBpZiAoTWF0aC5hYnModmFsIC0gb2xkVmFsKSA+ICh2YWwgKiAoMSAvIDEwMDAwMCkpKSB7XHJcbiAgICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuWk9PTV9FVkVOVClcclxuICAgICAgICAgIHRoaXMuX2RyYXcoKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgICdpbWdEYXRhLmhlaWdodCc6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgLy8gaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIGlmICghdS5udW1iZXJWYWxpZCh2YWwpKSByZXR1cm5cclxuICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdmFsIC8gdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICB9LFxyXG4gICAgJ2ltZ0RhdGEuc3RhcnRYJzogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAvLyBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSkge1xyXG4gICAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMuX2RyYXcpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAnaW1nRGF0YS5zdGFydFknOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIC8vIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICBpZiAodGhpcy5oYXNJbWFnZSgpKSB7XHJcbiAgICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5fZHJhdylcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGxvYWRpbmcgKHZhbCkge1xyXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5MT0FESU5HX1NUQVJUX0VWRU5UKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5MT0FESU5HX0VORF9FVkVOVClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGF1dG9TaXppbmcgKHZhbCkge1xyXG4gICAgICB0aGlzLnVzZUF1dG9TaXppbmcgPSAhISh0aGlzLmF1dG9TaXppbmcgJiYgdGhpcy4kcmVmcy53cmFwcGVyICYmIGdldENvbXB1dGVkU3R5bGUpXHJcbiAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9hdXRvU2l6aW5nSW5pdCgpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5fYXV0b1NpemluZ1JlbW92ZSgpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBlbWl0RXZlbnQgKC4uLmFyZ3MpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coYXJnc1swXSlcclxuICAgICAgdGhpcy4kZW1pdCguLi5hcmdzKTtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0Q2FudmFzICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2FudmFzXHJcbiAgICB9LFxyXG5cclxuICAgIGdldENvbnRleHQgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jdHhcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0Q2hvc2VuRmlsZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNob3NlbkZpbGUgfHwgdGhpcy4kcmVmcy5maWxlSW5wdXQuZmlsZXNbMF1cclxuICAgIH0sXHJcblxyXG4gICAgbW92ZSAob2Zmc2V0KSB7XHJcbiAgICAgIGlmICghb2Zmc2V0IHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIGxldCBvbGRYID0gdGhpcy5pbWdEYXRhLnN0YXJ0WFxyXG4gICAgICBsZXQgb2xkWSA9IHRoaXMuaW1nRGF0YS5zdGFydFlcclxuICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCArPSBvZmZzZXQueFxyXG4gICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZICs9IG9mZnNldC55XHJcbiAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgdGhpcy5fcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFggIT09IG9sZFggfHwgdGhpcy5pbWdEYXRhLnN0YXJ0WSAhPT0gb2xkWSkge1xyXG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5NT1ZFX0VWRU5UKVxyXG4gICAgICAgIHRoaXMuX2RyYXcoKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG1vdmVVcHdhcmRzIChhbW91bnQgPSAxKSB7XHJcbiAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IC1hbW91bnQgfSlcclxuICAgIH0sXHJcblxyXG4gICAgbW92ZURvd253YXJkcyAoYW1vdW50ID0gMSkge1xyXG4gICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiBhbW91bnQgfSlcclxuICAgIH0sXHJcblxyXG4gICAgbW92ZUxlZnR3YXJkcyAoYW1vdW50ID0gMSkge1xyXG4gICAgICB0aGlzLm1vdmUoeyB4OiAtYW1vdW50LCB5OiAwIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIG1vdmVSaWdodHdhcmRzIChhbW91bnQgPSAxKSB7XHJcbiAgICAgIHRoaXMubW92ZSh7IHg6IGFtb3VudCwgeTogMCB9KVxyXG4gICAgfSxcclxuXHJcbiAgICB6b29tICh6b29tSW4gPSB0cnVlLCBhY2NlbGVyYXRpb24gPSAxKSB7XHJcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICBsZXQgcmVhbFNwZWVkID0gdGhpcy56b29tU3BlZWQgKiBhY2NlbGVyYXRpb25cclxuICAgICAgbGV0IHNwZWVkID0gKHRoaXMub3V0cHV0V2lkdGggKiBQQ1RfUEVSX1pPT00pICogcmVhbFNwZWVkXHJcbiAgICAgIGxldCB4ID0gMVxyXG4gICAgICBpZiAoem9vbUluKSB7XHJcbiAgICAgICAgeCA9IDEgKyBzcGVlZFxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA+IE1JTl9XSURUSCkge1xyXG4gICAgICAgIHggPSAxIC0gc3BlZWRcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zY2FsZVJhdGlvICo9IHhcclxuICAgIH0sXHJcblxyXG4gICAgem9vbUluICgpIHtcclxuICAgICAgdGhpcy56b29tKHRydWUpXHJcbiAgICB9LFxyXG5cclxuICAgIHpvb21PdXQgKCkge1xyXG4gICAgICB0aGlzLnpvb20oZmFsc2UpXHJcbiAgICB9LFxyXG5cclxuICAgIHJvdGF0ZSAoc3RlcCA9IDEpIHtcclxuICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgc3RlcCA9IHBhcnNlSW50KHN0ZXApXHJcbiAgICAgIGlmIChpc05hTihzdGVwKSB8fCBzdGVwID4gMyB8fCBzdGVwIDwgLTMpIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oJ0ludmFsaWQgYXJndW1lbnQgZm9yIHJvdGF0ZSgpIG1ldGhvZC4gSXQgc2hvdWxkIG9uZSBvZiB0aGUgaW50ZWdlcnMgZnJvbSAtMyB0byAzLicpXHJcbiAgICAgICAgc3RlcCA9IDFcclxuICAgICAgfVxyXG4gICAgICB0aGlzLl9yb3RhdGVCeVN0ZXAoc3RlcClcclxuICAgIH0sXHJcblxyXG4gICAgZmxpcFggKCkge1xyXG4gICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbigyKVxyXG4gICAgfSxcclxuXHJcbiAgICBmbGlwWSAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmRpc2FibGVSb3RhdGlvbiB8fCB0aGlzLmRpc2FibGVkIHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKDQpXHJcbiAgICB9LFxyXG5cclxuICAgIHJlZnJlc2ggKCkge1xyXG4gICAgICB0aGlzLiRuZXh0VGljayh0aGlzLl9pbml0aWFsaXplKVxyXG4gICAgfSxcclxuXHJcbiAgICBoYXNJbWFnZSAoKSB7XHJcbiAgICAgIHJldHVybiAhIXRoaXMuaW1hZ2VTZXRcclxuICAgIH0sXHJcblxyXG4gICAgYXBwbHlNZXRhZGF0YSAobWV0YWRhdGEpIHtcclxuICAgICAgaWYgKCFtZXRhZGF0YSB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICB0aGlzLnVzZXJNZXRhZGF0YSA9IG1ldGFkYXRhXHJcbiAgICAgIHZhciBvcmkgPSBtZXRhZGF0YS5vcmllbnRhdGlvbiB8fCB0aGlzLm9yaWVudGF0aW9uIHx8IDFcclxuICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24ob3JpLCB0cnVlKVxyXG4gICAgfSxcclxuICAgIGdlbmVyYXRlRGF0YVVybCAodHlwZSwgY29tcHJlc3Npb25SYXRlKSB7XHJcbiAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpKSByZXR1cm4gJydcclxuICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCh0eXBlLCBjb21wcmVzc2lvblJhdGUpXHJcbiAgICB9LFxyXG5cclxuICAgIGdlbmVyYXRlQmxvYiAoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpIHtcclxuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkpIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY2FudmFzLnRvQmxvYihjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudClcclxuICAgIH0sXHJcblxyXG4gICAgcHJvbWlzZWRCbG9iICguLi5hcmdzKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgUHJvbWlzZSA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGNvbnNvbGUud2FybignTm8gUHJvbWlzZSBzdXBwb3J0LiBQbGVhc2UgYWRkIFByb21pc2UgcG9seWZpbGwgaWYgeW91IHdhbnQgdG8gdXNlIHRoaXMgbWV0aG9kLicpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgdGhpcy5nZW5lcmF0ZUJsb2IoKGJsb2IpID0+IHtcclxuICAgICAgICAgICAgcmVzb2x2ZShibG9iKVxyXG4gICAgICAgICAgfSwgLi4uYXJncylcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgIHJlamVjdChlcnIpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuXHJcbiAgICBnZXRNZXRhZGF0YSAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpKSByZXR1cm4ge31cclxuICAgICAgbGV0IHsgc3RhcnRYLCBzdGFydFkgfSA9IHRoaXMuaW1nRGF0YVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBzdGFydFgsXHJcbiAgICAgICAgc3RhcnRZLFxyXG4gICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlUmF0aW8sXHJcbiAgICAgICAgb3JpZW50YXRpb246IHRoaXMub3JpZW50YXRpb25cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzdXBwb3J0RGV0ZWN0aW9uICgpIHtcclxuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSByZXR1cm5cclxuICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ2Jhc2ljJzogd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAmJiB3aW5kb3cuRmlsZSAmJiB3aW5kb3cuRmlsZVJlYWRlciAmJiB3aW5kb3cuRmlsZUxpc3QgJiYgd2luZG93LkJsb2IsXHJcbiAgICAgICAgJ2RuZCc6ICdvbmRyYWdzdGFydCcgaW4gZGl2ICYmICdvbmRyb3AnIGluIGRpdlxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNob29zZUZpbGUgKCkge1xyXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQuY2xpY2soKVxyXG4gICAgfSxcclxuXHJcbiAgICByZW1vdmUgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaW1hZ2VTZXQpIHJldHVyblxyXG4gICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxyXG5cclxuICAgICAgbGV0IGhhZEltYWdlID0gdGhpcy5pbWcgIT0gbnVsbFxyXG4gICAgICB0aGlzLm9yaWdpbmFsSW1hZ2UgPSBudWxsXHJcbiAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC52YWx1ZSA9ICcnXHJcbiAgICAgIHRoaXMuaW1nRGF0YSA9IHtcclxuICAgICAgICB3aWR0aDogMCxcclxuICAgICAgICBoZWlnaHQ6IDAsXHJcbiAgICAgICAgc3RhcnRYOiAwLFxyXG4gICAgICAgIHN0YXJ0WTogMFxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMub3JpZW50YXRpb24gPSAxXHJcbiAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IG51bGxcclxuICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBudWxsXHJcbiAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxyXG4gICAgICB0aGlzLmNob3NlbkZpbGUgPSBudWxsXHJcbiAgICAgIGlmICh0aGlzLnZpZGVvKSB7XHJcbiAgICAgICAgdGhpcy52aWRlby5wYXVzZSgpXHJcbiAgICAgICAgdGhpcy52aWRlbyA9IG51bGxcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGhhZEltYWdlKSB7XHJcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLklNQUdFX1JFTU9WRV9FVkVOVClcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBhZGRDbGlwUGx1Z2luIChwbHVnaW4pIHtcclxuICAgICAgaWYgKCF0aGlzLmNsaXBQbHVnaW5zKSB7XHJcbiAgICAgICAgdGhpcy5jbGlwUGx1Z2lucyA9IFtdXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHR5cGVvZiBwbHVnaW4gPT09ICdmdW5jdGlvbicgJiYgdGhpcy5jbGlwUGx1Z2lucy5pbmRleE9mKHBsdWdpbikgPCAwKSB7XHJcbiAgICAgICAgdGhpcy5jbGlwUGx1Z2lucy5wdXNoKHBsdWdpbilcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBFcnJvcignQ2xpcCBwbHVnaW5zIHNob3VsZCBiZSBmdW5jdGlvbnMnKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGVtaXROYXRpdmVFdmVudCAoZXZ0KSB7XHJcbiAgICAgIHRoaXMuZW1pdEV2ZW50KGV2dC50eXBlLCBldnQpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRGaWxlIChmaWxlKSB7XHJcbiAgICAgIHRoaXMuX29uTmV3RmlsZUluKGZpbGUpXHJcbiAgICB9LFxyXG5cclxuICAgIF9zZXRDb250YWluZXJTaXplICgpIHtcclxuICAgICAgaWYgKHRoaXMudXNlQXV0b1NpemluZykge1xyXG4gICAgICAgIHRoaXMucmVhbFdpZHRoID0gK2dldENvbXB1dGVkU3R5bGUodGhpcy4kcmVmcy53cmFwcGVyKS53aWR0aC5zbGljZSgwLCAtMilcclxuICAgICAgICB0aGlzLnJlYWxIZWlnaHQgPSArZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLiRyZWZzLndyYXBwZXIpLmhlaWdodC5zbGljZSgwLCAtMilcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfYXV0b1NpemluZ0luaXQgKCkge1xyXG4gICAgICB0aGlzLl9zZXRDb250YWluZXJTaXplKClcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3NldENvbnRhaW5lclNpemUpXHJcbiAgICB9LFxyXG5cclxuICAgIF9hdXRvU2l6aW5nUmVtb3ZlICgpIHtcclxuICAgICAgdGhpcy5fc2V0Q29udGFpbmVyU2l6ZSgpXHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9zZXRDb250YWluZXJTaXplKVxyXG4gICAgfSxcclxuXHJcbiAgICBfaW5pdGlhbGl6ZSAoKSB7XHJcbiAgICAgIHRoaXMuY2FudmFzID0gdGhpcy4kcmVmcy5jYW52YXNcclxuICAgICAgdGhpcy5fc2V0U2l6ZSgpXHJcbiAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAndHJhbnNwYXJlbnQnIDogKHR5cGVvZiB0aGlzLmNhbnZhc0NvbG9yID09PSAnc3RyaW5nJyA/IHRoaXMuY2FudmFzQ29sb3IgOiAnJylcclxuICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICAgIHRoaXMuY3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgIHRoaXMuY3R4LmltYWdlU21vb3RoaW5nUXVhbGl0eSA9IFwiaGlnaFwiO1xyXG4gICAgICB0aGlzLmN0eC53ZWJraXRJbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLmN0eC5tc0ltYWdlU21vb3RoaW5nRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgIHRoaXMuY3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IG51bGxcclxuICAgICAgdGhpcy5pbWcgPSBudWxsXHJcbiAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcclxuICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXHJcbiAgICAgIHRoaXMuY2hvc2VuRmlsZSA9IG51bGxcclxuICAgICAgdGhpcy5fc2V0SW5pdGlhbCgpXHJcbiAgICAgIGlmICghdGhpcy5wYXNzaXZlKSB7XHJcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLklOSVRfRVZFTlQsIHRoaXMpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX3NldFNpemUgKCkge1xyXG4gICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMub3V0cHV0V2lkdGhcclxuICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSAodGhpcy51c2VBdXRvU2l6aW5nID8gdGhpcy5yZWFsV2lkdGggOiB0aGlzLndpZHRoKSArICdweCdcclxuICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gKHRoaXMudXNlQXV0b1NpemluZyA/IHRoaXMucmVhbEhlaWdodCA6IHRoaXMuaGVpZ2h0KSArICdweCdcclxuICAgIH0sXHJcblxyXG4gICAgX3JvdGF0ZUJ5U3RlcCAoc3RlcCkge1xyXG4gICAgICBsZXQgb3JpZW50YXRpb24gPSAxXHJcbiAgICAgIHN3aXRjaCAoc3RlcCkge1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgIG9yaWVudGF0aW9uID0gNlxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDNcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgb3JpZW50YXRpb24gPSA4XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDhcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgY2FzZSAtMjpcclxuICAgICAgICAgIG9yaWVudGF0aW9uID0gM1xyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlIC0zOlxyXG4gICAgICAgICAgb3JpZW50YXRpb24gPSA2XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKG9yaWVudGF0aW9uKVxyXG4gICAgfSxcclxuXHJcbiAgICBfc2V0SW1hZ2VQbGFjZWhvbGRlciAoKSB7XHJcbiAgICAgIGxldCBpbWdcclxuICAgICAgaWYgKHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyICYmIHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyWzBdKSB7XHJcbiAgICAgICAgbGV0IHZOb2RlID0gdGhpcy4kc2xvdHMucGxhY2Vob2xkZXJbMF1cclxuICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcclxuICAgICAgICBpZiAodGFnID09ICdpbWcnICYmIGVsbSkge1xyXG4gICAgICAgICAgaW1nID0gZWxtXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWltZykgcmV0dXJuXHJcblxyXG4gICAgICB2YXIgb25Mb2FkID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodS5pbWFnZUxvYWRlZChpbWcpKSB7XHJcbiAgICAgICAgb25Mb2FkKClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpbWcub25sb2FkID0gb25Mb2FkXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX3NldFRleHRQbGFjZWhvbGRlciAoKSB7XHJcbiAgICAgIHZhciBjdHggPSB0aGlzLmN0eFxyXG4gICAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSdcclxuICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInXHJcbiAgICAgIGxldCBkZWZhdWx0Rm9udFNpemUgPSB0aGlzLm91dHB1dFdpZHRoICogREVGQVVMVF9QTEFDRUhPTERFUl9UQUtFVVAgLyB0aGlzLnBsYWNlaG9sZGVyLmxlbmd0aFxyXG4gICAgICBsZXQgZm9udFNpemUgPSAoIXRoaXMuY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplIHx8IHRoaXMuY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplID09IDApID8gZGVmYXVsdEZvbnRTaXplIDogdGhpcy5jb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemVcclxuICAgICAgY3R4LmZvbnQgPSBmb250U2l6ZSArICdweCBzYW5zLXNlcmlmJ1xyXG4gICAgICBjdHguZmlsbFN0eWxlID0gKCF0aGlzLnBsYWNlaG9sZGVyQ29sb3IgfHwgdGhpcy5wbGFjZWhvbGRlckNvbG9yID09ICdkZWZhdWx0JykgPyAnIzYwNjA2MCcgOiB0aGlzLnBsYWNlaG9sZGVyQ29sb3JcclxuICAgICAgY3R4LmZpbGxUZXh0KHRoaXMucGxhY2Vob2xkZXIsIHRoaXMub3V0cHV0V2lkdGggLyAyLCB0aGlzLm91dHB1dEhlaWdodCAvIDIpXHJcbiAgICB9LFxyXG5cclxuICAgIF9zZXRQbGFjZWhvbGRlcnMgKCkge1xyXG4gICAgICB0aGlzLl9wYWludEJhY2tncm91bmQoKVxyXG4gICAgICB0aGlzLl9zZXRJbWFnZVBsYWNlaG9sZGVyKClcclxuICAgICAgdGhpcy5fc2V0VGV4dFBsYWNlaG9sZGVyKClcclxuICAgIH0sXHJcblxyXG4gICAgX3NldEluaXRpYWwgKCkge1xyXG4gICAgICBsZXQgc3JjLCBpbWdcclxuICAgICAgaWYgKHRoaXMuJHNsb3RzLmluaXRpYWwgJiYgdGhpcy4kc2xvdHMuaW5pdGlhbFswXSkge1xyXG4gICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLmluaXRpYWxbMF1cclxuICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcclxuICAgICAgICBpZiAodGFnID09ICdpbWcnICYmIGVsbSkge1xyXG4gICAgICAgICAgaW1nID0gZWxtXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxJbWFnZSAmJiB0eXBlb2YgdGhpcy5pbml0aWFsSW1hZ2UgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgc3JjID0gdGhpcy5pbml0aWFsSW1hZ2VcclxuICAgICAgICBpbWcgPSBuZXcgSW1hZ2UoKVxyXG4gICAgICAgIGlmICghL15kYXRhOi8udGVzdChzcmMpICYmICEvXmJsb2I6Ly50ZXN0KHNyYykpIHtcclxuICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ2Nyb3NzT3JpZ2luJywgJ2Fub255bW91cycpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGltZy5zcmMgPSBzcmNcclxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5pbml0aWFsSW1hZ2UgPT09ICdvYmplY3QnICYmIHRoaXMuaW5pdGlhbEltYWdlIGluc3RhbmNlb2YgSW1hZ2UpIHtcclxuICAgICAgICBpbWcgPSB0aGlzLmluaXRpYWxJbWFnZVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghc3JjICYmICFpbWcpIHtcclxuICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY3VycmVudElzSW5pdGlhbCA9IHRydWVcclxuICAgICAgaWYgKHUuaW1hZ2VMb2FkZWQoaW1nKSkge1xyXG4gICAgICAgIC8vIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5JTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVClcclxuICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCAraW1nLmRhdGFzZXRbJ2V4aWZPcmllbnRhdGlvbiddLCB0cnVlKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMubG9hZGluZyA9IHRydWVcclxuICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgLy8gdGhpcy5lbWl0RXZlbnQoZXZlbnRzLklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UKVxyXG4gICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgK2ltZy5kYXRhc2V0WydleGlmT3JpZW50YXRpb24nXSwgdHJ1ZSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGltZy5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX29ubG9hZCAoaW1nLCBvcmllbnRhdGlvbiA9IDEsIGluaXRpYWwpIHtcclxuICAgICAgaWYgKHRoaXMuaW1hZ2VTZXQpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZSgpXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gaW1nXHJcbiAgICAgIHRoaXMuaW1nID0gaW1nXHJcblxyXG4gICAgICBpZiAoaXNOYU4ob3JpZW50YXRpb24pKSB7XHJcbiAgICAgICAgb3JpZW50YXRpb24gPSAxXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKG9yaWVudGF0aW9uKVxyXG5cclxuICAgICAgaWYgKGluaXRpYWwpIHtcclxuICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX29uVmlkZW9Mb2FkICh2aWRlbywgaW5pdGlhbCkge1xyXG4gICAgICB0aGlzLnZpZGVvID0gdmlkZW9cclxuICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcclxuICAgICAgY29uc3QgeyB2aWRlb1dpZHRoLCB2aWRlb0hlaWdodCB9ID0gdmlkZW9cclxuICAgICAgY2FudmFzLndpZHRoID0gdmlkZW9XaWR0aFxyXG4gICAgICBjYW52YXMuaGVpZ2h0ID0gdmlkZW9IZWlnaHRcclxuICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcclxuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcclxuICAgICAgY29uc3QgZHJhd0ZyYW1lID0gKGluaXRpYWwpID0+IHtcclxuICAgICAgICBpZiAoIXRoaXMudmlkZW8pIHJldHVyblxyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy52aWRlbywgMCwgMCwgdmlkZW9XaWR0aCwgdmlkZW9IZWlnaHQpXHJcbiAgICAgICAgY29uc3QgZnJhbWUgPSBuZXcgSW1hZ2UoKVxyXG4gICAgICAgIGZyYW1lLnNyYyA9IGNhbnZhcy50b0RhdGFVUkwoKVxyXG4gICAgICAgIGZyYW1lLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuaW1nID0gZnJhbWVcclxuICAgICAgICAgIC8vIHRoaXMuX3BsYWNlSW1hZ2UoKVxyXG4gICAgICAgICAgaWYgKGluaXRpYWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fcGxhY2VJbWFnZSgpXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZHJhd0ZyYW1lKHRydWUpXHJcbiAgICAgIGNvbnN0IGtlZXBEcmF3aW5nID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICAgIGRyYXdGcmFtZSgpXHJcbiAgICAgICAgICBpZiAoIXRoaXMudmlkZW8gfHwgdGhpcy52aWRlby5lbmRlZCB8fCB0aGlzLnZpZGVvLnBhdXNlZCkgcmV0dXJuXHJcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoa2VlcERyYXdpbmcpXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXknLCAoKSA9PiB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGtlZXBEcmF3aW5nKVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuXHJcbiAgICBfaGFuZGxlQ2xpY2sgKGV2dCkge1xyXG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXHJcbiAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlICYmICF0aGlzLmRpc2FibGVkICYmICF0aGlzLnN1cHBvcnRUb3VjaCAmJiAhdGhpcy5wYXNzaXZlKSB7XHJcbiAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfaGFuZGxlRGJsQ2xpY2sgKGV2dCkge1xyXG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXHJcbiAgICAgIGlmICh0aGlzLnZpZGVvRW5hYmxlZCAmJiB0aGlzLnZpZGVvKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmlkZW8ucGF1c2VkIHx8IHRoaXMudmlkZW8uZW5kZWQpIHtcclxuICAgICAgICAgIHRoaXMudmlkZW8ucGxheSgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMudmlkZW8ucGF1c2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfaGFuZGxlSW5wdXRDaGFuZ2UgKCkge1xyXG4gICAgICBsZXQgaW5wdXQgPSB0aGlzLiRyZWZzLmZpbGVJbnB1dFxyXG4gICAgICBpZiAoIWlucHV0LmZpbGVzLmxlbmd0aCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxyXG5cclxuICAgICAgbGV0IGZpbGUgPSBpbnB1dC5maWxlc1swXVxyXG4gICAgICB0aGlzLl9vbk5ld0ZpbGVJbihmaWxlKVxyXG4gICAgfSxcclxuXHJcbiAgICBfb25OZXdGaWxlSW4gKGZpbGUpIHtcclxuICAgICAgdGhpcy5jdXJyZW50SXNJbml0aWFsID0gZmFsc2VcclxuICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZVxyXG4gICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuRklMRV9DSE9PU0VfRVZFTlQsIGZpbGUpXHJcbiAgICAgIHRoaXMuY2hvc2VuRmlsZSA9IGZpbGU7XHJcbiAgICAgIGlmICghdGhpcy5fZmlsZVNpemVJc1ZhbGlkKGZpbGUpKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCwgZmlsZSlcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfVxyXG4gICAgICBpZiAoIXRoaXMuX2ZpbGVUeXBlSXNWYWxpZChmaWxlKSkge1xyXG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLkZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVCwgZmlsZSlcclxuICAgICAgICBsZXQgdHlwZSA9IGZpbGUudHlwZSB8fCBmaWxlLm5hbWUudG9Mb3dlckNhc2UoKS5zcGxpdCgnLicpLnBvcCgpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LkZpbGVSZWFkZXIgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgbGV0IGZyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG4gICAgICAgIGZyLm9ubG9hZCA9IChlKSA9PiB7XHJcbiAgICAgICAgICBsZXQgZmlsZURhdGEgPSBlLnRhcmdldC5yZXN1bHRcclxuICAgICAgICAgIGNvbnN0IGJhc2U2NCA9IHUucGFyc2VEYXRhVXJsKGZpbGVEYXRhKVxyXG4gICAgICAgICAgY29uc3QgaXNWaWRlbyA9IC9edmlkZW8vLnRlc3QoZmlsZS50eXBlKVxyXG4gICAgICAgICAgaWYgKGlzVmlkZW8pIHtcclxuICAgICAgICAgICAgbGV0IHZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKVxyXG4gICAgICAgICAgICB2aWRlby5zcmMgPSBmaWxlRGF0YVxyXG4gICAgICAgICAgICBmaWxlRGF0YSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICh2aWRlby5yZWFkeVN0YXRlID49IHZpZGVvLkhBVkVfRlVUVVJFX0RBVEEpIHtcclxuICAgICAgICAgICAgICB0aGlzLl9vblZpZGVvTG9hZCh2aWRlbylcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdjYW5wbGF5JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NhbiBwbGF5IGV2ZW50JylcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uVmlkZW9Mb2FkKHZpZGVvKVxyXG4gICAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG9yaWVudGF0aW9uID0gMVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIG9yaWVudGF0aW9uID0gdS5nZXRGaWxlT3JpZW50YXRpb24odS5iYXNlNjRUb0FycmF5QnVmZmVyKGJhc2U2NCkpXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikgeyB9XHJcbiAgICAgICAgICAgIGlmIChvcmllbnRhdGlvbiA8IDEpIG9yaWVudGF0aW9uID0gMVxyXG4gICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKClcclxuICAgICAgICAgICAgaW1nLnNyYyA9IGZpbGVEYXRhXHJcbiAgICAgICAgICAgIGZpbGVEYXRhID0gbnVsbDtcclxuICAgICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCBvcmllbnRhdGlvbilcclxuICAgICAgICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuTkVXX0lNQUdFX0VWRU5UKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZyLnJlYWRBc0RhdGFVUkwoZmlsZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfZmlsZVNpemVJc1ZhbGlkIChmaWxlKSB7XHJcbiAgICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgIGlmICghdGhpcy5maWxlU2l6ZUxpbWl0IHx8IHRoaXMuZmlsZVNpemVMaW1pdCA9PSAwKSByZXR1cm4gdHJ1ZVxyXG5cclxuICAgICAgcmV0dXJuIGZpbGUuc2l6ZSA8IHRoaXMuZmlsZVNpemVMaW1pdFxyXG4gICAgfSxcclxuXHJcbiAgICBfZmlsZVR5cGVJc1ZhbGlkIChmaWxlKSB7XHJcbiAgICAgIGNvbnN0IGFjY2VwdGFibGVNaW1lVHlwZSA9ICh0aGlzLnZpZGVvRW5hYmxlZCAmJiAvXnZpZGVvLy50ZXN0KGZpbGUudHlwZSkgJiYgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKS5jYW5QbGF5VHlwZShmaWxlLnR5cGUpKSB8fCAvXmltYWdlLy50ZXN0KGZpbGUudHlwZSlcclxuICAgICAgaWYgKCFhY2NlcHRhYmxlTWltZVR5cGUpIHJldHVybiBmYWxzZVxyXG4gICAgICBpZiAoIXRoaXMuYWNjZXB0KSByZXR1cm4gdHJ1ZVxyXG4gICAgICBsZXQgYWNjZXB0ID0gdGhpcy5hY2NlcHRcclxuICAgICAgbGV0IGJhc2VNaW1ldHlwZSA9IGFjY2VwdC5yZXBsYWNlKC9cXC8uKiQvLCAnJylcclxuICAgICAgbGV0IHR5cGVzID0gYWNjZXB0LnNwbGl0KCcsJylcclxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHR5cGUgPSB0eXBlc1tpXVxyXG4gICAgICAgIGxldCB0ID0gdHlwZS50cmltKClcclxuICAgICAgICBpZiAodC5jaGFyQXQoMCkgPT0gJy4nKSB7XHJcbiAgICAgICAgICBpZiAoZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKSA9PT0gdC50b0xvd2VyQ2FzZSgpLnNsaWNlKDEpKSByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIH0gZWxzZSBpZiAoL1xcL1xcKiQvLnRlc3QodCkpIHtcclxuICAgICAgICAgIHZhciBmaWxlQmFzZVR5cGUgPSBmaWxlLnR5cGUucmVwbGFjZSgvXFwvLiokLywgJycpXHJcbiAgICAgICAgICBpZiAoZmlsZUJhc2VUeXBlID09PSBiYXNlTWltZXR5cGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGZpbGUudHlwZSA9PT0gdHlwZSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfSxcclxuXHJcbiAgICBfcGxhY2VJbWFnZSAoYXBwbHlNZXRhZGF0YSkge1xyXG4gICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgdmFyIGltZ0RhdGEgPSB0aGlzLmltZ0RhdGFcclxuXHJcbiAgICAgIHRoaXMubmF0dXJhbFdpZHRoID0gdGhpcy5pbWcubmF0dXJhbFdpZHRoXHJcbiAgICAgIHRoaXMubmF0dXJhbEhlaWdodCA9IHRoaXMuaW1nLm5hdHVyYWxIZWlnaHRcclxuXHJcbiAgICAgIGltZ0RhdGEuc3RhcnRYID0gdS5udW1iZXJWYWxpZChpbWdEYXRhLnN0YXJ0WCkgPyBpbWdEYXRhLnN0YXJ0WCA6IDBcclxuICAgICAgaW1nRGF0YS5zdGFydFkgPSB1Lm51bWJlclZhbGlkKGltZ0RhdGEuc3RhcnRZKSA/IGltZ0RhdGEuc3RhcnRZIDogMFxyXG5cclxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICB0aGlzLl9hc3BlY3RGaWxsKClcclxuICAgICAgfSBlbHNlIGlmICghdGhpcy5pbWFnZVNldCkge1xyXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxTaXplID09ICdjb250YWluJykge1xyXG4gICAgICAgICAgdGhpcy5fYXNwZWN0Rml0KClcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5pdGlhbFNpemUgPT0gJ25hdHVyYWwnKSB7XHJcbiAgICAgICAgICB0aGlzLl9uYXR1cmFsU2l6ZSgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuX2FzcGVjdEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aCAqIHRoaXMuc2NhbGVSYXRpb1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHQgKiB0aGlzLnNjYWxlUmF0aW9cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSB7XHJcbiAgICAgICAgaWYgKC90b3AvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICBpbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICB9IGVsc2UgaWYgKC9ib3R0b20vLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICBpbWdEYXRhLnN0YXJ0WSA9IHRoaXMub3V0cHV0SGVpZ2h0IC0gaW1nRGF0YS5oZWlnaHRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgvbGVmdC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICAgIH0gZWxzZSBpZiAoL3JpZ2h0Ly50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xyXG4gICAgICAgICAgaW1nRGF0YS5zdGFydFggPSB0aGlzLm91dHB1dFdpZHRoIC0gaW1nRGF0YS53aWR0aFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKC9eLT9cXGQrJSAtP1xcZCslJC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgIHZhciByZXN1bHQgPSAvXigtP1xcZCspJSAoLT9cXGQrKSUkLy5leGVjKHRoaXMuaW5pdGlhbFBvc2l0aW9uKVxyXG4gICAgICAgICAgdmFyIHggPSArcmVzdWx0WzFdIC8gMTAwXHJcbiAgICAgICAgICB2YXIgeSA9ICtyZXN1bHRbMl0gLyAxMDBcclxuICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0geCAqICh0aGlzLm91dHB1dFdpZHRoIC0gaW1nRGF0YS53aWR0aClcclxuICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0geSAqICh0aGlzLm91dHB1dEhlaWdodCAtIGltZ0RhdGEuaGVpZ2h0KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgYXBwbHlNZXRhZGF0YSAmJiB0aGlzLl9hcHBseU1ldGFkYXRhKClcclxuXHJcbiAgICAgIGlmIChhcHBseU1ldGFkYXRhICYmIHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICB0aGlzLnpvb20oZmFsc2UsIDApXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogMCB9KVxyXG4gICAgICAgIHRoaXMuX2RyYXcoKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9hc3BlY3RGaWxsICgpIHtcclxuICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcclxuICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLm91dHB1dFdpZHRoIC8gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgbGV0IHNjYWxlUmF0aW9cclxuXHJcbiAgICAgIGlmICh0aGlzLmFzcGVjdFJhdGlvID4gY2FudmFzUmF0aW8pIHtcclxuICAgICAgICBzY2FsZVJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHNjYWxlUmF0aW9cclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNjYWxlUmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMub3V0cHV0V2lkdGhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0IC8gc2NhbGVSYXRpb1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMub3V0cHV0V2lkdGhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpIC8gMlxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX2FzcGVjdEZpdCAoKSB7XHJcbiAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5vdXRwdXRXaWR0aCAvIHRoaXMub3V0cHV0SGVpZ2h0XHJcbiAgICAgIGxldCBzY2FsZVJhdGlvXHJcbiAgICAgIGlmICh0aGlzLmFzcGVjdFJhdGlvID4gY2FudmFzUmF0aW8pIHtcclxuICAgICAgICBzY2FsZVJhdGlvID0gaW1nV2lkdGggLyB0aGlzLm91dHB1dFdpZHRoXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodCAvIHNjYWxlUmF0aW9cclxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm91dHB1dFdpZHRoXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KSAvIDJcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNjYWxlUmF0aW8gPSBpbWdIZWlnaHQgLyB0aGlzLm91dHB1dEhlaWdodFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoIC8gc2NhbGVSYXRpb1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm91dHB1dEhlaWdodFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX25hdHVyYWxTaXplICgpIHtcclxuICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcclxuICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aFxyXG4gICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0XHJcbiAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxyXG4gICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpIC8gMlxyXG4gICAgfSxcclxuXHJcbiAgICBfaGFuZGxlUG9pbnRlclN0YXJ0IChldnQpIHtcclxuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxyXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgdGhpcy5zdXBwb3J0VG91Y2ggPSB0cnVlXHJcbiAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gZmFsc2VcclxuICAgICAgbGV0IHBvaW50ZXJDb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQgPSBwb2ludGVyQ29vcmRcclxuXHJcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgLy8gc2ltdWxhdGUgY2xpY2sgd2l0aCB0b3VjaCBvbiBtb2JpbGUgZGV2aWNlc1xyXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xyXG4gICAgICAgIHRoaXMudGFiU3RhcnQgPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIC8vIGlnbm9yZSBtb3VzZSByaWdodCBjbGljayBhbmQgbWlkZGxlIGNsaWNrXHJcbiAgICAgIGlmIChldnQud2hpY2ggJiYgZXZ0LndoaWNoID4gMSkgcmV0dXJuXHJcblxyXG4gICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXHJcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZGlzYWJsZVBpbmNoVG9ab29tKSB7XHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5waW5jaGluZyA9IHRydWVcclxuICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgY2FuY2VsRXZlbnRzID0gWydtb3VzZXVwJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJywgJ3BvaW50ZXJlbmQnLCAncG9pbnRlcmNhbmNlbCddXHJcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjYW5jZWxFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBsZXQgZSA9IGNhbmNlbEV2ZW50c1tpXVxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZSwgdGhpcy5faGFuZGxlUG9pbnRlckVuZClcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfaGFuZGxlUG9pbnRlckVuZCAoZXZ0KSB7XHJcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcclxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIGxldCBwb2ludGVyTW92ZURpc3RhbmNlID0gMFxyXG4gICAgICBpZiAodGhpcy5wb2ludGVyU3RhcnRDb29yZCkge1xyXG4gICAgICAgIGxldCBwb2ludGVyQ29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgIHBvaW50ZXJNb3ZlRGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9pbnRlckNvb3JkLnggLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLngsIDIpICsgTWF0aC5wb3cocG9pbnRlckNvb3JkLnkgLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLnksIDIpKSB8fCAwXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xyXG4gICAgICAgIGxldCB0YWJFbmQgPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKVxyXG4gICAgICAgIGlmICgocG9pbnRlck1vdmVEaXN0YW5jZSA8IENMSUNLX01PVkVfVEhSRVNIT0xEKSAmJiB0YWJFbmQgLSB0aGlzLnRhYlN0YXJ0IDwgTUlOX01TX1BFUl9DTElDSyAmJiB0aGlzLnN1cHBvcnRUb3VjaCkge1xyXG4gICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50YWJTdGFydCA9IDBcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXHJcbiAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxyXG4gICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSAwXHJcbiAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gbnVsbFxyXG4gICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IGZhbHNlXHJcbiAgICAgIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQgPSBudWxsXHJcbiAgICB9LFxyXG5cclxuICAgIF9oYW5kbGVQb2ludGVyTW92ZSAoZXZ0KSB7XHJcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcclxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gdHJ1ZVxyXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuXHJcbiAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgIHRoaXMuY3VycmVudFBvaW50ZXJDb29yZCA9IGNvb3JkXHJcblxyXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnVG9Nb3ZlKSByZXR1cm5cclxuXHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cclxuICAgICAgICBpZiAodGhpcy5sYXN0TW92aW5nQ29vcmQpIHtcclxuICAgICAgICAgIHRoaXMubW92ZSh7XHJcbiAgICAgICAgICAgIHg6IGNvb3JkLnggLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC54LFxyXG4gICAgICAgICAgICB5OiBjb29yZC55IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyICYmICF0aGlzLmRpc2FibGVQaW5jaFRvWm9vbSkge1xyXG4gICAgICAgIGlmICghdGhpcy5waW5jaGluZykgcmV0dXJuXHJcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gdS5nZXRQaW5jaERpc3RhbmNlKGV2dCwgdGhpcylcclxuICAgICAgICBsZXQgZGVsdGEgPSBkaXN0YW5jZSAtIHRoaXMucGluY2hEaXN0YW5jZVxyXG4gICAgICAgIHRoaXMuem9vbShkZWx0YSA+IDAsIFBJTkNIX0FDQ0VMRVJBVElPTilcclxuICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSBkaXN0YW5jZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9oYW5kbGVQb2ludGVyTGVhdmUgKGV2dCkge1xyXG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXHJcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICB0aGlzLmN1cnJlbnRQb2ludGVyQ29vcmQgPSBudWxsXHJcbiAgICB9LFxyXG5cclxuICAgIF9oYW5kbGVXaGVlbCAoZXZ0KSB7XHJcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcclxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVNjcm9sbFRvWm9vbSB8fCAhdGhpcy5oYXNJbWFnZSgpKSByZXR1cm5cclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgdGhpcy5zY3JvbGxpbmcgPSB0cnVlXHJcbiAgICAgIGlmIChldnQud2hlZWxEZWx0YSA8IDAgfHwgZXZ0LmRlbHRhWSA+IDAgfHwgZXZ0LmRldGFpbCA+IDApIHtcclxuICAgICAgICB0aGlzLnpvb20odGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tKVxyXG4gICAgICB9IGVsc2UgaWYgKGV2dC53aGVlbERlbHRhID4gMCB8fCBldnQuZGVsdGFZIDwgMCB8fCBldnQuZGV0YWlsIDwgMCkge1xyXG4gICAgICAgIHRoaXMuem9vbSghdGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tKVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICB0aGlzLnNjcm9sbGluZyA9IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIF9oYW5kbGVEcmFnRW50ZXIgKGV2dCkge1xyXG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXHJcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnQW5kRHJvcCB8fCAhdS5ldmVudEhhc0ZpbGUoZXZ0KSkgcmV0dXJuXHJcbiAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMucmVwbGFjZURyb3ApIHJldHVyblxyXG4gICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IHRydWVcclxuICAgIH0sXHJcblxyXG4gICAgX2hhbmRsZURyYWdMZWF2ZSAoZXZ0KSB7XHJcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcclxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIGlmICghdGhpcy5maWxlRHJhZ2dlZE92ZXIgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxyXG4gICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXHJcbiAgICB9LFxyXG5cclxuICAgIF9oYW5kbGVEcmFnT3ZlciAoZXZ0KSB7XHJcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcclxuICAgIH0sXHJcblxyXG4gICAgX2hhbmRsZURyb3AgKGV2dCkge1xyXG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXHJcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICBpZiAoIXRoaXMuZmlsZURyYWdnZWRPdmVyIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cclxuICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5yZXBsYWNlRHJvcCkge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcclxuXHJcbiAgICAgIGxldCBmaWxlXHJcbiAgICAgIGxldCBkdCA9IGV2dC5kYXRhVHJhbnNmZXJcclxuICAgICAgaWYgKCFkdCkgcmV0dXJuXHJcbiAgICAgIGlmIChkdC5pdGVtcykge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkdC5pdGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgbGV0IGl0ZW0gPSBkdC5pdGVtc1tpXVxyXG4gICAgICAgICAgaWYgKGl0ZW0ua2luZCA9PSAnZmlsZScpIHtcclxuICAgICAgICAgICAgZmlsZSA9IGl0ZW0uZ2V0QXNGaWxlKClcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZmlsZSA9IGR0LmZpbGVzWzBdXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgdGhpcy5fb25OZXdGaWxlSW4oZmlsZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYID4gMCkge1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFkgPiAwKSB7XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5vdXRwdXRXaWR0aCAtIHRoaXMuaW1nRGF0YS5zdGFydFggPiB0aGlzLmltZ0RhdGEud2lkdGgpIHtcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLm91dHB1dEhlaWdodCAtIHRoaXMuaW1nRGF0YS5zdGFydFkgPiB0aGlzLmltZ0RhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPCB0aGlzLm91dHB1dFdpZHRoKSB7XHJcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdGhpcy5vdXRwdXRXaWR0aCAvIHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmltZ0RhdGEuaGVpZ2h0IDwgdGhpcy5vdXRwdXRIZWlnaHQpIHtcclxuICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSB0aGlzLm91dHB1dEhlaWdodCAvIHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9zZXRPcmllbnRhdGlvbiAob3JpZW50YXRpb24gPSA2LCBhcHBseU1ldGFkYXRhKSB7XHJcbiAgICAgIHZhciB1c2VPcmlnaW5hbCA9IGFwcGx5TWV0YWRhdGFcclxuICAgICAgaWYgKG9yaWVudGF0aW9uID4gMSB8fCB1c2VPcmlnaW5hbCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIHRoaXMucm90YXRpbmcgPSB0cnVlXHJcbiAgICAgICAgLy8gdS5nZXRSb3RhdGVkSW1hZ2VEYXRhKHVzZU9yaWdpbmFsID8gdGhpcy5vcmlnaW5hbEltYWdlIDogdGhpcy5pbWcsIG9yaWVudGF0aW9uKVxyXG4gICAgICAgIHZhciBfaW1nID0gdS5nZXRSb3RhdGVkSW1hZ2UodXNlT3JpZ2luYWwgPyB0aGlzLm9yaWdpbmFsSW1hZ2UgOiB0aGlzLmltZywgb3JpZW50YXRpb24pXHJcbiAgICAgICAgX2ltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmltZyA9IF9pbWdcclxuICAgICAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoYXBwbHlNZXRhZGF0YSlcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5fcGxhY2VJbWFnZShhcHBseU1ldGFkYXRhKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3JpZW50YXRpb24gPT0gMikge1xyXG4gICAgICAgIC8vIGZsaXAgeFxyXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBYKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gNCkge1xyXG4gICAgICAgIC8vIGZsaXAgeVxyXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBZKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gNikge1xyXG4gICAgICAgIC8vIDkwIGRlZ1xyXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gMykge1xyXG4gICAgICAgIC8vIDE4MCBkZWdcclxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKVxyXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDgpIHtcclxuICAgICAgICAvLyAyNzAgZGVnXHJcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb25cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHVzZU9yaWdpbmFsKSB7XHJcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX3BhaW50QmFja2dyb3VuZCAoKSB7XHJcbiAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJ3RyYW5zcGFyZW50JyA6IHRoaXMuY2FudmFzQ29sb3JcclxuICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gYmFja2dyb3VuZENvbG9yXHJcbiAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcclxuICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXHJcbiAgICB9LFxyXG5cclxuICAgIF9kcmF3ICgpIHtcclxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fZHJhd0ZyYW1lKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLl9kcmF3RnJhbWUoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgX2RyYXdGcmFtZSAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxyXG4gICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgbGV0IHsgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuaW1nRGF0YVxyXG5cclxuICAgICAgdGhpcy5fcGFpbnRCYWNrZ3JvdW5kKClcclxuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQpXHJcblxyXG4gICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgIHRoaXMuX2NsaXAodGhpcy5fY3JlYXRlQ29udGFpbmVyQ2xpcFBhdGgpXHJcbiAgICAgICAgLy8gdGhpcy5fY2xpcCh0aGlzLl9jcmVhdGVJbWFnZUNsaXBQYXRoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuRFJBV19FVkVOVCwgY3R4KVxyXG4gICAgICBpZiAoIXRoaXMuaW1hZ2VTZXQpIHtcclxuICAgICAgICB0aGlzLmltYWdlU2V0ID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5ORVdfSU1BR0VfRFJBV05fRVZFTlQpXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5yb3RhdGluZyA9IGZhbHNlXHJcbiAgICB9LFxyXG5cclxuICAgIF9jbGlwUGF0aEZhY3RvcnkgKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgIGxldCByYWRpdXMgPSB0eXBlb2YgdGhpcy5pbWFnZUJvcmRlclJhZGl1cyA9PT0gJ251bWJlcicgP1xyXG4gICAgICAgIHRoaXMuaW1hZ2VCb3JkZXJSYWRpdXMgOlxyXG4gICAgICAgICFpc05hTihOdW1iZXIodGhpcy5pbWFnZUJvcmRlclJhZGl1cykpID8gTnVtYmVyKHRoaXMuaW1hZ2VCb3JkZXJSYWRpdXMpIDogMFxyXG4gICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgIGN0eC5tb3ZlVG8oeCArIHJhZGl1cywgeSk7XHJcbiAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gcmFkaXVzLCB5KTtcclxuICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCArIHdpZHRoLCB5LCB4ICsgd2lkdGgsIHkgKyByYWRpdXMpO1xyXG4gICAgICBjdHgubGluZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCAtIHJhZGl1cyk7XHJcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCwgeCArIHdpZHRoIC0gcmFkaXVzLCB5ICsgaGVpZ2h0KTtcclxuICAgICAgY3R4LmxpbmVUbyh4ICsgcmFkaXVzLCB5ICsgaGVpZ2h0KTtcclxuICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIHJhZGl1cyk7XHJcbiAgICAgIGN0eC5saW5lVG8oeCwgeSArIHJhZGl1cyk7XHJcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHksIHggKyByYWRpdXMsIHkpO1xyXG4gICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIF9jcmVhdGVDb250YWluZXJDbGlwUGF0aCAoKSB7XHJcbiAgICAgIHRoaXMuX2NsaXBQYXRoRmFjdG9yeSgwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcclxuICAgICAgaWYgKHRoaXMuY2xpcFBsdWdpbnMgJiYgdGhpcy5jbGlwUGx1Z2lucy5sZW5ndGgpIHtcclxuICAgICAgICB0aGlzLmNsaXBQbHVnaW5zLmZvckVhY2goZnVuYyA9PiB7XHJcbiAgICAgICAgICBmdW5jKHRoaXMuY3R4LCAwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIF9jcmVhdGVJbWFnZUNsaXBQYXRoICgpIHtcclxuICAgIC8vICAgbGV0IHsgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuaW1nRGF0YVxyXG4gICAgLy8gICBsZXQgdyA9IHdpZHRoXHJcbiAgICAvLyAgIGxldCBoID0gaGVpZ2h0XHJcbiAgICAvLyAgIGxldCB4ID0gc3RhcnRYXHJcbiAgICAvLyAgIGxldCB5ID0gc3RhcnRZXHJcbiAgICAvLyAgIGlmICh3IDwgaCkge1xyXG4gICAgLy8gICAgIGggPSB0aGlzLm91dHB1dEhlaWdodCAqICh3aWR0aCAvIHRoaXMub3V0cHV0V2lkdGgpXHJcbiAgICAvLyAgIH1cclxuICAgIC8vICAgaWYgKGggPCB3KSB7XHJcbiAgICAvLyAgICAgdyA9IHRoaXMub3V0cHV0V2lkdGggKiAoaGVpZ2h0IC8gdGhpcy5vdXRwdXRIZWlnaHQpXHJcbiAgICAvLyAgICAgeCA9IHN0YXJ0WCArICh3aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxyXG4gICAgLy8gICB9XHJcbiAgICAvLyAgIHRoaXMuX2NsaXBQYXRoRmFjdG9yeSh4LCBzdGFydFksIHcsIGgpXHJcbiAgICAvLyB9LFxyXG5cclxuICAgIF9jbGlwIChjcmVhdGVQYXRoKSB7XHJcbiAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICBjdHguc2F2ZSgpXHJcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2ZmZidcclxuICAgICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdkZXN0aW5hdGlvbi1pbidcclxuICAgICAgY3JlYXRlUGF0aCgpXHJcbiAgICAgIGN0eC5maWxsKClcclxuICAgICAgY3R4LnJlc3RvcmUoKVxyXG4gICAgfSxcclxuXHJcbiAgICBfYXBwbHlNZXRhZGF0YSAoKSB7XHJcbiAgICAgIGlmICghdGhpcy51c2VyTWV0YWRhdGEpIHJldHVyblxyXG4gICAgICB2YXIgeyBzdGFydFgsIHN0YXJ0WSwgc2NhbGUgfSA9IHRoaXMudXNlck1ldGFkYXRhXHJcblxyXG4gICAgICBpZiAodS5udW1iZXJWYWxpZChzdGFydFgpKSB7XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHN0YXJ0WFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodS5udW1iZXJWYWxpZChzdGFydFkpKSB7XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHN0YXJ0WVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodS5udW1iZXJWYWxpZChzY2FsZSkpIHtcclxuICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSBzY2FsZVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBudWxsXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIG9uRGltZW5zaW9uQ2hhbmdlICgpIHtcclxuICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgIHRoaXMuX2luaXRpYWxpemUoKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc2V0U2l6ZSgpXHJcbiAgICAgICAgdGhpcy5fcGxhY2VJbWFnZSgpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuPC9zY3JpcHQ+XHJcblxyXG48c3R5bGUgbGFuZz1cInN0eWx1c1wiPlxyXG4uY3JvcHBhLWNvbnRhaW5lclxyXG4gIGRpc3BsYXkgaW5saW5lLWJsb2NrXHJcbiAgY3Vyc29yIHBvaW50ZXJcclxuICB0cmFuc2l0aW9uIGFsbCAwLjNzXHJcbiAgcG9zaXRpb24gcmVsYXRpdmVcclxuICBmb250LXNpemUgMFxyXG4gIGFsaWduLXNlbGYgZmxleC1zdGFydFxyXG4gIGJhY2tncm91bmQtY29sb3IgI2U2ZTZlNlxyXG5cclxuICBjYW52YXNcclxuICAgIHRyYW5zaXRpb24gYWxsIDAuM3NcclxuXHJcbiAgJjpob3ZlclxyXG4gICAgb3BhY2l0eSAwLjdcclxuXHJcbiAgJi5jcm9wcGEtLWRyb3B6b25lXHJcbiAgICBib3gtc2hhZG93IGluc2V0IDAgMCAxMHB4IGxpZ2h0bmVzcyhibGFjaywgMjAlKVxyXG5cclxuICAgIGNhbnZhc1xyXG4gICAgICBvcGFjaXR5IDAuNVxyXG5cclxuICAmLmNyb3BwYS0tZGlzYWJsZWQtY2NcclxuICAgIGN1cnNvciBkZWZhdWx0XHJcblxyXG4gICAgJjpob3ZlclxyXG4gICAgICBvcGFjaXR5IDFcclxuXHJcbiAgJi5jcm9wcGEtLWhhcy10YXJnZXRcclxuICAgIGN1cnNvciBtb3ZlXHJcblxyXG4gICAgJjpob3ZlclxyXG4gICAgICBvcGFjaXR5IDFcclxuXHJcbiAgICAmLmNyb3BwYS0tZGlzYWJsZWQtbXpcclxuICAgICAgY3Vyc29yIGRlZmF1bHRcclxuXHJcbiAgJi5jcm9wcGEtLWRpc2FibGVkXHJcbiAgICBjdXJzb3Igbm90LWFsbG93ZWRcclxuXHJcbiAgICAmOmhvdmVyXHJcbiAgICAgIG9wYWNpdHkgMVxyXG5cclxuICAmLmNyb3BwYS0tcGFzc2l2ZVxyXG4gICAgY3Vyc29yIGRlZmF1bHRcclxuXHJcbiAgICAmOmhvdmVyXHJcbiAgICAgIG9wYWNpdHkgMVxyXG5cclxuICBzdmcuaWNvbi1yZW1vdmVcclxuICAgIHBvc2l0aW9uIGFic29sdXRlXHJcbiAgICBiYWNrZ3JvdW5kIHdoaXRlXHJcbiAgICBib3JkZXItcmFkaXVzIDUwJVxyXG4gICAgZmlsdGVyIGRyb3Atc2hhZG93KC0ycHggMnB4IDJweCByZ2JhKDAsIDAsIDAsIDAuNykpXHJcbiAgICB6LWluZGV4IDEwXHJcbiAgICBjdXJzb3IgcG9pbnRlclxyXG4gICAgYm9yZGVyIDJweCBzb2xpZCB3aGl0ZVxyXG48L3N0eWxlPlxyXG5cclxuPHN0eWxlIGxhbmc9XCJzY3NzXCI+XHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90b2JpYXNhaGxpbi9TcGluS2l0L2Jsb2IvbWFzdGVyL3Njc3Mvc3Bpbm5lcnMvMTAtZmFkaW5nLWNpcmNsZS5zY3NzXHJcbi5zay1mYWRpbmctY2lyY2xlIHtcclxuICAkY2lyY2xlQ291bnQ6IDEyO1xyXG4gICRhbmltYXRpb25EdXJhdGlvbjogMXM7XHJcblxyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuXHJcbiAgLnNrLWNpcmNsZSB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICB0b3A6IDA7XHJcbiAgfVxyXG5cclxuICAuc2stY2lyY2xlIC5zay1jaXJjbGUtaW5kaWNhdG9yIHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgbWFyZ2luOiAwIGF1dG87XHJcbiAgICB3aWR0aDogMTUlO1xyXG4gICAgaGVpZ2h0OiAxNSU7XHJcbiAgICBib3JkZXItcmFkaXVzOiAxMDAlO1xyXG4gICAgYW5pbWF0aW9uOiBzay1jaXJjbGVGYWRlRGVsYXkgJGFuaW1hdGlvbkR1cmF0aW9uIGluZmluaXRlIGVhc2UtaW4tb3V0IGJvdGg7XHJcbiAgfVxyXG5cclxuICBAZm9yICRpIGZyb20gMiB0aHJvdWdoICRjaXJjbGVDb3VudCB7XHJcbiAgICAuc2stY2lyY2xlI3skaX0ge1xyXG4gICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcgLyAkY2lyY2xlQ291bnQgKiAoJGkgLSAxKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBAZm9yICRpIGZyb20gMiB0aHJvdWdoICRjaXJjbGVDb3VudCB7XHJcbiAgICAuc2stY2lyY2xlI3skaX0gLnNrLWNpcmNsZS1pbmRpY2F0b3Ige1xyXG4gICAgICBhbmltYXRpb24tZGVsYXk6IC0kYW5pbWF0aW9uRHVyYXRpb24gKyAkYW5pbWF0aW9uRHVyYXRpb24gLyAkY2lyY2xlQ291bnQgKiAoJGkgLSAxKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuQGtleWZyYW1lcyBzay1jaXJjbGVGYWRlRGVsYXkge1xyXG4gIDAlLFxyXG4gIDM5JSxcclxuICAxMDAlIHtcclxuICAgIG9wYWNpdHk6IDA7XHJcbiAgfVxyXG4gIDQwJSB7XHJcbiAgICBvcGFjaXR5OiAxO1xyXG4gIH1cclxufVxyXG48L3N0eWxlPlxyXG5cclxuIiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsImltcG9ydCBjb21wb25lbnQgZnJvbSAnLi9jcm9wcGVyLnZ1ZSdcclxuaW1wb3J0IGFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJ1xyXG5cclxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgY29tcG9uZW50TmFtZTogJ2Nyb3BwYSdcclxufVxyXG5cclxuY29uc3QgVnVlQ3JvcHBhID0ge1xyXG4gIGluc3RhbGw6IGZ1bmN0aW9uIChWdWUsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBhc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKVxyXG4gICAgbGV0IHZlcnNpb24gPSBOdW1iZXIoVnVlLnZlcnNpb24uc3BsaXQoJy4nKVswXSlcclxuICAgIGlmICh2ZXJzaW9uIDwgMikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHZ1ZS1jcm9wcGEgc3VwcG9ydHMgdnVlIHZlcnNpb24gMi4wIGFuZCBhYm92ZS4gWW91IGFyZSB1c2luZyBWdWVAJHt2ZXJzaW9ufS4gUGxlYXNlIHVwZ3JhZGUgdG8gdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIFZ1ZS5gKVxyXG4gICAgfVxyXG4gICAgbGV0IGNvbXBvbmVudE5hbWUgPSBvcHRpb25zLmNvbXBvbmVudE5hbWUgfHwgJ2Nyb3BwYSdcclxuXHJcbiAgICAvLyByZWdpc3RyYXRpb25cclxuICAgIFZ1ZS5jb21wb25lbnQoY29tcG9uZW50TmFtZSwgY29tcG9uZW50KVxyXG4gIH0sXHJcblxyXG4gIGNvbXBvbmVudFxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZUNyb3BwYSJdLCJuYW1lcyI6WyJkZWZpbmUiLCJ0aGlzIiwicG9pbnQiLCJ2bSIsImNhbnZhcyIsInF1YWxpdHkiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WCIsImNsaWVudFkiLCJsZWZ0IiwidG9wIiwiZXZ0IiwicG9pbnRlciIsInRvdWNoZXMiLCJjaGFuZ2VkVG91Y2hlcyIsIm9uZVBvaW50Q29vcmQiLCJwb2ludGVyMSIsInBvaW50ZXIyIiwiY29vcmQxIiwiY29vcmQyIiwiTWF0aCIsInNxcnQiLCJwb3ciLCJ4IiwieSIsImltZyIsImNvbXBsZXRlIiwibmF0dXJhbFdpZHRoIiwiZG9jdW1lbnQiLCJ3aW5kb3ciLCJsYXN0VGltZSIsInZlbmRvcnMiLCJsZW5ndGgiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImNhbGxiYWNrIiwiY3VyclRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsInRpbWVUb0NhbGwiLCJtYXgiLCJpZCIsInNldFRpbWVvdXQiLCJhcmciLCJpc0FycmF5IiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwiSFRNTENhbnZhc0VsZW1lbnQiLCJiaW5TdHIiLCJsZW4iLCJhcnIiLCJ0b0Jsb2IiLCJkZWZpbmVQcm9wZXJ0eSIsInR5cGUiLCJhdG9iIiwidG9EYXRhVVJMIiwic3BsaXQiLCJVaW50OEFycmF5IiwiaSIsImNoYXJDb2RlQXQiLCJCbG9iIiwiZHQiLCJkYXRhVHJhbnNmZXIiLCJvcmlnaW5hbEV2ZW50IiwidHlwZXMiLCJhcnJheUJ1ZmZlciIsInZpZXciLCJEYXRhVmlldyIsImdldFVpbnQxNiIsImJ5dGVMZW5ndGgiLCJvZmZzZXQiLCJtYXJrZXIiLCJnZXRVaW50MzIiLCJsaXR0bGUiLCJ0YWdzIiwidXJsIiwicmVnIiwiZXhlYyIsImJhc2U2NCIsImJpbmFyeVN0cmluZyIsImJ5dGVzIiwiYnVmZmVyIiwib3JpZW50YXRpb24iLCJfY2FudmFzIiwiQ2FudmFzRXhpZk9yaWVudGF0aW9uIiwiZHJhd0ltYWdlIiwiX2ltZyIsIkltYWdlIiwic3JjIiwib3JpIiwibWFwIiwibiIsImlzTmFOIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidmFsdWUiLCJpc0Zpbml0ZSIsImZsb29yIiwiaW5pdGlhbEltYWdlVHlwZSIsIlN0cmluZyIsInZhbCIsIkJvb2xlYW4iLCJ2YWxpZHMiLCJldmVyeSIsImluZGV4T2YiLCJ3b3JkIiwidGVzdCIsIlBDVF9QRVJfWk9PTSIsIk1JTl9NU19QRVJfQ0xJQ0siLCJDTElDS19NT1ZFX1RIUkVTSE9MRCIsIk1JTl9XSURUSCIsIkRFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQIiwiUElOQ0hfQUNDRUxFUkFUSU9OIiwic3luY0RhdGEiLCJyZW5kZXIiLCJldmVudHMiLCJJTklUX0VWRU5UIiwicHJvcHMiLCJ3IiwidXNlQXV0b1NpemluZyIsInJlYWxXaWR0aCIsIndpZHRoIiwiaCIsInJlYWxIZWlnaHQiLCJoZWlnaHQiLCJwbGFjZWhvbGRlckZvbnRTaXplIiwibmF0dXJhbEhlaWdodCIsImxvYWRpbmdTaXplIiwiX2luaXRpYWxpemUiLCJyQUZQb2x5ZmlsbCIsInRvQmxvYlBvbHlmaWxsIiwic3VwcG9ydHMiLCJzdXBwb3J0RGV0ZWN0aW9uIiwiYmFzaWMiLCJ3YXJuIiwicGFzc2l2ZSIsIiR3YXRjaCIsImRhdGEiLCJzZXQiLCJrZXkiLCIkc2V0IiwicmVtb3ZlIiwiJG5leHRUaWNrIiwiX2RyYXciLCJhdXRvU2l6aW5nIiwiJHJlZnMiLCJ3cmFwcGVyIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsIl9hdXRvU2l6aW5nSW5pdCIsIl9hdXRvU2l6aW5nUmVtb3ZlIiwib25EaW1lbnNpb25DaGFuZ2UiLCJfc2V0UGxhY2Vob2xkZXJzIiwiaW1hZ2VTZXQiLCJfcGxhY2VJbWFnZSIsIm9sZFZhbCIsInUiLCJudW1iZXJWYWxpZCIsInBvcyIsImN1cnJlbnRQb2ludGVyQ29vcmQiLCJpbWdEYXRhIiwic3RhcnRYIiwic3RhcnRZIiwidXNlck1ldGFkYXRhIiwicm90YXRpbmciLCJvZmZzZXRYIiwib2Zmc2V0WSIsInByZXZlbnRXaGl0ZVNwYWNlIiwiX3ByZXZlbnRab29taW5nVG9XaGl0ZVNwYWNlIiwiX3ByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UiLCJzY2FsZVJhdGlvIiwiaGFzSW1hZ2UiLCJhYnMiLCJlbWl0RXZlbnQiLCJaT09NX0VWRU5UIiwiTE9BRElOR19TVEFSVF9FVkVOVCIsIkxPQURJTkdfRU5EX0VWRU5UIiwiJGVtaXQiLCJjdHgiLCJjaG9zZW5GaWxlIiwiZmlsZUlucHV0IiwiZmlsZXMiLCJvbGRYIiwib2xkWSIsIk1PVkVfRVZFTlQiLCJhbW91bnQiLCJtb3ZlIiwiem9vbUluIiwiYWNjZWxlcmF0aW9uIiwicmVhbFNwZWVkIiwiem9vbVNwZWVkIiwic3BlZWQiLCJvdXRwdXRXaWR0aCIsInpvb20iLCJzdGVwIiwiZGlzYWJsZVJvdGF0aW9uIiwiZGlzYWJsZWQiLCJwYXJzZUludCIsIl9yb3RhdGVCeVN0ZXAiLCJfc2V0T3JpZW50YXRpb24iLCJtZXRhZGF0YSIsImNvbXByZXNzaW9uUmF0ZSIsIm1pbWVUeXBlIiwicXVhbGl0eUFyZ3VtZW50IiwiYXJncyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2VuZXJhdGVCbG9iIiwiYmxvYiIsImVyciIsImRpdiIsImNyZWF0ZUVsZW1lbnQiLCJGaWxlIiwiRmlsZVJlYWRlciIsIkZpbGVMaXN0IiwiY2xpY2siLCJoYWRJbWFnZSIsIm9yaWdpbmFsSW1hZ2UiLCJ2aWRlbyIsInBhdXNlIiwiSU1BR0VfUkVNT1ZFX0VWRU5UIiwicGx1Z2luIiwiY2xpcFBsdWdpbnMiLCJwdXNoIiwiRXJyb3IiLCJmaWxlIiwiX29uTmV3RmlsZUluIiwic2xpY2UiLCJfc2V0Q29udGFpbmVyU2l6ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiX3NldFNpemUiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsImNhbnZhc0NvbG9yIiwiZ2V0Q29udGV4dCIsImltYWdlU21vb3RoaW5nRW5hYmxlZCIsImltYWdlU21vb3RoaW5nUXVhbGl0eSIsIndlYmtpdEltYWdlU21vb3RoaW5nRW5hYmxlZCIsIm1zSW1hZ2VTbW9vdGhpbmdFbmFibGVkIiwiX3NldEluaXRpYWwiLCJvdXRwdXRIZWlnaHQiLCIkc2xvdHMiLCJwbGFjZWhvbGRlciIsInZOb2RlIiwidGFnIiwiZWxtIiwib25Mb2FkIiwiaW1hZ2VMb2FkZWQiLCJvbmxvYWQiLCJ0ZXh0QmFzZWxpbmUiLCJ0ZXh0QWxpZ24iLCJkZWZhdWx0Rm9udFNpemUiLCJmb250U2l6ZSIsImNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSIsImZvbnQiLCJmaWxsU3R5bGUiLCJwbGFjZWhvbGRlckNvbG9yIiwiZmlsbFRleHQiLCJfcGFpbnRCYWNrZ3JvdW5kIiwiX3NldEltYWdlUGxhY2Vob2xkZXIiLCJfc2V0VGV4dFBsYWNlaG9sZGVyIiwiaW5pdGlhbCIsImluaXRpYWxJbWFnZSIsInNldEF0dHJpYnV0ZSIsImJhYmVsSGVscGVycy50eXBlb2YiLCJjdXJyZW50SXNJbml0aWFsIiwiX29ubG9hZCIsImRhdGFzZXQiLCJsb2FkaW5nIiwib25lcnJvciIsIklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UIiwidmlkZW9XaWR0aCIsInZpZGVvSGVpZ2h0IiwiZHJhd0ZyYW1lIiwiZnJhbWUiLCJrZWVwRHJhd2luZyIsImVuZGVkIiwicGF1c2VkIiwiZW1pdE5hdGl2ZUV2ZW50IiwiZGlzYWJsZUNsaWNrVG9DaG9vc2UiLCJzdXBwb3J0VG91Y2giLCJjaG9vc2VGaWxlIiwidmlkZW9FbmFibGVkIiwicGxheSIsImlucHV0IiwiRklMRV9DSE9PU0VfRVZFTlQiLCJfZmlsZVNpemVJc1ZhbGlkIiwiRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCIsIl9maWxlVHlwZUlzVmFsaWQiLCJGSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQiLCJuYW1lIiwidG9Mb3dlckNhc2UiLCJwb3AiLCJmciIsImUiLCJmaWxlRGF0YSIsInRhcmdldCIsInJlc3VsdCIsInBhcnNlRGF0YVVybCIsImlzVmlkZW8iLCJyZWFkeVN0YXRlIiwiSEFWRV9GVVRVUkVfREFUQSIsIl9vblZpZGVvTG9hZCIsImxvZyIsImdldEZpbGVPcmllbnRhdGlvbiIsImJhc2U2NFRvQXJyYXlCdWZmZXIiLCJORVdfSU1BR0VfRVZFTlQiLCJyZWFkQXNEYXRhVVJMIiwiZmlsZVNpemVMaW1pdCIsInNpemUiLCJhY2NlcHRhYmxlTWltZVR5cGUiLCJjYW5QbGF5VHlwZSIsImFjY2VwdCIsImJhc2VNaW1ldHlwZSIsInJlcGxhY2UiLCJ0IiwidHJpbSIsImNoYXJBdCIsImZpbGVCYXNlVHlwZSIsImFwcGx5TWV0YWRhdGEiLCJfYXNwZWN0RmlsbCIsImluaXRpYWxTaXplIiwiX2FzcGVjdEZpdCIsIl9uYXR1cmFsU2l6ZSIsImluaXRpYWxQb3NpdGlvbiIsIl9hcHBseU1ldGFkYXRhIiwiaW1nV2lkdGgiLCJpbWdIZWlnaHQiLCJjYW52YXNSYXRpbyIsImFzcGVjdFJhdGlvIiwicG9pbnRlck1vdmVkIiwicG9pbnRlckNvb3JkIiwiZ2V0UG9pbnRlckNvb3JkcyIsInBvaW50ZXJTdGFydENvb3JkIiwidGFiU3RhcnQiLCJ2YWx1ZU9mIiwid2hpY2giLCJkcmFnZ2luZyIsInBpbmNoaW5nIiwiY29vcmQiLCJsYXN0TW92aW5nQ29vcmQiLCJkaXNhYmxlUGluY2hUb1pvb20iLCJwaW5jaERpc3RhbmNlIiwiZ2V0UGluY2hEaXN0YW5jZSIsImNhbmNlbEV2ZW50cyIsIl9oYW5kbGVQb2ludGVyRW5kIiwicG9pbnRlck1vdmVEaXN0YW5jZSIsInRhYkVuZCIsImRpc2FibGVEcmFnVG9Nb3ZlIiwicHJldmVudERlZmF1bHQiLCJkaXN0YW5jZSIsImRlbHRhIiwiZGlzYWJsZVNjcm9sbFRvWm9vbSIsInNjcm9sbGluZyIsIndoZWVsRGVsdGEiLCJkZWx0YVkiLCJkZXRhaWwiLCJyZXZlcnNlU2Nyb2xsVG9ab29tIiwiZGlzYWJsZURyYWdBbmREcm9wIiwiZXZlbnRIYXNGaWxlIiwicmVwbGFjZURyb3AiLCJmaWxlRHJhZ2dlZE92ZXIiLCJpdGVtcyIsIml0ZW0iLCJraW5kIiwiZ2V0QXNGaWxlIiwidXNlT3JpZ2luYWwiLCJnZXRSb3RhdGVkSW1hZ2UiLCJmbGlwWCIsImZsaXBZIiwicm90YXRlOTAiLCJjbGVhclJlY3QiLCJmaWxsUmVjdCIsIl9kcmF3RnJhbWUiLCJfY2xpcCIsIl9jcmVhdGVDb250YWluZXJDbGlwUGF0aCIsIkRSQVdfRVZFTlQiLCJORVdfSU1BR0VfRFJBV05fRVZFTlQiLCJyYWRpdXMiLCJpbWFnZUJvcmRlclJhZGl1cyIsImJlZ2luUGF0aCIsIm1vdmVUbyIsImxpbmVUbyIsInF1YWRyYXRpY0N1cnZlVG8iLCJjbG9zZVBhdGgiLCJfY2xpcFBhdGhGYWN0b3J5IiwiZm9yRWFjaCIsImNyZWF0ZVBhdGgiLCJzYXZlIiwiZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uIiwiZmlsbCIsInJlc3RvcmUiLCJzY2FsZSIsImRlZmF1bHRPcHRpb25zIiwiVnVlQ3JvcHBhIiwiVnVlIiwib3B0aW9ucyIsImFzc2lnbiIsInZlcnNpb24iLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQ0FBQyxVQUFVLElBQUksRUFBRSxPQUFPLEVBQUU7SUFDdEIsSUFBSSxPQUFPQSxTQUFNLEtBQUssVUFBVSxJQUFJQSxTQUFNLENBQUMsR0FBRyxFQUFFO1FBQzVDQSxTQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3ZCLE1BQU0sQUFBaUM7UUFDcEMsY0FBYyxHQUFHLE9BQU8sRUFBRSxDQUFDO0tBQzlCLEFBRUY7Q0FDRixDQUFDQyxjQUFJLEVBQUUsWUFBWTtFQUNsQixZQUFZLENBQUM7O0VBRWIsU0FBUyxT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
