import { vyaparSetu } from '@/config/vyaparSetu';

/**
 * Approved Mexican companies from the MP Vyapar Setu meeting platform (meeting.intgrow.co).
 * Read through that platform's public `public_mexican_companies` function, which returns
 * business details only (no contact person, email or phone) for secretariat-approved companies.
 */
export interface MexicanCompany {
  id: string;
  company_name: string;
  brand: string | null;
  category: string | null;
  city: string | null;
  headquarters: string | null;
  description: string | null;
  website: string | null;
  certification: string | null;
  export_markets: string | null;
  established: string | null;
}

export class CompaniesUnavailableError extends Error {}

export async function fetchMexicanCompanies(): Promise<MexicanCompany[]> {
  const { url, publishableKey } = vyaparSetu.platformApi;
  let res: Response;
  try {
    res = await fetch(`${url}/rest/v1/rpc/public_mexican_companies`, {
      method: 'POST',
      headers: { apikey: publishableKey, 'Content-Type': 'application/json' },
      body: '{}',
    });
  } catch {
    throw new CompaniesUnavailableError('Could not reach the meeting platform.');
  }
  if (!res.ok) throw new CompaniesUnavailableError(`Meeting platform returned ${res.status}.`);
  const rows = (await res.json()) as MexicanCompany[];
  return Array.isArray(rows)
    ? [...rows].sort((a, b) => a.company_name.localeCompare(b.company_name))
    : [];
}
