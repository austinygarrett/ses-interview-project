import { Component, OnInit } from '@angular/core';
import { EarthquakeDataService } from '../../_services';
import { Chart } from 'chart.js/auto';
import { last } from 'rxjs/operators';

@Component({
    templateUrl: 'magnitudechart.component.html',
    standalone: false,
    selector: 'mag-chart',
})
export class MagnitudeChartComponent implements OnInit {
    earthquakeData?: any;
    earthquakeService: EarthquakeDataService;
    public chart: any;

    constructor(private eqService: EarthquakeDataService) {
        this.earthquakeService = eqService;
    }

    createChart() {
        if (this.chart) {
            this.chart.destroy();
        }

        var labels = Array.from(this.earthquakeData.keys())
        labels.shift()
        this.chart = new Chart("eqCountChart", {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Earthquakes",
                        data: this.formatDataCountByYear(),
                        backgroundColor: '#3f51b5'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
            }

        });
    }

    /**
     * correctly formats data to be usable by chartjs bar graph
     * @returns 
     */
    private formatDataCountByYear(): number[] {
        var dataPoints: number[] = []
        var keys = Array.from(this.earthquakeData.keys())
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] != "") {
                dataPoints.push(this.earthquakeData.get(keys[i]).data.length)
            }
        }
        return dataPoints;
    }

    ngOnInit(): void {
        this.earthquakeService.allEarthquakeData$.subscribe((data: any) => {
            this.earthquakeData = data;
            this.createChart();
        });
    }
}