import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authentication';

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  const command = await request.json();

  if (session) {
    const response = await fetch(`${process.env.NEXT_BACKEND_URL}/users/updateUserInfos/${session.user?.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command)
    });

    if (!response.ok) {
      return NextResponse.json({ message: 'Error put data', status: response.status }, { status: response.status });
    }

    try {
      const data = await response.json();
      console.log(data);
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return NextResponse.json({ message: 'Error parsing JSON' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
}
