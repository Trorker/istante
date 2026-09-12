# Architettura

Istante 4 separa componenti, store, servizi e persistenza. Le viste non accedono direttamente al DOM per scambiarsi dati. Pinia è l'unica sorgente di verità per stato UI/applicativo; IndexedDB è la persistenza locale. `runtime.js` contiene parametri di deployment modificabili senza rebuild.

Le quattro famiglie di device condividono store e componenti atomici, ma possono usare composizioni diverse.
