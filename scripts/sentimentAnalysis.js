// Pre-populated negative words with associated weights
let negativeWords = {
    "abominable": 3.0, "abhorrent": 3.0, "abysmal": 2.5, "adverse": 2.0, "alarm": 2.5,
    "anger": 2.5, "annoy": 2.0, "atrocious": 3.0, "awful": 2.5, "bad": 2.0,
    "betray": 2.5, "bitter": 2.0, "boring": 1.5, "chaos": 2.5, "complain": 2.0,
    "corrupt": 3.0, "cruel": 3.0, "damage": 2.0, "danger": 2.5, "degrade": 2.0,
    "disgusting": 3.0, "dreadful": 3.0, "evil": 3.0, "fear": 2.5, "frightening": 2.5,
    "gloomy": 2.0, "greed": 2.0, "harm": 2.0, "hate": 3.0, "horrible": 3.0,
    "worthless": 2.5, "wreck": 2.0, "ugly": 2.0, "untrustworthy": 2.5, "vicious": 3.0,
    "abandon": 2.0, "agony": 2.5, "anguish": 3.0, "annoying": 2.0, "appalling": 3.0,
    "arrogant": 2.5, "ashamed": 2.5, "atrophy": 3.0, "avoid": 2.0,
    "backstab": 2.5, "baffling": 2.0, "bankrupt": 3.0, "barbaric": 3.0, "betrayed": 2.5,
    "bleak": 2.5, "blunder": 2.0, "brutal": 3.0, "bug": 1.5, "burden": 2.5,
    "callous": 2.5, "catastrophic": 3.0, "chaotic": 2.5, "clumsy": 2.0, "complaint": 2.0,
    "contempt": 3.0, "coward": 2.5, "creepy": 2.5,
    "crisis": 2.5, "criticize": 2.0, "cruelty": 3.0, "cry": 2.5, "cynical": 2.5,
    "dangerous": 2.5, "deadly": 3.0, "defeat": 2.5, "defective": 2.0, "deformed": 2.5,
    "depressing": 3.0, "despair": 3.0, "desperate": 2.5, "destruction": 3.0, "detest": 2.5,
    "devastating": 3.0, "disaster": 3.0, "disastrous": 3.0, "discomfort": 2.0, "disdain": 2.5,
    "disgust": 3.0, "dislike": 2.5, "dismal": 2.5, "distress": 2.5, "disturbing": 3.0,
    "doomed": 2.5, "dread": 2.5, "dull": 2.0, "dysfunction": 2.5, "embarrass": 2.5,
    "enemy": 3.0, "enraged": 3.0, "envious": 2.0, "erode": 2.5, "fail": 2.5,
    "fake": 2.5, "fatal": 3.0, "flaw": 2.0, "fool": 2.5, "fraud": 3.0,
    "frustration": 2.5, "furious": 3.0, "grief": 3.0, "gross": 2.5, "guilt": 2.5,
    "hardship": 2.5, "heartbreaking": 3.0, "helpless": 2.5, "hostile": 2.5, "humiliate": 3.0,
    "hypocrite": 3.0, "idiot": 2.5, "ignorant": 2.5, "immoral": 2.5, "impolite": 2.0,
    "incompetent": 2.5, "inconsistent": 2.0, "inept": 2.5, "infuriating": 3.0, "insult": 3.0,
    "intolerable": 3.0, "irritating": 2.5, "jealous": 2.5, "lament": 2.5, "lazy": 2.0,
    "liar": 3.0, "loathe": 3.0, "loser": 2.5, "lousy": 2.0, "malice": 3.0,
    "mediocre": 2.0, "mess": 2.0, "miserable": 3.0, "misfortune": 2.5, "mistake": 2.0,
    "moody": 2.0, "mourn": 2.5, "murder": 3.0, "nasty": 3.0, "neglect": 2.5,
    "nonsense": 2.5, "obnoxious": 2.5, "offensive": 2.5, "pain": 2.5, "pathetic": 3.0,
    "pessimistic": 2.5, "petty": 2.0, "pitiful": 2.5, "poison": 2.5, "prejudice": 2.5,
    "problem": 2.0, "regret": 2.5, "repulsive": 3.0, "resent": 2.5, "rotten": 2.5,
    "rude": 2.0, "ruin": 3.0, "sabotage": 2.5, "sad": 2.5, "selfish": 2.5,
    "shame": 2.5, "sick": 2.0, "sinister": 3.0, "skeptical": 2.0, "stupid": 2.5,
    "substandard": 2.0, "suffering": 3.0, "terrible": 3.0, "threat": 2.5,
    "tragic": 3.0, "trash": 2.5, "ugliness": 2.5, "unbearable": 2.5, "undesirable": 2.0,
    "unfortunate": 2.5, "unhappy": 2.0, "unpleasant": 2.0, "unreliable": 2.5, "upset": 2.5,
    "useless": 2.5, "victim": 2.0, "violent": 3.0, "vulgar": 2.5,
    "wicked": 3.0, "worried": 2.5, "wrecked": 2.0, "wrong": 2.0,
    "cringey": 2.5, "troll": 2.0, "clown": 2.0, "dumb": 2.0, "salty": 2.0,
    "L": 2.0, "rage": 2.5, "noob": 2.0,
    "nuke": 2.5, "bot": 2.0, "hater": 2.5, "yikes": 2.0,
    "nerfed": 2.0, "sus": 2.0, "flame": 2.5, "burn": 2.0,
    "weak": 2.0, "washed": 2.0, "thirsty": 2.0, "toxic": 3.0, "triggered": 2.5,
    "ghosted": 2.0, "busted": 2.0, "cancel": 3.0, "flop": 2.0, "booted": 2.0,
    "camping": 1.5, "rekt": 2.5, "griefing": 2.0, "lag": 1.5, "smh": 2.0,
    "trashcan": 2.5, "cringe": 2.5, "ragequit": 2.5, "GG": 2.0, "cursed": 2.5,
    "scuffed": 2.0, "degen": 2.5, "karen": 2.5, "ratio": 2.0, "pwned": 2.0
};

