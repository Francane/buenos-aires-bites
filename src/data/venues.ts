import { Venue } from '@/types/venue';

export const venues: Venue[] = [
  {
    id: '1', name: 'Don Julio', description: 'Icónica parrilla de Palermo con las mejores carnes maduradas de Buenos Aires. Experiencia premium y bodega excepcional.', address: 'Guatemala 4699, Palermo', neighborhood: 'Palermo', hours: 'Mar-Dom 12:00–16:00, 19:30–01:00', cuisine: 'Parrilla', rating: 4.8, reviewCount: 2340, imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600', isOpen: true,
    coordinates: { lat: -34.5862, lng: -58.4253 }, tags: ['premium', 'carnes', 'vinos'], reservationInfo: 'Reservar con anticipación', priceRange: 4, featured: true,
    reviews: [{ id: 'r1', author: 'María G.', content: 'La mejor parrilla de Buenos Aires, sin dudas.', platform: 'google', rating: 5 }, { id: 'r2', author: 'foodie_ba', content: 'El ojo de bife es increíble', platform: 'tiktok', rating: 5 }],
  },
  {
    id: '2', name: 'El Preferido de Palermo', description: 'Bodegón histórico con más de 70 años. Cocina porteña clásica en un ambiente nostálgico.', address: 'Borges 2108, Palermo', neighborhood: 'Palermo', hours: 'Lun-Sáb 12:00–15:30, 20:00–00:00', cuisine: 'Bodegón', rating: 4.5, reviewCount: 1890, imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600', isOpen: true,
    coordinates: { lat: -34.5880, lng: -58.4310 }, tags: ['histórico', 'bodegón', 'porteño'], priceRange: 2,
  },
  {
    id: '3', name: 'Café Tortoni', description: 'El café más emblemático de Buenos Aires, fundado en 1858. Patrimonio cultural y gastronómico.', address: 'Av. de Mayo 825, Monserrat', neighborhood: 'Monserrat', hours: 'Lun-Dom 08:00–22:00', cuisine: 'Café', rating: 4.3, reviewCount: 5600, imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600', isOpen: true,
    coordinates: { lat: -34.6092, lng: -58.3805 }, tags: ['histórico', 'café', 'turístico', 'tango'], priceRange: 2, featured: true,
    reviews: [{ id: 'r3', author: 'Carlos M.', content: 'Imperdible para tomar un café con historia.', platform: 'google', rating: 4 }],
  },
  {
    id: '4', name: 'La Cabrera', description: 'Parrilla de autor en Palermo con guarniciones espectaculares y cortes de exportación.', address: 'Cabrera 5099, Palermo', neighborhood: 'Palermo', hours: 'Lun-Dom 12:30–16:00, 20:00–01:00', cuisine: 'Parrilla', rating: 4.6, reviewCount: 3100, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600', isOpen: false,
    coordinates: { lat: -34.5868, lng: -58.4280 }, tags: ['premium', 'carnes', 'guarniciones'], priceRange: 3,
  },
  {
    id: '5', name: 'El Cuartito', description: 'Pizzería clásica porteña desde 1934. Pizza de molde, fainá y moscato en un ambiente inigualable.', address: 'Talcahuano 937, Recoleta', neighborhood: 'Recoleta', hours: 'Lun-Dom 12:00–01:00', cuisine: 'Pizzería', rating: 4.4, reviewCount: 2800, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600', isOpen: true,
    coordinates: { lat: -34.5993, lng: -58.3868 }, tags: ['pizza', 'clásico', 'moscato'], priceRange: 1,
  },
  {
    id: '6', name: 'Sarkis', description: 'Restaurante armenio legendario de Villa Crespo. Porciones generosas y sabores del Medio Oriente.', address: 'Thames 1101, Villa Crespo', neighborhood: 'Villa Crespo', hours: 'Lun-Dom 12:00–15:30, 20:00–01:00', cuisine: 'Armenia', rating: 4.7, reviewCount: 1950, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600', isOpen: true,
    coordinates: { lat: -34.5983, lng: -58.4364 }, tags: ['armenio', 'abundante', 'económico'], priceRange: 2,
  },
  {
    id: '7', name: 'Proper', description: 'Cocina de mercado contemporánea en Palermo Hollywood. Menú de pasos con productos de estación.', address: 'Arévalo 1676, Palermo', neighborhood: 'Palermo', hours: 'Mar-Sáb 20:00–00:00', cuisine: 'Contemporánea', rating: 4.7, reviewCount: 890, imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', isOpen: false,
    coordinates: { lat: -34.5803, lng: -58.4384 }, tags: ['autor', 'estacional', 'fine dining'], reservationInfo: 'Solo con reserva', priceRange: 4,
  },
  {
    id: '8', name: 'Gran Dabbang', description: 'Cocina asiática fusión con toques porteños. Platos vibrantes, creativos y llenos de sabor.', address: 'Scalabrini Ortiz 1543, Palermo', neighborhood: 'Palermo', hours: 'Mar-Sáb 20:00–00:00', cuisine: 'Asiática fusión', rating: 4.6, reviewCount: 1200, imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600', isOpen: true,
    coordinates: { lat: -34.5928, lng: -58.4252 }, tags: ['fusión', 'asiático', 'creativo'], priceRange: 3,
  },
  {
    id: '9', name: 'Güerrín', description: 'La pizzería más famosa de Av. Corrientes. Pizza al molde y a la piedra desde 1932.', address: 'Av. Corrientes 1368, Centro', neighborhood: 'Centro', hours: 'Lun-Dom 11:00–02:00', cuisine: 'Pizzería', rating: 4.3, reviewCount: 4200, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', isOpen: true,
    coordinates: { lat: -34.6038, lng: -58.3865 }, tags: ['pizza', 'tradición', 'al paso'], priceRange: 1,
  },
  {
    id: '10', name: 'Chila', description: 'Restaurante de alta cocina en Puerto Madero con estrella Michelin. Vista al río y menú degustación.', address: 'Av. Alicia Moreau de Justo 1160, Puerto Madero', neighborhood: 'Puerto Madero', hours: 'Mar-Sáb 20:00–23:00', cuisine: 'Fine dining', rating: 4.9, reviewCount: 650, imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600', isOpen: false,
    coordinates: { lat: -34.6130, lng: -58.3630 }, tags: ['fine dining', 'michelin', 'degustación'], reservationInfo: 'Reserva obligatoria', priceRange: 4, featured: true,
  },
  {
    id: '11', name: 'El Banco Rojo', description: 'Bar notable de San Telmo con tragos clásicos y cocina de autor en un antiguo banco.', address: 'Bolívar 866, San Telmo', neighborhood: 'San Telmo', hours: 'Mar-Dom 18:00–02:00', cuisine: 'Bar', rating: 4.4, reviewCount: 1100, imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600', isOpen: true,
    coordinates: { lat: -34.6195, lng: -58.3740 }, tags: ['bar', 'cócteles', 'patrimonio'], priceRange: 2,
  },
  {
    id: '12', name: 'La Brigada', description: 'Parrilla tradicional de San Telmo. Carnes a cuchillo, vinos argentinos y ambiente tanguero.', address: 'Estados Unidos 465, San Telmo', neighborhood: 'San Telmo', hours: 'Lun-Dom 12:00–15:00, 19:30–00:00', cuisine: 'Parrilla', rating: 4.5, reviewCount: 2100, imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600', isOpen: true,
    coordinates: { lat: -34.6215, lng: -58.3766 }, tags: ['carnes', 'tango', 'tradición'], priceRange: 3,
  },
  {
    id: '13', name: 'Café de los Angelitos', description: 'Café notable con historia tanguera desde 1890. Shows de tango en vivo y gastronomía criolla.', address: 'Av. Rivadavia 2100, Balvanera', neighborhood: 'Balvanera', hours: 'Lun-Dom 07:00–01:00', cuisine: 'Café', rating: 4.2, reviewCount: 1800, imageUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600', isOpen: true,
    coordinates: { lat: -34.6095, lng: -58.3957 }, tags: ['tango', 'histórico', 'café notable'], priceRange: 2,
  },
  {
    id: '14', name: 'Osaka', description: 'Cocina nikkei de alta gama. Fusión peruano-japonesa con ingredientes premium.', address: 'Soler 5608, Palermo', neighborhood: 'Palermo', hours: 'Lun-Dom 12:30–16:00, 20:00–01:00', cuisine: 'Nikkei', rating: 4.5, reviewCount: 1500, imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600', isOpen: true,
    coordinates: { lat: -34.5822, lng: -58.4320 }, tags: ['nikkei', 'sushi', 'premium'], priceRange: 4,
  },
  {
    id: '15', name: 'Anafe', description: 'Panadería artesanal y café de especialidad en Chacarita. Pan de masa madre y brunch exquisito.', address: 'Av. Federico Lacroze 4298, Chacarita', neighborhood: 'Chacarita', hours: 'Mié-Lun 09:00–18:00', cuisine: 'Panadería', rating: 4.6, reviewCount: 780, imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600', isOpen: true,
    coordinates: { lat: -34.5845, lng: -58.4540 }, tags: ['panadería', 'masa madre', 'brunch'], priceRange: 2,
  },
  {
    id: '16', name: 'Elena', description: 'Restaurante del Four Seasons con cocina argentina refinada. Brunch icónico los domingos.', address: 'Posadas 1086, Recoleta', neighborhood: 'Recoleta', hours: 'Lun-Dom 07:00–23:00', cuisine: 'Contemporánea', rating: 4.7, reviewCount: 920, imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600', isOpen: true,
    coordinates: { lat: -34.5880, lng: -58.3850 }, tags: ['hotel', 'brunch', 'elegante'], reservationInfo: 'Reservar para brunch', priceRange: 4, featured: true,
  },
  {
    id: '17', name: 'Los Galgos', description: 'Bar notable reabierto con propuesta gastronómica contemporánea. Vermut y picadas porteñas.', address: 'Av. Callao 501, Centro', neighborhood: 'Centro', hours: 'Lun-Dom 08:00–02:00', cuisine: 'Bar', rating: 4.3, reviewCount: 1350, imageUrl: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=600', isOpen: true,
    coordinates: { lat: -34.6030, lng: -58.3925 }, tags: ['bar notable', 'vermut', 'picadas'], priceRange: 2,
  },
  {
    id: '18', name: 'El Desnivel', description: 'Parrilla económica y popular de San Telmo. Bife de chorizo legendario a precio accesible.', address: 'Defensa 855, San Telmo', neighborhood: 'San Telmo', hours: 'Lun-Dom 12:00–16:00, 19:00–01:00', cuisine: 'Parrilla', rating: 4.1, reviewCount: 3200, imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=600', isOpen: true,
    coordinates: { lat: -34.6193, lng: -58.3730 }, tags: ['económico', 'carnes', 'turístico'], priceRange: 1,
  },
  {
    id: '19', name: 'Rapanui', description: 'Heladería y chocolatería patagónica. Helados artesanales con los mejores ingredientes.', address: 'Av. Quintana 188, Recoleta', neighborhood: 'Recoleta', hours: 'Lun-Dom 10:00–23:00', cuisine: 'Heladería', rating: 4.5, reviewCount: 2000, imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600', isOpen: true,
    coordinates: { lat: -34.5883, lng: -58.3930 }, tags: ['helado', 'chocolate', 'patagónico'], priceRange: 2,
  },
  {
    id: '20', name: 'Fogón Asado', description: 'Experiencia de asado a puertas cerradas. Cena con parrillero y maridaje de vinos.', address: 'Dirección privada, Palermo', neighborhood: 'Palermo', hours: 'Vie-Sáb 20:30', cuisine: 'Parrilla', rating: 4.9, reviewCount: 420, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600', isOpen: false,
    coordinates: { lat: -34.5850, lng: -58.4290 }, tags: ['experiencia', 'puertas cerradas', 'vinos'], reservationInfo: 'Solo por reserva previa', priceRange: 4, featured: true,
  },
  {
    id: '21', name: 'Perón Perón', description: 'Cocina peronista popular con platos abundantes. Milanesas, tortillas y empanadas caseras.', address: 'Av. San Juan 1100, San Telmo', neighborhood: 'San Telmo', hours: 'Lun-Sáb 12:00–16:00, 20:00–00:00', cuisine: 'Bodegón', rating: 4.2, reviewCount: 890, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', isOpen: true,
    coordinates: { lat: -34.6225, lng: -58.3810 }, tags: ['bodegón', 'milanesa', 'casero'], priceRange: 1,
  },
  {
    id: '22', name: 'Ninina Bakery', description: 'Bakery moderna en Palermo con pastelería de primer nivel y café de especialidad.', address: 'Gorriti 4738, Palermo', neighborhood: 'Palermo', hours: 'Lun-Dom 08:00–20:00', cuisine: 'Panadería', rating: 4.6, reviewCount: 1650, imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600', isOpen: true,
    coordinates: { lat: -34.5878, lng: -58.4270 }, tags: ['pastelería', 'café', 'brunch'], priceRange: 2,
  },
  {
    id: '23', name: 'Narda Comedor', description: 'La cocina casera de Narda Lepes. Ingredientes de estación, recetas simples y deliciosas.', address: 'Bolivia 372, Chacarita', neighborhood: 'Chacarita', hours: 'Mar-Sáb 12:00–16:00', cuisine: 'Contemporánea', rating: 4.5, reviewCount: 1100, imageUrl: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600', isOpen: false,
    coordinates: { lat: -34.5870, lng: -58.4530 }, tags: ['estacional', 'casero', 'chef'], priceRange: 3,
  },
  {
    id: '24', name: 'La Calle Bar', description: 'Cocktail bar escondido en Palermo. Tragos de autor y ambiente íntimo con música en vivo.', address: 'Av. Álvarez Thomas 1391, Villa Ortúzar', neighborhood: 'Villa Ortúzar', hours: 'Jue-Sáb 20:00–03:00', cuisine: 'Bar', rating: 4.4, reviewCount: 560, imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600', isOpen: true,
    coordinates: { lat: -34.5785, lng: -58.4505 }, tags: ['cócteles', 'speakeasy', 'música'], priceRange: 3,
  },
  {
    id: '25', name: 'Las Pizarras', description: 'Bistró íntimo de San Telmo con menú de pizarra que cambia diariamente. Cocina de mercado.', address: 'Thames 2296, Palermo', neighborhood: 'Palermo', hours: 'Mar-Sáb 20:00–00:00', cuisine: 'Bistró', rating: 4.6, reviewCount: 670, imageUrl: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600', isOpen: false,
    coordinates: { lat: -34.5873, lng: -58.4330 }, tags: ['bistró', 'estacional', 'íntimo'], reservationInfo: 'Recomendado reservar', priceRange: 3,
  },
  {
    id: '26', name: 'Freddo', description: 'Cadena de heladerías artesanales. Clásica e imprescindible en cualquier recorrido porteño.', address: 'Av. Callao 1098, Recoleta', neighborhood: 'Recoleta', hours: 'Lun-Dom 10:00–00:00', cuisine: 'Heladería', rating: 4.2, reviewCount: 3500, imageUrl: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=600', isOpen: true,
    coordinates: { lat: -34.5962, lng: -58.3935 }, tags: ['helado', 'clásico', 'cadena'], priceRange: 1,
  },
  {
    id: '27', name: 'Aramburu', description: 'Experiencia gastronómica de 18 pasos en Constitución. Uno de los mejores restaurantes de Latinoamérica.', address: 'Salta 1050, Constitución', neighborhood: 'Constitución', hours: 'Mar-Sáb 20:30', cuisine: 'Fine dining', rating: 4.9, reviewCount: 380, imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', isOpen: false,
    coordinates: { lat: -34.6260, lng: -58.3820 }, tags: ['fine dining', 'degustación', 'top'], reservationInfo: 'Reservar con semanas de anticipación', priceRange: 4, featured: true,
  },
  {
    id: '28', name: 'El Federal', description: 'Bar notable de San Telmo desde 1864. Cocina tradicional argentina en un edificio histórico.', address: 'Carlos Calvo 599, San Telmo', neighborhood: 'San Telmo', hours: 'Lun-Dom 08:00–02:00', cuisine: 'Café', rating: 4.3, reviewCount: 1900, imageUrl: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600', isOpen: true,
    coordinates: { lat: -34.6200, lng: -58.3750 }, tags: ['bar notable', 'histórico', 'brunch'], priceRange: 2,
  },
  {
    id: '29', name: 'Tegui', description: 'Restaurante de cocina contemporánea con menú cerrado. Experiencia gastronómica de nivel mundial.', address: 'Costa Rica 5852, Palermo', neighborhood: 'Palermo', hours: 'Mar-Sáb 20:00–00:00', cuisine: 'Fine dining', rating: 4.8, reviewCount: 520, imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600', isOpen: true,
    coordinates: { lat: -34.5795, lng: -58.4405 }, tags: ['fine dining', 'autor', 'menú cerrado'], reservationInfo: 'Reserva indispensable', priceRange: 4, featured: true,
  },
  {
    id: '30', name: 'La Panera Rosa', description: 'Brunch y pastelería en un espacio luminoso de Recoleta. Tostadas, bowls y tortas irresistibles.', address: 'Av. Quintana 144, Recoleta', neighborhood: 'Recoleta', hours: 'Lun-Dom 08:00–20:00', cuisine: 'Café', rating: 4.4, reviewCount: 2100, imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600', isOpen: true,
    coordinates: { lat: -34.5885, lng: -58.3935 }, tags: ['brunch', 'pastelería', 'instagrameable'], priceRange: 2,
  },
  {
    id: '31', name: 'Paraje Arevalo', description: 'Cocina argentina de producto en Palermo Hollywood. Horno de barro y sabores del interior.', address: 'Arévalo 1535, Palermo', neighborhood: 'Palermo', hours: 'Mar-Dom 12:00–16:00, 20:00–00:00', cuisine: 'Contemporánea', rating: 4.5, reviewCount: 1050, imageUrl: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600', isOpen: true,
    coordinates: { lat: -34.5808, lng: -58.4378 }, tags: ['horno de barro', 'regional', 'producto'], priceRange: 3,
  },
  {
    id: '32', name: 'El Obrero', description: 'Bodegón de La Boca con más de 60 años. Cocina casera, vinos de la casa y fútbol en la tele.', address: 'Caffarena 64, La Boca', neighborhood: 'La Boca', hours: 'Lun-Sáb 12:00–15:00, 20:00–00:00', cuisine: 'Bodegón', rating: 4.3, reviewCount: 1400, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', isOpen: true,
    coordinates: { lat: -34.6355, lng: -58.3635 }, tags: ['bodegón', 'la boca', 'casero'], priceRange: 1,
  },
];

export function getNeighborhoods(): string[] {
  return [...new Set(venues.map(v => v.neighborhood))].sort();
}

export function getCuisines(): string[] {
  return [...new Set(venues.map(v => v.cuisine))].sort();
}

export function getAllTags(): string[] {
  return [...new Set(venues.flatMap(v => v.tags ?? []))].sort();
}
