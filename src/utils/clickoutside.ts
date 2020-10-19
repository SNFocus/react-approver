import React, {useEffect} from 'react'

export function useClickOutSide <T extends HTMLElement> (ref: React.RefObject<T>, onClick: (el: T ,e: MouseEvent) => void) {
    function isElement (el: any): el is T {
        return el instanceof HTMLElement
    } 
    useEffect(() => {
        if (!ref?.current) return
        let element: T | undefined = undefined;
        if (isElement(ref.current)) {
            element = ref.current as T
        } else {
            Object.values(ref.current).some(v => {
                if (isElement(v)) {
                    element = v
                    return true
                }
                return false
            })
        }
        
        if (element) {
            const handleClickOutSide = (e: MouseEvent) => {
                const isInnerClick = onClick && !(element as T).contains(e.target as Node)
                if (isInnerClick && element) {
                    onClick(element, e)
                }
            }
            document.addEventListener('mousedown', handleClickOutSide)
            return () => document.removeEventListener('mousedown', handleClickOutSide)
        }
        return () => {}

    }, [ref, onClick])
}
