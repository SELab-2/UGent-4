# UGent-4

# Wiki

- Zie de wiki voor meer informatie zoals bijvoorbeeld de use-cases en documentatie

# Frontend

- WIP

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
