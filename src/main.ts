import { doc, glo } from "./globals.js"; 
import { Space } from "./models/Space.js";  
import { View } from "./view/View.js";
import { Controller } from "./controller/Controller.js";
import { Ball } from "./models/Ball.js";

//import { ControllerStore } from "./ControllerStore.js";

let box = new Space(0, 0, doc.canvas.width, doc.canvas.height );
let view = new View(box);
let controller = new Controller(box, view);
///////////////////
box.addBall(new Ball(100, 100, 25, "red", 0, 0, 1))
view.drawAll(1);
