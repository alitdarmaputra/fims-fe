import moment from "moment";

export function numToIDR(strNum) {
    strNum = strNum.replace("Rp. ", "");
    strNum = strNum.replace(/\./g, "");

    if (isNaN(strNum))
        return "Rp. 0";

    return "Rp. " + new Intl.NumberFormat("id-ID").format(strNum);
}

export function IDRToNum(idrNum) {
    idrNum = idrNum.replace("Rp. ", "");
    idrNum = idrNum.replace(/\./g, "");
    return parseInt(idrNum, 10);
}

export function formatDateTime(datetime) {
    moment.locale("en")
    return moment(datetime).format("LLLL")
}

export function formatDate(datetime) {
    moment.locale("en");
    return moment(datetime).format("LL");
}

export function toCapitalize(str) {
    str = str.toLowerCase();
    let arr = str.split(" ");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    return arr.join(" ");
}
