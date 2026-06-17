import { glo, doc } from "./globals.js";
import { Geometry as G, Point } from "./Geometry.js";
import { Ball } from "./Ball.js";
import { Line } from "./Line.js";
import { Link } from "./Link.js";
import { Space, Mode, CreateMode } from "./Space.js";
import { PrettyMode, TraceMode, View } from "./View.js";
import { ControllerStore } from "./ControllerStore.js";

export class Controller 
{
    box: Space;
    view: View;
    controllerStore: ControllerStore;
    private intervalId = 0;   // base field for mode property
    private sceneJson = ""; 
    private _mousePos = new Point(0, 0);
    private _createMode = CreateMode.Ball;


    constructor(box: Space, view: View) {
        this.box = box;
        this.view = view;
        this.controllerStore = new ControllerStore(box, this);

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