// Pre-populated positive words with associated weights
let positiveWords = {
    "amazing": 3.0,
    "awesome": 3.0,
    "beautiful": 2.5,
    "bliss": 2.5,
    "brilliant": 3.0,
    "cheerful": 2.5,
    "delightful": 2.5,
    "ecstatic": 3.0,
    "elegant": 2.5,
    "excellent": 3.0,
    "fantastic": 3.0,
    "glad": 2.0,
    "happy": 3.0,
    "honest": 2.5,
    "incredible": 3.0,
    "joy": 2.5,
    "kind": 2.0,
    "love": 3.0,
    "lucky": 2.5,
    "peaceful": 2.0,
    "perfect": 3.0,
    "pleasant": 2.5,
    "wonderful": 3.0,
    "zest": 2.5,
    "nice": 2.5,
    "thanks": 3.0,
    "good": 3.0,
    "great": 3.0,
    "lovely": 3.0,
    "admire": 3.0,
    "adorable": 2.5,
    "adventurous": 2.5,
    "affectionate": 3.0,
    "ambitious": 2.5,
    "appreciative": 2.5,
    "astounding": 3.0,
    "authentic": 2.5,
    "blissful": 3.0,
    "calm": 2.0,
    "captivating": 3.0,
    "charming": 2.5,
    "compassionate": 2.5,
    "confident": 2.5,
    "courageous": 2.5,
    "creative": 2.5,
    "dazzling": 3.0,
    "dedicated": 2.5,
    "eager": 2.0,
    "enthusiastic": 2.5,
    "faithful": 2.5,
    "genius": 3.0,
    "inspiring": 3.0,
    "intelligent": 3.0,
    "magical": 3.0,
    "phenomenal": 3.0,
    "playful": 2.5,
    "refreshing": 2.5,
    "respected": 2.5,
    "rewarding": 2.5,
    "satisfying": 2.5,
    "spectacular": 3.0,
    "trustworthy": 2.5,
    "visionary": 2.5,
    "delight": 3.0,
    "radiate": 2.5,
    "kindhearted": 2.5,
    "charitable": 2.5,
    "compelling": 2.5,
    "amused": 2.5,
    "elated": 3.0,
    "uplifted": 3.0,
    "exhilarated": 3.0,
    "joyful": 3.0,
    "comforted": 2.5,
    "content": 2.5,
    "fantabulous": 3.0,
    "radiating": 3.0,
    "breathtaking": 3.0,
    "wonderstruck": 3.0,
    "gleaming": 2.5,
    "adoring": 3.0,
    "sublime": 3.0,
    "mesmerizing": 3.0,
    "enchanting": 3.0,
    "thriving": 2.5,
    "vital": 2.5,
    "flourish": 3.0,
    "uplift": 2.5,
    "heartwarming": 3.0,
    "zeal": 2.5,
    "radiance": 3.0,
    "endearing": 2.5,
    "sparkling": 3.0,
    "delighted": 3.0,
    "exuberant": 3.0,
    "compassion": 3.0,
    "brave": 2.5,
    "trusting": 2.5,
    "vivacious": 3.0,
    "bubbly": 2.5,
    "zippy": 2.5,
    "cheery": 2.5,
    "jaunty": 2.5,
    "spunky": 2.5,
    "exquisite": 3.0,
    "diligent": 2.5,
    "amiable": 2.5,
    "blessed": 3.0,
    "balanced": 2.5,
    "benevolent": 3.0,
    "blissfully": 3.0,
    "fulfilling": 3.0,
    "gratified": 3.0,
    "gracefully": 2.5,
    "innovative": 3.0,
    "kindness": 2.5,
    "motivational": 2.5,
    "noteworthy": 2.5,
    "optimism": 2.5,
    "peacefully": 2.5,
    "positivity": 2.5,
    "praiseworthy": 3.0,
    "prosperity": 2.5,
    "radiantly": 3.0,
    "refreshed": 3.0,
    "remarkably": 3.0,
    "resilience": 2.5,
    "shimmering": 3.0,
    "sincere": 2.5,
    "spiritually": 2.5,
    "stupendous": 3.0,
    "supportively": 2.5,
    "trustfully": 2.5,
    "unflinching": 2.5,
    "victory": 3.0,
    "vigorously": 2.5,
    "vivaciously": 3.0,
    "youthfully": 2.5,
    "admirable": 2.5,
    "commendable": 2.5,
    "dazzlingly": 3.0,
    "dependable": 2.5,
    "devoted": 2.5,
    "dignified": 2.5,
    "discerning": 2.5,
    "dynamic": 2.5,
    "ebullient": 3.0,
    "eclectic": 2.5,
    "effervescent": 3.0,
    "efficacious": 3.0,
    "elevated": 2.5,
    "empathetic": 2.5,
    "empowered": 2.5,
    "encouraged": 2.5,
    "endowed": 2.5,
    "enlightened": 3.0,
    "enriching": 2.5,
    "enthralling": 3.0,
    "entranced": 3.0,
    "epic": 3.0,
    "esteemed": 3.0,
    "eternal": 2.5,
    "euphoric": 3.0,
    "evolved": 2.5,
    "exalted": 3.0,
    "exceptional": 3.0,
    "excited": 3.0,
    "exemplary": 2.5,
    "exhilarating": 3.0,
    "expansive": 2.5,
    "expressive": 2.5,
    "extraordinary": 3.0,
    "fabulous": 3.0,
    "fair": 2.5,
    "fanciful": 2.5,
    "fearless": 2.5,
    "festive": 3.0,
    "fit": 2.5,
    "flawless": 3.0,
    "flourishing": 3.0,
    "focused": 2.5,
    "fortunate": 3.0,
    "free": 2.5,
    "friendly": 2.5,
    "fulfilled": 3.0,
    "fun": 2.5,
    "gallant": 2.5,
    "generous": 3.0,
    "genial": 2.5,
    "genuine": 2.5,
    "gifted": 2.5,
    "glamorous": 3.0,
    "gleeful": 3.0,
    "glimmering": 3.0,
    "glorious": 3.0,
    "glowing": 3.0,
    "grace": 2.5,
    "graceful": 3.0,
    "gracious": 2.5,
    "grand": 3.0,
    "grateful": 2.5,
    "greathearted": 3.0,
    "gregarious": 2.5,
    "gutsy": 2.5,
    "hardworking": 2.5,
    "harmonious": 2.5,
    "healing": 2.5,
    "heartening": 2.5,
    "hearty": 2.5,
    "heavenly": 3.0,
    "helpful": 2.5,
    "heroic": 3.0,
    "honorable": 2.5,
    "hopeful": 2.5,
    "hospitable": 2.5,
    "humble": 2.5,
    "humorous": 2.5,
    "idealistic": 2.5,
    "illuminating": 3.0,
    "imaginative": 3.0,
    "impeccable": 3.0,
    "impressive": 3.0,
    "incomparable": 3.0,
    "influential": 3.0,
    "inspirational": 3.0,
    "inspired": 3.0,
    "intrepid": 2.5,
    "inventive": 2.5,
    "jolly": 2.5,
    "jovial": 2.5,
    "joyous": 3.0,
    "jubilant": 3.0,
    "just": 2.5,
    "keen": 2.5,
    "laudable": 2.5,
    "lavish": 3.0,
    "legendary": 3.0,
    "lighthearted": 2.5,
    "lively": 2.5,
    "loyal": 2.5,
    "luminous": 3.0,
    "luxurious": 3.0,
    "magnanimous": 3.0,
    "magnificent": 3.0,
    "majestic": 3.0,
    "marvelous": 3.0,
    "masterful": 3.0,
    "meaningful": 2.5,
    "mellow": 2.5,
    "meritorious": 2.5,
    "mindful": 2.5,
    "miraculous": 3.0,
    "modest": 2.5,
    "motivated": 2.5,
    "noble": 2.5,
    "nurturing": 2.5,
    "openhearted": 2.5,
    "optimistic": 2.5,
    "outstanding": 3.0,
    "passionate": 3.0,
    "patient": 2.5,
    "peaceable": 2.5,
    "peerless": 3.0,
    "perceptive": 2.5,
    "perseverant": 2.5,
    "philanthropic": 2.5,
    "picturesque": 3.0,
    "plucky": 2.5,
    "poised": 2.5,
    "polished": 3.0,
    "positive": 3.0,
    "powerful": 3.0,
    "precious": 3.0,
    "priceless": 3.0,
    "proactive": 2.5,
    "prodigious": 3.0,
    "profound": 3.0,
    "prominent": 2.5,
    "prosperous": 3.0,
    "pure": 2.5,
    "radiant": 3.0,
    "rapturous": 3.0,
    "rare": 2.5,
    "reassured": 2.5,
    "refined": 3.0,
    "reliable": 2.5,
    "remarkable": 3.0,
    "resilient": 2.5,
    "resolute": 2.5,
    "resourceful": 2.5,
    "respectful": 2.5,
    "revered": 2.5,
    "rewarded": 3.0,
    "robust": 2.5,
    "sacred": 2.5,
    "sagacious": 2.5,
    "satisfied": 3.0,
    "secure": 2.5,
    "selfless": 2.5,
    "sensational": 3.0,
    "serendipitous": 2.5,
    "serene": 2.5,
    "shining": 3.0,
    "skillful": 2.5,
    "soaring": 3.0,
    "spirited": 2.5,
    "splendid": 3.0,
    "spontaneous": 2.5,
    "steadfast": 2.5,
    "stellar": 3.0,
    "stunning": 3.0,
    "successful": 3.0,
    "sunny": 2.5,
    "superb": 3.0,
    "supportive": 2.5,
    "supreme": 3.0,
    "sympathetic": 2.5,
    "talented": 3.0,
    "tenacious": 2.5,
    "terrific": 3.0,
    "thankful": 2.5,
    "thoughtful": 2.5,
    "thrilled": 3.0,
    "tranquil": 2.5,
    "transformative": 2.5,
    "triumphant": 3.0,
    "truthful": 2.5,
    "unbelievable": 3.0,
    "undaunted": 2.5,
    "unforgettable": 3.0,
    "unique": 3.0,
    "uplifting": 2.5,
    "valiant": 2.5,
    "valued": 2.5,
    "venerated": 3.0,
    "vibrant": 3.0,
    "victorious": 3.0,
    "vigorous": 2.5,
    "virtuous": 2.5,
    "vivid": 2.5,
    "warmhearted": 3.0,
    "welcoming": 2.5,
    "wholesome": 3.0,
    "wise": 2.5,
    "wondrous": 3.0,
    "worthy": 2.5,
    "youthful": 2.5,
    "zany": 2.5,
    "zestful": 2.5,
    "zingy": 2.5,
    "zealous": 2.5
};

