import Button from './common/button';
import Bg from '/images/bg.png';
import useMediaQuery from '../hooks/useMediaQuery';

const Hero = () => {
    const isMobile = useMediaQuery('(min-width: 650px)');
    return (
        <section
            className="w-full h-screen flex items-center bg-gray-200 bg-none"
            style={{
                backgroundImage: isMobile ? `url(${Bg})` : '',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="container mx-auto flex flex-col gap-y-6 md:px-10 px-6 items-center md:items-start">
                <header className="w-full md:w-6/12 text-center md:text-left">
                    <h1 className="text-6xl sm:text-6xl font-bold    uppercase">
                        Find Clothes That Match Your Style
                    </h1>
                    <p className="mt-4 text-base md:text-lg text-gray-500">
                        Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
                    </p>
                </header>
                <Button className="rounded-full h-12 md:h-14 py-3 text-sm w-40 md:w-52 ">
                    Shop Now
                </Button>
                <div className="flex flex-wrap gap-6  ">
                    <div  >
                        <h2 className="text-3xl md:text-4xl font-bold">200+</h2>
                        <p className="text-gray-500">International Brands</p>
                    </div>
                    <div  >
                        <h2 className="text-3xl md:text-4xl font-bold">3000+</h2>
                        <p className="text-gray-500">Happy Customers</p>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold">2000+</h2>
                        <p className="text-gray-500">High-Quality Products</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;