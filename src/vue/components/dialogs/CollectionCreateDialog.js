/* Istante v4 · Vue component: CollectionCreateDialog */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.CollectionCreateDialog = {
    name: 'CollectionCreateDialog',
    template: `<dialog aria-labelledby="collection-create-title" class="panel collection-create-panel" id="collection-create-dialog"><div class="panel-head"><div><p class="section-label">Una raccolta tutta tua</p><h2 id="collection-create-title">Crea raccolta.</h2></div><button aria-label="Chiudi" class="icon-button close-button" data-close="" type="button"><span class="icon" data-icon="close"></span></button></div><form id="collection-create-form"><div class="panel-content collection-create-content"><label class="stacked-label">Titolo<input autocomplete="off" maxlength="80" name="title" placeholder="La mia raccolta" required="" type="text"/></label><label class="stacked-label">Categoria<input autocomplete="off" maxlength="40" name="category" placeholder="Personale" type="text"/></label><label class="stacked-label">Descrizione<textarea maxlength="400" name="description" placeholder="Una nota per ricordarti cosa vuoi raccogliere qui." rows="4"></textarea></label><p class="field-note">La raccolta nasce vuota. Dopo averla creata potrai aggiungere le frasi una alla volta.</p><p class="form-error" hidden="" id="collection-create-error" role="alert"></p></div><div class="panel-footer"><button class="text-button" data-close="" type="button">Annulla</button><button class="primary-button" type="submit"><span class="icon" data-icon="plus"></span>Crea raccolta</button></div></form></dialog>`
  };
})();
