
"use client";

export interface Product {
  id: number;
  title: string;
  name?: string;
  category: string;
  type: "para" | "herbal";
  price: number;
  oldPrice?: number;
  originalPrice?: number;
  image: string;
  isNew?: boolean;
  description?: string;
  rating?: number;
  reviews?: number;
}

const brands = ["La Roche-Posay", "Vichy", "CeraVe", "Bioderma", "Nuxe", "Avène", "Mustela", "Eucerin", "SVR", "Filorga"];
const herbalBrands = ["BioOriental", "Atlas Herbs", "NatureBio", "ArganOil", "HerboristerieDuMaroc", "RacinesPure", "GreenLife"];

const paraTypes = ["Crème Hydratante", "Gel Nettoyant", "Sérum Anti-âge", "Ecran Solaire SPF50+", "Shampoing Fortifiant", "Lotion Tonique", "Eau Micellaire", "Baume Réparateur"];
const herbalTypes = ["Huile d'Argan Pure", "Miel d'Eucalyptus", "Tisane Digestion", "Savon Noir Beldi", "Ghassoul Naturel", "Huile de Pépin de Figue", "Gingembre Moulu", "Safran Taliouine"];

const paraCategories = ["Visage", "Corps", "Cheveux", "Hygiène", "Solaire", "Bébé & Maman"];
const herbalCategories = ["Huiles Essentielles", "Tisanes & Infusions", "Miel & Ruche", "Cosmétique Bio", "Compléments Bio"];

const productImages = [
  "/products1.png",
  "/products2.png",
  "/products3.png",
  "/products4.png",
  "/products5.png",
  "/products6.png",
  "/products7.png",
  "/products8.png",
  "/products9.png",
  "/products10.png",
  "/products11.png",
  "/products12.png",
  "/products13.png",
  "/products14.png",
  "/products15.png",
  "/products16.png",
  "/products17.png",
  "/products18.png",
  "/products19.png",
  "/products20.png",
  "/products21.png",
  "/products22.png",
  "/products23.png",
  "/products24.png",
];

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

export const mockProducts: Product[] = [
  {
    id: 1,
    title: "La Roche-Posay Crème Hydratante Visage - 50ml",
    category: "Visage",
    type: "para",
    price: 150.99,
    oldPrice: 180.99,
    image: "/products1.png",
    isNew: true
  },
  {
    id: 2,
    title: "Vichy Gel Nettoyant - 200ml",
    category: "Hygiène",
    type: "para",
    price: 89.99,
    image: "/products2.png",
    isNew: false
  },
  {
    id: 3,
    title: "CeraVe Sérum Anti-âge - 30ml",
    category: "Visage",
    type: "para",
    price: 199.99,
    oldPrice: 249.99,
    image: "/products3.png",
    isNew: false
  },
  {
    id: 4,
    title: "Bioderma Ecran Solaire SPF50+ - 100ml",
    category: "Solaire",
    type: "para",
    price: 129.99,
    image: "/products4.png",
    isNew: true
  },
  {
    id: 5,
    title: "Nuxe Shampoing Fortifiant - 250ml",
    category: "Cheveux",
    type: "para",
    price: 79.99,
    oldPrice: 99.99,
    image: "/products5.png",
    isNew: false
  },
  {
    id: 6,
    title: "Avène Lotion Tonique - 200ml",
    category: "Visage",
    type: "para",
    price: 109.99,
    image: "/products6.png",
    isNew: false
  },
  {
    id: 7,
    title: "Mustela Eau Micellaire - 500ml",
    category: "Bébé & Maman",
    type: "para",
    price: 69.99,
    oldPrice: 89.99,
    image: "/products7.png",
    isNew: false
  },
  {
    id: 8,
    title: "Eucerin Baume Réparateur - 150ml",
    category: "Corps",
    type: "para",
    price: 139.99,
    image: "/products8.png",
    isNew: true
  },
  {
    id: 9,
    title: "SVR Crème Hydratante Corps - 400ml",
    category: "Corps",
    type: "para",
    price: 119.99,
    oldPrice: 149.99,
    image: "/products9.png",
    isNew: false
  },
  {
    id: 10,
    title: "Filorga Masque Visage - 50ml",
    category: "Visage",
    type: "para",
    price: 189.99,
    image: "/products10.png",
    isNew: false
  },
  {
    id: 11,
    title: "BioOriental Huile d'Argan Pure - 100ml",
    category: "Huiles Essentielles",
    type: "herbal",
    price: 89.99,
    oldPrice: 119.99,
    image: "/products11.png",
    isNew: true
  },
  {
    id: 12,
    title: "Atlas Herbs Tisane Digestion - 50g",
    category: "Tisanes & Infusions",
    type: "herbal",
    price: 49.99,
    image: "/products12.png",
    isNew: false
  },
  {
    id: 13,
    title: "NatureBio Miel d'Eucalyptus - 250g",
    category: "Miel & Ruche",
    type: "herbal",
    price: 79.99,
    oldPrice: 99.99,
    image: "/products13.png",
    isNew: false
  },
  {
    id: 14,
    title: "ArganOil Savon Noir Beldi - 150g",
    category: "Cosmétique Bio",
    type: "herbal",
    price: 39.99,
    image: "/products14.png",
    isNew: true
  },
  {
    id: 15,
    title: "HerboristerieDuMaroc Ghassoul Naturel - 200g",
    category: "Cosmétique Bio",
    type: "herbal",
    price: 59.99,
    oldPrice: 79.99,
    image: "/products15.png",
    isNew: false
  },
  {
    id: 16,
    title: "RacinesPure Huile de Pépin de Figue - 50ml",
    category: "Huiles Essentielles",
    type: "herbal",
    price: 129.99,
    image: "/products16.png",
    isNew: false
  },
  {
    id: 17,
    title: "GreenLife Gingembre Moulu - 100g",
    category: "Tisanes & Infusions",
    type: "herbal",
    price: 34.99,
    oldPrice: 44.99,
    image: "/products17.png",
    isNew: false
  },
  {
    id: 18,
    title: "BioOriental Safran Taliouine - 5g",
    category: "Tisanes & Infusions",
    type: "herbal",
    price: 299.99,
    image: "/products18.png",
    isNew: true
  },
  {
    id: 19,
    title: "Atlas Herbs Compléments Bio - 60 capsules",
    category: "Compléments Bio",
    type: "herbal",
    price: 149.99,
    oldPrice: 189.99,
    image: "/products19.png",
    isNew: false
  },
  {
    id: 20,
    title: "NatureBio Huiles Essentielles Mix - 10ml",
    category: "Huiles Essentielles",
    type: "herbal",
    price: 199.99,
    image: "/products20.png",
    isNew: false
  },
  {
    id: 21,
    title: "BioPara Huile Essentielle Lavande - 10ml",
    category: "Huiles Essentielles",
    type: "herbal",
    price: 79.99,
    image: "/products21.png",
    isNew: false
  },
  {
    id: 22,
    title: "Herbal Tea Collection - 100g",
    category: "Tisanes & Infusions",
    type: "herbal",
    price: 59.99,
    oldPrice: 79.99,
    image: "/products22.png",
    isNew: true
  },
  {
    id: 23,
    title: "Organic Honey Blend - 500g",
    category: "Miel & Ruche",
    type: "herbal",
    price: 149.99,
    image: "/products23.png",
    isNew: false
  },
  {
    id: 24,
    title: "Natural Soap Bar - 200g",
    category: "Cosmétique Bio",
    type: "herbal",
    price: 49.99,
    oldPrice: 69.99,
    image: "/products24.png",
    isNew: false
  }
];
