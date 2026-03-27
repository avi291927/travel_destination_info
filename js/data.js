// Destination data and localStorage manager

const DEFAULT_DESTINATIONS = [
  {
    id: 1,
    name: "Santorini",
    country: "Greece",
    category: "beach",
    rating: 4.9,
    image: "images/santorini.jpg",
    shortDesc: "Iconic blue-domed churches and volcanic cliffs overlooking the Aegean Sea.",
    description: "Santorini is one of the Cyclades islands in the south Aegean Sea. A ferry ride away from Piraeus, Greece, this volcanic island has dramatic views, stunning sunsets from Oia town, its very own active volcano, excellent diving conditions and black sand beaches. The island of Santorini is famous for its whitewashed buildings, blue-domed churches, and stunning caldera views.",
    bestTime: "April to November",
    temperature: "20-28°C",
    highlights: ["Blue-domed churches", "Caldera views", "Sunset in Oia", "Wine tasting", "Volcanic beaches"],
    featured: true
  },
  {
    id: 2,
    name: "Bali",
    country: "Indonesia",
    category: "nature",
    rating: 4.8,
    image: "images/bali.jpg",
    shortDesc: "Tropical paradise with rice terraces, temples, and vibrant culture.",
    description: "Bali is a province of Indonesia and the westernmost of the Lesser Sunda Islands. It is known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. The island is home to religious sites such as cliff-side Uluwatu Temple. Bali offers a perfect blend of culture, nature, and relaxation, making it one of the most popular destinations in the world.",
    bestTime: "April to October",
    temperature: "24-30°C",
    highlights: ["Rice terraces", "Hindu temples", "Monkey Forest", "Surfing", "Spa retreats"],
    featured: true
  },
  {
    id: 3,
    name: "Machu Picchu",
    country: "Peru",
    category: "cultural",
    rating: 4.9,
    image: "images/machu-picchu.jpg",
    shortDesc: "Ancient Inca citadel set high in the Andes Mountains above the Sacred Valley.",
    description: "Machu Picchu is an Incan citadel set high in the Andes Mountains in Peru, above the Urubamba River valley. Built in the 15th century and later abandoned, it's renowned for its sophisticated dry-stone walls that fuse huge blocks without the use of mortar, intriguing buildings that play on astronomical alignments and panoramic views. Its exact former use remains a mystery.",
    bestTime: "May to September",
    temperature: "12-18°C",
    highlights: ["Sun Gate", "Temple of the Sun", "Intihuatana stone", "Llama encounters", "Inca Trail"],
    featured: true
  },
  {
    id: 4,
    name: "Swiss Alps",
    country: "Switzerland",
    category: "mountain",
    rating: 4.8,
    image: "images/swiss-alps.jpg",
    shortDesc: "Breathtaking alpine scenery with pristine ski resorts and charming villages.",
    description: "The Swiss Alps are a breathtaking mountain range that stretches across Switzerland, offering some of the most spectacular scenery in the world. From the iconic Matterhorn to the lush valleys of Grindelwald, the region is a paradise for skiers, hikers, and nature lovers alike. The region features crystal-clear lakes, charming mountain villages, and world-class ski resorts.",
    bestTime: "December to March (skiing), June to September (hiking)",
    temperature: "-5 to 20°C (seasonal)",
    highlights: ["Matterhorn", "Jungfraujoch", "Ski resorts", "Alpine villages", "Cable cars"],
    featured: true
  },
  {
    id: 5,
    name: "Tokyo",
    country: "Japan",
    category: "city",
    rating: 4.7,
    image: "images/tokyo.jpg",
    shortDesc: "Futuristic metropolis blending ancient traditions with cutting-edge innovation.",
    description: "Tokyo is Japan's busy capital city, mixing the ultramodern and the traditional, from neon-lit skyscrapers to historic temples. The city offers an extraordinary range of experiences from high-tech electronics districts to peaceful Zen gardens. Tokyo's culinary scene is unmatched with the highest number of Michelin stars of any city in the world.",
    bestTime: "March to May, September to November",
    temperature: "4-30°C (seasonal)",
    highlights: ["Shibuya Crossing", "Senso-ji Temple", "Akihabara", "Mt. Fuji day trip", "Tsukiji Fish Market"],
    featured: true
  },
  {
    id: 6,
    name: "Maldives",
    country: "Maldives",
    category: "beach",
    rating: 4.9,
    image: "images/maldives.jpg",
    shortDesc: "Crystal-clear lagoons, overwater bungalows, and pristine white sand beaches.",
    description: "The Maldives is a tropical nation in the Indian Ocean composed of 26 ring-shaped atolls, which are made up of more than 1,000 coral islands. It's known for its beaches, blue lagoons and extensive reefs. The Maldives is the quintessential luxury beach destination, offering unparalleled natural beauty with its crystal-clear turquoise water, colourful marine life, and sugar-white sands.",
    bestTime: "November to April",
    temperature: "26-30°C",
    highlights: ["Overwater villas", "Scuba diving", "Coral reefs", "Whale shark sightings", "Private islands"],
    featured: true
  },
  {
    id: 7,
    name: "Patagonia",
    country: "Argentina & Chile",
    category: "adventure",
    rating: 4.8,
    image: "images/patagonia.jpg",
    shortDesc: "Remote wilderness at the southern tip of South America with dramatic landscapes.",
    description: "Patagonia is a sparsely populated region at the southern end of South America, shared by Argentina and Chile. It encompasses the southern Andes mountains, lakes, fjords, and glaciers in the west, and deserts, tablelands, and steppes to the east. A paradise for adventurers, trekkers, and nature photographers, Patagonia offers some of the most dramatic and unspoiled landscapes on Earth.",
    bestTime: "October to March",
    temperature: "2-18°C",
    highlights: ["Torres del Paine", "Perito Moreno Glacier", "End of the World Train", "Condor spotting", "Whale watching"],
    featured: false
  },
  {
    id: 8,
    name: "Kyoto",
    country: "Japan",
    category: "cultural",
    rating: 4.8,
    image: "images/kyoto.jpg",
    shortDesc: "Japan's cultural heart with thousands of temples, geisha districts, and bamboo groves.",
    description: "Kyoto, once the capital of Japan, is a city on the island of Honshu famous for its numerous classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses. It is also known for formal customs such as the tea ceremony and the Geisha tradition. Kyoto is home to over 1,600 Buddhist temples and 400 Shinto shrines.",
    bestTime: "March to May, October to November",
    temperature: "5-33°C (seasonal)",
    highlights: ["Arashiyama Bamboo Grove", "Fushimi Inari Shrine", "Geisha district", "Kinkaku-ji Temple", "Traditional tea ceremony"],
    featured: false
  },
  {
    id: 9,
    name: "Amalfi Coast",
    country: "Italy",
    category: "beach",
    rating: 4.7,
    image: "images/amalfi.jpg",
    shortDesc: "Dramatic coastal cliffs, colorful fishing villages, and azure Mediterranean waters.",
    description: "The Amalfi Coast is a stretch of coastline in southern Italy overlooking the Tyrrhenian Sea and the Gulf of Salerno, on the northern coast of the Cilento. Situated between the regions of Campania and Basilicata, it is listed as a UNESCO World Heritage Site. The coast is characterized by cliffs, beaches, historic towns perched on hillsides, and clear blue waters.",
    bestTime: "May to October",
    temperature: "18-28°C",
    highlights: ["Positano", "Path of the Gods", "Limoncello tasting", "Boat tours", "Ravello gardens"],
    featured: false
  },
  {
    id: 10,
    name: "Safari Kenya",
    country: "Kenya",
    category: "adventure",
    rating: 4.9,
    image: "images/safari.jpg",
    shortDesc: "Witness the Great Migration across the Masai Mara – nature's greatest spectacle.",
    description: "Kenya is a country in East Africa with coastline on the Indian Ocean. It encompasses savanna, lakelands, Great Rift Valley and mountain highlands. It's also home to wildlife like lions, elephants and rhinos. The Masai Mara National Reserve is one of Africa's greatest wildlife reserves, famous for its exceptional population of game including the spectacular Great Migration of wildebeest and zebra.",
    bestTime: "July to October (migration), January to March",
    temperature: "15-30°C",
    highlights: ["Great Migration", "Big Five", "Maasai villages", "Hot air balloon safari", "Amboseli National Park"],
    featured: false
  },
  {
    id: 11,
    name: "New Zealand",
    country: "New Zealand",
    category: "nature",
    rating: 4.8,
    image: "images/new-zealand.jpg",
    shortDesc: "Fjords, volcanoes, and rolling green hills – nature's ultimate playground.",
    description: "New Zealand is an island country in the southwestern Pacific Ocean. Known for its diverse landscapes including stunning fjords, dramatic mountains, beaches, and geothermal areas. New Zealand is an adventure playground offering bungee jumping, skydiving, and hiking. The stunning landscapes served as the backdrop for the Lord of the Rings trilogy.",
    bestTime: "October to April",
    temperature: "10-25°C (seasonal)",
    highlights: ["Milford Sound", "Hobbiton", "Queenstown adventure", "Rotorua geothermal", "Fiordland National Park"],
    featured: false
  },
  {
    id: 12,
    name: "Barcelona",
    country: "Spain",
    category: "city",
    rating: 4.7,
    image: "images/barcelona.jpg",
    shortDesc: "Gaudí's architectural wonders, beach promenades, and vibrant Catalan culture.",
    description: "Barcelona is the cosmopolitan capital of Spain's Catalonia region. It is known for its art and architecture. The fantastical Sagrada Família church and other modernist landmarks designed by Antoni Gaudí dot the city. Museu Picasso and Fundació Joan Miró feature modern art by their namesakes. Barcelona offers a perfect blend of beach life, cultural sightseeing, and vibrant nightlife.",
    bestTime: "May to June, September to October",
    temperature: "14-28°C",
    highlights: ["Sagrada Família", "Park Güell", "Las Ramblas", "Gothic Quarter", "Barceloneta Beach"],
    featured: false
  }
];

