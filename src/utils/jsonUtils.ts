export function extractSeriesData(json: any): any {
    const result: { [key: string]: any } = {};

    const seriesNameMapper: { [key: string]: string } = {
        'CPU': 'cpuUsage',
        'IOWait': 'IOwaitUsage',
        'Steal': 'stealUsage',
        'User': 'userUsage',
        'System': 'systemUsage',
        'RAM': 'ramUsage',
        'Swap': 'swapUsage',
        'Buffered': 'bufferedUsage',
        'Cached': 'cachedUsage',
        'In': 'networkIn',
        'Out': 'networkOut',
        'Disk': 'diskUsage'
    };

    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            const chartData = json[key];
            const seriesArray = chartData.series;

            seriesArray.forEach((series: any) => {
                const seriesName = series.name;
                const mappedSeriesName = seriesNameMapper[seriesName] || seriesName;
                const seriesData = series.data;

                result[mappedSeriesName] = seriesData;
            });
        }
    }

    return result;
}


export function compareUnixTimestamps(givenUnixTime: number): boolean {
    // Get current time in milliseconds
    const currentTimeMillis = Date.now();

    // Get the current time as a Date object
    const currentTime = new Date(currentTimeMillis);

    // Get the offset in minutes for the local timezone
    const offsetMinutes = currentTime.getTimezoneOffset();

    // Adjust the current time to UTC+00:00
    const adjustedTime = new Date(currentTimeMillis + (offsetMinutes * 60 * 1000));

    // Set the seconds to 0
    adjustedTime.setSeconds(0);

    // Get the Unix timestamp (in seconds)
    const calculatedUnixTimestamp = Math.floor(adjustedTime.getTime() / 1000);

    // Compare the given Unix timestamp with the calculated Unix timestamp
    if (givenUnixTime === calculatedUnixTimestamp) {
        return false;
    } else {
        return true;
    }
}