import { authOptions } from "@/lib/authentication";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (session) {
      try {
        const requestBody = await request.json();
        const response = await fetch(`${process.env.NEXT_BACKEND_URL}/vehicles/create`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
          return NextResponse.json({ message: 'Error fetching data', status: response.status }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
      } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Error handling request' }, { status: 500 });
      }
    }
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
   }