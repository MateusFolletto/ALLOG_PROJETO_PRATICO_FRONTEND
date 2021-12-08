export function MaskMoney(value: number, symbol: string){
    if(value === undefined || value === null){
        if(symbol !== undefined){
            return symbol+' 0,00'
        }
        else{
            return '0,00'
        }
    }
    else{
        let auxiliary = value.toString().replace(/\D/g, '')

        if(auxiliary.length >= 3){
            let rationals = Number(auxiliary.slice(0, auxiliary.length - 2)).toString()

            let decimals = auxiliary.slice(-2)

            if(symbol !== undefined){
                return symbol+' '+(rationals+","+decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
            }
            else{
                return (rationals+","+decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
            }
        }
        else if(auxiliary.length === 2){
            if(symbol !== undefined){
                return symbol+' 0,'+auxiliary
            }
            else{
                return '0,'+auxiliary
            }
        }
        else{
            if(symbol !== undefined){
                return symbol+' 0,0'+auxiliary
            }
            else{
                return '0,0'+auxiliary
            }
        }
    }
}

export function UnmaskMoney(value: number){
    let auxiliary = value.toString().replace(/\D/g, '')
    
    if(auxiliary.length >= 3){
        let rationals = Number(auxiliary.slice(0, auxiliary.length - 2)).toString()

        let decimals = auxiliary.slice(-2)
        return parseInt(rationals+""+decimals)
    }
    else if(auxiliary.length === 2){
        return parseInt('0'+auxiliary)
    }
    else{
        return parseInt('00'+auxiliary)
    }
}