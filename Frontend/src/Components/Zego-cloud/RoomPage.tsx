import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const RoomPage = () => {
  const { roomId } = useParams();
  const meetingContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const myMeeting = async () => {
      if (!meetingContainerRef.current) return; // Ensure the ref is available

      const appID = 858689502;
      const serverSecret = "13536c38af0b6f33ca48dc0d707efc92";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId!,
        Date.now().toString(),
        "Abhishek"
      );

      const zc = ZegoUIKitPrebuilt.create(kitToken);

      zc.joinRoom({
        container: meetingContainerRef.current,
        sharedLinks: [
          {
            name: "Copy Link",
            url: `http://localhost:5173/room/${roomId}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: false,
      });
    };

    myMeeting();
  }, [roomId]); // Re-run when roomId changes

  return <div ref={meetingContainerRef} />;
};

export default RoomPage;
