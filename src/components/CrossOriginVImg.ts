import Vue from "vue";

import { consoleError, consoleWarn } from 'vuetify/src/util/console'

// @ts-ignore
import VImg from 'vuetify/lib/components/VImg';
//const VImg = Vue.options.components["v-img"];

const CrossOriginVImg = VImg.extend({
  methods: {
    onLoad() {
      // @ts-ignore
      this.getSrc()
      // @ts-ignore
      this.isLoading = false
      // @ts-ignore
      this.$emit('load', this.image)
    },
    loadImage() {
      const image = new Image()
      image.crossOrigin = "anonymous"
      // @ts-ignore
      this.image = image

      image.onload = () => {
        /* istanbul ignore if */
        if (image.decode) {
          image.decode().catch((err: DOMException) => {
            consoleWarn(
              `Failed to decode image, trying to render anyway\n\n` +
              // @ts-ignore
              `src: ${this.normalisedSrc.src}` +
              (err.message ? `\nOriginal error: ${err.message}` : ''),
              this
            )
          }).then(this.onLoad)
        } else {
          this.onLoad()
        }
      }
      //@ts-ignore
      image.onerror = this.onError
      // @ts-ignore
      image.src = this.normalisedSrc.src
      // @ts-ignore
      this.sizes && (image.sizes = this.sizes)
      // @ts-ignore
      this.normalisedSrc.srcset && (image.srcset = this.normalisedSrc.srcset)
      // @ts-ignore
      this.aspectRatio || this.pollForSize(image)
      // @ts-ignore
      this.getSrc()
    },
  }
});


export default Vue.component('v-img-cross-origin', CrossOriginVImg);