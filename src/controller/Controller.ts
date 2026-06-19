import { glo, doc } from "../globals.js";
import { Ball } from "../models/Ball.js";
import { Line } from "../models/Line.js";
import { Link } from "../models/Link.js";
import { Geometry as G, Point } from "../models/Geometry.js";
import { Space, TimeMode, CreateMode } from "../models/Space.js";
import { PrettyMode, TraceMode, View } from "../view/View.js";
import { getSpaceParams, getBallParams, getLinkParams } from "./params.js";

export class Controller 
{

    public space: Space;
    public view: View;

    private intervalId = 0;   // base field for timeMode property
    private sceneJson = ""; 
    private _mousePos = new Point(0, 0);
    private _createMode = CreateMode.Ball;


    constructor(space: Space, view: View) {
        this.space = space;
        this.view = view;


        // set state of UI
        this.timeMode = TimeMode.Stop;
        this.createMode = CreateMode.Ball;
        // this.addButtonClickListeners();
        // this.addChangeListeners();
        // this.addKeyboardListeners();
        // this.addSpanClickListeners();

        // this.resetUI();  // last command of the constructor


        // Params changed 
        document.getElementById("spaceParams")!.addEventListener("keydown", (e: KeyboardEvent) => 
        {
            if (e.key == "Enter") {
                const [w, wk, k, g] = getSpaceParams()
                glo.W = w; glo.Wk = wk; glo.K = k; glo.g = g; 
                document.getElementById("helpButton")!.focus();
            }
                
        });  

        // Start-stop model time
        document.getElementById("runButton")!.addEventListener("click", () => 
        {
            this.timeMode = this.timeMode == TimeMode.Stop ? 
            TimeMode.Play : 
            TimeMode.Stop;
        });

        // Set CreateMode
        document.getElementById("createMode")!.addEventListener("change", (e: Event) =>
        {
            let str = (e.target as HTMLSelectElement).value;
            const key = str as keyof typeof CreateMode;
            this.createMode = CreateMode[key];
            
            let sb = document.getElementById("ballParams")!.style;
            let sl = document.getElementById("lineParams")!.style;
            let sk = document.getElementById("linkParams")!.style;
            sb.display = sl.display = sk.display = 

            document.getElementById("ballParams")!.style.display = "none";
            switch (this.createMode) {
                case CreateMode.Ball: sb.display = "inline"; break;
                case CreateMode.Line: sl.display = "inline"; break;
                case CreateMode.Link: sk.display = "inline"; break;
                default: break;
            }         
        });       


        // Draft-pretty toggle
        document.getElementById("prettyModeCb")!.addEventListener("click", () => {
            this.view.prettyMode = this.view.prettyMode === PrettyMode.Draft
                ? PrettyMode.Beauty
                : PrettyMode.Draft;
            this.view.drawAll();
        });  
        
        document.getElementById("traceModeCb")!.addEventListener("click", () => {
            this.view.traceMode = this.view.traceMode === TraceMode.Yes
                ? TraceMode.No
                : TraceMode.Yes;
            if (this.view.traceMode === TraceMode.No) {
                this.view.clearTrace();
            }
        });

        document.addEventListener("keydown", (e) => {
            switch (e.key) {
                // step execution
                case 's': case 'S': case 'і': case 'І':
                    this.timeMode = TimeMode.Stop;
                    this.step();
                    break;
            }
        });
    }

//#region  Mode props

    set timeMode(mode: TimeMode) {
        if (mode === TimeMode.Play && this.intervalId === 0) {
            this.intervalId = setInterval(() => {
                this.step();
            }, glo.INTERVAL);
        } else {
            clearInterval(this.intervalId);
            this.intervalId = 0;
            this.view.showTimeAndEnergy();
        }
    }

    get timeMode(): TimeMode {
        return this.intervalId ? TimeMode.Play : TimeMode.Stop;
    }


    set createMode(value: CreateMode) 
    {
        this._createMode = value;

        // switch mouse handlers
        if (value === CreateMode.Ball) {
            this.setBallHandlers();
        } else if (value === CreateMode.Line) {
            this.setLineHandlers();
        } else if (value === CreateMode.Link) {
            this.setLinkHandlers();
        }
        
    }

