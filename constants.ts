import { Language } from './types';

export const STORAGE_KEY = "pixeltype_leaderboard";
export const PERSONAL_BEST_KEY = "pixeltype_pb";

interface LanguageContent {
  words: string[];
  sentenceParts: {
    subjects: string[];
    verbs: string[];
    objects: string[];
    adjectives: string[];
    adverbs: string[];
  };
}

export const LANGUAGE_DATA: Record<Language, LanguageContent> = {
  de: {
    words: [
      "ich", "sie", "das", "ist", "du", "nicht", "die", "und", "es", "der", "wir", "was", "zu", "er", "ein", "in", "ja", "mir", 
      "mit", "wie", "den", "mich", "dass", "aber", "hier", "eine", "wenn", "hat", "noch", "mal", "für", "sind", "nur", "aus", 
      "habe", "auch", "kann", "sein", "jetzt", "dann", "da", "immer", "schon", "hallo", "wird", "meine", "gut", "nein", "nach", 
      "dich", "war", "uns", "gehen", "sehr", "man", "wer", "etwas", "doch", "haben", "danke", "wo", "alle", "will", "alles", 
      "nichts", "bei", "muss", "einen", "bitte", "wieder", "machen", "tun", "weiß", "vor", "können", "vielleicht", "warum", 
      "sagen", "sehen", "heute", "sicher", "viel", "einfach", "euch", "ihr", "komm", "zeit", "keine", "frau", "leben", "ganz", 
      "genau", "wäre", "soll", "damit", "würde", "leid", "leute", "heute", "morgen", "glaube", "mann", "wissen", "wirklich", 
      "liebe", "vater", "mutter", "bruder", "schwester", "schule", "haus", "auto", "arbeit", "freund", "wasser", "buch", 
      "stadt", "land", "frage", "antwort", "glück", "problem", "idee", "grund", "geschichte", "seite", "auge", "hand", "kopf"
    ],
    sentenceParts: {
      subjects: ["Der Hund", "Die Katze", "Das Kind", "Mein Vater", "Deine Mutter", "Der Lehrer", "Die Frau", "Der Mann", "Ein Vogel", "Der Computer"],
      verbs: ["sucht", "findet", "sieht", "mag", "liebt", "kauft", "isst", "trinkt", "hört", "baut", "versteht", "öffnet"],
      objects: ["den Ball", "das Buch", "die Pizza", "einen Apfel", "die Musik", "das Auto", "die Tür", "einen Stift", "das Fenster", "den Weg"],
      adjectives: ["schnell", "laut", "leise", "langsam", "glücklich", "traurig", "müde", "wach", "groß", "klein"],
      adverbs: ["heute", "gestern", "jetzt", "bald", "oft", "nie", "immer", "manchmal"]
    }
  },
  en: {
    words: [
      "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
      "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there",
      "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no",
      "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then",
      "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well",
      "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
    ],
    sentenceParts: {
      subjects: ["The dog", "The cat", "A person", "My friend", "The teacher", "The doctor", "An artist", "The driver", "Someone", "Nobody"],
      verbs: ["likes", "wants", "sees", "hears", "finds", "takes", "gives", "makes", "knows", "writes", "reads", "opens"],
      objects: ["the book", "a car", "the food", "a letter", "the house", "a song", "the movie", "a picture", "the answer", "a question"],
      adjectives: ["happy", "sad", "fast", "slow", "good", "bad", "red", "blue", "loud", "quiet"],
      adverbs: ["quickly", "slowly", "today", "now", "well", "badly", "soon", "later"]
    }
  },
  es: {
    words: [
      "de", "la", "que", "el", "en", "y", "a", "los", "se", "del", "las", "un", "por", "con", "no", "una", "su", "para", "es", "al",
      "lo", "como", "más", "o", "pero", "sus", "le", "ha", "me", "si", "sin", "sobre", "este", "ya", "entre", "cuando", "todo", "esta",
      "ser", "son", "dos", "también", "fue", "había", "era", "muy", "años", "hasta", "desde", "está", "mi", "porque", "qué", "sólo",
      "han", "yo", "hay", "vez", "puede", "todos", "así", "nos", "ni", "parte", "tiene", "él", "uno", "donde", "bien", "tiempo", "mismo",
      "ese", "ahora", "cada", "e", "vida", "otro", "después", "te", "otros", "aunque", "esa", "eso", "hace", "otra", "gobierno", "tan"
    ],
    sentenceParts: {
      subjects: ["El gato", "El perro", "La niña", "El hombre", "La mujer", "El jefe", "Mi amigo", "Tu hermano", "El sol", "La luna"],
      verbs: ["come", "bebe", "mira", "escribe", "lee", "compra", "vende", "busca", "encuentra", "pierde"],
      objects: ["la manzana", "el libro", "la carta", "el coche", "la casa", "el agua", "la puerta", "el camino", "la verdad", "el tiempo"],
      adjectives: ["grande", "pequeño", "bueno", "malo", "rojo", "verde", "feliz", "triste", "rápido", "lento"],
      adverbs: ["hoy", "ayer", "nunca", "siempre", "mañana", "tarde", "pronto", "bien"]
    }
  },
  fr: {
    words: [
      "de", "la", "le", "et", "les", "des", "en", "un", "du", "une", "que", "est", "pour", "qui", "dans", "a", "par", "plus", "pas", "au",
      "sur", "ne", "se", "ce", "il", "sont", "son", "avec", "ou", "ses", "ont", "mais", "nous", "comme", "sa", "elle", "tout", "y", "on",
      "fait", "aussi", "leur", "aux", "si", "bien", "faire", "cette", "être", "je", "ils", "deux", "très", "dont", "votre", "temps",
      "sans", "même", "peut", "dire", "avoir", "an", "autre", "peu", "encore", "voir", "cet", "où", "mon", "moi", "car", "après", "lui"
    ],
    sentenceParts: {
      subjects: ["Le chat", "Le chien", "La fille", "Le garçon", "Mon père", "Ma mère", "L'ami", "Le professeur", "La voiture", "Le monde"],
      verbs: ["mange", "regarde", "aime", "veut", "voit", "prend", "donne", "parle", "écoute", "cherche"],
      objects: ["la pomme", "le livre", "la maison", "le film", "la musique", "une lettre", "le chemin", "la porte", "un café", "le temps"],
      adjectives: ["grand", "petit", "beau", "joli", "bon", "mauvais", "rouge", "noir", "jeune", "vieux"],
      adverbs: ["souvent", "toujours", "jamais", "parfois", "vite", "bien", "ici", "là"]
    }
  },
  it: {
    words: [
      "di", "e", "il", "la", "che", "in", "a", "per", "un", "non", "è", "una", "i", "le", "si", "con", "se", "da", "lo", "più", "ma",
      "come", "sono", "questo", "o", "ha", "gli", "al", "anche", "tutto", "ho", "su", "mi", "della", "del", "ci", "dal", "cosa", "io",
      "cui", "alla", "due", "molto", "fatto", "quando", "essere", "ne", "solo", "ancora", "hanno", "poi", "lei", "lui", "senza", "tra",
      "anni", "chi", "era", "quello", "tutti", "va", "tempo", "sua", "parte", "casa", "vita", "dove", "ogni", "prima", "fa", "già"
    ],
    sentenceParts: {
      subjects: ["Il gatto", "Il cane", "L'uomo", "La donna", "Il ragazzo", "La ragazza", "Mio padre", "Tua sorella", "Il dottore", "L'amico"],
      verbs: ["mangia", "vede", "sente", "trova", "cerca", "ama", "vuole", "prende", "scrive", "legge"],
      objects: ["la pizza", "il pane", "la mela", "il libro", "la macchina", "la porta", "il telefono", "la chiave", "il giornale", "un caffè"],
      adjectives: ["bello", "brutto", "grande", "piccolo", "nuovo", "vecchio", "buono", "cattivo", "alto", "basso"],
      adverbs: ["oggi", "ieri", "presto", "tardi", "bene", "male", "sempre", "mai"]
    }
  },
  nl: {
    words: [
      "de", "van", "het", "een", "en", "in", "is", "dat", "op", "te", "niet", "zijn", "voor", "met", "die", "aan", "er", "maar", "om",
      "hij", "ook", "je", "als", "bij", "hebben", "nog", "naar", "uit", "jaar", "wel", "doen", "nu", "of", "ik", "dan", "kan", "geen",
      "we", "moet", "twee", "zo", "ons", "zij", "ze", "mijn", "meer", "waarom", "deze", "worden", "heel", "gaan", "veel", "hier", "na",
      "kunnen", "zou", "wil", "wat", "haar", "hem", "alles", "toch", "via", "waar", "onder", "mensen", "tijd", "over", "weten", "zien"
    ],
    sentenceParts: {
      subjects: ["De hond", "De kat", "De man", "De vrouw", "Het kind", "Mijn broer", "De leraar", "De dokter", "Iemand", "De buurman"],
      verbs: ["eet", "drinkt", "ziet", "hoort", "zoekt", "vindt", "koopt", "leest", "schrijft", "maakt"],
      objects: ["een appel", "het boek", "de auto", "een brief", "het huis", "de krant", "een brood", "de deur", "koffie", "water"],
      adjectives: ["groot", "klein", "snel", "langzaam", "mooi", "lelijk", "jong", "oud", "goed", "slecht"],
      adverbs: ["vandaag", "morgen", "nu", "vaak", "nooit", "altijd", "soms", "graag"]
    }
  }
};
