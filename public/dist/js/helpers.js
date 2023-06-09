function currency_round_2_digit(amount_float) {
    if(amount_float){
        return amount_float.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    }
}

function numberWithCommas(x) {
    if(x){
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}
