export class EarthquakeData {
    id?: string;
    date?: string;
    time?: string;
    latitude?: number;
    longitude?: number;
    type?: string;
    depth?: number;
    depth_error?: number;
    depth_seismic_stations?: number;
    magnitude?: number;
    magnitude_type?: string;
    magnitude_error?: number;
    magnitude_seismic_stations?: number;
    azimuthal_gap?: number;
    horizontal_distance?: number;
    horizontal_error?: number;
    root_mean_square?: number;
    source?: string;
    location_source?: string;
    magnitude_source?: string;
    status?: string;
}

export class EarthquakeCount {
    total?: number
}