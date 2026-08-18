# ⚡ Matchpoint CRM

> **Nowoczesny, wewnętrzny system CRM dla 50 handlowców B2B, zastępujący HubSpot.**  
> Zbudowany w oparciu o React / Next.js, TypeScript, Tailwind CSS oraz zintegrowany z **Google Gemini 3.7 Pro AI**.

---

## 🌟 O Projekcie

**Matchpoint CRM** to dedykowana platforma do zarządzania relacjami z klientami oraz lejkiem sprzedaży (*Sales Pipeline*), stworzona jako lekka, superszybka i tańsza alternatywa dla drogich instancji HubSpot Sales Hub Enterprise. 

Aplikacja wspiera pełen cykl sprzedaży B2B w regionie DACH & CEE, oferując interaktywną tablicę Kanban, 3-kolumnowy widok rekordu kontaktu, moduł firm, pełną historię aktywności (*Timeline*) oraz wbudowanego inteligentnego asystenta sprzedaży zasilanego przez **Google Gemini API**.

---

## 🚀 Główne Funkcjonalności

### 1. 📊 Interaktywny Pipeline Sprzedaży (Kanban Board)
- **Natywny Drag-and-Drop**: Płynne przeciąganie kart transakcji między etapami lejka sprzedaży.
- **Dynamiczne Sumowanie**: Każda kolumna automatycznie przelicza łączną wartość dealów (€) oraz liczbę aktywnych procesów.
- **Etapy Procesu Sprzedaży**:
  1. *Neuer Lead / Qualifizierung* (20%)
  2. *Discovery & Demo* (40%)
  3. *Angebot versendet (Proposal Sent)* (65%)
  4. *Verhandlung & Rechtsprüfung (Negotiation)* (85%)
  5. *Gewonnen (Closed Won)* (100%)
  6. *Verloren (Closed Lost)* (0%)
- **Szybkie tworzenie transakcji**: Dodawanie deala bezpośrednio do wybranej fazy za pomocą jednego kliknięcia (`+`).

### 2. 👥 Zarządzanie Kontaktami (HubSpot UX)
- **Tabela CRM**: Kolumny z avatarem, powiązaną firmą, przypisanym handlowcem (*Owner*), statusem cyklu życia (*Lifecycle Stage*), mailem i telefonem.
- **Zapisane Widoki (*Saved Views*)**: Filtry szybkiego dostępu (*Alle Kontakte*, *Meine Kontakte*, *Neue Leads*, *Kunden*, *High-Potential > 50k €*) z opcją zapisu własnych kryteriów.
- **Wysuwany Panel (*Side Drawer*)**: Błyskawiczne dodawanie nowego kontaktu bez opuszczania widoku tabeli.
- **Akcje masowe (*Bulk Actions*)**: Grupowe wysyłanie wiadomości, zmiana opiekuna handlowego oraz eksport danych do pliku `.csv`.

### 3. 📑 3-Kolumnowa Strona Rekordu Klienta (`/contacts/[id]`)
- **Lewy panel**: Dane kontaktowe, modyfikowalne właściwości (*E-mail, Telefon, Stanowisko, Lifecycle Stage, Potencjał transakcji*).
- **Środkowy panel (Timeline & Composer)**:
  - Interaktywne formularze do rejestracji notatek, maili, rozmów telefonicznych, zadań z przypomnieniami oraz spotkań w kalendarzu.
  - Chronologiczny strumień zdarzeń z filtrami kategorii.
- **Prawy panel (Asocjacje)**: Powiązane przedsiębiorstwo (*Company*), aktywne transakcje (*Deals*) oraz repozytorium załączników i dokumentów.

### 4. 🤖 AI Assistant (Google Gemini 3.7 Pro)
Zintegrowany asystent wspierający handlowców w codziennych zadaniach:
- **Zatwierdź podsumowanie rozmowy**: Automatyczna ekstrakcja ustaleń, zidentyfikowanych potrzeb i *Next Steps* z historii rozmowy.
- **Wygeneruj propozycję maila**: Przygotowanie spersonalizowanego follow-upu B2B dopasowanego do etapu transakcji.
- **Oblicz Lead Score**: Ocena punktowa leada (1-100) z analizą czynników sukcesu, ryzyk i rekomendacjami.

### 5. 🛡️ Przełącznik Profili i Ról (RBAC)
- Błyskawiczne przełączanie perspektywy między **Super Admin / VP of Sales** (pełny wgląd w 50 handlowców i metryki globalne) a **Senior Account Executive** (widok przydzielonych zadań i własnego pipeline'u).

### 6. 💾 Trwałość Danych (Persistent Storage)
- Wszystkie zmiany (nowe rekordy, przesunięcia kart na Kanbanie, notatki) są natychmiast synchronizowane w `localStorage` przeglądarki.

---

## 🛠️ Stos Technologiczny

| Warstwa | Technologia |
|---|---|
| **Frontend** | React 18 / Next.js (App Router), TypeScript |
| **Stylizacja & UI** | Tailwind CSS, Lucide Icons, Glassmorphism (*Frosted Glass Theme*) |
| **Zarządzanie Stanem** | React Context API (`CRMContext`) + LocalStorage Sync |
| **Sztuczna Inteligencja** | Google Gemini API (`@google/genai` / `gemini-3.7-flash`) |
| **Wykresy & Wizualizacja** | Recharts, Canvas Confetti |
| **Deployment** | Vercel Serverless Platform |

---

## 📦 Struktura Projektu

```text
matchpoint-crm/
├── app/                        # Next.js App Router
│   ├── api/
│   │   └── ai/
│   │       └── route.ts        # Backendowy handler Google Gemini API
│   ├── layout.tsx              # Główny layout z CRMProvider
│   └── page.tsx                # Strona główna aplikacji
├── src/
│   ├── components/             # Komponenty interfejsu użytkownika
│   │   ├── AIAssistantWidget.tsx   # Widżet asystenta AI Gemini
│   │   ├── ContactRecordPage.tsx   # 3-kolumnowy rekord kontaktu
│   │   ├── ContactsView.tsx        # Widok tabelaryczny z zapisanymi widokami
│   │   ├── NewContactDrawer.tsx    # Wysuwany panel dodawania kontaktu
│   │   ├── PipelineView.tsx        # Tablica Kanban Drag & Drop
│   │   ├── Header.tsx              # Pasek górny z globalną wyszukiwarką
│   │   └── Sidebar.tsx             # Nawigacja boczna
│   ├── context/
│   │   └── CRMContext.tsx      # Globalny stan aplikacji i synchronizacja
│   ├── data/
│   │   └── mockData.ts         # Realistyczne dane startowe B2B (DE/PL)
│   └── types/
│       └── crm.ts              # Ścisłe definicje typów TypeScript
├── .env.example                # Wzorzec konfiguracji zmiennych środowiskowych
├── package.json
└── tailwind.config.js
