# API ICS di Istante

`calendar.php` è il piccolo relay **sola lettura** usato da Istante per i feed
ICS remoti che il browser non può leggere direttamente per via delle policy
CORS del fornitore.

È indipendente dal provider: funziona con link ICS HTTPS di **Google Calendar,
Outlook / Microsoft 365, iCloud** e altri servizi che espongono un normale feed
`text/calendar`.

## Requisiti hosting

- PHP 8.1 o successivo;
- estensione PHP **cURL** attiva;
- uscita HTTPS (TCP 443) dal server verso i provider calendario;
- certificati CA di sistema aggiornati.

La pagina invia il link privato con `POST application/json`: in questo modo il
segreto del feed non viene messo nella query string dell'endpoint. Il relay non
scrive il link su file o database e risponde con `Cache-Control: no-store`.

## Sicurezza

Il relay accetta soltanto HTTPS sulla porta 443, limita il feed a 1 MiB e segue
al massimo 4 redirect. Prima di ogni richiesta risolve il dominio, rifiuta IP
privati/locali/riservati e fissa cURL all'indirizzo pubblico validato. Questo
riduce il rischio di usare l'endpoint come SSRF verso la rete interna.

Non aggiungere `Access-Control-Allow-Origin: *`: l'endpoint è pensato per essere
chiamato dalla stessa installazione di Istante.
