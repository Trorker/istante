/* Istante 3.14.0 - verified offline shell; updates wait for consent. */
'use strict';
const VERSION="3.14.0";
const PREFIX='istante-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+VERSION+'-5709d4781264';
const FILES=[
  {
    "url": "./CHANGELOG.md",
    "integrity": "sha256-qrw8CpI9weM/lKwUuOiWg8urJ1K6EDjz/dPTHOYwNb0="
  },
  {
    "url": "./README.md",
    "integrity": "sha256-cambnZC9tuJyrlluUgw0oGPPi7wm5pHSO6UbV19y600="
  },
  {
    "url": "./assets/css/documents.css?v=3.14.0",
    "integrity": "sha256-dKSkNKBq9h8wZfI8bEZOSLosEBej6qRj/EX1Vh5Pqq4="
  },
  {
    "url": "./assets/css/istante.css?v=3.14.0",
    "integrity": "sha256-AWmzU77ayvw3m9b74pXvV98gaQKcdS18Jn/trJeIyoA="
  },
  {
    "url": "./assets/css/responsive.css?v=3.14.0",
    "integrity": "sha256-p1vIbOyGJaZrpzFWSKhaNEooAuqcxko+5KUyGPVIqyI="
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
    "url": "./assets/js/ambient.js?v=3.14.0",
    "integrity": "sha256-MoVyZ/A95UEOzOgFlryVJErZHDlIuogFxskSWegRDUk="
  },
  {
    "url": "./assets/js/backup.js?v=3.14.0",
    "integrity": "sha256-pIAKr62OOORXA+ttJyvIICmO/mr0kuSAJPdZVU8eIOA="
  },
  {
    "url": "./assets/js/calendar-core.js?v=3.14.0",
    "integrity": "sha256-0PSRzkTpt6QT+HTkNXbcI9iDZxq6FkNiz9MX1TPWmrQ="
  },
  {
    "url": "./assets/js/calendar-holidays.js?v=3.14.0",
    "integrity": "sha256-XhBKagz5DeWSsE6Fj0fOxtEcuMPz9fKBLtz26cwfpq8="
  },
  {
    "url": "./assets/js/calendar-worker.js?v=3.14.0",
    "integrity": "sha256-cvJDcSD/P35Sk/XnCysXtwE+xQSnN2NeLBKaA9FebN4="
  },
  {
    "url": "./assets/js/calendar.js?v=3.14.0",
    "integrity": "sha256-KxQBARQyRR/yFLKuzY2Y6ZbCpIc1wlNvvoI5uSTyrw4="
  },
  {
    "url": "./assets/js/collections.js?v=3.14.0",
    "integrity": "sha256-+prgOQNTNBw3Xv90CtKHTYnMbO635TlZtI66d7yC5F4="
  },
  {
    "url": "./assets/js/companion.js?v=3.14.0",
    "integrity": "sha256-o0fN7fB6IZQ3WZmdtwvC8/Bu/c2nwnyR4Cf90rwg+9w="
  },
  {
    "url": "./assets/js/controls.js?v=3.14.0",
    "integrity": "sha256-USxmu1VZahCDyFtXafMoAHtGg+ja9YreGZrB7vAN4Jk="
  },
  {
    "url": "./assets/js/core.js?v=3.14.0",
    "integrity": "sha256-50k7aaCuH0neIcNYW1kEWdD3Wg2r6It6ObGItZg25L8="
  },
  {
    "url": "./assets/js/cursor.js?v=3.14.0",
    "integrity": "sha256-luiXnAzzrv9fGI8Ev8OmZn8DJQvD/nqFTP1WxQHIcR4="
  },
  {
    "url": "./assets/js/documents.js?v=3.14.0",
    "integrity": "sha256-TJi1cpUC45uAJKkck0UE09wZH5m3Jsr8pywaCBvUGT8="
  },
  {
    "url": "./assets/js/effects.js?v=3.14.0",
    "integrity": "sha256-z29nXTO0OBr/i5SxQT2kWjNTvis58dHKutG+Q4zdFV4="
  },
  {
    "url": "./assets/js/experience.js?v=3.14.0",
    "integrity": "sha256-KfadD2lnDpO5/X3dLr50RN62BD2KM3/YQp6I6cv5RHc="
  },
  {
    "url": "./assets/js/gestures.js?v=3.14.0",
    "integrity": "sha256-NFsnVUqih8LAIeS3C5KIM+vETblxpMhc4K2+aliNUfE="
  },
  {
    "url": "./assets/js/icons.js?v=3.14.0",
    "integrity": "sha256-/xO4oVp4tmWoATZUtlWA5YJPlkufZvhaS83V5M/YrTw="
  },
  {
    "url": "./assets/js/main.js?v=3.14.0",
    "integrity": "sha256-WvCMqEzNwfglpGg9dSnOyiHiYqCFKmcw692xpSiN1N4="
  },
  {
    "url": "./assets/js/moments.js?v=3.14.0",
    "integrity": "sha256-tcdT1Xw09HkF2M+b2oAjXz1oHmjOCOuV16Mr8tyhTck="
  },
  {
    "url": "./assets/js/motion.js?v=3.14.0",
    "integrity": "sha256-vxN2FTFxleh9zVtMIBMF58C/yfzO/a6DxZ/4ZE1sRRg="
  },
  {
    "url": "./assets/js/onboarding.js?v=3.14.0",
    "integrity": "sha256-jGHMyZToPxof68I+eyQb97ooB7BHm8X/6xj5EdC1Z2k="
  },
  {
    "url": "./assets/js/pages.js?v=3.14.0",
    "integrity": "sha256-wjHLxCi4QUAc8LH0ztFEcY888UX1pZV4G3E7ryyGz1k="
  },
  {
    "url": "./assets/js/phrase-history.js?v=3.14.0",
    "integrity": "sha256-HFas8jvUehChmHiYLJH5ju+pTqcH99BT617iEOO5qlI="
  },
  {
    "url": "./assets/js/qr.js?v=3.14.0",
    "integrity": "sha256-h9+XUGoIJCIzHWgWSpGkBhUkaj6Gd6ujG0KfrWnQCWs="
  },
  {
    "url": "./assets/js/radio.js?v=3.14.0",
    "integrity": "sha256-QCzw/cottXRupICRB7OUzM7/10fkpDuFH+/A3kLw5LA="
  },
  {
    "url": "./assets/js/scene-snapshot.js?v=3.14.0",
    "integrity": "sha256-fV3w7Ax2gtzo+48oVkypDQB18Mnj7vMxICU0Hk95uwQ="
  },
  {
    "url": "./assets/js/scene.js?v=3.14.0",
    "integrity": "sha256-b4IwnqHmToBmTMRWNHJejAQkmDcXyMZ+7e4CLXBC6gA="
  },
  {
    "url": "./assets/js/schedules.js?v=3.14.0",
    "integrity": "sha256-H/yt4iLNLqoPJELoramNqaV7nH+WMXu560eLsQeaxJc="
  },
  {
    "url": "./assets/js/share-card.js?v=3.14.0",
    "integrity": "sha256-DdtcnH3IWJH5m6wOeKJGxEyYk+HQ3u9pJYhqya29LWY="
  },
  {
    "url": "./assets/js/share-link.js?v=3.14.0",
    "integrity": "sha256-2TanCsnoLWuqepFmQZ5Bpiv0Cae5pn2NdUzCQXORRwc="
  },
  {
    "url": "./assets/js/share.js?v=3.14.0",
    "integrity": "sha256-mEW6cl3vGeFguoAJVTKRY/I6GIFDh96SLUZqtDv78J4="
  },
  {
    "url": "./assets/js/solar.js?v=3.14.0",
    "integrity": "sha256-VGRSsAaknWPX8TWTiaqN4AxevZMN6XyTxfvvPZbWY4s="
  },
  {
    "url": "./assets/js/station-library.js?v=3.14.0",
    "integrity": "sha256-7C7gpaiW6XoNcnoV7GikZXlzXrCHZt8rADzpZtmWVJk="
  },
  {
    "url": "./assets/js/station-manager.js?v=3.14.0",
    "integrity": "sha256-IMrs64NTZXoc9eBURYdQfZtdjnQ/FfVuGi8dvpCMhMc="
  },
  {
    "url": "./assets/js/time-core.js?v=3.14.0",
    "integrity": "sha256-yWnAPi+1CXiopVFiAo2BqPpB6zbX4qCpf1gm8FFXMXA="
  },
  {
    "url": "./assets/js/tooltips.js?v=3.14.0",
    "integrity": "sha256-KdFAnk2eMbGjQvfcNXYsGxyvdT/Bzow8HQ2wigUw5xA="
  },
  {
    "url": "./assets/js/touch-feedback.js?v=3.14.0",
    "integrity": "sha256-KMdQlPn+ES9/Kfah/N/tU6hl1sqcTlQvEdMD8UZnDFM="
  },
  {
    "url": "./assets/js/typing.js?v=3.14.0",
    "integrity": "sha256-UCBA6cDGYJaCIJsv5Zji0ZneeareFqMUovNDYxRCM94="
  },
  {
    "url": "./assets/js/updates.js?v=3.14.0",
    "integrity": "sha256-qYNuc1hxh8qktZm+4L9buWM6Uz7myYG5PJZYLLnBHuc="
  },
  {
    "url": "./assets/js/weather-scene.js?v=3.14.0",
    "integrity": "sha256-1d94NsdzeehITi9XR9HJ3UKJ+SIsGxvJtRbMZ8Dd8vA="
  },
  {
    "url": "./data/collection-catalog.js?v=3.14.0",
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
    "url": "./data/phrases.js?v=3.14.0",
    "integrity": "sha256-S1hjBGN9N/XT3kSrXVE5xXanUIJ2HqtUKVQnFqTmlEw="
  },
  {
    "url": "./data/stations.js?v=3.14.0",
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
    "integrity": "sha256-xYdmIrP4GqQ4SZnXPqllAEQ2I9haVhMVbOkrs6xg0a8="
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
    "integrity": "sha256-65yfDbxdAajd2CF4z5RfZ7Im5nixXBQZdal+qYT+qUo="
  },
  {
    "url": "./docs/release/v3.12.8.md",
    "integrity": "sha256-+rYd8L5SHcB0WTv+ZWAtFcbqrnxCGuTcqZBy3KJUaQ8="
  },
  {
    "url": "./docs/release/v3.12.9.md",
    "integrity": "sha256-BLQPqkVPtLbg8kqbAwQyzIND+GYceMa3KjK4fNDknyI="
  },
  {
    "url": "./docs/release/v3.13.0.md",
    "integrity": "sha256-dIjtZnykT5gtF47jmz4EsY9a2vTINOtT5huKHpgkyOw="
  },
  {
    "url": "./docs/release/v3.13.1.md",
    "integrity": "sha256-7wavfCtnEi8wfYjnlRXeZxxk4UuJXHdqZA35wbH6mEE="
  },
  {
    "url": "./docs/release/v3.13.10.md",
    "integrity": "sha256-eFv3vHsQHfYTSW8swsyQmLn1Jzkuo71PmHUTYQZw72k="
  },
  {
    "url": "./docs/release/v3.13.11.md",
    "integrity": "sha256-jDLpgWVTTDM19wYyBNlwp2YHUZHHHzvNTqAmtzikB34="
  },
  {
    "url": "./docs/release/v3.13.2.md",
    "integrity": "sha256-pTUVvwsfWGNKwByzxAnMvkrAuh6q4zJf8EM+qSYTkIA="
  },
  {
    "url": "./docs/release/v3.13.3.md",
    "integrity": "sha256-Zn0DThr0DI+NLA5FnJ2FVF0z1j8q7kguhngUrfdalec="
  },
  {
    "url": "./docs/release/v3.13.4.md",
    "integrity": "sha256-U35cpsg42vrXGtdExUp+B3cSZnvUpCIfRC7H2wF0CSw="
  },
  {
    "url": "./docs/release/v3.13.5.md",
    "integrity": "sha256-moW7Htum0y4lcq+OkVEs6OHgBu24zZpGN5uqE0aUEhc="
  },
  {
    "url": "./docs/release/v3.13.6.md",
    "integrity": "sha256-MVWrEhrBSlxhrFxdvQ++d2h/3q0YQrqRe09Dyp+6mEg="
  },
  {
    "url": "./docs/release/v3.13.7.md",
    "integrity": "sha256-GXjfHrcpPbGFlSUsOJ8NCvhlmNXkjwHNPc+vTmPgnM8="
  },
  {
    "url": "./docs/release/v3.13.8.md",
    "integrity": "sha256-TDxB0yow4stMT3+fRLPP7YQw6ZP5LQB2IPjBSNH+lQA="
  },
  {
    "url": "./docs/release/v3.13.9.md",
    "integrity": "sha256-4Re8j/Dki3bM/JW9D4LGzkmq2zXL5tx4GcnsW2IJhGY="
  },
  {
    "url": "./docs/release/v3.14.0.md",
    "integrity": "sha256-lM827Isz5M2rYE46a0PbbTH7StoBiwOQvApomIBpUac="
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
    "integrity": "sha256-TPO2cXnyUxZVaJDbfNPHrNNcS5tdTQuWDRqmFafkx5o="
  },
  {
    "url": "./leggi.html",
    "integrity": "sha256-O+pxas5LAqRQ/ujp5tr9zx31oyz5qbp9hBbORicjuZ4="
  },
  {
    "url": "./manifest.webmanifest",
    "integrity": "sha256-SFmOPeQmF8N9xfhBpEeTjnvWjbLaR/oUWmY4xvL16eA="
  },
  {
    "url": "./version.json",
    "integrity": "sha256-irsmKY77FJbQkO1e9uFJbeaupCj7OphEUhiqWzVGr7s="
  }
];
const ABS=FILES.map(f=>({...f,url:new URL(f.url,self.registration.scope).href}));
const URLS=new Set(ABS.map(f=>f.url));

