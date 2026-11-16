# Portrét pro galerii FMK

Aktuální soubor: `portrait-stamp-v2.png`.

- Export 1200 × 1500 px, poměr stran 4:5.
- PNG se skutečným alfa kanálem a průhledným pozadím.
- Detailní vícebarevná tisková ilustrace v omezené paletě uhlové, cihlové, břidlicově modré a lesní zelené.
- Výchozí fotografie: `assets/portrait/portrait-original.jpeg` v kořeni webu. Je zachována beze změny.
- Temeno a ramena jsou výtvarně doplněné. Obličej vychází z původní fotografie.
- Verze 2 je stejná kresba jako `portrait-stamp.png`, jen zvětšená o 16 %, aby postava v galerii zabírala stejnou plochu jako portréty ostatních studentů. První verze zůstává zachována.

Kořenový `portfolio.json` obsahuje:

```json
"photoStamp": "assets/fmk/portrait-stamp-v2.png"
```

Cesta je relativní k veřejnému `portfolio.json`, takže funguje také při publikování v podadresáři GitHub Pages. Portrét je určený pro společnou galerii a nenahrazuje hlavní kresbu ani původní fotografii na osobním webu.
