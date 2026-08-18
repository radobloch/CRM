import { GoogleGenAI } from '@google/genai';

// Lazy initialization of Google Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Brak klucza GEMINI_API_KEY w zmiennych środowiskowych.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, contactName, companyName, role, notes, deals, stage } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'Brak konfiguracji GEMINI_API_KEY na Vercelu / serwerze.' },
        { status: 500 }
      );
    }

    const ai = getGeminiClient();

    let prompt = '';
    let systemInstruction =
      'Działasz jako Senior AI Sales Assistant w systemie Matchpoint CRM (zastępującym HubSpot dla zespołu 50 handlowców B2B). Odpowiadaj profesjonalnie, konkretnie i zwięźle w języku polskim lub niemieckim zależnie od kontekstu.';

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
      prompt = body.prompt || `Przeanalizuj szanse sprzedażowe dla kontaktu ${contactName} w ${companyName}.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    return Response.json({
      success: true,
      result: response.text || 'Brak odpowiedzi tekstowej z modelu.',
      model: 'gemini-3.7-flash',
    });
  } catch (error: any) {
    console.error('Błąd Gemini Route Handler:', error);
    return Response.json(
      { error: error?.message || 'Wystąpił błąd podczas generowania odpowiedzi AI.' },
      { status: 500 }
    );
  }
}
