import axiosInstance from "@/lib/axiosConfig";

class ImagesService {
  api: any;
  constructor(baseURL = "/api/images") {
    this.api = axiosInstance(baseURL);
  }

  async removeOne(imageId: string, public_id: string) {
    return (await this.api.delete(`/${imageId}?public_id=${public_id}`)).data;
  }
}

const imagesService = new ImagesService();

export default imagesService;