self.addEventListener('install',event=>event.waitUntil((async()=>{
  try{
    const cache=await caches.open(CACHE);
    await cache.addAll(ABS.map(f=>new Request(f.url,{cache:'reload',integrity:f.integrity})));
  }catch(error){
    await caches.delete(CACHE);
    throw error;
  }
})()));

self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const previous=(await caches.keys()).filter(k=>k.startsWith(PREFIX)&&k!==CACHE);
  await Promise.all(previous.map(k=>caches.delete(k)));
  await self.clients.claim();
})()));

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')event.waitUntil(self.skipWaiting());
  if(event.data?.type==='GET_VERSION')event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    const complete=(await Promise.all(ABS.map(f=>cache.match(f.url)))).every(Boolean);
    event.ports[0]?.postMessage({version:VERSION,complete,files:ABS.length});
  })());
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return; // POST api/calendar.php is always network-only.
  const url=new URL(request.url),root=new URL(self.registration.scope);
  if(url.origin!==root.origin)return;
  if(url.pathname.startsWith(new URL('api/',root).pathname))return;

  const entry=request.mode==='navigate'&&(url.pathname===root.pathname||url.pathname===root.pathname+'index.html');
  const reader=request.mode==='navigate'&&url.pathname===root.pathname+'leggi.html';
  if(!entry&&!reader&&!URLS.has(url.href))return;

  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const key=entry?new URL('index.html',root).href:reader?new URL('leggi.html',root).href:request.url;
    const hit=await cache.match(key);
    if(hit)return hit;
    const spec=ABS.find(f=>f.url===key);
    try{
      const options={cache:'reload'};
      if(spec?.integrity)options.integrity=spec.integrity;
      const response=await fetch(new Request(key,options));
      if(response.ok)await cache.put(key,response.clone());
      return response;
    }catch(_){
      return new Response('Risorsa non disponibile offline. Riapri Istante con una connessione.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
    }
  })());
});
