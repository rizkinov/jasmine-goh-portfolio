'use client';

import { useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

const getIsMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
};

/**
 * Hook that combines mobile detection with reduced motion preferences.
 * Used to disable or simplify animations for better mobile performance
 * and accessibility compliance.
 */
export function useAnimationPreferences() {
    const shouldReduceMotion = useReducedMotion();

    // Capture mobile state once on first render - never changes to avoid re-render blink
    const isMobileRef = useRef<boolean | null>(null);
    if (isMobileRef.current === null) {
        isMobileRef.current = getIsMobile();
    }

    // Disable animations if: reduced motion preference OR mobile device
    const shouldSkipAnimations = shouldReduceMotion || isMobileRef.current;

    return {
        shouldSkipAnimations,
        isMobile: isMobileRef.current,
        prefersReducedMotion: shouldReduceMotion
    };
}
