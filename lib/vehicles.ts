export type VehicleCategory = "Economy" | "Sedan" | "SUV" | "Luxury" | "Sports";

export type Vehicle = {
  slug: string;
  name: string;
  year: number;
  category: VehicleCategory;
  seats: number;
  doors: number;
  transmission: string;
  fuel: string;
  airConditioning: boolean;
  mileage: string;
  daily: number;
  weekly: number;
  monthly: number;
  image: string;
  popular: number;
  description: string;
  features: string[];
};

// All values below are fictional demonstration data, not live inventory or offers.
export const vehicles: Vehicle[] = [
  {
    slug: "monaco-executive",
    name: "Monaco Executive",
    year: 2025,
    category: "Sedan",
    seats: 5,
    doors: 4,
    transmission: "Automatic",
    fuel: "Petrol",
    airConditioning: true,
    mileage: "Unlimited*",
    daily: 420,
    weekly: 2_650,
    monthly: 8_900,
    image: "/images/car-sedan.jpg",
    popular: 1,
    description:
      "A composed, comfortable executive sedan for discovering the city or arriving in style. Demonstration vehicle details are illustrative.",
    features: ["Leather interior", "Navigation", "Cruise control", "Bluetooth"],
  },
  {
    slug: "riviera-grand-tourer",
    name: "Riviera Grand Tourer",
    year: 2025,
    category: "Luxury",
    seats: 4,
    doors: 2,
    transmission: "Automatic",
    fuel: "Petrol",
    airConditioning: true,
    mileage: "Unlimited*",
    daily: 1_150,
    weekly: 7_250,
    monthly: 24_900,
    image: "/images/dubai-hero.jpg",
    popular: 2,
    description:
      "Sculpted grand-touring lines and effortless long-distance comfort, imagined for the open road beyond the city.",
    features: ["Panoramic roof", "Premium sound", "Navigation", "Adaptive cruise"],
  },
  {
    slug: "desert-pearl-suv",
    name: "Desert Pearl SUV",
    year: 2025,
    category: "SUV",
    seats: 7,
    doors: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    airConditioning: true,
    mileage: "Unlimited*",
    daily: 690,
    weekly: 4_350,
    monthly: 14_900,
    image: "/images/car-suv.jpg",
    popular: 3,
    description:
      "Room to bring everyone along, with a refined cabin and an elevated view across the city.",
    features: ["7-seat cabin", "Rear camera", "Navigation", "Dual-zone climate"],
  },
  {
    slug: "rouge-performance",
    name: "Rouge Performance",
    year: 2025,
    category: "Sports",
    seats: 2,
    doors: 2,
    transmission: "Automatic",
    fuel: "Petrol",
    airConditioning: true,
    mileage: "Unlimited*",
    daily: 1_490,
    weekly: 9_300,
    monthly: 31_500,
    image: "/images/car-sport.jpg",
    popular: 4,
    description:
      "A low-slung, spirited coupe made for memorable arrivals and an engaging drive through the city.",
    features: ["Sport mode", "Leather interior", "Parking sensors", "Bluetooth"],
  },
  {
    slug: "rive-city",
    name: "Rive City",
    year: 2024,
    category: "Economy",
    seats: 5,
    doors: 4,
    transmission: "Automatic",
    fuel: "Petrol",
    airConditioning: true,
    mileage: "Unlimited*",
    daily: 185,
    weekly: 1_160,
    monthly: 3_950,
    image: "/images/car-sedan.jpg",
    popular: 5,
    description:
      "An easygoing city companion with a practical cabin and reassuring everyday comfort.",
    features: ["Bluetooth", "Rear camera", "USB connection", "Air conditioning"],
  },
  {
    slug: "atlas-family-suv",
    name: "Atlas Family SUV",
    year: 2024,
    category: "SUV",
    seats: 5,
    doors: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    airConditioning: true,
    mileage: "Unlimited*",
    daily: 360,
    weekly: 2_260,
    monthly: 7_650,
    image: "/images/car-suv.jpg",
    popular: 6,
    description:
      "A versatile SUV with generous space for family plans, shopping days and longer drives.",
    features: ["Spacious boot", "Rear camera", "Cruise control", "Bluetooth"],
  },
  {
    slug: "rive-noir-sedan",
    name: "Rive Noir Sedan",
    year: 2025,
    category: "Sedan",
    seats: 5,
    doors: 4,
    transmission: "Automatic",
    fuel: "Petrol",
    airConditioning: true,
    mileage: "Unlimited*",
    daily: 285,
    weekly: 1_790,
    monthly: 6_100,
    image: "/images/car-sedan.jpg",
    popular: 7,
    description:
      "A quietly confident sedan with a welcoming cabin and an elegant profile.",
    features: ["Leather interior", "Parking sensors", "Navigation", "Bluetooth"],
  },
  {
    slug: "celeste-coupe",
    name: "Céleste Coupe",
    year: 2025,
    category: "Sports",
    seats: 2,
    doors: 2,
    transmission: "Automatic",
    fuel: "Petrol",
    airConditioning: true,
    mileage: "Unlimited*",
    daily: 980,
    weekly: 6_150,
    monthly: 20_900,
    image: "/images/car-sport.jpg",
    popular: 8,
    description:
      "A dramatic coupe with a driver-focused cockpit, created for a more expressive Dubai stay.",
    features: ["Sport mode", "Premium sound", "Navigation", "Parking sensors"],
  },
];

export function getVehicle(slug: string) {
  return vehicles.find((vehicle) => vehicle.slug === slug);
}
