const sunlightData = [
    {
        typeName: "Full Sun",
        mediaUrl:
            "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724474/Gemini_Generated_Image_kvy73ikvy73ikvy7_ood5aj.png",
        publicId: "fullsun01",
        description: "Plants require at least 6 hours of direct sunlight"
    },
    {
        typeName: "Partial Shade",
        mediaUrl:
            "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724476/Gemini_Generated_Image_9gw2kd9gw2kd9gw2_hpob1u.png",
        publicId: "partialshade01",
        description: "Plants prefer 3-6 hours of sunlight"
    }
];

const humidityData = [
    {
        level: "High",
        description: "70-90% humidity",
        suitableZones: "Tropical, Subtropical"
    },
    {
        level: "Medium",
        description: "40-60% humidity",
        suitableZones: "Temperate"
    }
];

module.exports = {
    sunlightData,
    humidityData
};
