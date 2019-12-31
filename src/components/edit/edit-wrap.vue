<template>
  <div :class="wrapClasses" ref="editWrap">
    
    <!-- 选择区 -->
    <div :class="areaSelectClasses" ref="selectRect"></div>
  </div>
</template>

<script>
import { oneOf, Debounce } from './utils/index';
const prefixCls = 'tpv-edit';
export default {
  name: 'eidt-wrap',
  components: {},
  props: {
    value: {
      type: Object,
      default: () => {
        return {"version":"2.4.6","objects":[],"background":"white"}
      }
    },
    type: {
      validator (value) {
        return oneOf(value, ['edit', 'readOnly', 'select']);
      },
      default: 'edit'
    },
    width: {
      type: [Number, String],
      default: '100%'
    },
    height: {
      type: [Number, String],
      default: '100%'
    },
    loading: {
      type: Boolean,
      default: false
    },
    className: {
      type: String
    }
  },
  data () {
    return {
      prefixCls: prefixCls,
      _mouseDownRecycle: null,
      _mouseMoveRecycle: null,
      _mouseUpRecycle: null,
      mouse: {
        start: {x:0, y:0},
        move: {x:0, y:0},
        isMouseDown: false
      },
      boundaryReact: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
      debounce: new Debounce(50, true)
    }
  },
  created () {},
  mounted () {
    this.initEventsHandler();
    this.setBoundaryReact();
    window.addEventListener("resize", this.setBoundaryReact);
  },
  updated () {},
  destroyed () {
    window.removeEventListener("resize", this.setBoundaryReact);
  },
  methods: {
    setBoundaryReact() {
      let boundaryDom = this.$refs.editWrap;
      let clientRect = boundaryDom.getBoundingClientRect();
      let t, domLeft, domTop;
      domLeft = (((t = document.documentElement) || (t = document.body.parentNode)) && typeof t.scrollLeft == 'number' ? t : document.body).scrollLeft + Number(clientRect.left);
      domTop = (((t = document.documentElement) || (t = document.body.parentNode)) && typeof t.scrollTop == 'number' ? t : document.body).scrollTop + Number(clientRect.top);
      this.boundaryReact = {
        left: domLeft,
        top: domTop,
        width: Number(clientRect.width),
        height: Number(clientRect.height)
      }
    },
    checkMouseVail(left, top) {
      //验证多选区域是否合法
      return left >= this.boundaryReact.left && left <= this.boundaryReact.left + Number(this.boundaryReact.width) && top >= this.boundaryReact.top && top <= this.boundaryReact.top + Number(this.boundaryReact.height);
    },
    renderAreaSelect(left, top, width, height) {
      //编辑模式开启多选框
      if (this.type == 'edit') {
        let style = this.$refs.selectRect.style;
        left = width > 0 ? left : left + width;
        top = height > 0 ? top : top + height;
        left -= this.boundaryReact.left;
        top -= this.boundaryReact.top;
        if (width == 0 && height == 0) {
          style.display = "none";
        } else {
          style.cssText = `display:block;left:${left}px;top:${top}px;width:${Math.abs(width)}px;height:${Math.abs(height)}px;`
        }
      }
    },
    initEventsHandler() {
      this.mouseDownRecycle();
      this.mouseMoveRecycle();
      this.mouseUpRecycle();
    },
    mouseDownRecycle() {
      let dom = document;
      let _self = this;
      this._mouseDownRecycle = this.on(dom, 'mousedown', (event) => {
        if (_self.checkMouseVail(event.pageX, event.pageY)) {
          _self.mouse.isMouseDown = true;
          _self.mouse.start.x = event.pageX;
          _self.mouse.start.y = event.pageY;
        }
      });
    },
    mouseMoveRecycle() {
      let dom = document;
      let _self = this;
      this._mouseMoveRecycle = this.on(dom, 'mousemove', (event) => {
        if (!_self.mouse.isMouseDown) {
          return;
        }
        _self.debounce.handle(() => {
          const currentX = event.pageX,
                currentY = event.pageY;
          _self.mouse.move.x = currentX - _self.mouse.start.x;
          _self.mouse.move.y = currentY - _self.mouse.start.y;
          _self.renderAreaSelect(_self.mouse.start.x, _self.mouse.start.y, _self.mouse.move.x, _self.mouse.move.y);
        })
      });
    },
    mouseUpRecycle() {
      let dom = document;
      let selectRect = this.$refs.selectRect.style;
      let _self = this;
      this._mouseUpRecycle = this.on(dom, 'mouseup', (event) => {
        _self.debounce.doHandle();
        selectRect.display = 'none';
        _self.mouse = {
          start: {x:0, y:0},
          move: {x:0, y:0},
          isMouseDown: false
        };
      });
    },
    on(target, eventName, callback) {
      target.addEventListener(eventName, callback);
      return () => {
        target.removeEventListener(eventName, callback);
      }
    }
  },
  computed: {
    wrapClasses () {
      return [
        `${prefixCls}-wrap`,
        {
          [`${this.className}`]: !!this.className
        }
      ];
    },
    areaSelectClasses () {
      return `${prefixCls}-area-select-container`
    }
  },
  watch: {}
}
</script>
