
const CompanyLogos = () => {
    return (
        <div className="bg-black">
            <div className="flex flex-wrap gap-3 gap-y-5 justify-around p-10">
                {["logo1.png", "logo2.png", "logo3.png", "logo4.png", "logo5.png"].map((logo, index) => (
                    <img key={index} src={`/images/${logo}`} alt="" />
                ))}
            </div>
        </div>
    )
}

export default CompanyLogos