const { v4: uuidv4 } = require("uuid");

const fertilizerTypes = [
    "Nitrogen",
    "Phosphorus",
    "Potassium",
    "Organic",
    "Micronutrient"
];
const fertilizerNames = [
    "GrowMax",
    "GreenBoost",
    "RootPower",
    "LeafRich",
    "FruitPlus",
    "BloomPro",
    "EcoFert",
    "SuperGrow",
    "PlantVital",
    "NatureBlend"
];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomComposition(type) {
    switch (type) {
        case "Nitrogen":
            return "N 30%, P 10%, K 10%";
        case "Phosphorus":
            return "N 10%, P 30%, K 10%";
        case "Potassium":
            return "N 10%, P 10%, K 30%";
        case "Organic":
            return "N 5%, P 5%, K 5% + Organic matter";
        case "Micronutrient":
            return "Zn 0.5%, Fe 0.5%, Mn 0.5%";
        default:
            return "N 10%, P 10%, K 10%";
    }
}

function generateFertilizers(count = 20) {
    const fertilizers = [];

    for (let i = 0; i < count; i++) {
        const type = getRandomElement(fertilizerTypes);
        const name = `${getRandomElement(fertilizerNames)} ${i + 1}`;
        fertilizers.push({
            fertilizerId: uuidv4(),
            name,
            type,
            composition: getRandomComposition(type),
            description: `This ${type.toLowerCase()} fertilizer enhances plant growth.`,
            caution: "Use as directed. Avoid contact with skin and eyes.",
            isEcoFriendly: Math.random() > 0.3 // ~70% chance of eco-friendly
        });
    }

    return fertilizers;
}

module.exports = generateFertilizers;
