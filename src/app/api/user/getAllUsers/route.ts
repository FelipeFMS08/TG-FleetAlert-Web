import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authentication';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (session) {
    const response = await fetch(`${process.env.NEXT_BACKEND_URL}/users/getAll`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ message: 'Error fetching data', status: response.status }, { status: response.status });
    }

    try {
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return NextResponse.json({ message: 'Error parsing JSON' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
}
