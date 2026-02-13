'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface SpringState {
  current: number;
  target: number;
  velocity: number;
}

function createSpring(initial: number): SpringState {
  return { current: initial, target: initial, velocity: 0 };
}

function stepSpring(
  state: SpringState,
  stiffness: number,
  damping: number,
): void {
  const force = stiffness * (state.target - state.current);
  const dampForce = -damping * state.velocity;
  state.velocity = state.velocity + (force + dampForce);
  state.current = state.current + state.velocity;
}

function isSettled(state: SpringState, threshold = 0.01): boolean {
  return (
    Math.abs(state.velocity) < threshold &&
    Math.abs(state.target - state.current) < threshold
  );
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, precision = 2): number {
  return Math.round(value * 10 ** precision) / 10 ** precision;
}

function adjust(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
): number {
  return toMin + ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin);
}

const INTERACT_STIFFNESS = 0.066;
const INTERACT_DAMPING = 0.25;
const SNAP_STIFFNESS = 0.01;
const SNAP_DAMPING = 0.06;

interface Springs {
  rotateX: SpringState;
  rotateY: SpringState;
  glareX: SpringState;
  glareY: SpringState;
  glareO: SpringState;
  bgX: SpringState;
  bgY: SpringState;
}

interface StyleVars {
  '--pointer-x': string;
  '--pointer-y': string;
  '--pointer-from-center': string;
  '--pointer-from-top': string;
  '--pointer-from-left': string;
  '--card-opacity': string;
  '--rotate-x': string;
  '--rotate-y': string;
  '--background-x': string;
  '--background-y': string;
}

export function useCardInteraction() {
  const rafRef = useRef<number | null>(null);
  const interactingRef = useRef(false);
  const settledRef = useRef(true);
  const stiffnessRef = useRef(INTERACT_STIFFNESS);
  const dampingRef = useRef(INTERACT_DAMPING);

  const springsRef = useRef<Springs>({
    rotateX: createSpring(0),
    rotateY: createSpring(0),
    glareX: createSpring(50),
    glareY: createSpring(50),
    glareO: createSpring(0),
    bgX: createSpring(50),
    bgY: createSpring(50),
  });

  const [style, setStyle] = useState<StyleVars>({
    '--pointer-x': '50%',
    '--pointer-y': '50%',
    '--pointer-from-center': '0',
    '--pointer-from-top': '0.5',
    '--pointer-from-left': '0.5',
    '--card-opacity': '0',
    '--rotate-x': '0deg',
    '--rotate-y': '0deg',
    '--background-x': '50%',
    '--background-y': '50%',
  });

  // Use ref for the animate function to avoid circular dependency issues
  const animateRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    animateRef.current = () => {
      const springs = springsRef.current;
      const stiffness = stiffnessRef.current;
      const damping = dampingRef.current;

      stepSpring(springs.rotateX, stiffness, damping);
      stepSpring(springs.rotateY, stiffness, damping);
      stepSpring(springs.glareX, stiffness, damping);
      stepSpring(springs.glareY, stiffness, damping);
      stepSpring(springs.glareO, stiffness, damping);
      stepSpring(springs.bgX, stiffness, damping);
      stepSpring(springs.bgY, stiffness, damping);

      const glareX = springs.glareX.current;
      const glareY = springs.glareY.current;
      const fromCenter = clamp(
        Math.sqrt((glareY - 50) ** 2 + (glareX - 50) ** 2) / 50,
        0,
        1,
      );

      setStyle({
        '--pointer-x': `${round(glareX)}%`,
        '--pointer-y': `${round(glareY)}%`,
        '--pointer-from-center': `${round(fromCenter, 3)}`,
        '--pointer-from-top': `${round(glareY / 100, 3)}`,
        '--pointer-from-left': `${round(glareX / 100, 3)}`,
        '--card-opacity': `${round(springs.glareO.current, 3)}`,
        '--rotate-x': `${round(springs.rotateX.current)}deg`,
        '--rotate-y': `${round(springs.rotateY.current)}deg`,
        '--background-x': `${round(springs.bgX.current)}%`,
        '--background-y': `${round(springs.bgY.current)}%`,
      });

      const allSettled =
        isSettled(springs.rotateX) &&
        isSettled(springs.rotateY) &&
        isSettled(springs.glareX) &&
        isSettled(springs.glareY) &&
        isSettled(springs.glareO) &&
        isSettled(springs.bgX) &&
        isSettled(springs.bgY);

      if (allSettled && !interactingRef.current) {
        settledRef.current = true;
        rafRef.current = null;
      } else {
        rafRef.current = requestAnimationFrame(() => animateRef.current?.());
      }
    };
  });

  const startAnimationLoop = useCallback(() => {
    if (settledRef.current) {
      settledRef.current = false;
      rafRef.current = requestAnimationFrame(() => animateRef.current?.());
    }
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      interactingRef.current = true;
      stiffnessRef.current = INTERACT_STIFFNESS;
      dampingRef.current = INTERACT_DAMPING;

      const rect = e.currentTarget.getBoundingClientRect();
      const absoluteX = e.clientX - rect.left;
      const absoluteY = e.clientY - rect.top;

      const percentX = clamp(round((100 / rect.width) * absoluteX));
      const percentY = clamp(round((100 / rect.height) * absoluteY));
      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const springs = springsRef.current;
      springs.bgX.target = adjust(percentX, 0, 100, 37, 63);
      springs.bgY.target = adjust(percentY, 0, 100, 33, 67);
      springs.rotateX.target = round(-(centerX / 3.5));
      springs.rotateY.target = round(centerY / 3.5);
      springs.glareX.target = round(percentX);
      springs.glareY.target = round(percentY);
      springs.glareO.target = 1;

      startAnimationLoop();
    },
    [startAnimationLoop],
  );

  const handlePointerLeave = useCallback(() => {
    interactingRef.current = false;
    stiffnessRef.current = SNAP_STIFFNESS;
    dampingRef.current = SNAP_DAMPING;

    const springs = springsRef.current;
    springs.rotateX.target = 0;
    springs.rotateY.target = 0;
    springs.glareX.target = 50;
    springs.glareY.target = 50;
    springs.glareO.target = 0;
    springs.bgX.target = 50;
    springs.bgY.target = 50;

    startAnimationLoop();
  }, [startAnimationLoop]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    style: style as React.CSSProperties,
    handlePointerMove,
    handlePointerLeave,
  };
}
