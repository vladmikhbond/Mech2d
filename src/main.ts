import { glo } from "./globals.js"; 
import { Space } from "./models/Space.js";  
import { View } from "./view/View.js";
import { Controller } from "./controller/Controller.js";
import { getSizeParams, getSpaceParams } from "./controller/params.js";

// params from index.html              
[glo.K, glo.W, glo.Wk, glo.Vis, glo.g] = getSpaceParams()!; 

const space = new Space(...getSizeParams()!);

const view = new View(space);
new Controller(space, view);

view.drawAll();
