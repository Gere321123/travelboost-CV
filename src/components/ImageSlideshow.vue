<template>
  <div v-if="images && images.length" class="slideshow">
    <transition :name="transitionName" mode="out-in">
      <div class="image-wrapper" :key="images[currentImageIndex].url">
        <img
          :src="images[currentImageIndex].url"
          :alt="images[currentImageIndex].name"
          class="low-res"
          @load="onLowResLoad"
          @error="onImageError('low-res')"
        />
        <img
          :src="images[currentImageIndex].url"
          :alt="images[currentImageIndex].name"
          class="high-res"
          :class="{ loaded: highResLoaded }"
          @load="onHighResLoad"
          @error="onImageError('high-res')"
        />
      </div>
    </transition>
    <div class="slideshow-controls">
      <button @click="prevImage" class="arrow left-arrow">&#9664;</button>
      <button @click="nextImage" class="arrow right-arrow">&#9654;</button>
    </div>
    <div class="image-counter">{{ currentImageIndex + 1 }} / {{ images.length }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface Image {
  name: string;
  url: string;
}

export default defineComponent({
  name: 'ImageSlideshow',
  props: {
    images: {
      type: Array as PropType<Image[]>,
      required: true,
    },
  },
  data() {
    return {
      currentImageIndex: 0,
      highResLoaded: false,
      transitionName: 'slide-right',
    };
  },
  methods: {
    nextImage() {
      this.transitionName = 'slide-left';
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      this.highResLoaded = false;
      console.log('Next image:', this.images[this.currentImageIndex]);
    },
    prevImage() {
      this.transitionName = 'slide-right';
      this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
      this.highResLoaded = false;
      console.log('Previous image:', this.images[this.currentImageIndex]);
    },
    onLowResLoad() {
      console.log('Low-res image loaded');
    },
    onHighResLoad() {
      this.highResLoaded = true;
      console.log('High-res image loaded');
    },
    onImageError(type: string) {
      console.error(`${type} image failed to load`);
    },
  },
});
</script>

<style scoped>
.slideshow {
  border-radius: 10px;
  border: 1px solid black;
  position: relative;
  width: 700px;
  height: 500px;
  margin: auto;
  overflow: hidden;
}
.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
.low-res {
  filter: blur(20px);
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.high-res {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}
.high-res.loaded {
  opacity: 1;
}
.slideshow-controls {
  position: absolute;
  top: 50%;
  width: calc(100%);
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  padding: 0 20px;
}
.arrow {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
}
.arrow:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
.left-arrow {
  border-radius: 0 3px 3px 0;
}
.right-arrow {
  border-radius: 3px 0 0 3px;
}
.image-counter {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
}
</style>
