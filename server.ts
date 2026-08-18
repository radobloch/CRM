import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Google Gemini AI Client Lazy Initialization
  const getGeminiAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Endpoint for AI Assistant (Gemini)
  app.post('/api/ai', async (req, res) => {
    try {
      const { type, contactName, companyName, role, notes, deals, stage } = req.body;

      const ai = getGeminiAI();

      let prompt = '';
      let systemInstruction = 'Działasz jako Senior AI Sales Assistant w systemie Matchpoint CRM (zastępującym HubSpot dla zespołu 50 handlowców B2B). Odpowiadaj profesjonalnie, konkretnie i zwięźle w języku polskim lub niemieckim zależnie od kontekstu.';

      if (type === 'call_summary') {
        prompt = `Przeanalizuj historię kontaktu i przygotuj zwięzłe, punktowe podsumowanie ostatniej rozmowy handlowej z klientem.
Dane kontaktu:
- Imię i Nazwisko: ${contactName}
- Firma: ${companyName}
- Stanowisko: ${role || 'Decydent'}
- Etap pipeline: ${stage || 'Discovery'}
- Ostatnie notatki i ustalenia: ${notes || 'Brak wcześniejszych szczegółów'}
- Aktywne Deale: ${JSON.stringify(deals || [])}

Sformatuj wynik w punktach:
1. Kluczowe punkty dyskusji
2. Zidentyfikowane potrzeby i budżet
3. Uzgodnione Next Steps & Terminy`;
      } else if (type === 'email_draft') {
        prompt = `Napisz spersonalizowaną, perswazyjną propozycję wiadomości e-mail (follow-up B2B) do klienta po spotkaniu demonstracyjnym.
Dane kontaktu:
- Imię i Nazwisko: ${contactName}
- Firma: ${companyName}
- Stanowisko: ${role}
- Potencjał projektu: ${deals?.[0]?.value ? deals[0].value.toLocaleString('de-DE') + ' €' : '50.000 €'}
- Temat przewodni: Wdrożenie Matchpoint CRM z automatyzacją sprzedaży.

Wymagania:
- Zadbaj o profesjonalny ton (B2B SaaS / Enterprise)
- Zaproponuj konkretny termin na krótką rozmowę podsumowującą ofertę
- Podpisz: Twój Opiekun Klienta (Matchpoint Sales Team)`;
      } else if (type === 'lead_score') {
        prompt = `Oblicz i uzasadnij wskaźnik AI Lead Score (w skali 1-100) dla poniższego leada B2B w systemie Matchpoint CRM:
- Kontakt: ${contactName} (${role})
- Firma: ${companyName}
- Wartość transakcji: ${deals?.[0]?.value ? deals[0].value.toLocaleString('de-DE') + ' €' : '45.000 €'}
- Faza: ${stage}
- Historia interakcji: ${notes}

Podaj:
- Lead Score: [Liczba punktów np. 88/100] (Klasyfikacja: Gorący Lead / Ciepły Lead)
- 3 kluczowe czynniki sukcesu (pozytywne sygnały)
- 1 ryzyko / obszar do zaadresowania
- Rekomendowane natychmiastowe działanie dla handlowca`;
      } else {
        prompt = req.body.prompt || `Przeanalizuj szanse sprzedażowe dla kontaktu ${contactName} w ${companyName}.`;
      }

      if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            systemInstruction,
          },
        });

        return res.json({
          success: true,
          result: response.text || 'Wygenerowano odpowiedź AI.',
          model: 'gemini-3.7-flash',
        });
      } else {
        // Fallback intelligent simulation if GEMINI_API_KEY is not yet populated
        let simulatedResponse = '';
        if (type === 'call_summary') {
          simulatedResponse = `📌 **Podsumowanie rozmowy z ${contactName} (${companyName})**:
• **Kluczowe punkty:** Klient poszukuje alternatywy dla HubSpot ze względu na wysokie koszty licencyjne dla 50 handlowców i potrzebę lepszej integracji z DACH/PL.
• **Zidentyfikowane potrzeby:** Szybki import bazy 15 000 rekordów, dwustronna synchronizacja poczty oraz automatyczne przydzielanie leadów w czasie < 5 min.
• **Next Steps:** Przesłanie skalkulowanej oferty na licencję Enterprise do piątku g. 14:00; spotkanie techniczne z Działem IT we wtorek.`;
        } else if (type === 'email_draft') {
          simulatedResponse = `Szanowny Panie / Szanowna Pani ${contactName.split(' ')[1] || contactName},

Dziękuję za owocną rozmowę dotyczącą modernizacji procesów sprzedaży w firmie ${companyName}.

W nawiązaniu do poruszonego wątku ograniczenia kosztów obsługi CRM i wdrożenia automatycznego pipeline'u, przygotowałem wstępną kalkulację wdrożenia Matchpoint CRM. Szacujemy, że przejście na nasze rozwiązanie pozwoli Państwa zespołowi 50 handlowców zaoszczędzić do 35% budżetu rocznego przy zachowaniu pełnej funkcjonalności HubSpot.

Czy możemy zarezerwować 15 minut w najbliższy czwartek o 10:30, aby omówić szczegóły propozycji?

Z poważaniem,
Zespół Sprzedaży Matchpoint CRM`;
        } else {
          simulatedResponse = `🎯 **AI Lead Score: 92/100 (Kwalifikacja: Gorący Lead - High Priority)**

**Czynniki sukcesu:**
1. Decydent o silnej pozycji zarządczej (${role || 'Head of Sales'}) w firmie o rosnącym wolumenie.
2. Zdefiniowany budżet i termin decyzji w bieżącym kwartale Q3/Q4.
3. Wysoka responsywność w korespondencji e-mail (< 2h średni czas odpowiedzi).

**Główne ryzyko:**
• Weryfikacja bezpieczeństwa danych i zgodności z RODO przez wewnętrzny dział Compliance.

💡 **Rekomendacja:** Zablokuj termin na prezentację Security Whitepaper i zaoferuj bezpłatny 14-dniowy Proof of Concept.`;
        }

        return res.json({
          success: true,
          result: simulatedResponse,
          model: 'gemini-3.7-flash (simulation / local key mode)',
          notice: 'W celu bezpośrednich zapytań live podaj klucz GEMINI_API_KEY w panelu Settings lub na Vercelu.',
        });
      }
    } catch (error: any) {
      console.error('Gemini API Route Error:', error);
      res.status(500).json({
        success: false,
        error: error?.message || 'Wystąpił błąd podczas generowania odpowiedzi AI.',
      });
    }
  });

  // Vite middleware for dev
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Matchpoint CRM server listening on http://localhost:${PORT}`);
  });
}

startServer();
