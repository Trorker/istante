# Migrazione da Istante 3.x

La 4.x non usa il codice applicativo 3.x. La 3.14.1 rimane il riferimento stabile durante il periodo alpha.

## Alpha 1

La migrazione automatica rileva eventuali impostazioni legacy note e ne conserva una copia in `metadata` per una conversione successiva. I contenuti pubblici (1.000 pensieri, catalogo radio, collezioni, font e icone) sono già stati portati nel nuovo progetto come dati/asset.

I calendari 4.x sono salvati come URL ICS. Il backup 4.x conserva il link e non incorpora una copia `.ics`.

## Prima della produzione

La migrazione definitiva dovrà mappare in modo esplicito ogni chiave 3.14.1 verso schema 4 e deve essere idempotente. Fino a quel momento non eliminare i dati o il deployment 3.14.1.
