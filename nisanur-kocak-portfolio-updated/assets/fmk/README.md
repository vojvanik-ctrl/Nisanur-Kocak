# Portrét pro galerii FMK

Do této složky patří hotový `portrait-stamp.png` s průhledným pozadím v poměru 4:5, ideálně 1200 × 1500 px.

Soubor zatím není vytvořený: dostupná fotografie `assets/portrait/portrait-original.jpeg` má oříznutou horní část hlavy. Pro dodržení zadání je potřeba nová fotografie s celou hlavou včetně vlasů a viditelnými rameny. Existující kresba na webu není hotovým razítkovým portrétem.

Po vložení hotového PNG nastavte v kořenovém `portfolio.json`:

```json
"photoStamp": "assets/fmk/portrait-stamp.png"
```

Pokud vznikne z nové fotografie, uložte ji pod novým názvem a upravte také `photoOriginal`. Původní soubory zachovejte. Razítkový portrét slouží galerii, vzhled osobního webu nemění.
