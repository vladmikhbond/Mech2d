import { doc, glo } from "./globals.js"; 
import { Space } from "./models/Space.js";  
import { View } from "./view/View.js";
import { Controller } from "./controller/Controller.js";

//import { ControllerStore } from "./ControllerStore.js";

let space = new Space(600, 400 );
let view = new View(space);
let controller = new Controller(space, view);
view.drawAll();

// ///////////////////////////////////////////
// let h = 300, w = 400;
// document.documentElement.style.setProperty('--canvas-width', w+'px');
// document.documentElement.style.setProperty('--canvas-height', h+'px');

// space.height = h;
// space.width = w;

// space.setBorder(w, h); 

// doc.canvas.height = h;
// doc.canvas.width = w;
// doc.canvas2.height = h;
// doc.canvas2.width = w;
// view.drawAll();


