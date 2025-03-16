import axiosInstance from "@/lib/axiosConfig";
import { UploadedImageDto } from "@/types/dto/image.dto";

class ImagesService {
  api: any;
  constructor(baseURL = "/api/images") {
    this.api = axiosInstance(baseURL);
  }

  async uploadOne(body: UploadedImageDto) {
    return (await this.api.post(`/`, body)).data;
  }

  async removeOne(imageId: string, public_id: string) {
    return (await this.api.delete(`/${imageId}?public_id=${public_id}`)).data;
  }
}

const imagesService = new ImagesService();

export default imagesService;
