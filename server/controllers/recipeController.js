//DB
require ('../models/database')
const Category = require('../models/Category')
const Recipe = require('../models/Recipe')
/* 
*GET
*HOMEPAGE
 */
exports.homepage = async (req, res) =>{
  try{
    const limitNUmber = 5;
    const categories = await Category.find({}).limit(limitNUmber);
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNUmber);
    const thai = await Recipe.find({'category': 'Thai'}).limit(limitNUmber);
    const american = await Recipe.find({'category': 'American'}).limit(limitNUmber);
    const indian = await Recipe.find({'category': 'Indian'}).limit(limitNUmber);
    const chinese = await Recipe.find({'category': 'Chinese'}).limit(limitNUmber);
    const food = {latest,thai, american, chinese, indian};
    res.render('index', { title: 'Cooking Blog - Home', categories, food } );
    //res.render('index', { title: 'Cooking Blog - Home', categories } );
  }catch(error){
    res.status(500).send({message: error.message || "Error Occured" });
  } 
}
/* 
*GET
*CATEGORIES
 */
exports.exploreCategories = async (req, res) =>{
  try{
    const limitNUmber = 20;
    const categories = await Category.find({}).limit(limitNUmber);
    res.render('categories', { title: 'Cooking Blog - Categories', categories } );
  }catch(error){
    res.status(500).send({message: error.message || "Error Occured" });
  }
    
}
/* 
 * Categories By Id
 * GET /categories/:id
 */
exports.exploreCategoriesByID = async (req, res) =>{
  try{
    
    let categoryID = req.params.id;
    const limitNUmber = 20;
    const categoryById = await Recipe.find({'category': categoryID}).limit(limitNUmber);
    res.render('categories', { title: 'Cooking Blog - Categories', categoryById } );
  }catch(error){
    res.status(500).send({message: error.message || "Error Occured" });
  }
    
}
/* 
*GET
*RECIPES
 * GET /recipe/:id
 */
exports.exploreRecipe = async (req, res) =>{
  try{
    let recipeID = req.params.id;
    const recipe = await Recipe.findById(recipeID)
    res.render('recipe', { title: 'Cooking Blog - Recipe', recipe } );
  }catch(error){
    res.status(500).send({message: error.message || "Error Occured" });
  }
    
}
/* 
*GET
*EXPLORE LATEST
 * Explore Latest
 */
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}

/* 
*GET
*EXPLORE Random
 * get/explore-random
 */
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random()*count);
    let recipe = await Recipe.findOne().skip(random).exec();
    //res.json(recipe)
    res.render('explore-random', { title: 'Cooking Blog - Explore Latest', recipe } );
  } catch (error) {
   res.satus(500).send({message: error.message || "Error Occured" });
  }
}
/* 
*GET
*submitRecipe
 * get/submit-recipe
 */
exports.submitRecipe = async(req, res) => {
  //hold all the error msg to be shown for the user
    const infoErrorsObj = req.flash('infoErrors')
    //success msg
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe',infoErrorsObj, infoSubmitObj } );
  } 
/* 
*POST
*Post Form
 */

exports.submitRecipeOnPost = async (req, res) =>{
  try{
    let imageUploadFile;
    let uploadPath;
    let newImageName;
    if(!req.files || Object.keys(req.files).length ===0){
      console.log('No files where uploaded');
    }else{
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      //path for storage
      uploadPath = require('path').resolve('./')+ '/public/uploads/'+newImageName;
      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.status(500).send(err)
      })
    }
    //submit data to db
    const newRecipe = new Recipe({
      name: req.body.name,
      description:  req.body.description,
      email:  req.body.email,
      ingredients:  req.body.ingredients,
      category:  req.body.category,
      image: newImageName
    });
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added successfully!')
    res.redirect('/submit-recipe');
  } catch(error){
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}


/* 
*POST
*SEARCH RECIPE
 * 
 */

exports.searchRecipe = async (req, res) =>{
  try{
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({$text: {$search: searchTerm, $diacriticSensitive: true} })
    res.render('search', { title: 'Cooking Blog - Search',recipe } );
  }catch(error){
    res.status(500).send({message: error.message || "Error Occured" });
  }
}




