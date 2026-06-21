import { glo, doc } from "../globals.js";
import { Ball } from "../models/Ball.js";
import { Line } from "../models/Line.js";
import { Link } from "../models/Link.js";
import { Geometry as G, Point } from "../models/Geometry.js";
import { Space, TimeMode, CreateMode } from "../models/Space.js";
import { PrettyMode, TraceMode, View } from "../view/View.js";
import { getSpaceParams, getBallParams, getSizeParams } from "./params.js";

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
        // set UI
        this.setModelSize(space.width, space.height);        
        this.timeMode = TimeMode.Stop;
        this.createMode = CreateMode.Ball;
        //
        this.addEventHandlers();
        this.addDataHandlers() 
    }

    addEventHandlers() 
    {
        // Size params changed 
        document.getElementById("sizeParams")!.addEventListener("keydown", (e: KeyboardEvent) => 
        {
            if (e.key == "Enter") {
                const size = getSizeParams();
                if (size) {
                    this.setModelSize(...size);
                    takeFocusOff()
                }
            }                
        }); 

        // Space params changed
        document.getElementById("spaceParams")!.addEventListener("keydown", (e: KeyboardEvent) => 
        {
            if (e.key == "Enter") {
                const ps = getSpaceParams();
                if (ps) {
                    [glo.K, glo.W, glo.Wk, glo.Vis, glo.g] = ps;                 
                    takeFocusOff();
                }
            }      
        });  

        // Start-stop model time
        document.getElementById("runButton")!.addEventListener("click", () => 
        {
            this.timeMode = this.timeMode == TimeMode.Stop ? 
            TimeMode.Play : 
            TimeMode.Stop;
        });

        // Open help page
        document.getElementById("helpButton")!.addEventListener("click", () => 
        {
            window.open("help.html", "_blank")?.focus();
        });

        // Set Create Mode
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

        // Pretty mode: Draft-Beauty toggle
        document.getElementById("prettyModeCb")!.addEventListener("click", () => {
            this.view.prettyMode = this.view.prettyMode === PrettyMode.Draft
                ? PrettyMode.Beauty
                : PrettyMode.Draft;
            this.view.drawAll();
        });  
        
        // Trace mode: Yes-No toggle
        document.getElementById("traceModeCb")!.addEventListener("click", () => {
            this.view.traceMode = this.view.traceMode === TraceMode.Yes
                ? TraceMode.No
                : TraceMode.Yes;
            if (this.view.traceMode === TraceMode.No) {
                this.view.clearTrace();
            }
        });

        // Кey commands
        document.addEventListener("keydown", (e) => {
            switch (e.key) {
                // step execution
                case 's': case 'S': case 'і': case 'І':
                    this.timeMode = TimeMode.Stop;
                    this.step();
                    break;
                case 'Delete':
                    this.space.deleteSelected(this.createMode);
                    this.view.drawAll();
                    break;
            }
        });


    }
    
    addDataHandlers() 
    {
        const areaEl = <HTMLTextAreaElement>document.getElementById("savedSceneText"); 

        document.getElementById("saveSceneButton")!.addEventListener("click", () => {
            areaEl.value = sceneToJson(this.space);
        });

        document.getElementById("loadSceneButton")!.addEventListener("click", () => {
            restoreSceneFromJson(areaEl.value, this.space);
            this.view.drawAll();
        });
    }

    //#region Mouse Handlers

    setBallHandlers() 
    {
        let p0: Point | null = null;   // в p0 смещение курсора от центра шара
        let ball: Ball | null = null;
        let ballVelo: Ball | null = null;
        let isMousePressed = false;

        doc.canvas.onmousedown = (e) => {
            isMousePressed = true;

            p0 = cursorPoint(e);
            ballVelo = this.space.ballVeloUnderPoint(p0);
            if (ballVelo) {
                return;
            }

            ball = this.space.ballUnderPoint(p0);
            if (ball != null) {
                // в p0 смещение курсора от центра шара
                p0 = { x: ball.x - p0.x, y: ball.y - p0.y };
                this.space.selBall = ball;
            }
            
        };

        doc.canvas.onmousemove = (e) => {
            let p = cursorPoint(e);
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
                let p = cursorPoint(e);
                let r = G.distance(p0!, p);
                // create a new ball with params
                if (r > 2) {
                    let ps = getBallParams();
                    if (ps) {
                        let [st, m] = ps;
                        let newBall = new Ball(p0!.x, p0!.y, r, "red", 0, 0, st === 1, m);
                        this.space.addBall(newBall);
                        this.space.selBall = newBall;
                    }
                }
            }
            this.view.drawAll();
            isMousePressed = false;
        }
    }


    setLineHandlers() {
        let p0: Point | null = null;

        doc.canvas.onmousedown = (e) => {
            p0 = cursorPoint(e);
            let line = this.space.lineUnderPoint(p0);
            if (line) {
                this.space.selLine = line;
            }         
        };

        doc.canvas.onmousemove = (e) => {
            let p = cursorPoint(e);
            this._mousePos = p;

            if (p0) {
                this.view.drawAll();
                this.view.drawGrayLine(p0, p);
            }

        };

        doc.canvas.onmouseup = (e) => {
            if (p0 === null)
                return;
            let p = cursorPoint(e);
            // Create new line
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

            let p = cursorPoint(e);

            let ball = this.space.ballUnderPoint(p);

            if (ball === null || ball === lastClickedBall) {
                const link = this.space.linkUnderPoint(p);
                if (link) {
                    this.space.selLink = link;
                    this.view.drawAll();
                    return;
                }
                return;
            }
            if (lastClickedBall === null) {
                lastClickedBall = ball;
                return;
            }
            

            const link = new Link(lastClickedBall, ball);
            this.space.addLink(link);
            this.space.selLink = link;
            lastClickedBall = null;
            this.view.drawAll();
        };

        doc.canvas.onmousemove = (e) => {
            this._mousePos = cursorPoint(e);
        };

        doc.canvas.onmouseup = (e) => {
        }
    }

