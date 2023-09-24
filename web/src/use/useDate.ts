import moment from "moment";

export function useDate(date: string | undefined) {
    if (!date) return "Unknown";
    return moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
}

export function useNow(date: string | undefined) {
    if (!date) return "Unknown";
    return moment(date).fromNow();
}

export function useUnix(date: number) {
    return moment.unix(date);
}