// Data manager
const DataManager = {
  DEST_KEY: 'ww_destinations',
  USERS_KEY: 'ww_users',

  getDestinations() {
    const stored = localStorage.getItem(this.DEST_KEY);
    if (!stored) {
      this.saveDestinations(DEFAULT_DESTINATIONS);
      return DEFAULT_DESTINATIONS;
    }
    return JSON.parse(stored);
  },

  saveDestinations(destinations) {
    localStorage.setItem(this.DEST_KEY, JSON.stringify(destinations));
  },

  addDestination(dest) {
    const destinations = this.getDestinations();
    const newId = Math.max(0, ...destinations.map(d => d.id)) + 1;
    dest.id = newId;
    dest.featured = false;
    destinations.push(dest);
    this.saveDestinations(destinations);
    return dest;
  },

  updateDestination(id, updatedData) {
    const destinations = this.getDestinations();
    const idx = destinations.findIndex(d => d.id == id);
    if (idx !== -1) {
      destinations[idx] = { ...destinations[idx], ...updatedData };
      this.saveDestinations(destinations);
      return destinations[idx];
    }
    return null;
  },

  deleteDestination(id) {
    const destinations = this.getDestinations().filter(d => d.id != id);
    this.saveDestinations(destinations);
  },

  getDestinationById(id) {
    return this.getDestinations().find(d => d.id == id) || null;
  },

  getFeatured() {
    return this.getDestinations().filter(d => d.featured).slice(0, 6);
  },

  // Users
  getUsers() {
    const stored = localStorage.getItem(this.USERS_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  },

  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  addUser(user) {
    const users = this.getUsers();
    user.id = Date.now();
    user.favorites = [];
    user.joinDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    user.role = 'user';
    users.push(user);
    this.saveUsers(users);
    return user;
  },

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  updateUser(email, updatedData) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updatedData };
      this.saveUsers(users);
      return users[idx];
    }
    return null;
  },

  deleteUser(email) {
    const users = this.getUsers().filter(u => u.email.toLowerCase() !== email.toLowerCase());
    this.saveUsers(users);
  }
};

// Force refresh cached data when image paths change (v3 = updated image resolving)
const DATA_VERSION = 'v3_local';
if (localStorage.getItem('ww_data_version') !== DATA_VERSION) {
  localStorage.removeItem('ww_destinations');
  localStorage.setItem('ww_data_version', DATA_VERSION);
}

// Initialize destinations on first load
DataManager.getDestinations();
