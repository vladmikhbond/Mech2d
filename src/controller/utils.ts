import { glo, doc } from "../globals.js";
import { Space } from "../models/Space.js";
import { Ball } from "../models/Ball.js";
import { Line } from "../models/Line.js";
import { Link } from "../models/Link.js";


export function cursorPoint(event: MouseEvent) {
    const canvasRect = doc.canvas.getBoundingClientRect();
    return {
        x: event.x - canvasRect.left,
        y: event.y - canvasRect.top
    };
}
 

export function takeFocusOff() {
    doc.canvas.focus();
}


export function sceneToJson(space: Space): string {
        space.balls.forEach(b => {b.space = null; b.clearDots();});
        let obj = {
            balls: space.balls.map(b => 
               ({x: b.x, y: b.y, vx: b.vx, vy: b.vy, m: b.m, radius: b.radius, color: b.color, is_stone: b.is_stone}) ),
            lines: space.lines,
            links: space.links.map(l => 
                [l.b1.x, l.b1.y, l.b2.x, l.b2.y]),
            g: glo.g, W: glo.W, Wk: glo.Wk, Vis: glo.Vis, K: glo.K, 
        };
        let json = JSON.stringify(obj);
        space.balls.forEach(b => b.space = space);  
        return json; 
}

export function restoreSceneFromJson(json: string, space: Space): void 
{
    const obj = JSON.parse(json);
    // restore balls
    space.balls = obj.balls.map((b: any) => new Ball(b.x, b.y, b.radius, b.color, b.vx, b.vy,  b.is_stone,  b.m, ));
    space.balls.forEach(b => b.space = space);

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
