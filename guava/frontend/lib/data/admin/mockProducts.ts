import { Product } from "@/lib/data/products";

let seededProducts: Record<string, Product[]> = {};

function createSeed(base: string) {
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }
  return function () {
    hash = (hash * 9301 + 49297) % 233280;
    return (hash + 233280) % 233280 / 233280;
  };
}

export function generateStableProducts(slug: string, count: number, baseProducts: Product[] = []): Product[] {
  if (seededProducts[slug]) return seededProducts[slug];

  const seededRandom = createSeed(slug);
  const brands = ["hp", "dell", "lenovo", "apple", "acer", "asus", "microsoft"];
  const processors = ["Intel Core i5", "Intel Core i7", "Intel Core Ultra 5", "Intel Core Ultra 7", "Intel Core i3"];
  const rams = ["8 GB", "16 GB", "32 GB"];
  const storages = ["256 GB", "512 GB", "1TB"];
  const screens = ["13.6 Inch", "14 Inch", "15.6 Inch", "16 Inch", "17 Inch"];
  const types = ["Business", "Gaming", "Work", "Premium"];
  const generations = ["Gen 11", "Gen 12", "Gen 13", "Gen 14", "Gen 15"];
  const cpuManufacturers = ["Intel", "AMD", "Apple"];
  const cpuSpeeds = ["2.4 GHz", "3.0 - 4.0 GHz", "4.1 - 5.0 GHz", "5.1 - 6.0 GHz"];
  const graphics = ["No Dedicated graphics", "Nvidia GeForce GTX Series", "Nvidia GeForce RTX Series"];

  seededProducts[slug] = Array.from({ length: count }, (_, i) => {
    const baseId = baseProducts.length + i + 1;
    const brand = brands[i % brands.length];
    const price = 40000 + seededRandom() * 150000;
    const originalPrice = price * 1.3;

    return {
      id: `${slug}-${baseId}`,
      name: `${brand.toUpperCase()} ${slug.replace(/-/g, " ")} ${baseId}`,
      price: Math.round(price),
      originalPrice: Math.round(originalPrice),
      discount: Math.round(((originalPrice - price) / originalPrice) * 100),
      rating: 4 + seededRandom(),
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
      category: slug.replace(/-/g, " "),
      brand,
      hot: seededRandom() > 0.5,
      stock: Math.floor(seededRandom() * 20) + 1,
      ratingCount: Math.floor(seededRandom() * 500) + 50,
      processor: processors[i % processors.length],
      ram: rams[i % rams.length],
      storage: storages[i % storages.length],
      screen: screens[i % screens.length],
      os: "Windows 11 Home",
      generation: generations[i % generations.length],
      type: types[i % types.length],
      cpuManufacturer: cpuManufacturers[i % cpuManufacturers.length],
      cpuSpeed: cpuSpeeds[i % cpuSpeeds.length],
      graphics: graphics[i % graphics.length],
    };
  });

  return seededProducts[slug];
}

