import { useEffect, useRef } from "react"

export const scrollToBottom = (element: HTMLUListElement) => {
  element.scrollTo({
    top: element.scrollHeight,
    left: 0,
    behavior: 'instant',
  })
}

export const useChatScroll = <T>(dep: T, disabled: boolean) => {
  const ref = useRef<HTMLUListElement>(null)
  useEffect(() => {
    if (disabled) return
    if (ref.current) {
      scrollToBottom(ref.current)
    }
  }, [dep, disabled])
  return ref as React.RefObject<HTMLUListElement>
}
