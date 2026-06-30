/**
 * 영어 데이터 오버레이 — 영주(yeongju) 영문 빌드 전용.
 * 한국어 dataPack에 영어 텍스트를 병합(override). 비번역 필드(좌표·연도·이미지·enum·links·citations 등)는 유지.
 * Workflow 다중에이전트 번역(검수 포함) 산출물. 한국어 기본 빌드에서는 사용되지 않는다.
 */
import type { Heritage } from "@/types";
import type { HistoricalFigure } from "@/data/figures";
import type { CourseRecommendation, QuizQuestion } from "@/types";
import type { CanonicalQA } from "@/data/canonical-qa";

interface HeritageEnOv { description: string; history: string; architecture: string; hiddenStory: string; hours: string; fee: string; closedDays: string; address: string; tags: string[]; }
interface FigureEnOv { name: string; ho: string; role: string; contribution: string; description: string; }
interface CourseEnOv { name: string; duration: string; description: string; bestFor: string; transport: string; highlights: string[]; itinerary: { time: string; title: string; detail: string }[]; }
interface QuizEnOv { question: string; options: string[]; explanation: string; }
interface CanonicalEnOv { question: string; answer: string; matchPatterns: string[]; }

const heritageEn: Record<string, HeritageEnOv> = {
  "buseoksa": {
    "description": "Perched on a steep slope midway up Mount Bonghwangsan, Buseoksa Temple was founded in 676 (the 16th year of King Munmu of Silla) by the Great Master Uisang as the principal monastery of the Korean Hwaeom (Avatamsaka) school of Buddhism. Its halls rise tier upon tier atop layered stone embankments, so that the very path climbing from the Iljumun (One-Pillar Gate) up to Muryangsujeon Hall unfolds like a seeker's journey, drawing one step at a time toward enlightenment. In 2018 it was inscribed on the UNESCO World Heritage List as part of \"Sansa, Buddhist Mountain Monasteries of Korea,\" earning worldwide recognition of its value.",
    "history": "After mastering Hwaeom studies in Tang China and returning home, the Great Master Uisang opened this temple as the head monastery from which to spread Hwaeom thought across the country. Buseoksa is counted among the Hwaeom Sipchal (華嚴十刹), the ten great Hwaeom temples Uisang established, and is remembered as a place that formed one pillar of Silla Buddhist thought.\n\nThe temple's name, Buseok (浮石) meaning \"floating stone,\" carries a poignant legend. During Uisang's years of study in Tang China, a woman named Seonmyo came to love him; after he returned to Silla, she is said to have transformed into a dragon and crossed the sea to protect him, at last turning into a great boulder that rose into the air to drive off a band of men obstructing the temple's construction. To this day, a rock said to be that boulder—the \"floating stone\"—still remains to the west of Muryangsujeon Hall.\n\nMuryangsujeon Hall and the other old buildings were rebuilt during the Goryeo dynasty, yet they preserve deeply the original forms of ages past. For this reason the precincts of Buseoksa are valued not as the relic of a single era but as a rare place where one can read, all in one setting, the unbroken flow of Korean Buddhist architecture as it passed from Silla into Goryeo.",
    "architecture": "Muryangsujeon Hall (National Treasure No. 18), the heart of Buseoksa, is reckoned among the oldest surviving wooden buildings in Korea. It marries the jusimpo bracket style—in which the roof's weight is borne on the columns alone—with the entasis technique of baeheullim columns that bulge at the middle and taper toward the top and bottom, revealing a beauty of proportion that is at once simple and reassuringly stable.\n\nEnshrined within the hall is a seated clay Buddha (Sojo Yeorae Jwasang, National Treasure No. 45), which, unlike the Buddha images of other halls, sits facing east. Because it represents Amitabha, the Buddha presiding over the Western Pure Land of Ultimate Bliss, the placement was devised so that worshippers offer their respects toward the west—an intricate arrangement grounded in Hwaeom doctrine.\n\nThe stone lantern standing before Muryangsujeon Hall (National Treasure No. 17) is a masterpiece representative of Unified Silla stone lanterns, exceptional in both proportion and craftsmanship of carving. Buseoksa is also a model of the mountain temple, its halls set upon stone embankments that follow rather than resist the steep terrain; this very arrangement, in harmony with the natural topography, is held to be the essence of traditional Korean architecture. On the higher ridge, Josadang Hall (National Treasure No. 19) and its interior murals (the Josadang Wall Paintings, National Treasure No. 46) likewise carry down to our day the precious traces of Goryeo Buddhist painting.",
    "hiddenStory": "The sunset seen from the courtyard before Muryangsujeon Hall—and above all from atop Anyangnu Pavilion—is the scene visitors to Buseoksa cherish most. As the sun sinks behind the wave upon wave of ridgelines of the Sobaek Mountains, the stillness of the mountain temple and the grandeur of the slopes fold together like a single painting.\n\nThis scenery and the refinement of the architecture have long held the hearts of artists. The art historian Choe Sun-u captured its graceful beauty in his essay \"Leaning on the Entasis Column of Muryangsujeon Hall\" (Muryangsujeon Baeheullimgidung-e Gidaeseoseo); the calligrapher Chusa Kim Jeong-hui is said to have left at Buseoksa the inscription \"Cheonha Jeil Jangnak\" (天下第一長樂, \"the foremost everlasting joy under heaven\"); and the poet Jo Ji-hun, too, sang of the temple's mood in verse.\n\nIn Yeongju, the land of the seonbi (Confucian scholars), Buseoksa conveys a depth of a different grain from the trim composure of the Confucian seowon academies. Where the thought of Hwaeom, the breath of ancient timber, and the mountains and the sunset all come together, this place becomes the scene that lingers longest in the heart on any journey through Yeongju.",
    "hours": "08:00–18:00 (until 17:00 in winter)",
    "fee": "Adults 2,000 won / Youth 1,500 won / Children 1,000 won",
    "closedDays": "Open year-round (no closing days)",
    "address": "345 Buseoksa-ro, Buseok-myeon, Yeongju-si, Gyeongsangbuk-do",
    "tags": [
      "UNESCOWorldHeritage",
      "MasterUisang",
      "MuryangsujeonHall",
      "EntasisColumns",
      "HwaeomSchool"
    ]
  },
  "sosuseowon": {
    "description": "Tucked into the Baegun-dong valley, where the Jukgyecheon Stream loops around a pine grove, Sosu Seowon was founded in 1543 by Ju Se-bung, the magistrate of Punggi, and is the first private Confucian academy (seowon) in Korea. It opened in honor of An Hyang (安珦), a Neo-Confucian scholar of the Goryeo dynasty, and later became the nation's first royally chartered academy (saaek seowon) when King Myeongjong personally bestowed its name plaque. In 2019, it was inscribed on the UNESCO World Heritage List as one of the \"Seowon, Korean Neo-Confucian Academies.\"",
    "history": "In 1543, Ju Se-bung, the magistrate of Punggi, built a shrine in Sunheung—the home region of the Goryeo Neo-Confucian scholar An Hyang—to honor his scholarship and virtue, and beside it founded the Baegun-dong Academy (Baegundong Seowon) to teach Confucian students. By bringing together a shrine for memorial rites and an academy for learning in a single place, this arrangement became the model for seowon throughout the Joseon dynasty.\n\nWhen Toegye Yi Hwang was appointed magistrate of Punggi in 1548, he believed the academy deserved official recognition and support from the state and petitioned the royal court for a charter. His request was granted, and in 1550 King Myeongjong bestowed the name \"Sosu Seowon (紹修書院)\"—meaning \"let the learning that has already fallen be carried on and cultivated anew\"—along with a name plaque, books, and land. With this, Sosu Seowon became the first royally chartered academy (saaek seowon) in Korea to receive its name from a king.\n\nWhen Heungseon Daewongun carried out a sweeping abolition of academies across the country in 1871, Sosu Seowon was one of only 47 seowon spared from demolition. That long, unbroken legacy bore fruit in 2019, when it was inscribed—together with eight other academies—on the UNESCO World Heritage List as one of the \"Seowon, Korean Neo-Confucian Academies.\"",
    "architecture": "At the heart of the academy stands the Ganghakdang lecture hall, where students gathered to pursue their studies, and arranged neatly around it are the East and West dormitories (Dongjae and Seojae) for boarding students, the Jangseogak library that housed the books, and the shrine enshrining An Hyang's spirit tablet. With spaces for reading and for honoring past sages side by side, it embodies the classic form of a seowon.\n\nThe dense pine forest enclosing the grounds has long been called the \"Scholar Trees (hakjasu)\"—their upright bearing said to resemble that of a Confucian scholar—while the clear murmur of the Jukgyecheon Stream flowing before them helped settle the mind of anyone at their books. This landscape, where pine grove and waterway meet, was in itself an ideal setting for study.\n\nSosu Seowon preserves a portrait of An Hyang, reproduced in 1318 during the Goryeo dynasty, which is regarded as the oldest surviving portrait in Korea and is designated National Treasure No. 111.",
    "hiddenStory": "The name \"Sosu (紹修)\" carries a profound meaning: \"let the teaching that has already fallen be carried on and cultivated anew (旣廢之學 紹而修之).\" In an age when the thread of learning had been severed, the resolve to rekindle the spark of scholarship is etched into the two characters of the academy's very name.\n\nAn Hyang, the scholar honored here, traveled repeatedly to Yuan China and introduced Zhu Xi's Neo-Confucianism to Korea, and is regarded as the founding father of Korean Neo-Confucianism. That an academy standing at the very origin of this learning should receive its name from a king reflected Joseon's own resolve to make Neo-Confucianism the foundation of the state.\n\nOn a rock beside the Jukgyecheon Stream in front of the academy, the character \"Gyeong (敬)\" is carved in red. Gyeong—a mind of reverence and restraint, the discipline of governing oneself without lapse—was the core of the self-cultivation that a Confucian scholar was to hold to for a lifetime; together with the sound of the flowing water, that single character steadies the mind of all who pass by.",
    "hours": "09:00–18:00 (until 17:00 in winter)",
    "fee": "Adults 3,000 won / Youth 2,000 won / Children 1,000 won",
    "closedDays": "Mondays, January 1, and the days of Seollal (Lunar New Year) and Chuseok (Korean Thanksgiving)",
    "address": "2740 Sobaek-ro, Sunheung-myeon, Yeongju-si, Gyeongsangbuk-do",
    "tags": [
      "UNESCOWorldHeritage",
      "FirstSeowonInKorea",
      "ToegyeYiHwang",
      "AnHyang",
      "RoyallyCharteredAcademy"
    ]
  },
  "sunbichon": {
    "description": "Set beside Sosu Seowon and the Jukgyecheon Stream, Seonbichon Village (the \"Scholars' Village\") is a traditional-culture experience site that recreates—at the scale of an entire village—the homes and daily life of Joseon-era seonbi, the Confucian scholars. Hanok of every social rank, from the yangban aristocracy down to commoners, stand together along narrow lanes, so visitors can stroll through the sarangchae (men's quarters) where scholars once read and the anchae (inner quarters) where the household was run, and picture a day in the life of an old-time scholar. Here you can spend a night in a hanok and learn etiquette and tradition firsthand—a living classroom you can see, hear, and stay in.",
    "history": "Seonbichon is a traditional-culture experience village that the City of Yeongju created in 2004 near Sosu Seowon in Sunheung-myeon, in order to carry the spirit of the seonbi into the present day. What sets it apart is that it is not an old village that has stood here for centuries, but a space newly built to recreate the dwellings and daily life of Joseon-era scholar-officials (sadaebu) according to careful historical research.\n\nThere was good reason to settle on this particular spot. The Sunheung and Yeongju area is the home of Sosu Seowon, Korea's first royally chartered Confucian academy (seowon): here Ju Se-bung founded the academy to honor An Hyang, the Goryeo scholar who first brought Neo-Confucianism to Korea, and Toegye Yi Hwang later petitioned the throne to grant it a royal charter. By reviving the scholars' living quarters on this ground steeped in the seonbi spirit, the village in effect lifts the Confucian culture found in books into a landscape laid out before one's eyes.\n\nThat is why Seonbichon forms a single precinct with the neighboring Sosu Seowon and Sosu Museum, each complementing the others. If at the academy one encounters the scholarship and thought of the seonbi, at Seonbichon one can look—dwelling by dwelling—at how that scholar actually ate, slept, and received his guests.",
    "architecture": "The village faithfully recreates hanok of every rank, from the tile-roofed houses of yangban families crowned with a towering soseuldaemun gate to the modest thatched cottages of commoners, each differing in scale and formality according to social standing. From nothing more than a house's size, the material of its roof, and the layout of its courtyard, one can read the hierarchy of Joseon society at a single glance.\n\nEach house is divided into a sarangchae and an anchae. Through the arrangement of the sarangchae, where the master of the house pursued his studies and welcomed guests; the anchae, where the lady of the house managed the household; and the numaru, an elevated wooden-floored pavilion open to the breeze and the view, one comes to understand quite naturally the Confucian order of daily life that kept the domains of men and women apart.\n\nThe recreation does not stop at the houses themselves. Kitchen gardens, wells, jangdokdae (platforms for crocks of fermented sauces), and foot-operated treadle mills fill out the everyday facilities, so that the village as a whole forms a single, living domestic landscape. As you walk along the lanes, house after house gathers together to complete a day in a small Joseon village.",
    "hiddenStory": "Each year the Seonbi Culture Festival is held across Seonbichon and Sosu Seowon, with hands-on programs—re-enactments of traditional weddings, the tea ceremony (dado), calligraphy, and folk games—unfolding throughout the village. As you don the dopo robe and yugeon headwear and follow along with the old rites, the formality and refinement of the seonbi no longer feel so distant.\n\nSeonbichon's greatest draw is that you can actually stay the night. A night in an ondol room heated by a wood-fired furnace offers up the serene quiet of a Joseon evening just as it once was, leaving a special memory for anyone in search of something out of the ordinary.\n\nWith its trim hanok and earthen paths, the village also serves as a filming location for historical dramas and films. And because it lies right next to Sosu Seowon and the Sosu Museum, you can take in both the spaces of scholarship and the spaces of daily life along a single day's route—a charm all its own.",
    "hours": "09:00–18:00",
    "fee": "Adults 3,000 won / Youth 2,000 won / Children 1,500 won",
    "closedDays": "Mondays, January 1, and the days of Lunar New Year (Seollal) and Chuseok",
    "address": "2796 Sobaek-ro, Sunheung-myeon, Yeongju-si, Gyeongsangbuk-do",
    "tags": [
      "SeonbiCulture",
      "HanokExperience",
      "TraditionalCulture",
      "EtiquetteEducation",
      "SeonbiFestival"
    ]
  },
  "museom": {
    "description": "A traditional village that the Naeseongcheon Stream wraps around on three sides, so that—though firmly anchored to the land—it appears to float on the water like an island. Its most cherished sight is the oennamudari, a single-log footbridge that once linked the village to the far bank; framed by white sandbars and a meandering current, this route was chosen as one of \"Korea's 100 Most Beautiful Roads.\"",
    "history": "Museom Village took shape around 1666, when Park Su (朴檖) of the Bannam Park clan first settled here; the Seonseong (Yean) Kim clan followed, and the two families have lived side by side ever since in this clan village. Encircled on three sides by the Naeseongcheon Stream, it came to be called Museom (水島), meaning \"an island on the water,\" and for centuries the only route to the outside world was a single-log footbridge spanning the river.\n\nBarely a hand's width across, this footbridge was the village's lifeline—the path along which people went to market, brides and grooms set off to their weddings, and the dead were carried away. Until a concrete bridge was built, this slender span was the only thread tying Museom to the world.\n\nIn 1928, during the Japanese colonial period, the villagers founded the Adoseosuk (亞島書塾) school to teach Hangeul, the Korean script, and to lend their strength to rural enlightenment and the anti-Japanese independence movement. It stands as evidence that this small, river-girt village was never cut off from the currents of its time.",
    "architecture": "Within the village stand well-preserved traditional hanok houses of the Joseon-era gentry and ordinary households alike, among them the Haeudang (海愚堂) and Manjukjae (晩竹齋) old residences. Of these, the Manjukjae is said to be the oldest house in the village, built in 1666 by the founding settler Park Su (朴檖).\n\nMany of the houses follow an enclosed plan, with the inner quarters (anchae) and the men's quarters (sarangchae) arranged around a courtyard in the shape of the Korean letter \"ㅁ\"—a layout that reveals the wisdom of homes built to endure the long, cold winters of the inland mountains.\n\nLow tile-roofed and thatched houses, clustered together with their backs to the sandbars, blend with the winding course of the Naeseongcheon Stream into a scene that has earned Museom a reputation as a village preserving the very archetype of the Korean countryside.",
    "hiddenStory": "Each summer the \"Museom Single-Log Bridge Festival\" recreates scenes of old, when traditional wedding processions and funeral biers would cross the oennamudari footbridge. On the narrow span, anyone who met another person coming the other way had to yield a step aside before either could pass—a moment in which many read the virtues of yielding and consideration for others.\n\nThe poet Jo Ji-hun, who married a woman from Museom Village, stayed here through that bond, and his poem \"Byeolli\" (別離, \"Parting\"), which sings of the sorrow of leave-taking, is said to have been written with this village as its setting.\n\nRenowned for fine white sands that your feet sink deep into and clear waters whose light shifts at every bend, the Naeseongcheon is prized as a living natural sand-bed river, drawing a ceaseless flow of photographers and painters in every season.",
    "hours": "Open year-round",
    "fee": "Free",
    "closedDays": "None",
    "address": "234 Museom-ro, Munsu-myeon, Yeongju-si, Gyeongsangbuk-do",
    "tags": [
      "SingleLogBridge",
      "NaeseongcheonStream",
      "TraditionalVillage",
      "BeautifulRoadsOfKorea",
      "ClanVillage"
    ]
  },
  "sobaeksan": {
    "description": "Sobaeksan, whose main peak Birobong rises 1,439 meters above sea level, forms one stretch of the Baekdudaegan mountain range. It is a quintessential \"yuksan\"—an earthen mountain whose ridgelines are gently blanketed with soil and grassland rather than bare rock. Designated as Korea's eighteenth national park in 1987, it offers an unbroken succession of scenery through all four seasons: the royal azalea colonies that flush the ridges crimson in May and June, the Japanese yew groves around Birobong Peak, and the rime frost of deep winter.",
    "history": "Sobaeksan has long been called the \"Lesser Taebaeksan.\" The name arose because the mountain's form, branching off from Taebaeksan, is altogether gentler and more generous; though it is a great mountain dividing the Yeongnam and Chungcheong regions, it has been regarded as a mountain that embraces people with magnanimity.\n\nJungnyeong Pass, on the mountain's flank, is an ancient mountain road linking Punggi and Yeongju with Danyang in Chungcheong Province. The Samguk Sagi (History of the Three Kingdoms) records that the Jungnyeong route was opened in the reign of King Adalla of Silla (158 CE), and this old Jungnyeong road was a strategic hub of transport and the military, crossed by scholars, traveling peddlers, and soldiers passing between Yeongnam and Hanyang (present-day Seoul).\n\nThe southern foothills of Sobaeksan are the homeland of Punggi ginseng, where deep valleys and wide swings between day and night temperatures are said to have nurtured ginseng of potent medicinal quality. With old temples such as Huibangsa—founded in the Silla period—nestled in valley after valley, Sobaeksan has remained a mountain where Buddhism, scholarship, and the paths of everyday life all crossed together.",
    "architecture": "",
    "hiddenStory": "Every year in May and June, the ridgeline running from Birobong Peak to Yeonhwabong Peak turns crimson with royal azaleas. The ridge trail, where low azalea shrubs carpet the grasslands, is one of Korea's most celebrated spring hiking routes, and the annual Sobaeksan Royal Azalea Festival draws crowds of springtime visitors.\n\nWinter reveals another face of Sobaeksan. The rime frost and snow blossoms wrought by its biting winds cloak the main ridge in pure white, and the area around Birobong Peak is renowned as a midwinter snowscape hiking destination.\n\nWhen night falls deep, the ridge becomes a stage for the stars. Far removed from city lights, the darkness and the wide-open sky bring vivid constellations and the Milky Way into view, making this a place where an astronomical observatory has taken root and astrophotographers keep returning.",
    "hours": "1 hour before sunrise to sunset",
    "fee": "Free",
    "closedDays": "Mountain access restricted during inclement weather",
    "address": "Sobaeksan-gil, Punggi-eup, Yeongju-si, Gyeongsangbuk-do",
    "tags": [
      "NationalPark",
      "RoyalAzalea",
      "BirobongPeak",
      "JungnyeongPass",
      "BiosphereReserve"
    ]
  },
  "sosu-museum": {
    "description": "A museum specializing in Seonbi (Confucian scholar) culture, set on the grounds of the old town of Sunheung right beside Sosu Seowon. In a single place you can encounter the long history of a region where Yeongnam Neo-Confucianism first took root—from Silla- and Goryeo-era artifacts excavated around Sunheung to the everyday life of the Joseon literati (sarim). More than a place that simply displays relics, it is also cherished as a center for lifelong learning, home to programs such as the Children's Seonbi School.",
    "history": "Sosu Museum opened in 2003, established by the city of Yeongju to gather, preserve, and pass on to future generations the Seonbi cultural heritage rooted in the Sosu Seowon area. Built on a site that shares a wall with Sosu Seowon—Korea's first royally chartered Confucian academy (saaek seowon)—it was laid out so that visitors to the academy would naturally continue on to the museum.\n\nThe exhibition begins with Silla- and Goryeo-period artifacts unearthed around Sunheung, then unfolds in chronological order through the household life and books of the Joseon literati (sarim) and the scholarly lineage of Yeongnam Neo-Confucianism that runs from An Hyang through Ju Se-bung to Toegye Yi Hwang. Sunheung was a large and flourishing town from the Goryeo dynasty into the early Joseon period, and so each artifact drawn from its soil bears witness to the region's deep history.\n\nSince its opening, the museum has steadily carried on lifelong-learning programs such as the Children's Seonbi School, classical Chinese classes, and traditional-etiquette experiences, establishing itself as a local educational institution that conveys the spirit of the old scholars in the language of today.",
    "architecture": "The building was constructed in a traditional style that settles low into the mountain contours of Sunheung at the foot of Sobaeksan, so as not to clash with the unassuming, time-worn mood of the neighboring Sosu Seowon. The lines of its tiled roofs and walls blend into the surrounding scenery, so that the museum itself comes across almost like an exhibit in its own right.\n\nInside, four permanent exhibition halls follow one after another along the visitor route, presenting in turn the artifacts excavated at Sunheung, the living culture of Confucianism and the Seonbi, the scholarly lineage of Yeongnam, and the history of the Sunheung district. The screening room and hands-on room are filled with content pitched to a child's eye level, helping families learn about Seonbi culture as if through play.\n\nBeside the museum lie Sosu Seowon and the Jukgyecheon Stream, while nearby stands Seonbichon Village, recreated in 2004 in the image of an old village—together forming a single precinct. The charm of this place lies in a touring route where inside and outside flow into each other: the life of the scholars seen in the exhibition halls is confirmed once again in the landscape just beyond the door.",
    "hiddenStory": "The foremost treasure held by the museum is the portrait of Hoeheon An Hyang, painted during the Goryeo dynasty. Counted among the oldest surviving portraits in Korea, this image is designated National Treasure No. 111, and—bound up with Sosu Seowon's long tradition of enshrining An Hyang as its foremost honoree—its significance is felt all the more keenly here.\n\nAnother axis of the exhibition is the turbulent history of the town of Sunheung. In 1457, Grand Prince Geumseong, exiled to Sunheung, was discovered plotting to restore the deposed King Danjong, and as a result the entire Sunheung Dohobu (military protectorate office) was abolished; the town would not be re-established until more than two hundred years later. The Geumseongdan altar near the museum is a place that commemorates this tragedy, and together with the artifacts unearthed from Sunheung's soil, it speaks of both the glory and the hardship this region endured.\n\nAround Sunheung, local festivals and events honoring Seonbi culture and the region's heritage continue to be held, so that the lives of the bygone figures met in the museum's exhibition halls are brought back as village celebrations. This scene—where the relics of the exhibition hall carry over into the festivities in the yard outside—is the moment, unique to Sosu Museum, of meeting a living Seonbi culture.",
    "hours": "09:00–18:00 (until 17:00 in winter)",
    "fee": "Adults 3,000 won / Youth 2,000 won / Children 1,000 won (combined ticket with Sosu Seowon)",
    "closedDays": "January 1 and the main national holidays (Seollal and Chuseok)",
    "address": "2780 Sobaek-ro, Sunheung-myeon, Yeongju-si, Gyeongsangbuk-do",
    "tags": [
      "Museum",
      "SeonbiCulture",
      "Artifacts",
      "Sunheung",
      "Education"
    ]
  },
  "yeongju-hyanggyo": {
    "description": "Yeongju Hyanggyo is a state-run Confucian school (gwanhak, a public school operated by the government) founded in 1368, the 17th year of King Gongmin of Goryeo—a public educational institution maintained by the state to teach the children of the local town. For more than 600 years it has echoed with the recitation of texts and the memorial rites honoring Confucius, making it a cradle of Yeongju's Confucian culture. To this day it preserves its tidy old layout, with the place of learning set in front and the shrine behind.",
    "history": "The history of Yeongju Hyanggyo begins with its first founding in 1368, the 17th year of King Gongmin of Goryeo. Its buildings were later destroyed by fire during the Imjin War (the Japanese invasions that began in 1592), but the school was rebuilt in 1602, the 35th year of King Seonjo of Joseon.\n\nIn the Joseon period, the hyanggyo was a state school overseen directly by the local magistrate. At Yeongju Hyanggyo as well, regional Confucian scholars (yusaeng) cultivated their learning by expounding the Four Books and Three Classics (Saseo Samgyeong), and each spring and autumn they devotedly performed the Seokjeon Daeje, the grand sacrificial rite honoring Confucius and his disciples.\n\nEven when the Heungseon Daewongun abolished seowon (private Confucian academies) across the country en masse, the hyanggyo survived as a state institution for education and ritual. As a result, Yeongju Hyanggyo carried on as a focal point for the local Confucian community (yurim) into the modern era, and to this day it continues its traditions of ritual ceremony and scholarly instruction.",
    "architecture": "Yeongju Hyanggyo follows the classic jeonhak-humyo layout—\"place of learning in front, shrine behind.\" On the lower ground in front stand the Myeongnyundang lecture hall and the east and west dormitories (dongjae and seojae) where students lodged, while on the ground raised a step higher behind sits the Daeseongjeon, the hall of memorial rites.\n\nPlacing the shrine of the sages above the place of learning embodies the Confucian sense of hierarchy, in which the very root of teaching is held in the highest reverence. Enshrined in the Daeseongjeon are the spirit tablets of the Confucian sages, centered on Confucius and including the Four Sages (saseong).\n\nThe complex is designed so that as one passes in turn through the outer three-bay gate (oesammun) and the inner three-bay gate (naesammun), each successive courtyard rises a degree in rank, so that with every step a visitor is naturally moved to straighten their collar in respect. The restrained, elegant wooden buildings, stripped of ostentation, preserve well the orderly atmosphere of an old hyanggyo.",
    "hiddenStory": "At Yeongju Hyanggyo, the Seokjeon Daeje is still performed each spring and autumn, on the sangjeong-il—the first jeong (丁) day of the second and eighth lunar months. In this rite, participants don the dopo robe and the yugeon scholar's cap and offer the ceremonial cups exactly as the old ritual prescribes, bringing the scene of a hyanggyo courtyard from centuries ago vividly back to life today.\n\nBehind the Myeongnyundang stands a single ginkgo tree roughly 400 years old. From ancient times, ginkgo trees were favored in the courtyards of hyanggyo and seowon—a longstanding symbol that traces back to the haengdan (the \"apricot altar\"), where Confucius is said to have taught his disciples.\n\nAs autumn deepens, the yellow ginkgo leaves shed by this ancient tree wash the hyanggyo courtyard in gold, making it a beloved spot for autumn photographs. It is a place where the traces of old scholars at their reading overlap with the light of the season.",
    "hours": "Open year-round (exterior grounds)",
    "fee": "Free",
    "closedDays": "Partial restrictions during special events",
    "address": "233 Yeongju-dong, Yeongju-si, Gyeongsangbuk-do",
    "tags": [
      "Hyanggyo",
      "Confucianism",
      "JoseonDynasty",
      "EducationalInstitution",
      "KingGongmin"
    ]
  },
  "punggi-ginseng": {
    "description": "Said to be the land where Korean ginseng cultivation first began, Punggi is home to this specialized museum, which gathers in one place the nearly five-hundred-year tradition of growing, processing, and medicinally using ginseng. As you follow the long story of how a single root of ginseng, nourished by the clear energy of Sobaeksan Mountain, came to earn its name as a tribute offering presented to the king and to be known even beyond Korea's borders, you discover the depth held within a small mountain town.",
    "history": "Punggi ginseng is said to have originated in 1541, when Ju Se-bung (周世鵬), who had been appointed magistrate of Punggi County, obtained wild ginseng seeds from the slopes of Sobaeksan Mountain and planted them experimentally in the area around Geumgye-ri. Raising by human hand the wild ginseng that had once been dug from the mountains is widely regarded as the beginning of gasam (家蔘, cultivated ginseng) farming. Intriguingly, Ju Se-bung was also the man who founded Baegundong Seowon (later Sosu Seowon), the first private Confucian academy in Korea. Thus Yeongju, the town of Confucian scholars, gained from the very same root yet another face as the home of ginseng.\n\nIn time, Punggi established itself as the birthplace of Korean ginseng cultivation, and during the Joseon Dynasty it won renown for the ginseng presented to the king as a tribute offering. As the belief took hold that the cool climate of Sobaeksan and its well-drained sloping soil produced ginseng of potent medicinal value, the name \"Punggi ginseng\" became in itself a guarantee of quality.\n\nThe effort to gather this tradition in one place bore fruit after long preparation. The construction plan was approved in 2009 and the building was completed in 2012, and in May 2013 today's comprehensive museum opened its doors, embracing in a single space the history of ginseng, its cultivation techniques, the traces of its trade, and its medicinal benefits.",
    "architecture": "The museum arranges its exhibition spaces so as to unfold the single crop of ginseng along its many strands of history, cultivation, trade, and efficacy. Visitors follow in turn the life cycle of ginseng, from the sowing of the seed through the roughly six years of growth to the harvest, gazing into its entire lifetime.\n\nThe exhibits let you examine step by step the human care that goes into a single root of ginseng, from sesam (洗蔘, the washing and trimming of freshly dug ginseng) to its transformation into red ginseng. Up close, you come to appreciate the process by which ginseng earned its place as a precious medicinal herb and processed good.\n\nAbove all, the very landscape surrounding the museum is itself an exhibition. Behind it the ridgeline of Sobaeksan unfolds, and all around stretch the ginseng fields of the Punggi plain, naturally illustrating how the climate and soil of this land have raised such famous ginseng.",
    "hiddenStory": "The Jeonggamnok (鄭鑑錄), a book of prophecy from the late Joseon period, named Geumgye-chon (金鷄村) at Chaam (車岩) in Punggi as the foremost of the Sipseungji (十勝地), the ten auspicious lands where one could escape war and disaster. People often say it was no mere coincidence that this fold of Sobaeksan Mountain, where folk once sought refuge from troubled times, would later earn fame as a renowned source of ginseng.\n\nBecause people gathered here from all over the country in pursuit of the Jeonggamnok's promise, the small mountain town of Punggi was, from early on, a place connected to the outside world. One of the industries that sustained the livelihoods of those who gathered here was precisely ginseng, so that tracing how Punggi ginseng came to be known beyond the region makes you measure anew the weight a single root of ginseng once carried.\n\nThe time when all these stories breathe most vividly is autumn, when the scent of ginseng grows rich. Each autumn the Punggi Ginseng Festival is held, and both inside and outside the museum bustle with people eager to dig and taste ginseng with their own hands.",
    "hours": "09:00 - 18:00 (Closed on Mondays)",
    "fee": "Free",
    "closedDays": "Mondays and traditional holidays (Seollal and Chuseok)",
    "address": "31 Insam-ro, Punggi-eup, Yeongju-si, Gyeongsangbuk-do",
    "tags": [
      "Ginseng",
      "Punggi",
      "Museum",
      "LocalSpecialty",
      "MedicinalHerb"
    ]
  }
};
const figuresEn: Record<string, FigureEnOv> = {
  "uisang": {
    "name": "Uisang",
    "ho": "First Patriarch of Korean Hwaeom Buddhism",
    "role": "Patriarch of the Hwaeom School",
    "contribution": "Founder of Korean Hwaeom Buddhism, who established Buseoksa Temple in 676",
    "description": "An eminent monk of Silla. After mastering Hwaeom doctrine in Tang China, he returned home and founded Buseoksa Temple in 676, establishing the foundational monastery of Korean Hwaeom Buddhism. He is the oldest root of Yeongju's thousand-year scholarly lineage."
  },
  "seonmyo": {
    "name": "Seonmyo",
    "ho": "",
    "role": "Figure of the Buseoksa Legend",
    "contribution": "Heroine of the “Floating Stone (浮石)” legend",
    "description": "A Tang Chinese woman who cherished Master Uisang. As the heroine of the legend in which she transformed into a dragon to help build Buseoksa Temple, she is the source of the temple's name, “Floating Stone (浮石).”"
  },
  "anhyang": {
    "name": "An Hyang",
    "ho": "Hoeheon (晦軒)",
    "role": "Progenitor of Korean Neo-Confucianism",
    "contribution": "Progenitor of Korean Neo-Confucianism, who first introduced Zhu Xi's learning in the late Goryeo period",
    "description": "The scholar who first brought Zhu Xi's Neo-Confucianism back from Yuan China in the late Goryeo period. Revered as the progenitor (鼻祖) of Korean Neo-Confucianism, he is the principal enshrined figure (主享) of Sosu Seowon. His orthodox lineage carried on into the Yeongnam School of the Joseon dynasty."
  },
  "gongminwang": {
    "name": "King Gongmin",
    "ho": "",
    "role": "31st King of Goryeo",
    "contribution": "Founded Yeongju Hyanggyo in 1368, laying the groundwork for provincial state education",
    "description": "A reformist monarch of Goryeo. In the 17th year of his reign (1368), he founded Yeongju Hyanggyo, laying the groundwork for provincial state education (官學). It marks the starting point of a place of learning established by the state, before the rise of the sarim literati."
  },
  "juseboong": {
    "name": "Ju Se-bung",
    "ho": "Sinjae (慎齋)",
    "role": "Founder of Baegundong Seowon",
    "contribution": "Established Korea's first seowon, Baegundong Seowon, in 1543",
    "description": "While serving as magistrate of Punggi, he founded Baegundong Seowon (the forerunner of Sosu Seowon) in 1543 to honor An Hyang, and he is also remembered as the legendary father of Punggi ginseng cultivation. He was the first to open a “seowon,” a private place of learning."
  },
  "yihwang": {
    "name": "Yi Hwang",
    "ho": "Toegye (退溪)",
    "role": "Toegye — Synthesizer of Neo-Confucianism",
    "contribution": "Leader of the Yeongnam School who won the royal charter renaming Baegundong Seowon as “Sosu Seowon,” inaugurating the chartered-seowon (saaek) system",
    "description": "The great scholar who brought Joseon Neo-Confucianism to its fullest synthesis. As magistrate of Punggi, he secured the royal charter for “Sosu Seowon,” opening the path for state-sanctioned seowon, and he stands as the spiritual pillar of the Yeongnam School that reaches from Yeongju to Andong."
  },
  "parksu": {
    "name": "Park Su",
    "ho": "",
    "role": "Founding Settler of Museom Village",
    "contribution": "Settled in Museom in 1666, laying the foundation for a scholar-gentry village",
    "description": "The founding settler of the Bannam Park clan, who first put down roots in Museom in 1666. Within the water-bend of the Naeseongcheon Stream, he laid the foundation for a village of studious scholar-gentry, carrying the scholarly lineage of the seowon into the everyday culture of the countryside."
  }
};
const coursesEn: Record<string, CourseEnOv> = {
  "unesco-day": {
    "name": "UNESCO Half-Day Course",
    "duration": "Day trip (about 4 hours)",
    "description": "A compact half-day course that takes in the two UNESCO World Heritage Sites that are Yeongju's pride. At Buseoksa Temple—founded by the Silla monk Uisang—you savor a millennium of architectural beauty embodied in Muryangsujeon Hall and its entasis columns, then move on to Sosu Seowon, Korea's first royally chartered Confucian academy, following the Yeongnam Neo-Confucian lineage that runs from An Hyang to Ju Se-bung to Toegye Yi Hwang. Finally, at the nearby Sosu Museum, you round out the day's learning by taking stock of relics excavated in Sunheung and the life of the scholar-official (sadaebu) class.",
    "bestFor": "International groups and study-minded families who are short on time but are determined to see Yeongju's two essential World Heritage Sites.",
    "transport": "About a 30-minute drive from Yeongju Station to Buseoksa. Buseoksa and Sosu Seowon are roughly 25 minutes apart by car, so a rental car or taxi is recommended.",
    "highlights": [
      "The essence of Goryeo-era timber architecture, found in Buseoksa's Muryangsujeon Hall (National Treasure) and its entasis columns",
      "The scholar's spirit of self-cultivation, read in the Gyeongja Rock by Sosu Seowon's Jukgyecheon Stream, carved with the character 'gyeong (敬, reverence)'",
      "A clear, at-a-glance overview of the Yeongnam Neo-Confucian lineage from An Hyang to Ju Se-bung to Yi Hwang at the Sosu Museum",
      "Two UNESCO World Heritage Sites in half a day—a full, efficient route for a tight schedule"
    ],
    "itinerary": [
      {
        "time": "09:30",
        "title": "Buseoksa Temple — Muryangsujeon Hall & Anyangnu Pavilion",
        "detail": "Climb the hillside temple complex from the Iljumun Gate up to Muryangsujeon Hall, taking in the jusimpo bracket style and the entasis columns, then survey the Sobaeksan ridgeline from Anyangnu Pavilion."
      },
      {
        "time": "11:30",
        "title": "Lunch — Around Buseok-myeon & Sunheung",
        "detail": "Lunch on local specialties such as Yeongju hanwoo beef and taepyeongcho, at a hometown restaurant below Buseoksa or on the way toward Sunheung."
      },
      {
        "time": "13:00",
        "title": "Sosu Seowon — Ganghakdang Lecture Hall & Gyeongja Rock",
        "detail": "Stroll the lecture grounds of Korea's first seowon and its grove of 'scholar pines' (hakjasu), then seek out the rock-carved character 'gyeong (敬)' across the Jukgyecheon Stream."
      },
      {
        "time": "14:30",
        "title": "Sosu Museum — Tracing the Lineage",
        "detail": "Wrap up by laying out the course of Yeongnam Neo-Confucianism in chronological order, through An Hyang's portrait and relics excavated in Sunheung."
      }
    ]
  },
  "sunbi-overnight": {
    "name": "Sunbi Spirit: 2 Days, 1 Night",
    "duration": "2 days, 1 night",
    "description": "A Korean-style slow-travel journey that steps directly into the daily life of a Joseon scholar-official. On the first day, you study the lecture spaces of the Confucian literati (sarim) at Sosu Seowon, tour the yangban, jungin, and commoner houses of Seonbichon Village just across the road, and then spend a night in a hanok. The dawn light seeping through the hanji paper windows and a cup of tea on the numaru veranda stay with you long afterward. On the second day, you cross the single-log bridge at Museom Village, which the Naeseongcheon Stream curls around, and close the journey beneath the ancient trees in the courtyard of Yeongju Hyanggyo's Myeongnyundang Hall, tracing the lingering traces of the Seokjeon Daeje rite.",
    "bestFor": "Slow travelers, families, and hobby groups who want to live out a day in the life of a Joseon scholar-official, firsthand, in a hanok.",
    "transport": "About a 25-minute drive from Yeongju Station to Sunheung (Sosu Seowon and Seonbichon). For Museom Village and the hyanggyo, traveling by car toward downtown Yeongju is recommended.",
    "highlights": [
      "A night in a Seonbichon hanok—experiencing courtesy and the spatial hierarchy of the numaru veranda, the sarangchae (men's quarters), and the anchae (inner quarters)",
      "The scholarly spirit of An Hyang and Toegye, and the story of the royally chartered academy, encountered at Sosu Seowon",
      "The timeless rural scenery of Museom Village's single-log bridge and the old houses of Haeudang and Manjukjae",
      "Yeongju Hyanggyo's jeonhak-humyo layout, the Seokjeon Daeje rite, and a 400-year-old ginkgo tree"
    ],
    "itinerary": [
      {
        "time": "Day 1, 10:00",
        "title": "Sosu Seowon",
        "detail": "At Korea's first seowon, examine the arrangement of the lecture hall and shrine, the meaning of 'Sosu (紹修),' and the Gyeongja Rock."
      },
      {
        "time": "Day 1, 14:00",
        "title": "Seonbichon — Traditional Experiences",
        "detail": "Tour the yangban houses and try your hand at etiquette, calligraphy, and the tea ceremony, then spend the night in a hanok."
      },
      {
        "time": "Day 2, 09:30",
        "title": "Museom Village — Single-Log Bridge",
        "detail": "Cross the single-log bridge along the Naeseongcheon sandbars and look around the old Haeudang and Manjukjae houses."
      },
      {
        "time": "Day 2, 13:00",
        "title": "Yeongju Hyanggyo",
        "detail": "Round off the journey with the Myeongnyundang Hall and Daeseongjeon Shrine of the jeonhak-humyo arrangement, the story of the Seokjeon Daeje rite, and the ancient ginkgo tree."
      }
    ]
  },
  "family-weekend": {
    "name": "Family Outing: 3 Days, 2 Nights",
    "duration": "3 days, 2 nights",
    "description": "A family-friendly course that blends nature, play, tradition, and hands-on experiences before children have a chance to get bored. The first day begins with an easy walk along the foothills of Sobaeksan and the single-log bridge at Museom Village; on the second day, after trying on hanbok and trying calligraphy and the tea ceremony at Seonbichon, you fill your curiosity with ginseng lore and activities at the Punggi Ginseng Museum. On the final morning, the trip comes to a close in the front yard of Buseoksa's Muryangsujeon Hall, soaking in the quiet of a mountain temple. Grown-ups go home with depth, and children with fun.",
    "bestFor": "Families who want a well-rounded mix of nature, play, tradition, and hands-on activities before the kids lose interest.",
    "transport": "Distances between stops are considerable, so a rental car is the most convenient choice. A weekend city-tour bus is also available for some legs of the route.",
    "highlights": [
      "A family walk in the foothills of Sobaeksan—seasonal wildflowers and open ridgeline views",
      "Traditional experiences through Seonbichon's hanbok, calligraphy, and tea-ceremony package",
      "Ginseng lore and activities at the Punggi Ginseng Museum (best timed to the Punggi Ginseng Festival in September)",
      "A finish filled out by Museom Village's single-log bridge and the mountain-temple scenery of Buseoksa"
    ],
    "itinerary": [
      {
        "time": "Day 1",
        "title": "Sobaeksan → Museom Village",
        "detail": "Warm up with a short walk in the foothills of Sobaeksan, then cross Museom Village's single-log bridge in the afternoon and capture some photos."
      },
      {
        "time": "Day 2",
        "title": "Seonbichon → Punggi Ginseng Museum",
        "detail": "Try hanbok, calligraphy, and the tea ceremony at Seonbichon in the morning, then enjoy 600 years of ginseng lore and activities at the Punggi Ginseng Museum in the afternoon."
      },
      {
        "time": "Day 3",
        "title": "Buseoksa Temple",
        "detail": "On the final morning, wrap up the trip in the front yard of Buseoksa's Muryangsujeon Hall, gazing out at the stillness of the mountain temple and the Sobaeksan ridgeline."
      }
    ]
  },
  "sobaeksan-nature": {
    "name": "Sobaeksan Nature Healing Day Trip",
    "duration": "Day trip (about 5 hours)",
    "description": "A nature-healing course for a restful day, leaning into Sobaeksan's gentle ridgelines and the ginseng fragrance of Punggi. A 'yuksan'—an earthen mountain whose ridges are mantled in soil and grass—Sobaeksan is renowned for its easy walking trails: in May and June the area around Birobong Peak flushes red with royal azaleas, and along the ridge stands a grove of yew trees said to 'live for a thousand years and stand for a thousand more in death.' After the hike, it makes for a fine finish to trace 600 years of ginseng history at the Punggi Ginseng Museum and soak away your weariness at a nearby hot spring.",
    "bestFor": "Wellness seekers and hikers who want to leave the city behind and rest amid ridgeline breezes and forest.",
    "transport": "Traveling by car from Yeongju Station toward Punggi and Sobaeksan is recommended. Trail and mountain access can be closed depending on the weather, so check ahead before you go.",
    "highlights": [
      "A walk along Sobaeksan's gentle ridges—royal azaleas in May–June, and the breathtaking hoarfrost (sanggodae) of winter",
      "The grove of yew trees around Birobong Peak, said to 'live for a thousand years and stand for a thousand more in death'",
      "The historic scenery of Jungnyeong Pass, the old mountain road that once linked the Yeongnam and Chungcheong regions",
      "A healing route capped off with the Punggi Ginseng Museum and a nearby hot spring"
    ],
    "itinerary": [
      {
        "time": "09:00",
        "title": "Sobaeksan — Ridge Walk",
        "detail": "Set off from the visitor center and walk the ridge toward Birobong Peak at a pace suited to your fitness. Depending on the season, you'll meet royal azaleas, wildflowers, or hoarfrost."
      },
      {
        "time": "12:30",
        "title": "Lunch — Around Punggi",
        "detail": "Head down into Punggi-eup for a lunch of local dishes served with ginseng."
      },
      {
        "time": "14:00",
        "title": "Punggi Ginseng Museum",
        "detail": "Take in exhibits charting the origins of Punggi ginseng in 1541 along with its history of cultivation and trade, and enjoy ginseng-themed activities."
      },
      {
        "time": "15:30",
        "title": "Punggi Hot Spring — Wrap-Up",
        "detail": "Warm your hike-loosened muscles at a nearby hot spring to round off the day (checking operating hours in advance is recommended)."
      }
    ]
  },
  "architecture-day": {
    "name": "Architectural Aesthetics Day Trip",
    "duration": "Day trip (about 5 hours)",
    "description": "From a Buddhist mountain temple to a state Confucian school (hyanggyo) and a literati academy (seowon)—a course that sets three branches of traditional Korean architecture side by side in a single day in Yeongju. At Buseoksa's Muryangsujeon Hall, you read the jusimpo style, which places bracket clusters only atop the columns, and the proportions of the entasis columns; at Yeongju Hyanggyo, the hierarchy of the jeonhak-humyo plan that puts 'the place of learning in front and the shrine behind'; and at Sosu Seowon, the composition of an academy that gathers lecturing and ancestral rites into one place. There's genuine pleasure in comparing how the very same timber architecture reshapes space according to its purpose—religion, the state, or the literati.",
    "bestFor": "Lovers of architecture and history who want to read the grain of traditional Korean architecture slowly and closely.",
    "transport": "The route runs from Buseoksa through downtown Yeongju to Sunheung, so a rental car or taxi is recommended. Yeongju Station sits at the heart of the itinerary.",
    "highlights": [
      "Buseoksa's Muryangsujeon Hall—the proportional beauty of the jusimpo style and the entasis (baeheullim) columns",
      "Yeongju Hyanggyo—the Confucian spatial hierarchy made visible by the jeonhak-humyo layout",
      "Sosu Seowon—the archetype of Korean academy architecture, uniting lecturing and ancestral rites",
      "Mountain temple, hyanggyo, and seowon—three branches of traditional architecture compared in a single day"
    ],
    "itinerary": [
      {
        "time": "09:30",
        "title": "Buseoksa — The Architecture of Muryangsujeon",
        "detail": "Ascend along the stone-terraced layout of the mountain temple, taking in the proportions of the jusimpo bracketing, the entasis columns, and the stone lantern (National Treasure)."
      },
      {
        "time": "12:00",
        "title": "Lunch — Heading into Town",
        "detail": "Lunch while making your way toward downtown Yeongju."
      },
      {
        "time": "13:30",
        "title": "Yeongju Hyanggyo — Jeonhak-humyo",
        "detail": "Pass through the outer and inner three-bay gates (oesammun and naesammun) and read the spatial hierarchy expressed in the differing heights of the Myeongnyundang Hall and the Daeseongjeon Shrine."
      },
      {
        "time": "15:00",
        "title": "Sosu Seowon — Academy Architecture",
        "detail": "Finish by viewing the academy's layout—where the lecture hall, the shrine, and the east and west dormitories come together—and comparing it with the hyanggyo."
      }
    ]
  },
  "grand-immersion-4day": {
    "name": "Yeongju in Full — 3 Nights, 4 Days",
    "duration": "3 nights, 4 days",
    "description": "An unhurried, in-depth journey that takes in all eight of Yeongju's cultural treasures over four days. Day 1 builds the framework with the two UNESCO World Heritage Sites—Buseoksa Temple and Sosu Seowon—and the Sosu Museum. Day 2 lives a day in a Seonbichon hanok and traces a Joseon scholar's daily life through to Yeongju Hyanggyo. Day 3 leans into nature along the Sobaeksan ridgeline, the Punggi Ginseng Museum and a hot spring, and the final day closes with the slow-village mood of the single-log bridge at Museom Village, cradled by the Naeseongcheon Stream. World Heritage, architecture, the Sunbi spirit, nature and old villages woven into one—the most complete way to see Yeongju, slowly and deeply.",
    "bestFor": "Long-stay, study-minded travelers who want to experience everything Yeongju offers in depth—from its UNESCO World Heritage to Sunbi culture, nature and historic villages.",
    "transport": "A rental car is most convenient given the wide travel area. Using Yeongju Station as a base, it is best to group Buseoksa, Sunheung (Sosu Seowon & Seonbichon), Punggi (Sobaeksan) and Museom Village by day.",
    "highlights": [
      "All eight heritage sites in four days—a complete route that leaves nothing out",
      "A day in the life of a Joseon scholar: a night in a Seonbichon hanok through to Yeongju Hyanggyo",
      "A nature-healing day along the Sobaeksan ridge, with Punggi ginseng and a hot spring",
      "From the two UNESCO World Heritage Sites (Buseoksa & Sosu Seowon) to the single-log bridge at Museom"
    ],
    "itinerary": [
      { "time": "Day 1", "title": "Buseoksa → Sosu Seowon → Sosu Museum", "detail": "Begin at Buseoksa Temple—founded by the Silla monk Uisang—with Muryangsujeon Hall and Anyangnu Pavilion, then trace the Yeongnam Neo-Confucian lineage (An Hyang → Ju Se-bung → Yi Hwang) at Korea's first chartered academy, Sosu Seowon, and the Sosu Museum." },
      { "time": "Day 2", "title": "A night in a Seonbichon hanok → Yeongju Hyanggyo", "detail": "Try hanbok, calligraphy and the tea ceremony at Seonbichon and spend a night in a hanok. The next day, read the 'study-front, shrine-rear' spatial hierarchy at Yeongju Hyanggyo's Myeongnyundang Hall and Daeseongjeon Shrine." },
      { "time": "Day 3", "title": "Sobaeksan → Punggi Ginseng Museum → hot spring", "detail": "Walk the Sobaeksan ridge at your own pace (royal azaleas and yew groves in May–June), trace 600 years of ginseng at the Punggi Ginseng Museum, then ease tired legs at a nearby hot spring." },
      { "time": "Day 4", "title": "Museom Village — the single-log bridge", "detail": "On the last day, cross the single-log footbridge at Museom Village along the Naeseongcheon sandbars and close the journey amid the rural scenery of the Haeudang and Manjukjae old houses." }
    ]
  }
};
const quizEn: Record<string, QuizEnOv> = {
  "q1": {
    "question": "Who was the eminent Silla monk who founded Buseoksa Temple?",
    "options": [
      "Great Master Wonhyo",
      "Great Master Uisang",
      "Vinaya Master Jajang",
      "Hyecho"
    ],
    "explanation": "Buseoksa was founded in 676 (the 16th year of King Munmu of Silla) by Great Master Uisang, after he returned from studying Hwaeom (Avatamsaka) Buddhism in Tang China. It is the principal center of the Hwaeom school in Korea."
  },
  "q2": {
    "question": "Which figure from legend gave rise to the name 'Buseok (浮石, Floating Rock)'?",
    "options": [
      "Queen Seondeok",
      "Seonmyo, the Dragon Maiden",
      "Heo Hwang-ok",
      "Princess Bari"
    ],
    "explanation": "According to legend, a woman named Seonmyo (善妙), who loved Great Master Uisang, transformed into a dragon and lifted a great rock into the air to drive away enemies. The name 'Floating Rock (浮石)' originates from this tale."
  },
  "q3": {
    "question": "What is the name of the architectural technique applied to the columns of Buseoksa's Muryangsujeon Hall?",
    "options": [
      "tapered columns (minheullim)",
      "entasis columns (baeheullim)",
      "plain round columns",
      "square columns"
    ],
    "explanation": "Entasis columns (baeheullim) bulge gently outward at the middle, a world-renowned architectural technique that lends a sense of visual stability. The same technique is found in the Parthenon of ancient Greece."
  },
  "q4": {
    "question": "What is the official name of the UNESCO World Heritage listing under which Buseoksa is inscribed?",
    "options": [
      "Historic Villages of Korea",
      "Sansa, Buddhist Mountain Monasteries in Korea",
      "Seowon, Korean Neo-Confucian Academies",
      "Getbol, Korean Tidal Flats"
    ],
    "explanation": "In 2018, Buseoksa was inscribed on the UNESCO World Heritage List as part of 'Sansa, Buddhist Mountain Monasteries in Korea.'"
  },
  "q5": {
    "question": "What was the name of the magistrate of Punggi who established Sosu Seowon?",
    "options": [
      "Yi Hwang",
      "Yi I",
      "Ju Se-bung",
      "Kim Seong-il"
    ],
    "explanation": "Sosu Seowon was established in 1543 by Ju Se-bung, the magistrate of Punggi, under the name 'Baegundong Seowon,' to honor An Hyang, a Neo-Confucian scholar of the late Goryeo period."
  },
  "q6": {
    "question": "What was Sosu Seowon the very first of its kind in Korea?",
    "options": [
      "the first hyanggyo (public Confucian school)",
      "the first seowon (private academy)",
      "the first royally chartered seowon (saaek seowon)",
      "the first Seonggyungwan (national academy)"
    ],
    "explanation": "At the recommendation of Toegye Yi Hwang, Sosu Seowon received its name as a royal charter (saaek, a name bestowed by the king) from King Myeongjong, making it the first royally chartered seowon in Korea."
  },
  "q7": {
    "question": "Which is the correct meaning of 'Sosu (紹修)'?",
    "options": [
      "small and beautiful",
      "to introduce scholarship",
      "to restore and carry on a fallen tradition of learning",
      "to cultivate oneself through nature"
    ],
    "explanation": "'Sosu (紹修)' means 'restore and carry on the learning that has already fallen (旣廢之學 紹而修之)'—the meaning King Myeongjong bestowed upon the academy."
  },
  "q8": {
    "question": "Which late-Goryeo Neo-Confucian scholar is enshrined and honored at Sosu Seowon?",
    "options": [
      "Jeong Mong-ju",
      "An Hyang",
      "Yi Saek",
      "Gil Jae"
    ],
    "explanation": "An Hyang (安珦, 1243–1306) was the first to introduce Neo-Confucianism to Korea from Yuan China in the late Goryeo period, and is regarded as the founding father of Korean Neo-Confucianism."
  },
  "q9": {
    "question": "What does 'Museom (水島)' in Museom Village mean?",
    "options": [
      "island of fog",
      "island upon the water",
      "island of forest",
      "island of dreams"
    ],
    "explanation": "The Naeseongcheon Stream embraces the village on three sides, making it look like an island floating on the water—hence the name 'Museom (水島),' meaning 'island upon the water.'"
  },
  "q10": {
    "question": "Which is NOT one of the four virtues a Joseon-era seonbi (scholar) was expected to embody?",
    "options": [
      "benevolence (in, 仁)",
      "righteousness (ui, 義)",
      "wealth (bu, 富)",
      "wisdom (ji, 智)"
    ],
    "explanation": "The core virtues of a seonbi were benevolence (in, 仁), righteousness (ui, 義), propriety (ye, 禮), and wisdom (ji, 智). Wealth (bu, 富, material riches) was not a virtue a seonbi pursued; rather, it was something to be guarded against."
  },
  "q11": {
    "question": "What is the correct elevation of Birobong Peak on Sobaeksan Mountain?",
    "options": [
      "1,015 m",
      "1,187 m",
      "1,439 m",
      "1,567 m"
    ],
    "explanation": "Birobong, the main peak of Sobaeksan, rises 1,439 m above sea level, making it the highest peak in the Sobaek mountain range."
  },
  "q12": {
    "question": "Under which UNESCO program was Sobaeksan designated in 2018?",
    "options": [
      "World Heritage Site",
      "Global Geopark",
      "Biosphere Reserve",
      "Intangible Cultural Heritage"
    ],
    "explanation": "In recognition of its rich biodiversity, Sobaeksan was designated a UNESCO Biosphere Reserve (under the Man and the Biosphere Programme, MAB) in 2018."
  },
  "q13": {
    "question": "Which is the correct date when Buseoksa was first built?",
    "options": [
      "676 (16th year of King Munmu of Silla)",
      "372 (2nd year of King Sosurim of Goguryeo)",
      "918 (1st year of King Taejo of Goryeo)",
      "1592 (25th year of King Seonjo of Joseon)"
    ],
    "explanation": "Buseoksa was founded in 676, the 16th year of King Munmu of Silla, by Great Master Uisang. After completing his studies in Tang China, Uisang built the temple to spread Hwaeom (Avatamsaka) thought, and it stands as a representative monument of Unified Silla Buddhist culture."
  },
  "q14": {
    "question": "Of which Buddhist school is Buseoksa regarded as the principal center in Korea?",
    "options": [
      "Cheontae (Tiantai) school",
      "Vinaya (Yul) school",
      "Hwaeom (Avatamsaka) school",
      "Jineon (Esoteric/Mantra) school"
    ],
    "explanation": "Buseoksa is the principal center of the Hwaeom school, built by Great Master Uisang to spread Hwaeom thought far and wide. It was the central temple where Uisang resided and taught Hwaeom doctrine; the Cheontae, Vinaya, and Jineon schools have no direct connection to Buseoksa."
  },
  "q15": {
    "question": "What bracket-set (gongpo, 栱包) style supports the roof of Buseoksa's Muryangsujeon Hall?",
    "options": [
      "dapo (multi-bracket) style",
      "jusimpo (column-head bracket) style",
      "ikgong (wing-bracket) style",
      "haang (cantilever bracket) style"
    ],
    "explanation": "Muryangsujeon is a representative example of the jusimpo style, in which bracket sets are placed only atop the columns. It is clearly distinct from the dapo style, which also sets brackets between the columns, and is esteemed as the finest of Goryeo-period jusimpo-style wooden architecture."
  },
  "q16": {
    "question": "Which principal Buddha is enshrined in Muryangsujeon, the main worship hall of Buseoksa Temple?",
    "options": [
      "Vairocana Buddha",
      "Bhaisajyaguru (the Medicine Buddha)",
      "Amitabha Buddha",
      "Maitreya Bodhisattva"
    ],
    "explanation": "\"Muryangsu (無量壽),\" meaning \"immeasurable life,\" refers to Amitabha Buddha, the Buddha of boundless lifespan. Muryangsujeon enshrines Amitabha, the Buddha of the Western Pure Land of Ultimate Bliss (the clay seated Buddha statue, a National Treasure), which is why the hall itself came to be named Muryangsujeon, the Hall of Immeasurable Life."
  },
  "q17": {
    "question": "Buseoksa's clay seated Buddha statue, designated a National Treasure, is made from which material?",
    "options": [
      "A gilt-bronze Buddha cast in copper",
      "A stone Buddha carved from rock",
      "A wooden Buddha carved from a log",
      "A clay image modeled from earth"
    ],
    "explanation": "Sojo (塑造) is a technique of modeling and shaping clay over a wooden framework, and Buseoksa's clay seated Buddha is a representative clay Buddha statue of the Goryeo period. It is distinctive for being modeled in clay and then finished with a coating of gold, and it stands about 2.78 meters tall."
  },
  "q18": {
    "question": "On which mountain does Buseoksa Temple stand?",
    "options": [
      "Gayasan",
      "Bonghwangsan",
      "Woraksan",
      "Juwangsan"
    ],
    "explanation": "Buseoksa sits halfway up Bonghwangsan Mountain in Buseok-myeon, Yeongju, Gyeongsangbuk-do. It is a typical mountain temple, its buildings arranged to climb the hillside in tiers from the Iljumun (One-Pillar Gate) all the way up to Muryangsujeon Hall."
  },
  "q19": {
    "question": "Which Goryeo king is traditionally said to have written the calligraphy on the name plaque (pyeonaek) hung on Muryangsujeon Hall at Buseoksa?",
    "options": [
      "King Gongmin",
      "Taejo Wang Geon",
      "King Gwangjong",
      "King Gongyang"
    ],
    "explanation": "The calligraphy on the plaque hung across the front of Muryangsujeon Hall is traditionally attributed to the hand of King Gongmin of Goryeo. It is said that King Gongmin, who had taken refuge in the Yeongju (Sunheung) area to escape the Red Turban invasions, stopped at Buseoksa and wrote it in the Yan Zhenqing style of calligraphy."
  },
  "q20": {
    "question": "Standing in front of Muryangsujeon Hall is a National Treasure stone relic made during the Unified Silla period. What is it?",
    "options": [
      "A flagpole support (dangganjiju)",
      "A stupa (budo)",
      "A stone lantern",
      "An iron flagpole (cheoldanggan)"
    ],
    "explanation": "In front of Muryangsujeon Hall stands a stone lantern made during the Unified Silla period and designated a National Treasure. With its neat, octagonal form and the exquisite bodhisattva reliefs carved on its light chamber (hwasaseok), it is regarded as a representative example of Silla stone lanterns."
  },
  "q21": {
    "question": "When Sosu Seowon was first founded in 1543 by Ju Se-bung, the magistrate of Punggi, what was it originally called?",
    "options": [
      "Dosan Seowon",
      "Byeongsan Seowon",
      "Baegundong Seowon",
      "Namgye Seowon"
    ],
    "explanation": "Korea's first Confucian academy (seowon), founded by Ju Se-bung in 1543, was originally called \"Baegundong Seowon.\" Its name later changed when it received the royal charter (saaek) of \"Sosu Seowon\" from King Myeongjong. Dosan, Byeongsan, and Namgye Seowon are all separate academies established elsewhere."
  },
  "q22": {
    "question": "Who, after taking office as magistrate of Punggi, petitioned the royal court so that Baegundong Seowon would receive a royal charter (saaek) from the king?",
    "options": [
      "Song Si-yeol",
      "Yi Hwang",
      "Yi I",
      "Jeong Yak-yong"
    ],
    "explanation": "After taking office as magistrate of Punggi, Toegye Yi Hwang petitioned the royal court to have Baegundong Seowon granted a royal charter. As a result, it became Sosu Seowon, the first royally chartered Confucian academy in Korea to receive its name from the king."
  },
  "q23": {
    "question": "Which Joseon king accepted Yi Hwang's petition and bestowed the chartered plaque bearing the name \"Sosu Seowon (紹修書院)\"?",
    "options": [
      "King Sejong",
      "King Myeongjong",
      "King Jeongjo",
      "King Yeongjo"
    ],
    "explanation": "Acting on the petition of Punggi magistrate Yi Hwang, King Myeongjong bestowed the chartered name \"Sosu Seowon\" in 1550. With this, Sosu Seowon became the first royally chartered Confucian academy in Korea to be named directly by the king."
  },
  "q24": {
    "question": "When Heungseon Daewongun carried out his sweeping abolition of Confucian academies across the country in 1871, what happened to Sosu Seowon?",
    "options": [
      "It was one of the academies allowed to remain rather than being torn down",
      "It was the very first to be demolished",
      "It was first founded around this time",
      "It burned down and vanished during the Japanese colonial period"
    ],
    "explanation": "During Heungseon Daewongun's order to abolish the Confucian academies, most seowon were torn down, but Sosu Seowon survived as one of the 47 academies (seowon and shrines) permitted to remain. Thanks to this, it preserves the appearance of Korea's first Confucian academy to this day."
  },
  "q25": {
    "question": "Under what name was Sosu Seowon inscribed on the UNESCO World Heritage List in 2019, together with eight other academies?",
    "options": [
      "Sansa, Buddhist Mountain Monasteries in Korea",
      "Royal Tombs of the Joseon Dynasty",
      "Seowon, Korean Neo-Confucian Academies",
      "Getbol, Korean Tidal Flats"
    ],
    "explanation": "In 2019, Sosu Seowon was inscribed on the UNESCO World Heritage List under the name \"Seowon, Korean Neo-Confucian Academies,\" together with eight other sites. \"Sansa, Buddhist Mountain Monasteries in Korea\" is a heritage grouping of temples such as Buseoksa, while the \"Royal Tombs of the Joseon Dynasty\" and \"Getbol, Korean Tidal Flats\" are both separate inscribed properties."
  },
  "q26": {
    "question": "Which single character, carved in large script on a rock in the Jukgyecheon Stream that runs alongside Sosu Seowon, gave the rock its name, \"Gyeongja Bawi\" (the Gyeong-Character Rock)?",
    "options": [
      "Chung (忠, loyalty)",
      "Gyeong (敬, reverence)",
      "Hyo (孝, filial piety)",
      "Ye (禮, propriety)"
    ],
    "explanation": "On a rock across the Jukgyecheon Stream in front of Sosu Seowon, the character \"gyeong (敬),\" meaning reverence, is carved and painted in red, which is why the rock is called \"Gyeongja Bawi (敬字岩),\" the Gyeong-Character Rock. Gyeong (敬) was the most highly prized virtue of self-cultivation in the Neo-Confucian tradition that ran from Zhu Xi to An Hyang, Ju Se-bung, and Yi Hwang."
  },
  "q27": {
    "question": "Which building, forming the heart of Sosu Seowon, was where Confucian students gathered to attend lectures and pursue their studies?",
    "options": [
      "The Ganghakdang lecture hall",
      "Muryangsujeon Hall",
      "Beomjongnu (the bell pavilion)",
      "Iljumun (the One-Pillar Gate)"
    ],
    "explanation": "Sosu Seowon's buildings are arranged around the Ganghakdang, the lecture hall where learning was taught and studied. Muryangsujeon Hall, the Beomjongnu bell pavilion, and the Iljumun gate are all buildings of a Buddhist temple, not of a Confucian academy."
  },
  "q28": {
    "question": "Which tree forms the lush grove surrounding the entrance to Sosu Seowon, known as the \"scholar trees\" (hakjasu, 學者樹)?",
    "options": [
      "Ginkgo",
      "Bamboo",
      "Maple",
      "Pine"
    ],
    "explanation": "At the entrance to Sosu Seowon grows a dense grove of red pines—pine trees red both without and within—which are called the \"scholar trees\" (hakjasu). Like the pine that never loses its green even in the cold of winter, they symbolize the unwavering integrity of the scholar (seonbi)."
  },
  "q29": {
    "question": "Which signature spring flower colony dyes the area around Birobong Peak on Sobaeksan Mountain red in May and June?",
    "options": [
      "Camellia",
      "Royal azalea (cheoljjuk)",
      "Rape (canola) blossoms",
      "Plum blossoms"
    ],
    "explanation": "The royal azalea (cheoljjuk) colony along the Birobong ridge of Sobaeksan Mountain bursts into full bloom in May and June, making it a spring attraction that draws visitors from across the country. Camellias (on the southern coast), rape blossoms (on Jeju), and plum blossoms (in the south in early spring) are far removed from the spring flower colonies of Sobaeksan's high ridges."
  },
  "q30": {
    "question": "On Sobaeksan's winter ridges, moisture freezes onto tree branches to create a spectacular scene also known as \"snow blossoms.\" What is it called?",
    "options": [
      "Sea of clouds (unhae)",
      "Frozen waterfall (bingpok)",
      "Sanggodae (rime frost)",
      "Rainbow"
    ],
    "explanation": "Sanggodae is the phenomenon in which fog or water vapor freezes white onto tree branches; it is a signature spectacle of Sobaeksan's winter ridges and is also called \"snow blossoms.\" Unhae refers to a sea of clouds and bingpok to a frozen waterfall—both different phenomena."
  },
  "q31": {
    "question": "In what year was Sobaeksan designated as a national park?",
    "options": [
      "1967",
      "1987",
      "1995",
      "2007"
    ],
    "explanation": "Sobaeksan was designated as Korea's 18th national park in December 1987. The year 1967 is when Jirisan, Korea's very first national park, was designated—20 years before Sobaeksan."
  },
  "q32": {
    "question": "What is the signature local product that the Punggi area of Yeongju, at the foot of Sobaeksan, has cultivated since the Joseon Dynasty?",
    "options": [
      "Ginseng",
      "Green tea",
      "Hanji (traditional Korean paper)",
      "Sun-dried sea salt"
    ],
    "explanation": "The Punggi area at the foot of Sobaeksan has grown ginseng since the Joseon Dynasty, and 'Punggi ginseng' remains a product that represents Yeongju to this day. Green tea (Boseong, Hadong), hanji (Jeonju), and sun-dried sea salt (the southwestern coast) are specialties of other regions."
  },
  "q33": {
    "question": "Which alpine conifer grows in colonies near the summit of Sobaeksan and is said to 'live a thousand years and stand a thousand years after death'?",
    "options": [
      "Bamboo",
      "Camellia",
      "Yew (jumok)",
      "Ginkgo"
    ],
    "explanation": "The yew (jumok) colonies along the Birobong ridge of Sobaeksan are well known as long-lived alpine conifers, famously described as living 'a thousand years alive and a thousand years dead.' Bamboo, camellia, and ginkgo are species entirely different from the yew colonies of the high ridges."
  },
  "q34": {
    "question": "Which river flows around three sides of Museom Village, making it an 'island on the water'?",
    "options": [
      "Naeseongcheon Stream",
      "Nakdonggang River",
      "Namhangang River",
      "Seomjingang River"
    ],
    "explanation": "The Naeseongcheon Stream winds around three sides of the village, so that it looks like an island floating on the water—hence the name 'Museom (水島),' meaning 'water island.' The Nakdonggang, Namhangang, and Seomjingang rivers do not flow around Museom Village."
  },
  "q35": {
    "question": "Which of the following is a representative traditional old house located in Museom Village?",
    "options": [
      "Seongyojang in Gangneung",
      "Haeudang House",
      "the Choi Clan House in Gyeongju",
      "Yangjindang in Hahoe, Andong"
    ],
    "explanation": "Haeudang House, together with Manjukjae, is one of the traditional houses that represent Museom Village. Seongyojang is in Gangneung, the Choi Clan House is in Gyeongju, and Yangjindang is in Hahoe Village in Andong—none of which have any connection to Museom Village."
  },
  "q36": {
    "question": "What was the traditional passage that once linked Museom Village to the outside world?",
    "options": [
      "A cable car",
      "A submersible bridge",
      "A single-log bridge (oenamu-dari)",
      "A tunnel"
    ],
    "explanation": "The single-log bridge (oenamu-dari) laid across the Naeseongcheon Stream was Museom Village's only link to the outside world, a tradition carried on today through the summer 'Museom Single-Log Bridge Festival.' A cable car, a submersible bridge, and a tunnel were not the village's traditional passage."
  },
  "q37": {
    "question": "Which two clans formed the single-clan village of Museom from the Joseon Dynasty onward?",
    "options": [
      "the Andong Gwon clan and the Pungsan Ryu clan",
      "the Gyeongju Choi clan and the Yeogang Yi clan",
      "the Uiseong Kim clan and the Jeonju Yi clan",
      "the Bannam Park clan and the Seonseong Kim clan"
    ],
    "explanation": "Museom Village was founded in 1666 by Park Su of the Bannam Park clan, after which the Seonseong Kim clan married into it, and the two clans have settled there together for some 350 years as a single-clan village. The Andong Gwon and Pungsan Ryu clans represent other places, such as Hahoe Village in Andong, and have no connection to Museom Village."
  },
  "q38": {
    "question": "What nickname did the Naeseongcheon Stream, which curves around Museom Village, earn for its clear water and white sandy banks?",
    "options": [
      "the Amazon of Korea",
      "Korea's last sand river",
      "the Niagara of Korea",
      "the Cheonggyecheon of Korea"
    ],
    "explanation": "The Naeseongcheon is called Korea's 'last sand river,' preserving the original form of the Korean Peninsula's rivers, and its broad white sandy banks and clear water make it a sacred site for photographers. 'The Amazon of Korea' is a nickname for the Donggang River (Eorayeon in Yeongwol), while Niagara and Cheonggyecheon have nothing to do with the Naeseongcheon."
  },
  "q39": {
    "question": "Which of the following is something that Museom Village (its single-log bridge) was selected for?",
    "options": [
      "UNESCO World Cultural Heritage",
      "UNESCO Global Geopark",
      "a Ramsar Wetland",
      "Korea's 100 Most Beautiful Roads"
    ],
    "explanation": "The single-log bridge of Museom Village was selected as one of 'Korea's 100 Most Beautiful Roads' by the Ministry of Construction and Transportation (now the Ministry of Land, Infrastructure and Transport). UNESCO World Cultural Heritage, UNESCO Global Geopark, and Ramsar Wetland status are not related to Museom Village."
  },
  "q40": {
    "question": "Which is the correct administrative district where Museom Village is located?",
    "options": [
      "Pungcheon-myeon, Andong, Gyeongbuk",
      "Munsu-myeon, Yeongju, Gyeongbuk",
      "Bonghwa-eup, Bonghwa County, Gyeongbuk",
      "Buseok-myeon, Yeongju, Gyeongbuk"
    ],
    "explanation": "Museom Village lies in Munsu-myeon (Sudo-ri), Yeongju, Gyeongsangbuk-do. Pungcheon-myeon in Andong is where Hahoe Village is located, and Buseok-myeon in Yeongju is where Buseoksa Temple stands—both different from Museom Village."
  },
  "q41": {
    "question": "In which period was Yeongju Hyanggyo, a state-run school, first established?",
    "options": [
      "the reign of King Gyeongdeok of Unified Silla (8th century)",
      "the reign of King Gongmin of Goryeo (1368)",
      "the reign of King Sejong of Joseon (15th century)",
      "the reign of King Gojong of Joseon (19th century)"
    ],
    "explanation": "Yeongju Hyanggyo is said to have been founded as a local state-run school in 1368, the 17th year of King Gongmin of Goryeo. The key point is that it was established in the late Goryeo period—not in Unified Silla or Joseon."
  },
  "q42": {
    "question": "Which of the following best describes the building layout of Yeongju Hyanggyo?",
    "options": [
      "A 'lecture hall in front, shrine behind' (jeonhak-humyo) layout, with the lecture space on lower ground in front and the ritual (enshrinement) space on higher ground behind",
      "A 'shrine in front, lecture hall behind' (jeonmyo-huhak) layout, with the ritual space in front and the lecture space behind",
      "A symmetrical layout, with the lecture building and the ritual building placed side by side to the left and right",
      "A single-building structure that combines both the lecture and ritual functions in one pavilion"
    ],
    "explanation": "Yeongju Hyanggyo follows the jeonhak-humyo layout, placing the lecture space for study (such as the Myeongnyundang) on the lower ground in front and the ritual space for ancestral rites (the Daeseongjeon) on the higher ground behind. Built on a slope, it sets the ritual space higher and deeper to express hierarchy—a distinctive feature."
  },
  "q43": {
    "question": "Who is the central sage enshrined in the place of honor (jubyeok, the main-wall position) in the Daeseongjeon of Yeongju Hyanggyo?",
    "options": [
      "the Great Monk Uisang",
      "Ju Se-bung",
      "the maiden Seonmyo",
      "Confucius"
    ],
    "explanation": "In the highest position of the Daeseongjeon, the spirit tablet of Confucius, the founder of Confucianism, is enshrined as the jubyeok (main wall), with the tablets of various other sages enshrined around it. The Great Monk Uisang was the monk who founded Buseoksa Temple, Ju Se-bung was the magistrate of Punggi who established Sosu Seowon, and Seonmyo is a figure from the Buseoksa legend—none of them are connected to the place of honor in the Daeseongjeon."
  },
  "q44": {
    "question": "What is the name of the Confucian ritual held at Yeongju Hyanggyo on the first jeong day (sangjeong-il) of spring and autumn to honor Confucius along with his disciples and the sages?",
    "options": [
      "Jongmyo Jerye (the royal ancestral rite)",
      "Seokjeon Daeje (釋奠大祭)",
      "Byeolsin-gut",
      "Yeongsanjae"
    ],
    "explanation": "Each year, on the first jeong day of spring and autumn, Yeongju Hyanggyo performs the Seokjeon Daeje, a rite offered to Confucius and his disciples and the sages. Jongmyo Jerye is the rite of the Joseon royal ancestral shrine, Byeolsin-gut is a village shamanic ritual, and Yeongsanjae is a Buddhist ceremony—all different in nature from the Confucian rites of a hyanggyo."
  },
  "q45": {
    "question": "When Heungseon Daewongun carried out a sweeping closure of seowon (private academies) across the country (the Seowon Abolition Order), what happened to the hyanggyo, including Yeongju Hyanggyo?",
    "options": [
      "The hyanggyo, like the seowon, were all torn down and disappeared",
      "After being abolished, they were converted into Buddhist temples",
      "The hyanggyo were not subject to the abolition order and remained intact",
      "Only Yeongju Hyanggyo was specially exempted from abolition"
    ],
    "explanation": "Although Heungseon Daewongun sweepingly closed seowon across the country, the hyanggyo—local state-run schools—were not subject to the abolition order, so the hyanggyo, including Yeongju Hyanggyo, remained intact. The claims that all hyanggyo were torn down, or that only Yeongju Hyanggyo was specially exempted, are not true."
  },
  "q46": {
    "question": "In which area is the Punggi Ginseng Museum, which exhibits the history, cultivation, trade, and medicinal properties of Punggi ginseng, located?",
    "options": [
      "Punggi-eup, Yeongju-si, Gyeongsangbuk-do",
      "Geumsan-gun, Chungcheongnam-do",
      "Pyeongchang-gun, Gangwon-do",
      "Jinan-gun, Jeollabuk-do"
    ],
    "explanation": "The Punggi Ginseng Museum is located in Punggi-eup, Yeongju-si, Gyeongsangbuk-do, where it presents the ginseng history, cultivation, global trade, and pharmacology of the Punggi region, known as the birthplace of ginseng cultivation in Korea. Geumsan and Jinan are also famous for ginseng, but this museum sits in Punggi, Yeongju."
  },
  "q47": {
    "question": "In which season is the Punggi Ginseng Festival, held each year in Punggi to coincide with the ginseng harvest, mainly held?",
    "options": [
      "Spring",
      "Autumn",
      "Midsummer",
      "Midwinter"
    ],
    "explanation": "The Punggi Ginseng Festival takes place around September and October, when ginseng is harvested—that is, in autumn. It is held every year as the signature local festival of Punggi, the home of Korean ginseng."
  },
  "q48": {
    "question": "Who is said to have taken office as magistrate of Punggi in 1541 and to have first succeeded in the artificial cultivation of ginseng using wild-ginseng seeds from Sobaeksan Mountain?",
    "options": [
      "Toegye Yi Hwang",
      "Jeong Do-jeon",
      "An Hyang",
      "Ju Se-bung"
    ],
    "explanation": "The artificial cultivation of Punggi ginseng is said to have begun when Ju Se-bung, the magistrate of Punggi, transplanted wild-ginseng seeds from Sobaeksan Mountain into fields and raised them. Ju Se-bung is also well known as the man who founded Baegundong Seowon (later Sosu Seowon), Korea's first seowon (Confucian academy), in the same Punggi area."
  },
  "q49": {
    "question": "From which mountain did the wild-ginseng seeds that Ju Se-bung is said to have used for the artificial cultivation of Punggi ginseng originate?",
    "options": [
      "Jirisan",
      "Sobaeksan",
      "Hallasan",
      "Seoraksan"
    ],
    "explanation": "The cultivation of Punggi ginseng is said to have begun when wild-ginseng seeds from Sobaeksan Mountain, which embraces Punggi, were transplanted into fields. The mountain terrain and climate of the foothills of Sobaeksan are known to be well suited to ginseng cultivation."
  },
  "q50": {
    "question": "Which place is said to have been ranked foremost among the Sipseungjiji (Ten Places of Refuge)—the auspicious sites safe from war—by the late-Joseon book of prophecy Jeonggamnok?",
    "options": [
      "Hwaseong Fortress in Suwon",
      "Yangdong Village in Gyeongju",
      "Hahoe Village in Andong",
      "Punggi (Geumgye-chon)"
    ],
    "explanation": "In listing the Sipseungjiji—the ten places of refuge where one could preserve one's life by escaping turmoil—the Jeonggamnok is said to have named Geumgye-chon in Punggi (the Geumgye-ri area) as the very first and foremost place of refuge."
  },
  "q51": {
    "question": "Which is the correct main purpose for which Yeongju Seonbichon (Scholars' Village) was created?",
    "options": [
      "To carry on the spirit of the Joseon-era seonbi (scholars) and traditional culture and to let visitors experience it",
      "To commemorate a great battle of the Japanese Invasions of 1592 (Imjin War)",
      "To serve as a summer detached palace for the Joseon royal family",
      "To serve as a collective residence for mine workers"
    ],
    "explanation": "Seonbichon is a traditional-culture experience village created by the city of Yeongju to carry on the spirit of the seonbi (Confucian scholars). Through hanok lodging, etiquette education, and traditional hands-on programs, it was designed as a space for learning about the life and spirit of Joseon scholars."
  },
  "q52": {
    "question": "In the hanok of Seonbichon, separating the inner quarters (anchae) from the men's quarters (sarangchae) reflects which Confucian norm of daily life?",
    "options": [
      "Sanonggongsang (the four classes: scholar, farmer, artisan, merchant)",
      "Ipsinyangmyeong (achieving success and winning fame)",
      "Namnyeoyubyeol (the distinction of roles between men and women)",
      "Gwonseonjingak (rewarding good and punishing evil)"
    ],
    "explanation": "The hanok of Seonbichon are divided into spaces such as the numaru (raised wooden hall), the sarangchae (men's quarters), and the anchae (inner/women's quarters). Distinguishing the sarangchae as a male space from the anchae as a female space reflects the Confucian notion of namnyeoyubyeol, the separation of domains between men and women."
  },
  "q53": {
    "question": "Which statement about the make-up of the Joseon-era houses recreated at Seonbichon is correct?",
    "options": [
      "It recreates houses of various social classes together, including the yangban (nobility) and commoners",
      "It recreates only palace buildings of the Joseon royal family",
      "It recreates only yangban (noble) houses",
      "It recreates only Buddhist temple buildings"
    ],
    "explanation": "Seonbichon recreates not only the old mansions of the yangban class but also commoner dwellings such as the kkachigumeong-jip and yangtong-jip (regional commoner house types), as well as the houses where servants and slaves lived, so that the daily lives of the various social classes of the Joseon era can be seen in one place. It is therefore not limited to yangban houses, nor only to palaces or temples."
  },
  "q54": {
    "question": "What is the name of the signature festival held every year in the area of Seonbichon and Sosu Seowon?",
    "options": [
      "Punggi Ginseng Festival",
      "Andong International Mask Dance Festival",
      "Jinju Namgang Lantern Festival",
      "Seonbi (Scholar) Culture Festival"
    ],
    "explanation": "Every year, the Yeongju Korean Seonbi Culture Festival (Seonbi Culture Festival) is held in the area of Seonbichon and the nearby Sosu Seowon. At the festival, visitors can directly experience scholar culture, including traditional weddings, the tea ceremony (dado), and calligraphy. The Punggi Ginseng Festival is held in the same Yeongju but is a separate event held in Punggi-eup."
  },
  "q55": {
    "question": "Which activity can visitors experience firsthand at the Seonbi Culture Festival in the Seonbichon area?",
    "options": [
      "A fishing experience digging for clams on a tidal flat",
      "Experiencing scholar culture such as a traditional wedding, the tea ceremony (dado), and calligraphy",
      "A skiing lesson at a sledding slope",
      "Shooting practice at an indoor shooting range"
    ],
    "explanation": "At the Yeongju Korean Seonbi Culture Festival, visitors can directly experience the everyday culture of the scholars, such as traditional weddings, the tea ceremony, calligraphy and ink rubbings, and traditional etiquette. It is far removed from activities like tidal-flat outings, skiing, or shooting."
  },
  "q56": {
    "question": "Which body established and operates the Sosu Museum, located in Sunheung-myeon, Yeongju-si, Gyeongsangbuk-do?",
    "options": [
      "Bonghwa-gun",
      "Yeongju-si",
      "Andong-si",
      "Yecheon-gun"
    ],
    "explanation": "The Sosu Museum is a municipal museum that the city of Yeongju established and operates in Sunheung-myeon to preserve and provide education about the Confucian and scholar-culture heritage of the Sosu Seowon area. Its operating body is therefore the city of Yeongju."
  },
  "q57": {
    "question": "Which stream flows through the Sunheung area where Sosu Seowon and the Sosu Museum stand and—after Yi Hwang set up the Chwihandae pavilion on its bank—came to be called the Jukgye Gugok (Nine Bends of Jukgye)?",
    "options": [
      "Naeseongcheon",
      "Nakdonggang",
      "Jukgyecheon",
      "Namhangang"
    ],
    "explanation": "Jukgyecheon is a stream that rises from Sobaeksan Mountain and flows through the Sunheung area where Sosu Seowon and the Sosu Museum sit; its scenery is so outstanding that it is called the Jukgye Gugok (Nine Bends of Jukgye). Yi Hwang placed the Chwihandae pavilion on a rock across the Jukgyecheon and selected nine scenic spots along the watercourse to designate as the Jukgye Gugok."
  },
  "q58": {
    "question": "As what nationally designated cultural heritage is the portrait of An Hyang—held by Sosu Seowon and passed down within the domain of the Sosu Museum—designated?",
    "options": [
      "National Treasure No.32",
      "Treasure No.1403",
      "Treasure No.1",
      "National Treasure No.111"
    ],
    "explanation": "The portrait of An Hyang held by Sosu Seowon is a late-Goryeo portrait designated National Treasure No.111 in 1962; it is a half-length portrait of Hoeheon An Hyang (1243–1306), who introduced Neo-Confucianism to Korea. It is a National Treasure—not a Treasure—and its designation number is No.111."
  },
  "q59": {
    "question": "On the site where Sosu Seowon (the former Baegundong Seowon) and the Sosu Museum now stand, there was originally a temple from the Unified Silla period. What was that temple's name?",
    "options": [
      "Suksusa",
      "Bongjeongsa",
      "Huibangsa",
      "Buseoksa"
    ],
    "explanation": "The site of Sosu Seowon was originally the site of Suksusa, a Unified Silla temple; a flagpole support (dangganjiju, Treasure No.59) still remains there, and in 1953 Unified Silla-style bronze Buddha statues and other artifacts were excavated within the grounds. Such Silla and Goryeo relics from the Sunheung area are also covered within the domain of the Sosu Museum."
  },
  "q60": {
    "question": "Which is the most appropriate exhibition theme on which the Sosu Museum focuses?",
    "options": [
      "Buddhist temple art",
      "Marine life and ecology",
      "Confucian and scholar culture",
      "Modern and contemporary industrial technology"
    ],
    "explanation": "The Sosu Museum takes as its theme the Confucian culture and scholar (seonbi) culture centered on Sosu Seowon, Korea's first royally chartered seowon. Because it exhibits the Yeongnam Neo-Confucian scholarly lineage running from An Hyang to Ju Se-bung to Yi Hwang, along with the life of the scholars, its core theme is Confucian and scholar culture."
  }
};
const canonicalEn: Record<string, CanonicalEnOv> = {
  "buseoksa-entasis": {
    "question": "Why are the entasis pillars of Buseoksa Temple's Muryangsujeon Hall so special?",
    "answer": "The baeheullim pillar is built with the entasis technique, in which the middle of the column swells outward more than the top and bottom—at once correcting optical distortion and distributing the structural load, so that visual beauty and engineering merit are achieved together. Muryangsujeon Hall at Buseoksa Temple (National Treasure No. 18) is the high point of mid-Goryeo wooden architecture, and because the very same technique appears in the Parthenon of ancient Greece, it is celebrated as a meeting of Eastern and Western architectural wisdom. Inscribed on the UNESCO World Heritage list as part of 'Sansa, Buddhist Mountain Monasteries in Korea,' Muryangsujeon is one of the oldest surviving wooden buildings in the country, and its entasis pillars stand as the symbol of that legacy.",
    "matchPatterns": [
      "entasis",
      "buseoksa pillar",
      "buseoksa column",
      "muryangsujeon pillar",
      "bulging pillar",
      "swollen column"
    ]
  },
  "sosu-first-academy": {
    "question": "Why is Sosu Seowon regarded as Korea's first Confucian academy?",
    "answer": "Sosu Seowon was founded in 1543 as 'Baegundong Seowon' by Ju Se-bung, the magistrate of Punggi, to enshrine the Goryeo Neo-Confucian scholar An Hyang—making it the first seowon (private Confucian academy) of the Joseon dynasty. In 1550, Toegye Yi Hwang, newly appointed magistrate of Punggi, petitioned the court for royal recognition, and King Myeongjong bestowed the name plaque 'Sosu (紹修),' establishing it as the very first state-sanctioned, royally chartered academy (sahaek seowon). Sosu Seowon went on to serve as a base for spreading Neo-Confucianism and as the standard model for the seowon system, and in 2019 it was inscribed on the UNESCO World Heritage list as part of 'Seowon, Korean Neo-Confucian Academies.'",
    "matchPatterns": [
      "first seowon",
      "first confucian academy",
      "oldest seowon",
      "sosu seowon",
      "royal charter academy",
      "sahaek seowon"
    ]
  },
  "yeongju-sunbi-culture": {
    "question": "What is the sunbi (scholar) culture of Yeongju?",
    "answer": "Yeongju is the cradle of the Korean sunbi (scholar) spirit: it was here that An Hyang introduced Neo-Confucianism from Yuan China, Ju Se-bung took root the seowon system by founding Baegundong Seowon, and the scholarly lineage was carried forward by Toegye Yi Hwang. The sunbi spirit is the culture of intellectuals who embodied righteousness, integrity, devotion to learning, and a principled life set apart from worldly power; Yeongju is regarded as the region that has inherited this spirit in its purest form. Today the Seonbichon hanok experience village, Sosu Seowon, and the local Confucian school (hyanggyo) give that spirit living shape, and it is carried on and renewed each year through the Yeongju Sunbi Culture Festival.",
    "matchPatterns": [
      "sunbi culture",
      "seonbi culture",
      "scholar culture",
      "yeongju scholar",
      "sunbi spirit"
    ]
  },
  "museom-bridge": {
    "question": "I'm curious about the history of the single-log bridge in Museom Village.",
    "answer": "The single-log footbridge (oenamu-dari) of Museom Village was, for more than 350 years, the only path linking Sudo-ri—a village ringed on three sides by the Naeseongcheon Stream—to the outside world. Each spring the villagers lashed birch logs together and laid the bridge anew, and weddings, funerals, and the daily walk to school all depended on this single crossing. It vanished in 1979 with the building of a concrete bridge, but in 2005 it was restored to preserve the region's heritage. Today it stands as the emblem of the 'Museom Single-Log Bridge Festival,' held every October, and has become a landmark known across the nation.",
    "matchPatterns": [
      "single log bridge",
      "single-log bridge",
      "log footbridge",
      "museom bridge",
      "museom village",
      "oenamu bridge"
    ]
  },
  "buseoksa-sosu-day": {
    "question": "Could you recommend a one-day course covering Buseoksa Temple and Sosu Seowon?",
    "answer": "I'd suggest setting out from Buseoksa Temple around 9 a.m. Tour the halls in the order of Muryangsujeon, Josadang, and Seonmyogak; in autumn, the foliage of the thousand-year-old ginkgo tree and the sunset views are simply stunning. For lunch, try the Sunheung Korean beef just below the temple, or the restaurants near Yeongju Station. Around 2 p.m., move on to Sosu Seowon (about a 25-minute drive) and take in the Ganghakdang lecture hall, the Munseonggongmyo shrine, the Chwihandae rock carving, and the walking path along the Jukgyecheon Stream; linking it with the adjacent Yeongju Seonbichon rounds out a full and rewarding day. As of 2026, a combined ticket (Buseoksa + Sosu Seowon + Seonbichon) discount is available.",
    "matchPatterns": [
      "buseoksa and sosu",
      "buseoksa sosu seowon",
      "one day course",
      "day itinerary",
      "unesco day trip",
      "one day tour"
    ]
  }
};

