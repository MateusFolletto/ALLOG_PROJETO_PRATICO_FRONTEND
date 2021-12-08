export function MaskNumber(value: number) {
    let auxiliary = value.toString().replace(/\D/g, '');

    if(auxiliary.length > 3){
        let result = parseFloat(auxiliary).toFixed(0).split('.');
        result[0] = result[0].split(/(?=(?:...)*$)/).join('.');

        return result.join(',');
    }
    else if(auxiliary.length >0){
        return parseInt(auxiliary);
    }
    else{
        return 0;
    }
};

export function UnmaskNumber(value: number) {
    let auxiliary = value.toString().replace(/\D/g, '');
    return parseInt(auxiliary);
};