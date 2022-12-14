import http from "@/http/http-common";

class AnimalsDataService {
  getAll(): Promise<any> {
    return http.get("/animals");
  }
  getTypes(): Promise<any> {
    return http.get("/animals/types");
  }
  create(data: any): Promise<any> {
    return http.post("/animals", data);
  }

  patch(id: any): Promise<any> {
    return http.patch(`/animals/${id}`);
  }

  delete(id: any): Promise<any> {
    return http.delete(`/animals/${id}`);
  }
}

export default new AnimalsDataService();
