<script setup lang="ts">
import "./scss/style.scss";
import FormComponent from "@/components/Form/FormComponent.vue";
import DescriptionComponent from "@/components/Description/DescriptionComponent.vue";
import AnimalsList from "@/components/Animals/AnimalsList.vue";
</script>
<template>
  <div class="dashboard">
    <MenuComponent
      :animals="animals"
      :types="types"
      @createAnimal="openCreateAnimalPopup"
    ></MenuComponent>
    <AnimalsList :animals="animals" @getDescription="getDescription" />
    <DescriptionComponent :info="info" />
  </div>
  <FormComponent
    v-if="creatingAnimal"
    :creatingAnimal="creatingAnimal"
    @created="animalCreated"
  />
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
import MenuComponent from "@/components/Menu/MenuComponent.vue";
export default defineComponent({
  name: "test-app",
  components: { MenuComponent },
  data() {
    return {
      Echo: null as Echo | null,
      Pusher: Pusher,
      animals: [] as Animal[],
      types: [] as Type[],
      isActive: false,
      currentAnimal: undefined as number | undefined,
      info: null as Animal | null,
      creatingAnimal: null as Type | null,
    };
  },
  methods: {
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
    animalCreated: function () {
      this.creatingAnimal = null;
      this.refreshData();
    },
    refreshData: function () {
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
    this.refreshData();
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