// Pre-populated neutral words with associated weights
let neutralWords = {
    "account": 1.0, "balance": 1.0, "book": 1.0, "chair": 1.0, "data": 1.0,
    "document": 1.0, "event": 1.0, "fact": 1.0, "general": 1.0, "group": 1.0,
    "information": 1.0, "item": 1.0, "list": 1.0, "number": 1.0, "object": 1.0,
    "place": 1.0, "reference": 1.0, "schedule": 1.0, "table": 1.0, "unit": 1.0,
    "window": 1.0, "year": 1.0, "zone": 1.0, "medium": 1.0, "overview": 1.0,
    "analysis": 1.0, "application": 1.0, "article": 1.0, "asset": 1.0, "baseline": 1.0,
    "category": 1.0, "center": 1.0, "collection": 1.0, "component": 1.0, "concept": 1.0,
    "connection": 1.0, "context": 1.0, "definition": 1.0, "device": 1.0, "element": 1.0,
    "feature": 1.0, "framework": 1.0, "goal": 1.0, "instance": 1.0, "layer": 1.0,
    "layout": 1.0, "machine": 1.0, "mechanism": 1.0, "method": 1.0, "module": 1.0,
    "operation": 1.0, "parameter": 1.0, "process": 1.0, "program": 1.0,
    "project": 1.0, "protocol": 1.0, "report": 1.0, "response": 1.0, "role": 1.0,
    "section": 1.0, "session": 1.0, "specification": 1.0, "structure": 1.0, "system": 1.0,
    "task": 1.0, "tool": 1.0, "transaction": 1.0, "user": 1.0, "utility": 1.0,
    "value": 1.0, "variable": 1.0, "version": 1.0, "workflow": 1.0,
    "update": 1.0, "refresh": 1.0, "install": 1.0, "load": 1.0, "server": 1.0,
    "status": 1.0, "ping": 1.0, "AFK": 1.0, "drop": 1.0, "backup": 1.0,
    "frame": 1.0, "gameplay": 1.0, "screen": 1.0, "video": 1.0, "clip": 1.0
};

