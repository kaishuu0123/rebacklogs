import Color from 'color'

export default {
  methods: {
    // refs: https://stackoverflow.com/a/4726403
    // refs: https://katashin.info/2018/12/18/247
    // refs: WCAG contrast ratio Guideline 1.4.3 Contrast (Minimum)
    idealTextColor(color) {
      if (color == null) {
        return "#000000"
      }

      let nThreshold = 105;
      let components = this.getRGBComponents(color);
      let bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

      return ((255 - bgDelta) < nThreshold) ? Color(color).darken(0.7).hex() : '#ffffff';
    },
    getRGBComponents(color) {
      let r = color.substring(1, 3);
      let g = color.substring(3, 5);
      let b = color.substring(5, 7);

      return {
        R: parseInt(r, 16),
        G: parseInt(g, 16),
        B: parseInt(b, 16)
      };
    }
  }
}