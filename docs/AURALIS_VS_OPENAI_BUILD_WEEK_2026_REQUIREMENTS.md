# Auralis vs. OpenAI Build Week 2026 Requirements

> Rules-driven alignment review, gap analysis a scope lock pro Auralis.

## Metadata dokumentu

| Pole | Hodnota |
| --- | --- |
| Verze | 1.0 |
| Datum porovnání | 13. července 2026 |
| Porovnávaný projektový zdroj | Auralis_preparation_final.md |
| Stav zdroje | Frozen pre-rules preparation document, zmrazen 12. července 2026 |
| Stav implementace uvedený ve zdroji | Competition implementation not started |
| Soutěžní zdroj | OpenAI Build Week Official Rules, Overview, Resources a FAQ |
| Účel | Zabránit rules driftu, scope driftu a nepodloženým submission tvrzením |

Zmrazený Auralis dokument zůstává beze změny. Tento soubor zachycuje pouze rozhodnutí, která vznikla až po zveřejnění plných pravidel.

---

## 1. Executive verdict

### Výsledek

**Auralis je s OpenAI Build Week velmi dobře sladěný na úrovni problému, nápadu a navržené architektury. Neexistuje zjištěný rules-driven důvod projekt opustit nebo zásadně měnit jeho hlavní Family Experience.**

Současně ještě nelze říci, že je Auralis soutěžně compliant. Frozen dokument je plán, ne fungující submission. Compliance vznikne teprve implementací, důkazy v repozitáři, běžícím demem, videem a správným /feedback Session ID.

### Doporučená kategorie

> **Apps for Your Life**

Auralis je spotřebitelská aplikace pro rodinu, každodenní komunikaci a oblast zdraví. Všechny tři oblasti jsou přímo uvedeny v definici Apps for Your Life. Education je smysluplný sekundární aspekt, ale současný primární uživatel není student, učitel ani vzdělávací organizace.

### Nejdůležitější rules-driven zjištění

1. **Codex i GPT-5.6 jsou povinné a musejí být použity smysluplně.** Auralis má pro GPT-5.6 výbornou koncepční roli, ale musí ji skutečně implementovat a ukázat.
2. **Původní no-API předpoklad vyžaduje nové rozhodnutí.** Samostatná PWA nemůže tvrdit live runtime orchestration modelem GPT-5.6 Sol bez skutečné podporované runtime cesty. Soutěž poskytuje Codex credits, nikoli API credits.
3. **Hlavní soutěžní build musí vznikat v jednom primárním Codex threadu.** Submission vyžaduje /feedback ID threadu, v němž vznikla většina core functionality.
4. **Šířka frozen návrhu je větší, než podporují judging kritéria a tříminutové video.** Pravidla odměňují kompletní coherent experience, ne množství rozpracovaných branches.
5. **Family Experience je správný submission core.** Personal Support Preview, Hearing Check a další health-sensitive branches zvyšují policy, safety i delivery riziko bez nutnosti pro hlavní demo.
6. **Codex contribution musí být zdokumentován stejně přesvědčivě jako runtime GPT-5.6.** Frozen dokument je výrazně podrobnější o GPT-5.6 než o konkrétní Codex spolupráci.
7. **Submission assety vyžadují licenční audit.** Zvláštní pozornost potřebují zvuky prostředí, fonty, ikony, případné TV vizuály, trademarky a AI voices.

---

## 2. Status legenda

| Status | Význam |
| --- | --- |
| **ALIGNED BY DESIGN** | Frozen Auralis obsahuje správné rozhodnutí, ale stále je nutný implementační důkaz |
| **PENDING EVIDENCE** | Požadavek není v konfliktu, ale dosud není doložen běžícím projektem nebo submission artefaktem |
| **GAP / DECISION REQUIRED** | Chybí rozhodnutí, důkaz nebo existuje rozpor s dosavadním předpokladem |
| **RISK** | Formálně možná cesta s významným delivery, policy nebo judging rizikem |
| **NOT APPLICABLE** | Požadavek se na doporučenou formu Auralis nevztahuje |

Toto hodnocení posuzuje frozen product plan. Není auditem dosud nevytvořeného nebo později vzniklého repozitáře.

---

## 3. Souhrnný readiness panel

| Oblast | Stav | Hodnocení |
| --- | --- | --- |
| Eligibility | **ALIGNED BY DESIGN** | Česká republika je podporovaná; při solo vstupu není zjevná překážka |
| Track fit | **ALIGNED BY DESIGN** | Apps for Your Life je přímý fit pro family a health consumer app |
| Problem a audience | **ALIGNED BY DESIGN** | Konkrétní rodinný problém, jasná persona a praktický outcome |
| GPT-5.6 role | **ALIGNED BY DESIGN / GAP** | Role je silná, ale runtime cesta a skutečný model identifier musejí být rozhodnuty |
| Codex role | **PENDING EVIDENCE** | Build environment je uveden, chybí konkrétní workflow a /feedback evidence |
| Working functionality | **PENDING EVIDENCE** | Frozen dokument výslovně uvádí, že implementace nezačala |
| Coherent design | **ALIGNED BY DESIGN / RISK** | Hlavní journey je soudržná; celkový feature map je příliš široký |
| Safety a health boundaries | **ALIGNED BY DESIGN / RISK** | Guardrails jsou kvalitní; osobní support a hearing check zvyšují riziko |
| Repository a README | **GAP / DECISION REQUIRED** | Submission struktura a evidence nejsou součástí frozen briefu |
| Demo video | **GAP / DECISION REQUIRED** | Navržený 15krokový demo flow je příliš dlouhý pro limit pod 3 minuty |
| Testing access | **PENDING EVIDENCE** | PWA je vhodná platforma, ale musí existovat veřejná stabilní URL |
| IP a asset provenance | **GAP / DECISION REQUIRED** | Chybí asset ledger a konkrétní licenční politika |

---

## 4. Category analysis

| Kategorie | Fit pro Auralis | Důvod | Rozhodnutí |
| --- | --- | --- | --- |
| **Apps for Your Life** | **Velmi vysoký** | Primární uživatel je rodinný příslušník; use case je family, health a everyday life | **ZAMKNOUT** |
| Education | Střední | Produkt edukuje, ale není primárně určen studentům, učitelům nebo vzdělávacím organizacím | Nevolit pro současný pitch |
| Work and Productivity | Nízký | Profesionální audiologické použití je pouze sekundární publikum | Nevolit |
| Developer Tools | Žádný | Auralis není nástroj pro vývojáře | Nevolit |

### Zamknutý category statement

> Auralis is an Apps for Your Life project: a consumer family experience that turns an abstract hearing profile into a shared, contextual moment people can hear, compare, and improve.

### Anti-drift pravidlo

Submission se nesmí posouvat do pitchu pro audiology clinics, schools nebo enterprise care teams jen proto, aby působil širší. Tím by se oslabil přímý fit k vybrané kategorii i konkrétnost publika.

---

## 5. Eligibility a timing matrix

| Requirement ID | Requirement | Auralis evidence | Stav | Nutná akce |
| --- | --- | --- | --- | --- |
| ELIG-01 | Entrant je plnoletý | Projektový dokument osobní eligibility neřeší | PENDING EVIDENCE | Potvrdit ve submission účtu |
| ELIG-02 a ELIG-03 | Podporovaná země; ČR je podporovaná | Projekt vzniká v České republice | ALIGNED BY DESIGN | Žádná projektová změna |
| ELIG-04 a ELIG-05 | Týmová eligibility a Representative | Frozen dokument neurčuje tým | PENDING EVIDENCE | Pokud solo, podat jako individual; pokud tým, zapsat členy a Representative |
| DATE-02 | Soutěžní práce od 13. 7. 2026, 09:00 PT | Dokument říká implementation not started a byl zmrazen před pravidly | ALIGNED BY DESIGN | První soutěžní implementaci a commity vést až po 13. 7. 2026, 18:00 CEST |
| DATE-03 | Deadline 21. 7. 2026, 17:00 PT | Není součástí frozen plánu | GAP | Interní submission package připravit nejpozději 21. 7., 02:00 CEST; finální deadline je 22. 7., 02:00 CEST |
| DATE-05 a TEST-03 | Projekt dostupný do konce judging | PWA je vhodná | PENDING EVIDENCE | Hosting a externí služby udržet minimálně do 6. 8. 2026, 02:00 CEST |

### Pre-Build Week provenance

Frozen přípravný dokument je výhoda, pokud je transparentně použit jako baseline:

- před Submission Period existoval koncept, research a frozen specification;
- soutěžní implementace podle dokumentu neexistovala;
- Hearscape se nepoužije jako technický základ;
- nový Auralis codebase, produkční assety a funkční build vzniknou v Submission Period;
- README přesně uvede, co existovalo před a co vzniklo během Build Week.

Nejbezpečnější formulace v README:

> Before the submission period, Auralis existed only as a frozen product and architecture specification. The submitted implementation, production assets, tests, and deployment were created during OpenAI Build Week with Codex and GPT-5.6.

K tvrzení musí odpovídat reálná commit history.

---

## 6. Mandatory tool alignment

### 6.1 Codex

| Requirement ID | Frozen Auralis | Hodnocení | Chybějící důkaz |
| --- | --- | --- | --- |
| CODEX-01 | Build environment: Codex with GPT-5.6 Sol | Správný záměr, příliš obecný popis | Primární build thread, commity, konkrétní workflow a výsledný kód |
| CODEX-02 | Neuvedeno | Povinný submission gap | /feedback Session ID threadu, kde vznikla většina core functionality |
| README-02 | Pouze obecná zmínka o full-stack implementation with Codex | Nedostatečné pro finální README | Konkrétní rozhodnutí, akcelerace, iterace, testy a lidská role |
| JUDGE-02 | Architektura nabízí netriviální práci | Velmi silný potenciál | Fungující implementace, test fixtures, schema validation a audio tests |

### Zamknutý Codex workflow

1. Jeden primární Codex thread vlastní hlavní vertical slice a většinu core code.
2. Primární thread zahrnuje architekturu, manifest, audio engine, UI integraci a end-to-end stabilizaci.
3. Oddělené thready mohou dělat review, security, design audit nebo izolované experimenty.
4. Klíčová lidská rozhodnutí se zapisují do ADR nebo decision logu.
5. README vysvětlí nejméně tři konkrétní Codex contributions a nejméně tři klíčová rozhodnutí, která udělal člověk.
6. /feedback ID se získá z hlavního threadu a bezpečně uloží.

### Co není dostatečný Codex důkaz

