var grid;

var arcs = { };
var texts= { };
var quotes = { };

countryFont = "Crimson Text";
quoteFont = "Dosis";

var clr = (10);
var textweight = new SoftFloat(0, .4, .2);
var arcweight = new SoftFloat(1, .2, .7);
var mouseXpos = new SoftFloat(750, .4, .2);

var lowbound = 0;
var highbound = 700;
var middleX = 750;
var middleY = -100;


function preload() {
  diffdata = loadTable("Interaction.csv", "csv", "header")
}

function setup() {
  createCanvas(960, 540);
  grid = new Grid( {
  "margin": 
    36, 
    "columns": 
    4, 
    "gutter": 
    12, 
    "rows": 
    10
  }
  );

  arcs.left = 50;
  arcs.right = width - 210;
  arcs.top = 110;
  arcs.bottom = height - 160;

  texts.left = width - 180;
  texts.right= width - 80;
  texts.top = arcs.top;
  texts.bottom = arcs.bottom;

  quotes.left = arcs.left;
  quotes.right = texts.right;
  quotes.top = arcs.bottom + 40;
  quotes.bottom = height - 40;

  diffdataCount = diffdata.getRowCount();
}




function draw() {
  background(255);
  // put  rectangles
  fill(250);
  rectMode(CORNERS);
  noStroke();
  rect(arcs.left, arcs.top, arcs.right, arcs.bottom);
  //rect(texts.left, texts.top, texts.right, texts.bottom);
  //rect(quotes.left, quotes.top, quotes.right, quotes.bottom); 

  arcweight.update();
  textweight.update();
  mouseXpos.update();

  //quote
  fill(0);
  textAlign(LEFT);
  textFont(countryFont);
  textSize(25);
  text("Posturing as Gender Inequality", arcs.right-235, arcs.top-40);

  textAlign(LEFT);
  textFont(quoteFont);
  textSize(14);
  text("Boys Feel Significantly More Confident than Girls, but Perform Roughly the Same", quotes.left, quotes.bottom-20);
  text("Boys Believe They Are Better Than They Actually Perform", quotes.left, quotes.bottom-5);
  text("Boys Posture", quotes.left, quotes.bottom+10);

  textSize(12);
  textFont(quoteFont);
  textAlign(CENTER);
  text("% Difference in Confidence", quotes.left+200, arcs.bottom+40);
  text("% Difference in PISA Math Score", quotes.right-230, arcs.bottom+40);
  textAlign(LEFT);
  textFont(countryFont);
  noStroke();
  fill(200);
  
  text("hover for detail", texts.left, arcs.top-15);
  text("click to estimate", arcs.right - 100, arcs.top-15);

  //axes
  stroke(150);
  strokeWeight(1);
  line(arcs.right+5, arcs.bottom, arcs.left, arcs.bottom); 
  line(arcs.right, arcs.bottom+5, arcs.right, arcs.top);
  //moveable y axis
  line(mouseXpos.value, arcs.bottom+5, mouseXpos.value, arcs.top);

  //y line
  for (var v = -20; v <= 0; v=v+2) {
    textAlign(CENTER, CENTER);
    noStroke();
    fill(200+v);
    textFont(quoteFont);
    textSize(12);

    text(-nf(v, 0, 0), middleX + ((highbound-lowbound)/20)*v, arcs.bottom + 15);
  }

  for (var i = 0; i < diffdataCount; i++) {
    //country name regualr
    textStyle(NORMAL);
    textAlign(LEFT, CENTER);
    textFont(countryFont);
    textSize(12);
    fill(clr+20*i, clr-10+5*i, 17+9*i);
    strokeWeight(textweight.value);
    text(diffdata.get(i, "Country"), texts.left, texts.top+i*20+20);

    //arc regular
    stroke(clr+20*i, clr-10+5*i, 17+9*i);
    noFill();  
    strokeWeight(arcweight.value);
    beginShape();
    vertex(middleX-map(diffdata.get(i, "Confidence_Diff_%"), 0, -20, lowbound, highbound), arcs.bottom);
    bezierVertex(middleX-map(diffdata.get(i, "Confidence_Diff_%"), 0, -20, lowbound, highbound), arcs.bottom, middleX, middleY, middleX-map(diffdata.get(i, "Score_Diff_%"), 0, 20, lowbound, highbound), arcs.bottom);
    endShape();

    //when mousehovers over country name
    if ((mouseX > texts.left) && (mouseX < texts.right) && (mouseY== diffdata.get(i, "Y_Value"))) {
      textAlign(LEFT, CENTER);
      fill(18, 12, 181);
      textStyle(BOLD);
      stroke(18, 12, 181);
      textFont(countryFont);
      textSize(12);
      //name of country
      strokeWeight(textweight.set(0));
      text(diffdata.get(i, "Country"), texts.left, texts.top+i*20+20);
      //label for conf and score
      strokeWeight(textweight.set(0));
      textAlign(CENTER, CENTER);
      textFont(countryFont);
      text(-nf(diffdata.get(i, "Confidence_Diff_%"), 2, 1), middleX-map(diffdata.get(i, "Confidence_Diff_%"), 0, -20, lowbound, highbound), arcs.bottom+ 20); 
      text(nf(diffdata.get(i, "Score_Diff_%"), 1, 1), middleX-map(diffdata.get(i, "Score_Diff_%"), 0, 20, lowbound, highbound), arcs.bottom+ 20);

      //arcshape
      fill(18, 12, 181, 100);
      stroke(18, 12, 181);
      strokeWeight(arcweight.setTarget(4-i/5));
      beginShape();
      vertex(middleX-map(diffdata.get(i, "Confidence_Diff_%"), 0, -20, lowbound, highbound), arcs.bottom);
      bezierVertex(middleX-map(diffdata.get(i, "Confidence_Diff_%"), 0, -20, lowbound, highbound), arcs.bottom, middleX, middleY, middleX-map(diffdata.get(i, "Score_Diff_%"), 0, 20, lowbound, highbound), arcs.bottom);
      endShape();
    }
  }
}


function mousePressed() {
  // whenever the mouse is clicked, print the location to the console

  print(mouseX + ", " + mouseY);

  if ((mouseX > arcs.left) && (mouseX < arcs.right) ) {
    strokeWeight(2);
    stroke(200);
    line(mouseXpos.setTarget(mouseX), arcs.bottom-10, mouseXpos.setTarget(mouseX), arcs.top);
  }
} 


function keyPressed() {
  // print('key pressed ' + key);
  //  print(grid);
  // when a key is pressed, let the grid know
  grid.keyPressed();
}
