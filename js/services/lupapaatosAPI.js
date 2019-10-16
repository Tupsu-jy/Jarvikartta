const getLupapaatos = async id => {
    ///api/jarvirajapinta/1.0/odata/JarviSaannostely(Jarvi_Id=1,Saannostely_Id=245)/Saannostely
    //https://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/Jarvi
    console.log(id)

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

export default getLupapaatos
