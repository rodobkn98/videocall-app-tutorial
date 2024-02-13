import { db } from "@/lib/db";
import { Room } from "@prisma/client";
import { auth } from "@/auth";
import { VideoRoom } from "@/components/video-room";
import { Toaster } from "sonner";

interface RoomIdPageProps {
    params: {
        roomId: string;
    }
}

const RoomIdPage = async ({
    params,
}: RoomIdPageProps) => {
    let currentRoom: null | Room = null;
    const session = await auth();

    try {
       currentRoom = await db.room.findFirst({
        where: {
            id: params.roomId
        }
       })
       
       if (!currentRoom) {
        throw new Error("The Room does not exist")
       }

       
    } catch (error: any) {
        return (
            <div
                className="flex justify-center h-full items-center text-3xl font-bold text-center"
            >
                This Meeting does NOT EXIST
            </div>
        )
    }

    return (
        <>
            <VideoRoom
                room={currentRoom}
                username={session?.user?.name}
            />
            <Toaster />
        </>
    )
}

export default RoomIdPage;
