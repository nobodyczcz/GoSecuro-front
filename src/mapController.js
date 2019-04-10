

class MapController {
    constructor() {

    };

    clearMap(map) {
        //Clear all crime rate from map
        map.data.forEach(function (feature) {
            // filter...
            map.data.remove(feature);
        });
    };

    displayAllCrime(map, data) {
        //this.clearMap(map)
        //this.displayColor(map, data)
        //clear previous data on map

        //I deleted clear data part. As we need to keep adding new data to map. 
        //This precess doesn't need to clear previous data. 
        //In this process clear will make existing data been cleared and displayed again and again.
        //Keep wasting processing resource.
        //Clear will be done by when user switch diaplay mode.

        //Display high crime places only
        var newdata = {
            'type': 'FeatureCollection',
            'features': []
        };
        console.log(data)
        for (var i = 0; i < data.features.length; i++) {
            if (data.features[i].properties.crimeRate > 0) {
                newdata.features.push(data.features[i]);
            }
        }
        console.log(newdata)

        map.data.addGeoJson(newdata)
        this.displayColor(map, newdata)

    };

    displayHighCrimeOnly(map, data) {
        //clear previous data on map

        //I deleted clear data part. As we need to keep adding new data to map. 
        //This precess doesn't need to clear previous data. 
        //In this process clear will make existing data been cleared and displayed again and again.
        //Keep wasting processing resource.
        //Clear will be done by when user switch diaplay mode.

        //Display high crime places only
        var newdata = {
            'type': 'FeatureCollection',
            'features': []
        };
        console.log(data)
        for (var i = 0; i < data.features.length; i++) {
            if (data.features[i].properties.crimeRate > 0.6) {
                newdata.features.push(data.features[i]);
            }
        }
        console.log(newdata)

        map.data.addGeoJson(newdata)
        this.displayColor(map, newdata)
    };

    displayColor(map, data) {

        map.data.addGeoJson(data)
        map.data.setStyle(function (feature) {
            // 1st quantile data cr=[0,0.01526)
            if (feature.getProperty('crimeRate') >= 0 && feature.getProperty('crimeRate') <= 0.01526) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#00FF00",
                    fillOpacity: 0.5
                }
            }

            // 2nd quantile data cr=[0.01526,0.02344)
            if (feature.getProperty('crimeRate') >= 0.01526 && feature.getProperty('crimeRate') <= 0.02344) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#00FF00",
                    fillOpacity: 0.4
                }
            }

            // 3rd quantile data cr=[0.02344,0.0323)
            if (feature.getProperty('crimeRate') >= 0.02344 && feature.getProperty('crimeRate') <= 0.0323) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#00FF00",
                    fillOpacity: 0.3
                }
            }
            // 4th quantile data cr=[0.0323,0.0405)
            if (feature.getProperty('crimeRate') >= 0.0323 && feature.getProperty('crimeRate') <= 0.0405) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#00FF00",
                    fillOpacity: 0.2
                }
            }
            // 5th quantile data cr=[0.0405,0.0506)
            if (feature.getProperty('crimeRate') >= 0.0405 && feature.getProperty('crimeRate') <= 0.0506) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#00FF00",
                    fillOpacity: 0.1
                }
            }
            // 6th quantile data cr=[0.0506,0.0625)
            if (feature.getProperty('crimeRate') >= 0.0506 && feature.getProperty('crimeRate') <= 0.0625) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#ff2600",
                    fillOpacity: 0.1
                }
            }
            // 7th quantile data cr=[0.0625,0.0769)
            if (feature.getProperty('crimeRate') >= 0.0625 && feature.getProperty('crimeRate') <= 0.0769) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#ff2600",
                    fillOpacity: 0.2
                }
            }
            // 8th quantile data cr=[0.0769,0.10208)
            if (feature.getProperty('crimeRate') >= 0.0769 && feature.getProperty('crimeRate') <= 0.10208) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#ff2600",
                    fillOpacity: 0.3
                }
            }
            // 9th quantile data cr=[0.10208,0.1529)
            if (feature.getProperty('crimeRate') >= 0.10208 && feature.getProperty('crimeRate') <= 0.1529) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#ff2600",
                    fillOpacity: 0.4
                }
            }
            // 10th quantile data cr=[0.1529,15.5714)
            if (feature.getProperty('crimeRate') >= 0.1529 && feature.getProperty('crimeRate') <= 15.5714) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#ff2600",
                    fillOpacity: 0.5
                }
            }
        })

    };

}


export default MapController;