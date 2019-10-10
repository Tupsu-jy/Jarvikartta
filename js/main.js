const lakeAPI =
    "https://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/Jarvi"

const map = L.map("map").setView([61.92, 25.74], 6)
const markerLayer = L.layerGroup().addTo(map)  

let haku=null;
let onkokartta=false;

let currentLat = null
let currentLong = null

let form = document.getElementById("form")

const setCurrentPosition = (position) => {
    currentLat = position.coords.latitude
    currentLong = position.coords.longitude
}

navigator.geolocation.getCurrentPosition(setCurrentPosition);

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

const searchLakes = e => {
    e.preventDefault();
    console.log(e)
    const searchValue = document.getElementById('input').value;
    const url = lakeAPI + "?$top=10&$filter=tolower(Nimi) eq tolower('" + searchValue + "')"
    markLakes(url)
}
form.addEventListener("submit", searchLakes, true);

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
Helsinkilat = 60.192059;
Helsinkilon = 24.945831;
let start=new Date().getTime();

const haeReitti = (Llat, Llon) => {
    while(start+3000>new Date().getTime()){

    }

    start = new Date().getTime();
    if(onkokartta==false){
        haku = L.Routing.control({
            waypoints: [
                L.latLng(currentLat, currentLong),
                L.latLng(Llat, Llon)
            ],
            routeWhileDragging: true,
            geocoder: L.Control.Geocoder.nominatim()
        }).addTo(map)
    } else {
        haku.setWaypoints([
            L.latLng(currentLat, currentLong),
            L.latLng(Llat, Llon)
        ])
    }
    onkokartta=true;
    setTimeout(function(){aika=false}, 1000);
}

function wait(){
    if(aika==true){
        aika=false;
        var start = new Date().getTime();
        var end = start;
        while(end < start + 1000) {
            end = new Date().getTime();
        }
        aika=true;
    }else{

    }
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}
