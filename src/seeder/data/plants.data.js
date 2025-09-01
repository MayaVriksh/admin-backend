const { v4: uuid } = require("uuid");

const plants = [
    {
        plantId: uuid(),
        name: "Areca Palm",
        description: "Elegant air-purifying palm for indoor spaces.",
        scientificName: "Dypsis lutescens",
        isProductActive: true,
        isFeatured: true,
        maintenance: "Low",
        placeOfOrigin: "Madagascar",
        auraType: "Positive Energy",
        bestForEmotion: ["Stress Relief"],
        bestGiftFor: ["Office", "Home"],
        biodiversityBooster: true,
        carbonAbsorber: true,
        funFacts: ["Removes toxins", "Improves humidity"],
        godAligned: ["Ganesh"],
        insideBox: ["Pot", "Soil", "Fertilizer"],
        plantClass: "Palm",
        plantSeries: "Indoor Air Purifier",
        repotting: "Every 2 years",
        soil: "Well-draining",
        spiritualUseCase: ["Meditation", "Calmness"],
        associatedDeity: ["Ganesh"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        plantId: uuid(),
        name: "Snake Plant",
        description: "Hardy and great for air purification.",
        scientificName: "Sansevieria trifasciata",
        isProductActive: true,
        isFeatured: false,
        maintenance: "Very Low",
        placeOfOrigin: "West Africa",
        auraType: "Protection",
        bestForEmotion: ["Focus"],
        bestGiftFor: ["Home", "Office"],
        biodiversityBooster: false,
        carbonAbsorber: true,
        funFacts: ["Can survive low light", "Air purifier"],
        godAligned: [],
        insideBox: ["Pot", "Soil"],
        plantClass: "Succulent",
        plantSeries: "Indoor Easy Plants",
        repotting: "Every 3 years",
        soil: "Sandy Loam",
        spiritualUseCase: ["Focus", "Protection"],
        associatedDeity: [],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        plantId: uuid(),
        name: "ZZ Plant",
        description: "Glossy leaves and great for low-light.",
        scientificName: "Zamioculcas zamiifolia",
        isProductActive: true,
        isFeatured: true,
        maintenance: "Low",
        placeOfOrigin: "East Africa",
        auraType: "Good Luck",
        bestForEmotion: ["Calmness"],
        bestGiftFor: ["Home", "Desk"],
        biodiversityBooster: false,
        carbonAbsorber: true,
        funFacts: ["Tolerates neglect", "Air purifier"],
        godAligned: ["Lakshmi"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Perennial",
        plantSeries: "Indoor Easy Plants",
        repotting: "Every 2 years",
        soil: "Well-draining",
        spiritualUseCase: ["Good Luck"],
        associatedDeity: ["Lakshmi"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        plantId: uuid(),
        name: "Peace Lily",
        description: "Flowering indoor plant, excellent for bedrooms.",
        scientificName: "Spathiphyllum",
        isProductActive: true,
        isFeatured: false,
        maintenance: "Medium",
        placeOfOrigin: "Tropical Americas",
        auraType: "Purity",
        bestForEmotion: ["Relaxation"],
        bestGiftFor: ["Bedroom", "Home"],
        biodiversityBooster: true,
        carbonAbsorber: true,
        funFacts: ["Removes mold spores", "Flowering plant"],
        godAligned: ["Saraswati"],
        insideBox: ["Pot", "Soil", "Fertilizer"],
        plantClass: "Flowering",
        plantSeries: "Indoor Flowering Plants",
        repotting: "Every 2 years",
        soil: "Loamy",
        spiritualUseCase: ["Calmness", "Purity"],
        associatedDeity: ["Saraswati"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        plantId: uuid(),
        name: "Money Plant",
        description: "Easy-to-grow and auspicious for homes.",
        scientificName: "Epipremnum aureum",
        isProductActive: true,
        isFeatured: true,
        maintenance: "Very Low",
        placeOfOrigin: "Southeast Asia",
        auraType: "Prosperity",
        bestForEmotion: ["Positivity"],
        bestGiftFor: ["Home", "Office"],
        biodiversityBooster: false,
        carbonAbsorber: true,
        funFacts: ["Brings luck", "Low maintenance"],
        godAligned: ["Lakshmi"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Vine",
        plantSeries: "Indoor Easy Plants",
        repotting: "Every 2 years",
        soil: "Well-draining",
        spiritualUseCase: ["Prosperity"],
        associatedDeity: ["Lakshmi"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        plantId: uuid(),
        name: "Ficus Bonsai",
        description: "Miniature bonsai for desk or living room.",
        scientificName: "Ficus retusa",
        isProductActive: true,
        isFeatured: true,
        maintenance: "Medium",
        placeOfOrigin: "China",
        auraType: "Balance",
        bestForEmotion: ["Focus", "Calmness"],
        bestGiftFor: ["Office", "Home"],
        biodiversityBooster: false,
        carbonAbsorber: true,
        funFacts: ["Easy to shape", "Air purifier"],
        godAligned: ["Ganesh"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Bonsai",
        plantSeries: "Indoor Bonsai",
        repotting: "Every 2 years",
        soil: "Loamy",
        spiritualUseCase: ["Meditation", "Balance"],
        associatedDeity: ["Ganesh"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        plantId: uuid(),
        name: "Dracaena Marginata",
        description: "Tall, spiky leaves, good for offices.",
        scientificName: "Dracaena marginata",
        isProductActive: true,
        isFeatured: false,
        maintenance: "Low",
        placeOfOrigin: "Madagascar",
        auraType: "Focus",
        bestForEmotion: ["Concentration"],
        bestGiftFor: ["Office"],
        biodiversityBooster: false,
        carbonAbsorber: true,
        funFacts: ["Air purifier", "Low maintenance"],
        godAligned: [],
        insideBox: ["Pot", "Soil"],
        plantClass: "Dracaena",
        plantSeries: "Indoor Easy Plants",
        repotting: "Every 3 years",
        soil: "Sandy Loam",
        spiritualUseCase: ["Focus"],
        associatedDeity: [],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        plantId: uuid(),
        name: "Aloe Vera",
        description: "Succulent with medicinal benefits.",
        scientificName: "Aloe barbadensis",
        isProductActive: true,
        isFeatured: true,
        maintenance: "Very Low",
        placeOfOrigin: "Arabian Peninsula",
        auraType: "Healing",
        bestForEmotion: ["Health"],
        bestGiftFor: ["Home", "Office"],
        biodiversityBooster: false,
        carbonAbsorber: true,
        funFacts: ["Medicinal gel", "Air purifier"],
        godAligned: ["Dhanvantari"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Succulent",
        plantSeries: "Indoor Easy Plants",
        repotting: "Every 2 years",
        soil: "Sandy Loam",
        spiritualUseCase: ["Healing"],
        associatedDeity: ["Dhanvantari"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        plantId: uuid(),
        name: "Spider Plant",
        description: "Easy to grow and fast-growing plant.",
        scientificName: "Chlorophytum comosum",
        isProductActive: true,
        isFeatured: false,
        maintenance: "Very Low",
        placeOfOrigin: "South Africa",
        auraType: "Energy",
        bestForEmotion: ["Focus", "Calmness"],
        bestGiftFor: ["Home"],
        biodiversityBooster: false,
        carbonAbsorber: true,
        funFacts: ["Air purifier", "Fast-growing"],
        godAligned: [],
        insideBox: ["Pot", "Soil"],
        plantClass: "Perennial",
        plantSeries: "Indoor Easy Plants",
        repotting: "Every 3 years",
        soil: "Loamy",
        spiritualUseCase: ["Energy"],
        associatedDeity: [],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        plantId: uuid(),
        name: "Lucky Bamboo",
        description: "Auspicious plant often kept for prosperity.",
        scientificName: "Dracaena sanderiana",
        isProductActive: true,
        isFeatured: true,
        maintenance: "Low",
        placeOfOrigin: "China",
        auraType: "Prosperity",
        bestForEmotion: ["Positivity"],
        bestGiftFor: ["Home", "Office"],
        biodiversityBooster: false,
        carbonAbsorber: true,
        funFacts: ["Brings luck", "Easy care"],
        godAligned: ["Lakshmi"],
        insideBox: ["Pot", "Water beads"],
        plantClass: "Dracaena",
        plantSeries: "Indoor Easy Plants",
        repotting: "Every 2 years",
        soil: "Water/Gravel",
        spiritualUseCase: ["Prosperity"],
        associatedDeity: ["Lakshmi"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        plantId: uuid(),
        name: "Orchid",
        description: "Elegant flowering plant for decoration.",
        scientificName: "Orchidaceae",
        isProductActive: true,
        isFeatured: true,
        maintenance: "Medium",
        placeOfOrigin: "Tropical Asia",
        auraType: "Beauty",
        bestForEmotion: ["Calmness", "Joy"],
        bestGiftFor: ["Home", "Gift"],
        biodiversityBooster: false,
        carbonAbsorber: false,
        funFacts: ["Flowering plant", "Air purifier"],
        godAligned: ["Lakshmi"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Flowering",
        plantSeries: "Indoor Flowering Plants",
        repotting: "Every 2 years",
        soil: "Loamy",
        spiritualUseCase: ["Beauty", "Calmness"],
        associatedDeity: ["Lakshmi"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        plantId: uuid(),
        name: "Citrus Tree",
        description: "Small indoor citrus tree with fragrant fruits.",
        scientificName: "Citrus spp.",
        isProductActive: true,
        isFeatured: false,
        maintenance: "Medium",
        placeOfOrigin: "Mediterranean",
        auraType: "Freshness",
        bestForEmotion: ["Energy"],
        bestGiftFor: ["Home", "Kitchen"],
        biodiversityBooster: false,
        carbonAbsorber: false,
        funFacts: ["Edible fruits", "Fragrant flowers"],
        godAligned: [],
        insideBox: ["Pot", "Soil"],
        plantClass: "Fruit",
        plantSeries: "Indoor Fruit Plants",
        repotting: "Every 2 years",
        soil: "Loamy",
        spiritualUseCase: ["Energy"],
        associatedDeity: [],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        plantId: uuid(),
        name: "Peppermint",
        description: "Aromatic herb for home or kitchen.",
        scientificName: "Mentha × piperita",
        isProductActive: true,
        isFeatured: false,
        maintenance: "Low",
        placeOfOrigin: "Europe",
        auraType: "Freshness",
        bestForEmotion: ["Relaxation", "Focus"],
        bestGiftFor: ["Kitchen", "Home"],
        biodiversityBooster: false,
        carbonAbsorber: false,
        funFacts: ["Aromatic", "Medicinal herb"],
        godAligned: [],
        insideBox: ["Pot", "Soil"],
        plantClass: "Herb",
        plantSeries: "Indoor Herb Plants",
        repotting: "Every year",
        soil: "Well-draining",
        spiritualUseCase: ["Relaxation"],
        associatedDeity: [],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        plantId: uuid(),
        name: "Mini Rose",
        description: "Small flowering rose for indoor decoration.",
        scientificName: "Rosa chinensis",
        isProductActive: true,
        isFeatured: true,
        maintenance: "Medium",
        placeOfOrigin: "China",
        auraType: "Love",
        bestForEmotion: ["Happiness"],
        bestGiftFor: ["Home", "Gift"],
        biodiversityBooster: false,
        carbonAbsorber: false,
        funFacts: ["Flowering plant", "Fragrant"],
        godAligned: ["Parvati"],
        insideBox: ["Pot", "Soil", "Fertilizer"],
        plantClass: "Flowering",
        plantSeries: "Indoor Flowering Plants",
        repotting: "Every 2 years",
        soil: "Loamy",
        spiritualUseCase: ["Love", "Happiness"],
        associatedDeity: ["Parvati"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        plantId: uuid(),
        name: "Jasmine",
        description: "Fragrant climbing plant for indoor/outdoor.",
        scientificName: "Jasminum",
        isProductActive: true,
        isFeatured: false,
        maintenance: "Medium",
        placeOfOrigin: "India",
        auraType: "Purity",
        bestForEmotion: ["Calmness"],
        bestGiftFor: ["Home", "Garden"],
        biodiversityBooster: false,
        carbonAbsorber: false,
        funFacts: ["Fragrant flowers", "Fast-growing"],
        godAligned: ["Saraswati"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Climber",
        plantSeries: "Indoor Flowering Plants",
        repotting: "Every year",
        soil: "Loamy",
        spiritualUseCase: ["Purity"],
        associatedDeity: ["Saraswati"],
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

const plantSizeProfiles = [];

function addSizeProfiles(plant, sizes) {
    sizes.forEach((s) => {
        plantSizeProfiles.push({
            plantSizeId: uuid(),
            plantId: plant.plantId,
            plantSize: s.plantSize,
            height: s.height,
            weight: s.weight
        });
    });
}

addSizeProfiles(plants[0], [
    { plantSize: "SMALL", height: 30, weight: 0.5 },
    { plantSize: "MEDIUM", height: 50, weight: 1.2 },
    { plantSize: "LARGE", height: 70, weight: 1.9 },
    { plantSize: "EXTRA_LARGE", height: 90, weight: 2.6 },
    { plantSize: "EXTRA_SMALL", height: 110, weight: 3.3 }
]);

addSizeProfiles(plants[1], [
    { plantSize: "SMALL", height: 20, weight: 0.4 },
    { plantSize: "MEDIUM", height: 30, weight: 0.7 },
    { plantSize: "LARGE", height: 40, weight: 1.0 },
    { plantSize: "EXTRA_LARGE", height: 50, weight: 1.3 },
    { plantSize: "EXTRA_SMALL", height: 60, weight: 1.6 }
]);

addSizeProfiles(plants[2], [
    { plantSize: "SMALL", height: 25, weight: 0.5 },
    { plantSize: "MEDIUM", height: 35, weight: 0.9 },
    { plantSize: "LARGE", height: 45, weight: 1.3 },
    { plantSize: "EXTRA_LARGE", height: 55, weight: 1.7 },
    { plantSize: "EXTRA_SMALL", height: 65, weight: 2.1 }
]);

addSizeProfiles(plants[3], [
    { plantSize: "SMALL", height: 20, weight: 0.4 },
    { plantSize: "MEDIUM", height: 32, weight: 0.9 },
    { plantSize: "LARGE", height: 44, weight: 1.4 },
    { plantSize: "EXTRA_LARGE", height: 56, weight: 1.9 },
    { plantSize: "EXTRA_SMALL", height: 68, weight: 2.4 }
]);

addSizeProfiles(plants[4], [
    { plantSize: "SMALL", height: 15, weight: 0.2 },
    { plantSize: "MEDIUM", height: 23, weight: 0.45 },
    { plantSize: "LARGE", height: 31, weight: 0.7 },
    { plantSize: "EXTRA_LARGE", height: 39, weight: 0.95 },
    { plantSize: "EXTRA_SMALL", height: 47, weight: 1.2 }
]);

const plantVariants = [];

function addVariants(plant, prefix, baseMrp) {
    const profiles = plantSizeProfiles.filter(
        (p) => p.plantId === plant.plantId
    );
    profiles.forEach((profile, i) => {
        plantVariants.push({
            variantId: uuid(),
            plantId: plant.plantId,
            plantSizeId: profile.plantSizeId,
            colorId: "default-green",
            sku: `${prefix}-${i + 1}`,
            mrp: baseMrp + i * 100,
            isProductActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });
}

addVariants(plants[0], "ARECA", 349);
addVariants(plants[1], "SNAKE", 299);
addVariants(plants[2], "ZZ", 399);
addVariants(plants[3], "LILY", 499);
addVariants(plants[4], "MONEY", 199);
addVariants(plants[5], "FICUS", 549); // Ficus Bonsai
addVariants(plants[6], "DRACAENA", 429); // Dracaena Marginata
addVariants(plants[7], "ALOE", 229); // Aloe Vera
addVariants(plants[8], "SPIDER", 319); // Spider Plant
addVariants(plants[9], "BAMBOO", 259); // Lucky Bamboo
addVariants(plants[10], "ORCHID", 699); // Orchid
addVariants(plants[11], "CITRUS", 599); // Citrus Tree
addVariants(plants[12], "PEPPERMINT", 149); // Peppermint Plant
addVariants(plants[13], "ROSE", 349); // Mini Rose
addVariants(plants[14], "JASMINE", 279); // Jasmine

const mediaUrls = [
    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724481/Gemini_Generated_Image_11rm3m11rm3m11rm_fnxgte.png",
    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724476/Gemini_Generated_Image_b4x9isb4x9isb4x9_x5zifm.png",
    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724476/Gemini_Generated_Image_9gw2kd9gw2kd9gw2_hpob1u.png",
    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724476/Gemini_Generated_Image_g8dcj4g8dcj4g8dc_a1js4a.png",
    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724474/Gemini_Generated_Image_kvy73ikvy73ikvy7_ood5aj.png",
    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724475/Gemini_Generated_Image_doqqbidoqqbidoqq_hdfhkb.png",
    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724474/Gemini_Generated_Image_ndidk6ndidk6ndid_rjyyvh.png",
    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724474/Gemini_Generated_Image_7ckenr7ckenr7cke_cxjvil.png"
];

module.exports = {
    plants,
    plantSizeProfiles,
    plantVariants,
    mediaUrls
};
