//Es un react SERVER component

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { HomeNavbar } from "@/components/home-navbar";
import { CreateRoomForm } from "@/components/create-room-form";
import { Card } from "@/components/card";

const HomePage = async () => {
    const session = await auth();

    // No debería pasar dado nuestro middleware, pero lo hacemos para el typing de typescript
    if (!session?.user) {
        redirect("/")
    }

    const userVideoRooms = await db.room.findMany({
        where: {
            userId: session.user.id
        }
    })

    return (
        <div className="flex flex-col h-full justify-between" >
            <div>
                <HomeNavbar username={session.user.name as string} />
                <CreateRoomForm />
                <div className="mt-12 mb-7 ml-4 text-2xl font-bold" >
                    Your Video Meetings
                </div>
                <div
                    className="flex justify-center space-x-6 px-4 py-8 overflow-auto shadow-xl bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 rounded border-y border-gray-400/70"
                >
                    {userVideoRooms.length === 0 && (
                        <h3 className="text-xl font-bold" >You do not have rooms yet</h3>
                    )}
                    {userVideoRooms.map((videoRoom) => (
                        <Card
                            key={videoRoom.id}
                            roomId={videoRoom.id}
                            roomName={videoRoom.name}
                        />
                    ))}
                </div>
            </div>
            <div
                className="bg-black text-white text-center p-4 mt-24"
            >
                Developed by © Rodo Mendoza
            </div>
        </div>
    )
}

export default HomePage
