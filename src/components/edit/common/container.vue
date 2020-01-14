<template>
  <div :class="wrapClasses">
    <div v-if="type !== 'readOnly'" :class="prefixCls + '-grid-canvas'">
      <canvas :class="prefixCls + '-grid-inner'" ref="gridInner" />
    </div>
  </div>
</template>

<script>
import { oneOf } from '../utils/index'
const prefixCls = 'tpv-edit'
export default {
  name: 'tpvContainer',
  components: {},
  props: {
    value: {
      type: Object,
      default: () => {
        return { 'version': '2.4.6', 'objects': [], 'background': 'white' }
      }
    },
    type: {
      validator (value) {
        return oneOf(value, ['edit', 'readOnly', 'select'])
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
      prefixCls: prefixCls
    }
  },
  created () {},
  mounted () {
    this.renderGrid()
    window.addEventListener('resize', this.renderGrid)
  },
  updated () {},
  destroyed () {
    window.removeEventListener('resize', this.renderGrid)
  },
  methods: {},
  computed: {
    wrapClasses () {
      return [
        `${prefixCls}-container`,
        {
          [`${this.className}`]: !!this.className
        }
      ]
    }
  },
  watch: {}
}
</script>
