import Hero from '../components/Hero'
import FeaturedCollections from '../components/FeaturedCollections'
import ProductRail from '../components/ProductRail'
import InstagramGallery from '../components/InstagramGallery'
import StudioStrip from '../components/StudioStrip'
import About from '../components/About'
import Contact from '../components/Contact'
import Seo from '../components/Seo'
import { products } from '../lib/catalog'

export default function Home() {
  const list = products.filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i).slice(0, 10)
  return (
    <>
      <Seo
        title="Ajitha Collection | Your Style. Your Design. Our Craft."
        description="Premium custom women’s fashion. Browse the edit, choose a look, and order on WhatsApp — made to measure in 7–10 days."
      />
      <Hero />
      <FeaturedCollections />
      <ProductRail eyebrow="New in" title="This season’s edit" products={list} />
      <StudioStrip />
      <InstagramGallery />
      <About />
      <Contact />
    </>
  )
}
