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
    if (ps[0] == undefined || ps[0] < 100) 
        return errMesage("Size must by >= 100", defValue, paramsElement);

    if (ps[1] == undefined || ps[1] < 0 || ps[1] > ps[0] / 2 )
        return errMesage("Margin: 0 < margin < size/2", defValue, paramsElement);

    if (ps[2] == undefined || ps[2] < 0 || ps[2] > 1)
        return errMesage("K: 0 < k < 1", defValue, paramsElement);

    if (ps[3] == undefined || ps[3] < 0 || ps[3] > 1)
        return errMesage("Loss: 0 < loss < 1", defValue, paramsElement);
    paramsElement.style.backgroundColor = "";
    return ps;
}



function errMesage(mes: string, defValue: any, el: HTMLInputElement) {
    alert (mes);
    el.style.backgroundColor = "pink";
    return defValue;
}
