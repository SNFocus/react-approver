export function notEmptyArray (arr: any): boolean {
    return Array.isArray(arr) && arr.length > 0 
}

export function jsonCopy <T> (target: T): T {
    return JSON.parse(JSON.stringify(target))
}