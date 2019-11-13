<template>
  <div ref="colorpicker" class="input-group">
    <input v-model="colorValue" type="text" class="form-control" @focus="showPicker()" @input="updateFromInput">
    <sketch-picker
      v-if="displayPicker"
      :value="colors"
      :presetColors="presetColors"
      @input="updateFromPicker" />
  </div>
</template>

<script>
import { Sketch } from 'vue-color'

export default {
  name: 'ColorPicker',
  components: {
    'sketch-picker': Sketch
  },
  props: {
    color: {
      type: String
    },
  },
	data() {
		return {
			colors: {
				hex: "#6e707e"
			},
			colorValue: "",
      displayPicker: false,
      presetColors: [
        '#cce5ff', '#e2e3e5', '#d4edda', '#f8d7da', '#fff3cd', '#d1ecf1', '#fefefe', '#d6d8d9',
        '#1C89FF', '#86878A', '#1FE950', '#F51228', '#FDC512', '#1DD0F1', '#070707', '#707475',
      ]
		};
	},
	watch: {
		colorValue(val) {
			if (val) {
				this.updateColors(val);
				this.$emit("input", val);
			}
    },
    color(val) {
      this.setColor(this.color || "#000000");
    }
	},
	mounted() {
    this.$nextTick(() => {
      this.setColor(this.color || "#000000");
    })
	},
	destroyed() {
		this.hidePicker();
	},
	methods: {
		setColor(color) {
			this.updateColors(color);
			this.colorValue = color;
		},
		updateColors(val) {
			this.colors = val;
		},
		showPicker() {
			document.addEventListener("click", this.documentClick);
			this.displayPicker = true;
		},
		hidePicker() {
			document.removeEventListener("click", this.documentClick);
			this.displayPicker = false;
		},
		togglePicker() {
			this.displayPicker ? this.hidePicker() : this.showPicker();
		},
		updateFromInput() {
			this.updateColors(this.colorValue);
		},
		updateFromPicker(color) {
			this.colors = color;
			if (color.rgba.a === 1) {
				this.colorValue = color.hex;
			} else {
				// eslint-disable-next-line
				this.colorValue =
					"rgba(" +
					color.rgba.r +
					", " +
					color.rgba.g +
					", " +
					color.rgba.b +
					", " +
					color.rgba.a +
					")";
			}
		},
		documentClick(e) {
			const el = this.$refs.colorpicker;
			const target = e.target;
			if (el !== target && !el.contains(target)) {
				this.hidePicker();
			}
    }
  }
}
</script>

<style>
.vc-sketch {
  position: absolute !important;
	top: 50px;
	left: 0;
	z-index: 9;
}

.current-color {
	display: inline-block;
	width: 16px;
	height: 16px;
	background-color: #000;
	cursor: pointer;
}
</style>