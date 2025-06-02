import Bg from '/images/bg.png';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { Link } from 'react-router-dom';

const Hero = () => {
    const isMobile = useMediaQuery('(min-width: 650px)');
    return (
        <section
            className="w-full  h-[calc(100vh_-_400px)] md:h-screen flex items-center bg-gray-200 bg-none "
            style={{
                backgroundImage: isMobile ? `url(${Bg})` : '',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="container mx-auto flex flex-col gap-y-6 md:px-10 px-6 items-center md:items-start">
                <header className="w-full lg:w-6/12  text-center md:text-left">
                    <h1 className="text-4xl  md:text-5xl   font-integral  uppercase">
                        Find Clothes That Match Your Style
                    </h1>
                    <p className="mt-4 text-sm md:text-lg text-gray-500">
                        Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
                    </p>
                </header>
                <Link
                    className="rounded-full h-12 md:h-14 py-3 text-sm w-52 cursor-pointer bg-black text-white flex justify-center items-center "
                    to='/shop'
                >
                    Shop Now
                </Link>
                <div className="flex flex-wrap gap-6  items-center justify-center text-center md:text-left md:justify-start">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-medium">200+</h2>
                        <p className="text-gray-500">International Brands</p>
                    </div>
                    <div  >
                        <h2 className="text-3xl md:text-4xl  font-medium">3000+</h2>
                        <p className="text-gray-500">Happy Customers</p>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-medium">2000+</h2>
                        <p className="text-gray-500">High-Quality Products</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;