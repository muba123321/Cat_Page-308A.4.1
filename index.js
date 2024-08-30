import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_d4ardeTARUwUI0RKDZwqVPI3WsT4Qnp1clzN5ro91mtSfugd3ti6xXqmPXsUl6cF";

// This is made to store the breedId when we fetch data
let breedId = null;

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */

async function initialLoad() {
  try {
    const res = await axios.get("https://api.thecatapi.com/v1/breeds");

    const breeds = res.data;

    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading breeds:", error);
  }
}

// Calling the initial load function
initialLoad();

breedSelect.addEventListener("change", async function () {
  breedId = breedSelect.value;
  console.log(typeof breedId);
  try {
    const res = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_id=${breedId}&api_key=${API_KEY}&limit=17`,
      {
        onDownloadProgress: updateProgress,
      }
    );

    const images = res.data;

    // Clear existing carousel items and infoDump content
    Carousel.clear(); 

    images.forEach((image) => {
      const carouselElement = Carousel.createCarouselItem(
        image.url,
        image.breeds[0]?.name || "Cat Image",
        image.id
      );
      Carousel.appendCarousel(carouselElement);
    });
    Carousel.start();

    // Populating the infoDump with breed details
    const breedInfo = images[0]?.breeds[0];

    if (breedInfo) {
      infoDump.innerHTML = `<h2>${breedInfo.name}</h2>
     <p>${breedInfo.description}</p>
     <p><strong>Origin:</strong> ${breedInfo.origin}</p>
     <p><strong>Temperament:</strong> ${breedInfo.temperament}</p>
   `;
    }
  } catch (error) {
    console.error("Error fetching breed images:", error);
  }
});

/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */

// request interceptors
axios.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date().getTime() };
    console.log(config.timeout);
    console.log(config.metadata.startTime);
    console.log(
      "Request started at:",
      new Date(config.metadata.startTime).toLocaleString()
    );

    document.body.style.cursor = "progress";
    progressBar.style.width = "0%";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axios.interceptors.response.use(
  (response) => {
    console.log(response);
    const endTime = new Date().getTime();

    const duration = endTime - response.config.metadata.startTime;

    console.log(`Request completed in ${duration} ms`);
    console.log("Request ended at:", new Date(endTime).toLocaleString());

    document.body.style.cursor = "default";
    progressBar.style.width = "100%";
    return response;
  },
  (error) => {
    document.body.style.cursor = "default";
    progressBar.style.width = "0%";
    return Promise.reject(error);
  }
);

function updateProgress(progressEvent) {
  console.log(progressEvent);
  const total = progressEvent.total;
  const current = progressEvent.loaded;
  console.log(total);
  console.log(current);

  // Percentage calculation of progressEvent
  const percentCompleted = Math.round((current / total) * 100);

  // Progress bar updated according to the progressEvent in percentage
  progressBar.style.width = `${percentCompleted}%`;
}

/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  console.log("this is the iddddd " + imgId);
  try {
    // we try to get all the favourites data if any exist in the database so we can compare the imgId and that id is same or exist then we delete if not we make a post request to make it a favourite.
    const getFavourite = await axios.get(
      `https://api.thecatapi.com/v1/favourites`,
      {
        headers: {
          "x-api-key": API_KEY,
        },
      }
    );
    console.log(getFavourite.data);

    const favouriteExist = getFavourite.data.some(
      (favourite) => favourite.image_id === imgId
    );

    console.log(favouriteExist);

    if (favouriteExist) {
      // if the favourite exist then we delete it from the database
      const idToDelete = getFavourite.data.find(
        (favourite) => favourite.image_id === imgId
      ).id;
      const deleteFavourite = await axios.delete(
        `https://api.thecatapi.com/v1/favourites/${idToDelete}`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      console.log('///////////////');
      console.log('Favourite deleted:', deleteFavourite.data);
      console.log('...............');
    } else {
      // if the favourite does not exist then we make a post request to make it a favourite.
    const response = await axios.post('https://api.thecatapi.com/v1/favourites', {
      image_id: imgId,
    }, {
      headers: {
        'x-api-key': API_KEY,
       
      }
    });

    console.log('Favourite created:', response.data);
    return response.data;
    }
  } catch (error) {
    console.error("Error creating favourite:", error);
  }
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */


async function getFavourites() {
  try {
    // Fetch the list of favourites
    const favouriteResponse = await axios.get('https://api.thecatapi.com/v1/favourites?limit=20&order=DESC', {
      headers: {
        'x-api-key': API_KEY,
        "content-type":"application/json",
      }
    });
     // clear carousel to make way for favourite 
    Carousel.clear();

    const favouriteData = favouriteResponse.data;
    console.log(favouriteData);

   
   

    // Adding favourilte to carousel function 
    favouriteData.forEach((favourite) => {
      console.log(favourite.image.url);
      console.log( favourite.image.id);
      const favouriltecarouselElement = Carousel.createCarouselItem(
        favourite.image.url,
        "Cat Image",
        favourite.image.id
      );
      Carousel.appendCarousel(favouriltecarouselElement);
    });

    // Restart the carousel
    Carousel.start();
  } catch (error) {
    console.error('Error fetching favourites:', error.message);
  }
}

//  getFavourites function is call in an addEvnetListner for the getfavourite button
getFavouritesBtn.addEventListener('click', getFavourites);


/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */


