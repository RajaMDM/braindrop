export const COURSES = {
  10: {
    mathematics: {
      name: 'Mathematics',
      chapters: [
        { id: 'ch1', title: 'Real Numbers', lessons: ["Euclid's Division Lemma", "Fundamental Theorem of Arithmetic", "Irrational Numbers", "Decimal Expansions of Rationals"] },
        { id: 'ch2', title: 'Polynomials', lessons: ["Zeroes of a Polynomial", "Relationship between Zeroes & Coefficients", "Division Algorithm for Polynomials"] },
        { id: 'ch3', title: 'Pair of Linear Equations', lessons: ["Graphical Method", "Substitution Method", "Elimination Method", "Cross-Multiplication Method"] },
        { id: 'ch4', title: 'Quadratic Equations', lessons: ["Standard Form & Solutions", "Factorisation Method", "Completing the Square", "Quadratic Formula & Discriminant"] },
        { id: 'ch5', title: 'Arithmetic Progressions', lessons: ["Introduction to AP", "nth Term of AP", "Sum of n Terms", "Applications of AP"] },
        { id: 'ch6', title: 'Triangles', lessons: ["Similar Figures", "Similarity Criteria (AA, SSS, SAS)", "Pythagoras Theorem", "Areas of Similar Triangles"] },
        { id: 'ch7', title: 'Coordinate Geometry', lessons: ["Distance Formula", "Section Formula", "Area of a Triangle using Coordinates"] },
        { id: 'ch8', title: 'Introduction to Trigonometry', lessons: ["Trigonometric Ratios", "Ratios of Specific Angles", "Complementary Angles", "Trigonometric Identities"] },
        { id: 'ch9', title: 'Applications of Trigonometry', lessons: ["Heights and Distances", "Angle of Elevation", "Angle of Depression", "Problems with Two Triangles"] },
        { id: 'ch10', title: 'Circles', lessons: ["Tangent to a Circle", "Theorems on Tangents", "Number of Tangents from a Point"] },
        { id: 'ch11', title: 'Constructions', lessons: ["Division of a Line Segment", "Tangent to a Circle Construction", "Similar Triangle Construction"] },
        { id: 'ch12', title: 'Areas Related to Circles', lessons: ["Perimeter & Area of Circle", "Area of Sector & Segment", "Areas of Combinations of Figures"] },
        { id: 'ch13', title: 'Surface Areas & Volumes', lessons: ["Combination of Solids", "Volume of Combined Solids", "Conversion of Solids", "Frustum of a Cone"] },
        { id: 'ch14', title: 'Statistics', lessons: ["Mean of Grouped Data", "Mode of Grouped Data", "Median of Grouped Data", "Ogive Curves"] },
        { id: 'ch15', title: 'Probability', lessons: ["Classical Probability", "Complementary Events", "Impossible & Sure Events", "Problems on Probability"] }
      ]
    },
    science: {
      name: 'Science',
      chapters: [
        { id: 'ch1', title: 'Chemical Reactions & Equations', lessons: ["Types of Chemical Reactions", "Balancing Equations", "Oxidation & Reduction", "Corrosion & Rancidity"] },
        { id: 'ch2', title: 'Acids, Bases & Salts', lessons: ["Properties of Acids & Bases", "pH Scale", "Salts & their Properties", "Bleaching Powder & Baking Soda"] },
        { id: 'ch3', title: 'Metals & Non-metals', lessons: ["Physical Properties", "Chemical Properties", "Reactivity Series", "Extraction of Metals"] },
        { id: 'ch4', title: 'Carbon & its Compounds', lessons: ["Bonding in Carbon", "Homologous Series", "Chemical Properties of Carbon Compounds", "Soaps & Detergents"] },
        { id: 'ch5', title: 'Periodic Classification', lessons: ["Early Classification", "Mendeleev's Table", "Modern Periodic Table", "Trends in Properties"] },
        { id: 'ch6', title: 'Life Processes', lessons: ["Nutrition", "Respiration", "Transportation", "Excretion"] },
        { id: 'ch7', title: 'Control & Coordination', lessons: ["Nervous System", "Reflex Actions", "Hormones in Animals", "Plant Hormones"] },
        { id: 'ch8', title: 'How do Organisms Reproduce', lessons: ["Asexual Reproduction", "Sexual Reproduction in Plants", "Sexual Reproduction in Humans", "Reproductive Health"] },
        { id: 'ch9', title: 'Heredity & Evolution', lessons: ["Mendel's Laws", "Sex Determination", "Evolution & Classification", "Speciation"] },
        { id: 'ch10', title: 'Light — Reflection & Refraction', lessons: ["Reflection by Mirrors", "Mirror Formula", "Refraction through Lens", "Lens Formula & Power"] },
        { id: 'ch11', title: 'Human Eye & Colourful World', lessons: ["Structure of Eye", "Defects of Vision", "Refraction through Prism", "Scattering of Light"] },
        { id: 'ch12', title: 'Electricity', lessons: ["Electric Current & Circuit", "Ohm's Law", "Resistance & Resistivity", "Power & Energy"] },
        { id: 'ch13', title: 'Magnetic Effects of Current', lessons: ["Magnetic Field Lines", "Electromagnet", "Fleming's Rules", "Electric Motor & Generator"] },
        { id: 'ch14', title: 'Sources of Energy', lessons: ["Conventional Sources", "Solar Energy", "Nuclear Energy", "Environmental Consequences"] },
        { id: 'ch15', title: 'Our Environment', lessons: ["Ecosystem & Components", "Food Chains & Webs", "Ozone Layer", "Waste Management"] },
        { id: 'ch16', title: 'Sustainable Management', lessons: ["Forest & Wildlife", "Water Management", "Coal & Petroleum", "Natural Resource Management"] }
      ]
    },
    english: {
      name: 'English',
      chapters: [
        { id: 'ch1', title: 'A Letter to God (First Flight)', lessons: ["Summary & Theme", "Character Analysis", "Important Questions", "Vocabulary & Grammar"] },
        { id: 'ch2', title: 'Nelson Mandela (First Flight)', lessons: ["Summary & Theme", "Freedom & Apartheid", "Important Questions", "Comprehension Practice"] },
        { id: 'ch3', title: 'Two Stories about Flying', lessons: ["His First Flight — Summary", "Black Aeroplane — Summary", "Themes & Morals", "Important Questions"] },
        { id: 'ch4', title: 'From the Diary of Anne Frank', lessons: ["Summary & Context", "Character of Anne", "Important Questions", "Diary Writing Practice"] },
        { id: 'ch5', title: 'The Hundred Dresses', lessons: ["Part I Summary", "Part II Summary", "Themes — Bullying & Empathy", "Important Questions"] },
        { id: 'ch6', title: 'Formal Letter Writing', lessons: ["Format & Structure", "Complaint Letters", "Application Letters", "Practice & Common Mistakes"] },
        { id: 'ch7', title: 'Reading Comprehension', lessons: ["Factual Passages", "Discursive Passages", "Answering Techniques", "Practice Passages"] },
        { id: 'ch8', title: 'Grammar & Usage', lessons: ["Tenses Review", "Active & Passive Voice", "Direct & Indirect Speech", "Modals & Determiners"] },
        { id: 'ch9', title: 'Creative Writing', lessons: ["Story Writing", "Report Writing", "Essay Writing", "Paragraph & Article Writing"] },
        { id: 'ch10', title: 'Poetry Analysis', lessons: ["Dust of Snow & Fire and Ice", "A Tiger in the Zoo", "The Ball Poem", "Amanda & Animals"] }
      ]
    },
    'social-science': {
      name: 'Social Science',
      chapters: [
        { id: 'ch1', title: 'Rise of Nationalism in Europe', lessons: ["French Revolution & Idea of Nation", "Unification of Germany", "Unification of Italy", "Nationalism & Imperialism"] },
        { id: 'ch2', title: 'Nationalism in India', lessons: ["First World War & Nationalism", "Non-Cooperation Movement", "Civil Disobedience Movement", "Sense of Collective Belonging"] },
        { id: 'ch3', title: 'The Making of a Global World', lessons: ["Pre-Modern World", "19th Century Globalisation", "Inter-War Economy", "Post-War Reconstruction"] },
        { id: 'ch4', title: 'Resources & Development', lessons: ["Types of Resources", "Resource Planning", "Land Resources", "Soil Types & Conservation"] },
        { id: 'ch5', title: 'Agriculture', lessons: ["Types of Farming", "Cropping Patterns", "Food Security", "Technological Reforms"] },
        { id: 'ch6', title: 'Power Sharing', lessons: ["Belgium & Sri Lanka", "Why Power Sharing", "Forms of Power Sharing", "Federal & Unitary Government"] },
        { id: 'ch7', title: 'Federalism', lessons: ["What is Federalism", "Linguistic States", "Decentralisation", "Panchayati Raj"] },
        { id: 'ch8', title: 'Democracy & Diversity', lessons: ["Social Differences", "Politics of Social Divisions", "Democracy & Accommodation"] },
        { id: 'ch9', title: 'Development', lessons: ["What is Development", "Income & Other Criteria", "Human Development Index", "Sustainability"] },
        { id: 'ch10', title: 'Sectors of the Indian Economy', lessons: ["Primary, Secondary, Tertiary", "Organised & Unorganised", "Public & Private Sector", "Employment Trends"] },
        { id: 'ch11', title: 'Money & Credit', lessons: ["Money as Medium of Exchange", "Banks & Credit", "Terms of Credit", "Self-Help Groups"] },
        { id: 'ch12', title: 'Globalisation', lessons: ["What is Globalisation", "Factors of Globalisation", "WTO & MNCs", "Impact on India"] }
      ]
    },
    hindi: {
      name: 'Hindi',
      chapters: [
        { id: 'ch1', title: 'सूरदास — पद (क्षितिज)', lessons: ["पद का सारांश", "भाव व अर्थ", "काव्य सौंदर्य", "महत्वपूर्ण प्रश्न"] },
        { id: 'ch2', title: 'तुलसीदास — राम-लक्ष्मण परशुराम संवाद', lessons: ["प्रसंग व सारांश", "पात्र विश्लेषण", "काव्य सौंदर्य", "महत्वपूर्ण प्रश्न"] },
        { id: 'ch3', title: 'बालगोबिन भगत (क्षितिज)', lessons: ["कहानी का सारांश", "चरित्र चित्रण", "भाषा शैली", "महत्वपूर्ण प्रश्न"] },
        { id: 'ch4', title: 'नेताजी का चश्मा (क्षितिज)', lessons: ["कहानी का सारांश", "देशभक्ति का संदेश", "पात्र परिचय", "महत्वपूर्ण प्रश्न"] },
        { id: 'ch5', title: 'पत्र लेखन', lessons: ["औपचारिक पत्र", "अनौपचारिक पत्र", "प्रारूप व भाषा", "अभ्यास"] },
        { id: 'ch6', title: 'अनुच्छेद व निबंध लेखन', lessons: ["अनुच्छेद लेखन", "विषय चयन", "भाषा व शैली", "अभ्यास"] },
        { id: 'ch7', title: 'व्याकरण — समास', lessons: ["समास की परिभाषा", "समास के प्रकार", "समास विग्रह", "अभ्यास प्रश्न"] },
        { id: 'ch8', title: 'व्याकरण — संधि', lessons: ["संधि की परिभाषा", "स्वर संधि", "व्यंजन संधि", "विसर्ग संधि"] },
        { id: 'ch9', title: 'व्याकरण — पद परिचय', lessons: ["संज्ञा व सर्वनाम", "विशेषण व क्रिया", "अव्यय", "वाक्य में प्रयोग"] },
        { id: 'ch10', title: 'सूचना व विज्ञापन लेखन', lessons: ["सूचना लेखन प्रारूप", "विज्ञापन लेखन", "संदेश लेखन", "अभ्यास"] }
      ]
    }
  }
};
