<script setup lang="ts">
import "./scss/style.scss";
const laravel_storage = import.meta.env.VITE_LARAVEL_ADDRESS;
</script>
<template>
  <div class="dashboard">
    <div :class="['container', isActive ? 'active' : '']" id="container">
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
      <div class="menu-group">
        <div
          v-for="type in types"
          :key="type.id"
          class="menu-item"
          :class="isExist(type) ? 'disabled' : ''"
          @click="
            isExist(type) ? updateAnimal(type.id) : openCreateAnimalPopup(type)
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
    <div class="content">
      <div class="animals">
        <img
          v-for="animal in animals"
          :key="animal.id"
          style="width: 30px"
          class="animal"
          :src="laravel_storage + '/images/' + animal.type.image"
          :id="animal.type.type"
          @click="getDescription(animal)"
          :alt="animal.type.type"
        />
      </div>
      <div class="description" v-if="info">
        <span class="description-text">
          {{ info?.type.type }} {{ info?.name }},
          {{ Math.floor(info?.age) + formatAgeString(info?.age) }},
          размер {{ info?.size }}
        </span>
      </div>
    </div>
  </div>
  <form
    class="popup"
    id="form"
    v-if="creatingAnimal"
    v-on:submit="submitForm"
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
import { defineComponent } from "vue";
import AnimalsDataService from "@/services/AnimalsDataService";
import type Animal from "@/types/Animal";
import type Type from "@/types/Type";
import type AnimalsResponse from "@/types/AnimalsResponse";
import type TypesResponse from "@/types/TypesResponse";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
export default defineComponent({
  name: "test-app",
  data() {
    return {
      Echo: null as Echo | null,
      Pusher: Pusher,
      animals: [] as Animal[],
      types: [] as Type[],
      isActive: false,
      currentAnimal: undefined as number | undefined,
      info: null as Animal | null,
      form: {
        name: "",
      },
      creatingAnimal: null as Type | null,
    };
  },
  methods: {
    isExist: function (type: { id: number }) {
      return this.animals.find((animal: Animal) => animal.type.id === type.id);
    },
    retrieveAnimals: function () {
      AnimalsDataService.getAll()
        .then((response: AnimalsResponse) => {
          this.animals = response.data.data;
          this.calculateSize(this.animals);
        })
        .catch((e: Error) => {
          console.log(e);
        });
    },
    openCreateAnimalPopup: function (type: Type) {
      this.creatingAnimal = type;
    },
    createAnimal: async function (creatingAnimal: Type | null) {
      await AnimalsDataService.create({
        animal_type_id: creatingAnimal?.id,
        name: this.form.name,
      });
      this.retrieveAnimals();
      this.retrieveTypes();
      this.calculateSize(this.animals);
    },
    retrieveTypes: function () {
      AnimalsDataService.getTypes()
        .then((response: TypesResponse) => {
          this.types = response.data.data;
        })
        .catch((e: Error) => {
          console.log(e);
        });
    },
    getDescription: async function (animal: Animal) {
      this.currentAnimal = animal.id;
      this.info = animal;
    },
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
    updateAnimal: function (typeId: number) {
      const animal = this.animals.find((animal) => animal.type.id === typeId);
      AnimalsDataService.patch(animal?.id);
    },
    submitForm: function (payload: Event) {
      payload.preventDefault();
      this.createAnimal(this.creatingAnimal);
      this.creatingAnimal = null;
      this.form.name = "";
    },
    switchActive: function () {
      const { isActive: isActive } = this;
      if (isActive) {
        this.isActive = !this.isActive;
      } else {
        this.isActive = !this.isActive;
      }
    },
    updateInfo: function (currentAnimal?: number) {
      this.info = this.animals.find(
        (animal) => animal.id === currentAnimal
      ) as Animal;
    },
    calculateSize: function (animals: Animal[]) {
      const maxWidth: number = 240;
      setTimeout(() => {
        animals.map((animal) => {
          const size =
            animal.size == 0 ||
            Math.floor(
              ((maxWidth * animal.size) / animal.type.max_size) *
                Number(animal.type.growing_factor)
            ) < 30
              ? "30"
              : Math.floor(
                  ((maxWidth * animal.size) / animal.type.max_size) *
                    Number(animal.type.growing_factor)
                ) > 240
              ? 240
              : Math.floor(
                  ((maxWidth * animal.size) / animal.type.max_size) *
                    Number(animal.type.growing_factor)
                );
          document
            .getElementById(animal.type.type)
            ?.setAttribute("style", `width: ${size}px`);
        });
      }, 1);
    },
  },
  async mounted() {
    this.retrieveAnimals();
    this.retrieveTypes();
    console.log(import.meta.env.VITE_LARAVEL_ADDRESS);
    this.Echo = new Echo({
      broadcaster: "pusher",
      key: import.meta.env.VITE_ABLY_KEY,
      cluster: "eu",
      wsHost: import.meta.env.VITE_ABLY_HOST,
      wsPort: 80,
      disableStats: true,
      encrypted: true,
    });
    this.Echo.channel("public.animals")
      .subscribed(() => {
        console.log("You are subscribed");
      })
      .listen(".animal.AgeUp", (data: any) => {
        this.animals = this.animals.map((animal) => {
          if (animal.id == data.animal.id) {
            animal = {
              ...animal,
              age: data.animal.age,
              size: data.animal.size,
            };
          }
          return animal;
        });
        this.updateInfo(this.currentAnimal);
        this.calculateSize(this.animals);
      })
      .listen(".animal.Kill", (data: any) => {
        AnimalsDataService.delete(data.animal.id);
        this.animals = this.animals.filter((animal) => {
          return animal.id != data.animal.id;
        });
      });
  },
});
</script>
