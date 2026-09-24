import { useEffect, useRef, useState } from 'react'

/** 用 ResizeObserver 跟踪元素尺寸；网格列数与虚拟窗口高度都依赖它 */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const sync = () => setSize({ width: element.clientWidth, height: element.clientHeight })
    sync()

    const observer = new ResizeObserver(sync)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, ...size }
}
