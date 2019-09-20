import { getRecipeData } from "./providers/RecipeDataProvider";
import cheerio from "cheerio";


/**
 * @param {String} url - URL of recipe to be imported  
 * @returns {JSON} Recipe details comprising of name, ingredients and steps
 */
export const getRecipeJsonByURL = async (url: string) => {
  const htmlData =  await getRecipeData(url);
  const $ = cheerio.load(htmlData);
  let recipeName: string = getRecipeName($);
  let ingredients: any = getIngredients($);
  let steps: any = getSteps($);
  return {
    "name": recipeName,
    "ingredients": ingredients,
    "steps": steps
  };
};

/**
 * @param {CheerioStatic} $ - Cheerio HTMl DOM object 
 * @returns {string} Recipe name extracted from title after cleaning up extra appended text
 */
const getRecipeName = ($: CheerioStatic) => {
  return $('title').text().split(/recipe/i)[0].trim()
}

/**
 * @param {CheerioStatic} $ - Cheerio HTMl DOM object 
 * @returns {Array} Array of ingredient objects of type {name: name, qunatity: qunatity, unit: unit }
 */
const getIngredients = ($: CheerioStatic) => {
  let ingredients: any = [];
  //Regex for extracting the quantity(like 1, 1 1/2, 3½ or ½) from the Ingredient string 
  let ingredientsRegex = new RegExp(/(\d*\xBC)|(\d*\xBD)|(\d*\xBE)|(\d+\s{1}\d+\/\d+)|(\d+\/\d+)|(\d+\.\d+)|(\d+)/);
  let allIngredientsEls = $(':contains("Ingredients")');
  let filteredIngredientsEls = allIngredientsEls.filter(function (i, el) {
    return $(el).text() == "Ingredients";
  });
  // console.log("filtered Ingredient Els length " + filteredIngredientsEls.length);
  filteredIngredientsEls.get().forEach(e => {
    let startIndex: number | undefined;
    let matched: boolean = false;
    let name;
    let qunatity: string;
    let unit: string;

    if ($(e).next().children().length > 3) {
      $(e).next().children().each((i, elem) => {
        let ingredient = $(elem).text().replace(/(^\s|\r\n|\n|\r|\s\s+)/gm, " ").trim();
        let splitIngredient = ingredient.split(/(\d*\xBC)|(\d*\xBD)|(\d*\xBE)|(\d+\s{1}\d+\/\d+)|(\d+\/\d+)|(\d+\.\d+)|(\d+)/)
          .filter(function (el) {
            return ((el != null) && (el != '') && (el != ' '));
          });
        // console.log(splitIngredient);
        for (let i = 0; i < splitIngredient.length; i++) {
          if (splitIngredient[i] && splitIngredient[i].match(ingredientsRegex)) {
            matched = true;
            qunatity = splitIngredient[i];
            startIndex = i + 1;
            break;
          }
        }
        if (matched) {
          splitIngredient = splitIngredient.slice(startIndex).join(" ").trim().split(' ');
          unit = splitIngredient[0];
          name = splitIngredient.slice(1).join(" ");
          // console.log(splitIngredient);
        }
        else
          name = splitIngredient.join(" ").trim();
        if (name)
          ingredients.push({ name: name, qunatity: qunatity, unit: unit });
      });
    }

    else if ($(e).nextAll().length > 3) {
      $(e).nextAll().each((i, elem) => {
        // console.log('Ingredients');
        // console.log($(elem).text());
        let ingredient = $(elem).text().replace(/(^\s|\r\n|\n|\r|\s\s+)/gm, " ").trim();
        // console.log(ingredient.split(/(\d+\s{1}\d+\/\d+)|(\d+\/\d+)|(\d+\.\d+)|(\d+)|(\xBC)|(\xBD)|(\xBE)/));
        let splitIngredient = ingredient.split(/(\d*\xBC)|(\d*\xBD)|(\d*\xBE)|(\d+\s{1}\d+\/\d+)|(\d+\/\d+)|(\d+\.\d+)|(\d+)/)
          .filter(function (el) {
            return ((el != null) && (el != '') && (el != ' '));
          });
        for (let i = 0; i < splitIngredient.length; i++) {
          if (splitIngredient[i] && splitIngredient[i].match(ingredientsRegex)) {
            // console.log('Matched Quantity -> ' + e)
            matched = true;
            qunatity = splitIngredient[i];
            startIndex = i + 1;
            break;
          }
        }
        if (matched) {
          splitIngredient = splitIngredient.slice(startIndex).join(" ").trim().split(' ');
          unit = splitIngredient[0];
          name = splitIngredient.slice(1).join(" ");
          // console.log(splitIngredient);
        }
        else
          name = splitIngredient.join(" ").trim();
        if (name)
          ingredients.push({ name: name, qunatity: qunatity, unit: unit });
      });
    }
  });
  return ingredients;
}

/**
 * @param {CheerioStatic} $ - Cheerio HTMl DOM object
 * @returns {Array} Array of Direction/Steps
 */
const getSteps = ($: CheerioStatic) => {
  let steps: any = [];
  let allPreparationEls = $('*');
  let filteredPreparationEls = allPreparationEls.filter(function (i, el) {
    // console.log(el.name);
    return ($(el).text() == ("Directions") || $(el).text() == ("Steps") || $(el).text() == ("Preparation"));
  });

  // console.log("filtered Preparation Els length -> " + filteredPreparationEls.length);

  filteredPreparationEls.get().forEach(e => {
    // console.log("filtered Preparation El Iterate");
    // console.log($(e).next().text().split('\n'));

    if ($(e).next().text().split('\n').length > 3) {
      let allSteps = $(e).next().text().split('\n')
      allSteps.forEach((elem) => {
        if (!(elem.trim() == ""))
          steps.push(elem.trim());
      });
    }

    else if ($(e).nextAll().length > 3) {
      $(e).nextAll().each((i, elem) => {
        // console.log('nextAll Steps');
        // console.log($(elem)[0].next.data);
        let step: any = "";
        if (($(elem).text().replace(/(\s*|\r\n|\n|\r|\s\s+)/gm, " ")) != "") {
          step = $(elem).text().replace(/(^\s*|\r\n|\n|\r|\s\s+)/gm, " ").trim();
          // console.log('nextAll Step -> ' + step)
          //  console.dir(elem)
        }
        // else if (($(elem)[0].next.data != "")){
        //    step = $(elem)[0].next.data
        //    step = step.replace(/(\r\n|\n|\r|\s\s+)/gm, " ").trim();
        //    console.log('nextAll Step 2 -> ' + step)
        // }
        if (!(step.trim() == "")) {
          steps.push(step);
        }
      });
    }

    else if ($(e).parent().nextAll().length > 3) {
      let step: any = "";
      steps.push($(e).parent().text().split('\n')[1].trim());
      let allSteps = $(e).parent().nextAll().text().split('\n');
      $(e).parent().nextAll().each((i, elem) => {
        console.log('parent Steps');
        // console.log($(elem));

        if (($(elem).text().replace(/(\r\n|\n|\r|\s\s+)/gm, " ")) != "") {
          step = $(elem).text().replace(/(\r\n|\n|\r|\s\s+)/gm, " ").trim();
          console.log('parent Step -> ' + step)
          //  console.dir(elem)
        }
        // else if (($(elem)[0].next.data != "")){
        //    step = $(elem)[0].next.data
        //    step = step.replace(/(\r\n|\n|\r|\s\s+)/gm, " ").trim();
        //    console.log('parent Step 2 -> ' + step)
        // }
        if (!(step == ""))
          steps.push(step);
      });
    }
  });
  return steps;
}
