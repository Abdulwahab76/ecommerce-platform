import FeaturedProducts from '../components/FeaturedProducts';
import Category from '../components/pages/Home/category';
import CompanyLogos from '../components/pages/Home/company-logos';
import Hero from '../components/pages/Home/hero';

const Home = () => {
  return (
    <div>
      <Hero />
      <CompanyLogos />
      <Category />
      <FeaturedProducts type='New Arrivals' />
      <FeaturedProducts type='Top Selling' />
    </div>
  )
}

export default Home