# OpenAI Build Week 2026 — oficiální requirements, rules a doporučení

> Operační zdroj pravdy pro přípravu, vývoj, kontrolu driftu a odevzdání projektu.

## Metadata dokumentu

| Pole | Hodnota |
| --- | --- |
| Verze | 1.0 |
| Ověřeno | 13. července 2026 |
| Časové pásmo projektu | Europe/Prague, CEST |
| Autoritativní soutěžní zdroj | OpenAI Build Week Official Rules na Devpostu |
| Doplňkové oficiální zdroje | Devpost Overview, Resources a FAQ; OpenAI Build Week |
| Účel | Přesný praktický přepis zveřejněných požadavků a doporučení |
| Změnová politika | Při změně oficiálních pravidel vytvořit novou verzi a zapsat rozdíl do changelogu |

Tento dokument je přesný operační výklad zveřejněných pravidel, nikoli jejich náhrada ani právní stanovisko. Při jakémkoli rozporu rozhoduje aktuální znění [Official Rules](https://openai.devpost.com/rules).

---

## 1. Jak dokument používat

Každý požadavek má stabilní identifikátor. Stejné identifikátory používá dokument Auralis requirements alignment, takže lze později snadno zjistit, zda projekt nebo submission od pravidel nedriftuje.

### Typy položek

| Typ | Význam |
| --- | --- |
| **MUST** | Povinný požadavek z Official Rules nebo povinné submission instrukce |
| **CONDITIONAL MUST** | Povinné jen při splnění uvedené podmínky |
| **OFFICIAL SHOULD** | Výslovné doporučení z oficiálních Resources nebo FAQ |
| **PROJECT SHOULD** | Naše doporučení pro minimalizaci soutěžního rizika |
| **INFO** | Důležitý kontext, který sám o sobě není podmínkou přijetí |

### Hierarchie autority

1. **Official Rules**.
2. Formální požadavky na Devpost submission a oficiální oznámení pořadatele.
3. Devpost Overview, Resources a FAQ.
4. OpenAI Build Week landing page.
5. Devpost Hackathons Plugin a další AI výstupy.
6. Tento dokument a interní projektové dokumenty.

Official Rules výslovně stanovují, že při rozporu s jinými soutěžními materiály mají přednost pravidla. Plugin je volitelný pomocník, nikoli autoritativní zdroj, a jeho informace musí být ověřeny.

---

## 2. Kontrolní panel — co musí existovat při odevzdání

| ID | Povinný výstup | Minimální přijatelný důkaz |
| --- | --- | --- |
| SUB-01 | Funkční projekt postavený s Codexem a GPT-5.6 | Spustitelná aplikace a shodný záznam v demo videu |
| TRACK-01 | Jedna zvolená kategorie | Kategorie vybraná ve formuláři |
| SUB-02 | Textový popis | Jasné vysvětlení problému, funkcí a fungování projektu |
| VIDEO-01 | Veřejné YouTube demo kratší než 3 minuty | Funkční URL, veřejná viditelnost |
| VIDEO-02 | Jasné demo s audiem a voiceoverem | Projekt v chodu; vysvětleno co vzniklo, Codex a GPT-5.6 |
| REPO-01 | URL repozitáře pro hodnocení a testování | Public repo s licencí, nebo private repo sdílené na dvě předepsané adresy |
| README-01 | Setup, sample data a testovací instrukce | Reprodukovatelný README |
| README-02 | Konkrétní popis spolupráce s Codexem a integrace GPT-5.6 | Samostatné části README a odkazy na relevantní kód |
| CODEX-02 | Identifikátor hlavní Codex session | Hodnota získaná příkazem /feedback z primárního build threadu |
| TEST-01 | Bezplatný přístup k fungujícímu projektu | Veřejná URL, demo, test build nebo funkční testovací účet |
| LANG-01 | Angličtina nebo úplný anglický překlad | Video, popis, README a testovací instrukce v angličtině |
| IP-01 | Vlastnictví a oprávněné použití všeho odevzdaného | Licence, provenance assetů a absence neautorizovaného obsahu |

Nejbezpečnější interní deadline je alespoň 24 hodin před oficiálním uzavřením submission.

---

## 3. Termíny a časová pásma

### Závazný harmonogram podle Official Rules

| ID | Událost | Pacific Time | Europe/Prague, CEST |
| --- | --- | --- | --- |
| DATE-01 | Registrace začíná | 9. 7. 2026, 10:00 PT | 9. 7. 2026, 19:00 |
| DATE-02 | Submission period začíná | 13. 7. 2026, 09:00 PT | 13. 7. 2026, 18:00 |
| DATE-03 | Registrace a submission končí | 21. 7. 2026, 17:00 PT | **22. 7. 2026, 02:00** |
| DATE-04 | Judging period začíná | 22. 7. 2026, 10:00 PT | 22. 7. 2026, 19:00 |
| DATE-05 | Judging period končí | 5. 8. 2026, 17:00 PT | **6. 8. 2026, 02:00** |
| DATE-06 | Předpokládané oznámení vítězů | kolem 12. 8. 2026, 14:00 PT | kolem 12. 8. 2026, 23:00 |

### Důležitý rozpor mezi oficiálními stránkami

OpenAI Build Week landing page uvádí judging period 22. července až 7. srpna. Official Rules uvádějí 22. července až 5. srpna. Pro veškeré povinnosti, zejména dostupnost testovacího projektu, používáme datum z Official Rules: **5. srpna 2026 v 17:00 PT**.

### Kredity

| ID | Informace | Přesný praktický význam |
| --- | --- | --- |
| CREDIT-01 | Žádost o 100 USD v Codex credits | Registrovaný účastník může požádat do 17. 7. 2026, 12:00 PT, tedy 21:00 CEST; dostupnost podléhá schválení a zásobě |
| CREDIT-02 | Jednorázovost | FAQ uvádí jeden kód na Entranta |
| CREDIT-03 | Expirace | Poskytnuté soutěžní kredity musí být využity do 31. 7. 2026 |
| CREDIT-04 | Rozsah | Jde o Codex credits; pro soutěž nejsou distribuovány samostatné OpenAI API credits nebo tokeny |
| CREDIT-05 | Nadlimitní náklady | Další náklady nese účastník; je doporučeno sledovat usage |

Kredity nejsou podmínkou účasti. Smysluplné použití Codexu a GPT-5.6 podmínkou je.

---

## 4. Eligibility

| ID | Typ | Požadavek |
| --- | --- | --- |
| ELIG-01 | MUST | Jednotlivec musí být v době vstupu alespoň ve věku plnoletosti podle místa bydliště |
| ELIG-02 | MUST | Jednotlivec musí mít bydliště v zemi nebo teritoriu podporujícím přístup k OpenAI API a nesmí spadat do výslovných vyloučení |
| ELIG-03 | INFO | Česká republika je mezi podporovanými zeměmi uvedena |
| ELIG-04 | MUST | Každý člen týmu musí splňovat individuální eligibility podmínky |
| ELIG-05 | CONDITIONAL MUST | Tým nebo organizace musí pověřit jednoho oprávněného Representative, který projekt přihlásí a jedná jejich jménem |
| ELIG-06 | MUST | Organizace musí existovat a být založena v podporované zemi nebo teritoriu v době vstupu |
| ELIG-07 | INFO | Je možné vstoupit jako jednotlivec, tým nebo organizace; jednotlivec může být ve více týmech a současně podat vlastní submission |
| ELIG-08 | INFO | Maximální velikost týmu není ve zveřejněných pravidlech stanovena |
| ELIG-09 | MUST | Nesmí existovat vylučující konflikt zájmů ani vazba na pořadatele, administrátora či porotce podle Official Rules |

Pravidla dále připouštějí vstup rodiče nebo zákonného zástupce studenta mladšího 18 let nebo mladšího než místní věk plnoletosti. Úplný seznam geografických a vztahových výluk je v sekci 3 Official Rules.

### 4.1 Registration and entry mechanics

| ID | Typ | Požadavek |
| --- | --- | --- |
| REG-01 | MUST | Zaregistrovat se během Registration Period pomocí Join Hackathon na soutěžním webu a přihlásit se nebo vytvořit Devpost účet |
| REG-02 | MUST | Získat přístup k potřebným nástrojům, mít OpenAI účet a používat Codex podle příslušných podmínek |
| REG-03 | MUST | Během Submission Period vyplnit všechna povinná pole Enter a Submission a přiložit požadované materiály |
| REG-04 | INFO | Devpost Hackathons Plugin je volitelný; registrace, build i submission mohou proběhnout bez něj |

---

## 5. Kategorie a ceny

### TRACK-01 — jeden projekt, jedna nejbližší kategorie

Každý projekt se hlásí do jedné kategorie, která nejlépe odpovídá jeho primárnímu publiku a use case. Pokud projekt zasahuje do více oblastí, FAQ doporučuje zvolit nejbližší kategorii podle hlavního uživatele a hlavního účelu.

| Kategorie | Oficiální vymezení | Typický rozhodovací test |
| --- | --- | --- |
| **Apps for Your Life** | Spotřebitelské aplikace pro každodenní život: produktivita, kreativita, domov, rodina, cestování, zdraví a osobní finance | Používá produkt primárně jednotlivec nebo rodina ve svém běžném životě? |
| **Work and Productivity** | Nástroje zrychlující nebo zlepšující práci týmů: automatizace workflow, support, analytika, sales a back office | Je primárním kupujícím nebo uživatelem pracovní tým či organizace? |
| **Developer Tools** | Nástroje pro vývojáře: testování, DevOps, agentní workflow a security | Je hlavní hodnotou zlepšení tvorby, testování nebo provozu softwaru? |
| **Education** | Projekty posouvající AI ve vzdělávání pro studenty, učitele nebo vzdělávací organizace | Je hlavním uživatelem student, učitel nebo vzdělávací instituce a je hlavní funkcí vzdělávání? |

### TRACK-02 — více submissions

Jeden Entrant může podat více submissions, ale každá musí být unikátní a podstatně odlišná. Pouhé varianty stejného projektu podmínku nesplňují.

### Ceny

Celková peněžní hodnota vypsaných cen je 100 000 USD.

| Umístění v každé kategorii | Peněžní cena | Další zveřejněné části ceny |
| --- | ---: | --- |
| 1. místo | 15 000 USD | Až dva DevDay nebo Exchange passes, propagace OpenAI Developers, setkání s Codex Teamem, Pro Account na jeden rok |
| 2. místo | 10 000 USD | Propagace OpenAI Developers, Pro Account na jeden rok |

Další pravidla cen:

- Každý projekt může získat nejvýše jednu cenu.
- První místo v každé kategorii zahrnuje až dva vstupy pro dva členy týmu na DevDay v San Franciscu dne 29. září 2026.
- Cesta, ubytování, víza, doprava, poplatky a další související výdaje nejsou součástí ceny.
- Pokud vítěz nemůže na DevDay, může být podle dostupnosti nabídnut alternativní DevDay Exchange event.
- Ceny podléhají ověření identity, eligibility a skutečné role při tvorbě projektu.
- Daně, bankovní a směnné poplatky nese vítěz.

---

## 6. Project Requirements

### Povinné nástroje a skutečný projekt

| ID | Typ | Požadavek | Co to prakticky znamená |
| --- | --- | --- | --- |
| CODEX-01 | MUST | Projekt musí být vytvořen s Codexem | Codex musí být použit při skutečné tvorbě projektu, ne jen pro brainstorming nebo checklist |
| GPT-01 | MUST | Projekt musí používat GPT-5.6 | Použití musí být smysluplné; důkaz musí být v demo videu a repozitáři |
| GPT-02 | MUST | Codex ani GPT-5.6 nesmějí být pouze incidental nebo decorative | Jejich role musí být konkrétní, vysvětlitelná a ověřitelná v produktu či build workflow |
| PROJ-01 | MUST | Projekt musí zapadat do jedné ze čtyř kategorií | Kategorie musí odpovídat primárnímu publiku a problému |
| PROJ-02 | MUST | Projekt musí být úspěšně instalovatelný a konzistentně spustitelný na zamýšlené platformě | Nestačí statický mockup nebo nefunkční proof of concept |
| PROJ-03 | MUST | Projekt musí fungovat tak, jak je zobrazen ve videu a popsán v submission | Video, popis a dostupný build nesmějí přehánět stav funkcí |
| PROJ-04 | MUST | Platforma musí odpovídat platformě uvedené v submission | Uvádět pouze skutečně podporované platformy |
| PROJ-05 | MUST | Projekt musí být nový během Submission Period, nebo po startu období smysluplně rozšířený pomocí Codexu a/nebo GPT-5.6 | U existujícího projektu se hodnotí pouze práce přidaná v Submission Period |
| PROJ-06 | CONDITIONAL MUST | U pre-existing projektu musí být přesně oddělena stará a nová práce | Důkaz: timestamped Codex logs, dated commits nebo ekvivalent |
| PROJ-07 | MUST | Použití třetích SDK, API, dat, frameworků a assetů musí být oprávněné a licenčně v pořádku | Vést seznam závislostí, licencí a původu assetů |
| PROJ-08 | MUST | Použití OpenAI služeb se řídí příslušnými OpenAI Terms, Business Terms, Service Credit Terms a Usage Policies | Safety a policy compliance jsou součástí eligibility |

### Co pravidla neříkají

- Není předepsán konkrétní typ projektu. Přípustné jsou například webové a nativní aplikace, backend nástroje, agentní pluginy, skills, MCP, tools a hry.
- Není výslovně předepsáno použití OpenAI API jako konkrétního transportu. Je však předepsáno smysluplné použití GPT-5.6 a jeho doložení v produktu, videu a kódu.
- Není požadováno použití Devpost Pluginu.
- Není požadováno použití všech OpenAI modelů ani nejvyššího reasoning levelu.
- Není požadováno, aby byl repozitář veřejný; private varianta má přesná pravidla sdílení.
- Není zakázáno použít jiné modely, knihovny nebo nástroje, pokud jsou oprávněné a Codex i GPT-5.6 zůstávají smysluplnou částí projektu.
- Není nutné začít od nuly; pre-existing projekt však musí transparentně oddělit a doložit soutěžní práci.

### Důležitá interpretační zásada

V klauzuli o rozšíření existujícího projektu se objevuje formulace Codex and/or GPT-5.6. Celkové Project Requirements a FAQ však vyžadují oba nástroje. Pro bezpečnou compliance proto považujeme **Codex i GPT-5.6 za povinné**.

---

## 7. Submission Requirements

### Projekt, kategorie a popis

| ID | Typ | Požadavek |
| --- | --- | --- |
| SUB-01 | MUST | Odevzdat funkční projekt splňující Project Requirements |
| TRACK-01 | MUST | Zvolit jednu nejlépe odpovídající kategorii |
| SUB-02 | MUST | Přiložit textový popis vysvětlující funkce a fungování projektu |

Textový popis by měl rychle odpovědět na pět otázek: komu projekt pomáhá, jaký problém řeší, co uživatel udělá, proč je GPT-5.6 podstatné a co bylo vytvořeno s Codexem.

### Demo video

| ID | Typ | Požadavek |
| --- | --- | --- |
| VIDEO-01 | MUST | Video podle Official Rules musí být **kratší než 3 minuty**; porotci nemusejí sledovat obsah za třetí minutou |
| VIDEO-02 | MUST | Musí obsahovat jasné demo fungujícího projektu s audiem |
| VIDEO-03 | MUST | Audio nebo voiceover musí vysvětlit, co bylo vytvořeno, jak byl použit Codex a jak byl použit GPT-5.6 |
| VIDEO-04 | MUST | Video musí být nahráno jako veřejně viditelné video na YouTube a jeho URL vložena do submission |
| VIDEO-05 | MUST | Video nesmí obsahovat cizí ochranné známky, hudbu, copyrightovaný obsah ani jiný cizí materiál bez oprávnění |
| VIDEO-06 | CONDITIONAL MUST | Pokud video není anglicky, musí být dodán anglický překlad |

FAQ používá také formulaci 3 minutes or under. Protože Official Rules používají přísnější less than three minutes a pravidla mají přednost, bezpečný cílový čas je **2:45 až 2:55**.

FAQ dále upřesňuje:

- Pouhý screencast s hudbou nestačí; voiceover je vyžadován.
- Voiceover může být vytvořen nebo namluven s pomocí AI, musí však být přesný.
- Codex UI nemusí být ve videu, ale krátká ukázka je oficiálně doporučena jako silný důkaz.
- Nestačí říci, že Codex vytvořil backend. Je vhodné uvést konkrétní workflow, rozhodnutí nebo část implementace.

### Repozitář a README

| ID | Typ | Požadavek |
| --- | --- | --- |
| REPO-01 | MUST | Poskytnout URL k code repository pro judging a testing |
| REPO-02 | MUST | Zvolit a správně splnit právě jednu přístupovou variantu: public repo s relevantní licencí, nebo private repo sdílené předepsaným hodnotitelům |
| REPO-02A | MUST, varianta A | Public repository musí mít relevantní licenci |
| REPO-02B | MUST, varianta B | Private repository musí být sdílen s testing@devpost.com a build-week-event@openai.com |
| README-01 | MUST | README musí obsahovat setup instrukce, potřebná sample data a jasný postup spuštění a testování |
| README-02 | MUST | README musí popsat spolupráci s Codexem, místa zrychlení workflow, klíčová produktová, technická nebo designová rozhodnutí a konkrétní použití GPT-5.6 a Codexu |
| CODEX-02 | MUST | Do submission se vkládá /feedback Codex Session ID z threadu, ve kterém vznikla většina core functionality |
| DEVTOOL-01 | CONDITIONAL MUST | Plugin nebo Developer Tool musí navíc uvést install instrukce, podporované platformy a testovací cestu bez nutnosti sestavit projekt od nuly |

Pokud práce probíhala ve více Codex threadech, FAQ vyžaduje vybrat ten nejreprezentativnější, v němž vznikla většina core functionality. README má popsat i širší použití Codexu napříč workflow.

---

## 8. Testing a dostupnost

| ID | Typ | Požadavek |
| --- | --- | --- |
| TEST-01 | MUST | Poskytnout přístup k fungujícímu projektu pomocí webové URL, funkčního dema nebo test buildu |
| TEST-02 | MUST | Je-li projekt privátní, uvést funkční přihlašovací údaje v testovacích instrukcích |
| TEST-03 | MUST | Projekt musí být pro Sponsor, Administrator a Judges bezplatný a bez omezení až do konce Judging Period |
| TEST-04 | INFO | Porotci projekt testovat mohou, ale nemusejí; mohou hodnotit jen text, obrázky a video |
| TEST-05 | CONDITIONAL MUST | U projektu závislého na málo dostupném proprietárním hardware může pořadatel požadovat fyzický přístup |

### PROJECT SHOULD — nejbezpečnější testovací forma

- Veřejná HTTPS URL bez registrace.
- Jedno kliknutí do připraveného demo scénáře.
- Žádná nutnost vložit vlastní API key.
- Funkční fallback nebo cache pro externí služby.
- Sample data bez osobních nebo citlivých údajů.
- Health endpoint nebo jednoduchý status provozu.
- Kontrola dostupnosti nejméně do 6. srpna 2026, 02:00 CEST.

---

## 9. Jazyk, vlastnictví, licence a třetí strany

### Jazyk

| ID | Typ | Požadavek |
| --- | --- | --- |
| LANG-01 | MUST | Všechny submission materiály musí být v angličtině, nebo musí mít anglický překlad |

Týká se to zejména videa, textového popisu, testovacích instrukcí a dalších odevzdávaných materiálů.

### Ownership a IP

| ID | Typ | Požadavek |
| --- | --- | --- |
| IP-01 | MUST | Submission musí být původní prací Entranta, v jeho výlučném vlastnictví a bez porušení IP, privacy, publicity, smluvních nebo jiných práv třetích stran |
| IP-02 | MUST | Open-source software nebo hardware je povolen při dodržení licencí a projekt na něm musí vytvářet vlastní přidanou funkcionalitu |
| IP-03 | MUST | Pre-existing kód a třetí práce musejí být transparentně uvedeny |
| IP-04 | MUST | Účastník musí mít oprávnění ke všem third-party SDK, API, datům, fontům, ikonám, zvukům, obrázkům a dalším assetům |
| IP-05 | MUST | Odevzdaný obsah nesmí obsahovat malware ani škodlivý kód |
| FUND-01 | MUST | Projekt nesmí být vytvořen ani odvozen od projektu vyvinutého s finanční nebo preferenční podporou Sponsora nebo Administrátora podle sekce 4 Official Rules |

Externí technická pomoc je dovolena, pokud výsledné části zůstávají vlastním work productem Entranta, vycházejí z jeho nápadů a kreativity a Entrant vlastní potřebná práva.

### Vlastnictví po odevzdání a publicity

- Vlastnictví submission zůstává jeho tvůrcům.
- Sponsor získává nevýhradní licenci k použití submission pro judging.
- Sponsor a Devpost mohou submission propagovat a používat jméno, podobu, hlas a obraz přispěvatelů během Hackathon Period a po dobu tří let poté.
- Některé části submission mohou být veřejně zobrazeny; další mohou vidět Sponsor, Devpost a Judges.

### Policy a privacy

Použití OpenAI služeb musí respektovat aktuální [Usage Policies](https://openai.com/policies/usage-policies/). Pro health projekty jsou zvlášť důležité dva zákazy:

- poskytovat personalizovanou zdravotní radu vyžadující licenci bez odpovídající účasti licencovaného odborníka;
- automatizovat high-stakes medical decisions bez lidského přezkumu.

Health nebo accessibility projekt proto musí jasně oddělit edukaci a ilustraci od diagnózy, léčby, preskripce a rozhodování o zdravotní péči. Zpracování soukromých nebo citlivých informací musí být oprávněné a přiměřené.

### Další závazné právní podmínky

- Odesláním submission vzniká smluvní souhlas s Official Rules mezi Entrantem, Sponsorem a Devpostem.
- Pravidla obsahují podmínky release, indemnity a omezení odpovědnosti, pravidla publicity, ověřování výherců, daní a převzetí cen.
- Spory se v rozsahu dovoleném právem řeší individuálně závaznou arbitráží; výklad pravidel se řídí právem státu New York podle sekce 14.
- Devpost Terms of Service jsou do pravidel začleněny; při konfliktu pro tuto soutěž rozhodují Official Rules.
- Osobní údaje Entrantů se řídí Devpost Privacy Policy.
- Sponsor a Administrator mohou při porušení pravidel, manipulaci, nevhodném jednání nebo právním problému Entranta diskvalifikovat.

Pro úplné právní znění je nutné přečíst sekce 8 až 16 Official Rules; tento dokument je pouze operační shrnutí.

---

## 10. Změny submission a změny pravidel

| ID | Typ | Požadavek |
| --- | --- | --- |
| MOD-01 | INFO | Před deadline lze ukládat drafty a submission upravovat |
| MOD-02 | MUST | Po konci Submission Period už nelze běžně měnit odevzdané materiály |
| MOD-03 | INFO | Po deadline může Sponsor nebo Devpost výjimečně povolit úpravu kvůli cizím právům, PII nebo nevhodnému obsahu; substance projektu se nesmí změnit |
| GOV-01 | INFO | Sponsor a Administrator mohou pravidla změnit a zveřejněná změna se stává účinnou podle oznámení nebo okamžikem publikace |
| GOV-02 | PROJECT SHOULD | Při nejasnosti požádat před deadline písemně o vysvětlení a odpověď archivovat |

### Povinný interní kontrolní rytmus

1. Ověřit Official Rules při zahájení implementace.
2. Ověřit je znovu před natáčením finálního videa.
3. Ověřit je bezprostředně před finálním odesláním.
4. U každé změny zaznamenat datum, zdroj, dopad a přijaté rozhodnutí.

---

## 11. Judging

### Stage One — pass/fail viability

| ID | Typ | Požadavek |
| --- | --- | --- |
| JUDGE-01 | MUST | Projekt musí rozumně zapadat do tématu a rozumně používat požadované nástroje nebo technologie soutěže |

Praktický důsledek: vztah ke kategorii, Codexu a GPT-5.6 musí být patrný bez domýšlení.

### Stage Two — čtyři stejně vážená kritéria

Každé kritérium má efektivně 25 % celkového hodnocení.

| ID | Kritérium | Co porota hodnotí | Nejsilnější typ důkazu |
| --- | --- | --- | --- |
| JUDGE-02 | **Technological Implementation** | Jak důkladně a dovedně projekt používá Codex; zda kód ukazuje skutečné úsilí a fungující netriviální implementaci | Funkční kód, testy, konkrétní Codex workflow, architektura, /feedback thread |
| JUDGE-03 | **Design** | Zda jde o fungující nebo spustitelný projekt s úplným a soudržným product experience, nikoli jen technický proof of concept | Krátká kompletní user journey, konzistentní UX, error a loading states |
| JUDGE-04 | **Potential Impact** | Zda projekt věrohodně a konkrétně řeší reálný problém pro reálné publikum a zda předvedená funkce problém skutečně adresuje | Jasná persona, konkrétní situace, viditelný nebo slyšitelný výsledek |
| JUDGE-05 | **Quality of the Idea** | Kreativita, novost a odlišení od existujících konceptů | Jednověté odlišení, smysluplná role GPT-5.6, znalost domény |

### Tie-break

Při shodě se nejprve porovnává Technological Implementation, poté následující kritéria v uvedeném pořadí. Technická implementace je tedy nejen 25% kritérium, ale také první tie-break.

### Co z toho plyne

- Technická hloubka sama nemůže kompenzovat nedokončený produktový tok.
- Široký počet funkcí snižuje skóre, pokud naruší soudržnost nebo spolehlivost.
- Každé tvrzení v pitchi musí být prokazatelné tím, co je ve videu nebo v běžícím projektu.
- Codex contribution musí být stejně dobře doložen jako runtime role GPT-5.6.

---

## 12. Oficiální Pointers & Tips

Devpost Resources a FAQ doporučují:

| ID | Typ | Oficiální doporučení |
| --- | --- | --- |
| TIP-01 | OFFICIAL SHOULD | Začít problémem, ne modelem; nejlepší projekty používají GPT-5.6 proto, že jej problém skutečně potřebuje |
| TIP-02 | OFFICIAL SHOULD | Hledat spolupracovníky brzy, pokud se staví tým |
| TIP-03 | OFFICIAL SHOULD | Nahrávat demo průběžně a nenechávat video na poslední noc |
| TIP-04 | OFFICIAL SHOULD | Udržovat repo testovatelné, s čistými instrukcemi a sample data |
| TIP-05 | OFFICIAL SHOULD | Sledovat credit usage |
| TIP-06 | OFFICIAL SHOULD | Ukázat ve videu Codex alespoň krátce, i když to není povinné |
| TIP-07 | OFFICIAL SHOULD | Ve voiceoveru popsat konkrétní Codex workflow a rozhodnutí, nikoli pouze obecnou větu |
| TIP-08 | OFFICIAL SHOULD | Pro nejlepší zkušenost použít Codex v ChatGPT desktop app na macOS nebo Windows |
| TIP-09 | OFFICIAL SHOULD | Poskytnout live demo, test account nebo sandbox; porota nemusí projekt stavět od nuly |

Devpost Plugin je bezplatný a volitelný. Nepřináší judging advantage. Jeho příkaz pro přípravu submission lze použít jako sekundární audit, ale výsledek musí být ověřen proti Official Rules.

---

## 13. Doporučený provozní standard projektu

Následující body nejsou nové soutěžní podmínky. Jsou to interní doporučení, která z povinných pravidel odvozují nejbezpečnější pracovní postup.

### 13.1 Provenance a Codex evidence

1. Vytvořit jasný baseline dokument popisující stav před 13. 7. 2026, 09:00 PT.
2. Vést datované commity od prvního soutěžního kódu.
3. Hlavní core functionality stavět v jednom primárním Codex threadu.
4. Vedlejší thready používat pro audit, research nebo izolované kontroly, nikoli pro většinu core build.
5. Průběžně zapisovat klíčová lidská rozhodnutí a konkrétní pomoc Codexu.
6. Příkaz /feedback spustit v primárním threadu před jeho ztrátou nebo archivací a identifikátor bezpečně uložit.

### 13.2 Scope a produkt

1. Zamknout jednu hero journey.
2. Nejprve dokončit end-to-end vertical slice.
3. Funkce ukazované ve videu musejí fungovat i ve zpřístupněném buildu.
4. Stretch nebo future funkcionalitu neprezentovat jako aktivní.
5. Připravit rychlou demo route s bezpečnými sample data.

### 13.3 GPT-5.6 evidence

1. Uvést přesný používaný model identifier a místo integrace.
2. V README popsat vstup, strukturovaný výstup, validaci, fallback a omezení.
3. Ve videu ukázat výsledek činnosti GPT-5.6, nikoli jen logo nebo marketingový text.
4. Nepřisuzovat GPT-5.6 práci, kterou provádí deterministický engine.
5. Pokud runtime používá API, držet key pouze na serveru, omezit náklady a zajistit testovací dostupnost.

### 13.4 Demo video

1. Cílit na 2:45 až 2:55.
2. Začít problémem a výsledkem, ne architekturou.
3. Většinu času věnovat fungujícímu produktu.
4. Vyhradit krátkou, konkrétní část pro Codex build workflow a GPT-5.6 runtime roli.
5. Nahrát skutečný výstup aplikace; nepředstírat loading, generování ani výsledky.
6. Zkontrolovat YouTube public visibility v anonymním okně.
7. Nepoužít copyrightovanou hudbu, cizí loga, osobní data ani neověřené assety.

### 13.5 Repo a testování

1. Mít README hotový průběžně, nikoli až po kódu.
2. Uvést přesný quick start a verze runtime.
3. Poskytnout sample environment file bez secretů.
4. Přidat sample data a očekávaný výsledek.
5. Vést THIRD_PARTY_NOTICES nebo obdobný asset a license ledger.
6. Otestovat čistou instalaci mimo vývojářský stroj.
7. Otestovat veřejnou URL bez přihlášené session.
8. Zajistit uptime a nutné externí kredity po celou judging period.

### 13.6 Submission freeze

1. Nejpozději 24 hodin před deadline zmrazit features.
2. Znovu zkontrolovat pravidla a checklist.
3. Ověřit repo permissions a oba e-maily, pokud je repo private.
4. Ověřit video, demo URL a testovací credentials.
5. Uložit screenshot nebo potvrzení finálního submission.

---

## 14. Finální compliance checklist

### Eligibility a track

- [ ] ELIG-01 až ELIG-09 ověřeny.
- [ ] TRACK-01: vybrána právě jedna nejbližší kategorie.
- [ ] TRACK-02: případné další submissions jsou skutečně podstatně odlišné.

### Build provenance

- [ ] CODEX-01: Codex skutečně vytvářel core projekt.
- [ ] GPT-01 a GPT-02: GPT-5.6 má smysluplnou a doloženou roli.
- [ ] PROJ-05 a PROJ-06: stará a soutěžní práce jsou přesně odděleny.
- [ ] CODEX-02: uložen správný /feedback Session ID.

### Funkčnost

- [ ] PROJ-02 až PROJ-04: projekt běží stabilně a odpovídá videu i popisu.
- [ ] TEST-01 až TEST-03: judging access funguje a zůstane bezplatný.
- [ ] Externí služby mají dostatečný limit nebo fallback.

### Video

- [ ] VIDEO-01: stopáž je pod 3:00.
- [ ] VIDEO-02 a VIDEO-03: je vidět fungující projekt a zazní Codex i GPT-5.6.
- [ ] VIDEO-04: YouTube URL je public.
- [ ] VIDEO-05: asset a trademark audit dokončen.
- [ ] VIDEO-06 a LANG-01: vše je anglicky nebo přeloženo.

### Repo

- [ ] REPO-01 a REPO-02: repo je dostupné správnou cestou.
- [ ] README-01: setup, sample data a testing jsou reprodukovatelné.
- [ ] README-02: popsána konkrétní Codex collaboration, rozhodnutí a GPT-5.6 integrace.
- [ ] Nejsou přítomny secrets, osobní data ani nepovolené binární assety.

### IP, safety a policies

- [ ] IP-01 až IP-05: vlastnictví, licence a třetí strany ověřeny.
- [ ] FUND-01: neexistuje zakázaná finanční nebo preferenční podpora.
- [ ] Použití OpenAI služeb odpovídá aktuálním Usage Policies.
- [ ] Health, privacy nebo jiné sensitive use cases mají odpovídající guardrails.

### Submission

- [ ] SUB-01 a SUB-02: projekt a popis jsou kompletní.
- [ ] Ve formuláři je správná kategorie, video, repo, demo URL a /feedback ID.
- [ ] Poslední rules review proveden.
- [ ] Finální submission odeslán před deadline a potvrzení archivováno.

---

## 15. Oficiální zdroje

### Primární

- [OpenAI Build Week — Official Rules](https://openai.devpost.com/rules)
- [OpenAI Build Week — Overview, requirements, tracks, prizes and judging](https://openai.devpost.com/)
- [OpenAI Build Week — Resources and official pointers](https://openai.devpost.com/resources)
- [OpenAI Build Week — FAQ](https://openai.devpost.com/details/faqs)

### Doplňkové

- [OpenAI Build Week](https://openai.com/build-week/)
- [OpenAI Usage Policies](https://openai.com/policies/usage-policies/)
- [OpenAI API supported countries and territories](https://developers.openai.com/api/docs/supported-countries)
- [Devpost Terms of Service](https://info.devpost.com/terms)
- [Devpost Privacy Policy](https://info.devpost.com/privacy)

---

## 16. Changelog

| Verze | Datum | Změna |
| --- | --- | --- |
| 1.0 | 13. 7. 2026 | První úplný operační přepis zveřejněných categories, requirements, rules, FAQ a recommendations |

---

## 17. Závěrečné pravidlo

> Vyhrává pouze to, co je současně funkční, snadno ověřitelné, pravdivě popsané a jasně spojené s Codexem i GPT-5.6.