export function applyHeritageEn(arr: Heritage[]): Heritage[] {
  return arr.map((h) => {
    const o = heritageEn[h.id];
    if (!o) return h;
    return {
      ...h,
      name: h.nameEn || h.name,
      nameEn: h.name,
      description: o.description,
      history: o.history,
      architecture: o.architecture || h.architecture,
      hiddenStory: o.hiddenStory,
      tags: o.tags,
      visitInfo: { ...h.visitInfo, hours: o.hours, fee: o.fee, closedDays: o.closedDays },
      location: { ...h.location, address: o.address },
    };
  });
}

export function applyFiguresEn(arr: HistoricalFigure[]): HistoricalFigure[] {
  return arr.map((f) => {
    const o = figuresEn[f.id];
    if (!o) return f;
    return { ...f, name: o.name, ho: o.ho || f.ho, role: o.role, contribution: o.contribution || f.contribution, description: o.description };
  });
}

export function applyCoursesEn(arr: CourseRecommendation[]): CourseRecommendation[] {
  return arr.map((c) => {
    const o = coursesEn[c.id];
    if (!o) return c;
    return { ...c, name: o.name, duration: o.duration, description: o.description, bestFor: o.bestFor || c.bestFor, transport: o.transport || c.transport, highlights: o.highlights, itinerary: o.itinerary };
  });
}

export function applyQuizEn(arr: QuizQuestion[]): QuizQuestion[] {
  return arr.map((q) => {
    const o = quizEn[q.id];
    if (!o) return q;
    return { ...q, question: o.question, options: o.options, explanation: o.explanation };
  });
}

export function applyCanonicalEn(arr: CanonicalQA[]): CanonicalQA[] {
  return arr.map((qa) => {
    const o = canonicalEn[qa.id];
    if (!o) return qa;
    return { ...qa, question: o.question, answer: o.answer, matchPatterns: o.matchPatterns };
  });
}
