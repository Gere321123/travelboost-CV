<template>
  <div class="card">
    <div class="top">
      <p>Drag & drop images</p>
    </div>
    <div class="drag-area"
         @dragenter.prevent="onDragEnter"
         @dragover.prevent="onDragOver"
         @dragleave.prevent="onDragLeave"
         @drop.prevent="onDrop">
      <span v-if="isDragging">
        Drag & drop image here or
        <span class="select" role="button" @click="selectFiles">
          Choose
        </span>
      </span>
      <div v-else class="select">Drop images here</div>
      <input name="file" type="file" class="file" ref="fileInput" multiple @change="onFileSelect"/>
    </div>
    <div class="container">
      <div class="image" v-for="(image, index) in images" :key="index">
        <span class="delete" @click="deleteImage(index, image.name)">&times;</span>
        <img :src="image.url"/>
      </div>
    </div>
    <div v-if="loading" class="loading">Loading...</div>
  </div>
</template>

<script>
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Compressor from 'compressorjs';
import { v4 as uuidv4 } from 'uuid';

export default {
  props: {
    initialImages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      images: [],
      isDragging: true,
      storage: getStorage(),
      userId: null,
      loading: false,
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userId = user.uid;
      }
    });
    this.images = this.initialImages; // Initialize images from props
  },
  watch: {
    initialImages: {
      handler(newImages) {
        this.images = newImages; // Update images if initialImages prop changes
      },
      deep: true
    }
  },
  methods: {
    selectFiles() {
      this.$refs.fileInput.click();
    },
    async onFileSelect(event) {
      const files = event.target.files;
      if (files.length === 0) return;
      const newImages = [];
      const maxSize = 25 * 1024 * 1024; // 25 MB
      for (let i = 0; i < files.length; i++) {
        if (this.images.length >= 14) {
          alert("Maximum 14 images can be uploaded.");
          return;
        }
        if (files[i].type.split("/")[0] !== "image") continue;
        if (files[i].size > maxSize) {
          alert("Maximum image size is 25 MB.");
          continue; // Skip this file
        }

        this.loading = true; // Show loading animation
        try {
          const compressedFile = await new Promise((resolve, reject) => {
            new Compressor(files[i], {
              quality: 0.5,
              maxWidth: 800,
              maxHeight: 600,
              success(result) {
                resolve(result);
              },
              error(err) {
                reject(err);
              },
            });
          });
          const uniqueFileName = uuidv4();
          const storageReference = storageRef(this.storage, `vacation/${this.userId}/images/${uniqueFileName}`);
          await uploadBytes(storageReference, compressedFile);
          const url = await getDownloadURL(storageReference);
          const image = { name: uniqueFileName, url };
          this.images.push(image);
          newImages.push(image);
        } catch (error) {
          console.error('Error uploading image:', error);
        } finally {
          this.loading = false; // Hide loading animation
        }
      }
      if (newImages.length > 0) {
        this.$emit('update:images', this.images);
      }
    },
    async deleteImage(index, imageName) {
  try {
    const storageReference = storageRef(this.storage, `vacation/${this.userId}/images/${imageName}`);
    await deleteObject(storageReference);
    this.images.splice(index, 1); // Remove the image from the images array
    this.$emit('update:images', this.images);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
},
    onDragEnter(event) {
      event.preventDefault();
      this.isDragging = false;
    },
    onDragOver(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },
    onDragLeave(event) {
      event.preventDefault();
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX;
      const y = event.clientY;
      if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
        this.isDragging = true;
      }
    },
    async onDrop(event) {
      event.preventDefault();
      this.isDragging = true;
      const files = event.dataTransfer.files;
      const newImages = [];
      const maxSize = 25 * 1024 * 1024; // 25 MB
      for (let i = 0; i < files.length; i++) {
        if (this.images.length >= 14) {
          alert("Maximum 14 images can be uploaded.");
          return;
        }
        if (files[i].type.split("/")[0] !== "image") continue;
        if (files[i].size > maxSize) {
          alert("Maximum image size is 25 MB.");
          continue; // Skip this file
        }

        this.loading = true; // Show loading animation
        try {
          const compressedFile = await new Promise((resolve, reject) => {
            new Compressor(files[i], {
              quality: 0.6,
              success(result) {
                resolve(result);
              },
              error(err) {
                reject(err);
              },
            });
          });
          const uniqueFileName = uuidv4();

          const storageReference = storageRef(this.storage, `vacation/${this.userId}/images/${uniqueFileName}`);
          await uploadBytes(storageReference, compressedFile);
          const url = await getDownloadURL(storageReference);
          const image = { name: uniqueFileName, url };
          this.images.push(image);
          newImages.push(image);
        } catch (error) {
          console.error('Error uploading image:', error);
        } finally {
          this.loading = false; // Hide loading animation
        }
      }
      if (newImages.length > 0) {
        this.$emit('update:images', this.images);
      }
    }
  }
}
</script>





<style scoped>
.card{
    width: 100%;
    padding: 10px;
    box-shadow: 0 0 5px #ffdfdf;
    border-radius: 5px;
    overflow: hidden;
}
.card .top{
    text-align: center;
}
.card p{
    font-weight: bold;
    color: #fe0000;
}
.card button{
    outline: 0;
    border: 0;
    color: #fff;
    border-radius: 4px;
    font-weight: 400;
    padding: 8px 13px;
    width: 100%;
    background-color: #fe0000;
}
.card .drag-area{
    height: 150px;
    border-radius: 5px;
    border: 2px dashed #fe0000;
    background: #f4f4f4;
    color: #fe0000;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: center;
    -webkit-user-select: none;
    margin-top: 10px;
}
.card .drag-area .visible{
    font-size: 18px;
}
.card .select{
    color: #5256ad;
    margin-left: 5px;
    cursor: pointer;
    transition: 0.4s;
}
.card .select:hover{
    opacity: 0.6;
}
.card .container .image{
width: 75px;
margin-right: 5px;
height: 75px;
position: relative;
margin-bottom: 8px;
}
.card .container{
    width: 100%;
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    max-height: 200px;
    position: relative;
    margin-bottom: 8px;
    padding-top: 10px;
}
.card .container .image img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
}
.card .container .image span{
    position: absolute;
    top: -2px;
    right: -2px;
    font-size: 25px;
    cursor: pointer;
}

.card input,
.card .drag-area .on-drop,
.card .drag-area.dragover .visible{
    display: none;
}
.delete {
  z-index: 999;
  color: #fe0000;
  background-color: #f4f4f4;
  border-radius: 50%;
  width: 30px; /* Átmérő beállítása */
  height: 30px; /* Átmérő beállítása */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
}


</style>