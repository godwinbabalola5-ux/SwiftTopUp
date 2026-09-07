// Detects the likely network from a Nigerian phone number's prefix.
//
// IMPORTANT CAVEAT: Nigeria has had Mobile Number Portability since 2013,
// meaning someone can keep their number after switching networks — an
// "0803" number might actually be on Glo now if the owner ported it.
// So this is a helpful default, NOT a guarantee. The UI should always
// let the user override the auto-detected network rather than lock it in.

const PREFIX_MAP = {

    mtn: [
        "0703", "0706", "0803", "0806",
        "0810", "0813", "0814", "0816",
        "0903", "0906", "0913", "0916"
    ],

    glo: [
        "0705", "0805", "0807",
        "0811", "0815", "0905", "0915"
    ],

    airtel: [
        "0701", "0708", "0802", "0808",
        "0812", "0901", "0902", "0904",
        "0907", "0911", "0912"
    ],

    "9mobile": [
        "0809", "0817", "0818", "0908", "0909"
    ]

};

// Flattened lookup table (prefix -> network) built once, not on every call.
const PREFIX_TO_NETWORK = {};

Object.entries(PREFIX_MAP).forEach(([network, prefixes]) => {
    prefixes.forEach((prefix) => {
        PREFIX_TO_NETWORK[prefix] = network;
    });
});

/**
 * Returns the detected network key ("mtn" | "glo" | "airtel" | "9mobile")
 * for a given phone number, or null if there's no confident match yet
 * (e.g. fewer than 4 digits typed, or an unrecognized prefix).
 */
export function detectNetworkFromPhone(phone) {

    if (!phone) return null;

    // Strip anything that isn't a digit, in case of spaces/dashes.
    const digitsOnly = phone.replace(/\D/g, "");

    if (digitsOnly.length < 4) return null;

    const prefix = digitsOnly.slice(0, 4);

    return PREFIX_TO_NETWORK[prefix] || null;

}