- Pouze přípravná konverzace.
- Použití pluginu pro přečtení pravidel.
- Obecná věta, že Codex napsal aplikaci.
- Velké množství generovaného kódu bez funkčního produktu a bez vysvětlení rozhodnutí.
- /feedback ID z vedlejšího testovacího nebo research threadu.

### 6.2 GPT-5.6

Frozen Auralis je v této oblasti koncepčně velmi silný. GPT-5.6:

- rozumí vztahu, posluchači a hearing subject;
- vybírá relevantní situaci;
- vytváří SceneIntent a AcousticSceneManifest;
- provádí oddělenou validaci;
- orchestruje obraz, řeč a audio assety;
- upravuje scénu;
- vysvětluje pouze strukturované výstupy deterministic engine.

To je přesně typ meaningful use, který není decorative. Musí však existovat ve skutečném buildu.

| Requirement ID | Frozen Auralis | Stav | Nutná akce |
| --- | --- | --- | --- |
| GPT-01 | GPT-5.6 Sol je central scene director | ALIGNED BY DESIGN | Implementovat skutečný runtime call nebo jinou prokazatelnou supported integration |
| GPT-02 | Model vlastní planning, validation, orchestration a explanation | ALIGNED BY DESIGN | Ukázat konkrétní vstup, structured output, validaci a výsledek ve videu i README |
| PROJ-03 | Produkt musí fungovat jako ve videu | RISK | Nesmí se předstírat live generation, pokud je scéna pouze cached |
| README-02 | Role je popsána v produktovém briefu | PENDING EVIDENCE | Přenést přesný runtime data flow a model identifier do repo dokumentace |

---

## 7. Kritické rozhodnutí: build-time Sol vs. runtime GPT-5.6

Frozen dokument směšuje dvě odlišné role pod označením GPT-5.6 Sol:

| Vrstva | Správná role | Povinný důkaz |
| --- | --- | --- |
| **Build-time agent** | Codex s vybraným GPT-5.6 modelem nebo variantou vytváří a iteruje codebase | /feedback session, commit history, README collaboration |
| **Runtime model** | Model dostupný přes skutečně podporovanou runtime cestu vytváří a validuje manifest a grounded explanation | Model identifier v server code, fungující demo, error handling |
| **Deterministic engine** | Web Audio nebo DSP kód provádí opakovatelnou transformaci a vrací measurements | Testy, fixtures, shodné A/B zdroje |
| **Asset models** | Image a speech modely vytvářejí vizuál a hlasy | Licenčně a technicky doložená integrace; pro judging jsou podpůrné |

### Zjištěný rozpor

Předchozí plán počítal s Codex Pro usage bez API. Oficiální FAQ nyní výslovně uvádí, že Build Week distribuuje Codex credits, nikoli OpenAI API credits. Samostatná PWA zároveň nemůže používat uživatelovo Codex nebo ChatGPT předplatné jako svůj skrytý runtime backend.

### Varianty

| Varianta | Soulad s frozen architekturou | Judging síla | Delivery riziko | Verdikt |
| --- | --- | --- | --- | --- |
| **A. PWA + malý server-side GPT-5.6 runtime** | Vysoký | Vysoká | Řiditelné při cache a limitech | **DOPORUČENO** |
| B. Převést Auralis na ChatGPT-hosted app | Střední | Vysoká | Vysoké kvůli změně platformy a UX | Nedoporučeno bez zásadního důvodu |
| C. Použít GPT-5.6 jen při tvorbě předgenerovaných assetů | Nízký | Nízká až nejasná | Nízké | Neodpovídá claimu central runtime director |
| D. Ukazovat fake live generation nad cached daty | Žádný | Diskvalifikační a trust risk | Nepřijatelné | Zakázat |

### Doporučené technické rozhodnutí

- Zachovat responsive PWA.
- Umístit GPT-5.6 call na server nebo serverless endpoint; nikdy ne do klienta s veřejným key.
- Runtime použije schema-constrained SceneIntent a AcousticSceneManifest.
- Default family-dinner scene může být předem připravena a cached pro spolehlivost.
- Aplikace musí poctivě rozlišit cached demo a novou live adaptaci.
- Live call lze omezit na manifest planning, validation a grounded explanation; deterministic audio zůstává lokální nebo předrenderované podle stejného manifestu.
- Nastavit pevné cost, rate a timeout limity a připravit transparentní fallback.
- V README i videu uvést přesný skutečný model identifier. Označení Sol používat pro runtime pouze tehdy, pokud je to opravdu název dostupné runtime varianty.

Toto není požadavek, aby celý produkt byl online generován při každém kliknutí. Je to požadavek, aby claim o smysluplné integraci GPT-5.6 byl pravdivý a ověřitelný.

---

## 8. Project Requirements matrix

