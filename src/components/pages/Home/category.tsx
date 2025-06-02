import { Link } from "react-router-dom"


const Category = () => {
    const categories = [
        {
            name: 'Watches',
            slug: 'watches',
            image: 'https://png.pngtree.com/thumb_back/fh260/background/20230717/pngtree-elegant-white-analog-men-s-wrist-watch-with-a-classic-twist-image_3891045.jpg'
        },
        {
            name: 'Clothes',
            slug: 'clothes',
            image: 'https://burst.shopifycdn.com/photos/clothing-on-retail-rack.jpg?width=1000&format=pjpg&exif=0&iptc=0'
        },
        {
            name: 'Shoes',
            slug: 'shoes',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMuOGDrc4Xdo7_hutCwqC2fWcd7yeFXFiOww&s'
        }
    ];
    return (
        <div className="mx-auto px-10 md:px-20 flex justify-center items-center flex-col py-10 md:py-20">
            <h2 className="text-2xl font-semibold mb-4 font-integral">Categories</h2>
            <div className="flex w-full justify-around  gap-5 *:p-10 basis-full md:flex-nowrap flex-wrap  md:basis-3/12 py-5">
                {categories.map((category) => (
                    <div
                        className="  transition-transform transform hover:scale-105 cursor-pointer h-full w-full bg-no-repeat bg-cover min-h-60"
                        style={{ backgroundImage: `url(${category.image})` }}
                    >
                        <Link to={`/category/${category.slug}`} >     <h2 className="text-2xl font-semibold mb-4 font-integral flex w-full justify-end items-center h-full">{category.name}</h2>  </Link>
                    </div>

                ))}

            </div>

        </div >
    )
}

export default Category