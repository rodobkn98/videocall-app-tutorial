"use client"
import '@livekit/components-styles';
import { Room } from "@prisma/client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface VideoRoomProps {
    room: Room;
    username?: string | null;
}

export const VideoRoom = ({
    room,
    username
}: VideoRoomProps) => {
    const [token, setToken] = useState("");
    const router = useRouter();

    const leaveRoom = () => {
        router.push("/home");
        router.refresh();
    }
    
    useEffect(() => {
        const uniqueId = uuidv4();
        const currentUsername = username ? username : `Guest ${uniqueId}`

        const setLivekitToken = async () => {
            try {
                const response = await fetch(`/api/livekit?room=${room.id}&username=${currentUsername}`)
                const data = await response.json();
                setToken(data.token);
            } catch (error) {
                console.log(error);
            }
        }

        setLivekitToken();
    }, [room.id, username])

    useEffect(() => {
        if (token !== "") {
            toast("Share the Video Meeting", {
                action: {
                    label: "Copy Link",
                    onClick: () => {
                        navigator.clipboard.writeText(window.location.toString())
                    }
                },
                position: "top-left",
                duration: 30000,
            })
        }
    }, [token])


    if (token === "") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center" >
                <Loader2
                    className="h-7 w-7 text-zinc-500 animate-spin my-4"
                />
                <p className="text-xs text-zinc-500" >
                    Loading...
                </p>
            </div>
        )
    }

    return (
        <LiveKitRoom
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video
            audio
            onDisconnected={leaveRoom}
        >
            <VideoConference />
        </LiveKitRoom>
    )
}