async function insertDymmyRecipeData(){
   try {
       await Recipe.insertMany([
        
        /*{
    "name": "Pad Thai",
    "description": "Classic Thai stir-fried noodle dish.",
    "email": "recipeemail@dummy.de",
    "ingredients": [
      "Rice noodles",
      "Shrimp or tofu",
      "Bean sprouts",
      "Eggs",
      "Tamarind paste",
      "Fish sauce",
      "Peanuts"
    ],
    "category": "Thai",
    "image": "pad-thai.jpg"
  },
  {
    "name": "Kaeng Lueang",
    "description": "Traditional Thai yellow curry.",
    "email": "recipeemail@dummy.de",
    "ingredients": [
      "Chicken or vegetables",
      "Coconut milk",
      "Yellow curry paste",
      "Fish sauce",
      "Pineapple chunks",
      "Thai basil leaves"
    ],
    "category": "Thai",
    "image": "kaeng-lueang.jpg"
  },
  {
    "name": "Aloo Samosa",
    "description": "Crispy and savory Indian pastry filled with spiced potatoes.",
    "email": "recipeemail@dummy.de",
    "ingredients": [
      "Potatoes",
      "Peas",
      "Cumin seeds",
      "Coriander powder",
      "Garam masala",
      "Pastry dough"
    ],
    "category": "Indian",
    "image": "aloo-samosa.jpg"
  },
  {
    "name": "Pad Thai",
    "description": "Classic Thai stir-fried noodle dish.",
    "email": "recipeemail@dummy.de",
    "ingredients": [
      "Rice noodles",
      "Shrimp or tofu",
      "Bean sprouts",
      "Eggs",
      "Tamarind paste",
      "Fish sauce",
      "Peanuts"
    ],
    "category": "Thai",
    "image": "pad-thai.jpg"
  },
  {
    "name": "Fried Chicken",
    "description": "Crispy and delicious fried chicken recipe.",
    "email": "recipeemail@dummy.de",
    "ingredients": [
      "1 level teaspoon baking powder",
      "1 level teaspoon cayenne pepper",
      "1 level teaspoon hot smoked paprika"
    ],
    "category": "American",
    "image": "southern-friend-chicken.jpg"
  },
  {
    "name": "Burger",
    "description": "Classic and juicy burger recipe.",
    "email": "recipeemail@dummy.de",
    "ingredients": [
      "Ground beef patty",
      "Burger bun",
      "Lettuce",
      "Tomato",
      "Onion",
      "Cheese"
    ],
    "category": "American",
    "image": "burger.jpg"
  },
  {
    "name": "Indian Paneer Tikka",
    "description": "Spicy and flavorful Indian Paneer Tikka recipe.",
    "email": "recipeemail@dummy.de",
    "ingredients": [
      "Paneer cubes",
      "Yogurt",
      "Ginger-garlic paste",
      "Spices (cumin, coriander, garam masala)",
      "Bell peppers",
      "Onions"
    ],
    "category": "Indian",
    "image": "paneer-tikka.jpg"
  },*/
  {
    "name": "Tao Hoo Song Kreung",
    "description": "Thai stir-fried tofu with mixed vegetables and sauce.",
     "email": "recipeemail@dummy.de",
    "ingredients": [
      "Tofu",
      "Mixed vegetables (bell peppers, onions, broccoli)",
      "Garlic",
      "Ginger",
      "Soy sauce",
      "Oyster sauce",
      "Thai basil leaves"
    ],
    "category": "Thai",
    "image": "tao-hoo.jpg"
  },
  {
    "name": "Idli",
    "description": "South Indian steamed rice cakes.",
    "email": "recipeemail@dummy.de",
    "ingredients": [
      "Idli rice",
      "Urad dal (black gram)",
      "Fenugreek seeds",
      "Salt"
    ],
    "category": "Indian",
    "image": "idli.jpg"
  },
   {
    "name": "Spring Rolls",
    "description": "Crispy and flavorful fried spring rolls.",
    "email": "recipeemail@dummy.de",
    "ingredients": [
      "Spring roll wrappers",
      "Cabbage",
      "Carrots",
      "Bean sprouts",
      "Mushrooms",
      "Soy sauce",
      "Sesame oil"
    ],
    "category": "Chinese",
    "image": "spring-rolls.jpg"
  },
  {
    "name": "Gobi Manchurian",
    "description": "Indian cauliflower in a spicy and tangy sauce.",
    "email": "recipeemail@dummy.de",
    "ingredients": [
      "Cauliflower florets",
      "All-purpose flour",
      "Cornflour",
      "Garlic",
      "Ginger",
      "Soy sauce",
      "Ketchup"
    ],
    "category": "Indian",
    "image": "gobi-manchurian.jpg"
  },
  {
    "name": "Custard Buns",
    "description": "Soft buns filled with creamy custard.",
    "email": "recipeemail@dummy.de",
    "ingredients": [
      "Bread dough",
      "Milk",
      "Eggs",
      "Sugar",
      "Cornstarch",
      "Vanilla extract"
    ],
    "category": "Chinese",
    "image": "custard-buns.jpg"
  },
  {
    "name": "Thai Green Curry",
    "description": "A fragrant and spicy Thai curry with vegetables or chicken.",
    "email": "recipeemail@raddy.co.uk",
    "ingredients": [
      "Green curry paste",
      "Coconut milk",
      "Vegetables (bell peppers, bamboo shoots, Thai eggplant)",
      "Chicken or tofu",
      "Fish sauce",
      "Thai basil leaves"
    ],
    "category": "Thai",
    "image": "thai-green-curry.jpg"
  },
  {
    "name": "Thai Veg Broth",
    "description": "A flavorful and aromatic Thai vegetarian broth.",
    "email": "recipeemail@raddy.co.uk",
    "ingredients": [
      "Vegetable stock",
      "Galangal",
      "Lemongrass",
      "Kaffir lime leaves",
      "Thai chilies",
      "Mushrooms"
    ],
    "category": "Thai",
    "image": "thai-veg-broth.jpg"
  },
  {
    "name": "Thai Red Chicken Soup",
    "description": "A spicy and hearty Thai soup with chicken.Step 1 – The first step to make this red curry chicken soup is to cook the ginger, garlic, onion, and red pepper in a little oil over medium until they are just slightly tender. This is also a great time to add the salt during this steps to help develop more flavor.Step 2 – Next, add four tablespoons of the red curry paste and stir until well combined. Then, add in the diced chicken breast and stir until until the veggies, chicken, and curry paste are all evenly mixed in.Step 3 – Next, add chicken broth, coconut milk, lime juice, and seasonings like fish sauce and coconut aminos to the pot. Let the soup come to a boil and then reduce the heat down to a simmer for 30 minutes or until the chicken is cooked through. Give it a taste and add more salt or fish sauce if you want the soup to be a bit saltier.",
    "email": "recipeemail@raddy.co.uk",
    "ingredients": [
      "Chicken thighs",
      "Red curry paste",
      "Coconut milk",
      "Onions",
      "Lime leaves",
      "Fish sauce"
    ],
    "category": "Thai",
    "image": "thai-red-chicken-soup.jpg"
  },
  {
    "name": "Thai Mussels",
    "description": "Fresh mussels cooked in a flavorful Thai sauce.",
    "email": "recipeemail@raddy.co.uk",
    "ingredients": [
      "Fresh mussels",
      "Coconut milk",
      "Thai red curry paste",
      "Garlic",
      "Lime juice",
      "Cilantro"
    ],
    "category": "Thai",
    "image": "thai-mussels.jpg"
  }
      ]
      );
     } catch (error) {
       console.log('err', + error)
     }
   }
  
  //insertDymmyRecipeData();
//to check the Mongo db whether it works fine  and to insert dummy data. 
/*async function insertDummyCategoryData () {
    try {
        await Category.insertMany([
                  {
                     "name": "Thai",
                    "image": "thai-food.jpg"
                   },
                   {
                     "name": "American",
                    "image": "american-food.jpg"
                   }, 
                  {
                    "name": "Chinese",
                    "image": "chinese-food.jpg"
                   },
                  {
                     "name": "Mexican",
                    "image": "mexican-food.jpg"
                  }, 
                   {
                     "name": "Indian",
                     "image": "indian-food.jpg"
                   },
                   {
                    "name": "Spanish",
                    "image": "spanish-food.jpg"
                  }
                ]);
    } catch (error){
        console.log(error);
    }
}
insertDummyCategoryData();*/