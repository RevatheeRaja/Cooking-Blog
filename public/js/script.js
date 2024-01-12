//alert('hello')
let addIngredientsBtn = document.querySelector('#addIngredientsBtn');
let ingredientList = document.querySelector('.ingredientList');
let ingredeintDiv = document.querySelectorAll('.ingredeintDiv')[0];



const handleClick = ()=>{
    let newIngredients = ingredeintDiv.cloneNode(true);
    let input = newIngredients.getElementsByTagName('input')[0];
    input.value = '';
    ingredientList.appendChild(newIngredients)
}
addIngredientsBtn.addEventListener('click', handleClick);