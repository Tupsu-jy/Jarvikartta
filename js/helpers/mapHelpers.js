import { map } from "../main.js"

export let currentLat = null
export let currentLong = null

export const sisaltoToString = (lake, saannostely, luvanhaltija, styyppi, lupapaatos) => {
    let sisalto =
        "<div class='popup'>" +
        "<b>" +
        lake.Nimi +
        "</b><br>Kunta: " +
        lake.KuntaNimi +
        "<br><br><details><summary class='summary'><b>Yleinen info</b></summary>" +
        "Järven pinta-ala: " +
        lake.Vesiala10000 +
        " ha<br>" +
        "Rantaviivaa: " +
        lake.Rantaviiva10000 +
        " km<br>"

    if (lake.SyvyysKeski)
        sisalto += "Syvyys keskimäärin: " + lake.SyvyysKeski + " m<br> "
    if (lake.SyvyysSuurin)
        sisalto += "Suurin syvyys: " + lake.SyvyysSuurin + " m<br>"
    if (lake.Tilavuus) sisalto += "Tilavuus: " + lake.Tilavuus + " m³"

    sisalto += "</details>"

    if (lake.JarviSaannostely[0]) {
        let saannostelyObj = lake.JarviSaannostely[0]
        let saannostelyStr = ""
        let lupapaatokset = ""
        
        if (saannostelyObj.Tarkoitus)
            saannostelyStr += "Tarkoitus: " + saannostelyObj.Tarkoitus

        if (saannostelyObj.VuosiAlku && !saannostelyObj.VuosiAlku.trim() === "")
            saannostelyStr +=
                "<br>Säännöstelyn aloitusvuosi: " + saannostelyObj.VuosiAlku

        if (saannostelyObj.AsteikkoQ)
            saannostelyStr +=
                "<br>Virtaamahavaintoasteikko: " + saannostelyObj.AsteikkoQ

        if (saannostelyObj.AsteikkoW)
            saannostelyStr +=
                "<br>Vedenkorkeushavaintoasteikko: " + saannostelyObj.AsteikkoW

        if (saannostelyObj.Lisatieto)
            saannostelyStr += "<br>Lisatietoa: " + saannostelyObj.Lisatieto

        //saannostely, luvanhaltija, styyppi, lupapaatos
        if (saannostely)
            if (saannostely.ElyNimi)
                saannostelyStr += "<br>Ely: " + saannostely.ElyNimi

        if (luvanhaltija)
            if (luvanhaltija.Nimi)
                saannostelyStr += "<br>Säännöstelyluvan haltijan nimi: " + luvanhaltija.Nimi

        if (styyppi)
            if (styyppi.Selite)
                saannostelyStr += "<br>Säännöstelytyyppi: " + styyppi.Selite


        let i=1;
        for (let lupa of lupapaatos.value){
            lupapaatokset+="<details><summary class='summary'><b>Lupapäätös "+i+"</b></summary>"
            if (lupa.Antaja){
                lupapaatokset += "<br>Luvan antajan nimi: " + lupa.Antaja
            }

            if (lupa.Lainvoima==1){
                lupapaatokset += "<br>Päätöksellä on lainvoima"
            }else{
                lupapaatokset += "<br>Päätöksellä ei ole lainvoimaa"
            }

            if (lupa.Pvm){
                lupapaatokset += "<br>Lupapäätöksen antamispäivämäärä: " + lupa.Pvm.split("T")[0].replace(/-/g, " ");
            }
            i++;
            lupapaatokset+="</details>"
        }

        if (saannostelyStr !== "")
            sisalto +=
                "<details><summary class='summary'><b>Säännöstely</b></summary>" +
                saannostelyStr +
                "</details>"

        if (lupapaatokset !== "")
            sisalto +=
                "<details><summary class='summary'><b>Lupapäätökset</b></summary>" +
                lupapaatokset +
                "</details>"
    }

    sisalto +=
        "<br><div class='button'><a href='https://maps.google.com/?q=" +
        lake.KoordErLat +
        "," +
        lake.KoordErLong +
        "' target='!blank'>Google Maps</a></div>" +
        '<br><button class="button" id="haeReitti">Hae reitti</button>' +
        '<br><button class="button" id="zoomaa">Zoomaa</button>' +
        "</div>"

    return sisalto
}

export const setCurrentPosition = position => {
    currentLat = position.coords.latitude
    currentLong = position.coords.longitude
}

export const setViewAtLakesAvg = lakes => {
    if (lakes.value.length > 0) {
        let lat = 0
        let lng = 0
        for (let lake of lakes.value) {
            lat += parseInt(lake.KoordErLat)
            lng += parseInt(lake.KoordErLong)
        }
        lat = lat / lakes.value.length + 0.5
        lng = lng / lakes.value.length + 0.5
        map.setView([lat, lng], 8) // mb zoom level depending on coordinate variation
    }
}
