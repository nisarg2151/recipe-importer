# Recipe Importer
An API endpoint that takes a single parameter as URL of the targeted recipe and returns custom formatted JSON data representing the Name, Ingredients and Steps of the targeted recipe.
## Prerequisites
* npm 6+
* node.js 10+

Getting Started
---------------
* **The easiest way to get started is to clone the repository.**
* **Following steps will make an endpoint available @ http://localhost:3000/recipe?url=?**
* **API documentation is available @ http://localhost:3000/api-docs Hit ‘try it out’ button, and you can play with it.**
```bash
# Get the latest snapshot
git clone https://github.com/nisarg2151/recipe-importer myproject
# Change directory
cd myproject
# Install NPM dependencies
npm install
# Then simply start your app
npm run dev
```
## Few examples to try
* http://localhost:3000/recipe?url=https%3A%2F%2Fcooking.nytimes.com%2Frecipes%2F1017518-panzanella-with-mozzarella-and-herbs
* http://localhost:3000/recipe?url=https%3A%2F%2Fwww.eatthelove.com%2Fcookies-and-cream-cookies
* http://localhost:3000/recipe?url=https%3A%2F%2Fwww.maangchi.com%2Frecipe%2Fbugeopo-gochujang-muchim
* http://localhost:3000/recipe?url=https%3A%2F%2Fwww.laurainthekitchen.com%2Frecipes%2Fcroque-madam%2F
## Tech Stack / Libraries Used
*   **Node.js** an asynchronous event-driven JavaScript runtime, Node.js is designed to build scalable network applications.
*   **TypeScript** is a super-set of JavaScript. Most valid JavaScript code can be written in TypeScript file(.ts). we will use it with a strict mode. All types have to be explicitly specified.
*  **Express** is a framework built on top of Node.js. It has a lot of features, utility methods and middleware to help us create scalable and robust APIs quickly. The last version fully supports async/await, so no callback and no explicit promises in our routes/controllers.
*  **cheerio** — jQuery for Node.js. Cheerio makes it easy to select, edit, and view DOM elements.
*  **request-promise** — The simplified HTTP request client 'request' with Promise support.
*  **swagger-ui-express** — This module allows us to serve auto-generated swagger-ui generated API docs from express, based on a swagger.json file. The result is living documentation for API hosted from our API server via a route

## Architecture:
* Basic error handling like missing URL parameter in request and api docs for reference were taken care of (refer middleware folder)
* Two major files controlling our application are explained below:
    - RecipeDataProvider will make a request to specified URL, fetch the HTML document as a string and pass it on to RecipeController for further processing.
    - RecipeController will parse and traverse the HTML DOM using cheerio library and extract required data to form required JSON, some of the major functions are explained below:
    - getRecipeName($)
         * @param {CheerioStatic} $ - Cheerio HTML DOM object 
         * @returns {string} Recipe name extracted from title after cleaning up extra appended text
    - getIngredients($)
         * @param {CheerioStatic} $ - Cheerio HTML DOM object 
         * @returns {Array} Array of ingredient objects of type {name: name, quantity: quantity, unit: unit }
    - getSteps($)
         * @param {CheerioStatic} $ - Cheerio HTML DOM object
         * @returns {Array} Array of Direction/Steps
## Decisions made
1) External library cheerio was used for DOM traversal and extract the required data.
2) More time was spent on perfecting the core logic i.e. regular expression to extract specific part of ingredient, taking care of different DOM implementation that a recipe can be represented in and clearing of data by removing spaces and line breaks.
3) Less time was spent on developing boiler plate code and ready-made libraries and repositories suiting out requirement were used.
4) A lot of time can be spent in specifics and making customizations to include more recipes that are represented diversely.

## Challenges
1) Extracting data by traversing the DOM was tricky as all pages will have different approach of representing Ingredients and Steps and will use different HTML elements for the purpose.
2) Cleaning the data extracted from target elements after retrieval  
3) Work out the regular expression to accommodate multiple kind of quantity representation for each Ingredients

Reach out to me at nisarg.2151@gmail.com in case of any issues/concerns!

Special thanks to [alexpermyakov](https://github.com/alexpermyakov) for awesome production ready boiler plate [repository](https://github.com/alexpermyakov/node-rest-api/tree/step.5), keep up the amazing work!

##      That’s All Folks!!    
