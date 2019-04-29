

class MapController {
    constructor() {
        this.heatmap = null;
        this.cameras = [];
        this.icon = null;

        this.cameraLocations = [
            [-37.814050, 144.944293, 'Security - Safe City - Camera # 48:' + "<br>" + 'Harbour ESP SE Corner West Wharf'],
            [-37.814915, 144.944658, 'Security - Safe City - Camera # 47:' + "<br>" + 'Corner Latrobe St/ Harbour Esp'],
            [-37.815852, 144.944615, 'Security - Safe City - Camera # 46:' + "<br>" + ' Harbour Esp SE Crn Center Wharf'],
            [-37.819342, 144.946590, 'Security - Safe City - Camera # 45:' + "<br>" + ' Harbour Esp NW Nab Building'],
            [-37.815274, 144.952568, 'Security - Safe City - Camera # 44:' + "<br>" + ' Cnr Spencer St/Lonsdale St'],
            [-37.816988, 144.953272, 'Security - Safe City - Camera # 43:' + "<br>" + ' Corner Spencer St/ Bourke St'],
            [-37.821075, 144.955079, 'Security - Safe City - Camera # 42:' + "<br>" + ' Corner Flinders St/Spencer St'],
            [-37.822516, 144.955798, 'Camera 56:' + "<br>" + ' Spencer St (Batman Park)'],
            [-37.823609, 144.956259, 'Security - Safe City - Camera # 49:' + "<br>" + ' Clarendon Street Opposite Convention Center'],
            [-37.814463, 144.954783, 'Security - Safe City - Camera 1:' + "<br>" + 'Lonsdale Street & King Street'],
            [-37.815336, 144.955287, 'Security - Safe City - Camera 2:' + "<br>" + 'Outside 212 King Street'],
            [-37.815548, 144.955126, 'Security - Safe City - Camera 3:' + "<br>" + 'Little Bourke Street & King Street'],
            [-37.816319, 144.955684, 'Security - Safe City - Camera 4:' + "<br>" + 'Bourke Street & King'],
            [-37.816319, 144.955684, 'Security - Safe City - Camera 5:' + "<br>" + 'Little Collins Street & King Street'],
            [-37.818534, 144.956592, 'Security - Safe City - Camera 6:' + "<br>" + 'Collins Street & King Street'],
            [-37.818670, 144.956613, 'Security - Safe City - Camera 7:' + "<br>" + 'Outside 55 King Street'],
            [-37.819187, 144.957117, 'Security - Safe City - Camera 700:' + "<br>" + 'Taxi Rank Outside 55 King Street.'],
            [-37.819506, 144.956967, 'Security - Safe City - Camera 8:' + "<br>" + 'Flinders Lane & King Street'],
            [-37.820345, 144.957525, 'Security - Safe City - Camera 9:' + "<br>" + 'Flinders Street & King Street'],
            [-37.822809, 144.958110, 'Security - Safe City - Camera # 50 :' + "<br>" + ' Crown Sign on King Street Bridge'],
            [-37.811698, 144.956391, 'Security - Safe City - Camera # 40:' + "<br>" + ' Corner Latrobe/William'],
            [-37.819521, 144.960118, 'Camera 60:' + "<br>" + ' Williams and Flinders St (South)'],
            [-37.821191, 144.961835, 'Security - Safe City - Camera # 51:' + "<br>" + ' Southbank Prom & Queen Brdg Square'],
            [-37.812921, 144.960520, 'Security - Safe city camera #39:' + "<br>" + 'Lonsdale/Hardware Lane'],
            [-37.814060, 144.960407, 'Security - Safe City - Camera # 55'],
            [-37.815086, 144.960466, 'Security - Safe City - Camera 30:' + "<br>" + ' Corner Queen and Bourke Street'],
            [-37.816459, 144.961337, 'Security - Safe City - Camera 29:' + "<br>" + ' Corner Queen and Little Collins Street'],
            [-37.819078, 144.962316, 'Security - Safe City - Camera 28:' + "<br>" + ' Corner Queen and Flinders Street'],
            [-37.820259, 144.962798, 'Security - Safe City - Camera # 52:' + "<br>" + ' Les Erdi Plaza/Nthbank'],
            [-37.810640, 144.961291, 'Security - Safe City Camera # 38:' + "<br>" + 'Latrobe and Elizabeth'],
            [-37.814386, 144.962911, 'Security - Safe City - Camera 20:' + "<br>" + 'Bourke Street & Elizabeth Street'],
            [-37.816230, 144.964093, 'Security - Safe City - Camera 23:' + "<br>" + 'Collins Street & Elizabeth Street'],
            [-37.817366, 144.964544, 'Security - Safe City - Camera 26:' + "<br>" + 'Corner Finders Lane and Elizabeth Street'],
            [-37.817521, 144.964113, 'Security - Safe City - Camera # 41:' + "<br>" + ' Corner Flinders La/Staughton Ally'],
            [-37.818344, 144.964861, 'Security - Safe City - Camera 22:' + "<br>" + 'Flinders Street & Elizabeth Street'],
            [-37.819621, 144.965136, 'Camera 61:' + "<br>" + ' North Bank, Flinders Walk'],
            [-37.820239, 144.965025, 'Camera 63:' + "<br>" + ' Southgate Ave and Southbank Junction'],
            [-37.813869, 144.964461, 'Security - Safe City - Camera 24:' + "<br>" + 'Bourke Street Mall'],
            [-37.809462, 144.963813, 'Security - Safe City - Camera 37:' + "<br>" + ' Corner Latrobe and Swanston Street'],
            [-37.810869, 144.964446, 'Security - Safe City - Camera 21:' + "<br>" + 'Little Lonsdale Street & Swanston Street'],
            [-37.811844, 144.964779, 'Security - Safe City - Camera 32:' + "<br>" + ' Corner Lonsdale and Swanston Street'],
            [-37.813607, 144.965519, 'Security - Safe City - Camera 19:' + "<br>" + 'Bourke Street & Swanston Street'],
            [-37.814624, 144.966077, 'Security - Safe City - Camera 17:' + "<br>" + 'Little Collins Street & Swanston Street'],
            [-37.815895, 144.966678, 'Security - Safe City - Camera 25:' + "<br>" + ' Corner Swanston and Collins Street'],
            [-37.816632, 144.967032, 'Security - Safe City - Camera 13:' + "<br>" + 'Flinders Lane & Swanston Street'],
            [-37.817631, 144.967354, 'Security - Safe City - Camera 16:' + "<br>" + 'Flinders Street & Swanston Street'],
            [-37.817606, 144.967618, 'Security - Safe City - Camera 14:' + "<br>" + 'Flinders Street Station steps'],
            [-37.818721, 144.967790, 'Security - Safe City - Camera 1600:' + "<br>" + 'Taxi Rank Outside Flinders Street Station.'],
            [-37.819908, 144.968267, 'Security - Safe City - Camera # 53:' + "<br>" + ' Riverside/St Kilds Road Bridge'],
            [-37.810799, 144.967080, 'Security - Safe City - Camera 15:' + "<br>" + 'Lonsdale Street & Russell Street'],
            [-37.811956, 144.967753, 'Security - Safe City - Camera 12:' + "<br>" + 'Little Bourke Street & Russell Street'],
            [-37.813187, 144.968173, 'Security - Safe City - Camera 11:' + "<br>" + 'Bourke Street & Russell Street'],
            [-37.814658, 144.968908, 'Security - Safe City - Camera 31:' + "<br>" + 'Corner Collins and Russell Street'],
            [-37.816586, 144.970057, 'Security - Safe City - Camera 27:' + "<br>" + ' Corner Flinders Street and Russell Street'],
            [-37.818773, 144.972134, 'Security - Safe City - Camera # 54:' + "<br>" + ' Birranrung Marr'],
            [-37.810026, 144.969600, 'Security - Safe City - Camera 36:' + "<br>" + ' Corner Exhbition and Lonsdale Street'],
            [-37.812065, 144.970551, 'Security - Safe City - Camera 35:' + "<br>" + ' Corner Exhibition and Bourke Street'],
            [-37.814065, 144.971581, 'Security - Safe City - Camera 33:' + "<br>" + ' Corner Collins and Exhibition Street'],
            [-37.811798, 144.972118, 'Security - Safe City - Camera 1800:' + "<br>" + 'Taxi Rank 40 Bourke Street.'],
            [-37.811675, 144.972543, 'Security - Safe City - Camera 18:' + "<br>" + 'Bourke Street & Spring Street'],
            [-37.813201, 144.973841, 'Security - Safe City - Camera 34:' + "<br>" + ' Corner Spring and Collins (VicRoads Pole)']


        ];

    };
    showLight(map, data) {
        if (this.heatmap) {
            this.heatmap.setMap(map);
        }
        else {
            var heatmapData = []
            var lightData = data
            for (var i in lightData) {
                var lat = lightData[i]['lat']
                var log = lightData[i]['log']
                var lux = lightData[i]['lux']
                if (lux > 10) {
                    lux = 10
                }
                var temp = { location: new window.google.maps.LatLng(lat, log), weight: lux }

                heatmapData.push(temp)
            }
            //var heatmapData = data
            this.heatmap = new window.google.maps.visualization.HeatmapLayer({
                data: heatmapData,
                opacity: 0.6
            });
            this.heatmap.setMap(map);
        }
       
    }

