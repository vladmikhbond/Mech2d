import { glo, doc } from "../globals.js";
import { Geometry as G, Point } from "../models/Geometry.js";
import { Space, Mode, CreateMode } from "../models/Space.js";
import { PrettyMode, TraceMode, View } from "../view/View.js";
import { getSpaceParams } from "./params.js";

export class Controller 
{
    box: Space;
    view: View;

    private intervalId = 0;   // base field for mode property
    private sceneJson = ""; 
    private _mousePos = new Point(0, 0);
    private _createMode = CreateMode.Ball;


    constructor(box: Space, view: View) {
        this.box = box;
        this.view = view;


        // set state of UI
        // this.mode = Mode.Stop;
        // this.createMode = CreateMode.Ball;
        // this.addButtonClickListeners();
        // this.addChangeListeners();
        // this.addKeyboardListeners();
        // this.addSpanClickListeners();

        // this.resetUI();  // last command of the constructor


                // params changed 
        document.getElementById("spaceParams")!.addEventListener("keydown", (e: KeyboardEvent) => 
        {
            if (e.key == "Enter") {
                const [w, wk, k, g] = getSpaceParams()
                glo.W = w; glo.Wk = wk; glo.K = k; glo.g = g; 
                document.getElementById("helpButton")!.focus();
            }
                
        });   

    }
}