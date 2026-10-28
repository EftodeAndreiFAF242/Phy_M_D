/* Kosmos: all the content of the app lives here.
   Profile values (0-100) place each tradition on the six worldview axes:
   0 = "this world" pole, 100 = "beyond this world" pole. */

window.KOSMOS = {

  questions: [
    { id: 'reality',   title: 'Reality',    ask: 'What is truly real?',            field: 'Metaphysics',  greek: 'οὐσία',      translit: 'ousia, being',
      left: 'Only the natural world',        right: 'A higher, unseen reality' },
    { id: 'knowledge', title: 'Knowledge',  ask: 'How can we know anything?',      field: 'Epistemology', greek: 'ἐπιστήμη',   translit: 'epistēmē, knowledge',
      left: 'Senses & experience',           right: 'Reason & revelation' },
    { id: 'human',     title: 'Human',      ask: 'What is a human being?',         field: 'Anthropology', greek: 'ἄνθρωπος',   translit: 'anthrōpos, human',
      left: 'A living, thinking body',       right: 'An immortal soul' },
    { id: 'good',      title: 'The Good',   ask: 'How should we live?',            field: 'Ethics',       greek: 'τὸ ἀγαθόν',  translit: 'to agathon, the good',
      left: 'Built by our own virtue',       right: 'A gift of love & grace' },
    { id: 'divine',    title: 'The Divine', ask: 'Is there a God?',                field: 'Theology',     greek: 'τὸ θεῖον',   translit: 'to theion, the divine',
      left: 'No god, or a distant principle', right: 'A personal, loving God' },
    { id: 'destiny',   title: 'Destiny',    ask: 'What are we here for?',          field: 'Teleology',    greek: 'τέλος',      translit: 'telos, purpose',
      left: 'Fulfilment in this life',       right: 'Eternal life beyond death' }
  ],

  traditions: [
    {
      id: 'socrates', facts: [{ k: 'Method', v: 'Questioning, face to face' }, { k: 'Known for', v: 'His trial and death' }, { k: 'Taught in', v: 'The streets and the agora' }],
      name: 'Socrates', letter: 'Σ', plate: 'I',
      archetype: 'The Questioner', dates: 'c. 470 – 399 BC', place: 'Athens', era: 'Classical Athens',
      tagline: 'Philosophy as a way of life: know yourself and question everything.',
      summary: 'The son of a stonemason and a midwife, Socrates wandered the Athenian agora asking simple questions. What is justice? What is courage? He kept asking until everyone realised they did not know. He wrote nothing, yet he changed philosophy forever by turning it from the stars to the human soul. Condemned for impiety and for "corrupting the youth", he chose to die rather than stop doing philosophy.',
      quote: { text: 'The unexamined life is not worth living.', source: 'Plato, Apology 38a' },
      profile: { reality: 55, knowledge: 60, human: 80, good: 30, divine: 55, destiny: 60 },
      answers: {
        reality:   { short: 'Look inward, not upward.', text: 'Socrates turned philosophy away from speculation about the heavens and toward the human being. The reality that matters most is the soul and the way we live.', term: 'Care of the soul' },
        knowledge: { short: 'Wisdom begins with "I do not know."', text: 'Truth is not handed down. It is reached together, through questions and answers. Seeing your own ignorance is the first step toward knowledge.', term: 'Elenchus' },
        human:     { short: 'You are your soul.', text: 'The true self is the soul (psychē), the seat of reason and character. It deserves more care than the body, money or reputation.', term: 'Psychē' },
        good:      { short: 'Virtue is knowledge.', text: 'No one does wrong willingly: we do wrong because we do not know the good. It is better to suffer injustice than to commit it.', term: 'Aretē' },
        divine:    { short: 'An inner divine sign.', text: 'He honoured the gods, took the oracle of Delphi as his mission, and listened to an inner voice, his daimonion, that held him back from wrong actions.', term: 'Daimonion' },
        destiny:   { short: 'Death is not to be feared.', text: 'At his trial he argued that death is either a dreamless sleep or a journey to meet the great souls of the past. Either way, a good person has nothing to fear.', term: 'Apology 40c' }
      },
      concepts: [
        { term: 'Elenchus', orig: 'ἔλεγχος', def: 'Cross-examination: testing a definition with questions until its contradictions come to light.' },
        { term: 'Maieutics', orig: 'μαιευτική', def: 'The art of the midwife: helping others give birth to ideas they already carry inside.' },
        { term: 'Socratic irony', orig: 'εἰρωνεία', def: 'Claiming not to know, so that the other person says what they really think.' },
        { term: 'Aporia', orig: 'ἀπορία', def: 'The puzzled state when every definition fails. For Socrates, the moment real thinking begins.' },
        { term: 'Daimonion', orig: 'δαιμόνιον', def: 'The inner divine sign that warned Socrates whenever he was about to do something wrong.' },
        { term: 'Know thyself', orig: 'γνῶθι σεαυτόν', def: 'The command carved at Delphi, which Socrates made the mission of his life.' }
      ],
      worksNote: 'Socrates wrote nothing. We know him through the people who knew him:',
      works: [
        { title: 'Apology', by: 'Plato' }, { title: 'Crito', by: 'Plato' }, { title: 'Phaedo', by: 'Plato' },
        { title: 'Memorabilia', by: 'Xenophon' }, { title: 'The Clouds', by: 'Aristophanes' }
      ],
      lineage: 'Teacher of Plato',
      result: {
        text: 'You trust conversation more than certainty. You would rather ask the right question than win an argument, and you believe that how we live matters most. Like Socrates, you know that saying "I don\'t know" is the first step to wisdom.',
        strengths: ['Intellectual honesty', 'Courage to challenge', 'Self-knowledge'],
        watch: 'Endless questioning can become an excuse never to commit to an answer.'
      }
    },
    {
      id: 'plato', facts: [{ k: 'Method', v: 'Written dialogues' }, { k: 'Known for', v: 'The Forms and the Cave' }, { k: 'Taught in', v: 'The Academy, c. 387 BC' }],
      name: 'Plato', letter: 'Π', plate: 'II',
      archetype: 'The Idealist', dates: 'c. 428 – 348 BC', place: 'Athens', era: 'Classical Athens',
      tagline: 'Behind the shadows of this world shine eternal, perfect Forms.',
      summary: 'Socrates\' most brilliant student, an Athenian aristocrat who turned his teacher\'s conversations into dialogues of rare beauty. Shaken by Socrates\' execution, he searched for a truth no court could kill: the eternal Forms, of which our changing world is only a copy. He founded the Academy, the first school of its kind in the West, and it lasted for centuries.',
      quote: { text: 'Wonder is the feeling of a philosopher, and philosophy begins in wonder.', source: 'Plato, Theaetetus 155d' },
      profile: { reality: 95, knowledge: 95, human: 95, good: 45, divine: 40, destiny: 90 },
      answers: {
        reality:   { short: 'Two worlds.', text: 'The changing world we see is a copy of eternal, perfect Forms: Beauty itself, Justice itself. The Forms are more real than the things that imitate them.', term: 'Theory of Forms' },
        knowledge: { short: 'To learn is to remember.', text: 'The senses give only opinion (doxa). True knowledge comes through reason, as the soul recollects the Forms it knew before birth.', term: 'Anamnēsis' },
        human:     { short: 'A soul driving a chariot.', text: 'The immortal soul has three parts, reason, spirit and appetite, like a charioteer guiding two horses. The body is only its temporary home.', term: 'Tripartite soul' },
        good:      { short: 'Justice is inner harmony.', text: 'A good life is one where reason rules, spirit supports it and desire obeys. From this come the four cardinal virtues: wisdom, courage, moderation and justice.', term: 'Cardinal virtues' },
        divine:    { short: 'The Good, like the sun.', text: 'Above all Forms shines the Form of the Good, which gives being and light to everything. In the Timaeus a divine craftsman, the Demiurge, shapes the cosmos.', term: 'Form of the Good' },
        destiny:   { short: 'The soul returns home.', text: 'The soul is immortal. Philosophy is a practice for dying: a slow freeing of the soul from the body, so it can return to the world of truth.', term: 'Phaedo' }
      },
      concepts: [
        { term: 'Forms (Ideas)', orig: 'εἶδος · ἰδέα', def: 'Eternal, perfect patterns. Visible things are only imperfect copies of them.' },
        { term: 'Recollection', orig: 'ἀνάμνησις', def: 'Learning as the soul remembering truths it already knew before birth.' },
        { term: 'The Cave', orig: 'Republic VII', def: 'An allegory of education: the journey from shadows of opinion to the light of truth.' },
        { term: 'Tripartite soul', orig: 'ψυχή', def: 'Reason, spirit and appetite. A person is in harmony when reason rules.' },
        { term: 'Philosopher-king', orig: 'φιλόσοφος βασιλεύς', def: 'The ideal ruler: someone who has seen the Good and governs for the good of all.' },
        { term: 'Eros', orig: 'ἔρως', def: 'Love as a ladder that climbs from one beautiful body to Beauty itself (Symposium).' }
      ],
      worksNote: 'All of Plato\'s known dialogues have survived. Start with:',
      works: [
        { title: 'Republic', by: 'Plato' }, { title: 'Symposium', by: 'Plato' }, { title: 'Phaedo', by: 'Plato' },
        { title: 'Meno', by: 'Plato' }, { title: 'Timaeus', by: 'Plato' }, { title: 'Phaedrus', by: 'Plato' }
      ],
      lineage: 'Student of Socrates · Teacher of Aristotle',
      result: {
        text: 'You sense that the visible world is not the whole story. Behind changing appearances you look for something perfect, eternal and true: beauty itself, justice itself. Like Plato, you believe reason can lift the soul toward the Good.',
        strengths: ['Vision', 'Love of beauty and truth', 'Big-picture thinking'],
        watch: 'The ideal can make you impatient with the imperfect, real world.'
      }
    },
    {
      id: 'aristotle', facts: [{ k: 'Method', v: 'Observation and logic' }, { k: 'Known for', v: 'The golden mean' }, { k: 'Taught in', v: 'The Lyceum, 335 BC' }],
      name: 'Aristotle', letter: 'Α', plate: 'III',
      archetype: 'The Naturalist', dates: '384 – 322 BC', place: 'Stagira · Athens', era: 'Classical Greece',
      tagline: 'One world, full of purpose, known through the senses and reason.',
      summary: 'The son of a court physician from Stagira, he studied at Plato\'s Academy for twenty years, then brought philosophy back down to earth. He described hundreds of animals, compared constitutions, invented formal logic and asked what every thing is for. Tutor of Alexander the Great and founder of the Lyceum, he became, for medieval thinkers, simply "the Philosopher".',
      quote: { text: 'All men by nature desire to know.', source: 'Aristotle, Metaphysics I.1' },
      profile: { reality: 30, knowledge: 15, human: 35, good: 10, divine: 20, destiny: 20 },
      answers: {
        reality:   { short: 'One world: form in matter.', text: 'There is no separate world of Forms. Each thing is a substance, matter shaped by form. Change is potential becoming actual, as an acorn becomes an oak.', term: 'Hylomorphism' },
        knowledge: { short: 'Start with the senses.', text: 'All knowledge begins with experience. The mind draws universal truths out of particular things, and logic, through the syllogism, keeps reasoning sound.', term: 'Syllogism' },
        human:     { short: 'A rational, political animal.', text: 'The soul is the form of the living body, not its prisoner. What makes us human is reason, and we can only fulfil it in a community, the polis.', term: 'Zōon politikon' },
        good:      { short: 'Flourishing through balance.', text: 'The highest good is eudaimonia, a flourishing life. We reach it through virtues built by habit, each one a golden mean between two extremes.', term: 'Golden mean' },
        divine:    { short: 'The Unmoved Mover.', text: 'At the summit of reality is a first cause: pure actuality, thought thinking itself. It moves the heavens not by pushing them, but as the object of their desire.', term: 'Prime Mover' },
        destiny:   { short: 'Everything has a purpose.', text: 'Every being has a telos, an end it naturally strives toward. Human fulfilment lies in living by reason, above all in contemplation and friendship.', term: 'Telos' }
      },
      concepts: [
        { term: 'Hylomorphism', orig: 'ὕλη + μορφή', def: 'Every substance is a union of matter (what it is made of) and form (what it is).' },
        { term: 'Four causes', orig: 'αἰτίαι', def: 'Material, formal, efficient and final: the four ways of answering the question "why?"' },
        { term: 'Potency & act', orig: 'δύναμις · ἐνέργεια', def: 'Change is what something can be becoming what it actually is.' },
        { term: 'Golden mean', orig: 'μεσότης', def: 'Virtue lies between two extremes. Courage sits between cowardice and recklessness.' },
        { term: 'Eudaimonia', orig: 'εὐδαιμονία', def: 'Flourishing: a complete, active life lived according to virtue.' },
        { term: 'Unmoved Mover', orig: 'τὸ κινοῦν ἀκίνητον', def: 'The eternal first cause, pure actuality, that moves all things by being their goal.' }
      ],
      worksNote: 'What survives are mostly his lecture notes. Start with:',
      works: [
        { title: 'Nicomachean Ethics', by: 'Aristotle' }, { title: 'Politics', by: 'Aristotle' }, { title: 'Metaphysics', by: 'Aristotle' },
        { title: 'Physics', by: 'Aristotle' }, { title: 'On the Soul', by: 'Aristotle' }, { title: 'Poetics', by: 'Aristotle' }
      ],
      lineage: 'Student of Plato · Tutor of Alexander the Great',
      result: {
        text: 'You are grounded. You trust experience, love to observe and sort things out, and believe a good life is built day by day through habits, balance and friendship. Like Aristotle, you think everything has a purpose, including you.',
        strengths: ['Practical wisdom', 'Balance', 'Curiosity about the world'],
        watch: 'Careful analysis can leave little room for mystery.'
      }
    },
    {
      id: 'christianity', facts: [{ k: 'Method', v: 'Faith and reason together' }, { k: 'Known for', v: 'Love, grace and hope' }, { k: 'Key voices', v: 'Paul, Augustine, Aquinas' }],
      name: 'Christianity', letter: 'Χ', plate: 'IV',
      archetype: 'The Pilgrim', dates: '1st century AD – today', place: 'Judea · the Roman world', era: 'From Antiquity to today',
      tagline: 'A world created out of love, and a history that leads somewhere.',
      summary: 'Christianity grew from the life and teaching of Jesus of Nazareth, whom his followers proclaimed risen from the dead. It entered the Greek world speaking its language (logos, soul, virtue) and transformed it. God is not a distant principle but a Person who creates out of love, becomes human and invites everyone into a relationship with him. Thinkers like Augustine and Thomas Aquinas wove Plato and Aristotle into a new, unified vision of reality.',
      quote: { text: 'You have made us for yourself, and our heart is restless until it rests in you.', source: 'Augustine, Confessions I.1' },
      profile: { reality: 90, knowledge: 80, human: 75, good: 95, divine: 100, destiny: 100 },
      answers: {
        reality:   { short: 'A world created from love.', text: 'God created the world from nothing (ex nihilo). Creation is good, ordered and meaningful, because it was made through the divine Word, the Logos.', term: 'Creatio ex nihilo' },
        knowledge: { short: 'Faith seeking understanding.', text: 'Reason can reach far, but God also reveals himself in Scripture and in Christ. Faith and reason work together on the way to truth.', term: 'Revelation' },
        human:     { short: 'Made in the image of God.', text: 'Every person, body and soul, is created in the image of God (imago Dei) with infinite dignity, wounded by sin and called to new life through grace.', term: 'Imago Dei' },
        good:      { short: 'Love above all.', text: 'The greatest commandment is to love God and to love your neighbour as yourself. Faith, hope and love crown the classical virtues.', term: 'Agapē' },
        divine:    { short: 'God is love.', text: 'One God in three Persons: Father, Son and Holy Spirit. Not a distant principle, but a personal God who became human in Jesus Christ.', term: 'Trinity' },
        destiny:   { short: 'History has a direction.', text: 'Time moves from creation, through the fall, to redemption. Death is not the end: Christians hope for the resurrection and eternal life with God.', term: 'Resurrection' }
      },
      concepts: [
        { term: 'Logos', orig: 'λόγος', def: 'The divine Word through whom all things were made, who "became flesh" in Christ (John 1).' },
        { term: 'Imago Dei', orig: 'Genesis 1:27', def: 'Humans are created in the image of God. This is the root of every person\'s dignity.' },
        { term: 'Grace', orig: 'χάρις', def: 'God\'s free, undeserved gift that heals human nature and raises it up.' },
        { term: 'Agapē', orig: 'ἀγάπη', def: 'Self-giving love: the love God has for the world, which he calls us to share.' },
        { term: 'Trinity', orig: 'Τριάς', def: 'One God in three Persons: Father, Son and Holy Spirit.' },
        { term: 'Faith & reason', orig: 'fides et ratio', def: '"Believe so that you may understand" (Augustine). Faith and reason are allies, not enemies.' }
      ],
      worksNote: 'A tradition of many voices. Its key texts include:',
      works: [
        { title: 'The Gospels', by: 'New Testament' }, { title: 'Letters of Paul', by: 'New Testament' }, { title: 'Confessions', by: 'Augustine' },
        { title: 'City of God', by: 'Augustine' }, { title: 'Summa Theologiae', by: 'Thomas Aquinas' }, { title: 'The Nicene Creed', by: 'Councils of 325 & 381' }
      ],
      lineage: 'Inherits Plato through Augustine and Aristotle through Aquinas',
      result: {
        text: 'You see life as a journey with a direction and a destination. For you the world is a gift, every person has infinite dignity, and love is stronger than death. Like Augustine, you know the restless heart that searches for a rest only God can give.',
        strengths: ['Hope', 'Compassion', 'A sense of meaning'],
        watch: 'Faith needs reason too: "faith seeking understanding".'
      }
    }
  ],

  quotes: [
    { text: 'The unexamined life is not worth living.', source: 'Plato, Apology 38a', by: 'socrates' },
    { text: 'I neither know nor think that I know.', source: 'Plato, Apology 21d', by: 'socrates' },
    { text: 'No evil can happen to a good man, either in life or after death.', source: 'Plato, Apology 41d', by: 'socrates' },
    { text: 'Wonder is the feeling of a philosopher, and philosophy begins in wonder.', source: 'Plato, Theaetetus 155d', by: 'plato' },
    { text: 'Are you not aware that the soul of man is immortal and imperishable?', source: 'Plato, Republic X, 608d', by: 'plato' },
    { text: 'Until philosophers are kings, cities will never have rest from their evils.', source: 'Plato, Republic V, 473d', by: 'plato' },
    { text: 'All men by nature desire to know.', source: 'Aristotle, Metaphysics I.1', by: 'aristotle' },
    { text: 'Man is by nature a political animal.', source: 'Aristotle, Politics I.2', by: 'aristotle' },
    { text: 'One swallow does not make a summer, nor does one day.', source: 'Aristotle, Nicomachean Ethics I.7', by: 'aristotle' },
    { text: 'In the beginning was the Word, and the Word was with God, and the Word was God.', source: 'Gospel of John 1:1', by: 'christianity' },
    { text: 'You have made us for yourself, and our heart is restless until it rests in you.', source: 'Augustine, Confessions I.1', by: 'christianity' },
    { text: 'So faith, hope, love abide, these three; but the greatest of these is love.', source: '1 Corinthians 13:13', by: 'christianity' }
  ],

  dailyQuestions: [
    { q: 'What is one thing you believe that you have never really questioned?', by: 'socrates' },
    { q: 'Is something beautiful because you like it, or do you like it because it is beautiful?', by: 'plato' },
    { q: 'Which small habit is quietly shaping the person you are becoming?', by: 'aristotle' },
    { q: 'What would it mean to love someone who can never repay you?', by: 'christianity' },
    { q: 'If you could know one truth with complete certainty, which would you choose?', by: 'socrates' },
    { q: 'Which "shadows" in your life might you be mistaking for reality?', by: 'plato' },
    { q: 'What is your life for? Try to answer in a single sentence.', by: 'aristotle' },
    { q: 'Where do you look for hope when things go wrong?', by: 'christianity' }
  ],

  quiz: [
    { q: 'A friend says something you are sure is wrong. You…', options: [
      { t: 'Ask them questions until you both see where the idea leads.', k: 'socrates' },
      { t: 'Look for evidence: what do the facts actually show?', k: 'aristotle' },
      { t: 'Point to the deeper principle that never changes.', k: 'plato' },
      { t: 'Listen patiently and stay kind, even while you disagree.', k: 'christianity' } ] },
    { q: 'The world around you is…', options: [
      { t: 'A gift, made with love and for a purpose.', k: 'christianity' },
      { t: 'A shadow of a more perfect reality.', k: 'plato' },
      { t: 'Less important than how I choose to live in it.', k: 'socrates' },
      { t: 'Real and fascinating, worth studying in every detail.', k: 'aristotle' } ] },
    { q: 'Where does true knowledge come from?', options: [
      { t: 'From experience and careful observation.', k: 'aristotle' },
      { t: 'From realising how little I actually know.', k: 'socrates' },
      { t: 'From revelation, understood with the help of reason.', k: 'christianity' },
      { t: 'From within: the mind can grasp eternal truths.', k: 'plato' } ] },
    { q: 'At the core, a human being is…', options: [
      { t: 'An immortal soul living for a while in a body.', k: 'plato' },
      { t: 'A person made in the image of God.', k: 'christianity' },
      { t: 'A rational animal who needs a community.', k: 'aristotle' },
      { t: 'A soul that must be examined and cared for.', k: 'socrates' } ] },
    { q: 'A good life means…', options: [
      { t: 'Always examining myself and my choices.', k: 'socrates' },
      { t: 'Good habits, balance and true friends.', k: 'aristotle' },
      { t: 'Loving God and others, even when it costs me.', k: 'christianity' },
      { t: 'Letting reason guide my desires toward the Good.', k: 'plato' } ] },
    { q: 'If you could reshape society, you would…', options: [
      { t: 'Let the wisest people govern.', k: 'plato' },
      { t: 'Teach everyone to question authority and assumptions.', k: 'socrates' },
      { t: 'Build a community of forgiveness that cares for the weakest.', k: 'christianity' },
      { t: 'Write a balanced constitution with a strong middle class.', k: 'aristotle' } ] },
    { q: 'When you think about death…', options: [
      { t: 'It is natural. What matters is to have lived out your purpose.', k: 'aristotle' },
      { t: 'It is not the end. Love is stronger than death.', k: 'christianity' },
      { t: 'No one knows what it is, so why fear it?', k: 'socrates' },
      { t: 'The soul finally returns to the eternal.', k: 'plato' } ] },
    { q: 'Where would you rather spend a quiet afternoon?', options: [
      { t: 'In a busy square, talking with strangers.', k: 'socrates' },
      { t: 'In an old church, in candlelight and silence.', k: 'christianity' },
      { t: 'In a garden with a notebook, watching how things grow.', k: 'aristotle' },
      { t: 'Alone with a geometry problem or a beautiful piece of music.', k: 'plato' } ] },
    { q: 'Your kind of hero is someone who…', options: [
      { t: 'Escapes illusion and comes back to free others.', k: 'plato' },
      { t: 'Masters the art of balance in everything.', k: 'aristotle' },
      { t: 'Would rather die for the truth than betray it.', k: 'socrates' },
      { t: 'Forgives even the people who hurt them.', k: 'christianity' } ] },
    { q: 'Pick the word that draws you most.', options: [
      { t: 'Grace', k: 'christianity' },
      { t: 'Nature', k: 'aristotle' },
      { t: 'Question', k: 'socrates' },
      { t: 'Idea', k: 'plato' } ] }
  ],

  cave: [
    { title: 'Chained to the shadows', level: 'Eikasia', greek: 'εἰκασία', levelName: 'Imagining', light: 12,
      text: 'Prisoners have been chained here since childhood. They can only look at the wall in front of them, where shadows flicker. They have never seen anything else, so they believe the shadows are all of reality.',
      meaning: 'Most people live by appearances and second-hand opinion (doxa), and take them for the truth.' },
    { title: 'Turning toward the fire', level: 'Pistis', greek: 'πίστις', levelName: 'Believing', light: 34,
      text: 'One prisoner is set free and turns around. He sees the fire and the objects carried along the low wall, the real causes of the shadows. The glare hurts his eyes, and he is tempted to go back to the comfortable shadows.',
      meaning: 'Discovering what lies behind appearances is painful. We cling to what is familiar.' },
    { title: 'The steep ascent', level: 'Dianoia', greek: 'διάνοια', levelName: 'Reasoning', light: 60,
      text: 'He is dragged up the rough, steep path toward the mouth of the cave. Education, says Plato, is not putting sight into blind eyes. It is turning the whole soul toward the light.',
      meaning: 'Real learning is a conversion of the soul (periagōgē): slow, demanding, and impossible to fake.' },
    { title: 'The sun', level: 'Noēsis', greek: 'νόησις', levelName: 'Understanding', light: 100,
      text: 'Outside, dazzled, he first looks at shadows and reflections in the water, then at the things themselves, then at the night sky. At last he can look at the sun, the source of all light and life.',
      meaning: 'The sun stands for the Form of the Good, which makes all truth visible and lets all things exist.' },
    { title: 'The return', level: 'The duty', greek: 'κατάβασις', levelName: 'Going back down', light: 42,
      text: 'Out of compassion he goes back down to free the others. His eyes, used to daylight, stumble in the dark. The prisoners laugh at him, and they would kill anyone who tried to drag them into the light.',
      meaning: 'The philosopher must return and serve. Plato is thinking of Socrates, executed by Athens in 399 BC.' }
  ],

  caveReadings: [
    { by: 'socrates', text: 'The freed prisoner who returns, is mocked and is put to death is Plato\'s portrait of his own teacher.' },
    { by: 'plato', text: 'Education is the turning of the whole soul from the shadows of opinion toward the light of the Good.' },
    { by: 'aristotle', text: 'Aristotle would tell the prisoner to study the objects more closely: the forms are in things themselves, not in another world.' },
    { by: 'christianity', text: 'Augustine saw God as the inner light of the mind, "the true light that enlightens every man" (John 1:9).' }
  ],

  timeline: [
    { year: -470, label: 'c. 470 BC', tags: ['socrates'], title: 'Socrates is born in Athens', text: 'The son of a stonemason and a midwife. He will later call his method a kind of midwifery of ideas.' },
    { year: -428, label: 'c. 428 BC', tags: ['plato'], title: 'Plato is born', text: 'Into an aristocratic Athenian family. As a young man he joins the circle around Socrates.' },
    { year: -399, label: '399 BC', tags: ['socrates'], title: 'The trial and death of Socrates', text: 'Convicted of impiety and of corrupting the youth, he drinks hemlock rather than give up philosophy.' },
    { year: -387, label: 'c. 387 BC', tags: ['plato'], title: 'Plato founds the Academy', text: 'A school in a grove outside Athens sacred to the hero Akademos. It gives us the word "academic".' },
    { year: -384, label: '384 BC', tags: ['aristotle'], title: 'Aristotle is born in Stagira', text: 'His father, Nicomachus, is physician to the king of Macedon.' },
    { year: -367, label: '367 BC', tags: ['aristotle', 'plato'], title: 'Aristotle joins the Academy', text: 'He arrives at seventeen and studies with Plato for about twenty years.' },
    { year: -348, label: 'c. 348 BC', tags: ['plato'], title: 'Death of Plato', text: 'He leaves behind some thirty-five dialogues, and all of them have survived.' },
    { year: -343, label: '343 BC', tags: ['aristotle'], title: 'Tutor to Alexander', text: 'Philip II of Macedon invites him to teach his son, the future Alexander the Great.' },
    { year: -335, label: '335 BC', tags: ['aristotle'], title: 'Aristotle opens the Lyceum', text: 'His followers become known as the Peripatetics, said to have debated while walking.' },
    { year: -322, label: '322 BC', tags: ['aristotle'], title: 'Death of Aristotle', text: 'He leaves works on logic, physics, biology, ethics, politics, rhetoric and poetry.' },
    { year: -4, label: 'c. 4 BC', tags: ['christianity'], title: 'Jesus of Nazareth is born', text: 'In Judea, then a province under Roman rule.' },
    { year: 30, label: 'c. AD 30', tags: ['christianity'], title: 'The crucifixion of Jesus', text: 'His followers proclaim that he has risen from the dead, and the Christian movement begins.' },
    { year: 50, label: 'c. AD 50', tags: ['christianity'], title: 'Paul speaks at the Areopagus', text: 'In Athens, Paul debates with philosophers and speaks to them of the "unknown god" (Acts 17).' },
    { year: 250, label: '3rd century AD', tags: ['plato'], title: 'Plotinus revives Plato', text: 'Neoplatonism: all reality flows from the One. This vision deeply shapes later Christian thinkers.' },
    { year: 325, label: 'AD 325', tags: ['christianity'], title: 'The Council of Nicaea', text: 'Bishops from across the empire define the faith that becomes the Nicene Creed.' },
    { year: 397, label: 'c. AD 397', tags: ['christianity', 'plato'], title: 'Augustine writes the Confessions', text: 'A Christian Platonist tells the story of a restless heart searching for God.' },
    { year: 524, label: 'c. AD 524', tags: ['christianity'], title: 'The Consolation of Philosophy', text: 'Written by Boethius in prison: Lady Philosophy comforts a condemned man.' },
    { year: 1265, label: 'AD 1265–1274', tags: ['christianity', 'aristotle'], title: 'Aquinas writes the Summa Theologiae', text: 'Thomas Aquinas unites Christian faith with Aristotle, whom he simply calls "the Philosopher".' }
  ],

  eras: [
    { from: -9999, to: -300, name: 'Classical Greece', span: '5th – 4th century BC' },
    { from: -299, to: 100, name: 'A new faith in the Roman world', span: '1st century' },
    { from: 101, to: 1000, name: 'Late Antiquity', span: '3rd – 6th century' },
    { from: 1001, to: 9999, name: 'The Middle Ages', span: '13th century' }
  ],

  /* Scripted Socratic dialogue for the Agora. step = which part of the method the node shows. */
  agora: {
    start: 'q1',
    nodes: {
      q1: { step: 0, say: ['Greetings, friend! Come, sit with me here in the shade of the stoa.', 'They tell me you are a thoughtful person. Then perhaps you can help me with something I have never understood. What makes a life good?'],
        options: [ { t: 'A good life is a life full of pleasure.', next: 'pleasure' }, { t: 'Success and money. Having everything you need.', next: 'wealth' }, { t: 'Being free to do whatever I want.', next: 'freedom' } ] },

      pleasure: { step: 1, say: ['Pleasure! A fine answer. Let us test it, the way gold is tested in fire.', 'Imagine a man with an itch who spends his whole life scratching it, with great pleasure. Does he live a good life?'],
        options: [ { t: 'No, that is a silly kind of pleasure.', next: 'pleasure2' }, { t: 'If he is happy, why not?', next: 'pleasure1b' } ] },
      pleasure1b: { step: 1, say: ['Then would you wish that life for someone you love? Scratching, forever, and nothing else?'],
        options: [ { t: '…No, I would not.', next: 'pleasure2' } ] },
      pleasure2: { step: 2, say: ['So some pleasures are good, and others are poor or even harmful.', 'Then pleasure by itself cannot be the measure of a good life. We need something else: something that tells the good pleasures from the bad ones.'],
        options: [ { t: 'I suppose that is true.', next: 'knowledge' } ] },

      wealth: { step: 1, say: ['Money and success. Many people in Athens would agree with you!', 'But tell me: can a person use wealth badly, to harm others or to ruin himself?'],
        options: [ { t: 'Yes, of course.', next: 'wealth2' }, { t: 'Only bad people do that.', next: 'wealth1b' } ] },
      wealth1b: { step: 1, say: ['Then it is not the wealth that is good or bad, but the person who uses it?'],
        options: [ { t: 'Yes. It depends on the person.', next: 'wealth2' } ] },
      wealth2: { step: 2, say: ['So wealth helps only when it is used well. And to use something well you must know how, just as a flute is good only in the hands of someone who can play it.', 'So is it wealth that makes a life good? Or the wisdom to use it?'],
        options: [ { t: 'The wisdom, I think.', next: 'knowledge' } ] },

      freedom: { step: 1, say: ['Freedom! The pride of Athens.', 'Tell me: if a man who knows nothing about medicine treats his own illness however he likes, will he get better?'],
        options: [ { t: 'Probably not.', next: 'freedom2' }, { t: 'At least it is his own choice.', next: 'freedom1b' } ] },
      freedom1b: { step: 1, say: ['It is his choice, yes. But does he get what he truly wants? Does a sick man want his own way, or does he want to be healthy?'],
        options: [ { t: 'He wants to be healthy.', next: 'freedom2' } ] },
      freedom2: { step: 2, say: ['Then doing what we please is good only when what we please is truly good for us.', 'And to want what is truly good, we must first know what it is.'],
        options: [ { t: 'That seems right.', next: 'knowledge' } ] },

      knowledge: { step: 2, say: ['Look where our road has led us! Wherever we started, we keep arriving at the same place: we need to know what is truly good.', 'So tell me, friend, since you have come this far. What is the good?'],
        options: [ { t: 'I thought I knew… but now I am not sure.', next: 'aporia' }, { t: 'The good is simply whatever makes people happy.', next: 'happy' } ] },
      happy: { step: 2, say: ['And what makes people happy? Pleasure, money, freedom? We have just seen that each of these can go wrong.'],
        options: [ { t: '…Then I really do not know.', next: 'aporia' } ] },

      aporia: { step: 3, end: true, say: ['Wonderful! Do not look so sad. Now you and I stand in the same place.', 'Most people think they know what they do not know. You now know that you do not know, so you are already a little wiser than they are.', 'This puzzlement is called aporia. It is not the end of thinking. It is where thinking begins. Shall we search again tomorrow? After all, the unexamined life is not worth living.'] }
    },
    method: [
      { name: 'Ask', text: 'Socrates asks for a definition: "What is a good life?"' },
      { name: 'Test', text: 'He tests your answer against examples and everyday cases.' },
      { name: 'Contradict', text: 'The definition breaks down. Something essential is missing.' },
      { name: 'Aporia', text: 'You admit you do not know, and the real search can begin.' }
    ]
  }
};
