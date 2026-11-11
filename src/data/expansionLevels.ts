import { LevelConfig } from '../types/game';

/**
 * 50 Secular South Asian Survival Expansion Levels (Missions 7–56, Chapters 1–10)
 * Auto-synchronized from expansion/data/candy-rescue-expansion-bundle.json
 */
export const EXPANSION_LEVELS: LevelConfig[] = [
  {
    "id": 7,
    "chapterNumber": 1,
    "chapterTitleEn": "Ch 1: Bengal Mango Valley",
    "chapterTitleBn": "অধ্যায় ১: বাংলার আম বাগান",
    "zoneEn": "Himsagar Chute Awa",
    "zoneBn": "মিশন 7",
    "isBoss": false,
    "scene": "spiral_marble",
    "titleBn": "মিশন 7: Himsagar Chute Awakening",
    "titleEn": "Mission 7: Himsagar Chute Awakening",
    "subtitleBn": "অধ্যায় ১: বাংলার আম বাগান — Break 6 Woven Bamboo Cages and drain 50 Golden Mango Marbles to lift the loft counter-gate.",
    "subtitleEn": "Mochi climbed into the orchard sorting loft to taste ripe Himsagar mangoes, accidentally tripping the bamboo harvest latch as the Emerald Serpent slithers up the irrigation trench!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (First introduction of Nectar-lubricated drain columns where 4-matches temporarily double physical marble gravity speed.)",
    "storyTipEn": "Twist: First introduction of Nectar-lubricated drain columns where 4-matches temporarily double physical marble gravity speed.",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.72,
    "initialMarbles": 52,
    "drainColumns": [
      0,
      1,
      2
    ],
    "themePalette": {
      "sky": "#241808",
      "wall": "#4d2b12",
      "pillar": "#f59e0b",
      "tray": "#d97706"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 52,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Break Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 0,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 2,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 8,
    "chapterNumber": 1,
    "chapterTitleEn": "Ch 1: Bengal Mango Valley",
    "chapterTitleBn": "অধ্যায় ১: বাংলার আম বাগান",
    "zoneEn": "Biscuit Branch Hop",
    "zoneBn": "মিশন 8",
    "isBoss": false,
    "scene": "spiral_marble",
    "titleBn": "মিশন 8: Biscuit Branch Hop",
    "titleEn": "Mission 8: Biscuit Branch Hop",
    "subtitleBn": "অধ্যায় ১: বাংলার আম বাগান — Collect 30 Guava Crisps and 20 Jackfruit Pods to hop Mochi across all 4 Crumbling Biscuit Platforms before they drop.",
    "subtitleEn": "Hungry Golla-Gulp has perched beside the canopy walkway, shaking the branches so the crispy wafer ledges beneath Mochi begin cracking one by one!",
    "storyTipBn": "টার্ন-ভিত্তিক (28 চালে জিততে হবে, সময়ের তাড়া নেই!) (Turn-based platform decay coupled with an enemy that competes for your exact target candy color on the grid.)",
    "storyTipEn": "Twist: Turn-based platform decay coupled with an enemy that competes for your exact target candy color on the grid.",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 28,
    "dangerSpeed": 0,
    "initialMarbles": 52,
    "drainColumns": [
      0,
      1,
      2
    ],
    "themePalette": {
      "sky": "#241808",
      "wall": "#4d2b12",
      "pillar": "#f59e0b",
      "tray": "#d97706"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 52,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Break Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 0,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 2,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 9,
    "chapterNumber": 1,
    "chapterTitleEn": "Ch 1: Bengal Mango Valley",
    "chapterTitleBn": "অধ্যায় ১: বাংলার আম বাগান",
    "zoneEn": "Jute Swing Over Ne",
    "zoneBn": "মিশন 9",
    "isBoss": false,
    "scene": "triple_key",
    "titleBn": "মিশন 9: Jute Swing Over Nectar Creek",
    "titleEn": "Mission 9: Jute Swing Over Nectar Creek",
    "subtitleBn": "অধ্যায় ১: বাংলার আম বাগান — Drop 2 Orchard Pulley Keys and break 8 Bamboo Cages to rig Mochi's overhead jute zip-swing across the creek.",
    "subtitleEn": "A summer gust washed out the middle footbridge over Nectar Creek while the Emerald Serpent swims upstream toward Mochi's bank!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Mid-mission positional checkpoint: dropping Key #1 physically relocates Mochi halfway across the river, dynamically resetting enemy proximity by 20%.)",
    "storyTipEn": "Twist: Mid-mission positional checkpoint: dropping Key #1 physically relocates Mochi halfway across the river, dynamically resetting enemy proximity by 20%.",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.85,
    "initialMarbles": 0,
    "drainColumns": [
      2,
      5
    ],
    "themePalette": {
      "sky": "#241808",
      "wall": "#4d2b12",
      "pillar": "#f59e0b",
      "tray": "#d97706"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 2,
        "labelBn": "সোনালি চাবি নামাও",
        "labelEn": "Rescue Keys",
        "icon": "🗝️"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Bamboo Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 5,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 3,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 7,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 3,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 7,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 10,
    "chapterNumber": 1,
    "chapterTitleEn": "Ch 1: Bengal Mango Valley",
    "chapterTitleBn": "অধ্যায় ১: বাংলার আম বাগান",
    "zoneEn": "Terracotta Slider ",
    "zoneBn": "মিশন 10",
    "isBoss": false,
    "scene": "triple_key",
    "titleBn": "মিশন 10: Terracotta Slider Courtyard",
    "titleEn": "Mission 10: Terracotta Slider Courtyard",
    "subtitleBn": "অধ্যায় ১: বাংলার আম বাগান — Guide 3 Brass Courtyard Keys past the Moving Terracotta Partitions to the bottom exit slots.",
    "subtitleEn": "Mochi is locked inside the storehouse courtyard behind heavy sliding terracotta vents that shift left and right with every move!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Rhythmic horizontal sliding dividers on the Match-3 grid require looking 1 move ahead before pulling a Key downward.)",
    "storyTipEn": "Twist: Rhythmic horizontal sliding dividers on the Match-3 grid require looking 1 move ahead before pulling a Key downward.",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "hybrid",
    "moveLimit": 26,
    "dangerSpeed": 1.35,
    "initialMarbles": 0,
    "drainColumns": [
      2,
      5
    ],
    "themePalette": {
      "sky": "#241808",
      "wall": "#4d2b12",
      "pillar": "#f59e0b",
      "tray": "#d97706"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 2,
        "labelBn": "সোনালি চাবি নামাও",
        "labelEn": "Rescue Keys",
        "icon": "🗝️"
      },
      {
        "kind": "ice",
        "target": 8,
        "labelBn": "বরফ সিল ভাঙো",
        "labelEn": "Break Ice",
        "icon": "🧊"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 5,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 5,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "ice_1"
      },
      {
        "row": 4,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 4,
        "col": 3,
        "blocker": "ice_1"
      },
      {
        "row": 4,
        "col": 4,
        "blocker": "ice_1"
      },
      {
        "row": 4,
        "col": 5,
        "blocker": "ice_1"
      }
    ]
  },
  {
    "id": 11,
    "chapterNumber": 1,
    "chapterTitleEn": "Ch 1: Bengal Mango Valley",
    "chapterTitleBn": "অধ্যায় ১: বাংলার আম বাগান",
    "zoneEn": "Great Mango Harves",
    "zoneBn": "মিশন 11",
    "isBoss": false,
    "scene": "boulder_run",
    "titleBn": "মিশন 11: Great Mango Harvest Stampede",
    "titleEn": "Mission 11: Great Mango Harvest Stampede",
    "subtitleBn": "অধ্যায় ১: বাংলার আম বাগান — Drain 65 Mango Marbles, break 8 Bamboo Cages, and trigger 4 Special Candies to raise the Pavilion Drawbridge.",
    "subtitleEn": "Both the Emerald Serpent AND hungry Golla-Gulp corner Mochi at the harvest pavilion while a giant mango-barrel rolls down the upper ramp!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Using one enemy to counter another: fizzy-stunning Golla-Gulp physically knocks back the arena boulder hazard!)",
    "storyTipEn": "Twist: Using one enemy to counter another: fizzy-stunning Golla-Gulp physically knocks back the arena boulder hazard!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.95,
    "initialMarbles": 0,
    "drainColumns": [],
    "themePalette": {
      "sky": "#241808",
      "wall": "#4d2b12",
      "pillar": "#f59e0b",
      "tray": "#d97706"
    },
    "tasks": [
      {
        "kind": "chains",
        "target": 8,
        "labelBn": "লোহার চেইন ভাঙো",
        "labelEn": "Snap Chains",
        "icon": "⛓️"
      },
      {
        "kind": "specials",
        "target": 3,
        "labelBn": "পাওয়ার কম্বো ফাটাও",
        "labelEn": "Fire Specials",
        "icon": "💥"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "blocker": "chain"
      },
      {
        "row": 1,
        "col": 5,
        "blocker": "chain"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "chain"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "chain"
      },
      {
        "row": 3,
        "col": 3,
        "blocker": "chain"
      },
      {
        "row": 3,
        "col": 4,
        "blocker": "chain"
      },
      {
        "row": 4,
        "col": 2,
        "blocker": "chain"
      },
      {
        "row": 4,
        "col": 5,
        "blocker": "chain"
      },
      {
        "row": 0,
        "col": 3,
        "special": "striped_h",
        "color": "red"
      }
    ]
  },
  {
    "id": 12,
    "chapterNumber": 2,
    "chapterTitleEn": "Ch 2: Sylhet Tea Garden",
    "chapterTitleBn": "অধ্যায় ২: সিলেট চা বাগান",
    "zoneEn": "Sreemangal Morning",
    "zoneBn": "মিশন 12",
    "isBoss": false,
    "scene": "frost_dual",
    "titleBn": "মিশন 12: Sreemangal Morning Mist",
    "titleEn": "Mission 12: Sreemangal Morning Mist",
    "subtitleBn": "অধ্যায় ২: সিলেট চা বাগান — Dispel 12 Tea Mist Clouds and collect 32 Darjeeling Mandarin segments to repair the 4 Rope Bridge slats.",
    "subtitleEn": "Cool highland fog rolled across the tea terraces just as Mochi stepped onto a swaying rope bridge—she needs clear sightlines to cross safely!",
    "storyTipBn": "টার্ন-ভিত্তিক (30 চালে জিততে হবে, সময়ের তাড়া নেই!) (Post-climax relief breather where 3D candy shape silhouettes let observant players make matches right inside fog banks!)",
    "storyTipEn": "Twist: Post-climax relief breather where 3D candy shape silhouettes let observant players make matches right inside fog banks!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 30,
    "dangerSpeed": 0,
    "initialMarbles": 56,
    "drainColumns": [
      2,
      3,
      4,
      5
    ],
    "themePalette": {
      "sky": "#0d261c",
      "wall": "#164230",
      "pillar": "#34d399",
      "tray": "#10b981"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 56,
        "labelBn": "মার্বেল সরাও",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "ice",
        "target": 8,
        "labelBn": "হিমালয় বরফ ভাঙো",
        "labelEn": "Shatter Ice",
        "icon": "❄️"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 1,
        "col": 3,
        "blocker": "ice_1"
      },
      {
        "row": 1,
        "col": 4,
        "blocker": "ice_1"
      },
      {
        "row": 1,
        "col": 5,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 5,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "ice_1"
      }
    ]
  },
  {
    "id": 13,
    "chapterNumber": 2,
    "chapterTitleEn": "Ch 2: Sylhet Tea Garden",
    "chapterTitleBn": "অধ্যায় ২: সিলেট চা বাগান",
    "zoneEn": "Tick-Tock Tea Mill",
    "zoneBn": "মিশন 13",
    "isBoss": false,
    "scene": "triple_key",
    "titleBn": "মিশন 13: Tick-Tock Tea Mill",
    "titleEn": "Mission 13: Tick-Tock Tea Mill",
    "subtitleBn": "অধ্যায় ২: সিলেট চা বাগান — Drop 2 Mill-Wheel Keys and snap 8 Wrought Metal Chains while syncing with the Rotating Gates.",
    "subtitleEn": "A Brass Clockwork Automaton patrolling the tea mill mistook Mochi for an unweighed tea sack—she must slip through the Rotating Waterwheel Gates!",
    "storyTipBn": "টার্ন-ভিত্তিক (27 চালে জিততে হবে, সময়ের তাড়া নেই!) (Zero real-time clock—100% pure turn-based clockwork puzzle where every gate and enemy ticks only when you swipe!)",
    "storyTipEn": "Twist: Zero real-time clock—100% pure turn-based clockwork puzzle where every gate and enemy ticks only when you swipe!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 27,
    "dangerSpeed": 0,
    "initialMarbles": 0,
    "drainColumns": [
      2,
      5
    ],
    "themePalette": {
      "sky": "#0d261c",
      "wall": "#164230",
      "pillar": "#34d399",
      "tray": "#10b981"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 2,
        "labelBn": "সোনালি চাবি নামাও",
        "labelEn": "Rescue Keys",
        "icon": "🗝️"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Bamboo Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 5,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 3,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 7,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 3,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 7,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 14,
    "chapterNumber": 2,
    "chapterTitleEn": "Ch 2: Sylhet Tea Garden",
    "chapterTitleBn": "অধ্যায় ২: সিলেট চা বাগান",
    "zoneEn": "Breezy Bamboo Aque",
    "zoneBn": "মিশন 14",
    "isBoss": false,
    "scene": "frost_dual",
    "titleBn": "মিশন 14: Breezy Bamboo Aqueduct",
    "titleEn": "Mission 14: Breezy Bamboo Aqueduct",
    "subtitleBn": "অধ্যায় ২: সিলেট চা বাগান — Drain 55 Flume Marbles and match 28 Guava Crisps to sail Mochi's leaf-raft upstream to the stone dock.",
    "subtitleEn": "Strong canyon winds are blowing Mochi's leaf-raft backward toward a waterfall drop while mist obscures the flume valves!",
    "storyTipBn": "বাতাসের স্রোতে প্রতি চালে ক্যান্ডি পাশে সরে যায়! (Wrap-around sideways wind conveyor on rows 2–3 turns environmental drift into an intentional combo-building engine.)",
    "storyTipEn": "Twist: Wrap-around sideways wind conveyor on rows 2–3 turns environmental drift into an intentional combo-building engine.",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.8,
    "initialMarbles": 56,
    "drainColumns": [
      2,
      3,
      4,
      5
    ],
    "windRows": [
      {
        "row": 2,
        "dir": 1
      },
      {
        "row": 3,
        "dir": 1
      }
    ],
    "themePalette": {
      "sky": "#0d261c",
      "wall": "#164230",
      "pillar": "#34d399",
      "tray": "#10b981"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 56,
        "labelBn": "মার্বেল সরাও",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "ice",
        "target": 8,
        "labelBn": "হিমালয় বরফ ভাঙো",
        "labelEn": "Shatter Ice",
        "icon": "❄️"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 1,
        "col": 3,
        "blocker": "ice_1"
      },
      {
        "row": 1,
        "col": 4,
        "blocker": "ice_1"
      },
      {
        "row": 1,
        "col": 5,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 5,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "ice_1"
      }
    ]
  },
  {
    "id": 15,
    "chapterNumber": 2,
    "chapterTitleEn": "Ch 2: Sylhet Tea Garden",
    "chapterTitleBn": "অধ্যায় ২: সিলেট চা বাগান",
    "zoneEn": "Twin Terrace Sluic",
    "zoneBn": "মিশন 15",
    "isBoss": false,
    "scene": "frost_dual",
    "titleBn": "মিশন 15: Twin Terrace Sluice Race",
    "titleEn": "Mission 15: Twin Terrace Sluice Race",
    "subtitleBn": "অধ্যায় ২: সিলেট চা বাগান — Break 10 Glacier Ice seals, clear 8 Mist Clouds, and detonate 4 Special Candies to open both terrace gates.",
    "subtitleEn": "Mochi is descending the central garden steps while BOTH a Clockwork Automaton on the left wall and an Emerald Serpent in the right sluice race to block the bottom gate!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Asymmetric Left-vs-Right board hemispheres—left matches manage turn-based danger while right matches manage real-time danger!)",
    "storyTipEn": "Twist: Asymmetric Left-vs-Right board hemispheres—left matches manage turn-based danger while right matches manage real-time danger!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "hybrid",
    "moveLimit": 26,
    "dangerSpeed": 1.45,
    "initialMarbles": 56,
    "drainColumns": [
      2,
      3,
      4,
      5
    ],
    "themePalette": {
      "sky": "#0d261c",
      "wall": "#164230",
      "pillar": "#34d399",
      "tray": "#10b981"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 56,
        "labelBn": "মার্বেল সরাও",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "ice",
        "target": 8,
        "labelBn": "হিমালয় বরফ ভাঙো",
        "labelEn": "Shatter Ice",
        "icon": "❄️"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 1,
        "col": 3,
        "blocker": "ice_1"
      },
      {
        "row": 1,
        "col": 4,
        "blocker": "ice_1"
      },
      {
        "row": 1,
        "col": 5,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 5,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "ice_1"
      }
    ]
  },
  {
    "id": 16,
    "chapterNumber": 2,
    "chapterTitleEn": "Ch 2: Sylhet Tea Garden",
    "chapterTitleBn": "অধ্যায় ২: সিলেট চা বাগান",
    "zoneEn": "Mist-Coiled Tea Ma",
    "zoneBn": "মিশন 16",
    "isBoss": true,
    "scene": "boss_lair",
    "titleBn": "মিশন 16: BOSS: Mist-Coiled Tea Matriarch",
    "titleEn": "Mission 16: BOSS: Mist-Coiled Tea Matriarch",
    "subtitleBn": "অধ্যায় ২: সিলেট চা বাগান — Deplete the Matriarch's 120 HP shield by clearing Mist, dropping 2 Brass Tea-Chest Keys, and draining 45 Reservoir Marbles.",
    "subtitleEn": "BOSS ENCOUNTER 1! The giant Mist-Coiled Serpent Matriarch wraps around the main reservoir wheel, blanketing the board in highland fog while blocking Mochi's cable car!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Two-phase boss puzzle where dispelling fog reveals physical overhead Bell targets that can be sniped by vertical Striped candies!)",
    "storyTipEn": "Twist: Two-phase boss puzzle where dispelling fog reveals physical overhead Bell targets that can be sniped by vertical Striped candies!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.5,
    "initialMarbles": 61,
    "drainColumns": [
      0,
      1,
      6,
      7
    ],
    "themePalette": {
      "sky": "#0d261c",
      "wall": "#164230",
      "pillar": "#34d399",
      "tray": "#10b981"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 2,
        "labelBn": "বস তালা চাবি",
        "labelEn": "Boss Keys",
        "icon": "👑"
      },
      {
        "kind": "marbles",
        "target": 61,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "cannon_charge",
        "target": 48,
        "labelBn": "রেইনবো ক্যানন চার্জ",
        "labelEn": "Boss Cannon",
        "icon": "🌈"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 2,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 5,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 3,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 4,
        "blocker": "ice_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "slime"
      },
      {
        "row": 3,
        "col": 5,
        "blocker": "slime"
      },
      {
        "row": 1,
        "col": 3,
        "special": "striped_v",
        "color": "orange"
      }
    ]
  },
  {
    "id": 17,
    "chapterNumber": 3,
    "chapterTitleEn": "Ch 3: Sundarbans Adventure",
    "chapterTitleBn": "অধ্যায় ৩: সুন্দরবন অভিযান",
    "zoneEn": "Mangrove Boardwalk",
    "zoneBn": "মিশন 17",
    "isBoss": false,
    "scene": "spiral_marble",
    "titleBn": "মিশন 17: Mangrove Boardwalk Stepping",
    "titleEn": "Mission 17: Mangrove Boardwalk Stepping",
    "subtitleBn": "অধ্যায় ৩: সুন্দরবন অভিযান — Clear 10 Bubbling Mud Bog tiles and collect 30 Tender Coconut cubes to lay clean palm-mat walkways for Mochi.",
    "subtitleEn": "After escaping the highlands, Mochi lands on a Sundarbans nature boardwalk—where playful bubbling mud bogs threaten to glue her boots in place!",
    "storyTipBn": "টার্ন-ভিত্তিক (30 চালে জিততে হবে, সময়ের তাড়া নেই!) (Relaxing post-boss breather introducing poison-free sticky silt puddles that reward splash-radius Coconut combos.)",
    "storyTipEn": "Twist: Relaxing post-boss breather introducing poison-free sticky silt puddles that reward splash-radius Coconut combos.",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 30,
    "dangerSpeed": 0,
    "initialMarbles": 56,
    "drainColumns": [
      0,
      1,
      2
    ],
    "themePalette": {
      "sky": "#091f1a",
      "wall": "#1b3b2b",
      "pillar": "#fbbf24",
      "tray": "#b45309"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 56,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Break Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 0,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 2,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 18,
    "chapterNumber": 3,
    "chapterTitleEn": "Ch 3: Sundarbans Adventure",
    "chapterTitleBn": "অধ্যায় ৩: সুন্দরবন অভিযান",
    "zoneEn": "Thorn-Step Watchto",
    "zoneBn": "মিশন 18",
    "isBoss": false,
    "scene": "spiral_marble",
    "titleBn": "মিশন 18: Thorn-Step Watchtower",
    "titleEn": "Mission 18: Thorn-Step Watchtower",
    "subtitleBn": "অধ্যায় ৩: সুন্দরবন অভিযান — Clear 10 Sticky Slime coatings and collect 36 Guava Crisps to advance Mochi across 4 Retractable Thorn Checkpoints.",
    "subtitleEn": "A wiggly Gur-Slime Blob is oozing down the watchtower ramp! Mochi must sprint across the causeway ONLY on safe even beats when the bamboo pegs retract!",
    "storyTipBn": "টার্ন-ভিত্তিক (28 চালে জিততে হবে, সময়ের তাড়া নেই!) (Odd/Even move rhythm bonus rewards counting turns before completing each 9-Guava movement threshold!)",
    "storyTipEn": "Twist: Odd/Even move rhythm bonus rewards counting turns before completing each 9-Guava movement threshold!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 28,
    "dangerSpeed": 0,
    "initialMarbles": 56,
    "drainColumns": [
      0,
      1,
      2
    ],
    "themePalette": {
      "sky": "#091f1a",
      "wall": "#1b3b2b",
      "pillar": "#fbbf24",
      "tray": "#b45309"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 56,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Break Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 0,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 2,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 19,
    "chapterNumber": 3,
    "chapterTitleEn": "Ch 3: Sundarbans Adventure",
    "chapterTitleBn": "অধ্যায় ৩: সুন্দরবন অভিযান",
    "zoneEn": "Golden Honeycomb C",
    "zoneBn": "মিশন 19",
    "isBoss": false,
    "scene": "triple_key",
    "titleBn": "মিশন 19: Golden Honeycomb Creek",
    "titleEn": "Mission 19: Golden Honeycomb Creek",
    "subtitleBn": "অধ্যায় ৩: সুন্দরবন অভিযান — Shatter 3 Queen Honeycomb Clusters and drop 2 Dinghy Oar Keys to untie Mochi's boat.",
    "subtitleEn": "A Tangle-Vine Stilt Crawler has woven wooden cages around Mochi's dinghy rope while giant Golden Honeycombs seal the center of the puzzle board!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Regenerating hex-clusters that collapse instantaneously when you snipe their glowing central Queen node!)",
    "storyTipEn": "Twist: Regenerating hex-clusters that collapse instantaneously when you snipe their glowing central Queen node!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.75,
    "initialMarbles": 0,
    "drainColumns": [
      2,
      5
    ],
    "themePalette": {
      "sky": "#091f1a",
      "wall": "#1b3b2b",
      "pillar": "#fbbf24",
      "tray": "#b45309"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 2,
        "labelBn": "সোনালি চাবি নামাও",
        "labelEn": "Rescue Keys",
        "icon": "🗝️"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Bamboo Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 5,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 3,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 7,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 3,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 7,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 20,
    "chapterNumber": 3,
    "chapterTitleEn": "Ch 3: Sundarbans Adventure",
    "chapterTitleBn": "অধ্যায় ৩: সুন্দরবন অভিযান",
    "zoneEn": "Tidal Roots Labyri",
    "zoneBn": "মিশন 20",
    "isBoss": false,
    "scene": "spiral_marble",
    "titleBn": "মিশন 20: Tidal Roots Labyrinth",
    "titleEn": "Mission 20: Tidal Roots Labyrinth",
    "subtitleBn": "অধ্যায় ৩: সুন্দরবন অভিযান — Drain 60 Creek Marbles, clear 8 Mud Bogs, and break 6 Iron Chains to open the high-canopy root bridge.",
    "subtitleEn": "Mochi is navigating a forked mangrove tunnel where a Stilt Crawler blocks the high path and a Slime Blob oozes up the low path!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Order-of-operations puzzle: clearing Mud Bogs FIRST doubles the mechanical efficiency of all subsequent marble-draining matches!)",
    "storyTipEn": "Twist: Order-of-operations puzzle: clearing Mud Bogs FIRST doubles the mechanical efficiency of all subsequent marble-draining matches!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.9,
    "initialMarbles": 56,
    "drainColumns": [
      0,
      1,
      2
    ],
    "themePalette": {
      "sky": "#091f1a",
      "wall": "#1b3b2b",
      "pillar": "#fbbf24",
      "tray": "#b45309"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 56,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Break Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 0,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 2,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 21,
    "chapterNumber": 3,
    "chapterTitleEn": "Ch 3: Sundarbans Adventure",
    "chapterTitleBn": "অধ্যায় ৩: সুন্দরবন অভিযান",
    "zoneEn": "Sunken Brass Chest",
    "zoneBn": "মিশন 21",
    "isBoss": false,
    "scene": "spiral_marble",
    "titleBn": "মিশন 21: Sunken Brass Chest Cove",
    "titleEn": "Mission 21: Sunken Brass Chest Cove",
    "subtitleBn": "অধ্যায় ৩: সুন্দরবন অভিযান — Unlock all 3 Brass Treasure Trunks (9 color-coded gem clasps total) and clear 2 Honeycomb Seals to launch the sailboat.",
    "subtitleEn": "Mochi's sailboat rudder, sail-pin, and compass are locked inside three Brass Sweet Trunks—each sealed with three color-coded fruit gem clasps!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Hammer-immune color-combination locks that require aligning specific fruit colors along orthogonal sightlines!)",
    "storyTipEn": "Twist: Hammer-immune color-combination locks that require aligning specific fruit colors along orthogonal sightlines!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "hybrid",
    "moveLimit": 26,
    "dangerSpeed": 1.35,
    "initialMarbles": 56,
    "drainColumns": [
      0,
      1,
      2
    ],
    "themePalette": {
      "sky": "#091f1a",
      "wall": "#1b3b2b",
      "pillar": "#fbbf24",
      "tray": "#b45309"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 56,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Break Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 0,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 2,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 22,
    "chapterNumber": 4,
    "chapterTitleEn": "Ch 4: Litchi Orchard Escape",
    "chapterTitleBn": "অধ্যায় ৪: দিনাজপুর লিচু বাগান",
    "zoneEn": "Dinajpur Ruby Cano",
    "zoneBn": "মিশন 22",
    "isBoss": false,
    "scene": "lava_bridge",
    "titleBn": "মিশন 22: Dinajpur Ruby Canopy",
    "titleEn": "Mission 22: Dinajpur Ruby Canopy",
    "subtitleBn": "অধ্যায় ৪: দিনাজপুর লিচু বাগান — Extinguish 10 Spiced Sugar Fire Barriers and harvest 35 Ruby Litchis to raise the treehouse rope ladder.",
    "subtitleEn": "A Sizzling Caramel Salamander is scampering along the treehouse ropes, dropping hot sugar sparks that threaten to singe Mochi's ladder!",
    "storyTipBn": "টার্ন-ভিত্তিক (29 চালে জিততে হবে, সময়ের তাড়া নেই!) (Classic Candy-Crush-Chocolate containment cadence: dousing just 1 ember per turn freezes the entire fire network's expansion!)",
    "storyTipEn": "Twist: Classic Candy-Crush-Chocolate containment cadence: dousing just 1 ember per turn freezes the entire fire network's expansion!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 29,
    "dangerSpeed": 0,
    "initialMarbles": 0,
    "drainColumns": [],
    "themePalette": {
      "sky": "#2b0d1a",
      "wall": "#4c142c",
      "pillar": "#fb7185",
      "tray": "#e11d48"
    },
    "tasks": [
      {
        "kind": "color_target",
        "targetColor": "green",
        "target": 22,
        "labelBn": "পেয়ারা ক্যান্ডি",
        "labelEn": "Guava Crisps",
        "icon": "🍏"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "ব্রিজ বক্স ভাঙো",
        "labelEn": "Plank Crates",
        "icon": "🪵"
      }
    ],
    "initialCells": [
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 3,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 4,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 2,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 5,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 4,
        "special": "wrapped",
        "color": "green"
      }
    ]
  },
  {
    "id": 23,
    "chapterNumber": 4,
    "chapterTitleEn": "Ch 4: Litchi Orchard Escape",
    "chapterTitleBn": "অধ্যায় ৪: দিনাজপুর লিচু বাগান",
    "zoneEn": "Sky-Glider Key Sna",
    "zoneBn": "মিশন 23",
    "isBoss": false,
    "scene": "triple_key",
    "titleBn": "মিশন 23: Sky-Glider Key Snatch",
    "titleEn": "Mission 23: Sky-Glider Key Snatch",
    "subtitleBn": "অধ্যায় ৪: দিনাজপুর লিচু বাগান — Drop 3 Treehouse Pulley Keys to the bottom row before the Canopy Gliders lift them back to the top!",
    "subtitleEn": "Two mischievous Canopy Gliders are swooping over the sorting deck trying to snatch Mochi's Treehouse Keys right off the puzzle board!",
    "storyTipBn": "বাতাসের স্রোতে প্রতি চালে ক্যান্ডি পাশে সরে যায়! (Vertical tug-of-war where aerial thieves pull your Keys UPWARD if you ignore their 2-turn warning shadows!)",
    "storyTipEn": "Twist: Vertical tug-of-war where aerial thieves pull your Keys UPWARD if you ignore their 2-turn warning shadows!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.65,
    "initialMarbles": 0,
    "drainColumns": [
      2,
      5
    ],
    "windRows": [
      {
        "row": 2,
        "dir": -1
      }
    ],
    "themePalette": {
      "sky": "#2b0d1a",
      "wall": "#4c142c",
      "pillar": "#fb7185",
      "tray": "#e11d48"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 2,
        "labelBn": "সোনালি চাবি নামাও",
        "labelEn": "Rescue Keys",
        "icon": "🗝️"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Bamboo Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 5,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 3,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 7,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 3,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 7,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 24,
    "chapterNumber": 4,
    "chapterTitleEn": "Ch 4: Litchi Orchard Escape",
    "chapterTitleBn": "অধ্যায় ৪: দিনাজপুর লিচু বাগান",
    "zoneEn": "Juice-Press Piston",
    "zoneBn": "মিশন 24",
    "isBoss": false,
    "scene": "boulder_run",
    "titleBn": "মিশন 24: Juice-Press Piston Alley",
    "titleEn": "Mission 24: Juice-Press Piston Alley",
    "subtitleBn": "অধ্যায় ৪: দিনাজপুর লিচু বাগান — Hit the 2 Brass Crusher Gear-Switches 3 times each (6 hits total) with Special blasts and break 8 Iron Chains.",
    "subtitleEn": "Mochi slipped onto the sorting conveyor headed toward two rhythmic Sugar-Mill Piston Crushers—jam their gears before they Cycle!",
    "storyTipBn": "টার্ন-ভিত্তিক (26 চালে জিততে হবে, সময়ের তাড়া নেই!) (Risk-reward columns: Columns 2 and 5 are where you MUST fire Specials, yet leaving an unpopped Special resting there for 1 turn gets it crushed!)",
    "storyTipEn": "Twist: Risk-reward columns: Columns 2 and 5 are where you MUST fire Specials, yet leaving an unpopped Special resting there for 1 turn gets it crushed!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 26,
    "dangerSpeed": 0,
    "initialMarbles": 0,
    "drainColumns": [],
    "themePalette": {
      "sky": "#2b0d1a",
      "wall": "#4c142c",
      "pillar": "#fb7185",
      "tray": "#e11d48"
    },
    "tasks": [
      {
        "kind": "chains",
        "target": 8,
        "labelBn": "লোহার চেইন ভাঙো",
        "labelEn": "Snap Chains",
        "icon": "⛓️"
      },
      {
        "kind": "specials",
        "target": 4,
        "labelBn": "পাওয়ার কম্বো ফাটাও",
        "labelEn": "Fire Specials",
        "icon": "💥"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "blocker": "chain"
      },
      {
        "row": 1,
        "col": 5,
        "blocker": "chain"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "chain"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "chain"
      },
      {
        "row": 3,
        "col": 3,
        "blocker": "chain"
      },
      {
        "row": 3,
        "col": 4,
        "blocker": "chain"
      },
      {
        "row": 4,
        "col": 2,
        "blocker": "chain"
      },
      {
        "row": 4,
        "col": 5,
        "blocker": "chain"
      },
      {
        "row": 0,
        "col": 3,
        "special": "striped_h",
        "color": "red"
      }
    ]
  },
  {
    "id": 25,
    "chapterNumber": 4,
    "chapterTitleEn": "Ch 4: Litchi Orchard Escape",
    "chapterTitleBn": "অধ্যায় ৪: দিনাজপুর লিচু বাগান",
    "zoneEn": "Sizzling Syrup Cau",
    "zoneBn": "মিশন 25",
    "isBoss": false,
    "scene": "lava_bridge",
    "titleBn": "মিশন 25: Sizzling Syrup Cauldron Crossing",
    "titleEn": "Mission 25: Sizzling Syrup Cauldron Crossing",
    "subtitleBn": "অধ্যায় ৪: দিনাজপুর লিচু বাগান — Extinguish 8 Fire Barriers, wash 8 Sticky Slimes, and build 4 Bridge Spans (36 Litchi/Jackfruit candies).",
    "subtitleEn": "Both a Caramel Salamander and a Slime Blob are sabotaging Mochi's suspension bridge from opposite ends—fire AND slime collide on one board!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Opposing hazards (`Fire` vs `Slime`) can be intentionally steered together to trigger beneficial 3x3 Steam Burst board clears!)",
    "storyTipEn": "Twist: Opposing hazards (`Fire` vs `Slime`) can be intentionally steered together to trigger beneficial 3x3 Steam Burst board clears!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.9,
    "initialMarbles": 0,
    "drainColumns": [],
    "themePalette": {
      "sky": "#2b0d1a",
      "wall": "#4c142c",
      "pillar": "#fb7185",
      "tray": "#e11d48"
    },
    "tasks": [
      {
        "kind": "color_target",
        "targetColor": "yellow",
        "target": 22,
        "labelBn": "হিমসাগর আম ক্যান্ডি",
        "labelEn": "Mango Candies",
        "icon": "🥭"
      },
      {
        "kind": "slime",
        "target": 6,
        "labelBn": "আঠালো স্লাইম ধোও",
        "labelEn": "Clean Slime",
        "icon": "🧪"
      }
    ],
    "initialCells": [
      {
        "row": 2,
        "col": 2,
        "blocker": "slime"
      },
      {
        "row": 2,
        "col": 5,
        "blocker": "slime"
      },
      {
        "row": 3,
        "col": 3,
        "blocker": "slime"
      },
      {
        "row": 3,
        "col": 4,
        "blocker": "slime"
      },
      {
        "row": 4,
        "col": 1,
        "blocker": "slime"
      },
      {
        "row": 4,
        "col": 6,
        "blocker": "slime"
      },
      {
        "row": 1,
        "col": 4,
        "special": "wrapped",
        "color": "yellow"
      }
    ]
  },
  {
    "id": 26,
    "chapterNumber": 4,
    "chapterTitleEn": "Ch 4: Litchi Orchard Escape",
    "chapterTitleBn": "অধ্যায় ৪: দিনাজপুর লিচু বাগান",
    "zoneEn": "Captain Clamp's Cr",
    "zoneBn": "মিশন 26",
    "isBoss": true,
    "scene": "boss_lair",
    "titleBn": "মিশন 26: BOSS: Captain Clamp's Crab-Sub",
    "titleEn": "Mission 26: BOSS: Captain Clamp's Crab-Sub",
    "subtitleBn": "অধ্যায় ৪: দিনাজপুর লিচু বাগান — Unlock both Claw Brass Trunks (cols 1 & 6), drop 2 Dock Release Keys, and deplete Captain Clamp's 160 HP hull.",
    "subtitleEn": "BOSS ENCOUNTER 2! Captain Clamp's Brass Crab-Sub has locked both mechanical pincers onto Mochi's river-pier while launching Glider drones overhead!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Two-step armor puzzle: color-matching Brass Trunks disables the Boss's mechanical pincers first so explosive combos deal massive hull damage in Phase 2!)",
    "storyTipEn": "Twist: Two-step armor puzzle: color-matching Brass Trunks disables the Boss's mechanical pincers first so explosive combos deal massive hull damage in Phase 2!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.55,
    "initialMarbles": 67,
    "drainColumns": [
      0,
      1,
      6,
      7
    ],
    "themePalette": {
      "sky": "#2b0d1a",
      "wall": "#4c142c",
      "pillar": "#fb7185",
      "tray": "#e11d48"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 2,
        "labelBn": "বস তালা চাবি",
        "labelEn": "Boss Keys",
        "icon": "👑"
      },
      {
        "kind": "marbles",
        "target": 67,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "cannon_charge",
        "target": 54,
        "labelBn": "রেইনবো ক্যানন চার্জ",
        "labelEn": "Boss Cannon",
        "icon": "🌈"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 2,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 5,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 3,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 4,
        "blocker": "ice_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "slime"
      },
      {
        "row": 3,
        "col": 5,
        "blocker": "slime"
      },
      {
        "row": 1,
        "col": 3,
        "special": "striped_v",
        "color": "orange"
      }
    ]
  },
  {
    "id": 27,
    "chapterNumber": 5,
    "chapterTitleEn": "Ch 5: Riverside Candy Market",
    "chapterTitleBn": "অধ্যায় ৫: নদীতীরের মিষ্টি বাজার",
    "zoneEn": "Padma Ferry Lanter",
    "zoneBn": "মিশন 27",
    "isBoss": false,
    "scene": "lava_bridge",
    "titleBn": "মিশন 27: Padma Ferry Lantern Crossing",
    "titleEn": "Mission 27: Padma Ferry Lantern Crossing",
    "subtitleBn": "অধ্যায় ৫: নদীতীরের মিষ্টি বাজার — Row Mochi's Country-Boat Ferry 100m across the channel by matching 40 Coconut/Jamun river candies and clearing 6 Bamboo Cages.",
    "subtitleEn": "Mochi hops aboard a painted country-boat ferry to reach the Sweet Market pier, but river currents gently tug the boat backward unless you row with matches!",
    "storyTipBn": "টার্ন-ভিত্তিক (28 চালে জিততে হবে, সময়ের তাড়া নেই!) (Tug-of-war river ferry propulsion boosted by Jilapi spiral relay nodes on the board!)",
    "storyTipEn": "Twist: Tug-of-war river ferry propulsion boosted by Jilapi spiral relay nodes on the board!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 28,
    "dangerSpeed": 0,
    "initialMarbles": 0,
    "drainColumns": [],
    "themePalette": {
      "sky": "#1e1633",
      "wall": "#38235c",
      "pillar": "#fb923c",
      "tray": "#f59e0b"
    },
    "tasks": [
      {
        "kind": "color_target",
        "targetColor": "green",
        "target": 25,
        "labelBn": "পেয়ারা ক্যান্ডি",
        "labelEn": "Guava Crisps",
        "icon": "🍏"
      },
      {
        "kind": "slime",
        "target": 6,
        "labelBn": "আঠালো স্লাইম ধোও",
        "labelEn": "Clean Slime",
        "icon": "🧪"
      }
    ],
    "initialCells": [
      {
        "row": 2,
        "col": 2,
        "blocker": "slime"
      },
      {
        "row": 2,
        "col": 5,
        "blocker": "slime"
      },
      {
        "row": 3,
        "col": 3,
        "blocker": "slime"
      },
      {
        "row": 3,
        "col": 4,
        "blocker": "slime"
      },
      {
        "row": 4,
        "col": 1,
        "blocker": "slime"
      },
      {
        "row": 4,
        "col": 6,
        "blocker": "slime"
      },
      {
        "row": 1,
        "col": 4,
        "special": "wrapped",
        "color": "green"
      }
    ]
  },
  {
    "id": 28,
    "chapterNumber": 5,
    "chapterTitleEn": "Ch 5: Riverside Candy Market",
    "chapterTitleBn": "অধ্যায় ৫: নদীতীরের মিষ্টি বাজার",
    "zoneEn": "Rasgulla Cushion B",
    "zoneBn": "মিশন 28",
    "isBoss": false,
    "scene": "spiral_marble",
    "titleBn": "মিশন 28: Rasgulla Cushion Bazaar",
    "titleEn": "Mission 28: Rasgulla Cushion Bazaar",
    "subtitleBn": "অধ্যায় ৫: নদীতীরের মিষ্টি বাজার — Collect 25 Spongy Rasgulla Orbs, unlock 2 Brass Sweet Trunks, and clear 8 Ice-chilled pots.",
    "subtitleEn": "Falling wooden crates from an overloaded pushcart are tumbling down the bazaar steps—Mochi needs bouncy Rasgulla cushions to hop safely across!",
    "storyTipBn": "টার্ন-ভিত্তিক (27 চালে জিততে হবে, সময়ের তাড়া নেই!) (Side-alcove board pockets challenge players to snipe horizontally across gaps while racing Golla-Gulp for Rasgulla orbs.)",
    "storyTipEn": "Twist: Side-alcove board pockets challenge players to snipe horizontally across gaps while racing Golla-Gulp for Rasgulla orbs.",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 27,
    "dangerSpeed": 0,
    "initialMarbles": 60,
    "drainColumns": [
      0,
      1,
      2
    ],
    "themePalette": {
      "sky": "#1e1633",
      "wall": "#38235c",
      "pillar": "#fb923c",
      "tray": "#f59e0b"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 60,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Break Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 0,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 2,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 29,
    "chapterNumber": 5,
    "chapterTitleEn": "Ch 5: Riverside Candy Market",
    "chapterTitleBn": "অধ্যায় ৫: নদীতীরের মিষ্টি বাজার",
    "zoneEn": "Roly-Poly Cobblest",
    "zoneBn": "মিশন 29",
    "isBoss": false,
    "scene": "spiral_marble",
    "titleBn": "মিশন 29: Roly-Poly Cobblestone Ramp",
    "titleEn": "Mission 29: Roly-Poly Cobblestone Ramp",
    "subtitleBn": "অধ্যায় ৫: নদীতীরের মিষ্টি বাজার — Drain 65 Bazaar Marbles and break 10 Wrought Metal Chains while knocking back the Jawbreaker Pangolin during its uncurled window.",
    "subtitleEn": "Meet the Armored Jawbreaker Pangolin! It curls into an unstoppable rainbow ball down the cobblestone lane, then uncurls to catch its breath!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Introduces armored stance-switching: teaches players to stockpile Special Candies on the board and unleash them in synchronized burst windows!)",
    "storyTipEn": "Twist: Introduces armored stance-switching: teaches players to stockpile Special Candies on the board and unleash them in synchronized burst windows!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.85,
    "initialMarbles": 60,
    "drainColumns": [
      0,
      1,
      2
    ],
    "themePalette": {
      "sky": "#1e1633",
      "wall": "#38235c",
      "pillar": "#fb923c",
      "tray": "#f59e0b"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 60,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Break Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 0,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 2,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 30,
    "chapterNumber": 5,
    "chapterTitleEn": "Ch 5: Riverside Candy Market",
    "chapterTitleBn": "অধ্যায় ৫: নদীতীরের মিষ্টি বাজার",
    "zoneEn": "Closing Warehouse ",
    "zoneBn": "মিশন 30",
    "isBoss": false,
    "scene": "triple_key",
    "titleBn": "মিশন 30: Closing Warehouse Shutter!",
    "titleEn": "Mission 30: Closing Warehouse Shutter!",
    "subtitleBn": "অধ্যায় ৫: নদীতীরের মিষ্টি বাজার — Keep the Timed Blast Shutter >= 35% open while dropping 3 Granary Keys to sprint Mochi through the doorway!",
    "subtitleEn": "The bazaar curfew bell rang! The heavy Bronze Sluice Shutter starts WIDE OPEN and is steadily closing—Mochi must sprint down the aisle before it seals!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Inverts the classic gate formula—the exit starts open and is actively closing, demanding dual focus on counterweight cranking and key dropping!)",
    "storyTipEn": "Twist: Inverts the classic gate formula—the exit starts open and is actively closing, demanding dual focus on counterweight cranking and key dropping!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 2,
    "initialMarbles": 0,
    "drainColumns": [
      2,
      5
    ],
    "themePalette": {
      "sky": "#1e1633",
      "wall": "#38235c",
      "pillar": "#fb923c",
      "tray": "#f59e0b"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 2,
        "labelBn": "সোনালি চাবি নামাও",
        "labelEn": "Rescue Keys",
        "icon": "🗝️"
      },
      {
        "kind": "ice",
        "target": 8,
        "labelBn": "বরফ সিল ভাঙো",
        "labelEn": "Break Ice",
        "icon": "🧊"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 5,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 5,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "ice_1"
      },
      {
        "row": 4,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 4,
        "col": 3,
        "blocker": "ice_1"
      },
      {
        "row": 4,
        "col": 4,
        "blocker": "ice_1"
      },
      {
        "row": 4,
        "col": 5,
        "blocker": "ice_1"
      }
    ]
  },
  {
    "id": 31,
    "chapterNumber": 5,
    "chapterTitleEn": "Ch 5: Riverside Candy Market",
    "chapterTitleBn": "অধ্যায় ৫: নদীতীরের মিষ্টি বাজার",
    "zoneEn": "Midnight Lantern R",
    "zoneBn": "মিশন 31",
    "isBoss": false,
    "scene": "boulder_run",
    "titleBn": "মিশন 31: Midnight Lantern Regatta",
    "titleEn": "Mission 31: Midnight Lantern Regatta",
    "subtitleBn": "অধ্যায় ৫: নদীতীরের মিষ্টি বাজার — Align 3 Ferry Pontoons (45 River Candies), extinguish 8 Fire Embers, and detonate 5 Special Candies before the steamer gangway closes!",
    "subtitleEn": "Chapter 5 Finale! Mochi must hop across three Moving Ferry Pontoons while a Caramel Salamander, Jawbreaker Pangolin, and Closing Gangway Shutter converge!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Three-stage milestone checkpoints where each Mochi hop triggers a celebratory board-wide bottom-row ember sweep!)",
    "storyTipEn": "Twist: Three-stage milestone checkpoints where each Mochi hop triggers a celebratory board-wide bottom-row ember sweep!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.75,
    "initialMarbles": 0,
    "drainColumns": [],
    "themePalette": {
      "sky": "#1e1633",
      "wall": "#38235c",
      "pillar": "#fb923c",
      "tray": "#f59e0b"
    },
    "tasks": [
      {
        "kind": "chains",
        "target": 8,
        "labelBn": "লোহার চেইন ভাঙো",
        "labelEn": "Snap Chains",
        "icon": "⛓️"
      },
      {
        "kind": "specials",
        "target": 4,
        "labelBn": "পাওয়ার কম্বো ফাটাও",
        "labelEn": "Fire Specials",
        "icon": "💥"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "blocker": "chain"
      },
      {
        "row": 1,
        "col": 5,
        "blocker": "chain"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "chain"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "chain"
      },
      {
        "row": 3,
        "col": 3,
        "blocker": "chain"
      },
      {
        "row": 3,
        "col": 4,
        "blocker": "chain"
      },
      {
        "row": 4,
        "col": 2,
        "blocker": "chain"
      },
      {
        "row": 4,
        "col": 5,
        "blocker": "chain"
      },
      {
        "row": 0,
        "col": 3,
        "special": "striped_h",
        "color": "red"
      }
    ]
  },
  {
    "id": 32,
    "chapterNumber": 6,
    "chapterTitleEn": "Ch 6: Tropical Island Survival",
    "chapterTitleBn": "অধ্যায় ৬: সেন্ট মার্টিন দ্বীপ",
    "zoneEn": "St. Martin's Coral",
    "zoneBn": "মিশন 32",
    "isBoss": false,
    "scene": "spiral_marble",
    "titleBn": "মিশন 32: St. Martin's Coral Ricochet",
    "titleEn": "Mission 32: St. Martin's Coral Ricochet",
    "subtitleBn": "অধ্যায় ৬: সেন্ট মার্টিন দ্বীপ — Crack 4 Armored Coconut Husk Bumpers (12 hits) and pop 3 Corner Coral Locks using deflected Striped lasers.",
    "subtitleEn": "Mochi lands on a sunny coral sandbar, but her beach-cabana bridge lock sits around a solid coral corner—bank Striped lasers off angled Coconut Husk Bumpers to hit it!",
    "storyTipBn": "টার্ন-ভিত্তিক (30 চালে জিততে হবে, সময়ের তাড়া নেই!) (Billiard-style 90-degree laser reflection lets players snipe tucked-away locks around indestructible coral walls!)",
    "storyTipEn": "Twist: Billiard-style 90-degree laser reflection lets players snipe tucked-away locks around indestructible coral walls!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 30,
    "dangerSpeed": 0,
    "initialMarbles": 62,
    "drainColumns": [
      0,
      1,
      2
    ],
    "themePalette": {
      "sky": "#072236",
      "wall": "#0e4166",
      "pillar": "#38bdf8",
      "tray": "#0284c7"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 62,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Break Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 0,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 2,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 33,
    "chapterNumber": 6,
    "chapterTitleEn": "Ch 6: Tropical Island Survival",
    "chapterTitleBn": "অধ্যায় ৬: সেন্ট মার্টিন দ্বীপ",
    "zoneEn": "Tidepool Slime Lag",
    "zoneBn": "মিশন 33",
    "isBoss": false,
    "scene": "spiral_marble",
    "titleBn": "মিশন 33: Tidepool Slime Lagoon",
    "titleEn": "Mission 33: Tidepool Slime Lagoon",
    "subtitleBn": "অধ্যায় ৬: সেন্ট মার্টিন দ্বীপ — Wash away 14 Sticky Slime tiles and drain 65 Lagoon Marbles to raise the driftwood causeway.",
    "subtitleEn": "Twin Gur-Slime Blobs are oozing across the tidepool stepping posts while Coconut Husk Bumpers guard the lagoon drains!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Elemental beam upgrade: reflecting a Coconut-colored Striped laser off a Coconut Bumper turns it into a Slime-erasing Hydro Jet!)",
    "storyTipEn": "Twist: Elemental beam upgrade: reflecting a Coconut-colored Striped laser off a Coconut Bumper turns it into a Slime-erasing Hydro Jet!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.8,
    "initialMarbles": 62,
    "drainColumns": [
      0,
      1,
      2
    ],
    "themePalette": {
      "sky": "#072236",
      "wall": "#0e4166",
      "pillar": "#38bdf8",
      "tray": "#0284c7"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 62,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Break Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 0,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 2,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 34,
    "chapterNumber": 6,
    "chapterTitleEn": "Ch 6: Tropical Island Survival",
    "chapterTitleBn": "অধ্যায় ৬: সেন্ট মার্টিন দ্বীপ",
    "zoneEn": "Jawbreaker Beach P",
    "zoneBn": "মিশন 34",
    "isBoss": false,
    "scene": "triple_key",
    "titleBn": "মিশন 34: Jawbreaker Beach Pinball",
    "titleEn": "Mission 34: Jawbreaker Beach Pinball",
    "subtitleBn": "অধ্যায় ৬: সেন্ট মার্টিন দ্বীপ — Collect 28 Spongy Rasgulla Orbs, drop 2 Cabana Keys, and shatter the Spiked Boulder (3 Special hits).",
    "subtitleEn": "A Spiked Jawbreaker Boulder AND an Armored Jawbreaker Pangolin are rolling down the boardwalk ramp behind Mochi—bounce them back!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Arena pinball physics: bouncing the lead Pangolin makes it collide with the trailing Spiked Boulder for chain-reaction damage!)",
    "storyTipEn": "Twist: Arena pinball physics: bouncing the lead Pangolin makes it collide with the trailing Spiked Boulder for chain-reaction damage!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.95,
    "initialMarbles": 0,
    "drainColumns": [
      2,
      5
    ],
    "themePalette": {
      "sky": "#072236",
      "wall": "#0e4166",
      "pillar": "#38bdf8",
      "tray": "#0284c7"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 2,
        "labelBn": "সোনালি চাবি নামাও",
        "labelEn": "Rescue Keys",
        "icon": "🗝️"
      },
      {
        "kind": "ice",
        "target": 8,
        "labelBn": "বরফ সিল ভাঙো",
        "labelEn": "Break Ice",
        "icon": "🧊"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 5,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 5,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "ice_1"
      },
      {
        "row": 4,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 4,
        "col": 3,
        "blocker": "ice_1"
      },
      {
        "row": 4,
        "col": 4,
        "blocker": "ice_1"
      },
      {
        "row": 4,
        "col": 5,
        "blocker": "ice_1"
      }
    ]
  },
  {
    "id": 35,
    "chapterNumber": 6,
    "chapterTitleEn": "Ch 6: Tropical Island Survival",
    "chapterTitleBn": "অধ্যায় ৬: সেন্ট মার্টিন দ্বীপ",
    "zoneEn": "Cyclone Breeze San",
    "zoneBn": "মিশন 35",
    "isBoss": false,
    "scene": "boulder_run",
    "titleBn": "মিশন 35: Cyclone Breeze Sandbar",
    "titleEn": "Mission 35: Cyclone Breeze Sandbar",
    "subtitleBn": "অধ্যায় ৬: সেন্ট মার্টিন দ্বীপ — Keep the Lighthouse Shutter >= 40% open, unlock 2 Brass Signal Trunks, and break 10 Iron Chains.",
    "subtitleEn": "Brisk island crosswinds are shifting candies sideways while a Closing Lighthouse Door slowly descends ahead of Mochi's zip-trolley!",
    "storyTipBn": "বাতাসের স্রোতে প্রতি চালে ক্যান্ডি পাশে সরে যায়! (Opposing left/right wind conveyor rows create a circular candy carousel around stationary color-locked chests!)",
    "storyTipEn": "Twist: Opposing left/right wind conveyor rows create a circular candy carousel around stationary color-locked chests!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "hybrid",
    "moveLimit": 25,
    "dangerSpeed": 1.45,
    "initialMarbles": 0,
    "drainColumns": [],
    "windRows": [
      {
        "row": 1,
        "dir": -1
      },
      {
        "row": 5,
        "dir": 1
      }
    ],
    "themePalette": {
      "sky": "#072236",
      "wall": "#0e4166",
      "pillar": "#38bdf8",
      "tray": "#0284c7"
    },
    "tasks": [
      {
        "kind": "chains",
        "target": 8,
        "labelBn": "লোহার চেইন ভাঙো",
        "labelEn": "Snap Chains",
        "icon": "⛓️"
      },
      {
        "kind": "specials",
        "target": 4,
        "labelBn": "পাওয়ার কম্বো ফাটাও",
        "labelEn": "Fire Specials",
        "icon": "💥"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "blocker": "chain"
      },
      {
        "row": 1,
        "col": 5,
        "blocker": "chain"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "chain"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "chain"
      },
      {
        "row": 3,
        "col": 3,
        "blocker": "chain"
      },
      {
        "row": 3,
        "col": 4,
        "blocker": "chain"
      },
      {
        "row": 4,
        "col": 2,
        "blocker": "chain"
      },
      {
        "row": 4,
        "col": 5,
        "blocker": "chain"
      },
      {
        "row": 0,
        "col": 3,
        "special": "striped_h",
        "color": "red"
      }
    ]
  },
  {
    "id": 36,
    "chapterNumber": 6,
    "chapterTitleEn": "Ch 6: Tropical Island Survival",
    "chapterTitleBn": "অধ্যায় ৬: সেন্ট মার্টিন দ্বীপ",
    "zoneEn": "Maharaja Gulp's La",
    "zoneBn": "মিশন 36",
    "isBoss": true,
    "scene": "boss_lair",
    "titleBn": "মিশন 36: BOSS: Maharaja Gulp's Lagoon Barge",
    "titleEn": "Mission 36: BOSS: Maharaja Gulp's Lagoon Barge",
    "subtitleBn": "অধ্যায় ৬: সেন্ট মার্টিন দ্বীপ — Deplete Maharaja Gulp's 200 HP appetite bar by banking lasers off 4 Coconut Bumpers and feeding 5 Special Candies into his Mega-Slurp beam!",
    "subtitleEn": "BOSS ENCOUNTER 3! Maharaja Gulp activates his vacuum-slurp horn, pulling whole rows of island candies—and Mochi's raft!—toward his banquet barge!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Inverts normal match-3 habits: you intentionally LEAVE Special Candies unpopped in telegraphed boss columns so the boss swallows them for massive stun damage!)",
    "storyTipEn": "Twist: Inverts normal match-3 habits: you intentionally LEAVE Special Candies unpopped in telegraphed boss columns so the boss swallows them for massive stun damage!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.55,
    "initialMarbles": 73,
    "drainColumns": [
      0,
      1,
      6,
      7
    ],
    "themePalette": {
      "sky": "#072236",
      "wall": "#0e4166",
      "pillar": "#38bdf8",
      "tray": "#0284c7"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 2,
        "labelBn": "বস তালা চাবি",
        "labelEn": "Boss Keys",
        "icon": "👑"
      },
      {
        "kind": "marbles",
        "target": 73,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "cannon_charge",
        "target": 60,
        "labelBn": "রেইনবো ক্যানন চার্জ",
        "labelEn": "Boss Cannon",
        "icon": "🌈"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 2,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 5,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 3,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 4,
        "blocker": "ice_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "slime"
      },
      {
        "row": 3,
        "col": 5,
        "blocker": "slime"
      },
      {
        "row": 1,
        "col": 3,
        "special": "striped_v",
        "color": "orange"
      }
    ]
  },
  {
    "id": 37,
    "chapterNumber": 7,
    "chapterTitleEn": "Ch 7: Monsoon River Rescue",
    "chapterTitleBn": "অধ্যায় ৭: বর্ষার নদী রেসকিউ",
    "zoneEn": "Meghna Upside-Down",
    "zoneBn": "মিশন 37",
    "isBoss": false,
    "scene": "spiral_marble",
    "titleBn": "মিশন 37: Meghna Upside-Down Tide!",
    "titleEn": "Mission 37: Meghna Upside-Down Tide!",
    "subtitleBn": "অধ্যায় ৭: বর্ষার নদী রেসকিউ — Collect 36 Buoyant Barisal Guavas and 24 Monsoon Jamuns while mastering the Dual-Gravity Flood Line!",
    "subtitleEn": "Monsoon rains have submerged the bottom 3 rows of the puzzle board in crystal river water—making submerged candies float UPWARD instead of falling down!",
    "storyTipBn": "টার্ন-ভিত্তিক (29 চালে জিততে হবে, সময়ের তাড়া নেই!) (Dual-gravity horizon: top half falls downward while submerged bottom half floats upward, colliding at the central waterline!)",
    "storyTipEn": "Twist: Dual-gravity horizon: top half falls downward while submerged bottom half floats upward, colliding at the central waterline!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 29,
    "dangerSpeed": 0,
    "initialMarbles": 64,
    "drainColumns": [
      0,
      1,
      2
    ],
    "submergedFromRow": 4,
    "themePalette": {
      "sky": "#091a38",
      "wall": "#153161",
      "pillar": "#22d3ee",
      "tray": "#0ea5e9"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 64,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Break Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 0,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 2,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 38,
    "chapterNumber": 7,
    "chapterTitleEn": "Ch 7: Monsoon River Rescue",
    "chapterTitleBn": "অধ্যায় ৭: বর্ষার নদী রেসকিউ",
    "zoneEn": "Whirlpool Eel Ferr",
    "zoneBn": "মিশন 38",
    "isBoss": false,
    "scene": "lava_bridge",
    "titleBn": "মিশন 38: Whirlpool Eel Ferry Spin",
    "titleEn": "Mission 38: Whirlpool Eel Ferry Spin",
    "subtitleBn": "অধ্যায় ৭: বর্ষার নদী রেসকিউ — Propel Mochi's Sampan 120m to the stone ghat and free 8 Chained Buoy-Candies.",
    "subtitleEn": "A Swirling River-Current Eel is spinning mini-whirlpools around Mochi's sampan—rotating 2x2 blocks of candies clockwise every 2 turns!",
    "storyTipBn": "টার্ন-ভিত্তিক (27 চালে জিততে হবে, সময়ের তাড়া নেই!) (Predictable clockwise 2x2 whirlpool tile rotations let clever players engineer hands-free end-of-turn combos!)",
    "storyTipEn": "Twist: Predictable clockwise 2x2 whirlpool tile rotations let clever players engineer hands-free end-of-turn combos!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 27,
    "dangerSpeed": 0,
    "initialMarbles": 0,
    "drainColumns": [],
    "submergedFromRow": 4,
    "themePalette": {
      "sky": "#091a38",
      "wall": "#153161",
      "pillar": "#22d3ee",
      "tray": "#0ea5e9"
    },
    "tasks": [
      {
        "kind": "color_target",
        "targetColor": "blue",
        "target": 31,
        "labelBn": "ডাব ক্যান্ডি",
        "labelEn": "Daab Coconuts",
        "icon": "🥥"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "ব্রিজ বক্স ভাঙো",
        "labelEn": "Plank Crates",
        "icon": "🪵"
      }
    ],
    "initialCells": [
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_2"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "crate_2"
      },
      {
        "row": 3,
        "col": 3,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 4,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 2,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 5,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 4,
        "special": "wrapped",
        "color": "blue"
      }
    ]
  },
  {
    "id": 39,
    "chapterNumber": 7,
    "chapterTitleEn": "Ch 7: Monsoon River Rescue",
    "chapterTitleBn": "অধ্যায় ৭: বর্ষার নদী রেসকিউ",
    "zoneEn": "Buoyant Key Flotat",
    "zoneBn": "মিশন 39",
    "isBoss": false,
    "scene": "triple_key",
    "titleBn": "মিশন 39: Buoyant Key Flotation!",
    "titleEn": "Mission 39: Buoyant Key Flotation!",
    "subtitleBn": "অধ্যায় ৭: বর্ষার নদী রেসকিউ — Deliver 2 Top Keys DOWN and 2 Submerged Cork-Keys UP into the central Row-3 Sluice Locks!",
    "subtitleEn": "The lower sluice chamber flooded! Because the Cork-Float Keys are buoyant in water, two Keys drop DOWN from the roof while two float UP from the floor toward Row 3!",
    "storyTipBn": "বর্ষার ডুয়াল-গ্র্যাভিটি! নিচের সারির ক্যান্ডি পানিতে ভেসে উপরে ওঠে! (Center-row Key exits fed simultaneously by downward gravity from above and upward buoyancy from below!)",
    "storyTipEn": "Twist: Center-row Key exits fed simultaneously by downward gravity from above and upward buoyancy from below!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.8,
    "initialMarbles": 0,
    "drainColumns": [
      1,
      4,
      6
    ],
    "submergedFromRow": 4,
    "themePalette": {
      "sky": "#091a38",
      "wall": "#153161",
      "pillar": "#22d3ee",
      "tray": "#0ea5e9"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 3,
        "labelBn": "সোনালি চাবি নামাও",
        "labelEn": "Rescue Keys",
        "icon": "🗝️"
      },
      {
        "kind": "crates",
        "target": 3,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Bamboo Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 1,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 6,
        "col": 4,
        "special": "key",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 6,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 3,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 7,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 40,
    "chapterNumber": 7,
    "chapterTitleEn": "Ch 7: Monsoon River Rescue",
    "chapterTitleBn": "অধ্যায় ৭: বর্ষার নদী রেসকিউ",
    "zoneEn": "Firefly Mist Emban",
    "zoneBn": "মিশন 40",
    "isBoss": false,
    "scene": "frost_dual",
    "titleBn": "মিশন 40: Firefly Mist Embankment",
    "titleEn": "Mission 40: Firefly Mist Embankment",
    "subtitleBn": "অধ্যায় ৭: বর্ষার নদী রেসকিউ — Clear 12 Rain-Mist Clouds, lower Floodwater by draining 70 Sluice Marbles, and repair 4 Bridge Planks.",
    "subtitleEn": "Rain-mist hides the puzzle board while rising floodwater pushes Mochi's plank bridge upward against sharp overhead beams—drain the sluice fast!",
    "storyTipBn": "বর্ষার ডুয়াল-গ্র্যাভিটি! নিচের সারির ক্যান্ডি পানিতে ভেসে উপরে ওঠে! (Board physics evolve mid-level: draining marbles physically lowers the waterline row-by-row, flipping submerged rows back to normal downward gravity!)",
    "storyTipEn": "Twist: Board physics evolve mid-level: draining marbles physically lowers the waterline row-by-row, flipping submerged rows back to normal downward gravity!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.9,
    "initialMarbles": 66,
    "drainColumns": [
      2,
      3,
      4,
      5
    ],
    "submergedFromRow": 4,
    "themePalette": {
      "sky": "#091a38",
      "wall": "#153161",
      "pillar": "#22d3ee",
      "tray": "#0ea5e9"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 66,
        "labelBn": "মার্বেল সরাও",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "ice",
        "target": 8,
        "labelBn": "হিমালয় বরফ ভাঙো",
        "labelEn": "Shatter Ice",
        "icon": "❄️"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 1,
        "col": 3,
        "blocker": "ice_1"
      },
      {
        "row": 1,
        "col": 4,
        "blocker": "ice_1"
      },
      {
        "row": 1,
        "col": 5,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 5,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "ice_1"
      }
    ]
  },
  {
    "id": 41,
    "chapterNumber": 7,
    "chapterTitleEn": "Ch 7: Monsoon River Rescue",
    "chapterTitleBn": "অধ্যায় ৭: বর্ষার নদী রেসকিউ",
    "zoneEn": "Great Brahmaputra ",
    "zoneBn": "মিশন 41",
    "isBoss": false,
    "scene": "boulder_run",
    "titleBn": "মিশন 41: Great Brahmaputra Barrage",
    "titleEn": "Mission 41: Great Brahmaputra Barrage",
    "subtitleBn": "অধ্যায় ৭: বর্ষার নদী রেসকিউ — Unlock 3 Brass Turbine Trunks, crank the Timed Flood Shutter >= 50%, and detonate 6 Special Candies.",
    "subtitleEn": "Chapter 7 Finale! Mochi must cross the Great Barrage catwalk by cranking three Floodgates while Whirlpool Eels, Rotating Turbines, and Rising Tides test every river skill!",
    "storyTipBn": "বর্ষার ডুয়াল-গ্র্যাভিটি! নিচের সারির ক্যান্ডি পানিতে ভেসে উপরে ওঠে! (Threading Striped lasers through open Rotating Turbine paddles supercharges the mechanical escape gate!)",
    "storyTipEn": "Twist: Threading Striped lasers through open Rotating Turbine paddles supercharges the mechanical escape gate!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "hybrid",
    "moveLimit": 26,
    "dangerSpeed": 1.45,
    "initialMarbles": 0,
    "drainColumns": [],
    "submergedFromRow": 4,
    "themePalette": {
      "sky": "#091a38",
      "wall": "#153161",
      "pillar": "#22d3ee",
      "tray": "#0ea5e9"
    },
    "tasks": [
      {
        "kind": "chains",
        "target": 8,
        "labelBn": "লোহার চেইন ভাঙো",
        "labelEn": "Snap Chains",
        "icon": "⛓️"
      },
      {
        "kind": "specials",
        "target": 4,
        "labelBn": "পাওয়ার কম্বো ফাটাও",
        "labelEn": "Fire Specials",
        "icon": "💥"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "blocker": "chain"
      },
      {
        "row": 1,
        "col": 5,
        "blocker": "chain"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "chain"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "chain"
      },
      {
        "row": 3,
        "col": 3,
        "blocker": "chain"
      },
      {
        "row": 3,
        "col": 4,
        "blocker": "chain"
      },
      {
        "row": 4,
        "col": 2,
        "blocker": "chain"
      },
      {
        "row": 4,
        "col": 5,
        "blocker": "chain"
      },
      {
        "row": 0,
        "col": 3,
        "special": "striped_h",
        "color": "red"
      }
    ]
  },
  {
    "id": 42,
    "chapterNumber": 8,
    "chapterTitleEn": "Ch 8: Himalayan Foothill Trek",
    "chapterTitleBn": "অধ্যায় ৮: হিমালয় পাদদেশ",
    "zoneEn": "Darjeeling Toy-Tra",
    "zoneBn": "মিশন 42",
    "isBoss": false,
    "scene": "frost_dual",
    "titleBn": "মিশন 42: Darjeeling Toy-Train Trestle",
    "titleEn": "Mission 42: Darjeeling Toy-Train Trestle",
    "subtitleBn": "অধ্যায় ৮: হিমালয় পাদদেশ — Shatter 12 Himalayan Frost Ice blocks and land 4 Color-Matched strikes on the Prism Chameleon to clear the train switch!",
    "subtitleEn": "Welcome to the Foothills! A Foothill Snow-Kulfi Golem is icing the miniature steam-train switch while a Prism Chameleon shifts colors on a pine branch!",
    "storyTipBn": "টার্ন-ভিত্তিক (29 চালে জিততে হবে, সময়ের তাড়া নেই!) (Color-reactive enemy targeting: watching the Chameleon's live crest color tells you which candy color deals knockback on that turn!)",
    "storyTipEn": "Twist: Color-reactive enemy targeting: watching the Chameleon's live crest color tells you which candy color deals knockback on that turn!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 29,
    "dangerSpeed": 0,
    "initialMarbles": 68,
    "drainColumns": [
      2,
      3,
      4,
      5
    ],
    "themePalette": {
      "sky": "#121c3d",
      "wall": "#22346e",
      "pillar": "#93c5fd",
      "tray": "#3b82f6"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 68,
        "labelBn": "মার্বেল সরাও",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "ice",
        "target": 8,
        "labelBn": "হিমালয় বরফ ভাঙো",
        "labelEn": "Shatter Ice",
        "icon": "❄️"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "blocker": "ice_2"
      },
      {
        "row": 1,
        "col": 3,
        "blocker": "ice_2"
      },
      {
        "row": 1,
        "col": 4,
        "blocker": "ice_1"
      },
      {
        "row": 1,
        "col": 5,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 5,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "ice_1"
      }
    ]
  },
  {
    "id": 43,
    "chapterNumber": 8,
    "chapterTitleEn": "Ch 8: Himalayan Foothill Trek",
    "chapterTitleBn": "অধ্যায় ৮: হিমালয় পাদদেশ",
    "zoneEn": "Echoing Sugar-Shal",
    "zoneBn": "মিশন 43",
    "isBoss": false,
    "scene": "triple_key",
    "titleBn": "মিশন 43: Echoing Sugar-Shale Tunnel",
    "titleEn": "Mission 43: Echoing Sugar-Shale Tunnel",
    "subtitleBn": "অধ্যায় ৮: হিমালয় পাদদেশ — Drop 3 Railway Lantern Keys and clear 10 Frost Ice tiles without burying the chutes in Shale Rockfall!",
    "subtitleEn": "Careful with loud blasts! In this echoing tunnel, heavy 3x3 Bombs shake loose Falling Sugar-Shale pebbles from the ceiling—precision Striped lasers are king!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Seismic noise mechanic: explosive 3x3 bombs trigger ceiling rockfalls, elevating clean 4-match Striped surgery over brute blast spam!)",
    "storyTipEn": "Twist: Seismic noise mechanic: explosive 3x3 bombs trigger ceiling rockfalls, elevating clean 4-match Striped surgery over brute blast spam!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.75,
    "initialMarbles": 0,
    "drainColumns": [
      1,
      4,
      6
    ],
    "themePalette": {
      "sky": "#121c3d",
      "wall": "#22346e",
      "pillar": "#93c5fd",
      "tray": "#3b82f6"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 3,
        "labelBn": "সোনালি চাবি নামাও",
        "labelEn": "Rescue Keys",
        "icon": "🗝️"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Bamboo Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 1,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 4,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 6,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 3,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 7,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 3,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 7,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 44,
    "chapterNumber": 8,
    "chapterTitleEn": "Ch 8: Himalayan Foothill Trek",
    "chapterTitleBn": "অধ্যায় ৮: হিমালয় পাদদেশ",
    "zoneEn": "Cable-Car Crosswin",
    "zoneBn": "মিশন 44",
    "isBoss": false,
    "scene": "boulder_run",
    "titleBn": "মিশন 44: Cable-Car Crosswind Gorge",
    "titleEn": "Mission 44: Cable-Car Crosswind Gorge",
    "subtitleBn": "অধ্যায় ৮: হিমালয় পাদদেশ — Jam 2 Tower Piston Crushers (6 hits), break 10 Iron Chains, and drain 65 Gorge Marbles to winch Mochi's cable car to the summit.",
    "subtitleEn": "Mochi's bright red cable car stalled mid-gorge! High ridge gusts blow candies diagonally while a Clockwork Sentinel cranks a Piston Press on the tower!",
    "storyTipBn": "টার্ন-ভিত্তিক (26 চালে জিততে হবে, সময়ের তাড়া নেই!) (Combining Wind Drift with Piston Timing: drifting a Special into a telegraphing Crusher lane jams the hazard hands-free!)",
    "storyTipEn": "Twist: Combining Wind Drift with Piston Timing: drifting a Special into a telegraphing Crusher lane jams the hazard hands-free!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 26,
    "dangerSpeed": 0,
    "initialMarbles": 0,
    "drainColumns": [],
    "windRows": [
      {
        "row": 3,
        "dir": 1
      }
    ],
    "themePalette": {
      "sky": "#121c3d",
      "wall": "#22346e",
      "pillar": "#93c5fd",
      "tray": "#3b82f6"
    },
    "tasks": [
      {
        "kind": "chains",
        "target": 8,
        "labelBn": "লোহার চেইন ভাঙো",
        "labelEn": "Snap Chains",
        "icon": "⛓️"
      },
      {
        "kind": "specials",
        "target": 5,
        "labelBn": "পাওয়ার কম্বো ফাটাও",
        "labelEn": "Fire Specials",
        "icon": "💥"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "blocker": "chain"
      },
      {
        "row": 1,
        "col": 5,
        "blocker": "chain"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "chain"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "chain"
      },
      {
        "row": 3,
        "col": 3,
        "blocker": "chain"
      },
      {
        "row": 3,
        "col": 4,
        "blocker": "chain"
      },
      {
        "row": 4,
        "col": 2,
        "blocker": "chain"
      },
      {
        "row": 4,
        "col": 5,
        "blocker": "chain"
      },
      {
        "row": 0,
        "col": 3,
        "special": "striped_h",
        "color": "red"
      }
    ]
  },
  {
    "id": 45,
    "chapterNumber": 8,
    "chapterTitleEn": "Ch 8: Himalayan Foothill Trek",
    "chapterTitleBn": "অধ্যায় ৮: হিমালয় পাদদেশ",
    "zoneEn": "Thermal Ridge Dual",
    "zoneBn": "মিশন 45",
    "isBoss": false,
    "scene": "frost_dual",
    "titleBn": "মিশন 45: Thermal Ridge Dual-Track",
    "titleEn": "Mission 45: Thermal Ridge Dual-Track",
    "subtitleBn": "অধ্যায় ৮: হিমালয় পাদদেশ — Clear 10 Glacier Ice blocks, extinguish 10 Fire Embers, and unlock 2 Summit Brass Trunks.",
    "subtitleEn": "Fire and Ice! A Snow-Kulfi Golem stomps down the left ice ledge while a Sizzling Caramel Salamander races up the right hot-spring trench!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Asymmetric Fire-and-Ice board halves where cross-shooting lasers across the center divider deals 2x elemental weakness clears!)",
    "storyTipEn": "Twist: Asymmetric Fire-and-Ice board halves where cross-shooting lasers across the center divider deals 2x elemental weakness clears!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.9,
    "initialMarbles": 68,
    "drainColumns": [
      2,
      3,
      4,
      5
    ],
    "themePalette": {
      "sky": "#121c3d",
      "wall": "#22346e",
      "pillar": "#93c5fd",
      "tray": "#3b82f6"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 68,
        "labelBn": "মার্বেল সরাও",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "ice",
        "target": 8,
        "labelBn": "হিমালয় বরফ ভাঙো",
        "labelEn": "Shatter Ice",
        "icon": "❄️"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "blocker": "ice_2"
      },
      {
        "row": 1,
        "col": 3,
        "blocker": "ice_2"
      },
      {
        "row": 1,
        "col": 4,
        "blocker": "ice_1"
      },
      {
        "row": 1,
        "col": 5,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 5,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "ice_1"
      }
    ]
  },
  {
    "id": 46,
    "chapterNumber": 8,
    "chapterTitleEn": "Ch 8: Himalayan Foothill Trek",
    "chapterTitleBn": "অধ্যায় ৮: হিমালয় পাদদেশ",
    "zoneEn": "Kanchen-Frost the ",
    "zoneBn": "মিশন 46",
    "isBoss": true,
    "scene": "boss_lair",
    "titleBn": "মিশন 46: BOSS: Kanchen-Frost the Glacier Colossus",
    "titleEn": "Mission 46: BOSS: Kanchen-Frost the Glacier Colossus",
    "subtitleBn": "অধ্যায় ৮: হিমালয় পাদদেশ — Shatter Kanchen-Frost's 240 HP Glacier Armor by rebounding 3 Boulders (via Rasgulla Orbs) and detonating 4 Warm Jilapi/Special combos!",
    "subtitleEn": "BOSS ENCOUNTER 4! Kanchen-Frost freezes the outer puzzle columns and hurls twin Spiked Jawbreakers down the viaduct—use Rasgulla Trampolines to bounce his boulders right back into his ice armor!",
    "storyTipBn": "বাতাসের স্রোতে প্রতি চালে ক্যান্ডি পাশে সরে যায়! (Boss is immune to Freeze tools—instead you harvest Rasgulla sponge candies to volley his own giant jawbreakers back at him!)",
    "storyTipEn": "Twist: Boss is immune to Freeze tools—instead you harvest Rasgulla sponge candies to volley his own giant jawbreakers back at him!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.6,
    "initialMarbles": 79,
    "drainColumns": [
      0,
      1,
      6,
      7
    ],
    "windRows": [
      {
        "row": 4,
        "dir": 1
      }
    ],
    "themePalette": {
      "sky": "#121c3d",
      "wall": "#22346e",
      "pillar": "#93c5fd",
      "tray": "#3b82f6"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 2,
        "labelBn": "বস তালা চাবি",
        "labelEn": "Boss Keys",
        "icon": "👑"
      },
      {
        "kind": "marbles",
        "target": 79,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "cannon_charge",
        "target": 66,
        "labelBn": "রেইনবো ক্যানন চার্জ",
        "labelEn": "Boss Cannon",
        "icon": "🌈"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 2,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 5,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 3,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 4,
        "blocker": "ice_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "slime"
      },
      {
        "row": 3,
        "col": 5,
        "blocker": "slime"
      },
      {
        "row": 1,
        "col": 3,
        "special": "striped_v",
        "color": "orange"
      }
    ]
  },
  {
    "id": 47,
    "chapterNumber": 9,
    "chapterTitleEn": "Ch 9: Colorful Fruit Festival",
    "chapterTitleBn": "অধ্যায় ৯: রঙিন ফল ও ঘুড়ি উৎসব",
    "zoneEn": "Pinwheel & Prism F",
    "zoneBn": "মিশন 47",
    "isBoss": false,
    "scene": "spiral_marble",
    "titleBn": "মিশন 47: Pinwheel & Prism Fairground",
    "titleEn": "Mission 47: Pinwheel & Prism Fairground",
    "subtitleBn": "অধ্যায় ৯: রঙিন ফল ও ঘুড়ি উৎসব — Fire 5 Prism-Split Laser Bursts to pop 14 Woven Bamboo Cages and unlock Mochi's Kite-Balloon tether!",
    "subtitleEn": "Welcome to the Harvest Carnival! Sparkling Refracting Quartz Prisms sit on the fairground board—hit one with a Striped laser and watch it split into FOUR beams!",
    "storyTipBn": "টার্ন-ভিত্তিক (28 চালে জিততে হবে, সময়ের তাড়া নেই!) (Alternating + and X Refracting Quartz Prisms turn single Striped matches into celebratory full-board geometric laser shows!)",
    "storyTipEn": "Twist: Alternating + and X Refracting Quartz Prisms turn single Striped matches into celebratory full-board geometric laser shows!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 28,
    "dangerSpeed": 0,
    "initialMarbles": 68,
    "drainColumns": [
      0,
      1,
      2
    ],
    "themePalette": {
      "sky": "#290d36",
      "wall": "#4d1663",
      "pillar": "#f472b6",
      "tray": "#ec4899"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 68,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Break Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 0,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 2,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 48,
    "chapterNumber": 9,
    "chapterTitleEn": "Ch 9: Colorful Fruit Festival",
    "chapterTitleBn": "অধ্যায় ৯: রঙিন ফল ও ঘুড়ি উৎসব",
    "zoneEn": "Kite-String Sky Re",
    "zoneBn": "মিশন 48",
    "isBoss": false,
    "scene": "triple_key",
    "titleBn": "মিশন 48: Kite-String Sky Relay",
    "titleEn": "Mission 48: Kite-String Sky Relay",
    "subtitleBn": "অধ্যায় ৯: রঙিন ফল ও ঘুড়ি উৎসব — Drop 4 Kite-Spool Keys, score 4 Color-Matched Chameleon hits, and shatter 2 Honeycomb Seals.",
    "subtitleEn": "Three Canopy Gliders are tangling Mochi's kite-bridge strings while a Prism Chameleon camouflages on the tower flagpole!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Diagonal X-Prism geometry lets one well-timed center shot simultaneously snipe both corner Queen Honeycombs AND shoo Gliders!)",
    "storyTipEn": "Twist: Diagonal X-Prism geometry lets one well-timed center shot simultaneously snipe both corner Queen Honeycombs AND shoo Gliders!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.85,
    "initialMarbles": 0,
    "drainColumns": [
      1,
      4,
      6
    ],
    "themePalette": {
      "sky": "#290d36",
      "wall": "#4d1663",
      "pillar": "#f472b6",
      "tray": "#ec4899"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 3,
        "labelBn": "সোনালি চাবি নামাও",
        "labelEn": "Rescue Keys",
        "icon": "🗝️"
      },
      {
        "kind": "ice",
        "target": 8,
        "labelBn": "বরফ সিল ভাঙো",
        "labelEn": "Break Ice",
        "icon": "🧊"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 1,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 4,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 6,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 5,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "ice_1"
      },
      {
        "row": 4,
        "col": 2,
        "blocker": "ice_1"
      },
      {
        "row": 4,
        "col": 3,
        "blocker": "ice_1"
      },
      {
        "row": 4,
        "col": 4,
        "blocker": "ice_1"
      },
      {
        "row": 4,
        "col": 5,
        "blocker": "ice_1"
      }
    ]
  },
  {
    "id": 49,
    "chapterNumber": 9,
    "chapterTitleEn": "Ch 9: Colorful Fruit Festival",
    "chapterTitleBn": "অধ্যায় ৯: রঙিন ফল ও ঘুড়ি উৎসব",
    "zoneEn": "Ferris-Wheel Turns",
    "zoneBn": "মিশন 49",
    "isBoss": false,
    "scene": "spiral_marble",
    "titleBn": "মিশন 49: Ferris-Wheel Turnstile Waltz",
    "titleEn": "Mission 49: Ferris-Wheel Turnstile Waltz",
    "subtitleBn": "অধ্যায় ৯: রঙিন ফল ও ঘুড়ি উৎসব — Unlock 3 Brass Gondola Trunks and drain 75 Carnival Marbles within 25 strategic moves.",
    "subtitleEn": "Mochi is riding Gondola #1 up to the top exit deck, but four Rotating Pinwheel Gates and a Sliding Terracotta Bar keep rearranging the chutes!",
    "storyTipBn": "টার্ন-ভিত্তিক (25 চালে জিততে হবে, সময়ের তাড়া নেই!) (Grand clockwork puzzle box—every gate, slider, prism, and sentinel moves on exact deterministic turn beats with zero RNG timer panic!)",
    "storyTipEn": "Twist: Grand clockwork puzzle box—every gate, slider, prism, and sentinel moves on exact deterministic turn beats with zero RNG timer panic!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 25,
    "dangerSpeed": 0,
    "initialMarbles": 68,
    "drainColumns": [
      0,
      1,
      2
    ],
    "themePalette": {
      "sky": "#290d36",
      "wall": "#4d1663",
      "pillar": "#f472b6",
      "tray": "#ec4899"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 68,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Break Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 0,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 2,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 50,
    "chapterNumber": 9,
    "chapterTitleEn": "Ch 9: Colorful Fruit Festival",
    "chapterTitleBn": "অধ্যায় ৯: রঙিন ফল ও ঘুড়ি উৎসব",
    "zoneEn": "Grand Jilapi Firew",
    "zoneBn": "মিশন 50",
    "isBoss": false,
    "scene": "boulder_run",
    "titleBn": "মিশন 50: Grand Jilapi Firework Arcade",
    "titleEn": "Mission 50: Grand Jilapi Firework Arcade",
    "subtitleBn": "অধ্যায় ৯: রঙিন ফল ও ঘুড়ি উৎসব — Keep the Stage Shutter >= 45% open, trigger 6 Jilapi Ring Relays, and extinguish 12 Fire Embers!",
    "subtitleEn": "The carnival finale curtain is lowering while a Jawbreaker Pangolin and Molten Salamander put on an unruly pyrotechnic show along Mochi's stage!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Center X-Prism wired to four corner Jilapi Coils rewards timing a single shot for a quadruple chain detonation!)",
    "storyTipEn": "Twist: Center X-Prism wired to four corner Jilapi Coils rewards timing a single shot for a quadruple chain detonation!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.95,
    "initialMarbles": 0,
    "drainColumns": [],
    "themePalette": {
      "sky": "#290d36",
      "wall": "#4d1663",
      "pillar": "#f472b6",
      "tray": "#ec4899"
    },
    "tasks": [
      {
        "kind": "chains",
        "target": 8,
        "labelBn": "লোহার চেইন ভাঙো",
        "labelEn": "Snap Chains",
        "icon": "⛓️"
      },
      {
        "kind": "specials",
        "target": 5,
        "labelBn": "পাওয়ার কম্বো ফাটাও",
        "labelEn": "Fire Specials",
        "icon": "💥"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 2,
        "blocker": "chain"
      },
      {
        "row": 1,
        "col": 5,
        "blocker": "chain"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "chain"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "chain"
      },
      {
        "row": 3,
        "col": 3,
        "blocker": "chain"
      },
      {
        "row": 3,
        "col": 4,
        "blocker": "chain"
      },
      {
        "row": 4,
        "col": 2,
        "blocker": "chain"
      },
      {
        "row": 4,
        "col": 5,
        "blocker": "chain"
      },
      {
        "row": 0,
        "col": 3,
        "special": "striped_h",
        "color": "red"
      }
    ]
  },
  {
    "id": 51,
    "chapterNumber": 9,
    "chapterTitleEn": "Ch 9: Colorful Fruit Festival",
    "chapterTitleBn": "অধ্যায় ৯: রঙিন ফল ও ঘুড়ি উৎসব",
    "zoneEn": "Charkha-Bot the Ca",
    "zoneBn": "মিশন 51",
    "isBoss": true,
    "scene": "boss_lair",
    "titleBn": "মিশন 51: BOSS: Charkha-Bot the Carnival Juggernaut",
    "titleEn": "Mission 51: BOSS: Charkha-Bot the Carnival Juggernaut",
    "subtitleBn": "অধ্যায় ৯: রঙিন ফল ও ঘুড়ি উৎসব — Overload Charkha-Bot's 260 HP dynamo using 4 Double-Special Combos while jamming 2 Piston Crushers and keeping the Escape Shutter >= 40%!",
    "subtitleEn": "BOSS ENCOUNTER 5! Charkha-Bot, the giant brass carnival automaton, has gone haywire—synchronizing two Piston Crushers and a Countdown Shutter to block Mochi's balloon!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Pure combo-crafting boss test: rewards pairing two Special Candies side-by-side to short-circuit heavy clockwork armor!)",
    "storyTipEn": "Twist: Pure combo-crafting boss test: rewards pairing two Special Candies side-by-side to short-circuit heavy clockwork armor!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "hybrid",
    "moveLimit": 26,
    "dangerSpeed": 1.4,
    "initialMarbles": 82,
    "drainColumns": [
      0,
      1,
      6,
      7
    ],
    "themePalette": {
      "sky": "#290d36",
      "wall": "#4d1663",
      "pillar": "#f472b6",
      "tray": "#ec4899"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 2,
        "labelBn": "বস তালা চাবি",
        "labelEn": "Boss Keys",
        "icon": "👑"
      },
      {
        "kind": "marbles",
        "target": 82,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "cannon_charge",
        "target": 69,
        "labelBn": "রেইনবো ক্যানন চার্জ",
        "labelEn": "Boss Cannon",
        "icon": "🌈"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 2,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 5,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 3,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 4,
        "blocker": "ice_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "slime"
      },
      {
        "row": 3,
        "col": 5,
        "blocker": "slime"
      },
      {
        "row": 1,
        "col": 3,
        "special": "striped_v",
        "color": "orange"
      }
    ]
  },
  {
    "id": 52,
    "chapterNumber": 10,
    "chapterTitleEn": "Ch 10: Crystal Jungle Sanctum",
    "chapterTitleBn": "অধ্যায় ১০: ক্রিস্টাল জঙ্গল অভিযান",
    "zoneEn": "Living-Root Geode ",
    "zoneBn": "মিশন 52",
    "isBoss": false,
    "scene": "spiral_marble",
    "titleBn": "মিশন 52: Living-Root Geode Bridge",
    "titleEn": "Mission 52: Living-Root Geode Bridge",
    "subtitleBn": "অধ্যায় ১০: ক্রিস্টাল জঙ্গল অভিযান — Land 5 Side-Flank Laser Hits on the Crystal Sentinel (via Bumpers/Prisms) and collect 36 Tender Coconuts to hydrate the living-root bridge.",
    "subtitleEn": "Final Chapter! A Faceted Crystal Sentinel hovers before the Living-Root Bridge—its front mirror blocks vertical shots, so bank lasers into its unshielded flanks!",
    "storyTipBn": "টার্ন-ভিত্তিক (28 চালে জিততে হবে, সময়ের তাড়া নেই!) (Directional boss-lite shield puzzle: frontal vertical attacks fail, requiring 90-degree lateral bank shots via side bumpers!)",
    "storyTipEn": "Twist: Directional boss-lite shield puzzle: frontal vertical attacks fail, requiring 90-degree lateral bank shots via side bumpers!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 28,
    "dangerSpeed": 0,
    "initialMarbles": 70,
    "drainColumns": [
      0,
      1,
      2
    ],
    "themePalette": {
      "sky": "#160933",
      "wall": "#2d1463",
      "pillar": "#c084fc",
      "tray": "#8b5cf6"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 70,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Break Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 0,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 2,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 53,
    "chapterNumber": 10,
    "chapterTitleEn": "Ch 10: Crystal Jungle Sanctum",
    "chapterTitleBn": "অধ্যায় ১০: ক্রিস্টাল জঙ্গল অভিযান",
    "zoneEn": "Subterranean Mirro",
    "zoneBn": "মিশন 53",
    "isBoss": false,
    "scene": "triple_key",
    "titleBn": "মিশন 53: Subterranean Mirror Waterfall",
    "titleEn": "Mission 53: Subterranean Mirror Waterfall",
    "subtitleBn": "অধ্যায় ১০: ক্রিস্টাল জঙ্গল অভিযান — Converge 4 Crystal Elevator Keys (2 top-down, 2 bottom-up) to Row 3 and land 4 Flank Hits on the Crystal Sentinel!",
    "subtitleEn": "Dual-gravity crystal waters submerge the lower cavern while BOTH a Crystal Sentinel and Whirlpool Eel guard the waterfall elevator!",
    "storyTipBn": "বর্ষার ডুয়াল-গ্র্যাভিটি! নিচের সারির ক্যান্ডি পানিতে ভেসে উপরে ওঠে! (Placing Refracting Prisms right on the Dual-Gravity Waterline creates spectacular self-sustaining cascade fireworks!)",
    "storyTipEn": "Twist: Placing Refracting Prisms right on the Dual-Gravity Waterline creates spectacular self-sustaining cascade fireworks!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.85,
    "initialMarbles": 0,
    "drainColumns": [
      1,
      4,
      6
    ],
    "submergedFromRow": 4,
    "themePalette": {
      "sky": "#160933",
      "wall": "#2d1463",
      "pillar": "#c084fc",
      "tray": "#8b5cf6"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 3,
        "labelBn": "সোনালি চাবি নামাও",
        "labelEn": "Rescue Keys",
        "icon": "🗝️"
      },
      {
        "kind": "crates",
        "target": 3,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Bamboo Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 1,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 6,
        "col": 4,
        "special": "key",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 6,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 3,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 7,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 54,
    "chapterNumber": 10,
    "chapterTitleEn": "Ch 10: Crystal Jungle Sanctum",
    "chapterTitleBn": "অধ্যায় ১০: ক্রিস্টাল জঙ্গল অভিযান",
    "zoneEn": "Kaleidoscope Chame",
    "zoneBn": "মিশন 54",
    "isBoss": false,
    "scene": "spiral_marble",
    "titleBn": "মিশন 54: Kaleidoscope Chameleon Vault",
    "titleEn": "Mission 54: Kaleidoscope Chameleon Vault",
    "subtitleBn": "অধ্যায় ১০: ক্রিস্টাল জঙ্গল অভিযান — Unlock 3 Brass Explorer Trunks, land 6 Color-Synced Chameleon Hits, and clear 10 Glacier Crystal seals in 25 moves!",
    "subtitleEn": "Two Twin Prism Chameleons guard the Explorer Vault while fragile Crystal Shale hangs overhead—use clean laser surgical precision to unlock all three Trunks!",
    "storyTipBn": "টার্ন-ভিত্তিক (25 চালে জিততে হবে, সময়ের তাড়া নেই!) (High-IQ surgical puzzle combining seismic bomb restrictions with overlapping Trunk-and-Chameleon color targeting!)",
    "storyTipEn": "Twist: High-IQ surgical puzzle combining seismic bomb restrictions with overlapping Trunk-and-Chameleon color targeting!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "move_limited",
    "moveLimit": 25,
    "dangerSpeed": 0,
    "initialMarbles": 70,
    "drainColumns": [
      0,
      1,
      2
    ],
    "themePalette": {
      "sky": "#160933",
      "wall": "#2d1463",
      "pillar": "#c084fc",
      "tray": "#8b5cf6"
    },
    "tasks": [
      {
        "kind": "marbles",
        "target": 70,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Break Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 0,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 1,
        "col": 2,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 55,
    "chapterNumber": 10,
    "chapterTitleEn": "Ch 10: Crystal Jungle Sanctum",
    "chapterTitleBn": "অধ্যায় ১০: ক্রিস্টাল জঙ্গল অভিযান",
    "zoneEn": "Gauntlet of the Cr",
    "zoneBn": "মিশন 55",
    "isBoss": false,
    "scene": "triple_key",
    "titleBn": "মিশন 55: Gauntlet of the Crystal Causeway",
    "titleEn": "Mission 55: Gauntlet of the Crystal Causeway",
    "subtitleBn": "অধ্যায় ১০: ক্রিস্টাল জঙ্গল অভিযান — Keep the Sanctuary Shutter >= 45% open, drop 3 Royal Sanctum Keys, drain 80 Crystal Marbles, and land 4 Flank Hits!",
    "subtitleEn": "Penultimate Survival Gauntlet! The Emerald Serpent, Crystal Sentinel, AND Closing Sanctuary Gate converge as Mochi makes her final dash to the Sanctum!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Rube-Goldberg laser circuit where one well-aimed bank shot chains Bumper -> Prism -> Jilapi Coil to advance all 4 objectives at once!)",
    "storyTipEn": "Twist: Rube-Goldberg laser circuit where one well-aimed bank shot chains Bumper -> Prism -> Jilapi Coil to advance all 4 objectives at once!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 2,
    "initialMarbles": 0,
    "drainColumns": [
      1,
      4,
      6
    ],
    "themePalette": {
      "sky": "#160933",
      "wall": "#2d1463",
      "pillar": "#c084fc",
      "tray": "#8b5cf6"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 3,
        "labelBn": "সোনালি চাবি নামাও",
        "labelEn": "Rescue Keys",
        "icon": "🗝️"
      },
      {
        "kind": "crates",
        "target": 6,
        "labelBn": "বাঁশের খাঁচা ভাঙো",
        "labelEn": "Bamboo Cages",
        "icon": "📦"
      }
    ],
    "initialCells": [
      {
        "row": 1,
        "col": 1,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 4,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 6,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 3,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 7,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 0,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 3,
        "blocker": "crate_1"
      },
      {
        "row": 4,
        "col": 7,
        "blocker": "crate_1"
      }
    ]
  },
  {
    "id": 56,
    "chapterNumber": 10,
    "chapterTitleEn": "Ch 10: Crystal Jungle Sanctum",
    "chapterTitleBn": "অধ্যায় ১০: ক্রিস্টাল জঙ্গল অভিযান",
    "zoneEn": "BOSS: Emperor Chro",
    "zoneBn": "মিশন 56",
    "isBoss": true,
    "scene": "boss_lair",
    "titleBn": "মিশন 56: FINAL BOSS: Emperor Chroma-Fang's Prism Sanctum",
    "titleEn": "Mission 56: FINAL BOSS: Emperor Chroma-Fang's Prism Sanctum",
    "subtitleBn": "অধ্যায় ১০: ক্রিস্টাল জঙ্গল অভিযান — Vanquish Emperor Chroma-Fang's 350 HP across 3 Phases: (1) Counter Fire/Ice/Slime Heads, (2) Route Dual-Gravity Prism Beams, and (3) Drop the Final Royal Key + Fire the 100% Rainbow Mega-Cannon!",
    "subtitleEn": "GRAND CAMPAIGN FINALE (Level 56)! Emperor Chroma-Fang—the Three-Headed Prism Serpent (Ruby Fire Head, Sapphire Frost Head, Emerald Slime Head)—blocks the Golden Portal in an epic 3-Phase showdown!",
    "storyTipBn": "দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও! (Three-stage evolving boss arena that synthesizes elemental counterplay, dual-gravity waterline cascades, and prism-refracted Rainbow mega-combos into one unforgettable climax!)",
    "storyTipEn": "Twist: Three-stage evolving boss arena that synthesizes elemental counterplay, dual-gravity waterline cascades, and prism-refracted Rainbow mega-combos into one unforgettable climax!",
    "cols": 8,
    "rows": 7,
    "colors": [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ],
    "pressureMode": "real_time",
    "dangerSpeed": 1.45,
    "initialMarbles": 85,
    "drainColumns": [
      0,
      1,
      6,
      7
    ],
    "themePalette": {
      "sky": "#160933",
      "wall": "#2d1463",
      "pillar": "#c084fc",
      "tray": "#8b5cf6"
    },
    "tasks": [
      {
        "kind": "keys",
        "target": 3,
        "labelBn": "বস তালা চাবি",
        "labelEn": "Boss Keys",
        "icon": "👑"
      },
      {
        "kind": "marbles",
        "target": 85,
        "labelBn": "মার্বেল খালি করো",
        "labelEn": "Drain Marbles",
        "icon": "🔮"
      },
      {
        "kind": "cannon_charge",
        "target": 72,
        "labelBn": "রেইনবো ক্যানন চার্জ",
        "labelEn": "Boss Cannon",
        "icon": "🌈"
      }
    ],
    "initialCells": [
      {
        "row": 0,
        "col": 1,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 4,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 6,
        "special": "key",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 1,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 6,
        "blocker": "crate_1"
      },
      {
        "row": 2,
        "col": 3,
        "blocker": "ice_1"
      },
      {
        "row": 2,
        "col": 4,
        "blocker": "ice_1"
      },
      {
        "row": 3,
        "col": 2,
        "blocker": "slime"
      },
      {
        "row": 3,
        "col": 5,
        "blocker": "slime"
      },
      {
        "row": 1,
        "col": 3,
        "special": "striped_v",
        "color": "orange"
      }
    ]
  }
];
