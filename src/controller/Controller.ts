import { glo, doc } from "../globals.js";
import { Geometry as G, Point } from "../models/Geometry.js";
import { Space, Mode, CreateMode } from "../models/Space.js";
import { PrettyMode, TraceMode, View } from "../view/View.js";

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
    }
}