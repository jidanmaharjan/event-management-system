import React from "react";

//image imports
import errorimg from "../../assets/images/404.png";

const Error = () => {
  return (
    <section class="text-gray-600 body-font">
      <div class="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
        <img
          class="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded"
          alt="hero"
          src={errorimg}
        />
        <div class="text-center lg:w-2/3 w-full">
          <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
            404 Not Found
          </h1>
          <p class="mb-8 leading-relaxed">
            You have ventured through the stars and moons to the place where you
            should not be. Run away as soon as possible.
          </p>
          <div class="flex justify-center">
            <button class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Error;
