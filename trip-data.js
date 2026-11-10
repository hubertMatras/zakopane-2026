/*
  TRIP DATA
  ---------
  This is the only file you need to edit to update the app.
  Status values: "booked", "tbc" (to be confirmed / not booked yet), "todo".
  Stay fields: "" shows "to add", null hides the field.
  Dates use YYYY-MM-DD. Times use 24h "HH:MM".
  To reuse the app for another trip, copy the folder and rewrite this file.
*/
window.TRIP = {
  title: "Zakopane Christmas 2026",
  subtitle: "London → Leipzig → Zakopane → Prague → Colmar → London",
  // Header: big headline, small line above it, extra facts under the countdown.
  headline: "Zakopane",
  kicker: "Family Christmas · December 2026",
  stats: ["6 countries", "~3,750 km"],
  // Shared Google Sheet for trip expenses.
  expensesUrl: "https://docs.google.com/spreadsheets/d/1BZSKl0PJ4PCewGORK6fU2sJ790K8vk39LWITIlis9GM/edit?usp=sharing",
  departure: "2026-12-19T05:00:00",
  returnHome: "2026-12-29T22:00:00",
  people: [
    { name: "Hubert", role: "The boss", travel: "Car from London. DFDS Dover → Dunkirk 19.12, night in Leipzig", phone: "" },
    { name: "Iwona", role: "Co-driver", travel: "Car from London. DFDS Dover → Dunkirk 19.12, night in Leipzig", phone: "" },
    { name: "Zuza", role: "", travel: "Train within Poland, meets us in Zakopane", phone: "" },
    { name: "Muhammad", role: "", travel: "Flight to Kraków (KRK) once Polish visa is approved", phone: "" }
  ],

  // Open items. Tick them off by changing status to "booked".
  bookings: [
    { item: "Muhammad: Polish (Schengen) visa", status: "tbc", note: "Waiting for approval. Most bookings below depend on this." },
    { item: "Muhammad: flight to Kraków (KRK)", status: "todo", note: "Book after visa approval. Kraków to Zakopane is about 2h by bus or car." },
    { item: "Zuza: train to Zakopane", status: "todo", note: "PKP Intercity / Polregio. Book on intercity.pl" },
    { item: "Ferry DFDS Dover → Dunkirk (19.12, 08:00)", status: "booked", note: "Arrives Dunkirk 11:00 local time. Add booking ref in Stays notes" },
    { item: "REGIOHOTEL Leipzig West (19.12 → 20.12)", status: "booked", note: "Late arrival likely. Let the hotel know" },
    { item: "Kurantówka, Zakopane (20.12 to 27.12)", status: "booked", note: "Host: +48 660 836 000" },
    { item: "Hotel: Prague (27.12)", status: "todo", note: "Waiting for visa decision" },
    { item: "Hotel: Colmar (28.12)", status: "todo", note: "Check 2026 market end date first" },
    { item: "Eurotunnel Calais → Folkestone (29.12)", status: "todo", note: "eurotunnel.com. Prices rise closer to the date" },
    { item: "Czech e-vignette", status: "todo", note: "Only buy on edalnice.cz (official). Lookalike sites overcharge" },
    { item: "Slovak e-vignette (only if driving via Slovakia)", status: "todo", note: "Only buy on eznamka.sk (official)" },
    { item: "European breakdown cover", status: "todo", note: "Check it covers all countries and winter conditions" },
    { item: "Crit'Air sticker (France)", status: "todo", note: "Only from certificat-air.gouv.fr. Order weeks ahead" }
  ],

  stays: [
    {
      name: "REGIOHOTEL Leipzig West",
      dates: "19.12 → 20.12 (1 night)",
      status: "booked",
      address: "Westringstr. 83, 04435 Schkeuditz, Germany",
      mapQuery: "REGIOHOTEL Leipzig West, Westringstr. 83, 04435 Schkeuditz, Germany",
      checkIn: "From 15:00", checkOut: "Until 11:00", ref: "", phone: "+49 5322 950130",
      notes: "Hubert and Iwona. Arrival likely 20:00 to 21:00 after about 9h from Dunkirk. Confirm late check-in and parking with the hotel."
    },
    {
      name: "Kurantówka, Zakopane",
      dates: "20.12 → 27.12 (7 nights)",
      status: "booked",
      address: "Tadeusza Brzozowskiego 19, 34-500 Zakopane, Poland",
      mapQuery: "Tadeusza Brzozowskiego 19, 34-500 Zakopane, Poland",
      checkIn: null, checkOut: null, ref: null, phone: "+48 660 836 000",
      notes: "Call the host with the expected arrival time on 20.12."
    },
    {
      name: "Prague",
      dates: "27.12 → 28.12",
      status: "todo",
      address: "",
      mapQuery: "Old Town Square, Prague",
      checkIn: "", checkOut: "", ref: "", phone: "",
      notes: "Pick a hotel with parking. Central Prague has paid resident zones (blue lines)."
    },
    {
      name: "Colmar",
      dates: "28.12 → 29.12",
      status: "todo",
      address: "",
      mapQuery: "Colmar, France",
      checkIn: "", checkOut: "", ref: "", phone: "",
      notes: "Old town is pedestrianised during markets. Pick a hotel with parking."
    }
  ],

  // Day by day. "proposed" days are a suggestion until booked.
  days: [
    {
      date: "2026-12-19", title: "London → Dover → Dunkirk → Leipzig", place: "REGIOHOTEL Leipzig West, Westringstr. 83, 04435 Schkeuditz", status: "booked",
      drive: "~2h to Dover, DFDS ferry 08:00 → 11:00 Dunkirk (local), then ~850 km / 9h to Schkeuditz",
      items: [
        "Leave London about 04:30 to 05:00. Check the DFDS booking for the check-in cut-off",
        "DFDS ferry Dover 08:00 → Dunkirk 11:00 local time (clocks go 1h forward)",
        "Dunkirk → Belgium → Dortmund → Kassel → Leipzig",
        "Swap drivers every 2h. Fuel is usually cheaper in Belgium than France",
        "Check in at REGIOHOTEL Leipzig West, Schkeuditz (late arrival)"
      ]
    },
    {
      date: "2026-12-20", title: "Leipzig → Wrocław → Kraków → Zakopane", place: "Tadeusza Brzozowskiego 19, 34-500 Zakopane", status: "booked",
      drive: "~760 km / 8h to 9h via Dresden, Görlitz, Wrocław, Katowice, Kraków",
      items: [
        "Check out early (about 08:00). It is a Sunday, so no German lorry traffic",
        "Cross into Poland at Görlitz / Zgorzelec",
        "A4 motorway. Toll section Katowice → Kraków",
        "Kraków → Zakopane on the Zakopianka (S7/DK47): often congested on weekends",
        "Check in at Kurantówka. Tell the host the expected arrival time",
        "Zuza arrives by train (time TBC)",
        "Food shop for the week by 23.12: shops are closed 24.12 (public holiday since 2025), 25.12 and 26.12. 20.12 should be a trading Sunday, but check"
      ]
    },
    {
      date: "2026-12-21", title: "Zakopane: Krupówki and Gubałówka", place: "Zakopane", status: "idea",
      items: ["Walk Krupówki", "Funicular up Gubałówka for views of the Tatras", "Oscypek and grzaniec at the market stalls"]
    },
    {
      date: "2026-12-22", title: "Zakopane: Kasprowy Wierch or skiing", place: "Zakopane", status: "idea",
      items: ["Kasprowy Wierch cable car (book a time slot online on pkl.pl)", "Alternative: skiing at Białka Tatrzańska or Polana Szymoszkowa", "Evening: thermal pools (Chochołowskie Termy or Terma Bania)"]
    },
    {
      date: "2026-12-23", title: "Zakopane: Morskie Oko or valley walk", place: "Zakopane", status: "idea",
      items: ["Morskie Oko: 9 km each way from Palenica Białczańska. Parking must be booked online", "Easier option: Dolina Kościeliska", "Check TOPR avalanche and trail conditions first"]
    },
    {
      date: "2026-12-24", title: "Wigilia (Christmas Eve)", place: "Zakopane", status: "idea",
      items: ["Public holiday: shops closed (since 2025)", "Wigilia dinner at the first star", "Pasterka (midnight mass), e.g. Sanktuarium na Krzeptówkach or the church on Krupówki"]
    },
    {
      date: "2026-12-25", title: "Christmas Day", place: "Zakopane", status: "idea",
      items: ["Public holiday: most shops closed", "Relaxed day, sledging, walk"]
    },
    {
      date: "2026-12-26", title: "Second Day of Christmas", place: "Zakopane", status: "idea",
      items: ["Public holiday: most shops closed", "Pack the car in the evening", "Refuel tonight if a station is open"]
    },
    {
      date: "2026-12-27", title: "Zakopane → Prague", place: "Prague", status: "proposed",
      drive: "~550 km / 6h30 to 7h via Kraków, Katowice, Ostrava, Brno",
      items: [
        "Check out of Kurantówka",
        "Czech e-vignette must be active before you enter Czech motorways",
        "Evening: Old Town Square and Wenceslas Square markets"
      ]
    },
    {
      date: "2026-12-28", title: "Prague → Colmar", place: "Colmar", status: "proposed",
      drive: "~720 km / 7h30 via Plzeň, Nuremberg, Stuttgart, Freiburg",
      items: [
        "Leave early to see the Colmar markets in the evening",
        "Colmar markets: confirm 2026 closing date before booking"
      ]
    },
    {
      date: "2026-12-29", title: "Colmar → Calais → London", place: "London", status: "proposed",
      drive: "~660 km / 7h to Calais, Eurotunnel 35 min, ~1h30 to London",
      items: [
        "Arrive at the Eurotunnel terminal 45 mins to 2h before your slot",
        "Duty-free allowances apply when entering the UK",
        "Home"
      ]
    }
  ],

  // Places shown in the Weather card (Open-Meteo, free, no key).
  weather: [
    { name: "Zakopane", lat: 49.2992, lon: 19.9496 },
    { name: "Kasprowy Wierch", lat: 49.2319, lon: 19.9817 },
    { name: "Prague", lat: 50.0875, lon: 14.4213 },
    { name: "Colmar", lat: 48.0794, lon: 7.3585 }
  ],

  driving: [
    {
      country: "United Kingdom", flag: "🇬🇧",
      rules: ["UK sticker on the car (not GB)", "Take V5C logbook, licence, insurance documents", "Headlamp beam deflectors for driving on the right"]
    },
    {
      country: "France", flag: "🇫🇷",
      rules: ["Hi-vis vest for every passenger, within reach", "Warning triangle", "Crit'Air sticker needed in low-emission zones (Strasbourg; check Colmar)", "Speed cameras everywhere. Radar detectors are illegal"]
    },
    {
      country: "Belgium", flag: "🇧🇪",
      rules: ["No motorway tolls for cars", "Low-emission zones in Brussels, Antwerp, Ghent need advance registration (avoid the city centres)"]
    },
    {
      country: "Germany", flag: "🇩🇪",
      rules: ["No motorway tolls for cars", "Winter tyres (alpine symbol) required when conditions are wintry", "Green Umweltzone sticker needed to enter many city centres", "Never overtake on the right. Keep the right lane"]
    },
    {
      country: "Poland", flag: "🇵🇱",
      rules: ["Dipped headlights on 24/7", "Toll on A4 Katowice → Kraków", "Alcohol limit 0.2‰ (effectively zero)", "Snow chains can be needed on mountain roads around Zakopane"]
    },
    {
      country: "Czech Republic", flag: "🇨🇿",
      rules: ["e-vignette required on motorways. Buy only on edalnice.cz", "Winter tyres required 1 Nov to 31 Mar in winter conditions", "Dipped headlights on 24/7", "Zero alcohol limit"]
    },
    {
      country: "Slovakia (only if routed this way)", flag: "🇸🇰",
      rules: ["e-vignette required on motorways. Buy only on eznamka.sk", "Google may route Zakopane → Prague through Slovakia. Decide before the day"]
    }
  ],

  zakopane: [
    { title: "Krupówki", text: "Main street. Shops, food, market stalls. Busy in the evenings.", map: "Krupówki, Zakopane" },
    { title: "Gubałówka", text: "Funicular from near Krupówki. Views of the Tatras, sledging, stalls.", map: "Gubałówka, Zakopane" },
    { title: "Kasprowy Wierch", text: "Cable car from Kuźnice to 1,987 m. Book timed tickets on pkl.pl. Closes in high wind.", map: "Kasprowy Wierch cable car, Kuźnice" },
    { title: "Morskie Oko", text: "Lake walk from Palenica Białczańska, 9 km each way on a road. Parking booked online.", map: "Palenica Białczańska parking" },
    { title: "Dolina Kościeliska", text: "Easy valley walk, good for all ages.", map: "Dolina Kościeliska" },
    { title: "Wielka Krokiew", text: "Ski jump. Viewing platform and chairlift.", map: "Wielka Krokiew, Zakopane" },
    { title: "Chochołowskie Termy", text: "Thermal pools near Witów, about 20 min drive.", map: "Chochołowskie Termy" },
    { title: "Terma Bania, Białka Tatrzańska", text: "Thermal pools next to the Kotelnica ski area.", map: "Terma Bania Białka Tatrzańska" },
    { title: "Skiing: Białka Tatrzańska", text: "Largest nearby ski area, about 30 min drive. Equipment hire on site.", map: "Kotelnica Białczańska" },
    { title: "Sanktuarium na Krzeptówkach", text: "Option for Pasterka (midnight mass) on 24.12.", map: "Sanktuarium Krzeptówki Zakopane" }
  ],

  markets: [
    {
      city: "Kraków", where: "Main Square (Rynek Główny)",
      dates: "Usually late Nov to late Dec. Check 2026 dates",
      tip: "On the way, evening of 19.12", map: "Rynek Główny, Kraków", status: "check"
    },
    {
      city: "Prague", where: "Old Town Square and Wenceslas Square",
      dates: "Usually late Nov to early Jan, so 27.12 should be fine. Check 2026 dates",
      tip: "Trdelník, svařák (mulled wine). Watch for pickpockets in crowds", map: "Old Town Square, Prague", status: "check"
    },
    {
      city: "Colmar", where: "Six markets across the old town and Petite Venise",
      dates: "Have usually closed around 29 to 30 Dec. Confirm 2026 dates before booking 28.12",
      tip: "Best after dark. Book a hotel within walking distance", map: "Petite Venise, Colmar", status: "check"
    },
    {
      city: "Strasbourg", where: "Place Broglie and the Cathedral",
      dates: "Main market usually closes on 24 Dec, so likely closed by 28.12",
      tip: "Not recommended for this trip unless 2026 dates change", map: "Place Broglie, Strasbourg", status: "warn"
    }
  ],

  documents: [
    "Passports (check expiry and that all names match bookings)",
    "Muhammad: visa in passport",
    "Driving licences (Hubert and Iwona)",
    "V5C vehicle logbook (original)",
    "Car insurance documents, confirm Europe cover",
    "European breakdown cover details",
    "GHIC / EHIC cards",
    "Travel insurance (winter sports cover if skiing)",
    "DFDS ferry booking (Dover → Dunkirk) and Eurotunnel ticket",
    "Hotel confirmations (offline copies)",
    "Bank cards with no foreign fees + some PLN, CZK, EUR cash"
  ],

  carKit: [
    "UK sticker",
    "Headlamp beam deflectors",
    "Hi-vis vests (one per person)",
    "Warning triangle",
    "Winter tyres checked (tread and alpine symbol)",
    "Snow chains",
    "Ice scraper and de-icer",
    "Screenwash rated to -20°C",
    "Spare bulbs, first aid kit",
    "Phone holder, chargers, power bank",
    "Blanket, water and snacks in case of delays"
  ],

  packing: [
    "Warm coat, hat, gloves, scarf",
    "Waterproof winter boots",
    "Crampons / microspikes for icy trails",
    "Thermal layers",
    "Swimwear (thermal pools)",
    "Smart outfit for Wigilia",
    "Christmas presents",
    "Medication",
    "EU plug adaptors",
    "Sunglasses and sun cream (snow glare)"
  ],

  emergency: [
    { label: "Emergency (all EU)", number: "112" },
    { label: "TOPR mountain rescue (Tatras)", number: "601 100 300" },
    { label: "TOPR short number", number: "985" },
    { label: "Police (Poland)", number: "997" }
  ],

  usefulLinks: [
    { label: "TOPR avalanche and trail conditions", url: "https://lawiny.topr.pl/" },
    { label: "Tatra National Park (TPN) trails", url: "https://tpn.pl/" },
    { label: "Kasprowy Wierch tickets (PKL)", url: "https://www.pkl.pl/" },
    { label: "Czech e-vignette (official)", url: "https://edalnice.cz/en/" },
    { label: "Slovak e-vignette (official)", url: "https://eznamka.sk/en/" },
    { label: "Crit'Air sticker (official)", url: "https://www.certificat-air.gouv.fr/en/" },
    { label: "UK Gov: driving abroad", url: "https://www.gov.uk/driving-abroad" },
    { label: "Colmar Christmas markets", url: "https://noel-colmar.com/en/" },
    { label: "Eurotunnel", url: "https://www.eurotunnel.com/" },
    { label: "PKP Intercity trains", url: "https://www.intercity.pl/en/" }
  ]
};
