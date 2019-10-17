const getLakes = async url => {
    url += "&$expand=JarviSaannostely"
    try {
        const response = await fetch(url)
        const responseJSON = await response.json()
        return responseJSON
    } catch (e) {
        console.log(e)
    }
}

const getLupapaatos = async id => {

    let url =
        "https://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/Saannostely("+
        id+
        ")/SaannostelyLupapaatos"

    try {
        const response = await fetch(url)
        const responseJSON = await response.json()
        return responseJSON
    } catch (e) {
        console.log(e)
    }
}

const getStyyppi = async id => {
    let url =
        "https://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/Saannostely("+
        id+
        ")/SaannostelyTyyppi"

    try {
        const response = await fetch(url)
        const responseJSON = await response.json()
        return responseJSON
    } catch (e) {
        console.log(e)
    }
}

const getSaannostely = async lake => {
    let url =
        "https://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/JarviSaannostely(Jarvi_Id=" +
        lake.Jarvi_Id +
        ",Saannostely_Id=" +
        lake.JarviSaannostely[0].Saannostely_Id +
        ")/Saannostely"

    try {
        const response = await fetch(url)
        const responseJSON = await response.json()
        return responseJSON
    } catch (e) {
        console.log(e)
    }
}
const getLuvanhaltija = async id => {
    let url =
        "https://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/Saannostely("+
        id+
        ")/LuvanhaltijaValtio"

    try {
        const response = await fetch(url)
        const responseJSON = await response.json()
        return responseJSON
    } catch (e) {
        console.log(e)
    }
}

export {getLakes, getSaannostely, getLuvanhaltija, getStyyppi, getLupapaatos}