| ID | Oficiální požadavek | Stav Auralis | Evidence ve frozen dokumentu | Rules-driven akce |
| --- | --- | --- | --- | --- |
| PROJ-01 | Fit do jednoho tracku | ALIGNED BY DESIGN | Family, everyday communication, health | Lock Apps for Your Life |
| PROJ-02 | Instalovatelný a konzistentně běžící projekt | PENDING EVIDENCE | PWA je zamýšlená platforma | Nasadit testovanou HTTPS PWA |
| PROJ-03 | Fungovat jako ve videu a popisu | RISK | Široká status mapa Available, Experimental, Exploration | Ve videu a submission uvádět jen skutečně funkční stavy |
| PROJ-04 | Běh na deklarované platformě | ALIGNED BY DESIGN | Responsive web application / PWA | Deklarovat přesné podporované browsery |
| PROJ-05 | Nový nebo smysluplně rozšířený po startu | ALIGNED BY DESIGN | Implementation not started; clean Auralis project | Začít codebase po startu a zachovat datované commity |
| PROJ-06 | Oddělit pre-existing a new work | ALIGNED BY DESIGN / PENDING | Frozen dokument má jasné datum a status | Přidat Build Week provenance sekci |
| PROJ-07 | Oprávněné third-party integrace a data | GAP | Environmental audio library je zmíněna bez licencí | Asset ledger a THIRD_PARTY_NOTICES |
| PROJ-08 | OpenAI Terms a Usage Policies | ALIGNED BY DESIGN / RISK | Silné disclaimers, no diagnosis/prescription | Omezit submitted build na Family Experience a model profile |

---

## 9. Submission Requirements matrix

| ID | Požadavek | Stav Auralis | Konkrétní gap nebo akce |
| --- | --- | --- | --- |
| SUB-01 | Working project | PENDING EVIDENCE | Nejprve dokončit jeden end-to-end Family vertical slice |
| TRACK-01 | One best-fit category | ALIGNED BY DESIGN | Zvolit Apps for Your Life |
| SUB-02 | Text description | GAP | Napsat až podle skutečně dokončené funkce, ne podle plného roadmap briefu |
| VIDEO-01 | Video pod 3 minuty | GAP | Původní 15kroková demo sekvence se nevejde; použít zkrácený script níže |
| VIDEO-02 a VIDEO-03 | Working demo, audio, Codex a GPT-5.6 | PENDING EVIDENCE | Vyvážit produktové audio a povinný voiceover |
| VIDEO-04 | Public YouTube | GAP | Nahrát a ověřit anonymním oknem |
| VIDEO-05 | Žádný neoprávněný trademark nebo copyrighted material | RISK | Nepoužívat brand headphones, cizí TV obsah ani neauditovanou hudbu nebo zvuky |
| REPO-01 | Repo URL | GAP | Vytvořit čistý repo a rozhodnout public vs. private |
| REPO-02 | Licence nebo sdílení dvěma e-mailům | GAP | Doporučeno public repo s vhodnou licencí po secret a asset auditu |
| README-01 | Setup, sample data, testing | GAP | Připravovat průběžně od prvního vertical slice |
| README-02 | Codex collaboration a GPT-5.6 role | GAP | Přidat samostatné evidence sections |
| CODEX-02 | /feedback Session ID | GAP | Chránit primární build thread a uložit ID |
| DEVTOOL-01 | Extra instrukce pro dev tool | NOT APPLICABLE | Auralis se podává jako consumer PWA |
| TEST-01 až TEST-03 | Working free testing access | PENDING EVIDENCE | Veřejná demo URL bez loginu a bez user API key |
| LANG-01 | English materials | ALIGNED BY DESIGN | Frozen brief je anglicky; zachovat anglický app, video, README a submission |

### 9.1 Zbývající administrativní, IP a governance requirements

| ID | Požadavek | Stav Auralis | Konkrétní akce |
| --- | --- | --- | --- |
| REG-01 | Devpost registration během Registration Period | PENDING EVIDENCE | Ověřit, že Join Hackathon je dokončen na účtu, ze kterého se bude odevzdávat |
| REG-02 | OpenAI účet a přístup ke Codexu | ALIGNED BY DESIGN | Frozen brief přímo určuje Codex jako build environment |
| REG-03 | Vyplnit všechna povinná submission fields | GAP | Provést finální form audit před deadline |
| REG-04 | Plugin je optional | NOT APPLICABLE | Není nutné jej instalovat; případný plugin audit ověřit proti Official Rules |
| ELIG-06 až ELIG-09 | Organization eligibility, conflicts a další výluky | PENDING EVIDENCE | Při solo submission je organization část N/A; potvrdit absenci konfliktu zájmů |
| CREDIT-01 až CREDIT-05 | Volitelné Codex credits a vlastní náklady | INFO | Pokud budou kredity potřeba, požádat do 17. 7., 12:00 PT; API runtime rozpočtovat zvlášť |
| TRACK-02 | Více submissions musí být podstatně odlišných | NOT APPLICABLE | Auralis podat jako jeden projekt; nevytvářet variantu jen pro druhý track |
| TEST-02 | Private project potřebuje test credentials | NOT APPLICABLE / PENDING | Doporučená public demo route login nepotřebuje |
| TEST-04 | Judges projekt nemusejí spustit | RISK | Video a text musejí samy prokázat celý core story |
| TEST-05 | Proprietary hardware může vyvolat požadavek fyzického přístupu | ALIGNED BY DESIGN | Family Experience nesmí vyžadovat AirPods ani jiný speciální wearable |
| VIDEO-06 | Angličtina nebo English translation | ALIGNED BY DESIGN | Natočit anglický voiceover a captions |
| REPO-02A / REPO-02B | Public license nebo přesné private sharing | GAP | Preferovat public repo; jinak ověřit oba předepsané e-maily |
| IP-01 | Original work a neporušení cizích práv | ALIGNED BY DESIGN / PENDING | Auralis je vlastní koncept; dokončit asset a code provenance audit |
| IP-02 | Open source licence a vlastní přidaná funkcionalita | PENDING EVIDENCE | Zapsat všechny dependencies a jejich licence |
| IP-03 | Uvést pre-existing a third-party work | ALIGNED BY DESIGN / PENDING | Frozen spec a clean-start decision popsat v provenance |
| IP-04 | Oprávnění ke všem API, datům a assetům | GAP | THIRD_PARTY_NOTICES a asset ledger jsou release gate |
| IP-05 | Žádný malware nebo škodlivý kód | PENDING EVIDENCE | Dependency, secret a security scan před public release |
| FUND-01 | Žádná zakázaná finanční nebo preferenční podpora Sponsora či Administrátora | PENDING EVIDENCE | Potvrdit v pre-submission compliance checku |
| MOD-01 až MOD-03 | Úpravy jen do deadline, poté pouze výjimečně | GAP | Submission package freeze a finální kontrola nejméně 24 hodin před deadline |
| GOV-01 a GOV-02 | Rules se mohou změnit; nejasnost řešit před deadline | PENDING | Re-check před videem a před submit; archivovat případné odpovědi pořadatele |
| JUDGE-01 | Stage One fit a meaningful use | ALIGNED BY DESIGN / PENDING | Prvních 30 sekund videa musí jasně ukázat track, problém a GPT-5.6 use |
| JUDGE-03 až JUDGE-05 | Design, Impact a Idea | ALIGNED BY DESIGN / PENDING | Dokázat hotovou journey; nespoléhat na roadmap nebo planning score |

