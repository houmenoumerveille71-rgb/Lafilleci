export interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
  description?: string;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Robe Nuit de Soie",
    price: "1,200 $",
    category: "Habits de Sortie",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop"
  },
  {
    id: 2,
    name: "Ensemble Sport Intense",
    price: "1,200 $",
    category: "Tenues de Sport",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop"
  },
  {
    id: 3,
    name: "Crop-Top Crochet Artisanal",
    price: "1,300 $",
    category: "Tenues en Crochet",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop"
  },
  {
    id: 4,
    name: "Blazer de Tailleur",
    price: "1,580 $",
    category: "Habits de Sortie",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop"
  }
];
