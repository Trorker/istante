/* Istante 3.12.7 - verified offline shell; updates wait for consent. */
'use strict';
const VERSION="3.12.7";
const PREFIX='istante-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+VERSION+'-6d95529bbeaa';
const FILES=[
  {
    "url": "./assets/css/app.css?v=3.12.7",
    "integrity": "sha256-aFnVAkNSeEWGO9B7XrCksckOwpIqabK8X8Jf6YQlO2s="
  },
  {
    "url": "./assets/css/calendar.css?v=3.12.7",
    "integrity": "sha256-mRseePu1SbZTihKvvJg9PyD9FMkRtOhoqtifSFz6AuI="
  },
  {
    "url": "./assets/css/documents.css?v=3.12.7",
    "integrity": "sha256-w30+osfEFz4kpIUwSQSM0yBdD9dbBPcs7d3AbDDQt1U="
  },
  {
    "url": "./assets/css/evolution.css?v=3.12.7",
    "integrity": "sha256-+RhSkH7u6HgB+XgDyNlNiWvP9t6+2z1Fgtr0+D2v9fY="
  },
  {
    "url": "./assets/css/interactions.css?v=3.12.7",
    "integrity": "sha256-8MepLjLfIYmfrajvDlkVYRQkBTJNoHD3IlKlt1XmDL4="
  },
  {
    "url": "./assets/css/onboarding.css?v=3.12.7",
    "integrity": "sha256-AQ4H3dUnR1GsaqTsb3YB0S8u1BT74DFWXQo25fyZR5M="
  },
  {
    "url": "./assets/css/polish-3.10.1.css?v=3.12.7",
    "integrity": "sha256-DpPWKaakcY8r5zAt7cGYVc2J14yr8WmLYE9xHeDDjdU="
  },
  {
    "url": "./assets/css/polish-3.10.3.css?v=3.12.7",
    "integrity": "sha256-gKPIRjN9LzniljlsEk5tIdG/B6eDYtnc0DvI+uqulCQ="
  },
  {
    "url": "./assets/css/polish-3.11.1.css?v=3.12.7",
    "integrity": "sha256-s6SmC3EuequV2sRDujxiSu60IdD2iEqeCA7hy9durvk="
  },
  {
    "url": "./assets/css/polish-3.11.css?v=3.12.7",
    "integrity": "sha256-xQhb0XcpsDL8RPdLOfQKjPoDtZuqcJv4aMToagsYC2c="
  },
  {
    "url": "./assets/css/polish-3.12.1.css?v=3.12.7",
    "integrity": "sha256-gtA1u5t/+mdiZ7QBENaBKWeuQ1qCzsUaDSy0ti63IG8="
  },
  {
    "url": "./assets/css/polish-3.12.2.css?v=3.12.7",
    "integrity": "sha256-x2oPkXQSI1fxgJZikah2xwqVtMbWCsIj2PpwX1HxCVc="
  },
  {
    "url": "./assets/css/polish-3.12.3.css?v=3.12.7",
    "integrity": "sha256-VX8zB1+75ZX/8GIordzyZgF34cARdPOKxB+GZjG7mCI="
  },
  {
    "url": "./assets/css/polish-3.12.5.css?v=3.12.7",
    "integrity": "sha256-YKrp9dCI28LV40F8v06VTs1QRnfDBBmefMGcOGTft4Y="
  },
  {
    "url": "./assets/css/polish-3.12.6.css?v=3.12.7",
    "integrity": "sha256-s5bMyAlYtsFN7ecUsSdp5+ebWS5rRe9Vc8wBzrEVX+E="
  },
  {
    "url": "./assets/css/polish-3.12.7.css?v=3.12.7",
    "integrity": "sha256-stVjlaHCHdGaS4YiD1SijSdABdObdPhJvn00gxHM6dg="
  },
  {
    "url": "./assets/css/rebuild.css?v=3.12.7",
    "integrity": "sha256-7+I1/IHVLaxUjil38ea0EWI76xzxWKz+mtLc+xIufVM="
  },
  {
    "url": "./assets/css/refinements.css?v=3.12.7",
    "integrity": "sha256-ie4hEuKO1al0lkVsNvOAzvs5RA8mMRfX5E8ufntSrvU="
  },
  {
    "url": "./assets/css/scene.css?v=3.12.7",
    "integrity": "sha256-DfUZpZ+I3yME216MiDOL/k5fvN2dr03DKSvP80KA9KQ="
  },
  {
    "url": "./assets/css/sharing.css?v=3.12.7",
    "integrity": "sha256-1PFUCBrg6C0Q930Z0Ny4EeTFe1DJDUg83GKAf98fcdA="
  },
  {
    "url": "./assets/css/workspace.css?v=3.12.7",
    "integrity": "sha256-SucOOzR4hMet+GVIRyminV6RHw1Tds/BhxKSlBxNaKY="
  },
  {
    "url": "./assets/icons/icon-192.png",
    "integrity": "sha256-d58Wp49J3QnBOOMG/o6hz3fkbMw76sCV44f4De+UOM8="
  },
  {
    "url": "./assets/icons/icon-512.png",
    "integrity": "sha256-daozhsomuxqhJ6WqElY5ipbVszGiJSPy/SdhKF1bwmg="
  },
  {
    "url": "./assets/icons/icon.svg",
    "integrity": "sha256-8TEK0pdB/ha6D5W1j0mtPZsz4U5JIZqWhBYXg0SugN8="
  },
  {
    "url": "./assets/icons/social/github.svg",
    "integrity": "sha256-MFAOFFez9PqHtFk6ddySUfAoES7nZmXEaKlspwmP18E="
  },
  {
    "url": "./assets/icons/social/instagram.svg",
    "integrity": "sha256-3v0GvKp3pnjFTLs1SBHvvEPEnko+iqCLsPbtY8+Ktlg="
  },
  {
    "url": "./assets/icons/social/linkedin.svg",
    "integrity": "sha256-6xtsEpiws2tWhx63Do1RYDsV5fHZCgIC1k5ISbiErQ8="
  },
  {
    "url": "./assets/images/istante-social-v3.11.0.jpg",
    "integrity": "sha256-pHlWSJAC1qd0KYKTuEOLchRF35ISDBdjWUzdFM2TgH8="
  },
  {
    "url": "./assets/images/istante-social-v3.11.1.jpg",
    "integrity": "sha256-pHlWSJAC1qd0KYKTuEOLchRF35ISDBdjWUzdFM2TgH8="
  },
  {
    "url": "./assets/images/istante-social-v3.12.0.jpg",
    "integrity": "sha256-pHlWSJAC1qd0KYKTuEOLchRF35ISDBdjWUzdFM2TgH8="
  },
  {
    "url": "./assets/images/istante-social-v3.12.1.jpg",
    "integrity": "sha256-pHlWSJAC1qd0KYKTuEOLchRF35ISDBdjWUzdFM2TgH8="
  },
  {
    "url": "./assets/images/paper-grain.svg",
    "integrity": "sha256-zbXBjZ8ni9l2agI1s96jybKmx/bNP3hKmLASPqssDXo="
  },
  {
    "url": "./assets/js/ambient.js?v=3.12.7",
    "integrity": "sha256-OSphAoVvB4/k6AF/TANJFU1ICauFTc907GV0566ycmk="
  },
  {
    "url": "./assets/js/backup.js?v=3.12.7",
    "integrity": "sha256-ZBUTht9jl3yzzac/3GbWTzvxLl2wC2wCJic9SuI6dBI="
  },
  {
    "url": "./assets/js/calendar-core.js?v=3.12.7",
    "integrity": "sha256-0PSRzkTpt6QT+HTkNXbcI9iDZxq6FkNiz9MX1TPWmrQ="
  },
  {
    "url": "./assets/js/calendar-holidays.js?v=3.12.7",
    "integrity": "sha256-XhBKagz5DeWSsE6Fj0fOxtEcuMPz9fKBLtz26cwfpq8="
  },
  {
    "url": "./assets/js/calendar-worker.js?v=3.12.7",
    "integrity": "sha256-MWgjlIIF3n9pSNrUMj38UoZEQm+vDK44oiP04uNNvu4="
  },
  {
    "url": "./assets/js/calendar.js?v=3.12.7",
    "integrity": "sha256-EKz25FhwEItZxgTeGvdb93N58DbRpYFemjmAlgAjl5c="
  },
  {
    "url": "./assets/js/collections.js?v=3.12.7",
    "integrity": "sha256-YP39IweXNifMIm2v83sTDz2Rcq01iZgK28Dox78//hQ="
  },
  {
    "url": "./assets/js/companion.js?v=3.12.7",
    "integrity": "sha256-o0fN7fB6IZQ3WZmdtwvC8/Bu/c2nwnyR4Cf90rwg+9w="
  },
  {
    "url": "./assets/js/controls.js?v=3.12.7",
    "integrity": "sha256-PJreQjWgBlLYWAIzj08jK291rKhuZ5isUL+1pz9G/Zg="
  },
  {
    "url": "./assets/js/core.js?v=3.12.7",
    "integrity": "sha256-PDRi74FzKWbreIPUPmEvQB3D3pK3NTFFNEasu5+czJw="
  },
  {
    "url": "./assets/js/cursor.js?v=3.12.7",
    "integrity": "sha256-rrELkZD0B3JRFeQdW+QlqMlLf3Q7HGUwlDX338wN9Sg="
  },
  {
    "url": "./assets/js/documents.js?v=3.12.7",
    "integrity": "sha256-cFOBIKSUWUwwbprOzJYv7tUOMIzCl/6XfE0yI9gPayc="
  },
  {
    "url": "./assets/js/effects.js?v=3.12.7",
    "integrity": "sha256-z29nXTO0OBr/i5SxQT2kWjNTvis58dHKutG+Q4zdFV4="
  },
  {
    "url": "./assets/js/experience.js?v=3.12.7",
    "integrity": "sha256-P0Kk/xllFuzRpF1uwThs7oT05g1rPjUOgHV9uDCMNPo="
  },
  {
    "url": "./assets/js/icons.js?v=3.12.7",
    "integrity": "sha256-ds17M9Sz24Oj2VnIrr4kUsh9DW7oUFIZRoiSaUm41mI="
  },
  {
    "url": "./assets/js/main.js?v=3.12.7",
    "integrity": "sha256-CeyCUZakOLWGdq2Mzrm3nWnu1W3HHJol3sW4QZAXXEM="
  },
  {
    "url": "./assets/js/moments.js?v=3.12.7",
    "integrity": "sha256-0+mNSLkWSaqOW4FHYES0yHi+yc0J6ea29Zeac8EVEOE="
  },
  {
    "url": "./assets/js/motion.js?v=3.12.7",
    "integrity": "sha256-vxN2FTFxleh9zVtMIBMF58C/yfzO/a6DxZ/4ZE1sRRg="
  },
  {
    "url": "./assets/js/onboarding.js?v=3.12.7",
    "integrity": "sha256-pxxvcRyMuKLngiRBy8jnPWdYGVh3Uq4wUFIhUxLGG9Y="
  },
  {
    "url": "./assets/js/pages.js?v=3.12.7",
    "integrity": "sha256-piY5+o40IPc3xh4ZaL81bFmgmS15fk57nkDCH7fXxbI="
  },
  {
    "url": "./assets/js/phrase-history.js?v=3.12.7",
    "integrity": "sha256-HFas8jvUehChmHiYLJH5ju+pTqcH99BT617iEOO5qlI="
  },
  {
    "url": "./assets/js/qr.js?v=3.12.7",
    "integrity": "sha256-h9+XUGoIJCIzHWgWSpGkBhUkaj6Gd6ujG0KfrWnQCWs="
  },
  {
    "url": "./assets/js/radio.js?v=3.12.7",
    "integrity": "sha256-6jEDfvtzthJMkLGArpxW5nTHji83skRw3NtJYxu4W1w="
  },
  {
    "url": "./assets/js/scene-snapshot.js?v=3.12.7",
    "integrity": "sha256-ytNaUE8kU82gRKrgvL2p5ogZxaEcdlbGFqotDljv64o="
  },
  {
    "url": "./assets/js/scene.js?v=3.12.7",
    "integrity": "sha256-vQQWW1lcVly2nvQYoUHFbpW+vNyFj5arJUCLW+vzDI4="
  },
  {
    "url": "./assets/js/schedules.js?v=3.12.7",
    "integrity": "sha256-H/yt4iLNLqoPJELoramNqaV7nH+WMXu560eLsQeaxJc="
  },
  {
    "url": "./assets/js/share-card.js?v=3.12.7",
    "integrity": "sha256-DdtcnH3IWJH5m6wOeKJGxEyYk+HQ3u9pJYhqya29LWY="
  },
  {
    "url": "./assets/js/share-link.js?v=3.12.7",
    "integrity": "sha256-2TanCsnoLWuqepFmQZ5Bpiv0Cae5pn2NdUzCQXORRwc="
  },
  {
    "url": "./assets/js/share.js?v=3.12.7",
    "integrity": "sha256-8NsFgrUTeIKgIdy2JyT/pjDy8hCt/o78o8wx9K8MAjk="
  },
  {
    "url": "./assets/js/solar.js?v=3.12.7",
    "integrity": "sha256-VGRSsAaknWPX8TWTiaqN4AxevZMN6XyTxfvvPZbWY4s="
  },
  {
    "url": "./assets/js/station-library.js?v=3.12.7",
    "integrity": "sha256-+pTpXsXtsPCRcubkDYH2i9NtQKam99RCO3ifE8ocoUY="
  },
  {
    "url": "./assets/js/station-manager.js?v=3.12.7",
    "integrity": "sha256-/Jq2NfeNtyhVH8wQS8fKUi/FKV3I/hpGI49XHfGic1M="
  },
  {
    "url": "./assets/js/time-core.js?v=3.12.7",
    "integrity": "sha256-yWnAPi+1CXiopVFiAo2BqPpB6zbX4qCpf1gm8FFXMXA="
  },
  {
    "url": "./assets/js/tooltips.js?v=3.12.7",
    "integrity": "sha256-kr8Qi55J94NrF0Sf81nTorzZbGdwBjnD7pPaf45wPMQ="
  },
  {
    "url": "./assets/js/touch-feedback.js?v=3.12.7",
    "integrity": "sha256-KMdQlPn+ES9/Kfah/N/tU6hl1sqcTlQvEdMD8UZnDFM="
  },
  {
    "url": "./assets/js/typing.js?v=3.12.7",
    "integrity": "sha256-UCBA6cDGYJaCIJsv5Zji0ZneeareFqMUovNDYxRCM94="
  },
  {
    "url": "./assets/js/updates.js?v=3.12.7",
    "integrity": "sha256-nnfsimDtqbOAkQzLqZU1OWgiNyI8XkDxdRPShJIbRpk="
  },
  {
    "url": "./assets/js/weather-scene.js?v=3.12.7",
    "integrity": "sha256-1d94NsdzeehITi9XR9HJ3UKJ+SIsGxvJtRbMZ8Dd8vA="
  },
  {
    "url": "./calendario.html",
    "integrity": "sha256-qgcgULIre5F75pF6Ahe2kTEUcO4Xx/JuVbyue2Usjk4="
  },
  {
    "url": "./CHANGELOG.md",
    "integrity": "sha256-P2VEZR757kE4vgOByGAUsSWsqIkl+cUeO+hnHzAQaiE="
  },
  {
    "url": "./data/collection-catalog.js?v=3.12.7",
    "integrity": "sha256-UcIR0Oz/3Vg766QJdY+Uzfx4QzqghtGhseMXceIB2ts="
  },
  {
    "url": "./data/collections/classici-10.json",
    "integrity": "sha256-yDXL7jWREGetNiVY20BiLk/GQwM+2NPkwILwWukGqTQ="
  },
  {
    "url": "./data/collections/passi-nuovi-500.json",
    "integrity": "sha256-MZqp1iriiXiJza6ik+zNBNARBGokwPZQk7OnKZ3cYmA="
  },
  {
    "url": "./data/collections/piccole-poesie-60.json",
    "integrity": "sha256-lcOQFEdF35LWHEz2YMTjbM0vZYXO8sSMH+DRna+ZtFU="
  },
  {
    "url": "./data/phrases.js?v=3.12.7",
    "integrity": "sha256-S1hjBGN9N/XT3kSrXVE5xXanUIJ2HqtUKVQnFqTmlEw="
  },
  {
    "url": "./data/stations.js?v=3.12.7",
    "integrity": "sha256-ogF3QoCghtIz8erATYiLCc8fcJ7v5RDFUrFuU4EU4CA="
  },
  {
    "url": "./docs/FONTI-CITAZIONI.md",
    "integrity": "sha256-qaF7Rfl0nm2yAwDOzbOh+jruUvUg9bPflLr7cSsfync="
  },
  {
    "url": "./docs/licenses/BOOTSTRAP-ICONS-LICENSE.txt",
    "integrity": "sha256-IzP3TVP5ZT5tvN27Heb5jvzv3BhMB4kcg0ge1Oof0sE="
  },
  {
    "url": "./docs/licenses/ISTANTE-LICENSE.txt",
    "integrity": "sha256-Ktg1do9Q2jHUIx9cMXaw/SNBir9RQS0dl8VWAiZaTRc="
  },
  {
    "url": "./docs/licenses/MATERIAL-ICONS-LICENSE.txt",
    "integrity": "sha256-z8d0m5b2O9McPEK1xHG/dWgUBT6EfBDz6wA0F7xSPTA="
  },
  {
    "url": "./docs/licenses/MATERIAL-ICONS-NOTICE.txt",
    "integrity": "sha256-qGa6+xeMhXZ4sSasbOeTxTtIr7nNAQwMVHitGX9mMWQ="
  },
  {
    "url": "./docs/licenses/PYTHON-QRCODE-LICENSE.txt",
    "integrity": "sha256-QN+5A8lO4/eJUAExMRGGVI7Lpc79NVdiPXcA4lIquZQ="
  },
  {
    "url": "./docs/licenses/SUNCALC-LICENSE.txt",
    "integrity": "sha256-LJgsWk3SiStt+NonyzMKybQE3T/9B6OexzTOZlx5r6U="
  },
  {
    "url": "./docs/licenses/UNICODE-LICENSE.txt",
    "integrity": "sha256-4njwelQt/KqqeRiW/ajV5szqs+YO9CVnYFCCdzaaPtE="
  },
  {
    "url": "./docs/LICENZA.md",
    "integrity": "sha256-I4Fq0NKoJncCfwouYRbN2Zo2gT7mCV7HIqRrOx+OkZE="
  },
  {
    "url": "./docs/release/v3.10.0.md",
    "integrity": "sha256-n0cLlh0dvAD1cnx1NDYSOdyw50n6rOQEAbBg5myn70A="
  },
  {
    "url": "./docs/release/v3.10.1.md",
    "integrity": "sha256-N8oN6ElDwKILJAwkRZ0tDXumH82/HSIH7VblMBifTX8="
  },
  {
    "url": "./docs/release/v3.10.2.md",
    "integrity": "sha256-hoOyZuniTsi6iUH/SSPKeOnN2wv790gJML3xnymFTfU="
  },
  {
    "url": "./docs/release/v3.10.3.md",
    "integrity": "sha256-HHOHb6OvcqvXBqEkk6ek/8FcGP8lJuTdd/TiryvBvOk="
  },
  {
    "url": "./docs/release/v3.11.0.md",
    "integrity": "sha256-mqvQAHMkvYIhN2h6UDLLqIJfvIVYKc0wCMFIDm7fgyo="
  },
  {
    "url": "./docs/release/v3.11.1.md",
    "integrity": "sha256-w7Ih70my+LKl8Luz1wkjYLTd10rbOYnS30bq4lV6IiA="
  },
  {
    "url": "./docs/release/v3.12.0.md",
    "integrity": "sha256-eVyXTlxXUlIk1mUVN5/udYO7GPo5W5RmpAwnkkVEM8M="
  },
  {
    "url": "./docs/release/v3.12.1.md",
    "integrity": "sha256-Q3D0WLINjzke8HRoCz7RzpGmdVE1q/YeOVJ5mDcW/Jk="
  },
  {
    "url": "./docs/release/v3.12.2.md",
    "integrity": "sha256-I65lDail3f9dwzzdXo07SqgyqSzMITx9iTe3dMia9z4="
  },
  {
    "url": "./docs/release/v3.12.3.md",
    "integrity": "sha256-El8rvjB5mLjmHsDpzUaqt7yuhcUc2JjhjuGDt6PvhIk="
  },
  {
    "url": "./docs/release/v3.12.4.md",
    "integrity": "sha256-OWGQJnzJlIwRY62zZUJzbbfdlJPKOJbNbjnN8f9PGoA="
  },
  {
    "url": "./docs/release/v3.12.5.md",
    "integrity": "sha256-/X0JvDMx4l5XCKCaS9u1q5eGVDUBBgSBqMpsVwlG+vs="
  },
  {
    "url": "./docs/release/v3.12.6.md",
    "integrity": "sha256-06pyKfdsWrfY+1vpAofUy2noIFSW00SdEoFLpWcZpKk="
  },
  {
    "url": "./docs/release/v3.12.7.md",
    "integrity": "sha256-Cw7Rtg3QK2fIl998AF7bdFalzsiZQzmWLHex+oqM2dw="
  },
  {
    "url": "./docs/release/v3.4.0.md",
    "integrity": "sha256-Iyfij0NgTLddiOIOsqQTrG6Rs0UgKLcaMF4OExi+BpM="
  },
  {
    "url": "./docs/release/v3.5.0.md",
    "integrity": "sha256-D0T7C3x/QokjyYYnpvJoPI0vmrwrxi/3HX1VI/95lfs="
  },
  {
    "url": "./docs/release/v3.6.0.md",
    "integrity": "sha256-nAEZkVdTzmlGulyMQdGGv2y88rIBDlPQrRKMy2q2qGw="
  },
  {
    "url": "./docs/release/v3.7.0.md",
    "integrity": "sha256-6iEhJJQrE2owb5qK4OrTq50wFXrgADxGX3GvrQ0dKaU="
  },
  {
    "url": "./docs/release/v3.8.0.md",
    "integrity": "sha256-jr86HSz0+Hux7yC7uvGuaRHu0xD0sQDvc7p4hWaPDG0="
  },
  {
    "url": "./docs/release/v3.9.0.md",
    "integrity": "sha256-590YEow56KkzSQvgk3mZtOCvXgpbOTqvziTQ4KzuiO4="
  },
  {
    "url": "./docs/TERZE-PARTI.md",
    "integrity": "sha256-7fGJ4Sd3IEwpJtLop3uAw0XsrdnvA8dRIwg/yQ92I5g="
  },
  {
    "url": "./docs/VISIONE-E-DESIGN.md",
    "integrity": "sha256-4bzEINYVYotblzGInRcUoy/QOhKglegwOq50aBbQPN0="
  },
  {
    "url": "./index.html",
    "integrity": "sha256-OwMSvhw9bo/q1PuLRz8d0SdU68aSe5F63qJr9f3/yZU="
  },
  {
    "url": "./leggi.html",
    "integrity": "sha256-7XgyOnt1wAEwe3ggDcnvOSz4mMXL0V25ftMMMr/voAA="
  },
  {
    "url": "./manifest.webmanifest",
    "integrity": "sha256-SFmOPeQmF8N9xfhBpEeTjnvWjbLaR/oUWmY4xvL16eA="
  },
  {
    "url": "./README.md",
    "integrity": "sha256-3NY2ORoahq5s/pbk9RluexrTG2w+EIYy2Jqs0zVJxWs="
  },
  {
    "url": "./version.json",
    "integrity": "sha256-d4EW5lgDYXIFaqlo0Qoe5fhLH1pjEUb8hTtKp066i5k="
  }
];
const ABS=FILES.map(f=>({...f,url:new URL(f.url,self.registration.scope).href}));
const URLS=new Set(ABS.map(f=>f.url));
self.addEventListener('install',event=>event.waitUntil((async()=>{
 try{const cache=await caches.open(CACHE);await cache.addAll(ABS.map(f=>new Request(f.url,{cache:'reload',integrity:f.integrity})));}
 catch(error){await caches.delete(CACHE);throw error;}
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const previous=(await caches.keys()).filter(k=>k.startsWith(PREFIX)&&k!==CACHE);
 for(const key of previous.slice(0,-1))await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('message',event=>{
 if(event.data?.type==='SKIP_WAITING')event.waitUntil(self.skipWaiting());
 if(event.data?.type==='GET_VERSION')event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);const complete=(await Promise.all(ABS.map(f=>cache.match(f.url)))).every(Boolean);
  event.ports[0]?.postMessage({version:VERSION,complete,files:ABS.length});
 })());
});
self.addEventListener('fetch',event=>{
 const r=event.request;if(r.method!=='GET')return;
 const url=new URL(r.url),root=new URL(self.registration.scope);
 if(url.origin!==root.origin)return;
 const entry=r.mode==='navigate'&&(url.pathname===root.pathname||url.pathname===root.pathname+'index.html');
 const reader=r.mode==='navigate'&&url.pathname===root.pathname+'leggi.html';
 const calendar=r.mode==='navigate'&&url.pathname===root.pathname+'calendario.html';
 if(!entry&&!reader&&!calendar&&!URLS.has(url.href))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE),key=entry?new URL('index.html',root).href:reader?new URL('leggi.html',root).href:calendar?new URL('calendario.html',root).href:r.url;
  const hit=await cache.match(key);if(hit)return hit;
  const spec=ABS.find(f=>f.url===key);
  try{const response=await fetch(new Request(key,{cache:'reload',integrity:spec?.integrity||''}));if(response.ok)await cache.put(key,response.clone());return response;}
  catch(_){return new Response('Risorsa non disponibile offline. Riapri Istante con una connessione.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});}
 })());
});
