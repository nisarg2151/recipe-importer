import request from "request-promise";
import dotenv from "dotenv";
import { stringify } from "querystring";
import { any } from "bluebird";
dotenv.config();

/**
 * @param {String} query - URL of recipe to be imported 
 * @returns {String} HTML document of url specified in query parameter as a string
 */
export const getRecipeData = async (query: string) => {
  const url = `${query}`;
  const response = await request(url);
  // let recipeData = getRecipeData(response);
  return response;
};



// http://localhost:3000/recipe?url=https%3A%2F%2Fcooking.nytimes.com%2Frecipes%2F1017518-panzanella-with-mozzarella-and-herbs
// http://localhost:3000/recipe?url=https%3A%2F%2Fwww.eatthelove.com%2Fcookies-and-cream-cookies
// http://localhost:3000/recipe?url=https%3A%2F%2Fwww.maangchi.com%2Frecipe%2Fbugeopo-gochujang-muchim
// http://localhost:3000/recipe?url=https%3A%2F%2Fwww.laurainthekitchen.com%2Frecipes%2Fcroque-madam%2F
// http://localhost:3000/recipe?url=https%3A%2F%2Fwww.delish.com%2Fcooking%2Frecipe-ideas%2Frecipes%2Fa55693%2Fbest-homemade-apple-pie-recipe-from-scratch%2F
// http://localhost:3000/recipe?url=https%3A%2F%2Fwww.foodnetwork.com%2Frecipes%2Ffood-network-kitchen%2Fchicken-scampi-pasta-5588113