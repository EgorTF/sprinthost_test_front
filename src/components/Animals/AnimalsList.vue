<script setup lang="ts">
const laravel_storage = import.meta.env.VITE_LARAVEL_ADDRESS;
</script>

<template>
  <div class="animals">
    <img
      v-for="animal in animals"
      :key="animal.id"
      style="width: 30px"
      class="animal"
      :src="laravel_storage + '/images/' + animal.type.image"
      :id="animal.type.type"
      @click="this.$emit('getDescription', animal)"
      :alt="animal.type.type"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import Animal from "@/types/Animal";

export default defineComponent({
  name: "AnimalsList",
  props: {
    animals: {
      type: null as PropType<Animal[]> | null,
      required: true,
    },
  },
});
</script>

<style scoped></style>
