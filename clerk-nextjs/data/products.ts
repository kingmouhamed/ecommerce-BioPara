
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

export const generateMockProducts = (): Product[] => {
  const products: Product[] = [];
  let idCounter = 1;

  for (let i = 0; i < 150; i++) {
    const brand = randomItem(brands);
    const type = randomItem(paraTypes);
    products.push({
      id: idCounter++,
      title: `${brand} ${type} - ${randomInt(50, 400)}ml`,
      category: randomItem(paraCategories),
      type: "para",
      price: parseFloat((Math.random() * 300 + 50).toFixed(2)),
      oldPrice: Math.random() > 0.5 ? parseFloat((Math.random() * 100 + 350).toFixed(2)) : undefined,
      image: randomItem(productImages),
      isNew: Math.random() > 0.8
    });
  }

  for (let i = 0; i < 150; i++) {
    const brand = randomItem(herbalBrands);
    const type = randomItem(herbalTypes);
    products.push({
      id: idCounter++,
      title: `${type} ${brand} - ${randomInt(100, 500)}g`,
      category: randomItem(herbalCategories),
      type: "herbal",
      price: parseFloat((Math.random() * 200 + 30).toFixed(2)),
      oldPrice: Math.random() > 0.3 ? parseFloat((Math.random() * 50 + 230).toFixed(2)) : undefined,
      image: randomItem(productImages),
      isNew: Math.random() > 0.8
    });
  }

  return products;
};

export const mockProducts = generateMockProducts();
