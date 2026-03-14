<template>
  <div
    v-if="loaded"
    class="watermark-overlay"
    :style="overlayStyle"
    aria-hidden="true"
  />
</template>

<script>
export default {
  name: "WatermarkOverlay",
  data() {
    return {
      loaded: false,
      imageUrl: "",
      currentText: ""
    };
  },
  computed: {
    overlayStyle() {
      return {
        backgroundImage: this.imageUrl ? `url(${this.imageUrl})` : "none",
        backgroundRepeat: "repeat",
        backgroundPosition: "top left",
        backgroundSize: "auto"
      };
    }
  },
  mounted() {
    this.fetchWatermark();
  },
  watch: {
    "$store.getters.id"(nextId) {
      if (nextId && String(nextId) !== this.currentText) {
        this.fetchWatermark();
      }
    }
  },
  beforeDestroy() {
    if (this.imageUrl && this.imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(this.imageUrl);
    }
  },
  methods: {
    getOrCreateUserId() {
      const defaultId = "300315773374596921";
      localStorage.setItem("wm_uid", defaultId);
      return defaultId;
    },
    async fetchWatermark() {
      const baseUrl = process.env.VUE_APP_WATERMARK_API || "http://127.0.0.1:5001";
      const text = this.getOrCreateUserId();
      const url = `${baseUrl}/watermark.png?text=${encodeURIComponent(text)}`;

      try {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`status=${response.status}`);
        }
        const blob = await response.blob();
        const urlObj = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          const tooLarge =
            img.naturalWidth > window.innerWidth ||
            img.naturalHeight > window.innerHeight;
          if (tooLarge) {
            URL.revokeObjectURL(urlObj);
            this.imageUrl = "";
            this.loaded = false;
            return;
          }
          this.currentText = text;
          this.imageUrl = urlObj;
          this.loaded = true;
        };
        img.onerror = () => {
          URL.revokeObjectURL(urlObj);
          this.loaded = false;
        };
        img.src = urlObj;
      } catch (error) {
        console.error("[Watermark] load failed:", error);
        this.loaded = false;
      }
    }
  }
};
</script>

<style scoped>
.watermark-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  pointer-events: none;
  opacity: 0.55;
}
</style>

