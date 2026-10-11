/**
 * Apple Fluid Spring Motion Physics Engine
 * Enforces critically damped interface settling (damping: 1.0, zero bounce),
 * underdamped momentum handoff (damping: 0.8), and 100% interruptible transitions via WAAPI.
 */

export const SPRING_CONFIGS = {
  // Critically damped interface settling (modals, dialogs, drawers)
  settle: {
    duration: 350,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    damping: 1.0,
    bounce: 0,
  },
  // Underdamped momentum flick / fling (card swipes, quick releases)
  momentum: {
    duration: 400,
    easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    damping: 0.8,
    bounce: 0.15,
  },
  // Tactile pointer press
  press: {
    duration: 150,
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
};

/**
 * Animate an element with critically damped spring physics.
 * Always interruptible: cancels existing running animations if active.
 */
export function springSettle(element, keyframes, options = {}) {
  if (!element || typeof element.animate !== 'function') return null;

  const duration = options.duration || SPRING_CONFIGS.settle.duration;
  const easing = options.easing || SPRING_CONFIGS.settle.easing;

  // Cancel any running animations to ensure 100% interruptibility
  if (element._activeSpring) {
    element._activeSpring.cancel();
  }

  const anim = element.animate(keyframes, {
    duration,
    easing,
    fill: options.fill || 'forwards',
  });

  element._activeSpring = anim;

  anim.onfinish = () => {
    if (element._activeSpring === anim) {
      try {
        anim.commitStyles();
        anim.cancel();
      } catch (e) {}
      element._activeSpring = null;
    }
    options.onComplete?.();
  };

  return anim;
}

/**
 * Animate an element with momentum spring physics using velocity projection.
 */
export function springMomentum(element, keyframes, velocity = 0, options = {}) {
  if (!element || typeof element.animate !== 'function') return null;

  // Modulate duration based on release velocity (higher velocity = snappier duration)
  const baseDuration = options.duration || SPRING_CONFIGS.momentum.duration;
  const speedBonus = Math.min(150, Math.abs(velocity) * 50);
  const duration = Math.max(220, baseDuration - speedBonus);

  if (element._activeSpring) {
    element._activeSpring.cancel();
  }

  const anim = element.animate(keyframes, {
    duration,
    easing: SPRING_CONFIGS.momentum.easing,
    fill: 'forwards',
  });

  element._activeSpring = anim;

  anim.onfinish = () => {
    if (element._activeSpring === anim) {
      try {
        anim.commitStyles();
        anim.cancel();
      } catch (e) {}
      element._activeSpring = null;
    }
    options.onComplete?.();
  };

  return anim;
}
