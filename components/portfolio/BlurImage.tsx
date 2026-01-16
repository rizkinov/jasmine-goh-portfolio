'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image, { ImageProps } from 'next/image';
import { useAnimationPreferences } from '@/lib/useAnimationPreferences';

interface BlurImageProps extends Omit<ImageProps, 'onLoad'> {
    alt: string;
}

export function BlurImage({ alt, className = '', ...props }: BlurImageProps) {
    const { shouldSkipAnimations } = useAnimationPreferences();
    const [isLoaded, setIsLoaded] = useState(false);

    // When animations are skipped, render without animations
    if (shouldSkipAnimations) {
        return (
            <div className={`relative overflow-hidden ${className}`}>
                <Image
                    alt={alt}
                    onLoad={() => setIsLoaded(true)}
                    {...props}
                />
            </div>
        );
    }

    return (
        <motion.div
            className={`relative overflow-hidden ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Blur placeholder */}
            <motion.div
                className="absolute inset-0 bg-muted"
                initial={{ opacity: 1, filter: 'blur(20px)' }}
                animate={{
                    opacity: isLoaded ? 0 : 1,
                    filter: isLoaded ? 'blur(0px)' : 'blur(20px)'
                }}
                transition={{ duration: 0.5, ease: 'easeOut' as const }}
            />

            {/* Actual image */}
            <motion.div
                initial={{ filter: 'blur(20px)', scale: 1.1 }}
                animate={{
                    filter: isLoaded ? 'blur(0px)' : 'blur(20px)',
                    scale: isLoaded ? 1 : 1.1
                }}
                transition={{ duration: 0.5, ease: 'easeOut' as const }}
            >
                <Image
                    alt={alt}
                    onLoad={() => setIsLoaded(true)}
                    {...props}
                />
            </motion.div>
        </motion.div>
    );
}
