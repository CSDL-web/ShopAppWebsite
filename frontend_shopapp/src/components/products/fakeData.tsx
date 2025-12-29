export type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
  image: string;
};

export const products: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `Sample Product ${i + 1}`,
  price: Number((Math.random() * 100 + 10).toFixed(2)),
  rating: Math.floor(Math.random() * 5) + 1,
  image: "https://via.placeholder.com/225x250",
}));