---

## 10. Rules-driven scope lock

Frozen dokument správně říká, že one excellent journey proves the platform. Jeho Target Build Week status map však stále obsahuje příliš mnoho skutečně budovaných funkcí. Judging criteria a video limit tuto šířku nepodporují.

### 10.1 Submission Core — musí fungovat end to end

| Priorita | Funkce | Minimální soutěžní podoba |
| ---: | --- | --- |
| 1 | Entry a safety disclosure | Krátké, čitelné, potvrditelné; neblokovat demo |
| 2 | Curated model hearing profile | Jeden silný default a maximálně několik ověřených fixtures |
| 3 | Family Experience | Jedna jasná persona a family-dinner journey |
| 4 | Guided context | Několik strukturovaných voleb a krátký natural-language detail |
| 5 | GPT-5.6 Scene Director | SceneIntent, manifest generation, validation a grounded explanation |
| 6 | AcousticSceneManifest | Jediný verzovaný source of truth |
| 7 | First-person scene | Koherentní static image s jasnými positions |
| 8 | Speech a environment audio | Krátká, srozumitelná a licenčně čistá scéna |
| 9 | Activity markers | Manifest-timed hlasové a environmentální indikátory |
| 10 | Deterministic A/B | Stejný source segment: reference a hearing-profile state |
| 11 | Modelled support | Jeden přesvědčivý bilateral nebo directional comparison state |
| 12 | Environmental intervention | Vypnout TV nebo přiblížit hlavního mluvčího |
| 13 | Grounded explanation | Pouze fakta z EngineResult, žádná medical claim |
| 14 | Demo route | Jedno kliknutí do připravené scény; public a stabilní |

### 10.2 Stretch — pouze po dokončení a otestování core

- Manual audiogram entry.
- Druhý curated model profile.
- Jedna live custom scene adaptation.
- Natural-language environment edit nad již existujícím manifestem.
- Omezený Hearing Hub jako závěrečná navigace.
- Další scene template.

Stretch funkce se nesmí dotknout stability core nebo natáčení videa.

### 10.3 Neimplementovat pro soutěžní submission

- Personal Support Preview.
- Experimental Guided Hearing Check.
- Audiogram image nebo PDF extraction.
- Device visualization.
- Shareable scene between perspectives.
- Native iOS nebo iPadOS.
- HealthKit.
- System-wide hearing correction.
- Speech audiometry.
- Lip-sync a arbitrary person animation.
- Rozsáhlý educational hub.

### Proč jsou Personal Support Preview a Hearing Check vyřazeny

1. Nejsou potřeba pro hlavní family value proposition.
2. Zvyšují risk personalizované medical advice nebo high-stakes interpretation.
3. Vyžadují volume safety, device state, calibration a podstatně širší test matrix.
4. Nevejdou se do tříminutového příběhu.
5. Odvádějí pozornost od Design criterion, které vyžaduje kompletní coherent experience.

Mohou zůstat v roadmap dokumentaci jako budoucí výzkumný směr, nikoli jako klikatelné nefunkční controls v submitted buildu.

---

## 11. Judging alignment

### 11.1 Technological Implementation — vysoký potenciál, evidence pending

#### Silné stránky

- GPT-5.6 má podstatnou orchestration roli.
- AcousticSceneManifest vytváří netriviální strukturovaný kontrakt.
- Deterministic DSP odděluje model reasoning od audio result.
- Identical-source A/B, binaural routing, activity timing a grounded explanations jsou skutečné engineering problémy.
- Validation a repair path ukazují víc než jeden model call.

#### Rizika

- Frozen brief mluví více o GPT-5.6 než o Codex collaboration.
- Příliš mnoho abstraktní architektury bez hotového engine bude vypadat jako proposal.
- Cached default bez jasně ukázané live GPT-5.6 role může působit dekorativně.
- Technická složitost nesmí zničit spolehlivost.

