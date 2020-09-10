import React, {useEffect} from 'react'

export function useClickOutSide <T extends HTMLElement> (ref: React.RefObject<T>, onClick: (e: MouseEvent) => void) {
    useEffect(() => {
        if (!ref?.current) return
        let element: HTMLElement | undefined = undefined;
        if (ref.current instanceof HTMLElement) {
            element = ref.current as HTMLElement
        } else {
            Object.values(ref.current).some(v => {
                if (v instanceof HTMLElement) {
                    element = v
                    return true
                }
                return false
            })
        }
        
        if (element === undefined) return
        const handleClickOutSide = (e: MouseEvent) => {
            if (onClick && !(element as T).contains(e.target as Node)) {
                onClick(e)
            }
        }

        document.addEventListener('mousedown', handleClickOutSide)
        return () => document.removeEventListener('mousedown', handleClickOutSide)

    }, [ref, onClick])
}
