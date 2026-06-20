import { glo } from "./globals.js"; 
import { Space } from "./models/Space.js";  
import { View } from "./view/View.js";
import { Controller } from "./controller/Controller.js";
import { getSizeParams, getSpaceParams } from "./controller/params.js";

const ps = getSpaceParams()!;              
[glo.K, glo.W, glo.Wk, glo.Vis, glo.g] = ps; 
const size = getSizeParams()!
const space = new Space(...size);
const view = new View(space);
const c = new Controller(space, view);
view.drawAll();
