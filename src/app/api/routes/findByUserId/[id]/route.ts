import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authentication";
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    const id = params.id;

    if (!id) {
        return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    if (session) {
        const response = await fetch(`${process.env.NEXT_BACKEND_URL}/routes/findByUserId/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { message: 'Error fetching data', status: response.status },
                { status: response.status }
            );
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