    get createMode() {
        return this._createMode;
    }

//#endregion Mode props          

//#region Mouse Handlers

    setBallHandlers() {
        let p0: Point | null = null;   // в p0 смещение курсора от центра шара
        let ball: Ball | null = null;
        let ballVelo: Ball | null = null;
        let isMousePressed = false;

        doc.canvas.onmousedown = (e) => {
            isMousePressed = true;

            p0 = this.cursorPoint(e);
            ballVelo = this.space.ballVeloUnderPoint(p0);
            if (ballVelo) {
                return;
            }

            ball = this.space.ballUnderPoint(p0);
            if (ball != null) {
                // в p0 смещение курсора от центра шара
                p0 = { x: ball.x - p0.x, y: ball.y - p0.y };
            }
            
        };

        doc.canvas.onmousemove = (e) => {
            let p = this.cursorPoint(e);
            this._mousePos = p;

            if (!isMousePressed) return;

            // change mouse cursor on velo
            // doc.canvas.style.cursor = this.box.ballVeloUnderPoint(p) ? "pointer" : "auto";

            if (ballVelo) {
                ballVelo.vx = (p.x - ballVelo.x) / glo.Kvelo;
                ballVelo.vy = (p.y - ballVelo.y) / glo.Kvelo;
                this.view.drawAll();
                return;
            }
            if (ball) {
                ball.x = p.x + p0!.x;
                ball.y = p.y + p0!.y;
                this.view.drawAll();
                return;
            }
            // creating a new ball
            this.view.drawAll();
            this.view.drawGrayCircle(p0!, p);
        };

        doc.canvas.onmouseup = (e) => {

            if (!ball && !ballVelo) {
                let p = this.cursorPoint(e);
                let r = G.distance(p0!, p);
                // create a new ball
                if (r > 2) {
                    let [st, m] = getBallParams();
                    let newBall = new Ball(p0!.x, p0!.y, r, "red", 0, 0, st === 1, m);
                    this.space.addBall(newBall);
                    this.space.selBall = newBall;
                }
            }
            this.view.drawAll();
            isMousePressed = false;
        }
    }


    setLineHandlers() {
        let p0: Point | null = null;

        doc.canvas.onmousedown = (e) => {
            p0 = this.cursorPoint(e);
            let line: Line | null = null;
               
        };

        doc.canvas.onmousemove = (e) => {
            let p = this.cursorPoint(e);
            this._mousePos = p;

            if (p0) {
                this.view.drawAll();
                this.view.drawGrayLine(p0, p);
            }

        };

        doc.canvas.onmouseup = (e) => {
            if (p0 === null)
                return;
            let p = this.cursorPoint(e);
            if (G.distance(p0, p) > 2) {

                let l = new Line(p0.x, p0.y, p.x, p.y);
                this.space.addLine(l);
                this.space.selLine = l;
            }
            p0 = null;
            this.view.drawAll();
        };
    }


    setLinkHandlers() {
        let lastClickedBall: Ball | null = null;

        doc.canvas.onmousedown = (e) => {

            let p = this.cursorPoint(e);

            let ball = this.space.ballUnderPoint(p);

            if (ball === null || ball === lastClickedBall) {

                let link: Link|null = null;
                return;
            }
            if (lastClickedBall === null) {
                lastClickedBall = ball;
                return;
            }

            let link = new Link(lastClickedBall, ball);
            this.space.addLink(link);
            this.space.selLink = link;
            lastClickedBall = null;
            this.view.drawAll();
        };

        doc.canvas.onmousemove = (e) => {
            this._mousePos = this.cursorPoint(e);
        };

        doc.canvas.onmouseup = (e) => {
        }
    }

//#endregion  Mouse Handlers


    step() { 
        glo.chronos++;
        this.space.balls.forEach( b => b.move() )
        this.space.collectDots();
        this.view.drawAll();
        
        if (glo.chronos % 10 === 0) {
            this.view.showTimeAndEnergy();
        }
    }

//---------------------- auxilary -----------------------

    private cursorPoint(event: MouseEvent) {
        const canvasRect = doc.canvas.getBoundingClientRect();
        return {
            x: event.x - canvasRect.left - this.space.x,
            y: event.y - canvasRect.top - this.space.y
        };
    }

}