let emojiSentiment = {
    // Positive emojis
    "😊": 3.0, "😄": 3.0, "😍": 3.0, "🤩": 3.0, "👍": 2.5, "❤": 3.0, "😇": 3.0,
    "🎉": 3.0, "🎊": 3.0, "💖": 3.0, "🌟": 3.0, "👏": 2.5, "✨": 3.0, "🎈": 3.0,
    "🙌": 3.0, "🤗": 3.0, "💪": 2.5, "👑": 3.0, "💫": 3.0, "🥳": 3.0, "😎": 3.0,
    "😻": 3.0, "🔥": 3.0, "💯": 3.0, "🤙": 2.5, "🤑": 2.5, "🤝": 2.5, "🙏": 3.0,
    "😋": 2.5, "⭐": 3.0, "🌈": 3.0, "🍀": 2.5, "🏆": 3.0, "🥇": 3.0,
    "🎁": 3.0, "💎": 3.0, "🧡": 3.0, "😌": 2.5, "🤟": 2.5,

    // Negative emojis
    "😢": -3.0, "😡": -3.0, "👎": -2.5, "😭": -3.0, "😓": -2.0, "😕": -3.0,
    "💔": -3.0, "😣": -3.0, "😞": -2.5, "🤬": -3.0, "😨": -2.0, "😫": -3.0,
    "😱": -2.5, "😖": -3.0, "😔": -2.5, "😤": -2.5, "💢": -2.5, "🤢": -3.0, "🤮": -3.0,
    "😒": -2.5, "👿": -3.0, "🖕": -3.0, "🤯": -2.0, "😧": -2.5, "😬": -2.0, "😷": -2.0,
    "😟": -2.5, "💀": -2.5, "🤕": -2.5, "🤧": -2.0, "😠": -2.5, "💣": -2.5, "⚠️": -2.0,

    // Neutral emojis
    "😐": 0.0, "🤔": 0.0, "🧐": 0.0, "😑": 0.0, "🤨": 0.0, "😶": 0.0,
    "📝": 0.0, "📄": 0.0, "💼": 0.0, "📊": 0.0, "📈": 0.0, "📉": 0.0, "👀": 0.0,
    "🤖": 0.0, "🛑": 0.0, "🚶": 0.0, "🤷‍♂️": 0.0, "🤷‍♀️": 0.0, "✋": 0.0,
    "💡": 0.0, "⚙️": 0.0, "🛠": 0.0, "📌": 0.0, "🖋": 0.0, "⌛": 0.0, "⏳": 0.0,
    "💭": 0.0, "🔍": 0.0, "📂": 0.0, "🛒": 0.0, "🔐": 0.0, "🔧": 0.0
};

