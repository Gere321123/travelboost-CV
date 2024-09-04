<template>
	<div class="popup">
		<div class="popup-inner">
			<slot />
			<button class="popup-close" @click="TogglePopup()">
				Okay
			</button>
		</div>
	</div>
</template>

<script>
export default {
	props: ['TogglePopup']
}
</script>


<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-inner {
  background: white;
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  position: relative; /* Ensure close button positioning relative to popup-inner */
}

.popup-close {
  background: #00aeff;
  color: white;
  border: none;
  padding: 1px 3px; /* Smaller padding */
  border-radius: 3px; /* Smaller border-radius */
  cursor: pointer;
  font-size: 14px; /* Smaller font size */
  position: absolute;
  bottom: 5px; /* Adjusted top position */
  margin: 5px;
  right: 50%; /* Adjusted right position */
}

.popup-close:hover {
  background: #2f76d3;
}
</style>