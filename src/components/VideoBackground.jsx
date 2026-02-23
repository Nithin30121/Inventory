import bgVideo from "../assets/bg.mp4";

export default function VideoBackground() {
  return (
    <div className="video-bg">
      <video
        className="video-bg__video"
        src={bgVideo}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="video-bg__overlay" />
    </div>
  );
}