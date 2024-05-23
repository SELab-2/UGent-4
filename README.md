# UGent-4

# Wiki

- Raadpleeg de [Wiki](https://github.com/SELab-2/UGent-4/wiki) voor uitgebreidere informatie, waaronder Use-Cases, API-Documentatie en Website-documentatie.

# Deployment diagram
![image](https://github.com/SELab-2/UGent-4/assets/49711425/805e37c4-fd67-4e68-8b8a-1310efce7864)


# Frontend

## Hoe runnen?

### Benodigdheden:
- Je zal bepaalde node modules moeten installeren. Dit kan je gemakkelijk doen in één keer. Ga naar de UGent-4/frontend/frontend folder. Run dan het commando `npm i`.

### De frontend lokaal runnen:
Ga naar de UGent-4/frontend/frontend folder. Run het commando: ```npm run dev```. Normaal kan je nu naar de url `http://localhost:5173/` surfen in je browser en de frontend zien. Als je een wit scherm ziet dan kan je proberen om de frontend te stoppen, `npm audit fix` te runnen in dezelfde folder, en de frontend opnieuw te runnen.

### Linting:
De volgende commando's run je van de ***frontend/frontend*** directory:
`npm run lint`: geeft een lijst van alle linting errors weer.
`npm run lint -- --fix`: fixt een aantal linting errors automatisch indien mogelijk.
`npm run format`: format alle files in het project volgens de instellingen in ***.prettierrc***.

Er kan niet gepushed worden als er nog linting errors aanwezig zijn.

### Testen:

Je kan visueel in de browser de testen volgen door het commando `npm run cypress-open` te runnen. Je zal dan ook de keuze krijgen om te kiezen tussen E2E testen of om component testen te volgen.

`npm run cypress-e2e` en `cypress-component` zullen de e2e testen en de component testen runnen en in de terminal tonen of ze slagen.

# Backend

## Hoe runnen?

### Benodigdheden:
- .env bestand: In deze folder moet je lokaal een .env bestand zetten. Het .env bestand bevat geheime variabelen en codes die je niet in deze repo zal vinden. Vraag het aan iemand van het backend team als je de file wilt krijgen.

- postgres databank: Je zal zelf een postgres databank moeten opzetten. De naam van de databank, user, paswoord, ... Kan je vinden in het .env bestand.

- virtual environment: Je zal ook een virtual environment moeten maken. Doe dit op linux met het commando: `python -m venv /path/to/new/virtual/environment`.
Vervolgens activeer je de virtual environment als volgt: `source my_env/bin/activate`.
Tenslotte installeer je alle dependencies: `pip install -r requirements.txt`.

### de api lokaal runnen:
Om de api lokaal te runnen activeer je eerst de virtual environment. Daarna voer je volgende commando's uit in de UGent-4 directory: 
```sh
./manage.py makemigrations api
./manage.py migrate api
./manage.py runserver
```
Je kan dan surfen naar http://127.0.0.1:8000/ om de api te zien.

## Hoe testen?

**OPMERKING**: Al de volgende commando's moeten uitgevoerd worden terwijl de virtual environment geactiveerd is.

Je checkt zowel de linting als de tests.

### Linting:
De volgende commando's run je van de ***api*** directory:
Run het commando `flake8 .`. De output vertelt je waar de codestijl fout is. Om snel deze stijlfouten op te lossen kan je `black .`runnen.


### Testing:
Run het commando `./manage.py test` in de ***UGENT-4*** directory.
