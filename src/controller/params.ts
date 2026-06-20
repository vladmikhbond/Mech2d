type N2 = [number, number];
type N5 = [number, number, number, number, number];

export function getSizeParams(): N2 | null
{
    const paramsElement = (document.getElementById("sizeParams") as HTMLInputElement)!;
    let ps: N2;
    try {
        ps = (new Function("", 
            "let W, H;" + 
            paramsElement.value + 
            "; return [W, H]" 
        ))();
    } catch {
        return errMesage("Grammar error", paramsElement);
    }
    // перевірки
    if (ps[0] == undefined || ps[0] <= 0) 
        return errMesage("W: W > 0", paramsElement);

    if (ps[1] == undefined || ps[1] <= 0) 
        return errMesage("H: H > 0", paramsElement);

    paramsElement.style.backgroundColor = "";
    return ps;
}


export function getSpaceParams(): N5 | null 
{
    const paramsElement = (document.getElementById("spaceParams") as HTMLInputElement)!;
    let ps: N5;
    try {
        ps = (new Function("", 
            "let k, w, u, v, g ;" + 
            paramsElement.value + 
            "; return [k, w, u, v, g]" 
        ))();
    } catch {
        return errMesage("Grammar error", paramsElement);
    }
    // validation
    const [k, w, u, v, g] = ps;

    if (k == undefined || k < 10 || k > 1000 )
        return errMesage("k: 10 < k < 1000", paramsElement);

    if (w == undefined || w < 0 || w > 1 ) 
        return errMesage("w: 0 <= w < 1", paramsElement);
 
    if (u == undefined || u < 0 || u > 1 ) 
        return errMesage("u: 0 <= u < 1", paramsElement);
 
    if (v == undefined || v < 0 || v > 1 ) 
        return errMesage("v: 0 <= v < 1", paramsElement);
 
    if (g == undefined || g < -0.1 || g > 0.1 ) 
        return errMesage("g: -0.1 < g < 0.1", paramsElement);
 
    paramsElement.style.backgroundColor = "";
    return ps;
}

export function getBallParams(): [number, number|undefined] | null
{
    const paramsElement = (document.getElementById("ballParams") as HTMLInputElement)!;
    let ps: [number, number|undefined];
    try {
        ps = (new Function("", 
            "let st, m;" + 
            paramsElement.value + 
            "; return [st, m]" 
        ))();
    } catch {
        return errMesage("Grammar error", paramsElement);
    }
    // перевірки
    if ( !(ps[0] === 0 || ps[0] === 1) ) 
        return errMesage("st: st = 0 | 1", paramsElement);
    
    paramsElement.style.backgroundColor = "";
    return ps;
}

export function getLinkParams(): [number] | null
{
    const defValue: [number] = [1];
    const paramsElement = (document.getElementById("ballParams") as HTMLInputElement)!;
    let ps: [number];
    try {
        ps = (new Function("", 
            "let t;" + 
            paramsElement.value + 
            "; return [t]" 
        ))();
    } catch {
        return errMesage("Grammar error", paramsElement);
    }
    // перевірки
    if ( !(ps[0] === 0 || ps[0] === 1) ) 
        return errMesage("t: t = 0 | 1", paramsElement);
    
    paramsElement.style.backgroundColor = "";
    return ps;
}


function errMesage(mes: string, el: HTMLInputElement) {
    alert (mes);
    el.style.backgroundColor = "pink";
    return null;
}
