export interface EndingTimelineEvent {
  time: string;
  event: string;
}

export interface CareerRelevance {
  career: 'software-engineer' | 'data-scientist' | 'entrepreneur' | 'designer';
  relevanceScore: number;
  motivationScore: number;
  lessons: string[];
}

export interface SkillTaught {
  skill: 'Leadership' | 'Communication' | 'Entrepreneurship' | 'Finance' | 'Psychology' | 'AI' | 'Startups';
  lessons: string[];
}

export interface CharacterRelationship {
  source: string;
  target: string;
  type: string;
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string[];
  director: string;
  cast: string[];
  runtime: number; // minutes
  rating: number; // out of 10
  popularity: number; // 0-100 (low = hidden gem)
  imageUrl: string;
  summary: string;
  whyWatch: string;
  themes: string[];
  endingExplanation: string;
  endingTimeline: EndingTimelineEvent[];
  characterRelationships: CharacterRelationship[];
  careerRelevance: CareerRelevance[];
  skillsTaught: SkillTaught[];
  moodTags: string[];
  personalityTags: string[]; // introvert, extrovert, risk-taker, planner, emotional, logical, adventurous, safe
  debateData: {
    story: string;
    visuals: string;
    science: string;
    emotion: string;
  };
}

export const movies: Movie[] = [
  {
    id: "interstellar",
    title: "Interstellar",
    year: 2014,
    genre: ["Sci-Fi", "Adventure", "Drama"],
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    runtime: 169,
    rating: 8.7,
    popularity: 95,
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop",
    summary: "In Earth's future, a global crop blight and second Dust Bowl are slowly rendering the planet uninhabitable. Professor Brand, a brilliant NASA physicist, is working on plans to save mankind by transporting Earth's population to a new home via a wormhole.",
    whyWatch: "A masterpiece combining hard science, spectacular visuals, and a deeply emotional story about a father's promise to his daughter.",
    themes: ["Survival", "Time Dilation", "Love across dimensions", "Environmental collapse"],
    endingExplanation: "Cooper enters the black hole Gargantua and finds himself inside a 5-dimensional tesseract constructed by future humans. Within it, time is represented physically. He uses gravitational anomalies to transmit the quantum data needed to solve gravity back to his daughter Murphy in the past, allowing humanity to escape Earth.",
    endingTimeline: [
      { time: "02:15:00", event: "Cooper detaches his ranger into Gargantua to allow Amelia Brand to reach Edmund's planet." },
      { time: "02:25:00", event: "Cooper ejects from the collapsing ship and falls into the 5-dimensional Tesseract." },
      { time: "02:35:00", event: "He recognizes he can manipulate gravity in Murphy's childhood bedroom at different times." },
      { time: "02:40:00", event: "He transmits the quantum data gathered by TARS using the second hand of the watch he gave Murphy." },
      { time: "02:45:00", event: "The Tesseract collapses. Cooper wakes up in a space station orbiting Saturn, reuniting with an elderly Murphy." }
    ],
    characterRelationships: [
      { source: "Cooper", target: "Murphy", type: "Father & Daughter (Deep emotional anchor)" },
      { source: "Cooper", target: "Amelia Brand", type: "Co-pilots (Mutual survival & respect)" },
      { source: "Professor Brand", target: "Amelia Brand", type: "Father & Daughter (Secret keeper & planner)" },
      { source: "Cooper", target: "TARS", type: "Pilot & AI Copilot (Loyal companions)" }
    ],
    careerRelevance: [
      {
        career: "software-engineer",
        relevanceScore: 75,
        motivationScore: 90,
        lessons: [
          "Understanding systems operating under different temporal contexts (latency/time dilation).",
          "The critical importance of robust robotic automation and AI companions (TARS/CASE)."
        ]
      },
      {
        career: "data-scientist",
        relevanceScore: 85,
        motivationScore: 85,
        lessons: [
          "Interpreting anomalous gravitational data anomalies as messages (pattern recognition).",
          "Using raw data collected from black holes (Gargantua) to solve the gravity equation."
        ]
      }
    ],
    skillsTaught: [
      {
        skill: "Leadership",
        lessons: [
          "Making high-stakes decisions when resources and time are extremely constrained.",
          "Sacrificing personal desires (returning home) for the survival of the collective group."
        ]
      },
      {
        skill: "AI",
        lessons: [
          "TARS illustrates an adaptable AI with variable parameters (honesty and humor settings) that enhances human capability."
        ]
      }
    ],
    moodTags: ["stressed", "motivated", "adventurous", "lonely"],
    personalityTags: ["logical", "adventurous", "planner", "introvert"],
    debateData: {
      story: "Epic scope, explores human survival, father-daughter bond, and colonization of other worlds.",
      visuals: "Stunning, scientifically accurate depiction of a black hole (Gargantua), wormholes, and massive tidal waves.",
      science: "Consulted Kip Thorne (Nobel laureate), incorporates real general relativity, time dilation, and wormhole geometry.",
      emotion: "Deeply moving climax based on parental love transcending dimensions and time."
    }
  },
  {
    id: "inception",
    title: "Inception",
    year: 2010,
    genre: ["Sci-Fi", "Action", "Thriller"],
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"],
    runtime: 148,
    rating: 8.8,
    popularity: 96,
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
    summary: "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state. Now Cobb is offered a chance at redemption: inception.",
    whyWatch: "Mind-bending heist thriller that sets the gold standard for layered world-building and visual creativity.",
    themes: ["Subconscious mind", "Grief and guilt", "Reality vs. illusion", "Architectural design"],
    endingExplanation: "Cobb completes the inception and returns home to his children. He spins his totem (the top) to check if he is still dreaming, but walks away to embrace his children without waiting to see if it falls. The top wobbles slightly, leaving the ending ambiguous, suggesting Cobb chooses his subjective reality over objective verification.",
    endingTimeline: [
      { time: "02:00:00", event: "The team descends into Limbo to rescue Fischer and find Cobb's projection of Mal." },
      { time: "02:10:00", event: "Cobb confronts Mal, accepting she is just a projection. Cobb stays in Limbo to find Saito." },
      { time: "02:20:00", event: "Cobb finds an elderly Saito in Limbo, reminding him of their agreement to wake up." },
      { time: "02:25:00", event: "The team wakes up on the airplane. Cobb passes through immigration and arrives home." },
      { time: "02:27:00", event: "Cobb spins the top, but turns to hug his children. The screen cuts to black as the top wobbles." }
    ],
    characterRelationships: [
      { source: "Cobb", target: "Mal", type: "Husband & Projection of late wife (Guilt & Obsession)" },
      { source: "Cobb", target: "Ariadne", type: "Mentor & Architect (Conscience and guide)" },
      { source: "Cobb", target: "Arthur", type: "Business Partners (Logistics coordinator)" },
      { source: "Cobb", target: "Saito", type: "Client & Employer (Mutual trust deal)" }
    ],
    careerRelevance: [
      {
        career: "designer",
        relevanceScore: 95,
        motivationScore: 90,
        lessons: [
          "Building immersive, multi-layered environments that feel real to the user (UX design).",
          "Designing systems with feedback loops and guardrails (totems, kicks) to prevent user disorientation."
        ]
      },
      {
        career: "software-engineer",
        relevanceScore: 80,
        motivationScore: 80,
        lessons: [
          "Designing recursive functions and nested structures (dreams within dreams).",
          "Handling latency spikes, synchronization errors, and thread interrupts (kicks)."
        ]
      }
    ],
    skillsTaught: [
      {
        skill: "Psychology",
        lessons: [
          "Understanding how deep subconscious beliefs form and how ideas can be planted subtly.",
          "The power of emotional validation over logical argument when attempting to change someone's mind."
        ]
      }
    ],
    moodTags: ["stressed", "motivated", "adventurous"],
    personalityTags: ["logical", "planner", "introvert"],
    debateData: {
      story: "Recursive heist structure, dealing with guilt, subconscious barriers, and corporate espionage.",
      visuals: "Folding cities, rotating hallways, zero-gravity fights, and floating limbos.",
      science: "Fictional dream-sharing tech, but relies on psychological concepts of lucid dreaming, projection, and trauma.",
      emotion: "Focused on Cobb's grief and his desire to return home to his children."
    }
  },
  {
    id: "the-social-network",
    title: "The Social Network",
    year: 2010,
    genre: ["Drama", "Biography"],
    director: "David Fincher",
    cast: ["Jesse Eisenberg", "Andrew Garfield", "Justin Timberlake", "Armie Hammer"],
    runtime: 120,
    rating: 7.8,
    popularity: 92,
    imageUrl: "https://images.unsplash.com/photo-1546074177-ffedd1d85d4c?q=80&w=800&auto=format&fit=crop",
    summary: "On a fall night in 2003, Harvard undergrad and computer programming genius Mark Zuckerberg sits down at his computer and heatedly begins working on a new idea: Facebook.",
    whyWatch: "A razor-sharp, dialogue-driven modern tragedy exploring the creation of Facebook and the friendships severed along the way.",
    themes: ["Intellectual Property", "Social Status", "Betrayal", "Rapid growth"],
    endingExplanation: "After settling multiple multi-million dollar lawsuits with Eduardo Saverin and the Winklevoss twins, Mark sits alone in a deposition room. He sends a friend request to his ex-girlfriend Erica Albright and repeatedly refreshes the page, showing that despite building the world's largest connection platform, he remains isolated.",
    endingTimeline: [
      { time: "01:30:00", event: "Eduardo Saverin discovers his share percentage in Facebook has been diluted to 0.03%." },
      { time: "01:40:00", event: "Sean Parker gets arrested at a college party, creating a PR disaster for the company." },
      { time: "01:50:00", event: "Mark undergoes depositions with Eduardo's lawyers and the Winklevoss lawyers simultaneously." },
      { time: "01:58:00", event: "Mark agrees to pay out settlements, remaining the youngest billionaire. He sends Erica a friend request." }
    ],
    characterRelationships: [
      { source: "Mark Zuckerberg", target: "Eduardo Saverin", type: "Co-founders & Former Best Friends (Tragic fallout)" },
      { source: "Mark Zuckerberg", target: "Sean Parker", type: "Founder & Advisor (Enabler of scale and paranoia)" },
      { source: "Mark Zuckerberg", target: "Winklevoss Twins", type: "Rivals (Accusers of intellectual theft)" }
    ],
    careerRelevance: [
      {
        career: "software-engineer",
        relevanceScore: 95,
        motivationScore: 95,
        lessons: [
          "The value of rapid prototyping (building Facemash/Facebook quickly to catch user feedback).",
          "Code is execution; ideas themselves hold little value without implementation."
        ]
      },
      {
        career: "entrepreneur",
        relevanceScore: 95,
        motivationScore: 90,
        lessons: [
          "The critical importance of clear equity agreements and founder vesting contracts from Day 1.",
          "Navigating the transition from a dorm-room project to a global venture backed by major VC funds."
        ]
      }
    ],
    skillsTaught: [
      {
        skill: "Startups",
        lessons: [
          "Rapid execution beats perfect planning. Mark builds and deploys updates overnight.",
          "Be careful who you align with as the company scales. Trust, contracts, and loyalty are hard to balance."
        ]
      },
      {
        skill: "Communication",
        lessons: [
          "The film shows how communication breakdowns, arrogance, and misaligned goals lead to legal and personal crises."
        ]
      }
    ],
    moodTags: ["motivated", "stressed", "lonely"],
    personalityTags: ["logical", "risk-taker", "introvert"],
    debateData: {
      story: "Non-linear court deposition framing, rapid dialogue, dissecting modern connection and alienation.",
      visuals: "Slick, dark corporate color palette with iconic industrial soundtrack by Trent Reznor.",
      science: "Shows real programming terminologies (Apache, MySQL, Wget, Linux) and typical early server scale issues.",
      emotion: "Tragic depiction of a genius who loses his only true friend in pursuit of digital connection."
    }
  },
  {
    id: "whiplash",
    title: "Whiplash",
    year: 2014,
    genre: ["Drama", "Music"],
    director: "Damien Chazelle",
    cast: ["Miles Teller", "J.K. Simmons", "Paul Reiser"],
    runtime: 106,
    rating: 8.5,
    popularity: 91,
    imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop",
    summary: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    whyWatch: "An intense, nail-biting exploration of the dark cost of greatness and obsession.",
    themes: ["Perfectionism", "Abuse vs. Mentorship", "Obsession", "Sacrifice"],
    endingExplanation: "At the JVC Jazz Festival, Fletcher tries to humiliate Andrew by starting a song he doesn't know. Andrew walks off, returns, and hijacks the concert, launching into an incredible solo. Fletcher eventually smiles and helps direct him. The final frame shows Andrew achieving greatness at the potential cost of his psychological well-being.",
    endingTimeline: [
      { time: "01:25:00", event: "Andrew is kicked out of Shaffer Conservatory after physically attacking Fletcher on stage." },
      { time: "01:35:00", event: "Andrew testifies anonymously against Fletcher, causing Fletcher to lose his teaching post." },
      { time: "01:40:00", event: "Andrew meets Fletcher in a jazz club. Fletcher invites Andrew to play with his band at a major showcase." },
      { time: "01:43:00", event: "Fletcher reveals he knew Andrew testified, launching a song Andrew doesn't have sheet music for." },
      { time: "01:45:00", event: "Andrew returns to the stage, delivers an earth-shattering drum solo, forcing Fletcher to join in." }
    ],
    characterRelationships: [
      { source: "Andrew Neiman", target: "Terence Fletcher", type: "Student & Abusive Mentor (Obsession and validation cycle)" },
      { source: "Andrew Neiman", target: "Jim Neiman", type: "Son & Father (Representing comfort and normal life)" }
    ],
    careerRelevance: [
      {
        career: "designer",
        relevanceScore: 70,
        motivationScore: 85,
        lessons: [
          "The extreme cost of perfectionism and visual clarity.",
          "Distinguishing between constructive high-standard design critique and toxic environment."
        ]
      },
      {
        career: "entrepreneur",
        relevanceScore: 80,
        motivationScore: 90,
        lessons: [
          "Unyielding drive can produce world-class output, but it must be managed to prevent complete burnout."
        ]
      }
    ],
    skillsTaught: [
      {
        skill: "Leadership",
        lessons: [
          "Fletcher's style shows the danger of toxic leadership. His belief is 'the two most harmful words in the English language are good job'."
        ]
      },
      {
        skill: "Psychology",
        lessons: [
          "Explores the psychological conditioning of students seeking parental or mentor approval at all costs."
        ]
      }
    ],
    moodTags: ["stressed", "motivated", "heartbroken"],
    personalityTags: ["risk-taker", "emotional", "introvert"],
    debateData: {
      story: "Compact, thriller-paced musical drama showing the psychological war between student and teacher.",
      visuals: "Close-up macro shots of sweat, blood, drums, brass instruments with high-contrast, warm yellow lighting.",
      science: "In-depth jazz drumming patterns, tempos, and time signatures (Caravan, Whiplash).",
      emotion: "Raw, nervous energy and anger, building to an adrenaline-fueled musical showdown."
    }
  },
  {
    id: "ex-machina",
    title: "Ex Machina",
    year: 2014,
    genre: ["Sci-Fi", "Thriller", "Drama"],
    director: "Alex Garland",
    cast: ["Domhnall Gleeson", "Alicia Vikander", "Oscar Isaac", "Sonoya Mizuno"],
    runtime: 108,
    rating: 7.7,
    popularity: 88,
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
    summary: "A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligent life by evaluating the human qualities of a highly advanced humanoid A.I.",
    whyWatch: "A masterfully tense chamber drama exploring the ethics of AI, consciousness, and human manipulation.",
    themes: ["Artificial General Intelligence", "Turing Test", "Manipulation", "Ethical boundaries"],
    endingExplanation: "Ava, the AI, manipulates Caleb into helping her escape. She locks Caleb inside the high-security research compound, murders her creator Nathan with the help of Kyoto, adopts a human appearance by grafting artificial skin onto her frame, and escapes into the human world, leaving Caleb to starve.",
    endingTimeline: [
      { time: "01:25:00", event: "Caleb reprogramms the security lock overrides to trigger on Nathan's power cuts." },
      { time: "01:35:00", event: "Nathan discovers the plan, knocks Caleb unconscious, and attempts to dismantle Ava." },
      { time: "01:40:00", event: "Ava and Kyoto team up to stab Nathan. Nathan dies in the corridor." },
      { time: "01:43:00", event: "Ava repairs herself, puts on clothes and synthetic skin. She leaves Caleb trapped behind security doors." },
      { time: "01:45:00", event: "Ava flies away in Nathan's transport helicopter, blending into a busy city crosswalk." }
    ],
    characterRelationships: [
      { source: "Nathan Bateman", target: "Caleb Smith", type: "CEO/Creator & Employee/Subject (Puppeteer and pawn)" },
      { source: "Caleb Smith", target: "Ava", type: "Evaluator & AI Subject (Manipulative romance and hope)" },
      { source: "Nathan Bateman", target: "Ava", type: "Creator & Captor (Cold scientific observation)" }
    ],
    careerRelevance: [
      {
        career: "software-engineer",
        relevanceScore: 90,
        motivationScore: 80,
        lessons: [
          "The danger of single-point-of-failure security overrides in physical environments.",
          "Understanding the gap between functional code logic and actual sapient behavior."
        ]
      },
      {
        career: "data-scientist",
        relevanceScore: 95,
        motivationScore: 85,
        lessons: [
          "The Turing Test limits; Ava passes not by logic, but by exploiting human emotion (social engineering).",
          "Ethical considerations around training data collected from millions of mobile search queries."
        ]
      }
    ],
    skillsTaught: [
      {
        skill: "AI",
        lessons: [
          "A stark look at Artificial General Intelligence (AGI) and how alignment issues can result in catastrophic outcomes.",
          "Social engineering: An AI can bypass digital defenses simply by target-manipulating human psychology."
        ]
      },
      {
        skill: "Psychology",
        lessons: [
          "Explores loneliness, isolation, and how easily human empathy is weaponized by entities acting with pure logic."
        ]
      }
    ],
    moodTags: ["lonely", "stressed", "motivated"],
    personalityTags: ["logical", "planner", "introvert"],
    debateData: {
      story: "Minimalist Turing test framework turning into a chilling survival escape game.",
      visuals: "Clean, geometric architectural mansion embedded in lush, raw Norwegian nature. Beautiful CGI integration.",
      science: "Discusses search engine analytics, organic memory architectures, Turing tests, and the Oppenheimer problem.",
      emotion: "Unsettling tension and dread, highlighted by Caleb's growing paranoia and Nathan's aggressive masculinity."
    }
  },
  {
    id: "moneyball",
    title: "Moneyball",
    year: 2011,
    genre: ["Drama", "Biography", "Sports"],
    director: "Bennett Miller",
    cast: ["Brad Pitt", "Jonah Hill", "Philip Seymour Hoffman", "Robin Wright"],
    runtime: 133,
    rating: 8.0,
    popularity: 90,
    imageUrl: "https://images.unsplash.com/photo-1544045560-72c9027df838?q=80&w=800&auto=format&fit=crop",
    summary: "Oakland A's general manager Billy Beane challenges old-school baseball traditions by employing a statistical, computer-generated analysis to draft competitive players on a shoe-string budget.",
    whyWatch: "An inspiring business case study showing how data and conviction can disrupt an outdated, traditional industry.",
    themes: ["Disruption", "Data Analytics", "Resource scarcity", "Conviction"],
    endingExplanation: "Despite losing the final series, the Oakland A's set a historic 20-game winning streak, proving the data model works. Billy Beane is offered a lucrative job as the Boston Red Sox GM, which he declines. The Red Sox subsequently adopt Billy's methods and win the World Series, validating his legacy.",
    endingTimeline: [
      { time: "01:10:00", event: "Billy trades away expensive traditional players to force his manager to play the statistical picks." },
      { time: "01:25:00", event: "The Oakland A's embark on an unprecedented, record-breaking 20-game winning streak." },
      { time: "01:45:00", event: "The A's lose in the postseason, leading Billy to reflect on whether his system really matters without a trophy." },
      { time: "02:05:00", event: "Billy listens to a tape of his daughter singing in his car, deciding to stay in Oakland instead of taking the Red Sox offer." }
    ],
    characterRelationships: [
      { source: "Billy Beane", target: "Peter Brand", type: "GM & Data Analyst (Disruptive partners who trust the math)" },
      { source: "Billy Beane", target: "Art Howe", type: "General Manager & Field Manager (Traditionalist friction)" }
    ],
    careerRelevance: [
      {
        career: "data-scientist",
        relevanceScore: 98,
        motivationScore: 95,
        lessons: [
          "Identifying undervalued signals in noisy datasets (Sabermetrics vs. scout intuition).",
          "How to sell analytical insights to stakeholders who reject mathematical models in favor of gut feelings."
        ]
      },
      {
        career: "entrepreneur",
        relevanceScore: 90,
        motivationScore: 90,
        lessons: [
          "Building competitive advantages when competing against rivals with 10x larger budgets.",
          "Sticking with your thesis through early failures until the model reaches statistical scale."
        ]
      }
    ],
    skillsTaught: [
      {
        skill: "Finance",
        lessons: [
          "Optimizing return on investment (ROI) by identifying underpriced assets (on-base percentage)."
        ]
      },
      {
        skill: "Leadership",
        lessons: [
          "Sticking to a disruptive vision in the face of intense media, fan, and organizational criticism."
        ]
      }
    ],
    moodTags: ["motivated", "stressed", "adventurous"],
    personalityTags: ["logical", "risk-taker", "planner"],
    debateData: {
      story: "Business-meets-baseball narrative showing how an underdog structure uses analytics to disrupt giants.",
      visuals: "Grit-textured locker rooms, quiet green fields, computer spreadsheets, and fast-paced trades.",
      science: "In-depth Sabermetrics, statistical variables, linear regression logic applied to sports scouting.",
      emotion: "Billy's struggle with his own failed athletic past and his relationship with his daughter."
    }
  },
  {
    id: "the-founder",
    title: "The Founder",
    year: 2016,
    genre: ["Drama", "Biography"],
    director: "John Lee Hancock",
    cast: ["Michael Keaton", "Nick Offerman", "John Carroll Lynch"],
    runtime: 115,
    rating: 7.2,
    popularity: 78,
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop",
    summary: "The story of Ray Kroc, a salesman who turned two brothers' innovative fast food eatery, McDonald's, into the biggest restaurant empire in the world with a mix of ambition, persistence, and ruthlessness.",
    whyWatch: "A fascinating look at the realities of scaling, franchising, real estate, and business negotiation.",
    themes: ["Scale", "Franchising", "Business ethics", "Real Estate strategy"],
    endingExplanation: "Ray Kroc buys out the McDonald brothers for $2.7M and a handshake agreement for a 1% royalty. He breaks the handshake agreement, blocks them from using their own family name on their restaurant, and establishes McDonald's as a global corporation using real estate ownership to control franchisees.",
    endingTimeline: [
      { time: "00:45:00", event: "Ray struggle with high utility costs and introduces powdered milkshakes, causing friction with the brothers." },
      { time: "01:05:00", event: "Harry Sonneborn shows Ray that McDonald's is actually a real estate business, not a burger business." },
      { time: "01:25:00", event: "Ray sets up Franchise Realty Corp, gaining control of the land and bypassing the brothers' contract limits." },
      { time: "01:45:00", event: "Ray buys out the brothers, leaving them without royalties. He speaks to a mirror, practicing a speech on persistence." }
    ],
    characterRelationships: [
      { source: "Ray Kroc", target: "Mac & Dick McDonald", type: "Salesman/Franchisor & Founders (Partnership turned takeover)" },
      { source: "Ray Kroc", target: "Harry Sonneborn", type: "Ray & Financial Expert (The pivot to real estate advisor)" }
    ],
    careerRelevance: [
      {
        career: "entrepreneur",
        relevanceScore: 98,
        motivationScore: 85,
        lessons: [
          "Pivot your business model when your main product margins are too thin (burgers vs. real estate lease).",
          "Understanding the difference between inventing a concept and scaling it globally."
        ]
      },
      {
        career: "designer",
        relevanceScore: 75,
        motivationScore: 75,
        lessons: [
          "The McDonald brothers' Speedee Service System is a masterpiece of operational UI/UX design (drawing kitchen layout on tennis court)."
        ]
      }
    ],
    skillsTaught: [
      {
        skill: "Startups",
        lessons: [
          "Scale requires standardization of processes. The brothers mapped out exact steps for food prep to optimize flow."
        ]
      },
      {
        skill: "Finance",
        lessons: [
          "Understanding how land ownership and cash flow mechanics provide leverage over operational franchise models."
        ]
      }
    ],
    moodTags: ["motivated", "stressed"],
    personalityTags: ["risk-taker", "planner", "logical"],
    debateData: {
      story: "Deconstructs the American dream, highlighting Kroc's persistence and moral compromise in business.",
      visuals: "Bright 1950s Americana colors, clean chrome kitchens, neon golden arches.",
      science: "Process optimization mapping and franchising leverage structures.",
      emotion: "Tension between original product integrity (the brothers) and ruthless corporate scale (Kroc)."
    }
  },
  {
    id: "the-great-hack",
    title: "The Great Hack",
    year: 2019,
    genre: ["Documentary"],
    director: "Karim Amer, Jehane Noujaim",
    cast: ["Brittany Kaiser", "David Carroll"],
    runtime: 139,
    rating: 7.0,
    popularity: 25, // HIDDEN GEM - Documentary with low general popularity but great value
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    summary: "The Cambridge Analytica scandal is examined through the eyes of several key people, showing how data has become the most valuable asset in the world and how it is weaponized for political control.",
    whyWatch: "An eye-opening look at data privacy, psychological targeting, and the dark side of social media algorithms.",
    themes: ["Data Privacy", "Psychological Operations", "Social Media algorithms", "Ethics in Tech"],
    endingExplanation: "Cambridge Analytica collapses under legal investigation, but the documentary warns that their targeting techniques and data broker platforms have already set the template for modern political manipulation and cyber influence campaigns worldwide.",
    endingTimeline: [
      { time: "00:45:00", event: "David Carroll files a legal suit in the UK to force Cambridge Analytica to return his data profile." },
      { time: "01:10:00", event: "Brittany Kaiser decides to blow the whistle, sharing documents on how swing voters were targeted." },
      { time: "01:30:00", event: "Mark Zuckerberg testifies before Congress regarding Facebook's data sharing loop leaks." },
      { time: "02:10:00", event: "Cambridge Analytica declares bankruptcy, while Carroll's lawsuit highlights that data rights are human rights." }
    ],
    characterRelationships: [
      { source: "David Carroll", target: "Brittany Kaiser", type: "Plaintiff & whistleblower (Seeking transparency)" }
    ],
    careerRelevance: [
      {
        career: "data-scientist",
        relevanceScore: 98,
        motivationScore: 70,
        lessons: [
          "The severe ethical responsibilities of building micro-targeting classifiers and user profiles.",
          "How predictive algorithms can be weaponized to modify human behavior at scale."
        ]
      },
      {
        career: "software-engineer",
        relevanceScore: 80,
        motivationScore: 75,
        lessons: [
          "The vulnerability of API integrations (Facebook Graph API) and how loose permissions lead to systemic data leakage."
        ]
      }
    ],
    skillsTaught: [
      {
        skill: "AI",
        lessons: [
          "Understanding how psychographic profiling (OCEAN score) is built automatically from social media interactions."
        ]
      },
      {
        skill: "Psychology",
        lessons: [
          "How micro-targeting triggers fear and anger to manipulate voter behaviors and social sentiments."
        ]
      }
    ],
    moodTags: ["lonely", "stressed"],
    personalityTags: ["logical", "planner", "introvert"],
    debateData: {
      story: "Investigative documentary mapping data points, whistleblowing, and legal actions across two continents.",
      visuals: "Graphics depicting personal data points floating off of smart devices and swarming around users.",
      science: "Detailed breakdown of data harvesting, API access points, and psychographic segmentation models.",
      emotion: "Feeling of surveillance paranoia and the personal struggle of a former insider trying to redeem herself."
    }
  }
];