#### Povinný evidence pack

- Primární /feedback thread.
- Dated commit history.
- Manifest schema a validátor.
- Audio fixtures a testy.
- Ukázka stejného source segmentu pro A/B.
- Error, timeout a fallback handling.
- README diagram build-time Codex, runtime GPT-5.6 a deterministic engine.
- Dva až čtyři stručné ADR pro nejdůležitější rozhodnutí.

### 11.2 Design — silný core, vysoké scope riziko

#### Silné stránky

Hlavní tok je mimořádně soudržný:

> profile → purpose → personal scene → hear → compare support → improve environment → grounded explanation

Static first-person scene s manifest-driven activity markers je dobré pravidly kompatibilní rozhodnutí. Je vizuálně čitelné, realisticky implementovatelné a podporuje auditory hero moment.

#### Rizika

- Čtyři profile input cesty.
- Dva režimy s odlišnou safety logikou.
- Velký Hearing Hub.
- Mnoho status labels a budoucích větví.
- Příliš dlouhý onboarding před hero momentem.

#### Design rule

První uživatel musí spustit default family scene nejvýše po několika rozhodnutích. V competition demo použít explicitní Use demo profile nebo obdobnou rychlou cestu.

### 11.3 Potential Impact — velmi silný fit

#### Silné stránky

- Reálný a konkrétní problém: audiogram sám nevysvětluje lived experience.
- Reálné publikum: rodina a blízcí.
- Konkrétní situace: father at a family dinner.
- Praktický outcome: uživatel nejen slyší problém, ale zjistí, co může změnit v prostředí.
- Zakladatel má přímou profesní zkušenost v audiologii.

#### Jak impact prokázat

- Začít videem jednou větou z reálné profesní zkušenosti.
- Ukázat stejnou scénu před a po environmental intervention.
- Nevkládat obecná čísla o prevalenci, pokud nejsou potřeba a doložena.
- Neslibovat klinický outcome; ukázat konkrétní understanding a communication action.

### 11.4 Quality of the Idea — silný, ale musí být přesně formulován

#### Skutečné odlišení

Auralis není generic hearing-loss filter ani chatbot. GPT-5.6 vytváří osobně relevantní, multimodálně koherentní acoustic scene z jednoho manifestu, zatímco deterministic engine drží A/B comparison věrné a vysvětlení grounded.

#### Doporučený one-line differentiation

> Most hearing simulations apply a generic filter. Auralis uses GPT-5.6 to build a personal acoustic moment around a real relationship, then keeps every visual, voice, position, comparison, and explanation tied to one validated scene manifest.

#### Riziko

Nepoužívat v submission interní planning score 9.4/10 ani tvrzení potential winner. Porota hodnotí hotový projekt, ne vlastní predikci.

---

## 12. Doporučené tříminutové demo

### Cílová stopáž: 2:50 až 2:55

| Čas | Obraz a produkt | Povinné sdělení |
| --- | --- | --- |
| 0:00–0:12 | Auralis identity a rychlý problém | Audiogram neukáže rodině, jak konkrétní chvíle zní |
| 0:12–0:27 | Use demo profile, Family Experience, father at dinner | Konkrétní audience a situation |
| 0:27–0:43 | GPT-5.6 vytvoří a validuje scene plan | Model rozumí vztahu, positions, noise a comparison goal |
| 0:43–1:03 | Reference audio se source markers | Stejný source segment; doporučit headphones bez značky |
| 1:03–1:23 | Hearing-profile state | Hlavní A/B hero moment |
| 1:23–1:42 | Bilateral nebo directional support state | Capability-based illustration, ne device claim |
| 1:42–2:02 | Turn off TV nebo move speaker closer | Praktický environment outcome |
| 2:02–2:17 | Grounded GPT-5.6 explanation | Explanation vychází pouze z deterministic EngineResult |
| 2:17–2:42 | Krátká architecture a Codex evidence | Jak Codex vytvořil manifest engine, tests a UI; co přesně dělá GPT-5.6 |
| 2:42–2:53 | Finální product statement a live URL | See what hearing sounds like |

### Video pravidla specifická pro Auralis

- Scene audio nahrát přímo z aplikace, ne mikrofonem v místnosti.
- Zachovat stejné zdroje a timing mezi A/B states.
- Voiceover vést kolem audio ukázek, aby je nepřekrýval.
- Přidat captions a jasný visible state label.
- Doporučit generic headphones; projekt musí zůstat srozumitelný i na laptop speakers.
- Nepoužít logo nebo název AirPods, cizí TV pořad, copyrighted music ani neauditované stock sounds.
- Otestovat výsledný YouTube stream, ne jen lokální master.
- Krátce ukázat Codex interface nebo konkrétní build artefakt; není to povinné, ale je to oficiálně doporučený signál.

---

## 13. Repository a documentation plan

### Doporučená minimální struktura

| Soubor nebo oblast | Účel |
| --- | --- |
| README.md | Problem, solution, quick start, live demo, testing, GPT-5.6 a Codex evidence |
| BUILD_WEEK_PROVENANCE.md | Stav před startem, soutěžní timeline a oddělení pre-existing planning od implementation |
| docs/architecture.md | Scene Director, manifest, deterministic engine a PWA flow |
| docs/adr/ | Několik rozhodnutí s důvodem a důsledkem |
| docs/safety.md | Educational boundary, audio safety, privacy a known limitations |
| THIRD_PARTY_NOTICES.md | Dependencies, licenses, fonts, icons, sounds a asset sources |
| samples/ | Synthetic model profile a default scene manifest |
| tests/ | Manifest validation, deterministic fixtures, clipping a critical user flow |
| .env.example | Pouze názvy proměnných, žádné secrets |

