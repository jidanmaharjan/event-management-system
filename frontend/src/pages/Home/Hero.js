import React, { useRef } from "react";

import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Image } from "@mantine/core";

const Hero = () => {
  const images = [
    "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/9703865/pexels-photo-9703865.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/12689084/pexels-photo-12689084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ];
  const slides = images.map((url) => (
    <Carousel.Slide key={url}>
      <Image src={url} />
    </Carousel.Slide>
  ));
  const autoplay = useRef(Autoplay({ delay: 3000 }));
  return (
    <section class="text-gray-600 body-font">
      <div className="h-screen flex">
        <Carousel
          height="90%"
          slideGap="md"
          loop
          withIndicators
          withControls={false}
          plugins={[autoplay.current]}
        >
          {slides}
        </Carousel>
      </div>
      <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
          <img
            class="object-cover object-center rounded"
            alt="hero"
            src="https://dummyimage.com/720x600"
          />
        </div>
        <div class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
          <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
            Before they sold out
            <br class="hidden lg:inline-block" />
            readymade gluten
          </h1>
          <p class="mb-8 leading-relaxed">
            Copper mug try-hard pitchfork pour-over freegan heirloom neutra air
            plant cold-pressed tacos poke beard tote bag. Heirloom echo park
            mlkshk tote bag selvage hot chicken authentic tumeric truffaut
            hexagon try-hard chambray.
          </p>
          <div class="flex justify-center">
            <button class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
              Button
            </button>
            <button class="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">
              Button
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
