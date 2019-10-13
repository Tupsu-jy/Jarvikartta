import { map } from "../main.js"
import { currentLat, currentLong } from "../helpers/mapHelpers.js"

export const zoomaa = e => {
    let nyk = map.getCenter()
    if (nyk.lat == e.popup._latlng.lat && nyk.lng == e.popup._latlng.lng) {
        map.setView([61.92, 25.74], 6)
    } else {
        map.setView([e.popup._latlng.lat, e.popup._latlng.lng], 12)
    }
}

export const haeReitti = e => {
    let start = new Date().getTime()
    let haku = null
    let onkokartta = false

    while (start + 3000 > new Date().getTime()) {}

    start = new Date().getTime()

    if (onkokartta == false) {
        haku = L.Routing.control({
            waypoints: [
                L.latLng(currentLat, currentLong),
                L.latLng(e.popup._latlng.lat, e.popup._latlng.lng)
            ],
            routeWhileDragging: true,
            geocoder: L.Control.Geocoder.nominatim()
        }).addTo(map)
    } else {
        haku.setWaypoints([
            L.latLng(currentLat, currentLong),
            L.latLng(e.popup._latlng.lat, e.popup._latlng.lng)
        ])
    }
    onkokartta = true
}