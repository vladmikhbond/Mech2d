import {glo, doc} from "../globals.js";
import {Space} from "../models/Space.js";
import { Geometry as G, Point } from "../models/Geometry.js";


export enum PrettyMode {Draft, Beauty};
export enum TraceMode {No, Yes};

export class View 
{

    private space: Space;

    public prettyMode = PrettyMode.Beauty;
    public traceMode = TraceMode.Yes;

    constructor(box: Space) {
        this.space = box;
    }

    clearTrace() {
        const ctx2 = doc.canvas2.getContext("2d")!;
        ctx2.clearRect(0, 0, doc.canvas2.width, doc.canvas2.height);
    }

    drawAll(lineWidth=0.5)
    {
        if (this.prettyMode)
            return this.drawPretty();
    
        const ctx = doc.canvas.getContext("2d")!;
        ctx.clearRect(0, 0, doc.canvas.width, doc.canvas.height);
        ctx.lineWidth = lineWidth;
    
        // draw box
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, this.space.width, this.space.height);
    
        // draw balls
        for (let b of this.space.balls) {
            ctx.lineWidth = this.space.selBall === b ? 3 * lineWidth : lineWidth;
            ctx.strokeStyle = b.color;
            ctx.beginPath();
            let x = b.x, y = b.y;
            if (glo.showBallDeform && b.dots && b.dots.length > 0) {
                let dot = b.dots[0];
                // show the deformation of the ball
                let alpha = Math.atan2(dot.y - b.y, dot.x - b.x);
                let kr = (G.distance(dot, b) / b.radius);    // ** 0.5; // зведення **0.5 наближає kr до 1 
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(alpha);
                ctx.scale(kr, 1/kr);
                ctx.rotate(-alpha);
                ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
                ctx.restore();        }
            else
            {
                ctx.arc(x, y, b.radius, 0, Math.PI * 2);
            }

            // draw velocity
            ctx.strokeRect(x + b.vx * glo.Kvelo - 0.5, y + b.vy * glo.Kvelo - 0.5, 1, 1);
            ctx.moveTo(x, y);
            ctx.lineTo(x + b.vx * glo.Kvelo, y + b.vy * glo.Kvelo );
            ctx.stroke();

            // draw trace
            if (this.traceMode === TraceMode.Yes) {
                const ctx2 = doc.canvas2.getContext("2d")!;
                ctx2.fillStyle = "gray";
                ctx2.fillRect(x-0.5, y-0.5, 1, 1);
            }
        }
    

        // draw dots of balls
        for (let b of this.space.balls) {
            if (!b.dots) continue;
            for (let d of b.dots) {
                //if (!d) continue;
                ctx.strokeStyle = 'black';
                ctx.strokeRect(d.x-0.5, d.y-0.5, 1, 1);
            }
        }
    
        // draw lines
        ctx.strokeStyle = "blue";
        for (let l of this.space.lines) {
            ctx.lineWidth = this.space.selLine === l ? 3 * lineWidth : lineWidth;
            ctx.beginPath();
            ctx.moveTo(l.x1, l.y1);
            ctx.lineTo(l.x2, l.y2);
            ctx.stroke();
        }
    
        // draw links
        for (let l of this.space.links) {
            ctx.lineWidth = this.space.selLink === l ? 3 * lineWidth : lineWidth;
            ctx.strokeStyle = l.transparent ? "lightgray" : "gray";
            ctx.beginPath();
            ctx.moveTo(l.x1, l.y1);
            ctx.lineTo(l.x2, l.y2);
            ctx.stroke();
        }
    }

    private drawPretty() {

        const ctx = doc.canvas.getContext("2d")!;
        ctx.clearRect(0, 0, doc.canvas.width, doc.canvas.height);

        // draw box
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, this.space.width, this.space.height);

        // draw links
        ctx.lineWidth = 3;
        ctx.strokeStyle = "gray";
        ctx.beginPath();
        for (let link of this.space.links) {
            if (link.transparent)
                continue;
            ctx.moveTo(link.x1, link.y1);
            ctx.lineTo(link.x2, link.y2);
        }
        ctx.stroke();


        // draw balls
        for (let b of this.space.balls) {
            ctx.save();

            let img = b.color === "red" ? doc.redBallImg : 
                      b.color === "blue" ? doc.blueBallImg : 
                      b.color === "gold" ? doc.goldBallImg :
                      doc.greenBallImg;

            if (glo.showBallDeform && b.dots && b.dots.length > 0) {
                let dot = b.dots[0];
                // show the deformation of the ball
                let alpha = Math.atan2(dot.y - b.y, dot.x - b.x);
                let kr = G.distance(dot, b) / b.radius;
                // зменшення деформації в 5 разів
                kr = 1 - (1 - kr) / 5;
                
                ctx.save();
                ctx.translate(b.x, b.y);
                ctx.rotate(alpha);
                ctx.scale(kr, 1 / kr);
                ctx.rotate(-alpha);

                ctx.translate(-b.radius, -b.radius);
                let k = 2 * b.radius / img.width;
                ctx.scale(k, k);
            }
            else
            {
                ctx.translate(b.x - b.radius, b.y - b.radius);
                let k = 2 * b.radius / img.height;
                ctx.scale(k, k);
            }
            ctx.drawImage(img, 0, 0);
            ctx.restore();

            // draw trace
            if (this.traceMode === TraceMode.Yes) {
                const ctx2 = doc.canvas2.getContext("2d")!;
                ctx2.fillStyle = "gray";
                ctx2.fillRect(b.x - 0.5, b.y - 0.5, 1, 1);
            }           
        }

        // draw lines
        ctx.lineWidth = 4;
        ctx.strokeStyle = "blue";
        ctx.beginPath();
        for (let line of this.space.lines) {
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
        }
        ctx.stroke();
    }
    
    // -------------------- gray things -------------------

    drawGrayLine(p0: Point, p: Point) {
        const ctx = <CanvasRenderingContext2D>doc.canvas.getContext("2d");
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    }

    drawGrayCircle(p0: Point, p: Point) {
        const ctx = <CanvasRenderingContext2D>doc.canvas.getContext("2d");
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 1;
        ctx.beginPath();
        let x = p0.x, y = p0.y;
        let r = Math.round(G.distance(p0, p));
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
        // print sum energy
        ctx.fillText("R = " + r, p.x, p.y );
    }

    // -----------------------------------------------------
    showTimeAndEnergy() {
        //let seconds = (glo.chronos/ 1000 * glo.INTERVAL).toFixed(0);
        let [ek, eg, ed] = this.space.energy;
        doc.info.innerHTML = `T=${glo.time} &nbsp;&nbsp; E=${(ek + eg + ed).toFixed()}`;
    }   
}
