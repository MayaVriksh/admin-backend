// Name Field Constants
const FIRST_NAME = "firstName";
const LAST_NAME = "lastName";

// Address Field Constants
const STREET_ADDRESS = "streetAddress";
const LANDMARK = "landmark";
const CITY = "city";
const STATE = "state";
const COUNTRY = "country";
const PIN_CODE = "pinCode";
const LATITUDE = "latitude";
const LONGITUDE = "longitude";

// Grouped Address Fields
const ADDRESS_FIELDS = [
    STREET_ADDRESS,
    LANDMARK,
    CITY,
    STATE,
    COUNTRY,
    PIN_CODE,
    LATITUDE,
    LONGITUDE
];

// Product Type Constants
const PRODUCT_TYPES = {
    PLANT: "PLANT",
    PLANT_VARIANT: "PLANT_VARIANT",
    PLANT_SIZE: "PLANT_SIZE",
    POT: "POT",
    POT_VARIANT: "POT_VARIANT"
};

// Media Type Constants
const MEDIA_TYPES = {
    IMAGE: "IMAGE",
    VIDEO: "VIDEO",
    DOCUMENT: "DOCUMENT"
};

module.exports = {
    FIRST_NAME,
    LAST_NAME,
    STREET_ADDRESS,
    LANDMARK,
    CITY,
    STATE,
    COUNTRY,
    PIN_CODE,
    LATITUDE,
    LONGITUDE,
    ADDRESS_FIELDS,
    PRODUCT_TYPES,
    MEDIA_TYPES
};
