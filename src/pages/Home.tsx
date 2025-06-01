import FeaturedProducts from '../components/FeaturedProducts';
import Category from '../components/pages/Home/category';
import CompanyLogos from '../components/pages/Home/company-logos';
import Hero from '../components/pages/Home/hero';
import TopSellingProducts from '../components/TopSelling'
import TrendingProducts from '../components/TrendingProducts';
const Home = () => {
  return (
    <div>
      <Hero />
      <CompanyLogos />
      <Category />
      <FeaturedProducts type='New Arrivals' />
      <TrendingProducts />
      <TopSellingProducts />
    </div>
  )
}

export default Home