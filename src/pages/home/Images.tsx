// import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const images = [
    [require("../../assets/img/features/profilecmd.png"), '/profile & /masteries » Quickly view lots of data about a summoner.'],
    [require("../../assets/img/features/champions.png"), "/champion & /counters & /synergies » Quickly view lots of data about a champion."],
    [require("../../assets/img/features/match.png"), "/matches » Check a summoners previous matches and match data."],
    [require("../../assets/img/features/patchnotes.png"), "/patchnotes » Automatically receive the latest patch notes on any channel!"],
]

export default function Images() {
    // const [image, setImage] = useState(0);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setImage(image => (image + 1) % images.length);
    //     }, 5000);

    //     return () => clearInterval(interval);
    // }, []);

    return (
        // <div className="carousel grid gap-4 grid-cols-1 sm:grid-cols-3 grid-rows-1 px-3">
        //     <FontAwesomeIcon icon="fa-solid fa-caret-left" className="text-white text-right m-auto mr-4 h-20 opacity-40 hidden sm:block" />
        //     <div>
        //         <img src={images[image][0]} alt={images[image][1]} className="w-full" />
        //         <p className="w-fit sm:w-full text-gray-200">
        //             <FontAwesomeIcon icon="fa-solid fa-caret-right" className="text-white text-right m-auto mr-4 h-10 opacity-40 block sm:hidden" />
        //             {images[image][1]}
        //             <FontAwesomeIcon icon="fa-solid fa-caret-left" className="text-white text-left m-auto ml-4 h-10 opacity-40 block sm:hidden" />
        //         </p>
        //     </div>
        //     <FontAwesomeIcon icon="fa-solid fa-caret-right" className="text-white text-left m-auto ml-4 h-20 opacity-40 hidden sm:block" />
        // </div>
        <Carousel className="max-w-32 mt-5 w-80 sm:w-[60vw] m-auto" autoPlay infiniteLoop interval={5000} showThumbs={false} emulateTouch transitionTime={800} showArrows showIndicators={false} swipeable>
            {
                images.map(([src, alt], index) => (
                    <div className="h-[60vh] w-auto block" key={index}>
                        <img {...{src, alt}} className="h-auto max-h-[80%] md:max-h-[90%] w-auto object-contain image-shadow" loading="lazy" />
                        <p className="text-white text-shadow-lg">{alt}</p>
                    </div>
                ))
            }
        </Carousel>
    )
}