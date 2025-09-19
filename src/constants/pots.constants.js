const Size = {
    EXTRA_SMALL: "EXTRA_SMALL",
    SMALL: "SMALL",
    MEDIUM: "MEDIUM",
    LARGE: "LARGE",
    EXTRA_LARGE: "EXTRA_LARGE"
};

// Cloudinary images
const cloudinaryImages = [
    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724481/Gemini_Generated_Image_11rm3m11rm3m11rm_fnxgte.png",
    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724476/Gemini_Generated_Image_b4x9isb4x9isb4x9_x5zifm.png",
    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724476/Gemini_Generated_Image_9gw2kd9gw2kd9gw2_hpob1u.png",
    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724476/Gemini_Generated_Image_g8dcj4g8dcj4g8dc_a1js4a.png",
    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724474/Gemini_Generated_Image_kvy73ikvy73ikvy7_ood5aj.png",
    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724475/Gemini_Generated_Image_doqqbidoqqbidoqq_hdfhkb.png",
    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724474/Gemini_Generated_Image_ndidk6ndidk6ndid_rjyyvh.png",
    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756724474/Gemini_Generated_Image_7ckenr7ckenr7cke_cxjvil.png"
];

// Helper: pick Cloudinary image by index
function getImage(idx) {
    return cloudinaryImages[idx % cloudinaryImages.length];
}

// Main function to get all pot data
function getPotData() {
    return Object.values(Size).map((size) => ({
        size,
        potTypes: getPotTypesForSize(size)
    }));
}