let positiveBigrams = {
    "very good": 3.0, "absolutely amazing": 3.0, "highly recommend": 3.0
};

let negativeBigrams = {
    "very bad": 3.0, "absolutely awful": 3.0, "highly disappointed": 3.0
};

let positiveTrigrams = {
    "out of this": 3.0, "best ever seen": 3.0
};

let negativeTrigrams = {
    "worst ever seen": 3.0, "not worth it": 3.0
};

let zeroCount = 0;
let fourCount = 0;
let trainingIterations = 2;
let retrainTrainingIterations = 15;

let db;

let apiBaseUrl = 'https://youtube.googleapis.com/youtube/v3';
let key = "AIzaSyBav8jQwmVNxRFk4Q2FcviOHnUwbJjM8cU";

function parseCSV(csvContent) {
    return Papa.parse(csvContent, {
        header: false,
        dynamicTyping: true,
        skipEmptyLines: true
    }).data;
}

// Open or create a new IndexedDB database
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('SentimentAnalysisDB', 3);

        request.onerror = (event) => {
            console.error('Failed to open IndexedDB:', event.target.errorCode);
            reject(new Error('Failed to open IndexedDB.'));
        };

        request.onsuccess = (event) => {
            db = request.result;
            console.log('IndexedDB opened successfully');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains('sentimentModel')) {
                db.createObjectStore('sentimentModel', { keyPath: 'id' });
            }
            console.log('IndexedDB setup or upgrade complete');
        };
    });
}

// Save the sentiment model to IndexedDB
function saveModelToIndexedDB() {
    if (!db) {
        console.error('Database is not initialized. Please ensure openDatabase() is called.');
        return;
    }

    const transaction = db.transaction(['sentimentModel'], 'readwrite');
    const objectStore = transaction.objectStore('sentimentModel');

    const modelData = {
        id: 1,  // Use a fixed ID for a single model
        positiveWords,
        negativeWords,
        positiveBigrams,
        negativeBigrams,
        positiveTrigrams,
        negativeTrigrams,
        zeroCount,
        fourCount
    };

    const request = objectStore.put(modelData);

    transaction.oncomplete = () => {
        console.log('Model data saved to IndexedDB');
    };

    transaction.onerror = (event) => {
        console.error('Error saving model to IndexedDB', event);
    };
}

// Load the sentiment model from IndexedDB
function loadModelFromIndexedDB() {
    if (!db) {
        console.error('Database is not initialized. Please ensure openDatabase() is called.');
        return;
    }

    const transaction = db.transaction(['sentimentModel'], 'readonly');
    const objectStore = transaction.objectStore('sentimentModel');

    const request = objectStore.get(1);  // Fetch the model with the ID 1

    request.onsuccess = (event) => {
        const model = request.result;
        if (model) {
            positiveWords = model.positiveWords || positiveWords;
            negativeWords = model.negativeWords || negativeWords;
            positiveBigrams = model.positiveBigrams || positiveBigrams;
            negativeBigrams = model.negativeBigrams || negativeBigrams;
            positiveTrigrams = model.positiveTrigrams || positiveTrigrams;
            negativeTrigrams = model.negativeTrigrams || negativeTrigrams;
            zeroCount = model.zeroCount || 0;
            fourCount = model.fourCount || 0;

            console.log('Model loaded from IndexedDB');
        } else {
            console.log('No model found in IndexedDB');
        }
    };

    transaction.onerror = (event) => {
        console.error('Error loading model from IndexedDB', event);
    };
}

async function saveModel() {
    if (!db) {
        // Wait for the database to be initialized if it hasn't been yet
        await openDatabase();
    }
    saveModelToIndexedDB();
}

async function loadModel() {
    if (!db) {
        // Wait for the database to be initialized if it hasn't been yet
        await openDatabase();
    }

    loadModelFromIndexedDB();
}


