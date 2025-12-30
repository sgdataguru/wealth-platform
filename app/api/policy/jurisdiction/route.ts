import { NextResponse } from 'next/server'

type PolicyRequest = {
  rmJurisdiction?: string;
  clientJurisdiction?: string;
  action?: string;
}

// Basic policy matrix - can be extended or loaded from DB/config
const POLICY_MATRIX: Record<string, string[]> = {
  // RM jurisdiction -> allowed client jurisdictions for most actions
  'DIFC': ['DIFC', 'ADGM'],
  'ADGM': ['ADGM', 'DIFC'],
  'SAMA': ['SAMA'],
  'CMA': ['CMA'],
}

export async function POST(req: Request) {
  try {
    const body: PolicyRequest = await req.json();
    const rm = body.rmJurisdiction || 'DIFC';
    const client = body.clientJurisdiction || 'DIFC';
    const allowed = (POLICY_MATRIX[rm] || []).includes(client);
    const reason = allowed ? 'Allowed by policy matrix' : 'Restricted: cross-jurisdiction rule';
    return NextResponse.json({ success: true, data: { allowed, reason } });
  } catch (err) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_REQUEST', message: 'Invalid policy request' } }, { status: 400 });
  }
}
