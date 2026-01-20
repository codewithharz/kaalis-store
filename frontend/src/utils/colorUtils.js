/**
 * Utility for color mapping and parsing
 */

export const COLOR_MAP = {
    '#000000': 'Black',
    '#ffffff': 'White',
    '#ff0000': 'Red',
    '#00ff00': 'Green',
    '#0000ff': 'Blue',
    '#ffff00': 'Yellow',
    '#ffa500': 'Orange',
    '#800080': 'Purple',
    '#ffc0cb': 'Pink',
    '#a52a2a': 'Brown',
    '#808080': 'Grey',
    '#c0c0c0': 'Silver',
    '#ffd700': 'Gold',
    '#000080': 'Navy',
    '#1a1a1a': 'Obsidian Black',
    '#f5f5f5': 'Arctic White',
    '#36454f': 'Charcoal',
    '#008080': 'Teal',
    '#e6e6fa': 'Lavender',
    '#f0e68c': 'Khaki',
    '#800000': 'Maroon',
    '#ff7f50': 'Coral',
    '#40e0d0': 'Turquoise',
    '#ee82ee': 'Violet',
    '#f5f5dc': 'Beige',
    '#faebd7': 'Antique White',
    '#00ffff': 'Cyan',
    '#ff00ff': 'Magenta',
    '#7fffd4': 'Aquamarine',
    '#f0ffff': 'Azure',
    '#f5f5f5': 'White Smoke',
    '#fff0f5': 'Lavender Blush',
    '#ffe4e1': 'Misty Rose',
    '#ffebcd': 'Blanched Almond',
    '#ffdead': 'Navajo White',
    '#fdf5e6': 'Old Lace',
    '#faf0e6': 'Linen',
    '#fff5ee': 'Seashell',
    '#fffaf0': 'Floral White',
    '#fffff0': 'Ivory',
    '#f0f8ff': 'Alice Blue',
    '#f8f8ff': 'Ghost White',
    '#f0fff0': 'Honeydew',
    '#f5fffa': 'Mint Cream',
    '#fffafa': 'Snow',
    '#708090': 'Slate Grey',
    '#2f4f4f': 'Dark Slate Grey',
    '#556b2f': 'Dark Olive Green',
    '#6b8e23': 'Olive Drab',
    '#808000': 'Olive',
    '#bdb76b': 'Dark Khaki',
    '#eee8aa': 'Pale Goldenrod',
    '#fff8dc': 'Cornsilk',
    '#fafad2': 'Light Goldenrod Yellow',
    '#ffffe0': 'Light Yellow',
    '#ffefd5': 'Papaya Whip',
    '#ffe4b5': 'Moccasin',
    '#ffdab9': 'Peach Puff',
    '#ffd1dc': 'Cherry Blossom Pink',
    '#ff1493': 'Deep Pink',
    '#ff69b4': 'Hot Pink',
    '#ffb6c1': 'Light Pink',
    '#db7093': 'Pale Violet Red',
    '#c71585': 'Medium Violet Red',
    '#e9967a': 'Dark Salmon',
    '#ffa07a': 'Light Salmon',
    '#ff8c00': 'Dark Orange',
    '#ff4500': 'Orange Red',
    '#ff6347': 'Tomato',
    '#dc143c': 'Crimson',
    '#b22222': 'Fire Brick',
    '#8b0000': 'Dark Red',
    '#a0522d': 'Sienna',
    '#8b4513': 'Saddle Brown',
    '#d2691e': 'Chocolate',
    '#cd853f': 'Peru',
    '#f4a460': 'Sandy Brown',
    '#deb887': 'Burly Wood',
    '#d2b48c': 'Tan',
    '#bc8f8f': 'Rosy Brown',
    '#e06666': 'Light Red',
    '#ea9999': 'Soft Red',
    '#f4cccc': 'Very Light Red',
    '#fce5cd': 'Light Orange',
    '#fff2cc': 'Light Yellow',
    '#d9ead3': 'Light Green',
    '#d0e0e3': 'Light Cyan',
    '#cfe2f3': 'Light Blue',
    '#d9d2e9': 'Light Purple',
    '#ead1dc': 'Light Magenta'
};

const REVERSE_COLOR_MAP = {};
Object.entries(COLOR_MAP).forEach(([hex, name]) => {
    REVERSE_COLOR_MAP[name.toLowerCase()] = hex;
});

/**
 * Parses a color input string and returns color data.
 * Supports: "Name | #Hex", "#Hex", "Color Name"
 * @param {string} input 
 * @param {string} defaultName 
 * @param {string} defaultHex 
 * @returns {{name: string, hexCode: string}}
 */
export const parseColorValue = (input, defaultName = 'Variant Color', defaultHex = '#000000') => {
    if (!input) return { name: defaultName, hexCode: defaultHex };

    const trimmedInput = input.trim();

    // Format: "Name | #Hex"
    if (trimmedInput.includes('|')) {
        const [name, hex] = trimmedInput.split('|').map(s => s.trim());
        return {
            name: name || defaultName,
            hexCode: hex && hex.startsWith('#') ? hex : defaultHex
        };
    }

    // Format: "#Hex"
    if (trimmedInput.startsWith('#')) {
        const hex = trimmedInput.toLowerCase();
        // Try to find a exact match or use default
        const name = COLOR_MAP[hex] || defaultName;
        return { name: name, hexCode: trimmedInput };
    }

    // Format: "ColorName"
    const name = trimmedInput;
    const mappedHex = REVERSE_COLOR_MAP[name.toLowerCase()];
    return { name: name, hexCode: mappedHex || defaultHex };
};

/**
 * Gets a human readable name for a hex code
 * @param {string} hex 
 * @returns {string}
 */
export const getColorName = (hex) => {
    if (!hex) return 'Default';
    return COLOR_MAP[hex.toLowerCase()] || 'Custom Color';
};

/**
 * Gets a list of all predefined colors for UI selection
 * @returns {Array<{name: string, hexCode: string}>}
 */
export const getAllColors = () => {
    return Object.entries(COLOR_MAP).map(([hex, name]) => ({
        hexCode: hex,
        name: name
    }));
};

/**
 * Checks if a hex code matches any predefined color
 * @param {string} hex 
 * @returns {boolean}
 */
export const isColorPreset = (hex) => {
    if (!hex) return false;
    return !!COLOR_MAP[hex.toLowerCase()];
};