// Reusable pot types for any size
function getPotTypesForSize(size) {
    const s = size.toLowerCase();
    let imgIndex = 0;

    return [
        {
            potTypeId: 1,
            potTypeName: "Basic",
            variants: [
                {
                    variantId: `var_basic_white_${s}`,
                    color: {
                        id: "clr_white",
                        name: "White",
                        hexCode: "#FFFFFF"
                    },
                    price: 100,
                    images: [
                        {
                            id: `img_basic_white_1_${s}`,
                            mediaUrl: getImage(imgIndex++),
                            mediaType: "image",
                            isPrimary: true
                        }
                    ]
                },
                {
                    variantId: `var_basic_black_${s}`,
                    color: {
                        id: "clr_black",
                        name: "Black",
                        hexCode: "#000000"
                    },
                    price: 110,
                    images: [
                        {
                            id: `img_basic_black_1_${s}`,
                            mediaUrl: getImage(imgIndex++),
                            mediaType: "image",
                            isPrimary: true
                        }
                    ]
                },
                {
                    variantId: `var_basic_gray_${s}`,
                    color: { id: "clr_gray", name: "Gray", hexCode: "#808080" },
                    price: 120,
                    images: [
                        {
                            id: `img_basic_gray_1_${s}`,
                            mediaUrl: getImage(imgIndex++),
                            mediaType: "image",
                            isPrimary: true
                        }
                    ]
                }
            ]
        },
        {
            potTypeId: 2,
            potTypeName: "Standard",
            variants: [
                {
                    variantId: `var_standard_white_${s}`,
                    color: {
                        id: "clr_white",
                        name: "White",
                        hexCode: "#FFFFFF"
                    },
                    price: 150,
                    images: [
                        {
                            id: `img_standard_white_1_${s}`,
                            mediaUrl: getImage(imgIndex++),
                            mediaType: "image",
                            isPrimary: true
                        }
                    ]
                },
                {
                    variantId: `var_standard_blue_${s}`,
                    color: { id: "clr_blue", name: "Blue", hexCode: "#0000FF" },
                    price: 160,
                    images: [
                        {
                            id: `img_standard_blue_1_${s}`,
                            mediaUrl: getImage(imgIndex++),
                            mediaType: "image",
                            isPrimary: true
                        }
                    ]
                },
                {
                    variantId: `var_standard_green_${s}`,
                    color: {
                        id: "clr_green",
                        name: "Green",
                        hexCode: "#008000"
                    },
                    price: 170,
                    images: [
                        {
                            id: `img_standard_green_1_${s}`,
                            mediaUrl: getImage(imgIndex++),
                            mediaType: "image",
                            isPrimary: true
                        }
                    ]
                }
            ]
        },
        {
            potTypeId: 3,
            potTypeName: "Premium",
            variants: [
                {
                    variantId: `var_premium_black_${s}`,
                    color: {
                        id: "clr_black",
                        name: "Black",
                        hexCode: "#000000"
                    },
                    price: 200,
                    images: [
                        {
                            id: `img_premium_black_1_${s}`,
                            mediaUrl: getImage(imgIndex++),
                            mediaType: "image",
                            isPrimary: true
                        }
                    ]
                },
                {
                    variantId: `var_premium_gold_${s}`,
                    color: { id: "clr_gold", name: "Gold", hexCode: "#FFD700" },
                    price: 220,
                    images: [
                        {
                            id: `img_premium_gold_1_${s}`,
                            mediaUrl: getImage(imgIndex++),
                            mediaType: "image",
                            isPrimary: true
                        }
                    ]
                },
                {
                    variantId: `var_premium_silver_${s}`,
                    color: {
                        id: "clr_silver",
                        name: "Silver",
                        hexCode: "#C0C0C0"
                    },
                    price: 210,
                    images: [
                        {
                            id: `img_premium_silver_1_${s}`,
                            mediaUrl: getImage(imgIndex++),
                            mediaType: "image",
                            isPrimary: true
                        }
                    ]
                }
            ]
        },
        {
            potTypeId: 4,
            potTypeName: "Exclusive",
            variants: [
                {
                    variantId: `var_exclusive_black_${s}`,
                    color: {
                        id: "clr_black",
                        name: "Black",
                        hexCode: "#000000"
                    },
                    price: 300,
                    images: [
                        {
                            id: `img_exclusive_black_1_${s}`,
                            mediaUrl: getImage(imgIndex++),
                            mediaType: "image",
                            isPrimary: true
                        }
                    ]
                },
                {
                    variantId: `var_exclusive_marble_${s}`,
                    color: {
                        id: "clr_marble",
                        name: "Marble",
                        hexCode: "#E5E4E2"
                    },
                    price: 350,
                    images: [
                        {
                            id: `img_exclusive_marble_1_${s}`,
                            mediaUrl: getImage(imgIndex++),
                            mediaType: "image",
                            isPrimary: true
                        }
                    ]
                }
            ]
        },
        {
            potTypeId: 5,
            potTypeName: "EcoFriendly",
            variants: [
                {
                    variantId: `var_ecofriendly_brown_${s}`,
                    color: {
                        id: "clr_brown",
                        name: "Brown",
                        hexCode: "#8B4513"
                    },
                    price: 130,
                    images: [
                        {
                            id: `img_ecofriendly_brown_1_${s}`,
                            mediaUrl: getImage(imgIndex++),
                            mediaType: "image",
                            isPrimary: true
                        }
                    ]
                },
                {
                    variantId: `var_ecofriendly_green_${s}`,
                    color: {
                        id: "clr_green",
                        name: "Green",
                        hexCode: "#008000"
                    },
                    price: 140,
                    images: [
                        {
                            id: `img_ecofriendly_green_1_${s}`,
                            mediaUrl: getImage(imgIndex++),
                            mediaType: "image",
                            isPrimary: true
                        }
                    ]
                }
            ]
        },
        {
            potTypeId: 6,
            potTypeName: "Extra Ordinary",
            variants: [
                {
                    variantId: `var_extraordinary_red_${s}`,
                    color: { id: "clr_red", name: "Red", hexCode: "#FF0000" },
                    price: 400,
                    images: [
                        {
                            id: `img_extraordinary_red_1_${s}`,
                            mediaUrl: getImage(imgIndex++),
                            mediaType: "image",
                            isPrimary: true
                        }
                    ]
                },
                {
                    variantId: `var_extraordinary_blue_${s}`,
                    color: { id: "clr_blue", name: "Blue", hexCode: "#0000FF" },
                    price: 420,
                    images: [
                        {
                            id: `img_extraordinary_blue_1_${s}`,
                            mediaUrl: getImage(imgIndex++),
                            mediaType: "image",
                            isPrimary: true
                        }
                    ]
                },
                {
                    variantId: `var_extraordinary_black_${s}`,
                    color: {
                        id: "clr_black",
                        name: "Black",
                        hexCode: "#000000"
                    },
                    price: 450,
                    images: [
                        {
                            id: `img_extraordinary_black_1_${s}`,
                            mediaUrl: getImage(imgIndex++),
                            mediaType: "image",
                            isPrimary: true
                        }
                    ]
                }
            ]
        }
    ];
}

module.exports = getPotData;
