import { Request, Response } from "express";
import { getRecipeJsonByURL } from "./RecipeController";
import { checkSearchParams } from "../../middleware/checks";

export default [
  {
    path: "/recipe",
    method: "get",
    handler: [
      checkSearchParams,
      async ({ query }: Request, res: Response) => {
        const result = await getRecipeJsonByURL(query.url);
        res.status(200).json(result);
      }
    ]
  }
];
