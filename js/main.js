const lakeAPI = "http://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/Jarvi"

const map = L.map('map').setView([61.92, 25.74], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const getLakes = async (lat, long) => {
    console.log('got ' + lat + " " + long);
    const latGt = lat - 0.10000;
    const latLt = lat + 0.10000;
    const longGt = long - 0.10000;
    const longLt = long + 0.10000;

    console.log('latGt ' + latGt +'  latLt ' + latLt +'  longGt ' + longGt +'  longLt ' + longLt);

    const url = lakeAPI + "?$top=100&$filter=KoordErLong gt '"+ longGt +"' and KoordErLong lt '"+ longLt +"' and KoordErLat gt '"+ latGt +"' and KoordErLat lt '"+ latLt +"'"
    try {
        const response = await fetch(url)
        const responseJSON = await response.json()
        return responseJSON
    } catch (e) {
        console.log(e)
    }
}

const markLakes = async (lat, long) => {
    const lakes = await getLakes(lat, long)
    for (lake of lakes.value) {
        console.log(lake)
        let marker = L.marker([lake.KoordErLat, lake.KoordErLong]).addTo(map);
        marker.bindPopup("<b>" + lake.Nimi + "</b><br>" + lake.KuntaNimi + "<br><a href='https://maps.google.com/?q=" + lake.KoordErLat + "," + lake.KoordErLong + "' target='!blank'>Google Maps</a>").openPopup();
    }
}

map.on('click', function(e){
    var coord = e.latlng;
    var lat = coord.lat;
    var long = coord.lng;
    markLakes(lat, long);
    });