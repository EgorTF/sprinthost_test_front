import Animal from "@/types/Animal";

export default interface AnimalsResponse {
  data: {
    data: Animal[];
  };
}
