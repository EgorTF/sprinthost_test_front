<template>
  <div :class="['description', info ? 'active' : '']">
    <span class="description-text">
      {{ info?.type.type }} {{ info?.name }},
      {{ Math.floor(info?.age) + formatAgeString(info?.age) }}, размер
      {{ info?.size }}
    </span>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import Animal from "@/types/Animal";

export default defineComponent({
  name: "DescriptionComponent",
  props: {
    info: {
      type: null as PropType<Animal> | null,
      required: true,
    },
  },
  methods: {
    formatAgeString: function (age: number) {
      age = Math.floor(age);
      if (age == 1) {
        return " год";
      } else if (age <= 4 && age > 1) {
        return " года";
      } else {
        return " лет";
      }
    },
  }
});
</script>

<style scoped></style>
