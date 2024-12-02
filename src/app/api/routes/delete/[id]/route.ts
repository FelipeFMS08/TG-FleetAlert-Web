import { authOptions } from "@/lib/authentication";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    const id = params.id;

    if (session && id) {
      try {
        const response = await fetch(`${process.env.NEXT_BACKEND_URL}/routes/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          return NextResponse.json({ message: 'Error delete route', status: response.status }, { status: response.status });
        }
        
        return NextResponse.json(response.status);
      } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Error handling request' }, { status: 500 });
      }
    }
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
   }