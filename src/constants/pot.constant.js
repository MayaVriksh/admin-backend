// This file holds the static, curated list of compatible pots for each plant size.
// This data is managed directly by developers and is not stored in the database.

const potData = {
    EXTRA_SMALL: {
        size: "EXTRA_SMALL",
        potTypes: [
            {
                potTypeId: "pt_basic_xs",
                potTypeName: "Basic",
                variants: [
                    {
                        variantId: "var_basic_white_xs",
                        color: {
                            id: "clr_white",
                            name: "White",
                            hexCode: "#FFFFFF"
                        },
                        price: 100,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    },
                    {
                        variantId: "var_basic_black_xs",
                        color: {
                            id: "clr_black",
                            name: "Black",
                            hexCode: "#000000"
                        },
                        price: 110,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    },
                    {
                        variantId: "var_basic_gray_xs",
                        color: {
                            id: "clr_gray",
                            name: "Gray",
                            hexCode: "#808080"
                        },
                        price: 120,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_standard_xs",
                potTypeName: "Standard",
                variants: [
                    {
                        variantId: "var_std_blue_xs",
                        color: {
                            id: "clr_blue",
                            name: "Blue",
                            hexCode: "#0000FF"
                        },
                        price: 160,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    },
                    {
                        variantId: "var_std_green_xs",
                        color: {
                            id: "clr_green",
                            name: "Green",
                            hexCode: "#008000"
                        },
                        price: 170,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_premium_xs",
                potTypeName: "Premium",
                variants: [
                    {
                        variantId: "var_prem_gold_xs",
                        color: {
                            id: "clr_gold",
                            name: "Gold",
                            hexCode: "#FFD700"
                        },
                        price: 220,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    },
                    {
                        variantId: "var_prem_silver_xs",
                        color: {
                            id: "clr_silver",
                            name: "Silver",
                            hexCode: "#C0C0C0"
                        },
                        price: 210,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_exclusive_xs",
                potTypeName: "Exclusive",
                variants: [
                    {
                        variantId: "var_excl_marble_xs",
                        color: {
                            id: "clr_marble",
                            name: "Marble",
                            hexCode: "#E5E4E2"
                        },
                        price: 350,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_ecofriendly_xs",
                potTypeName: "Eco Friendly",
                variants: [
                    {
                        variantId: "var_eco_brown_xs",
                        color: {
                            id: "clr_brown",
                            name: "Brown",
                            hexCode: "#8B4513"
                        },
                        price: 130,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_general_xs",
                potTypeName: "General",
                variants: [
                    {
                        variantId: "gen_free_pot_xs",
                        color: { id: "clr_basic", name: "Basic Pot" },
                        price: 0,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    SMALL: {
        size: "SMALL",
        potTypes: [
            {
                potTypeId: "pt_basic_sml",
                potTypeName: "Basic",
                variants: [
                    {
                        variantId: "var_basic_white_sml",
                        color: { id: "clr_white", name: "White" },
                        price: 150,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_standard_sml",
                potTypeName: "Standard",
                variants: [
                    {
                        variantId: "var_std_green_sml",
                        color: { id: "clr_green", name: "Green" },
                        price: 200,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_premium_sml",
                potTypeName: "Premium",
                variants: [
                    {
                        variantId: "var_prem_gold_sml",
                        color: { id: "clr_gold", name: "Gold" },
                        price: 280,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_exclusive_sml",
                potTypeName: "Exclusive",
                variants: [
                    {
                        variantId: "var_excl_marble_sml",
                        color: { id: "clr_marble", name: "Marble" },
                        price: 400,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_ecofriendly_sml",
                potTypeName: "Eco Friendly",
                variants: [
                    {
                        variantId: "var_eco_brown_sml",
                        color: { id: "clr_brown", name: "Brown" },
                        price: 180,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_general_sml",
                potTypeName: "General",
                variants: [
                    {
                        variantId: "gen_free_pot_sml",
                        color: { id: "clr_basic", name: "Basic Pot" },
                        price: 0,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    MEDIUM: {
        size: "MEDIUM",
        potTypes: [
            {
                potTypeId: "pt_basic_med",
                potTypeName: "Basic",
                variants: [
                    {
                        variantId: "var_basic_white_med",
                        color: { id: "clr_white", name: "White" },
                        price: 200,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_standard_med",
                potTypeName: "Standard",
                variants: [
                    {
                        variantId: "var_std_green_med",
                        color: { id: "clr_green", name: "Green" },
                        price: 250,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_premium_med",
                potTypeName: "Premium",
                variants: [
                    {
                        variantId: "var_prem_gold_med",
                        color: { id: "clr_gold", name: "Gold" },
                        price: 350,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_exclusive_med",
                potTypeName: "Exclusive",
                variants: [
                    {
                        variantId: "var_excl_marble_med",
                        color: { id: "clr_marble", name: "Marble" },
                        price: 500,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_ecofriendly_med",
                potTypeName: "Eco Friendly",
                variants: [
                    {
                        variantId: "var_eco_brown_med",
                        color: { id: "clr_brown", name: "Brown" },
                        price: 230,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_general_med",
                potTypeName: "General",
                variants: [
                    {
                        variantId: "gen_free_pot_med",
                        color: { id: "clr_basic", name: "Basic Pot" },
                        price: 0,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    LARGE: {
        size: "LARGE",
        potTypes: [
            {
                potTypeId: "pt_basic_lrg",
                potTypeName: "Basic",
                variants: [
                    {
                        variantId: "var_basic_white_lrg",
                        color: { id: "clr_white", name: "White" },
                        price: 280,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_standard_lrg",
                potTypeName: "Standard",
                variants: [
                    {
                        variantId: "var_std_green_lrg",
                        color: { id: "clr_green", name: "Green" },
                        price: 340,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_premium_lrg",
                potTypeName: "Premium",
                variants: [
                    {
                        variantId: "var_prem_gold_lrg",
                        color: { id: "clr_gold", name: "Gold" },
                        price: 450,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_exclusive_lrg",
                potTypeName: "Exclusive",
                variants: [
                    {
                        variantId: "var_excl_marble_lrg",
                        color: { id: "clr_marble", name: "Marble" },
                        price: 650,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_ecofriendly_lrg",
                potTypeName: "Eco Friendly",
                variants: [
                    {
                        variantId: "var_eco_brown_lrg",
                        color: { id: "clr_brown", name: "Brown" },
                        price: 320,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_general_lrg",
                potTypeName: "General",
                variants: [
                    {
                        variantId: "gen_free_pot_lrg",
                        color: { id: "clr_basic", name: "Basic Pot" },
                        price: 0,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    EXTRA_LARGE: {
        size: "EXTRA_LARGE",
        potTypes: [
            {
                potTypeId: "pt_basic_xl",
                potTypeName: "Basic",
                variants: [
                    {
                        variantId: "var_basic_white_xl",
                        color: { id: "clr_white", name: "White" },
                        price: 350,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_standard_xl",
                potTypeName: "Standard",
                variants: [
                    {
                        variantId: "var_std_green_xl",
                        color: { id: "clr_green", name: "Green" },
                        price: 420,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_premium_xl",
                potTypeName: "Premium",
                variants: [
                    {
                        variantId: "var_prem_gold_xl",
                        color: { id: "clr_gold", name: "Gold" },
                        price: 550,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_exclusive_xl",
                potTypeName: "Exclusive",
                variants: [
                    {
                        variantId: "var_excl_marble_xl",
                        color: { id: "clr_marble", name: "Marble" },
                        price: 800,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_ecofriendly_xl",
                potTypeName: "Eco Friendly",
                variants: [
                    {
                        variantId: "var_eco_brown_xl",
                        color: { id: "clr_brown", name: "Brown" },
                        price: 400,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            },
            {
                potTypeId: "pt_general_xl",
                potTypeName: "General",
                variants: [
                    {
                        variantId: "gen_free_pot_xl",
                        color: { id: "clr_basic", name: "Basic Pot" },
                        price: 0,
                        images: [
                            {
                                mediaUrl:
                                    "https://res.cloudinary.com/dwdu18hzs/image/upload/v1757598217/suppliers/QC_PCOD-25-ABF9637-0046/qc_1757598215275_0_1757598215276.avif"
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

const getPot = () => potData;

module.exports = getPot;
