//Create variables here
var dog, happyDog, database, foodS, foodStock, milkImg;
var dogImg, happyDogImg;
var feedButton, addFoodButton;
var fedTime, lastFed;
var foodObj;
var x, y;
var changeGameState, readGameState;
var bedroomImg, gardenImg, washroomImg, sadDogImg;
var gameState;

function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
  milkImg = loadImage("images/Milk.png");
  bedroomImg = loadImage("images/bedRoom.png");
  gardenImg = loadImage("images/Garden.png");
  washroomImg = loadImage("images/Wash Room.png");
  sadDogImg = loadImage("images/deadDog.png")
}

function setup() {
  createCanvas(1000, 400);
  //database
  database = firebase.database();

  foodObj = new Food();
  //dog
  dog = createSprite(640, 250, 10, 10);
  dog.addImage(dogImg);
  dog.scale = 0.25;
  //foodstock
  foodStock = database.ref("food");
  foodStock.on("value", readStock);

  feedButton = createButton("Feed Drago");
  feedButton.position(700, 70);
  feedButton.mousePressed(feedDog);

  addFoodButton = createButton("Add more milk");
  addFoodButton.position(800, 70);
  addFoodButton.mousePressed(addFood);

  readGameState = database.ref('gameState');
  readGameState.on("value", function(data){
    gameState = data.val();
  })
  
}


function draw() {  
  background(46, 139, 87);
  
  foodObj.display();

  fedTime = database.ref('feedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })
  fill(255, 255, 254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed: " + lastFed%12 + "PM", 200, 30);
  }
  else if(lastFed===0){
    text("Last Feed: 12 AM", 200, 30);
  }
  else{
    text("Last Feed: " + lastFed + "AM", 200, 30)
  }

  if(gameState!="hungry"){
    feedButton.hide();
    addFoodButton.hide();
    dog.remove();
  }
  else{
    feedButton.show();
    addFoodButton.show();
    dog.addImage(sadDogImg);
  }

  var currentTime = hour();
  if(currentTime==(lastFed+1)){
    update("playing");
    food.garden();
  }
  else if(currentTime==(lastFed+2)){
    update("sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("bathing");
    foodObj.washroom();
  }
  else{
    update("hungry");
    foodObj.display();
  }

  //drawSprites();

}

function update(state){
  database.ref('/').update({
    gameState: state
  })
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    food: foodObj.getFoodStock(),
    feedTime: hour()
  })
}

function addFood(){
  console.log(foodS + "adding food");
  foodS++;
  database.ref('/').update({
    food: foodS
  })
  
}


