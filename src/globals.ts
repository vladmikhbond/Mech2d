export const glo = 
{
    W: 0.5,      // conservation of energу when two balls strikes ( 1 - no loss)
    Wk: 0.95,    // conservation of energу when link reacts ( 1 - no loss)
    K: 100,      // modulus of elasticity of a ball     
    g: 0.005,    // acceleration of gravity  

    Vis: 0,      // коеф. спротиву повітря   ( 0 - нема спротиву)

    INTERVAL: 10,
    time: 0,      // time in ticks (1 sec = 1000/INTERVAL ticks)

    showBallDeform: true,  // show the deformation of a ball
    Kvelo: 100,      // for velocity drawing
    Kg: 1000,        // for gravity range

    strikeCounter: 0,
}

export const doc = 
{
    canvas: <HTMLCanvasElement>document.getElementById("canvas"),
    canvas2: <HTMLCanvasElement>document.getElementById("canvas2"),
    createModeButton: <HTMLSpanElement>document.getElementById("runButton"),

    redBallImg: <HTMLImageElement>document.getElementById("redBallImg"),
    greenBallImg: <HTMLImageElement>document.getElementById("greenBallImg"),
    blueBallImg: <HTMLImageElement>document.getElementById("blueBallImg"),
    goldBallImg: <HTMLImageElement>document.getElementById("goldBallImg"),

    info: <HTMLSpanElement>document.getElementById("info"),
}