### Povinné README sections

1. What Auralis is.
2. The real problem and primary audience.
3. Live demo and demo video.
4. What is actually implemented.
5. Quick start.
6. Sample data and test route.
7. Architecture.
8. How GPT-5.6 is integrated and what it does.
9. How Codex was used across the build.
10. Key human product, engineering and design decisions.
11. Build Week provenance.
12. Safety, privacy and limitations.
13. Test coverage and supported platforms.
14. Third-party licenses.

### Public vs. private repo

Pro Auralis je doporučen **public repository**, pokud projde secret, personal data a asset audit:

- porota má okamžitý přístup;
- relevantní licence je viditelná;
- technická implementace se snáze prokazuje;
- nevzniká riziko chybného sdílení na předepsané e-maily.

Private repo je validní, ale musí být před deadline sdílen s:

- testing@devpost.com
- build-week-event@openai.com

---

## 14. IP, trademark a asset audit

### Vizuály

- GPT Image scene musí zobrazovat fiktivní osoby, ne konkrétní rodinné příslušníky bez souhlasu.
- Nezahrnovat brand logos, známé postavy, cizí fotografie ani rozpoznatelný TV obsah.
- Ukládat prompt, datum, model a relation k manifestu jako provenance.

### Voices

- Používat oprávněné AI TTS voices.
- Neimitovat konkrétní reálnou osobu.
- V produktu jasně přiznat AI-generated voices.
- Neukládat ani nevytvářet voice clone člena rodiny.

### Environmental audio

- Preferovat vlastní, CC0 nebo jednoznačně licencované samples.
- U každého souboru vést source URL, license, author a případnou attribution.
- Nepoužívat copyrighted music.
- TV source vytvořit jako generický fiktivní speech nebo noise asset bez cizí značky.

### UI assets

- Auditovat fonty, icon set, illustrations a sound glyphs.
- Relevantní licence uvést v THIRD_PARTY_NOTICES.
- Nepřenášet neověřené assety z Hearscape.

### Headphones a trademarks

AirPods Pro nejsou pro Family Experience potřebné. Zmínka může zůstat ve frozen future research, ale submitted app a video mají používat obecné označení headphones. Tím se odstraní trademark i proprietary-hardware distraction.

---

## 15. Health, safety a privacy alignment

### Co je správně

Frozen dokument už obsahuje velmi dobré hranice:

- educational and illustrative;
- not diagnostic;
- not prescriptive;
- not a medical device;
- no exact hearing-aid reproduction;
- no prediction of individual benefit;
- no commercial device recommendation;
- deterministic measurements nejsou clinical outcomes;
- professional assessment při suspected, sudden nebo changing loss;
- AI scene a voices disclosure.

### Co zůstává rizikové

- GPT explanation nad vlastním audiogramem může sklouznout k personalizované medical advice.
- Hearing Check může působit diagnosticky i přes disclaimer.
- Personal Support Preview může působit jako fitting nebo treatment.
- Upload audiogramu přináší sensitive health data a extraction error.
- Modelled gain přes headphones přináší safety a calibration riziko.

### Rules-driven mitigation

1. Competition core používá synthetic curated model profile.
2. Family Experience nečiní medical decision a neposkytuje treatment recommendation.
3. GPT-5.6 explanation používá allowlisted facts z EngineResult.
4. Zakázané claims se kontrolují schema, prompts, filters a tests.
5. Uživatelská data se neukládají, pokud to není nezbytné; default demo žádná personal data nepotřebuje.
6. Personal Support Preview, Hearing Check a upload extraction nejsou součástí submitted implementation.
7. Safety language je krátké a viditelné, ale neslouží jako náhrada technických guardrails.

---

## 16. Risk register

| Priorita | Riziko | Pravděpodobný dopad | Mitigace | Stop condition |
| ---: | --- | --- | --- | --- |
| P0 | Není rozhodnuta runtime cesta GPT-5.6 | Nesplněný mandatory tool proof nebo falešný claim | Rozhodnout server-side runtime a budget před core implementation | Bez rozhodnutí nezahajovat generative orchestration layer |
| P0 | Core code vznikne v mnoha rovnocenných threadech | Slabý nebo nesprávný /feedback evidence | Jeden primary build thread | Pokud se většina práce přesune, nově určit a chránit reprezentativní thread |
| P0 | Scope expansion | Nedokončený coherent product | Submission Core lock | Žádný stretch před complete vertical slice |
| P0 | A/B auditory effect nepřežije YouTube | Hero moment selže | Direct capture, compression test, headphones cue, same source | Nenatáčet finální video bez YouTube test uploadu |
| P1 | GPT-5.6 vypadá decorative | Nízké Stage One nebo Tech skóre | Structured manifest, validation a visible grounded result | Neuvádět central director bez skutečné runtime evidence |
| P1 | Codex contribution je obecný | Ztráta Tech a Idea bodů | Decision log, README examples, Codex UI snippet | README review proti README-02 |
| P1 | Health claim drift | Policy, trust a expert criticism | Model profile, allowlisted claims, odstranit personal preview | Jakýkoli diagnostic, prescriptive nebo benefit claim blokuje release |
| P1 | Nejasné asset licence | IP nebo submission problém | Asset ledger a audit | Nezařadit asset bez známé licence |
| P1 | API key nebo náklady | Security nebo demo outage | Server-side secret, cap, cache, timeout | Žádný client-side key |
| P2 | Generated image nesedí s audio positions | Design ztrácí důvěru | Manifest anchors a positional validation | Reject a regenerate inconsistent scene |
| P2 | Dlouhý onboarding | Hero moment se nevejde do videa | Demo shortcut a defaults | Demo scene dostupná do několika kliknutí |
| P2 | Public demo vyžaduje login nebo key | Porota nemusí testovat | Open demo route bez účtu | Release gate před submission |

