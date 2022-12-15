<script setup lang="ts">
const laravel_storage = import.meta.env.VITE_LARAVEL_ADDRESS;
</script>
<template>
  <div :class="['menu', isActive ? 'active' : '']" id="container">
    <MenuButton :isActive="isActive" @switch="getActive" />
    <div class="menu-group">
      <div
        v-for="type in types"
        :key="type.id"
        class="menu-item"
        :class="isExist(type) ? 'disabled' : ''"
        @click="
          isExist(type)
            ? updateAnimal(type.id)
            : this.$emit('createAnimal', type)
        "
      >
        <img
          class="icon"
          :src="laravel_storage + type.image"
          :alt="type.type"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type Type from "@/types/Type";
import MenuButton from "@/components/Menu/MenuButton.vue";
import Animal from "@/types/Animal";
import AnimalsDataService from "@/services/AnimalsDataService";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "MenuComponent",
  components: { MenuButton },
  data() {
    return {
      isActive: false,
    };
  },
  props: {
    types: {
      type: [] as PropType<Type[]>,
      required: true,
    },
    animals: {
      type: [] as PropType<Animal[]>,
      required: true,
    },
  },
  methods: {
    getActive(isActive: boolean) {
      this.isActive = isActive;
    },
    isExist: function (type: { id: number }) {
      return this.animals.find((animal: Animal) => animal.type.id === type.id);
    },
    updateAnimal: function (typeId: number) {
      const animal = this.animals.find(
        (animal: Animal) => animal.type.id === typeId
      );
      AnimalsDataService.patch(animal?.id);
    },
  },
});
</script>
