
export function noop (...args: any): any {}

export function isEmptyArr (arr: any): boolean {
    return Array.isArray(arr) && arr.length === 0 
}

export function notEmptyArr (arr: any) {
    return Array.isArray(arr) && arr.length > 0
}

export function jsonCopy <T> (target: T): T {
    return JSON.parse(JSON.stringify(target))
}

export function random (from: number, to: number) {
    const range = to - from + 1
    return to + Math.floor(Math.random() * range)
}

export function sleep (time: number, result: any): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(result)
        }, time);
    })
}

export function loopObj (target: Object, callback: Function) {
    Object.keys(target).forEach(k => {
        if ((target as any)[k] !== undefined) {
            callback(k)
        }
    })
}

export function overlay (target: Object, base: Object) {
    loopObj(base, (key:string) => {
        (target as any)[key] = (base as any)[key]
    })
    return target
}
export function range <T = number>(num: number): Array<T>;
export function range <T = number>(num: number, callback: Function): Array<T>;
export function range <T = number>(start: number, end: any, callback?: Function): Array<T> ;
export function range <T = number>(start: number, end?: number | Function, cb?: number | Function): Array<T> {
    if (typeof end === "number") {
        start = 0
    } else if (typeof end === 'function') {
        cb = end
    } else {
        [start, end] = [0, start]
    }
    const res: T[] = []
    const useCB = typeof cb === 'function'
    for (let i = start; i <= end; i++) {
        res.push(useCB ? (cb as Function)(i) : i)
    }
    return res
}

export function BaseConverter (qutient: number, radix?: number) {
    const chars = '0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz_-';
    radix = radix || chars.length;
    const res = []
    do {
      let mod = qutient % radix;
      qutient = ( qutient - mod ) / radix;
      res.unshift( chars[mod] )
    } while ( qutient );
    return res.join( '' )
}