
/*export const modalSaannostely = () => {
    let tiedot="<b>asd</b>"
    new AWN().modal(tiedot);
}*/

export const modalInfo = () => {
    let tiedot="<p style='font-size: large'>Järvikartta tehtiin Metropolian tieto- ja viestintätekniikan opintojen yhteydessä.<br>" +
                "Projektin toteuttivat: Jaakko Ylinen, Jaakko Hotti, Matias Mäkelä ja Nikita Essine</p>"
    new AWN().modal(tiedot);
}

export const modalOhje = () => {
    let tiedot="<p style='font-size: large'>Voit hakea järviä ja niistä löytyviä tietoja suoran kartalta hiiren painalluksella tai sitten " +
        " voit hakea järviä joko kunnan tai järven nimellä hakukenttää käyttäen.<br><br>"+
                "Top20 valikosta löydät suomen järvistä ne 20 joilla valitsemasi arvo on suurin.<br><br>"+
                "Reitinhakuun pääset käsiksi painamalla \"Hae reitti\"-nappia jonkin järven markkerissa.</p>";
    new AWN().modal(tiedot);
}