async function fetchCommentsFromDatabase() {
    const apiUrl = 'https://haydeneubanks.co.uk/includes/DbConnection/apiGetComments.php';

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch database comments. Status: ${response.status}`);
            }
            return response.json();  // Parse JSON response
        })
        .then(data => {
            // Ensure the database data has the correct format (array of [sentiment, comment])
            return data.map(comment => [parseInt(comment.sentiment, 10), comment.comment_text]);
        })
        .catch(error => {
            console.error('Error fetching database comments:', error);
            return [];  // Return empty array in case of error
        });
}

async function getTrainingDataFromCsvAndDatabase(pathToCsv, trainingMode) {
    let csvDataPromise;
    zeroCount = 0;
    fourCount = 0;

    // Fetch CSV data
    csvDataPromise = fetch(pathToCsv)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); // Resolve to text (assuming CSV format)
        })
        .then(csvContent => {
            console.log("CSV Content Loaded Successfully");
            let allData = parseCSV(csvContent); // Parse CSV using your `parseCSV` function
            if (!allData || allData.length === 0) {
                throw new Error("Parsed CSV data is empty or undefined");
            }
            return allData.map(row => [parseInt(row[0], 10), row[1]]); // Format as needed
        })
        .catch(error => {
            console.error('Error fetching CSV data:', error);
            return []; // Return empty in case of error
        });

    // Fetch database comments
    const dbDataPromise = fetchCommentsFromDatabase();

    // Wait for both CSV and database data to be ready
    return Promise.all([csvDataPromise, dbDataPromise])
        .then(([csvData, dbData]) => {
            let allTrainingData = [...csvData, ...dbData];  // Merge CSV and DB data
            console.log('Combined CSV and Database Data:', allTrainingData);

            // Split the data into training and test sets (85% for training, 15% for testing)
            let trainDataSize = Math.floor(0.85 * allTrainingData.length);
            let trainingData = [];
            let testData = [];

            for (let i = 0; i < allTrainingData.length; i++) {
                // Evenly pick from both ends
                if (i % 7 === 0) {
                    testData.push(allTrainingData[i]);
                } else {
                    trainingData.push(allTrainingData[i]);
                }
            }

            // Process each row in the training data and train the word lists
            trainingData.forEach((row, index) => {
                let label = parseInt(row[0], 10);

                // Ignore invalid labels
                if (label !== 0 && label !== 4) return;

                if (label === 0) zeroCount++;
                if (label === 4) fourCount++;

                // Convert label: 4 -> positive, 0 -> negative
                label = label === 4 ? 1 : 0;

                let text = row[1];
                // Vectorize text and update positive or negative word lists
                vectorizeText(text, label);
            });

            console.log('Zero Count:', zeroCount);
            console.log('Four Count:', fourCount);
            console.log('Positive Words:', positiveWords);
            console.log('Negative Words:', negativeWords);

            if(trainingMode === 'train') {
                // After training, test the model on the remaining 15%
                for (let i = 0; i < trainingIterations; i++) {
                    testModel(testData);
                }
            } else if(trainingMode === 're-train') {
                // After training, test the model on the remaining 15%
                for (let i = 0; i < retrainTrainingIterations; i++) {
                    testModel(testData);
                }
            }

            saveModel();

            // After training, store the training status
            isModelTrained = true;
            console.log('Model training completed and stored as trained.');

        })
        .catch(error => console.error('Error fetching training data:', error));
}


function testModel(testData) {
    console.log('Testing the model on the remaining 15% of the data...');

    let correctPredictions = 0;
    let totalPredictions = 0;

    testData.forEach(row => {
        let trueLabel = parseInt(row[0], 10);

        // Convert label: 4 -> positive, 0 -> negative
        trueLabel = trueLabel === 4 ? 1 : 0;

        let text = row[1];
        let predictedSentimentScore = calculateSentimentScore(text);

        // Classify the comment based on the sentiment score
        let predictedLabel = predictedSentimentScore > 0 ? 1 : 0;

        // Check if the predicted label matches the true label
        if (predictedLabel === trueLabel) {
            correctPredictions++;
        } else {
            // Tune the model by adjusting word weights based on incorrect predictions
            tuneModel(text, trueLabel);
        }

        totalPredictions++;
    });

    const accuracy = (correctPredictions / totalPredictions) * 100;
    console.log(`Model accuracy on the test data: ${accuracy.toFixed(2)}%`);
}

function tuneModel(text, trueLabel) {
    const words = text
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .toLowerCase()
        .split(/\s+/);

    words.forEach(word => {
        if (trueLabel === 1) {  // Positive label
            if (positiveWords[word]) {
                positiveWords[word] += 0.8;  // Increase positive words more aggressively
            }
            if (negativeWords[word]) {
                negativeWords[word] = Math.max(negativeWords[word] - 0.8, 0);  // Decrease negative words less aggressively
            }
        } else if (trueLabel === 0) {  // Negative label
            if (negativeWords[word]) {
                negativeWords[word] += 0.2;
            }
            if (positiveWords[word]) {
                positiveWords[word] = Math.max(positiveWords[word] - 0.2, 0);
            }
        }
    });

    console.log('Model tuned for this incorrect prediction');
}

function vectorizeText(text, label) {
    // Remove punctuation, normalize case, and split into words
    const words = text
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .toLowerCase()           // Normalize to lowercase
        .split(/\s+/);           // Split on any whitespace

    // Process single words, bigrams, and trigrams
    for (let i = 0; i < words.length; i++) {
        let word = words[i];

        // Handle single words
        if (label === 1) {
            positiveWords[word] = (positiveWords[word] || 1.0) + 0.5;
        } else if (label === 0) {
            negativeWords[word] = (negativeWords[word] || 1.0) + 0.5;
        }

        // Handle bigrams
        if (i < words.length - 1) {
            let bigram = words[i] + ' ' + words[i + 1];
            if (label === 1) {
                positiveBigrams[bigram] = (positiveBigrams[bigram] || 1.0) + 0.5;
            } else if (label === 0) {
                negativeBigrams[bigram] = (negativeBigrams[bigram] || 1.0) + 0.5;
            }
        }

        // Handle trigrams
        if (i < words.length - 2) {
            let trigram = words[i] + ' ' + words[i + 1] + ' ' + words[i + 2];
            if (label === 1) {
                positiveTrigrams[trigram] = (positiveTrigrams[trigram] || 1.0) + 0.5;
            } else if (label === 0) {
                negativeTrigrams[trigram] = (negativeTrigrams[trigram] || 1.0) + 0.5;
            }
        }
    }
}

function analyzeSentiments(commentsArray) {
    let totalSentimentScore = 0;
    let totalSentimentProbability = 0;
    let sentimentCount = 0;
    let positiveCount = 0;
    let negativeCount = 0;
    let individualCommentData = [];

    commentsArray.forEach(commentThread => {
        const topLevelComment = commentThread.snippet.topLevelComment.snippet.textDisplay;
        const likeCount = commentThread.snippet.topLevelComment.snippet.likeCount || 0; // Default to 0 if no likes

        // Perform sentiment analysis with emoji support
        const sentimentScore = calculateSentimentScore(topLevelComment);

        // Weight the sentiment score by 1 + logarithmic likes, but with a damping factor
        const weightedSentimentScore = sentimentScore * (1 + 0.05 * likeCount);

        // Apply sigmoid to sentiment score for smoother probability mapping
        const sentimentProbability = sigmoid(weightedSentimentScore);

        // Determine sentiment category based on score
        let commentSentiment = 'Neutral';
        if (weightedSentimentScore > 0.5) {
            commentSentiment = 'Positive';
            positiveCount += (1 + likeCount);
        } else if (weightedSentimentScore < -0.5) {
            commentSentiment = 'Negative';
            negativeCount += (1 + likeCount);
        }

        individualCommentData.push({
            comment: topLevelComment,
            likes: likeCount,
            sentiment: commentSentiment,
            probability: sentimentProbability
        });

        totalSentimentProbability += sentimentProbability * (1 + 0.05 * likeCount);
        sentimentCount += (1 + 0.05 * likeCount);
    });

    // Calculate average sentiment probability
    const averageSentimentProbability = (totalSentimentProbability / sentimentCount) * 100;

    let overallSentiment = 'Neutral';
    if (averageSentimentProbability < 20) {
        overallSentiment = 'Overwhelmingly Negative';
    } else if (averageSentimentProbability < 50) {
        overallSentiment = 'Negative';
    } else if (averageSentimentProbability > 60 && averageSentimentProbability < 80) {
        overallSentiment = 'Positive';
    } else if (averageSentimentProbability > 80) {
        overallSentiment = 'Overwhelmingly Positive';
    }

    const totalPosNegComments = positiveCount + negativeCount;
    const positivityPercentage = totalPosNegComments > 0
        ? (positiveCount / totalPosNegComments) * 100
        : 0;

    return {
        overallSentiment,
        overallSentimentProbability: averageSentimentProbability,
        positivityPercentage,
        individualCommentData
    };
}


function calculateSentimentScore(commentText) {
    let score = 0;
    const negationWords = ["not", "never", "no", "none", "regrettably"];
    const words = commentText.toLowerCase().split(/\s+/);
    let negate = false;

    for (let i = 0; i < words.length; i++) {
        let word = words[i].toLowerCase();

        // Handle negation
        if (negationWords.includes(word)) {
            negate = true;
            continue;
        }

        // Check for trigrams
        if (i < words.length - 2) {
            let trigram = words[i] + ' ' + words[i + 1] + ' ' + words[i + 2];
            if (positiveTrigrams[trigram]) {
                score += negate ? -positiveTrigrams[trigram] : positiveTrigrams[trigram];
            } else if (negativeTrigrams[trigram]) {
                score += negate ? negativeTrigrams[trigram] : -negativeTrigrams[trigram];
            }
        }

        // Check for bigrams
        if (i < words.length - 1) {
            let bigram = words[i] + ' ' + words[i + 1];
            if (positiveBigrams[bigram]) {
                score += negate ? -positiveBigrams[bigram] : positiveBigrams[bigram];
            } else if (negativeBigrams[bigram]) {
                score += negate ? negativeBigrams[bigram] : -negativeBigrams[bigram];
            }
        }

        //Handle emojis
        if (emojiSentiment[words[i]]) {
            score += emojiSentiment[words[i]];
            continue;  // Skip further processing for this emoji
        }

        // Check for single words
        if (positiveWords[word]) {
            score += negate ? -positiveWords[word] : positiveWords[word];
        } else if (negativeWords[word]) {
            score += negate ? negativeWords[word] : -negativeWords[word];
        } else if (neutralWords[word]) {
            score += neutralWords[word];  // Neutral words contribute a fixed value
        }

        negate = false; // Reset negation after processing a word
    }

    return score;
}

function displayComments(commentsArray, overallSentiment, overallSentimentProbability, positivityPercentage, individualCommentData) {
    const commentsList = document.querySelector('#commentsContainer');
    commentsList.innerHTML = '';

    // Convert overall sentiment probability to a percentage without rounding
    const overallSentimentProbabilityPercentage = Math.floor(overallSentimentProbability * 100 * 100) / 100;
    const positivityPercentageRounded = Math.floor(positivityPercentage * 100) / 100;

    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;

    individualCommentData.forEach(commentData => {
        if (commentData.sentiment === 'Positive') {
            positiveCount++;
        } else if (commentData.sentiment === 'Negative') {
            negativeCount++;
        } else {
            neutralCount++;
        }
    });

    // Display overall sentiment, probability, and positivity percentage
    const overallSentimentText = document.createElement('p');
    overallSentimentText.textContent = `Overall Sentiment: ${overallSentiment}`;
    const overallSentimentProbabilityText = document.createElement('p');
    overallSentimentProbabilityText.textContent = `Overall Probability: ${overallSentimentProbabilityPercentage}%`;
    const positivityPercentageText = document.createElement('p');
    positivityPercentageText.textContent = `Overall Positivity Percentage: ${positivityPercentageRounded}%`;
    const commentCountsText = document.createElement('p');
    commentCountsText.textContent = `Comments Breakdown: Positive - ${positiveCount}, Neutral - ${neutralCount}, Negative - ${negativeCount}`;
    commentsList.appendChild(overallSentimentText);
    commentsList.appendChild(overallSentimentProbabilityText);
    commentsList.appendChild(positivityPercentageText);
    commentsList.appendChild(commentCountsText);

    // Display individual comments with their sentiment and probability
    individualCommentData.forEach(commentData => {
        // Convert sentiment probability to a percentage without rounding
        const sentimentProbabilityPercentage = Math.floor(commentData.probability * 100 * 100) / 100;

        // Add emoji and color based on sentiment
        let sentimentText = '';
        if (commentData.sentiment === 'Positive') {
            sentimentText = `<span style="color:green;">Positive 😄</span>`;
        } else if (commentData.sentiment === 'Negative') {
            sentimentText = `<span style="color:red;">Negative ☹️</span>`;
        } else {
            sentimentText = `<span style="color:gray;">Neutral 😐</span>`;
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="comment">
                <p class="comment-text">${commentData.comment}</p>
                <p class="comment-sentiment">Sentiment: ${sentimentText}</p>
                <p class="comment-probability">Probability: ${sentimentProbabilityPercentage}%</p>
                <p class="comment-likes">👍 Likes: ${commentData.likes}</p>
            </div>
        `;
        commentsList.appendChild(li);
    });
}

