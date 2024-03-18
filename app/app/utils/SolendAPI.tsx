import * as constant from "../utils/constants.json";  

export async function getCurrentAPR(): Promise<string> {
    const apiUrl = `https://api.solend.fi/v1/reserves/historical-interest-rates?ids=${constant.RESERVE_ACCOUNT_ID}&span=1w`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const historicalRates = data?.[constant.RESERVE_ACCOUNT_ID];
        const supplyAPR = historicalRates[historicalRates.length - 1].supplyAPR;
        const supplyAPRPercentage = supplyAPR * 100;
        return supplyAPRPercentage.toFixed(2);
    } catch (error) {
        console.error('Error fetching data from Solend API:', error);
        throw error;
    }
}