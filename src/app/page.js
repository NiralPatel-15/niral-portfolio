import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ScrollReveal from '@/components/ScrollReveal'
import About from '@/components/About'
import Education from '@/components/Education'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ScrollReveal delay={0}><About /></ScrollReveal>
        <ScrollReveal delay={100}><Education /></ScrollReveal>
        <ScrollReveal delay={100}><Skills /></ScrollReveal>
        <ScrollReveal delay={150}><Projects /></ScrollReveal>
        <ScrollReveal delay={100}><Contact /></ScrollReveal>
      </main>
      <Footer />
    </>
  )
}
