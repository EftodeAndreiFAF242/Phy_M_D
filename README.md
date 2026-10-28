# Kosmos: an atlas of worldviews

A UI prototype for the philosophy course. It explores how **Socrates, Plato, Aristotle and Christianity** answer the six big questions of any worldview, then lets you map your own.

No backend, no accounts, no build step. Your quiz result, constellation, credo and journal are saved only in your browser (localStorage).

## How to open it

Double-click `index.html`. It opens in any modern browser (Edge, Chrome, Firefox).
An internet connection is only needed for the fonts. Without it, the app still works with fallback fonts.

## Screens

| Screen | What it does |
|---|---|
| **Home** | An animated orrery of the four traditions, the six worldview questions, a quote carousel and a "question of the day" you can answer |
| **Atlas** | Four "plates", one per tradition, with lineage (Socrates → Plato → Aristotle → Christianity) |
| **Tradition pages** | Story, key quote, sources, answers to the six questions, six key concepts with their Greek terms |
| **Compare** | Pick a question: see where each tradition stands on a spectrum, plus a full comparison matrix |
| **Timeline** | A diagram of how ideas passed from thinker to thinker, and 18 key events from 470 BC to AD 1274 |
| **The Cave** | An illustrated, step-by-step walk through Plato's allegory, linked to the four levels of the Divided Line |
| **Agora** | A scripted Socratic dialogue: answer Socrates and watch the method (ask, test, contradict, aporia) |
| **Worldview quiz** | 10 questions with a result: The Questioner, The Idealist, The Naturalist or The Pilgrim |
| **My constellation** | Six sliders draw your worldview as a star chart; compare it with any tradition, write a credo, read your journal |

The sidebar button **"Leave the cave"** switches between the night theme and the daylight theme.

## Files

```
Phy_M_D/
├── index.html      app shell (sidebar, top bar on phones)
├── css/styles.css  all styles and both color themes
├── js/data.js      all the content: traditions, questions, quiz, timeline, dialogue
└── js/app.js       navigation and the interactive screens
```

To change any text, edit `js/data.js`. You do not need to touch the code.
To reset the app, clear this site's data in the browser.
