import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { EarthquakeDataService } from '../../_services';
import 'heatmap.js';
import { first } from 'rxjs/operators';

declare const HeatmapOverlay: any;

@Component({
    templateUrl: 'dashboardmap.component.html',
    standalone: false,
    selector: 'dashboard-map'
})
export class DashboardMapComponent implements AfterViewInit {
    minYear: number = Infinity;
    maxYear: number = -Infinity;
    pointsToggle = false;
    heatmapToggle = true;
    byYearToggle = false;
    selYear = "";
    private layerGroups: any = {};
    private map: any;
    private heatDataByYear: Map<string, any> = new Map<string, any>();
    private heatmapLayer: any;

    constructor(private earthquakeService: EarthquakeDataService) { }

    /**
     * Initialize Map
     */
    private initMap(): void {
        const corner1 = L.latLng(-90, -200)
        const corner2 = L.latLng(90, 200)
        const bounds = L.latLngBounds(corner1, corner2)

        this.map = L.map('map', {
            center: [0, 0],
            zoom: 3,
            maxBounds: bounds,
            maxBoundsViscosity: 1.0
        });
        var openStreetLayer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            noWrap: true,
            minZoom: 3,
            maxZoom: 25,
        });
        openStreetLayer.addTo(this.map);
        this.loadGeoJson();
        this.makeEarthquakeMarkers();
    }

    /**
     * Load country geojson data from assets
     */
    private loadGeoJson(): void {
        fetch('assets/Countries.geojson')
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data).addTo(this.map);
            });
    }

    /**
     * Format number to string
     * @param value 
     * @returns 
     */
    formatLabel(value: number): string {
        return `${value}`;
    }

    /**
     * Remove all data points drawn on map
     */
    removeAllLayers(): void {
        for (const key of this.heatDataByYear.keys()) {
            if (key != "") {
                this.map.removeLayer(this.layerGroups[key])
            }
        }
    }

    /**
     * Remove all heatmap data points
     */
    removeAllHeatmap(): void {
        this.heatmapLayer.setData({ data: [] })
    }

    /**
     * Displays earthquake data on map based on year
     * @param year 
     */
    displayEarthquakesByYear(year: string): void {
        this.removeAllLayers();
        if (this.heatDataByYear.has(year)) {
            this.layerGroups[year].addTo(this.map);
        }
    }

    /**
     * Displays heatmap data on map based on year
     * @param year 
     */
    displayEarthquakesHeatmapByYear(year: string): void {
        if (this.heatDataByYear.has(year)) {
            this.heatmapLayer.setData(this.heatDataByYear.get(year))
        } else {
            this.removeAllHeatmap()
        }
    }

    /**
     * Displays all heatmap data across all years
     */
    displayAllHeatmapData(): void {
        var heatData: any = { data: [] }
        for (const key of this.heatDataByYear.keys()) {
            heatData.data.push(...this.heatDataByYear.get(key).data)
        }
        this.heatmapLayer.setData(heatData);
    }

    /**
     * Displays all earthquake marker across all years
     */
    displayAllLayers(): void {

        for (const key of this.heatDataByYear.keys()) {
            if (key != "") {
                this.layerGroups[key].addTo(this.map)
            }
        }
    }

    /**
     * Toggles display of earthquake markers
     * @param event 
     */
    togglePoints(event: any): void {
        this.pointsToggle = event.checked
        if (this.pointsToggle) {
            if (this.byYearToggle) {
                this.displayEarthquakesByYear(this.selYear)
            } else {
                this.displayAllLayers();
            }
        } else {
            this.removeAllLayers();
        }
    }

    /**
     * Toggles display of earthquake heatmap data
     * @param event 
     */
    toggleHeatmap(event: any): void {
        this.heatmapToggle = event.checked
        if (this.heatmapToggle) {
            if (this.byYearToggle) {
                this.displayEarthquakesHeatmapByYear(this.selYear)
            } else {
                this.displayAllHeatmapData()
            }
        } else {
            this.removeAllHeatmap();
        }

    }

    /**
     * Toggles display to use by year
     * @param event 
     */
    toggleByYear(event: any): void {
        this.byYearToggle = event.checked
        if (this.byYearToggle) {
            this.selYear = String(this.minYear);
            if (this.heatmapToggle) {
                this.displayEarthquakesHeatmapByYear(this.selYear);
            }

            if (this.pointsToggle) {
                this.displayEarthquakesByYear(this.selYear)
            }
        } else {
            if (this.heatmapToggle) {
                this.displayAllHeatmapData()
            }

            if (this.pointsToggle) {
                this.displayAllLayers();
            }
        }
    }

    /**
     * Handles year selection and displays correlated data.
     * @param event 
     */
    selectedYear(event: any): void {
        this.selYear = (event.target as HTMLInputElement).value
        if (this.heatmapToggle) {
            this.displayEarthquakesHeatmapByYear(this.selYear);
        }

        if (this.pointsToggle) {
            this.displayEarthquakesByYear(this.selYear)
        }
    }

    /**
     * Inital creation and gathering of data and map layers
     */
    makeEarthquakeMarkers(): void {
        this.earthquakeService.getAll(-1).pipe(first()).subscribe((res: any) => {
            var year = ""
            var randomColor = ""
            this.heatDataByYear.set(year, { data: [] })
            for (const earthquake of res) {
                //parse for year key
                var dateArr = earthquake.date.split("/");

                if (year != dateArr[2]) {
                    var curyear = dateArr[2]
                    // account for alternative format found in data
                    if (dateArr.length == 1) {
                        curyear = earthquake.date.slice(0, 4)
                    }

                    if (curyear !== year) {
                        randomColor = this.getRandomColor()
                        year = curyear
                        if (!this.heatDataByYear.has(year)) {
                            this.heatDataByYear.set(year, { data: [] })
                            this.layerGroups[year] = L.layerGroup()
                            var yearNum = Number(year)
                            if (yearNum > this.maxYear) {
                                this.maxYear = yearNum
                            }
                            if (yearNum < this.minYear) {
                                this.minYear = yearNum
                            }
                        }
                    }
                }

                // get latitude and longitude and create marker on map
                const lon = earthquake.longitude
                const lat = earthquake.latitude;
                const circle = L.circleMarker([lat, lon], {
                    radius: 3,
                    color: `#${randomColor}`
                });
                circle.addTo(this.layerGroups[year]);

                var heatmapMapVal = this.heatDataByYear.get(year)
                heatmapMapVal.data.push({ latitude: lat, longitude: lon, count: earthquake.magnitude })
                this.heatDataByYear.set(year, heatmapMapVal)

            }

            // send to service to disperse to subscribers
            this.earthquakeService.allEarthquakeData(this.heatDataByYear)

            const heatLayerConfig = {
                "radius": 2,
                "maxOpacity": .7,
                "scaleRadius": true,
                "useLocalExtrema": true,
                latField: 'latitude',
                lngField: 'longitude',
                valueField: 'count'
            };

            // Initialising heat layer and passing config
            this.heatmapLayer = new HeatmapOverlay(heatLayerConfig);

            this.displayAllHeatmapData()

            //Adding heat layer to a map
            this.heatmapLayer.addTo(this.map);
            this.selYear = String(this.minYear);
        });
    }

    /**
     * Generates random color hex value
     */
    private getRandomColor() {
        return Math.floor(Math.random() * 16777215).toString(16);
    }

    ngAfterViewInit(): void {
        this.initMap();
    }
}