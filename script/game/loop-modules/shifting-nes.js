import input from '../../input.js';
import {capitalizeFirstLetter, framesToMs} from '../../shortcuts.js';

export default function shiftingNes(arg) {
  const piece = arg.piece;
  console.log(Math.round(piece.retroDas * 0.06));
  const dasLimit = framesToMs(16);
  const resetShift = () => {
    if (input.getGameDown('softDrop')) {
      return;
    }
    piece.retroDas = 0;
    piece.shiftReleased = true;
  };
  if (input.getGamePress('moveLeft')) {
    resetShift();
    piece.shiftDir = 'left';
  } else if (input.getGamePress('moveRight')) {
    resetShift();
    piece.shiftDir = 'right';
  }
  if (
    piece.shiftDir === 'right' &&
    input.getGameRelease('moveRight') &&
    input.getGameDown('moveLeft')
  ) {
    resetShift();
    piece.shiftDir = 'left';
  } else if (
    piece.shiftDir === 'left' &&
    input.getGameRelease('moveLeft') &&
    input.getGameDown('moveRight')
  ) {
    resetShift();
    piece.shiftDir = 'right';
  } else if (
    input.getGameRelease('moveRight') &&
    input.getGameDown('moveLeft')
  ) {
    piece.shiftDir = 'left';
  } else if (
    input.getGameRelease('moveLeft') &&
    input.getGameDown('moveRight')
  ) {
    piece.shiftDir = 'right';
  } else if (
    input.getGameRelease('moveLeft') ||
    input.getGameRelease('moveRight')
  ) {
    piece.shiftDir = 'none';
  }

  if (piece.shiftDir !== 'none' && !input.getGameDown('softDrop')) {
    if (piece.shiftReleased) {
      piece[`shift${capitalizeFirstLetter(piece.shiftDir)}`]();
      piece.shiftReleased = false;
    } else if (piece.retroDas < dasLimit) {
      piece.retroDas += arg.ms;
    }
    while (piece.retroDas >= dasLimit) {
      piece[`shift${capitalizeFirstLetter(piece.shiftDir)}`]();
      piece.retroDas -= 100;
    }
  }
  if (
    (
      (input.getGameDown('moveLeft') && !piece.canShiftLeft) ||
      (input.getGameDown('moveRight') && !piece.canShiftRight)
    ) && !piece.isStuck
  ) {
    piece.retroDas = dasLimit;
  }
}