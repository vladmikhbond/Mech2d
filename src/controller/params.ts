export function getSpaceParams(): [number, number, number, number]
{
    const defValue: [number, number, number, number] = [0.5, 0.95, 100, 0.005];
    const paramsElement = (document.getElementById("spaceParams") as HTMLInputElement)!;
    let ps: [number, number, number, number];
    try {
        ps = (new Function("", 
            "let W, Wk, K, g;" + 
            paramsElement.value + 
            "; return [W, Wk, K, g]" 
        ))();
    } catch {
        return errMesage("Grammar error", defValue, paramsElement);
    }
    // перевірки
    if (ps[0] == undefined || ps[0] <= 0 || ps[0] > 1 ) 
        return errMesage("W: 0 < W < 1", defValue, paramsElement);

    if (ps[1] == undefined || undefined || ps[0] <= 0 || ps[0] > 1 ) 
        return errMesage("Wk: 0 < Wk < 1", defValue, paramsElement);

    if (ps[2] == undefined || ps[2] <= 0 )
        return errMesage("K: K > 0", defValue, paramsElement);

    if (ps[3] == undefined )
       ps[3] == 0;

    paramsElement.style.backgroundColor = "";
    return ps;
}



function errMesage(mes: string, defValue: any, el: HTMLInputElement) {
    alert (mes);
    el.style.backgroundColor = "pink";
    return defValue;
}