async function fetchYoutubeCommentsVideoId(inputVideoId) {
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': '',
            'Accept': 'application/json'
        }
    };

    let totalCommentArray = [];

    const response = await fetch(`${apiBaseUrl}/commentThreads?part=snippet%2Creplies&videoId=${inputVideoId}&key=${key}&maxResults=100`, options)
        .catch(error => console.log(error));

    const record = await response.json().then(async responseJson => {
        let commentsArray = responseJson.items;
        let nextPage = responseJson.nextPageToken;

        // Collect all comments
        for (let i = 0; i < commentsArray.length; i++) {
            totalCommentArray.push(commentsArray[i]);
        }

        while (nextPage) {
            const innerResponse = await fetch(`${apiBaseUrl}/commentThreads?part=snippet%2Creplies&videoId=${inputVideoId}&pageToken=${nextPage}&key=${key}&maxResults=100`, options)
                .catch(error => console.log(error));

            const nextResponseJson = await innerResponse.json();
            commentsArray = nextResponseJson.items;
            nextPage = nextResponseJson.nextPageToken;

            for (let i = 0; i < commentsArray.length; i++) {
                totalCommentArray.push(commentsArray[i]);
            }
        }

        console.log('Comment Count: ', totalCommentArray.length);
        const sentimentData = analyzeSentiments(totalCommentArray);
        displayComments(totalCommentArray, sentimentData.overallSentiment, sentimentData.overallSentimentProbability, sentimentData.positivityPercentage, sentimentData.individualCommentData);
    });
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x)); // A smooth curve that maps sentiment to a range of 0 to 1
}