    clearLight() {
        if (this.heatmap) {
            this.heatmap.setMap(null)

        }
    }

    ShowCamera(map, data) {
        this.cameras=[]
        var locations = data
        var infowindow = new window.google.maps.InfoWindow();
        if (!this.icon) {
            this.icon = {
                path: 'M16 3.33c2.58 0 4.67 2.09 4.67 4.67H22c0-3.31-2.69-6-6-6v1.33M16 6c1.11 0 2 .89 2 2h1.33c0-1.84-1.49-3.33-3.33-3.33V6.M17 9c0-1.11-.89-2-2-2V4H9L7.17 6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9h-5zm-5 10c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z',
                fillColor: '#ff7504',
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: '#ffffff',
                strokeOpacity: 1,
                size: new window.google.maps.Size(14, 14),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(7, 7),
            }
        }
        //var image = '<div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" 			    title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" 			    title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>'
        for (var i = 0; i < locations.length; i++) {
            var marker
            marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(locations[i][0], locations[i][1]),
                map: map,
                icon: this.icon
            });

            window.google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(locations[i][2])
                    infowindow.open(map, marker);
                }
            })(marker, i));
            this.cameras.push(marker)
        }
    }
    clearCamera() {
        this.cameras.forEach(function (camera){
            camera.setMap(null)
        })
    }

    clearMap(map) {
        //Clear all crime rate from map
        map.data.forEach(function (feature) {
            // filter...
            map.data.remove(feature);
        });
    };

    displayMediumToHighCrime(map, data) {

        //clear previous data on map

        //Display high crime places only
        var newdata = {
            'type': 'FeatureCollection',
            'features': []
        };
        console.log(data)
        for (var i = 0; i < data.features.length; i++) {
            if (data.features[i].properties.crimeRate > 0.0506) {
                newdata.features.push(data.features[i]);
            }
        }
        console.log(newdata)

        map.data.addGeoJson(newdata)
        this.displayColor(map, newdata)
    }

    displayAllCrime(map, data) {
        //this.clearMap(map)
        //this.displayColor(map, data)
        //clear previous data on map

        //I deleted clear data part. As we need to keep adding new data to map. 
        //This precess doesn't need to clear previous data. 
        //In this process clear will make existing data been cleared and displayed again and again.
        //Keep wasting processing resource.
        //Clear will be done by when user switch diaplay mode.

        //var newdata = {
        //    'type': 'FeatureCollection',
        //    'features': []
        //};
        //console.log(data)
        //for (var i = 0; i < data.features.length; i++) {
        //    if (data.features[i].properties.crimeRate > 0) {
        //        newdata.features.push(data.features[i]);
        //    }
        //}
        //console.log(newdata)

        map.data.addGeoJson(data)
        this.displayColor(map, data)

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
            if (data.features[i].properties.crimeRate > 0.1) {
                newdata.features.push(data.features[i]);
            }
        }
        console.log(newdata)

        map.data.addGeoJson(newdata)
        this.displayColor(map, newdata)
    };

    displayColor(map, data) {
        var safeColor = "#00FF00";
        var dangerColor = '#ff2600';
        var nodataColor = "#9e9e9e";

        map.data.addGeoJson(data)
        map.data.setStyle(function (feature) {
            if (feature.getProperty('crimeRate') === null) {
                return {
                    strokeOpacity: 0,
                    fillColor: nodataColor,
                    fillOpacity: 0.1
                }
            }
            // 1st quantile data cr=[0,0.01526)
            if (feature.getProperty('crimeRate') >= 0 && feature.getProperty('crimeRate') <= 0.01526) {
                return {
                    strokeOpacity: 0,
                    fillColor: safeColor,
                    fillOpacity: 0.25
                }
            }

            // 2nd quantile data cr=[0.01526,0.02344)
            if (feature.getProperty('crimeRate') >= 0.01526 && feature.getProperty('crimeRate') <= 0.02344) {
                return {
                    strokeOpacity: 0,
                    fillColor: safeColor,
                    fillOpacity: 0.2
                }
            }

            // 3rd quantile data cr=[0.02344,0.0323)
            if (feature.getProperty('crimeRate') >= 0.02344 && feature.getProperty('crimeRate') <= 0.0323) {
                return {
                    strokeOpacity: 0,
                    fillColor: safeColor,
                    fillOpacity: 0.15
                }
            }
            // 4th quantile data cr=[0.0323,0.0405)
            if (feature.getProperty('crimeRate') >= 0.0323 && feature.getProperty('crimeRate') <= 0.0405) {
                return {
                    strokeOpacity: 0,
                    fillColor: safeColor,
                    fillOpacity: 0.1
                }
            }
            // 5th quantile data cr=[0.0405,0.0506)
            if (feature.getProperty('crimeRate') >= 0.0405 && feature.getProperty('crimeRate') <= 0.0506) {
                return {
                    strokeOpacity: 0,
                    fillColor: safeColor,
                    fillOpacity: 0.05
                }
            }
            // 6th quantile data cr=[0.0506,0.0625)
            if (feature.getProperty('crimeRate') >= 0.0506 && feature.getProperty('crimeRate') <= 0.0625) {
                return {
                    strokeOpacity: 0,
                    fillColor: dangerColor,
                    fillOpacity: 0.05
                }
            }
            // 7th quantile data cr=[0.0625,0.0769)
            if (feature.getProperty('crimeRate') >= 0.0625 && feature.getProperty('crimeRate') <= 0.0769) {
                return {
                    strokeOpacity: 0,
                    fillColor: dangerColor,
                    fillOpacity: 0.1
                }
            }
            // 8th quantile data cr=[0.0769,0.10208)
            if (feature.getProperty('crimeRate') >= 0.0769 && feature.getProperty('crimeRate') <= 0.10208) {
                return {
                    strokeOpacity: 0,
                    fillColor: dangerColor,
                    fillOpacity: 0.15
                }
            }
            // 9th quantile data cr=[0.10208,0.1529)
            if (feature.getProperty('crimeRate') >= 0.10208 && feature.getProperty('crimeRate') <= 0.1529) {
                return {
                    strokeOpacity: 0,
                    fillColor: dangerColor,
                    fillOpacity: 0.2
                }
            }
            // 10th quantile data cr=[0.1529,15.5714)
            if (feature.getProperty('crimeRate') >= 0.1529 && feature.getProperty('crimeRate') <= 0.8) {
                return {
                    strokeOpacity: 0,
                    fillColor: dangerColor,
                    fillOpacity: 0.25
                }
            }

            // 10th quantile data cr=[0.1529,15.5714)
            if (feature.getProperty('crimeRate') >= 0.8 && feature.getProperty('crimeRate') <= 15.5714) {
                return {
                    strokeOpacity: 0,
                    fillColor: dangerColor,
                    fillOpacity: 0.3
                }
            }
        })

    };

}


export default MapController;