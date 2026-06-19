import { doc, glo } from "./globals.js"; 
import { Space } from "./models/Space.js";  
import { View } from "./view/View.js";
import { Controller } from "./controller/Controller.js";

//import { ControllerStore } from "./ControllerStore.js";

let box = new Space(doc.canvas.width, doc.canvas.height );
let view = new View(box);
let controller = new Controller(box, view);
view.drawAll();