---

## 17. Prioritizovaný action plan

### P0 — před hlavní implementací

- [ ] Zamknout kategorii Apps for Your Life.
- [ ] Potvrdit solo nebo team submission.
- [ ] Vytvořit nový Auralis repo a Build Week provenance.
- [ ] Určit primary Codex build thread.
- [ ] Rozhodnout skutečnou runtime cestu GPT-5.6 a oddělit ji od build-time Sol.
- [ ] Zamknout Submission Core z kapitoly 10.
- [ ] Rozhodnout asset licensing policy.
- [ ] Připravit README skeleton a decision log.

### P1 — vertical slice

- [ ] Default model profile a synthetic fixture.
- [ ] Manually authored default AcousticSceneManifest.
- [ ] Deterministic reference a hearing-profile A/B.
- [ ] Activity markers a accessible labels.
- [ ] Jedna support state.
- [ ] Jedna environment intervention.
- [ ] Baseline safety a clipping tests.
- [ ] Veřejně spustitelná PWA route.

### P2 — meaningful GPT-5.6 integration

- [ ] SceneIntent schema.
- [ ] GPT-5.6 manifest generation.
- [ ] Schema a semantic validation.
- [ ] Repair nebo fallback path.
- [ ] EngineResult-grounded explanation.
- [ ] Přesná runtime documentation a model identifier.

### P3 — product polish a evidence

- [ ] End-to-end user flow.
- [ ] Loading, error, timeout a cached states.
- [ ] Multi-browser a multi-output audio test.
- [ ] README Codex collaboration.
- [ ] ADR a safety documentation.
- [ ] Asset a license audit.
- [ ] /feedback Session ID uložen.

### P4 — submission

- [ ] Text description podle skutečně hotového produktu.
- [ ] Video script pod 3 minuty.
- [ ] Finální direct audio capture a YouTube test.
- [ ] Public deployment a anonymous test.
- [ ] Repo access nebo required private sharing.
- [ ] Final Official Rules review.
- [ ] Submission freeze a potvrzení odeslání.

---

## 18. Definition of Done pro Auralis submission

Auralis je submission-ready pouze tehdy, když platí současně:

- [ ] A user can open a public URL and start the prepared Family Experience without an account or API key.
- [ ] The same source scene can be switched between reference, hearing-profile, support, and environmental-improvement states.
- [ ] GPT-5.6 creates or validly adapts a structured scene artifact and its role is visible in code and demo.
- [ ] The deterministic engine, not the model, performs and reports the audio transformation.
- [ ] No state clips, creates an uncontrolled jump, or falsely equates louder with better.
- [ ] Visual source markers follow the manifest timing and include captions or text alternatives.
- [ ] The app contains no diagnostic, prescriptive, exact-device or individual-benefit claim.
- [ ] The default route uses synthetic data and no unnecessary personal health information.
- [ ] README can be followed from a clean environment.
- [ ] Codex collaboration and key human decisions are concrete and traceable.
- [ ] /feedback ID points to the primary core build thread.
- [ ] Every third-party asset and dependency has known provenance and license.
- [ ] Demo video is public, under 3:00, includes voiceover, working app audio, Codex and GPT-5.6.
- [ ] The deployed project remains free and available through the official judging period.
- [ ] The submission says only what the running project actually does.

---

## 19. Final rules-driven product statement

> **For OpenAI Build Week, Auralis is one complete Apps for Your Life experience: a family member selects a model hearing profile, GPT-5.6 turns a real relationship and difficult situation into a validated first-person acoustic scene, a deterministic engine preserves an honest A/B comparison, and the family hears both the difficulty and one practical way to improve the situation.**

### Strategické pravidlo po zveřejnění rules

> **Do not win by showing the whole platform. Win by proving one working family transformation, then let the architecture show that it can grow.**

---

## 20. Source register

- [OpenAI Build Week — Official Rules](https://openai.devpost.com/rules)
- [OpenAI Build Week — Overview and requirements](https://openai.devpost.com/)
- [OpenAI Build Week — Resources and official tips](https://openai.devpost.com/resources)
- [OpenAI Build Week — FAQ](https://openai.devpost.com/details/faqs)
- [OpenAI Build Week](https://openai.com/build-week/)
- [OpenAI Usage Policies](https://openai.com/policies/usage-policies/)
- Frozen source: Auralis_preparation_final.md, 12 July 2026

---

## 21. Changelog

| Verze | Datum | Změna |
| --- | --- | --- |
| 1.0 | 13. 7. 2026 | První rules-driven alignment review po zveřejnění plných categories, requirements, rules a FAQ |
