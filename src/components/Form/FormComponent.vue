<template>
  <form
    class="popup"
    id="form"
    v-on:submit.prevent="submitForm"
  >
    <div class="popup-content">
      <h2>Введите имя для своего животного "{{ creatingAnimal.type }}"</h2>
      <input
        placeholder="Ввведите имя животного"
        id="name"
        v-model="form.name"
        type="text"
        class="field"
        required
      />
      <button type="submit">Завести животного</button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Type from "@/types/Type";
import AnimalsDataService from "@/services/AnimalsDataService";

export default defineComponent({
  name: "FormComponent",
  data() {
    return {
      form: {
        name: "",
      },
    };
  },
  props: {
    creatingAnimal: {
      type: null as PropType<Type> | null,
      required: true,
    },
  },
  methods: {
    submitForm: function () {
      this.createAnimal(this.creatingAnimal);
      this.form.name = "";
    },
    createAnimal: async function (creatingAnimal: Type | null) {
      await AnimalsDataService.create({
        animal_type_id: creatingAnimal?.id,
        name: this.form.name,
      });
      this.$emit("created");
    },
  },
});
</script>
