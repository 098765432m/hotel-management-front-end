export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  location: {
    street: string;
    ward: string;
    city: string;
  };
  image_url: string;
}
