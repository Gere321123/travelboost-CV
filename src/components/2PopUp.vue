<template>
    <div class="popup">
      <div class="popup-inner">
        <slot />
        <button class="popup-close" @click="onOkay">
          Yes
        </button>
        <button class="popup-delete" @click="onCancel">
          No
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      onOkay: {
        type: Function,
        required: true
      },
      onCancel: {
        type: Function,
        required: true
      }
    }
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
    position: relative;
  }
  
  .popup-close, .popup-delete {
    background: #00aeff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
    margin-right: 10px;
  }
  
  .popup-delete {
    background: #ff4d4d;
  }
  
  .popup-close:hover {
    background: #2f76d3;
  }
  
  .popup-delete:hover {
    background: #d32f2f;
  }
  </style>
  