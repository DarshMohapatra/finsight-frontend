import Navbar from './Navbar'
import Hero from './Hero'
import Features from './Features'
import ChatPreview from './ChatPreview'
import CTASection from './CtaSection'

export default function Landing() {
  return (
    <div style={{
      background: '#020408', minHeight: '100vh', color: '#e8eaf0',
      fontFamily: "'Syne',sans-serif", overflowX: 'hidden'
    }}>

      {/* Ambient glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '20%', width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(0,245,160,0.07) 0%, transparent 70%)', borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '-5%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)', borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '5%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(123,97,255,0.04) 0%, transparent 70%)', borderRadius: '50%'
        }} />
      </div>

      <Navbar />
      <Hero />
      <Features />
      <ChatPreview />
      <CTASection />
    </div>
  )
}