import axiosInstance from "@/lib/axiosConfig";
import { BillDtoDashboardCreate } from "@/types/dto/bill.dto";

class BillsService {
  private api: any;
  constructor(baseUrl = "/api/bills") {
    this.api = axiosInstance(baseUrl);
  }

  // async getAll() {
  //   try {
  //     return (await this.api.get("/")).data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  //Create A Bill
  async createOneDashboard(data: BillDtoDashboardCreate) {
    return (await this.api.post(`/payment`, data)).data;
  }
}

const billsService = new BillsService();

export default billsService;