document.addEventListener('DOMContentLoaded', function () {
    // Your logic to modify the DOM here
    const commentsList = document.getElementById('commentsContainer');
    if (commentsList) {
        // Modify innerHTML or other properties here
    } else {
        console.error('commentsContainer not found');
    }
});

// Call openDatabase() before performing database operations
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Ensure the database is opened before performing any operations
        await openDatabase();
        await loadModel();  // Ensure the model is loaded before proceeding

        // Request the current video ID from the background script
        chrome.runtime.sendMessage({ action: 'getVideoId' }, (response) => {
            if (response.videoId) {
                fetchYoutubeCommentsVideoId(response.videoId)
                    .catch(error => {
                        console.error('Error Fetching Comments and Performing Analysis:', error);
                    });
            }
        });
    } catch (error) {
        console.error('Error initializing the database or loading the model:', error);
    }
});

// // Listener to handle messages from background.js
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === 'trainModel') {
//         console.log('Received message to train the model.');
//
//         // Trigger the model training logic
//         getTrainingDataFromCsvAndDatabase('trainingData/trainingData.csv')
//             .then(() => {
//                 sendResponse({ modelTrained: true });
//                 console.log('Model trained successfully.');
//             })
//             .catch((error) => {
//                 console.error('Error during model training:', error);
//                 sendResponse({ modelTrained: false });
//             });
//
//         // Keep the message channel open
//         return true;
//     }
// });