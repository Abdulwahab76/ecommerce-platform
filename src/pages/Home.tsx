import FeaturedProducts from '../components/FeaturedProducts';
import CompanyLogos from '../components/pages/Home/company-logos';
import Hero from '../components/pages/Home/hero';
import { mockProducts } from "../data/mockProducts";

const Home = () => {
  return (
    <div>
      <Hero />
      <CompanyLogos />
      <FeaturedProducts type='New Arrivals' data={mockProducts.slice(0, 5)} />
      <FeaturedProducts type='Top Selling' data={mockProducts.slice(5, 10)} />
    </div>
  )
}

export default Home