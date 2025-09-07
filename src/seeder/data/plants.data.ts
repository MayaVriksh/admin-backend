import { v4 as uuid } from 'uuid';

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
        minimumTemperature: 18,
        maximumTemperature: 28,
        benefits: ["Purifies air", "Improves humidity", "Adds positive energy"],
        associatedDeity: ["Vishnu", "Lakshmi"],
        godAligned: ["Positive Energy", "Stress Relief"],
        insideBox: ["Pot", "Soil", "Fertilizer"],
        plantClass: "Palm",
        plantSeries: "Indoor Air Purifier",
        repotting: "Every 2 years",
        soil: "Well-draining",
        spiritualUseCase: ["Meditation", "Calmness"],
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
        minimumTemperature: 15,
        maximumTemperature: 30,
        benefits: ["Removes toxins", "Improves focus", "Protection"],
        associatedDeity: ["Shiva"],
        godAligned: ["Protection", "Focus"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Succulent",
        plantSeries: "Indoor Easy Plants",
        repotting: "Every 3 years",
        soil: "Sandy Loam",
        spiritualUseCase: ["Focus", "Protection"],
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
        minimumTemperature: 18,
        maximumTemperature: 28,
        benefits: ["Tolerates neglect", "Air purifier", "Promotes good luck"],
        associatedDeity: ["Lakshmi"],
        godAligned: ["Good Luck", "Calmness"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Perennial",
        plantSeries: "Indoor Easy Plants",
        repotting: "Every 2 years",
        soil: "Well-draining",
        spiritualUseCase: ["Good Luck"],
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
        minimumTemperature: 16,
        maximumTemperature: 28,
        benefits: ["Removes mold spores", "Brings calmness", "Purity"],
        associatedDeity: ["Saraswati"],
        godAligned: ["Purity", "Calmness"],
        insideBox: ["Pot", "Soil", "Fertilizer"],
        plantClass: "Flowering",
        plantSeries: "Indoor Flowering Plants",
        repotting: "Every 2 years",
        soil: "Loamy",
        spiritualUseCase: ["Calmness", "Purity"],
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
        minimumTemperature: 18,
        maximumTemperature: 30,
        benefits: ["Brings luck", "Promotes prosperity", "Low maintenance"],
        associatedDeity: ["Lakshmi", "Kubera"],
        godAligned: ["Prosperity", "Positivity"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Vine",
        plantSeries: "Indoor Easy Plants",
        repotting: "Every 2 years",
        soil: "Well-draining",
        spiritualUseCase: ["Prosperity"],
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
        minimumTemperature: 16,
        maximumTemperature: 28,
        benefits: ["Air purifier", "Aesthetic appeal", "Focus and balance"],
        associatedDeity: ["Ganesh"],
        godAligned: ["Meditation", "Balance"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Bonsai",
        plantSeries: "Indoor Bonsai",
        repotting: "Every 2 years",
        soil: "Loamy",
        spiritualUseCase: ["Meditation", "Balance"],
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
        minimumTemperature: 15,
        maximumTemperature: 30,
        benefits: ["Air purifier", "Low maintenance", "Enhances focus"],
        associatedDeity: [],
        godAligned: ["Focus", "Concentration"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Dracaena",
        plantSeries: "Indoor Easy Plants",
        repotting: "Every 3 years",
        soil: "Sandy Loam",
        spiritualUseCase: ["Focus"],
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
        minimumTemperature: 15,
        maximumTemperature: 30,
        benefits: ["Medicinal gel", "Air purification", "Promotes healing"],
        associatedDeity: ["Dhanvantari"],
        godAligned: ["Healing", "Health"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Succulent",
        plantSeries: "Indoor Easy Plants",
        repotting: "Every 2 years",
        soil: "Sandy Loam",
        spiritualUseCase: ["Healing"],
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
        minimumTemperature: 15,
        maximumTemperature: 28,
        benefits: ["Air purifier", "Fast-growing", "Boosts energy"],
        associatedDeity: [],
        godAligned: ["Energy", "Focus"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Perennial",
        plantSeries: "Indoor Easy Plants",
        repotting: "Every 3 years",
        soil: "Loamy",
        spiritualUseCase: ["Energy"],
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
        minimumTemperature: 18,
        maximumTemperature: 28,
        benefits: ["Brings luck", "Easy care", "Promotes prosperity"],
        associatedDeity: ["Lakshmi"],
        godAligned: ["Prosperity", "Positivity"],
        insideBox: ["Pot", "Water beads"],
        plantClass: "Dracaena",
        plantSeries: "Indoor Easy Plants",
        repotting: "Every 2 years",
        soil: "Water/Gravel",
        spiritualUseCase: ["Prosperity"],
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
        minimumTemperature: 16,
        maximumTemperature: 28,
        benefits: [
            "Air purifier",
            "Elegant decoration",
            "Promotes calmness and joy"
        ],
        associatedDeity: ["Lakshmi"],
        godAligned: ["Beauty", "Calmness"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Flowering",
        plantSeries: "Indoor Flowering Plants",
        repotting: "Every 2 years",
        soil: "Loamy",
        spiritualUseCase: ["Beauty", "Calmness"],
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
        minimumTemperature: 18,
        maximumTemperature: 32,
        benefits: ["Edible fruits", "Fragrant flowers", "Fresh air"],
        associatedDeity: [],
        godAligned: ["Energy", "Freshness"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Fruit",
        plantSeries: "Indoor Fruit Plants",
        repotting: "Every 2 years",
        soil: "Loamy",
        spiritualUseCase: ["Energy"],
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
        minimumTemperature: 15,
        maximumTemperature: 28,
        benefits: [
            "Aromatic herb",
            "Medicinal properties",
            "Enhances relaxation"
        ],
        associatedDeity: [],
        godAligned: ["Relaxation", "Focus"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Herb",
        plantSeries: "Indoor Herb Plants",
        repotting: "Every year",
        soil: "Well-draining",
        spiritualUseCase: ["Relaxation"],
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
        minimumTemperature: 16,
        maximumTemperature: 28,
        benefits: [
            "Flowering plant",
            "Fragrant",
            "Promotes happiness and love"
        ],
        associatedDeity: ["Parvati"],
        godAligned: ["Love", "Happiness"],
        insideBox: ["Pot", "Soil", "Fertilizer"],
        plantClass: "Flowering",
        plantSeries: "Indoor Flowering Plants",
        repotting: "Every 2 years",
        soil: "Loamy",
        spiritualUseCase: ["Love", "Happiness"],
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
        minimumTemperature: 18,
        maximumTemperature: 30,
        benefits: [
            "Fragrant flowers",
            "Fast-growing",
            "Promotes calmness and purity"
        ],
        associatedDeity: ["Saraswati"],
        godAligned: ["Purity", "Calmness"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Climber",
        plantSeries: "Indoor Flowering Plants",
        repotting: "Every year",
        soil: "Loamy",
        spiritualUseCase: ["Purity"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        plantId: uuid(),
        name: "Jade Plant",
        description:
            "Popular succulent with thick, fleshy leaves, symbolizing good luck and prosperity.",
        scientificName: "Crassula ovata",
        isProductActive: true,
        isFeatured: true,
        maintenance: "Low",
        placeOfOrigin: "South Africa",
        auraType: "Prosperity",
        bestForEmotion: ["Positivity", "Wealth"],
        bestGiftFor: ["Home", "Office"],
        biodiversityBooster: false,
        carbonAbsorber: true,
        funFacts: ["Can live for decades", "Symbol of wealth"],
        insideBox: ["Pot", "Soil", "Fertilizer"],
        plantClass: "Succulent",
        plantSeries: "Indoor Easy Plants",
        repotting: "Every 2 years",
        soil: "Well-draining",
        spiritualUseCase: ["Wealth", "Good Fortune"],
        minimumTemperature: 15,
        maximumTemperature: 30,
        benefits: [
            "Air purification",
            "Boosts positivity",
            "Attracts prosperity"
        ],
        associatedDeity: ["Lakshmi"],
        godAligned: ["Prosperity"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        plantId: uuid(),
        name: "Tulsi",
        description:
            "Sacred herb known for its medicinal and spiritual significance.",
        scientificName: "Ocimum sanctum",
        isProductActive: true,
        isFeatured: true,
        maintenance: "Medium",
        placeOfOrigin: "India",
        auraType: "Purity",
        bestForEmotion: ["Calmness", "Health"],
        bestGiftFor: ["Home", "Temple"],
        biodiversityBooster: false,
        carbonAbsorber: true,
        funFacts: ["Used in Ayurveda", "Boosts immunity"],
        insideBox: ["Pot", "Soil"],
        plantClass: "Herb",
        plantSeries: "Indoor Herb Plants",
        repotting: "Every year",
        soil: "Loamy",
        spiritualUseCase: ["Purity", "Protection"],
        minimumTemperature: 20,
        maximumTemperature: 35,
        benefits: [
            "Air purification",
            "Immunity booster",
            "Spiritual purification"
        ],
        associatedDeity: ["Vishnu"],
        godAligned: ["Purity", "Protection"],
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
    // Areca Palm
    { plantSize: "SMALL", height: 30, weight: 0.5 },
    { plantSize: "MEDIUM", height: 50, weight: 1.2 },
    { plantSize: "LARGE", height: 70, weight: 1.9 },
    { plantSize: "EXTRA_LARGE", height: 90, weight: 2.6 },
    { plantSize: "EXTRA_SMALL", height: 110, weight: 3.3 }
]);

addSizeProfiles(plants[1], [
    // Snake Plant
    { plantSize: "SMALL", height: 20, weight: 0.4 },
    { plantSize: "MEDIUM", height: 30, weight: 0.7 },
    { plantSize: "LARGE", height: 40, weight: 1.0 },
    { plantSize: "EXTRA_LARGE", height: 50, weight: 1.3 },
    { plantSize: "EXTRA_SMALL", height: 60, weight: 1.6 }
]);

addSizeProfiles(plants[2], [
    // ZZ Plant
    { plantSize: "SMALL", height: 25, weight: 0.5 },
    { plantSize: "MEDIUM", height: 35, weight: 0.9 },
    { plantSize: "LARGE", height: 45, weight: 1.3 },
    { plantSize: "EXTRA_LARGE", height: 55, weight: 1.7 },
    { plantSize: "EXTRA_SMALL", height: 65, weight: 2.1 }
]);

addSizeProfiles(plants[3], [
    // Peace Lily
    { plantSize: "SMALL", height: 20, weight: 0.4 },
    { plantSize: "MEDIUM", height: 32, weight: 0.9 },
    { plantSize: "LARGE", height: 44, weight: 1.4 },
    { plantSize: "EXTRA_LARGE", height: 56, weight: 1.9 },
    { plantSize: "EXTRA_SMALL", height: 68, weight: 2.4 }
]);

addSizeProfiles(plants[4], [
    // Money Plant
    { plantSize: "SMALL", height: 15, weight: 0.2 },
    { plantSize: "MEDIUM", height: 23, weight: 0.45 },
    { plantSize: "LARGE", height: 31, weight: 0.7 },
    { plantSize: "EXTRA_LARGE", height: 39, weight: 0.95 },
    { plantSize: "EXTRA_SMALL", height: 47, weight: 1.2 }
]);

addSizeProfiles(plants[5], [
    // Ficus Bonsai
    { plantSize: "SMALL", height: 25, weight: 0.3 },
    { plantSize: "MEDIUM", height: 35, weight: 0.6 },
    { plantSize: "LARGE", height: 45, weight: 0.9 },
    { plantSize: "EXTRA_LARGE", height: 55, weight: 1.2 },
    { plantSize: "EXTRA_SMALL", height: 65, weight: 1.5 }
]);

addSizeProfiles(plants[6], [
    // Dracaena Marginata
    { plantSize: "SMALL", height: 40, weight: 0.8 },
    { plantSize: "MEDIUM", height: 60, weight: 1.4 },
    { plantSize: "LARGE", height: 80, weight: 2.0 },
    { plantSize: "EXTRA_LARGE", height: 100, weight: 2.6 },
    { plantSize: "EXTRA_SMALL", height: 120, weight: 3.2 }
]);

addSizeProfiles(plants[7], [
    // Aloe Vera
    { plantSize: "SMALL", height: 15, weight: 0.2 },
    { plantSize: "MEDIUM", height: 25, weight: 0.5 },
    { plantSize: "LARGE", height: 35, weight: 0.8 },
    { plantSize: "EXTRA_LARGE", height: 45, weight: 1.1 },
    { plantSize: "EXTRA_SMALL", height: 55, weight: 1.4 }
]);

addSizeProfiles(plants[8], [
    // Spider Plant
    { plantSize: "SMALL", height: 20, weight: 0.3 },
    { plantSize: "MEDIUM", height: 30, weight: 0.5 },
    { plantSize: "LARGE", height: 40, weight: 0.7 },
    { plantSize: "EXTRA_LARGE", height: 50, weight: 0.9 },
    { plantSize: "EXTRA_SMALL", height: 60, weight: 1.1 }
]);

addSizeProfiles(plants[9], [
    // Lucky Bamboo
    { plantSize: "SMALL", height: 15, weight: 0.2 },
    { plantSize: "MEDIUM", height: 25, weight: 0.4 },
    { plantSize: "LARGE", height: 35, weight: 0.6 },
    { plantSize: "EXTRA_LARGE", height: 45, weight: 0.8 },
    { plantSize: "EXTRA_SMALL", height: 55, weight: 1.0 }
]);

addSizeProfiles(plants[10], [
    // Orchid
    { plantSize: "SMALL", height: 20, weight: 0.25 },
    { plantSize: "MEDIUM", height: 30, weight: 0.5 },
    { plantSize: "LARGE", height: 40, weight: 0.75 },
    { plantSize: "EXTRA_LARGE", height: 50, weight: 1.0 },
    { plantSize: "EXTRA_SMALL", height: 60, weight: 1.25 }
]);

addSizeProfiles(plants[11], [
    // Citrus Tree
    { plantSize: "SMALL", height: 25, weight: 1.0 },
    { plantSize: "MEDIUM", height: 45, weight: 1.8 },
    { plantSize: "LARGE", height: 65, weight: 2.6 },
    { plantSize: "EXTRA_LARGE", height: 85, weight: 3.4 },
    { plantSize: "EXTRA_SMALL", height: 105, weight: 4.2 }
]);

addSizeProfiles(plants[12], [
    // Peppermint
    { plantSize: "SMALL", height: 15, weight: 0.1 },
    { plantSize: "MEDIUM", height: 25, weight: 0.2 },
    { plantSize: "LARGE", height: 35, weight: 0.3 },
    { plantSize: "EXTRA_LARGE", height: 45, weight: 0.4 },
    { plantSize: "EXTRA_SMALL", height: 55, weight: 0.5 }
]);

addSizeProfiles(plants[13], [
    // Mini Rose
    { plantSize: "SMALL", height: 20, weight: 0.2 },
    { plantSize: "MEDIUM", height: 30, weight: 0.4 },
    { plantSize: "LARGE", height: 40, weight: 0.6 },
    { plantSize: "EXTRA_LARGE", height: 50, weight: 0.8 },
    { plantSize: "EXTRA_SMALL", height: 60, weight: 1.0 }
]);

addSizeProfiles(plants[14], [
    // Jasmine
    { plantSize: "SMALL", height: 25, weight: 0.3 },
    { plantSize: "MEDIUM", height: 35, weight: 0.5 },
    { plantSize: "LARGE", height: 45, weight: 0.7 },
    { plantSize: "EXTRA_LARGE", height: 55, weight: 0.9 },
    { plantSize: "EXTRA_SMALL", height: 65, weight: 1.1 }
]);

addSizeProfiles(plants[15], [
    // Jade Plant
    { plantSize: "SMALL", height: 20, weight: 0.4 },
    { plantSize: "MEDIUM", height: 35, weight: 0.7 },
    { plantSize: "LARGE", height: 50, weight: 1.0 },
    { plantSize: "EXTRA_LARGE", height: 65, weight: 1.3 },
    { plantSize: "EXTRA_SMALL", height: 80, weight: 1.6 }
]);

addSizeProfiles(plants[16], [
    // Tulsi
    { plantSize: "SMALL", height: 15, weight: 0.2 },
    { plantSize: "MEDIUM", height: 25, weight: 0.4 },
    { plantSize: "LARGE", height: 35, weight: 0.6 },
    { plantSize: "EXTRA_LARGE", height: 45, weight: 0.8 },
    { plantSize: "EXTRA_SMALL", height: 55, weight: 1.0 }
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
addVariants(plants[15], "JADE", 499); // Jade Plant
addVariants(plants[16], "TULSI", 179); // Tulsi

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

export {
    mediaUrls, plants,
    plantSizeProfiles,
    plantVariants
};

