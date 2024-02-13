import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
) {
    try {
        const session = await auth();

        // No deberia ejecutarse esta linea porque en el middleware ya verificamos que el usuario esta logeado, lo hacemos por typing
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { roomName } = await req.json();

        const roomCreated = await db.room.create({
            data: {
                name: roomName,
                userId: session.user.id
            }
        })


        return NextResponse.json({
            room: roomCreated
        })
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
