<template>
  <div class="menu-button" @click="switchActive">
    <svg
      class="dashboard__icon"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      -->
      <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="white" />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MenuButton",
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    switchActive: function () {
      this.$emit("switch", !this.isActive);
    },
  },
});
</script>
