/* eslint-disable */
import { useRef, useEffect } from "react";
import {
  RtmChannel,
  RtmClient,
  createChannel,
  createClient,
} from "agora-rtm-react";
import { useNavigate, useParams } from "react-router-dom";
import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";

export const Room = () => {
  let localStream: MediaStream;
  let remoteStream: MediaStream;
  let peerConnection: RTCPeerConnection;
  let client: RtmClient;
  let channel: RtmChannel;

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const cameraOnRef = useRef<HTMLDivElement>(null);
  const cameraOffRef = useRef<HTMLDivElement>(null);

  const micOnRef = useRef<HTMLDivElement>(null);
  const micOffRef = useRef<HTMLDivElement>(null);

  const { roomId } = useParams();
  const navigate = useNavigate();

  // const appId = import.meta.env.VITE_API_KEY;
  const appId = "29edcc62cadd4e3eb17e27d495f2da7b";
  // const appId = "29edcc62cadd4e3eb17e27d495f2da7b";
  const uid = String(Math.floor(Math.random() * 10000));
  const token = "e5c7978afdbb4f1997d873d93d97398b";

  useEffect(() => {
    if (!roomId) {
      navigate("/");
      return;
    }

    const useClient = createClient(appId);
    const useChannel = createChannel(roomId);

    const constraints = {
      video: {
        width: { min: 640, ideal: 1920, max: 1920 },
        height: { min: 480, ideal: 1080, max: 1080 },
      },
      audio: true,
    };

    const init = async () => {
      client = useClient();
      channel = useChannel(client);

      try {
        await client.login({ uid, token });
        await channel.join();
      } catch (err) {
        console.log("Error occurred at login: ", err);
      }

      channel.on("MemberJoined", handleUserJoin);
      client.on("MessageFromPeer", handleMessageFromPeer);
      channel.on("MemberLeft", handleUserLeft);

      try {
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
      } catch (error) {
        console.log("Error accessing local media: ", error);
      }
    };
    init();

    // Cleanup function
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, []);

  const handleUserJoin = async (MemberId: string) => {
    createOffer(MemberId);
  };

  const handleMessageFromPeer = async (message: any, MemberId: string) => {
    message = JSON.parse(message.text);

    if (message.type === "offer") {
      createAnswer(MemberId, message.offer);
    }

    if (message.type === "answer") {
      addAnswer(message.answer);
    }

    if (message.type === "candidate") {
      if (peerConnection) {
        try {
          await peerConnection.addIceCandidate(message.candidate);
        } catch (error) {
          console.log("Error adding ICE candidate: ", error);
        }
      }
    }
  };

  const handleUserLeft = async () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.style.display = "none";
      if (localVideoRef.current) {
        localVideoRef.current.classList.remove("smallFrame");
      }
    }
  };

  const leaveChannel = async () => {
    await channel.leave();
    await client.logout();
  };

  window.addEventListener("beforeunload", leaveChannel);

  const createPeerConnection = async (MemberId: string) => {
    peerConnection = new RTCPeerConnection();
    remoteStream = new MediaStream();

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.style.display = "block";
      if (localVideoRef.current) {
        localVideoRef.current.classList.add("smallFrame");
      }
    }

    localStream?.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await client.sendMessageToPeer(
          {
            text: JSON.stringify({
              type: "candidate",
              candidate: event.candidate,
            }),
          },
          MemberId
        );
      }
    };
  };

  const createOffer = async (MemberId: string) => {
    createPeerConnection(MemberId);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    await client.sendMessageToPeer(
      { text: JSON.stringify({ type: "offer", offer: offer }) },
      MemberId
    );
  };

  const createAnswer = async (MemberId: string, offer: any) => {
    createPeerConnection(MemberId);
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    await client.sendMessageToPeer(
      { text: JSON.stringify({ type: "answer", answer: answer }) },
      MemberId
    );
  };

  const addAnswer = async (answer: any) => {
    if (peerConnection && !peerConnection.currentRemoteDescription) {
      try {
        await peerConnection.setRemoteDescription(answer);
      } catch (error) {
        console.log("Error setting remote description: ", error);
      }
    }
  };

  const toggleCamera = () => {
    let videoTrack = localStream
      .getTracks()
      .find((track) => track.kind === "video");

    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      if (cameraOffRef.current && cameraOnRef.current) {
        cameraOffRef.current.style.display = videoTrack.enabled
          ? "none"
          : "block";
        cameraOnRef.current.style.display = videoTrack.enabled
          ? "block"
          : "none";
      }
    }
  };

  const toggleMic = () => {
    let audioTrack = localStream
      .getTracks()
      .find((track) => track.kind === "audio");

    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      if (micOffRef.current && micOnRef.current) {
        micOffRef.current.style.display = audioTrack.enabled ? "none" : "block";
        micOnRef.current.style.display = audioTrack.enabled ? "block" : "none";
      }
    }
  };

  return (
    <div className="room">
      <div id="videos">
        <video
          className="video-player"
          id="user-1"
          ref={localVideoRef}
          autoPlay
          playsInline
        ></video>
        <video
          className="video-player"
          id="user-2"
          ref={remoteVideoRef}
          autoPlay
          playsInline
        ></video>
      </div>
      <div id="buttons">
        <div onClick={toggleCamera}>
          <div ref={cameraOnRef}>
            <Video color="white" size={40} />
          </div>
          <div ref={cameraOffRef} style={{ display: "none" }}>
            <VideoOff color="white" size={40} />
          </div>
        </div>
        <div onClick={toggleMic}>
          <div ref={micOnRef}>
            <Mic color="white" size={40} />
          </div>
          <div ref={micOffRef} style={{ display: "none" }}>
            <MicOff color="white" size={40} />
          </div>
        </div>
        <div
          onClick={() => {
            leaveChannel().then(() => {
              navigate("/");
            });
          }}
        >
          <Phone color="red" size={40} />
        </div>
      </div>
    </div>
  );
};
