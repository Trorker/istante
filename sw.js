/* Istante 3.13.12 - verified offline shell; updates wait for consent. */
'use strict';
const VERSION="3.13.12";
const PREFIX='istante-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+VERSION+'-responsive-prod-460e1afd';
const FILES=[
  {
    "url": "./CHANGELOG.md",
    "integrity": "sha256-iGqh6MuRGkcNYjEYVmFohj0/HrtOyO4EEkEF2upVGV4="
  },
  {
    "url": "./README.md",
    "integrity": "sha256-94vrDiVPo0IWf0ZXPHAumqjapGNjhDPTStZo68U/CMM="
  },
  {
    "url": "./assets/css/app.css?v=3.13.12",
    "integrity": "sha256-hc7VCRE8VgS2n1lLyoLlAEmeONMC2+U+G43leY+XUnA="
  },
  {
    "url": "./assets/css/calendar.css?v=3.13.12",
    "integrity": "sha256-DuoT0lMSItiWFtkLJwoolLwetQHYAs97No38MxL1SRk="
  },
  {
    "url": "./assets/css/documents.css?v=3.13.12",
    "integrity": "sha256-w30+osfEFz4kpIUwSQSM0yBdD9dbBPcs7d3AbDDQt1U="
  },
  {
    "url": "./assets/css/evolution.css?v=3.13.12",
    "integrity": "sha256-otbjJj7xmmnpHpPSnnt/mG5PYXAlAcFJp+LXVB/miBk="
  },
  {
    "url": "./assets/css/interactions.css?v=3.13.12",
    "integrity": "sha256-y3tvefDO9mjzSFLBBasVMiIvnfg70E9dOohP687CN4k="
  },
  {
    "url": "./assets/css/onboarding.css?v=3.13.12",
    "integrity": "sha256-iLg8vKcpzEjxWYWO94j2mf6SBJpvn7JkmJb7yfxgU6g="
  },
  {
    "url": "./assets/css/polish-3.10.1.css?v=3.13.12",
    "integrity": "sha256-nqQbx/QtoAXsR9h8BAQF7oDyM3Tonzy5cGfWOZupWnk="
  },
  {
    "url": "./assets/css/polish-3.10.3.css?v=3.13.12",
    "integrity": "sha256-jJdSkUc46ThGSJmQxUS0jwAFIyIhreSN+JuAxgVsrY0="
  },
  {
    "url": "./assets/css/polish-3.11.1.css?v=3.13.12",
    "integrity": "sha256-z1bGkeG6QAOJ3kms8CfgrdRNUFMf2dcdYlN2nrF1iqg="
  },
  {
    "url": "./assets/css/polish-3.11.css?v=3.13.12",
    "integrity": "sha256-suzlsG9WzqGmwIJIPGBvW26SitKvLZ9vx0TjjHaAq20="
  },
  {
    "url": "./assets/css/polish-3.12.1.css?v=3.13.12",
    "integrity": "sha256-kh/p10L9Vz8wbcSHXgMdpDej6KY3wPvtHosDREva9TA="
  },
  {
    "url": "./assets/css/polish-3.12.2.css?v=3.13.12",
    "integrity": "sha256-+VmTXQCXuDkQhbEy9L+/CWbEeVG9u2KxtyrH0lToV1Q="
  },
  {
    "url": "./assets/css/polish-3.12.3.css?v=3.13.12",
    "integrity": "sha256-cakVhfzQS6z6XL5Y7F7tfTzDwAOvtH5Yb5a5QLBcpnI="
  },
  {
    "url": "./assets/css/polish-3.12.5.css?v=3.13.12",
    "integrity": "sha256-zcVnD2Jg1OKLNP0uPzA7a1CgpKgDFxWXj59WK49ru9A="
  },
  {
    "url": "./assets/css/polish-3.12.6.css?v=3.13.12",
    "integrity": "sha256-HjtuePsJDjntpUeVxTz+Wa2s6ECH4b28wPuazpoOfAY="
  },
  {
    "url": "./assets/css/polish-3.12.7.css?v=3.13.12",
    "integrity": "sha256-/bl97ZWvM1hxTNZ1/7KWjr0S8sfs9xkW5+0kkN2Nkqw="
  },
  {
    "url": "./assets/css/polish-3.12.8.css?v=3.13.12",
    "integrity": "sha256-2XARTEnu3Bg+zO/QdYEsCSQA1ELv9+hx0+r7M4VFeEE="
  },
  {
    "url": "./assets/css/polish-3.12.9.css?v=3.13.12",
    "integrity": "sha256-dGc/AuRWGHe8eYq4kzgJgNjid4F1iQHASPcOtY13HfA="
  },
  {
    "url": "./assets/css/polish-3.13.0.css?v=3.13.12",
    "integrity": "sha256-c1eBsKkgmctrC/uYB5q5OsqVCtNn2L9FGEQqBx9QDwQ="
  },
  {
    "url": "./assets/css/polish-3.13.1.css?v=3.13.12",
    "integrity": "sha256-B/iUIyhyk1TTtZfllhqk/FyvebEYo6fAoTaqzSp/wKI="
  },
  {
    "url": "./assets/css/polish-3.13.10.css?v=3.13.12",
    "integrity": "sha256-64kTtU5Toultc5ahLsiUJLHahCv4VG5B4/o8z+8/ue0="
  },
  {
    "url": "./assets/css/polish-3.13.11.css?v=3.13.12",
    "integrity": "sha256-Rwpo2ZLp+f/3dmZ3CX+DpV0S2VJh24P55EErlhnlVxk="
  },
  {
    "url": "./assets/css/polish-3.13.12.css?v=3.13.12",
    "integrity": "sha256-Knw52WH7pF6S03/YOqaWHh9JPvUAdSVZo+2RiVbCOKk="
  },
  {
    "url": "./assets/css/polish-3.13.2.css?v=3.13.12",
    "integrity": "sha256-+jKV3a4AXEyq/sybjasVeOLOn0Nzbt0ghnPxAAXuyy8="
  },
  {
    "url": "./assets/css/polish-3.13.3.css?v=3.13.12",
    "integrity": "sha256-TKRyqBhVQCP7fJyXc5TVk8KVVRQ3i91Tca88uDvzKQM="
  },
  {
    "url": "./assets/css/polish-3.13.4.css?v=3.13.12",
    "integrity": "sha256-1/CaZ+SlEUTeUvF+ji3luA0Ql1wuZ408TPGC3tN6uP8="
  },
  {
    "url": "./assets/css/polish-3.13.5.css?v=3.13.12",
    "integrity": "sha256-LQKc3KR7yXlfxPMdo5rq3tF3jR3wQt5SwN3+1OxmYHc="
  },
  {
    "url": "./assets/css/polish-3.13.6.css?v=3.13.12",
    "integrity": "sha256-JzAJha9J7bXEtcYKdaigtnK40ADAQ9tOTe5svCllBvE="
  },
  {
    "url": "./assets/css/polish-3.13.7.css?v=3.13.12",
    "integrity": "sha256-dvzuOl7lHCnP/8pSvDYlN5EOqpn1ORhlhCHPiN3rlcE="
  },
  {
    "url": "./assets/css/polish-3.13.8.css?v=3.13.12",
    "integrity": "sha256-+dk5aYFM/i8doHUgS10O3DVQ406oMURB2vDVqmN04MM="
  },
  {
    "url": "./assets/css/polish-3.13.9.css?v=3.13.12",
    "integrity": "sha256-0dbV2XVtBZahW13W0Qxc72Pg1KwqaKmGw3fGm8trSb4="
  },
  {
    "url": "./assets/css/rebuild.css?v=3.13.12",
    "integrity": "sha256-DevElMQLi0ijjyFjt8y3hsEOg4scKJf49hblUGN8vv0="
  },
  {
    "url": "./assets/css/refinements.css?v=3.13.12",
    "integrity": "sha256-2W5T0sYqd4/H9OTUNhXCG7mIa7CS1zfvIhT+9l8ezGo="
  },
  {
    "url": "./assets/css/scene.css?v=3.13.12",
    "integrity": "sha256-13Pntu57jExsFY3oKae52K7f6/xVgODrtpTHzp/ZVuM="
  },
  {
    "url": "./assets/css/sharing.css?v=3.13.12",
    "integrity": "sha256-bdIKAzmcrzJGMDjxR7R6OyCnEqEFgmYiOMlhocAPCac="
  },
  {
    "url": "./assets/css/workspace.css?v=3.13.12",
    "integrity": "sha256-VF79nbke/NKBmYb7RpPuYY3J7GAJL8WHYS7UE59z5Js="
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
    "url": "./assets/js/ambient.js?v=3.13.12",
    "integrity": "sha256-6aTKhGOJvFau9okuVrpfl3/nY5njbkRYvTrsrmEdCiw="
  },
  {
    "url": "./assets/js/backup.js?v=3.13.12",
    "integrity": "sha256-p2dz1ebiJS5eMQH3vJ0rJzpC96d6N4sjugkessUZg18="
  },
  {
    "url": "./assets/js/calendar-core.js?v=3.13.12",
    "integrity": "sha256-0PSRzkTpt6QT+HTkNXbcI9iDZxq6FkNiz9MX1TPWmrQ="
  },
  {
    "url": "./assets/js/calendar-holidays.js?v=3.13.12",
    "integrity": "sha256-XhBKagz5DeWSsE6Fj0fOxtEcuMPz9fKBLtz26cwfpq8="
  },
  {
    "url": "./assets/js/calendar-worker.js?v=3.13.12",
    "integrity": "sha256-QClTXX2cCBrvQVl3LvEgfoPWi8SfDk/Z5efjH1kOw2U="
  },
  {
    "url": "./assets/js/calendar.js?v=3.13.12",
    "integrity": "sha256-YxGFQzWBjCEZI2bdZLWPjwwC9i874ubUyKnEGX3k5AE="
  },
  {
    "url": "./assets/js/collections.js?v=3.13.12",
    "integrity": "sha256-yvVz/zdTpkPm55fqrw2eWBd5pM0g1fKxml2qByW8QrY="
  },
  {
    "url": "./assets/js/companion.js?v=3.13.12",
    "integrity": "sha256-o0fN7fB6IZQ3WZmdtwvC8/Bu/c2nwnyR4Cf90rwg+9w="
  },
  {
    "url": "./assets/js/controls.js?v=3.13.12",
    "integrity": "sha256-+NERywMyu39MNc4I9UOR1ReGkgO6oafM+2NHE7ju968="
  },
  {
    "url": "./assets/js/core.js?v=3.13.12",
    "integrity": "sha256-FIr0bsqkho9ze6m332UvEcskef75ApialGLkG7E5GHQ="
  },
  {
    "url": "./assets/js/cursor.js?v=3.13.12",
    "integrity": "sha256-xnjdsjHYgqNP2TKtbzg7N7TFXtCfxmkOtXcRsGEl4ps="
  },
  {
    "url": "./assets/js/documents.js?v=3.13.12",
    "integrity": "sha256-RzG03dxeso3TF2dsbB7rivmaFB1kc+6ByVPUUR0S0+Y="
  },
  {
    "url": "./assets/js/effects.js?v=3.13.12",
    "integrity": "sha256-z29nXTO0OBr/i5SxQT2kWjNTvis58dHKutG+Q4zdFV4="
  },
  {
    "url": "./assets/js/experience.js?v=3.13.12",
    "integrity": "sha256-CHzH0N6sfi9lO3RWmgqess4oFZGcCdj/avl1w+BZ3DE="
  },
  {
    "url": "./assets/js/gestures.js?v=3.13.12",
    "integrity": "sha256-Mh2+eg8IdzeacV766fv6e7Dbei6N9cuwRgF8gPhTHQY="
  },
  {
    "url": "./assets/js/icons.js?v=3.13.12",
    "integrity": "sha256-/1bUWFvXNI3j6MxGR5hB9azdAoqE0D7lubv9kc4J958="
  },
  {
    "url": "./assets/js/main.js?v=3.13.12",
    "integrity": "sha256-OmLIKYiY/n73dhIcPW+mnuveSYSF3Pl5FWCwK6aSRlA="
  },
  {
    "url": "./assets/js/moments.js?v=3.13.12",
    "integrity": "sha256-kLrKLHYVARjxVMXxM66TohP6SIm5rRrGxCSOzwCMUFw="
  },
  {
    "url": "./assets/js/motion.js?v=3.13.12",
    "integrity": "sha256-vxN2FTFxleh9zVtMIBMF58C/yfzO/a6DxZ/4ZE1sRRg="
  },
  {
    "url": "./assets/js/onboarding.js?v=3.13.12",
    "integrity": "sha256-3cbJ7RXX5aMNTM/E3thMOwHG6eeM/zWaVBF0vj5UFMU="
  },
  {
    "url": "./assets/js/pages.js?v=3.13.12",
    "integrity": "sha256-dYv3KAO0sVMx4kHm5c+4spSmSj3z+bnNVWQ+YQRobnU="
  },
  {
    "url": "./assets/js/phrase-history.js?v=3.13.12",
    "integrity": "sha256-HFas8jvUehChmHiYLJH5ju+pTqcH99BT617iEOO5qlI="
  },
  {
    "url": "./assets/js/qr.js?v=3.13.12",
    "integrity": "sha256-h9+XUGoIJCIzHWgWSpGkBhUkaj6Gd6ujG0KfrWnQCWs="
  },
  {
    "url": "./assets/js/radio.js?v=3.13.12",
    "integrity": "sha256-1NjCUKYwjfJaqqFKnmShOtnwzolHM59xHX+iLvQrfAM="
  },
  {
    "url": "./assets/js/scene-snapshot.js?v=3.13.12",
    "integrity": "sha256-uWF/RWhqsf1OSDC8P2qqJRG38sSd1HVFemucosjek2w="
  },
  {
    "url": "./assets/js/scene.js?v=3.13.12",
    "integrity": "sha256-KmyIqEV/wShmMJzyUq6kGtTRU7YgC45Ch1yxC+DsaY4="
  },
  {
    "url": "./assets/js/schedules.js?v=3.13.12",
    "integrity": "sha256-H/yt4iLNLqoPJELoramNqaV7nH+WMXu560eLsQeaxJc="
  },
  {
    "url": "./assets/js/share-card.js?v=3.13.12",
    "integrity": "sha256-DdtcnH3IWJH5m6wOeKJGxEyYk+HQ3u9pJYhqya29LWY="
  },
  {
    "url": "./assets/js/share-link.js?v=3.13.12",
    "integrity": "sha256-2TanCsnoLWuqepFmQZ5Bpiv0Cae5pn2NdUzCQXORRwc="
  },
  {
    "url": "./assets/js/share.js?v=3.13.12",
    "integrity": "sha256-qDznyu5UgCS0WCxuZnPt6yR/hkHeF+OJktxkusYMIWY="
  },
  {
    "url": "./assets/js/solar.js?v=3.13.12",
    "integrity": "sha256-VGRSsAaknWPX8TWTiaqN4AxevZMN6XyTxfvvPZbWY4s="
  },
  {
    "url": "./assets/js/station-library.js?v=3.13.12",
    "integrity": "sha256-LgYPUz7awWA4t+908F7CW9DqRu55l3Ud2PhLDd5cYLk="
  },
  {
    "url": "./assets/js/station-manager.js?v=3.13.12",
    "integrity": "sha256-BjobRZbBViBAGZ52MRgEFtHHa3pMV7+3OnF2i/lIJvs="
  },
  {
    "url": "./assets/js/time-core.js?v=3.13.12",
    "integrity": "sha256-yWnAPi+1CXiopVFiAo2BqPpB6zbX4qCpf1gm8FFXMXA="
  },
  {
    "url": "./assets/js/tooltips.js?v=3.13.12",
    "integrity": "sha256-rgj6lwM8zUdP6EjRZMtSq0RGtDjaxF5yxecawV/qPEM="
  },
  {
    "url": "./assets/js/touch-feedback.js?v=3.13.12",
    "integrity": "sha256-KMdQlPn+ES9/Kfah/N/tU6hl1sqcTlQvEdMD8UZnDFM="
  },
  {
    "url": "./assets/js/typing.js?v=3.13.12",
    "integrity": "sha256-UCBA6cDGYJaCIJsv5Zji0ZneeareFqMUovNDYxRCM94="
  },
  {
    "url": "./assets/js/updates.js?v=3.13.12",
    "integrity": "sha256-0776LQp3QB/CAsLDWiTVtdsFIwldoMVnQaRgwfaWYnw="
  },
  {
    "url": "./assets/js/weather-scene.js?v=3.13.12",
    "integrity": "sha256-1d94NsdzeehITi9XR9HJ3UKJ+SIsGxvJtRbMZ8Dd8vA="
  },
  {
    "url": "./data/collection-catalog.js?v=3.13.12",
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
    "url": "./data/phrases.js?v=3.13.12",
    "integrity": "sha256-S1hjBGN9N/XT3kSrXVE5xXanUIJ2HqtUKVQnFqTmlEw="
  },
  {
    "url": "./data/stations.js?v=3.13.12",
    "integrity": "sha256-ogF3QoCghtIz8erATYiLCc8fcJ7v5RDFUrFuU4EU4CA="
  },
  {
    "url": "./docs/FONTI-CITAZIONI.md",
    "integrity": "sha256-qaF7Rfl0nm2yAwDOzbOh+jruUvUg9bPflLr7cSsfync="
  },
  {
    "url": "./docs/LICENZA.md",
    "integrity": "sha256-I4Fq0NKoJncCfwouYRbN2Zo2gT7mCV7HIqRrOx+OkZE="
  },
  {
    "url": "./docs/TERZE-PARTI.md",
    "integrity": "sha256-UVa+VSE/eFIFViahuoQ6p9WDGJteTw6WPirT8n+4hTM="
  },
  {
    "url": "./docs/VISIONE-E-DESIGN.md",
    "integrity": "sha256-sZKFhQbDmPAPA0aXYs3iC+9mf0ADQB7dAEKx+w5vC2o="
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
    "url": "./docs/release/v3.12.8.md",
    "integrity": "sha256-Wzoo1gOW7AdxnbZYQ0ls550ZXasxrqzwQgsXHLUvkWk="
  },
  {
    "url": "./docs/release/v3.12.9.md",
    "integrity": "sha256-q3klTjPqA3+ssTHwyXzfGh5+THsx30xX+yD91ngcnvE="
  },
  {
    "url": "./docs/release/v3.13.0.md",
    "integrity": "sha256-qlo9LTc+GbeoJJZLixZhckBNwFA+dTcBKdsMz3nj1M0="
  },
  {
    "url": "./docs/release/v3.13.1.md",
    "integrity": "sha256-dY1diM0WdJZufp41tExrXC1cPQRqn98opDj95wJxXh4="
  },
  {
    "url": "./docs/release/v3.13.10.md",
    "integrity": "sha256-sKxsbGyylkDOtrsCBLDoLhDddo9dMU7bIQWpYhMs1Og="
  },
  {
    "url": "./docs/release/v3.13.11.md",
    "integrity": "sha256-AmBYUlZzOjfXOtF6edVR3K4K57sGJCy5nLeybG4TlaI="
  },
  {
    "url": "./docs/release/v3.13.12.md",
    "integrity": "sha256-q+K8+Ax3REgH3f/hSaSwx/b3cFZXkBtZ8skP0KPXgXI="
  },
  {
    "url": "./docs/release/v3.13.2.md",
    "integrity": "sha256-f1aDr01w0RBs3vA3OQbNvA8m9SI9UD461CZKu3A7uPE="
  },
  {
    "url": "./docs/release/v3.13.3.md",
    "integrity": "sha256-J/ug/jBbDDTdMjEUgueQUfUYMmjIr0sI3yh3mZR7Jfw="
  },
  {
    "url": "./docs/release/v3.13.4.md",
    "integrity": "sha256-BY/LAIDyHrWdkVr6qWiyyIU4S/p0ghioayZtpdCRt+s="
  },
  {
    "url": "./docs/release/v3.13.5.md",
    "integrity": "sha256-UNtd4pVvSUNc6EOrncg4PQ1eh1kr6+/XOg8T6dVtCWU="
  },
  {
    "url": "./docs/release/v3.13.6.md",
    "integrity": "sha256-cl+4I3OsZc365sjd8DQqx9ceyWuWkwfc4EC2txSXz/o="
  },
  {
    "url": "./docs/release/v3.13.7.md",
    "integrity": "sha256-Jr2SpzYBVBB3+jn6JvGA37+PaCKmWlbT1xBbexrd/4o="
  },
  {
    "url": "./docs/release/v3.13.8.md",
    "integrity": "sha256-f9ySu90H1jmqDdUkUmHmRYZiI47U0LhgxbvfX3oF/Dg="
  },
  {
    "url": "./docs/release/v3.13.9.md",
    "integrity": "sha256-pDFDMlG9Qe/yyvvCCQot/A4dSkx9SFAtxUlKq/T6FGM="
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
    "url": "./index.html",
    "integrity": "sha256-NiNboWmkkWFBrzztXEbsiBlOwE5zW2qaCR3OVi7bQdA="
  },
  {
    "url": "./leggi.html",
    "integrity": "sha256-M9DrQmG6BhCYLp3QXY64wgquO6VVrD8NjKdd4CQCwjg="
  },
  {
    "url": "./manifest.webmanifest",
    "integrity": "sha256-SFmOPeQmF8N9xfhBpEeTjnvWjbLaR/oUWmY4xvL16eA="
  },
  {
    "url": "./version.json",
    "integrity": "sha256-jtESbrA4ISVfuCR3Vk/6BH9/ZINKgYhFS49A2vmQBLA="
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
