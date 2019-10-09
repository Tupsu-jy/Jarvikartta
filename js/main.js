const lakeAPI =
    "https://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/Jarvi"

const map = L.map("map").setView([61.92, 25.74], 6)
const markerLayer = L.layerGroup().addTo(map)
let haku=null;
let onkokartta=false;

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

const searchLegend = L.control({ position: "topright", interactive: false })
searchLegend.onAdd = map => {
    let div = L.DomUtil.create("div", "legend")
    div.innerHTML =
        '<b>Top 20</b><br><select id="select" onchange="changeSearch()"><option>Valitse</option><option>Tilavuus</option><option>Syvyys</option><option>Vesiala</option><option>Rantaviiva</option></select>'
    L.DomEvent.disableClickPropagation(div)
    return div
}
searchLegend.addTo(map)

const changeSearch = () => {
    const selectValue = document.getElementById("select").value
    if (selectValue === "Tilavuus") {
        markLakes(lakeAPI + "?$top=20&$orderby=Tilavuus desc", "top")
    } else if (selectValue === "Syvyys") {
        markLakes(lakeAPI + "?$top=20&$orderby=SyvyysSuurin desc", "top")
    } else if (selectValue === "Vesiala") {
        markLakes(lakeAPI + "?$top=20&$orderby=Vesiala10000 desc", "top")
    } else if (selectValue === "Rantaviiva") {
        markLakes(lakeAPI + "?$top=20&$orderby=Rantaviiva10000 desc", "top")
    }
}

const getLakes = async url => {
    try {
        const response = await fetch(url)
        const responseJSON = await response.json()
        return responseJSON
    } catch (e) {
        console.log(e)
    }
}

const markLakes = async (url, method) => {
    const lakes = await getLakes(url)
    markerLayer.clearLayers()
    let number = 1
    for (lake of lakes.value) {
        if (method === "top") {
            let icon = L.divIcon({
                className: "top",
                html: "<div>" + number + ".</div>"
            })
            var marker = L.marker([lake.KoordErLat, lake.KoordErLong], {
                icon
            }).addTo(markerLayer)
            number++
        } else {
            var marker = L.marker([lake.KoordErLat, lake.KoordErLong]).addTo(
                markerLayer
            )
        }
        for (i in lake) {
            if (lake.hasOwnProperty(i)) {
                if (lake[i] === null) lake[i] = "-"
            }
        }
        marker
            .bindPopup(
                "<div class='popup'>" +
                    "<b>" +
                    lake.Nimi +
                    "</b><br> Kunta: " +
                    lake.KuntaNimi +
                    "<br> Syvyys keskimäärin: " +
                    lake.SyvyysKeski +
                    " m<br> Suurin syvyys: " +
                    lake.SyvyysSuurin +
                    " m<br> Rantaviivaa: " +
                    lake.Rantaviiva10000 +
                    " km<br>Tilavuus: " +
                    lake.Tilavuus +
                    " m³<br> Järven pinta-ala: " +
                    lake.Vesiala10000 +
                    " ha<br><a href='https://maps.google.com/?q=" +
                    lake.KoordErLat +
                    "," +
                    lake.KoordErLong +
                    "' target='!blank'>Google Maps</a>" +
                    "<br><button type=\"button\" onclick=\"haeReitti(lake.KoordErLat, lake.KoordErLong)\">Hae reitti</button>"+
                    "</div>"
            )
            .openPopup()
    }
}

map.on("click", function(e) {
    let coord = e.latlng
    let lat = coord.lat
    let long = coord.lng
    const latGt = lat - 0.1
    const latLt = lat + 0.1
    const longGt = long - 0.1
    const longLt = long + 0.1

    const url =
        lakeAPI +
        "?$top=100&$filter=KoordErLong gt '" +
        longGt +
        "' and KoordErLong lt '" +
        longLt +
        "' and KoordErLat gt '" +
        latGt +
        "' and KoordErLat lt '" +
        latLt +
        "'"
    markLakes(url)
})
Alat = 60.192059;
Alon = 24.945831;

function haeReitti(Llat, Llon){

    if(onkokartta==false){
        haku = L.Routing.control({
            waypoints: [
                null,
                L.latLng(Llat, Llon)
            ],
            routeWhileDragging: true,
            geocoder: L.Control.Geocoder.nominatim()
        }).addTo(map)
    }else{
        haku.setWaypoints([
            null,
            L.latLng(Llat, Llon)
        ])
    }

    onkokartta=true;
}