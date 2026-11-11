import { Locale } from "@/lib/translations";
import { Vehicle, VehicleCategory } from "@/lib/vehicles";

const categories: Record<Locale, Record<VehicleCategory, string>> = {
  en: {
    Economy: "Economy",
    Sedan: "Sedan",
    SUV: "SUV",
    Luxury: "Luxury",
    Sports: "Sports car",
  },
  fr: {
    Economy: "Économique",
    Sedan: "Berline",
    SUV: "SUV",
    Luxury: "Luxe",
    Sports: "Sportive",
  },
  ar: {
    Economy: "اقتصادية",
    Sedan: "سيدان",
    SUV: "دفع رباعي",
    Luxury: "فاخرة",
    Sports: "رياضية",
  },
};

const featureLabels: Record<Locale, Record<string, string>> = {
  en: {
    "Leather interior": "Leather interior",
    Navigation: "Navigation",
    "Cruise control": "Cruise control",
    Bluetooth: "Bluetooth",
    "Panoramic roof": "Panoramic roof",
    "Premium sound": "Premium sound",
    "Adaptive cruise": "Adaptive cruise",
    "7-seat cabin": "7-seat cabin",
    "Rear camera": "Rear camera",
    "Dual-zone climate": "Dual-zone climate",
    "Sport mode": "Sport mode",
    "Parking sensors": "Parking sensors",
    "USB connection": "USB connection",
    "Air conditioning": "Air conditioning",
    "Spacious boot": "Spacious boot",
  },
  fr: {
    "Leather interior": "Intérieur cuir",
    Navigation: "Navigation",
    "Cruise control": "Régulateur de vitesse",
    Bluetooth: "Bluetooth",
    "Panoramic roof": "Toit panoramique",
    "Premium sound": "Système audio premium",
    "Adaptive cruise": "Régulateur adaptatif",
    "7-seat cabin": "Habitacle 7 places",
    "Rear camera": "Caméra de recul",
    "Dual-zone climate": "Climatisation bi-zone",
    "Sport mode": "Mode sport",
    "Parking sensors": "Capteurs de stationnement",
    "USB connection": "Connexion USB",
    "Air conditioning": "Climatisation",
    "Spacious boot": "Grand coffre",
  },
  ar: {
    "Leather interior": "مقصورة جلدية",
    Navigation: "نظام ملاحة",
    "Cruise control": "مثبت سرعة",
    Bluetooth: "بلوتوث",
    "Panoramic roof": "سقف بانورامي",
    "Premium sound": "نظام صوت متميز",
    "Adaptive cruise": "مثبت سرعة متكيف",
    "7-seat cabin": "مقصورة بسبعة مقاعد",
    "Rear camera": "كاميرا خلفية",
    "Dual-zone climate": "تكييف ثنائي المناطق",
    "Sport mode": "وضع رياضي",
    "Parking sensors": "حساسات ركن",
    "USB connection": "منفذ USB",
    "Air conditioning": "تكييف",
    "Spacious boot": "صندوق واسع",
  },
};

const descriptions: Record<Locale, Record<VehicleCategory, string>> = {
  en: {
    Economy: "An easygoing city companion with a practical cabin and reassuring everyday comfort.",
    Sedan: "A composed, comfortable sedan for discovering the city or arriving in style.",
    SUV: "Room to bring everyone along, with an elevated view across the city.",
    Luxury: "Sculpted grand-touring lines and effortless comfort, imagined for the open road.",
    Sports: "A spirited coupe made for memorable arrivals and an engaging city drive.",
  },
  fr: {
    Economy: "Une citadine facile à vivre, avec un habitacle pratique et un confort appréciable au quotidien.",
    Sedan: "Une berline confortable et élégante pour découvrir la ville ou arriver avec style.",
    SUV: "De l’espace pour voyager ensemble et une vue dégagée sur la ville.",
    Luxury: "Une silhouette de grand tourisme et un confort remarquable pour prendre la route.",
    Sports: "Un coupé dynamique pour des arrivées mémorables et une conduite engageante.",
  },
  ar: {
    Economy: "سيارة مدينة عملية ومريحة للاستخدام اليومي.",
    Sedan: "سيارة سيدان مريحة وأنيقة لاكتشاف المدينة والوصول بأسلوب مميز.",
    SUV: "مساحة واسعة للجميع وإطلالة مرتفعة على المدينة.",
    Luxury: "تصميم أنيق وراحة فائقة للرحلات الطويلة.",
    Sports: "سيارة كوبيه رياضية لوصول مميز وتجربة قيادة ممتعة.",
  },
};

export function vehicleCategory(locale: Locale, category: VehicleCategory) {
  return categories[locale][category];
}

export function vehicleDescription(locale: Locale, vehicle: Vehicle) {
  return descriptions[locale][vehicle.category];
}

export function vehicleFeatures(locale: Locale, vehicle: Vehicle) {
  return vehicle.features.map((feature) => featureLabels[locale][feature] ?? feature);
}
