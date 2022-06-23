// import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const images = [
    [require("../../assets/img/features/profilecmd.png"), '/profile & /masteries » Quickly view lots of data about a summoner.'],
    [require("../../assets/img/features/champions.png"), "/champion & /counters & /synergies » Quickly view lots of data about a champion."],
    [require("../../assets/img/features/match.png"), "/matches » Check a summoners previous matches and match data."],
    [require("../../assets/img/features/graphs.png"), "/graph & /mmr » Check and graph a player's MMR and LP!"],
    [require("../../assets/img/features/patchnotes.png"), "/patchnotes » Automatically receive the latest patch notes on any channel!"],
]

export default function Images() {
    return (
        <Carousel className="max-w-32 mt-5 w-80 sm:w-[60vw] m-auto" autoPlay infiniteLoop interval={5000} showThumbs={false} emulateTouch transitionTime={800} showArrows showIndicators={false} swipeable stopOnHover={false}>
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