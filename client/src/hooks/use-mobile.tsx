import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024
const SMALL_MOBILE_BREAKPOINT = 480

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useDeviceType() {
  const [deviceType, setDeviceType] = React.useState<{
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
    isSmallMobile: boolean
    isTouchDevice: boolean
  }>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isSmallMobile: false,
        isTouchDevice: false
      }
    }
    
    const width = window.innerWidth
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    
    return {
      isMobile: width < MOBILE_BREAKPOINT,
      isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
      isDesktop: width >= TABLET_BREAKPOINT,
      isSmallMobile: width < SMALL_MOBILE_BREAKPOINT,
      isTouchDevice
    }
  })

  React.useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      setDeviceType({
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        isDesktop: width >= TABLET_BREAKPOINT,
        isSmallMobile: width < SMALL_MOBILE_BREAKPOINT,
        isTouchDevice
      })
    }

    const mql = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT - 1}px)`)
    mql.addEventListener('change', updateDeviceType)
    
    // Initial call
    updateDeviceType()
    
    return () => mql.removeEventListener('change', updateDeviceType)
  }, [])

  return deviceType
}

export function useViewportSize() {
  const [viewportSize, setViewportSize] = React.useState(() => {
    if (typeof window === 'undefined') {
      return { width: 1024, height: 768 }
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  })

  React.useEffect(() => {
    const updateSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', updateSize)
    window.addEventListener('orientationchange', updateSize)
    
    return () => {
      window.removeEventListener('resize', updateSize)
      window.removeEventListener('orientationchange', updateSize)
    }
  }, [])

  return viewportSize
}

// Hook for safe area insets (iPhone notch, etc.)
export function useSafeAreaInsets() {
  const [safeAreaInsets, setSafeAreaInsets] = React.useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  })

  React.useEffect(() => {
    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      setSafeAreaInsets({
        top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
        right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
        left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0')
      })
    }

    updateSafeArea()
    window.addEventListener('resize', updateSafeArea)
    window.addEventListener('orientationchange', updateSafeArea)
    
    return () => {
      window.removeEventListener('resize', updateSafeArea)
      window.removeEventListener('orientationchange', updateSafeArea)
    }
  }, [])

  return safeAreaInsets
}
