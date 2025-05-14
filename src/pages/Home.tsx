import FeaturedProducts from '../components/FeaturedProducts';
import CompanyLogos from '../components/pages/Home/company-logos';
import Hero from '../components/pages/Home/hero';

const Home = () => {
  return (
    <div><Hero />
      <CompanyLogos />
      <FeaturedProducts type='New Arrivals' />
    </div>
  )
}

export default Home