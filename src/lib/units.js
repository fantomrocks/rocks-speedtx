/**
 * Exports usual Fantom units and their conversion
 */

// how many WEIs are in single FTM token
export const WEI_IN_FTM = 1000000000000000000;


/**
 * Convert WEI value to FTM
 *
 * @param {number} value
 * @returns {number}
 */
export function weiToFtm(value) {
    return value / WEI_IN_FTM;
}

/**
 * Convert WEI value to FTM and return formatted string
 *
 * @param {number} value
 * @returns {string}
 */
export function formatWeiToFtm(value) {
    return (Math.round((value / WEI_IN_FTM) * 100) / 100).toFixed(2);
}

/**
 * Convert FTM value to WEI for sending
 *
 * @param {number} value
 * @returns {number}
 */
export function ftmToWei(value) {
    return value * WEI_IN_FTM;
}