//#endregion  Mouse Handlers

    //#region Mode props

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

    

    setModelSize(w: number, h: number) {
        document.documentElement.style.setProperty('--canvas-width', w+'px');
        document.documentElement.style.setProperty('--canvas-height', h+'px');
        document.getElementById("savedSceneText")!.style.width = (w - 125)+'px'; 
        this.space.setSize(w, h); 
        doc.canvas.height = h;
        doc.canvas.width = w;
        doc.canvas2.height = h;
        doc.canvas2.width = w;
        this.view.drawAll();
    }

    step() { 
        glo.time++;
        this.space.balls.forEach( b => b.move() )
        this.space.collectDots();
        this.view.drawAll();
        // time indicator
        if (glo.time % 10 === 0) {
            this.view.showTimeAndEnergy();
        }
    }



//---------------------- auxilary -----------------------


}

function cursorPoint(event: MouseEvent) {
    const canvasRect = doc.canvas.getBoundingClientRect();
    return {
        x: event.x - canvasRect.left,
        y: event.y - canvasRect.top
    };
}



function takeFocusOff() {
    doc.canvas.focus();
}

function sceneToJson(space: Space): string {
        space.balls.forEach(b => {b.box = null; b.clearDots();});
        let obj = {
            balls: space.balls.map(b => 
               ({x: b.x, y: b.y, vx: b.vx, vy: b.vy, m: b.m, radius: b.radius, color: b.color, is_stone: b.is_stone}) ),
            lines: space.lines,
            links: space.links.map(l => 
                [l.b1.x, l.b1.y, l.b2.x, l.b2.y]),
            g: glo.g, W: glo.W, Wk: glo.Wk, Vis: glo.Vis, K: glo.K, 
        };
        let json = JSON.stringify(obj);
        space.balls.forEach(b => b.box = space);  
        return json; 
    

}

function restoreSceneFromJson(json: string, space: Space): void 
    {
        const obj = JSON.parse(json);
        // restore balls
        space.balls = obj.balls.map((b: any) => new Ball(b.x, b.y, b.radius, b.color, b.vx, b.vy,  b.is_stone,  b.m, ));
        space.balls.forEach(b => b.box = space);

        // restore lines
        space.lines = obj.lines.map((l: any) => new Line(l.x1, l.y1, l.x2, l.y2));
        // restore links
        space.links = [];
        obj.links.forEach((arr: number[]) => {
            let b1 = space.ballUnderPoint({ x: arr[0], y: arr[1] });
            let b2 = space.ballUnderPoint({ x: arr[2], y: arr[3] });
            if (b1 && b2) {
                space.links.push(new Link(b1, b2));
            }
        });
        // restore globals
        glo.g = obj.g;
        glo.W = obj.W;
        glo.Wk = obj.Wk;
        glo.Vis = obj.Vis;
        glo.K = obj.K;
    }
