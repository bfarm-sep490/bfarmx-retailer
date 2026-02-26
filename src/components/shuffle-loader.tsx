'use client';

import type {
  AnimationOptions,
  Transition,
} from 'framer-motion';
import {
  motion,
  useAnimate,
} from 'framer-motion';
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

const NUM_BLOCKS = 5;
const BLOCK_SIZE = 32;

const DURATION_IN_MS = 175;
const DURATION_IN_SECS = DURATION_IN_MS * 0.001;

const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const ANIMATION_OPTIONS: AnimationOptions = {
  ease: 'easeInOut',
  duration: DURATION_IN_SECS,
};

const MOTION_TRANSITION: Transition = {
  ease: 'easeInOut',
  duration: DURATION_IN_SECS,
};

export const ShuffleLoader = () => {
  const [blocks, setBlocks] = useState(
    Array.from(Array.from({ length: NUM_BLOCKS }).keys()).map(n => ({ id: n })),
  );
  const [scope, animate] = useAnimate();

  const shuffle = useCallback(async () => {
    while (true) {
      const firstId = Math.floor(Math.random() * NUM_BLOCKS);
      let secondId = Math.floor(Math.random() * NUM_BLOCKS);

      while (secondId === firstId) {
        secondId = Math.floor(Math.random() * NUM_BLOCKS);
      }

      animate(`[data-block-id="${firstId}"]`, { y: -BLOCK_SIZE }, ANIMATION_OPTIONS);

      await animate(
        `[data-block-id="${secondId}"]`,
        { y: BLOCK_SIZE },
        ANIMATION_OPTIONS,
      );

      await delay(DURATION_IN_MS);

      setBlocks((pv) => {
        const copy = [...pv];

        const indexForFirst = copy.findIndex(block => block.id === firstId);
        const indexForSecond = copy.findIndex(block => block.id === secondId);

        if (indexForFirst === -1 || indexForSecond === -1) {
          return pv;
        }

        const firstBlock = copy[indexForFirst];
        const secondBlock = copy[indexForSecond];

        if (!firstBlock || !secondBlock) {
          return pv;
        }

        copy[indexForFirst] = secondBlock;
        copy[indexForSecond] = firstBlock;

        return copy;
      });

      await delay(DURATION_IN_MS * 2);

      animate(`[data-block-id="${firstId}"]`, { y: 0 }, ANIMATION_OPTIONS);

      await animate(`[data-block-id="${secondId}"]`, { y: 0 }, ANIMATION_OPTIONS);

      await delay(DURATION_IN_MS);
    }
  }, [animate]);
  useEffect(() => {
    shuffle();
  }, [shuffle]);
  return (
    <div ref={scope} className="flex divide-x divide-secondary">
      {blocks.map((b) => {
        return (
          <motion.div
            layout
            data-block-id={b.id}
            key={b.id}
            transition={MOTION_TRANSITION}
            style={{
              width: BLOCK_SIZE,
              height: BLOCK_SIZE,
            }}
            className="bg-primary"
          />
        );
      })}
    </div>
  );
};
