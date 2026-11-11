export default function VideoBg() {
  return (
    <div className="video-bg" aria-hidden="true">
      <video
        className="video-bg__media"
        src="/hero-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="video-bg__wash" />
    </div>
  )
}
