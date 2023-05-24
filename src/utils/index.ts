import { ColliderType, IGlobalState, Paintable } from "../store/classes";
import { H_TILE_COUNT, MAP_TILE_SIZE, V_TILE_COUNT } from "../store/data/positions";
import { TypedPriorityQueue } from "./priorityqueue";
import {
  BACKGROUND_WIDTH, BACKGROUND_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT, Direction, ALL_DIRECTIONS,
  Colour, ENTITY_RECT_HEIGHT, ENTITY_RECT_WIDTH, FPS,
 } from "./constants";
 import { Coord } from './coord';
 import { Rect } from './rect';
 import { Tile, WrapSector, InvisibleCollider } from '../scene';
import { drawAnimationEvent } from "./drawevent";

export * from './coord';
export * from './constants';
export * from './priorityqueue';
export * from './rect';
export * from './shaker';

// The coord that would place the Gardener at the centre of the canvas.
export const CANVAS_CENTRE = new Coord(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

// The rectangle that is the visible pixel range on the canvas.
export const CANVAS_RECT = {
  a: new Coord(0,0),
  b: new Coord(CANVAS_WIDTH-1, CANVAS_HEIGHT-1),
};

// The clipping rectangle for the starfield. Used to clip the shield doors,
// preventing them from being draw so far down that they're visible through
// the air lock.
export const STARFIELD_RECT = {
  a: new Coord(0,0),
  b: new Coord(CANVAS_WIDTH-1, 145),  // Y coord here is the key value.
};

export const clearBoard = (canvas: CanvasRenderingContext2D | null) => {
  if (canvas) {
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
};

// Paint the scene, given a canvas and the current game state.
export const drawState = (
  canvas: CanvasRenderingContext2D | null,
  state: IGlobalState
) => {
  if (!canvas) return;
  if (state.debugSettings.freeze) return;

  // Put all paintable objects into a heap-based priority queue.
  // They'll come out sorted by ascending y coordinate for faking 3D.
  let pq = new TypedPriorityQueue<Paintable>(
    function (a: Paintable, b: Paintable) {
      return a.pos.y < b.pos.y;
    }
  );
  let shift = computeBackgroundShift(state, false);
  let deterministicShift = computeBackgroundShift(state, true);
  drawBackground(state, shift, deterministicShift, canvas);
  state.plants.forEach(plant => pq.add(plant));
  state.npcs.forEach(npc => pq.add(npc));
  state.cats.forEach(cat => pq.add(cat));
  state.shieldButtons.forEach(sb => pq.add(sb));
  pq.add(state.airlockButton);
  pq.add(state.gardener);
  pq.add(state.wateringCan);
  while (!pq.isEmpty()) {
    let ptbl = pq.poll();
    if (ptbl === undefined) continue;
    ptbl.paint(canvas, state);
  }
  drawAmbientShade(state, canvas);
  drawAnimationEvent(state, shift, canvas);
  // Extra debug display.
  if (state.debugSettings.showCollisionRects) {
    state.invisibleColliders.forEach(ic => outlineRect(canvas, shiftForVisibleRect(ic.collisionRect(), shift), Colour.COLLISION_RECT));
  }
};

// Draw a semi-transparent black rectangle over the canvas to convey global ambient shade from the shield doors.
function drawAmbientShade(state: IGlobalState, canvas: CanvasRenderingContext2D): void {
  let alpha: number = state.shieldDoors.ambientShadeFactor * 0.4;
  canvas.save();
  canvas.fillStyle = `rgba(0,0,0,${alpha})`;
  canvas.rect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.fill();
  canvas.restore();
}

// Compute a displacement that would shift the background to the "right" place. In tile.ts this
// corresponds to the background being placed in WrapSector.Middle. This includes any screen shake.
export function computeBackgroundShift(state: IGlobalState, deterministic: boolean): Coord {
  let shift = computeBackgroundShiftWithoutShake(state);

  // Let the screenShaker do its thing.
  let shake = deterministic ? state.screenShaker.shakeDeterministic(state.currentFrame) : state.screenShaker.shake();
  shift = shift.plus(shake.x, shake.y);

  return shift.toIntegers();
}

// Compute a displacement that would shift the background to the "right" place. In tile.ts this
// corresponds to the background being placed in WrapSector.Middle. This is without any screen shake.
export function computeBackgroundShiftWithoutShake(state: IGlobalState): Coord {
  let shift = CANVAS_CENTRE.minus(state.gardener.pos.x, state.gardener.pos.y);

  // Make an adjustment to the vertical shift so that as the gardener climbs the ladder and heads to the base of the
  // starfield view window, the full starfield window comes into view. This only applies to the map that existed on
  // April 25th, 2023.
  shift = new Coord(shift.x, remapRange(shift.y, -37, -85, 0, -85));

  // Prevent top of background image from dropping below top of canvas.
  if (shift.y > 0) shift = shift.minus(0, shift.y);
  // Prevent bottom of background image from rising above bottom of canvas.
  if (shift.y + BACKGROUND_HEIGHT < CANVAS_HEIGHT) shift = shift.plus(0, CANVAS_HEIGHT - (shift.y + BACKGROUND_HEIGHT));

  // Wrap-around logic for wide background ring-world type maps.
  if (BACKGROUND_WIDTH > CANVAS_WIDTH) {
    if (shift.x >= 0) return shift.minus(BACKGROUND_WIDTH, 0).toIntegers();
    return shift.toIntegers();
  }

  // Non-wrap-around logic for narrow background bounded maps.
  const padding = (CANVAS_WIDTH - BACKGROUND_WIDTH) / 2;
  // Prevent left edge of background image from moving farther right than the padding amount.
  if (shift.x > padding) shift = shift.minus(shift.x - padding, 0);
  // Prevent right edge of background image from moving farther left than the padding amount.
  if ((shift.x + BACKGROUND_WIDTH) < (CANVAS_WIDTH - padding)) shift = shift.plus((CANVAS_WIDTH - padding) - (shift.x + BACKGROUND_WIDTH), 0);
  return shift.toIntegers();
}

// Given a value (val), if it falls within the range [inA, inB] then linearly remap it to the range [outA, outB].
export function remapRange(val: number, inA: number, inB: number, outA: number, outB: number): number {
  let pos = (val - inA) / (inB - inA);
  if (val > inA) return outA;
  if ((pos < 0) || (pos > 1)) return val;
  return outA + ((outB - outA) * pos);
}

// Compute a displacement that would shift a given tile into the correct place to make it visible.
export function shiftForTile(tile: Tile, state: IGlobalState, shift: Coord): Coord {
  let ws = tile.sector(state, shift);
  switch (ws) {
    case WrapSector.Left:   return shift;
    case WrapSector.Right:  return shift.plus(BACKGROUND_WIDTH, 0);
  }
}

// Given two rectangles, check if they overlap.
export function rectanglesOverlap(rect1: any, rect2: any): boolean {
  let a = rect1.a;
  let b = rect1.b;
  let c = rect2.a;
  let d = rect2.b;
  if (Math.max(a.x, b.x) < Math.min(c.x, d.x)) return false;
  if (Math.min(a.x, b.x) > Math.max(c.x, d.x)) return false;
  if (Math.max(a.y, b.y) < Math.min(c.y, d.y)) return false;
  if (Math.min(a.y, b.y) > Math.max(c.y, d.y)) return false;
  return true;
}

// Paint the background onto the canvas.
// First paint it in the WrapSector.Middle or "normal" position/sector.
// If any of the WrapSector.Left copy of the world should be visible, paint a copy there as well.
// If any of the WrapSector.Right copy of the world should be visible, paint a copy there as well.
function drawBackground(state: IGlobalState, shift: Coord, deterministicShift: Coord, canvas: CanvasRenderingContext2D): void {
  drawShiftedBackground(state, canvas, shift, deterministicShift);
  // A ring-world background image wider than the canvas. 
  if (BACKGROUND_WIDTH > CANVAS_WIDTH) {
    if (shift.x >= 0) {
      let reshift = shift.minus(BACKGROUND_WIDTH, 0);
      let deterministicReshift = deterministicShift.minus(BACKGROUND_WIDTH, 0);
      drawShiftedBackground(state, canvas, reshift, deterministicReshift);
    } else if ((shift.x + BACKGROUND_WIDTH) < CANVAS_WIDTH) {
      let reshift = shift.plus(BACKGROUND_WIDTH, 0);
      let deterministicReshift = deterministicShift.plus(BACKGROUND_WIDTH, 0);
      drawShiftedBackground(state, canvas, reshift, deterministicReshift);
    }
  } else {
    // A narrow bounded map that is not wider than the canvas.
      drawShiftedBackground(state, canvas, shift, deterministicShift);
  }
}

function drawShiftedBackground(state: IGlobalState, canvas: CanvasRenderingContext2D, shift: Coord, deterministicShift: Coord) {
  // Draw the starfield visible through the ship's window.
  drawStarfield(state, canvas, deterministicShift);
  // Draw objects that are in space, visible through the window.
  drawSpaceObjects(state, canvas);
  // Draw the blast shield.
  state.shieldDoors.paint(canvas, state);
  // Draw the airlock doors.
  state.airlock.paint(canvas, state, deterministicShift);
  // Draw the static background of the ship interior.
  canvas.drawImage(state.backgroundImages.default, deterministicShift.x, deterministicShift.y);
}

// Draw objects that are in space, visible through the window.
function drawSpaceObjects(state: IGlobalState, canvas: CanvasRenderingContext2D) {
  if (state.blackHole !== null) state.blackHole.paint(canvas, state);
  if (state.planet1 !== null) state.planet1.paint(canvas, state);
  if (state.planet2 !== null) state.planet2.paint(canvas, state);
  if (state.planet3 !== null) state.planet3.paint(canvas, state);
}

// Draw the starfield seen through the window of the ship.
function drawStarfield(state: IGlobalState, canvas: CanvasRenderingContext2D, shift: Coord) {
  let deepSpaceFrame = Math.floor(state.currentFrame % 24 / 6);
  canvas.drawImage(
    state.backgroundImages.deepSpace,                         // Sprite source image
    deepSpaceFrame * MAP_TILE_SIZE * H_TILE_COUNT, 0,         // Top-left corner of frame in source
    H_TILE_COUNT*MAP_TILE_SIZE, V_TILE_COUNT*MAP_TILE_SIZE,   // Size of frame in source
    shift.x,                                                  // X position of top-left corner on canvas
    shift.y,                                                  // Y position of top-left corner on canvas
    H_TILE_COUNT*MAP_TILE_SIZE, V_TILE_COUNT*MAP_TILE_SIZE);  // Sprite size on canvas
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomDirection(): Direction {
  return ALL_DIRECTIONS[randomInt(0, ALL_DIRECTIONS.length - 1)];
}

// Get the direction (Up/Down/Left/Right) of first relative to second.
export function directionOfFirstRelativeToSecond(first: Paintable | Coord, second: Paintable | Coord): Direction {
  let pos1: Coord = (first instanceof Coord) ? first : first.pos;
  let pos2: Coord = (second instanceof Coord) ? second : second.pos;
  let upness    = pos2.y - pos1.y;
  let downness  = -upness;
  let leftness  = pos2.x - pos1.x;
  let rightness = -leftness;
  let vertness  = Math.max(upness, downness);
  let horzness  = Math.max(leftness, rightness);
  if (vertness > horzness) {
    if (upness > downness) return Direction.Up;
    return Direction.Down;
  }
  if (leftness > rightness) return Direction.Left;
  return Direction.Right;
}

export function directionName(d: Direction): string {
  switch (d) {
    case Direction.Up:    return "up";
    case Direction.Down:  return "down";
    case Direction.Left:  return "left";
    case Direction.Right: return "right";
  }
}

export function oppositeDirection(d: Direction): Direction {
  switch (d) {
    case Direction.Up:    return Direction.Down;
    case Direction.Down:  return Direction.Up;
    case Direction.Left:  return Direction.Right;
    case Direction.Right: return Direction.Left;
  }
}

// Current frame number is just current epoch quarter second.
export function computeCurrentFrame(): number {
  return  Math.floor(Date.now() * FPS / 1000); 
}

// Given a rectangle, return a new one that is shifted by a given x and y delta.
export function shiftRect(rect: Rect, deltaX: number, deltaY: number): Rect {
  return {
    a: rect.a.plus(deltaX, deltaY),
    b: rect.b.plus(deltaX, deltaY),
  };
}

// Given a rectangle, return a new one that is shifted to be in the correct WrapSector for visibility on canvas.
export function shiftForVisibleRect(rect: Rect, shift: Coord): Rect {
  let leftRect = {
    a: rect.a.plus(shift.x, shift.y),
    b: rect.b.plus(shift.x, shift.y),
  };
  // For non-ring-world bounded maps, always return the leftRect.
  if (CANVAS_WIDTH >= BACKGROUND_WIDTH) return leftRect;
  // For ring-world wrap-around maps, it depends which rect would actually be visible.
  let rightRect = shiftRect(leftRect, BACKGROUND_WIDTH, 0);
  if (rectanglesOverlap(CANVAS_RECT, rightRect)) return rightRect;
  return leftRect;
}

// Two invisible colliders to stop gardener and NPCs from wandering beyond top and bottom edges of world.
export function worldBoundaryColliders(nextColliderId: number): InvisibleCollider[] {
  const thickness = 5;
  let boundaries = [
    // Above background image.
    new InvisibleCollider(
      nextColliderId,
      {
        a: new Coord(-thickness, -thickness),
        b: new Coord(BACKGROUND_WIDTH + thickness, -1),
      },
      ColliderType.WallCo),
    // Below background image.
    new InvisibleCollider(
      nextColliderId + 1,
      {
        a: new Coord(-thickness, BACKGROUND_HEIGHT),
        b: new Coord(BACKGROUND_WIDTH + thickness, BACKGROUND_HEIGHT + thickness),
      },
      ColliderType.WallCo),
  ];

  // For ring-world maps that are wider than the canvas, the above boundaries are all that are needed.
  if (BACKGROUND_WIDTH > CANVAS_WIDTH) return boundaries;

  // For non-ring-world maps with width narrower than canvas width, there are left and right boundaries too.
  return [
    ...boundaries,
    new InvisibleCollider(
      nextColliderId + 2,
      {
        a: new Coord(-thickness, -thickness),
        b: new Coord(-1, BACKGROUND_HEIGHT + thickness),
      },
      ColliderType.WallCo),
    new InvisibleCollider(
      nextColliderId + 3,
      {
        a: new Coord(BACKGROUND_WIDTH, -thickness),
        b: new Coord(BACKGROUND_WIDTH + thickness, BACKGROUND_HEIGHT + thickness),
      },
      ColliderType.WallCo),
  ];
  }

// Paint a Rect on a canvas with a given colour.
export function outlineRect(canvas: CanvasRenderingContext2D, rect: Rect, colour: string): void {
  canvas.lineWidth = 1;
  canvas.strokeStyle = colour;
  canvas.strokeRect(rect.a.x, rect.a.y, rect.b.x - rect.a.x + 1, rect.b.y - rect.a.y + 1);
}

// Painted a filled Rect on a canvas with a given colour.
export function fillRect(canvas: CanvasRenderingContext2D, rect: Rect, colour: string): void {
  canvas.fillStyle = colour;
  canvas.fillRect(rect.a.x, rect.a.y, rect.b.x - rect.a.x + 1, rect.b.y - rect.a.y + 1);
}

// Rectangle of dimensions TILE_WIDTH x TILE_HEIGHT at a Paintable's position.
export function positionRect(obj: Paintable): Rect {
  return {
    a: obj.pos.plus(0, -ENTITY_RECT_HEIGHT),
    b: obj.pos.plus(ENTITY_RECT_WIDTH, 0),
  };
}

// Rectangle corresponding to a given row and column on the map.
// See collisions.tsx for map and tile dimensions.
export function tileRect(row: number, col: number): Rect {
  return {
    a: new Coord(col * MAP_TILE_SIZE, row * MAP_TILE_SIZE),
    b: new Coord((col + 1) * MAP_TILE_SIZE, (row + 1) * MAP_TILE_SIZE),
  };
}

export function rectToString(rect: Rect): string {
  return "{ " + rect.a.toString() + " " + rect.b.toString() + " }";
}

// Draw an image on the canvas in such a way that it will be clipped within
// a given destination rectangle.
export function drawClippedImage(
  canvas: CanvasRenderingContext2D, img: any,
  srcX: number, srcY: number,
  srcW: number, srcH: number,
  dstX: number, dstY: number,
  dstW: number, dstH: number,
  clipRect: Rect): void {
    // Compute the non-clipped destination Rect for the image.
    let destRect: Rect = {
      a: new Coord(dstX, dstY),
      b: new Coord(dstX + dstW - 1, dstY + dstH - 1),
    };
    // If clipRect and destRect don't overlap, there's nothing to draw.
    if (!rectanglesOverlap(destRect, clipRect)) return;
    // Get the overlap rectangle representing the only region to be painted.
    let overlap: Rect = computeRectOverlap(destRect, clipRect);
    // Get the source rectangle.
    let srcRect = {
      a: new Coord(srcX, srcY),
      b: new Coord(srcX + srcW - 1, srcY + srcH - 1),
    };
    let clippedSrcRect = computeCorrespondingRect(srcRect, destRect, overlap);
    canvas.drawImage(
      img,
      clippedSrcRect.a.x, clippedSrcRect.a.y,
      clippedSrcRect.b.x - clippedSrcRect.a.x + 1, clippedSrcRect.b.y - clippedSrcRect.a.y + 1,
      overlap.a.x, overlap.a.y,
      overlap.b.x - overlap.a.x + 1, overlap.b.y - overlap.a.y + 1);
}

// Compute the rectangle that is the overlap between two rectangles a and b.
// Note: only call this if you already know the rectangles overlap.
export function computeRectOverlap(u: Rect, v: Rect): Rect {
  return {
    a: new Coord(Math.max(u.a.x, v.a.x), Math.max(u.a.y, v.a.y)),
    b: new Coord(Math.min(u.b.x, v.b.x), Math.min(u.b.y, v.b.y)),
  };
}

// Given three rectangles, a, b, c, where a is the source rectangle in a source image, b is
// the corresponding destination rectangle on a canvas, and c is clipped version of b, return
// the rectangle that is a clipped version of a that does the *same* clipping in the source image.
export function computeCorrespondingRect(a: Rect, b: Rect, c: Rect): Rect {
  let destW = b.b.x - b.a.x + 1;
  let destH = b.b.y - b.a.y + 1;
  let srcW = a.b.x - a.a.x + 1;
  let srcH = a.b.y - a.a.y + 1;
  let topLeft = new Coord(
    a.a.x + (srcW * ((c.a.x - b.a.x) / destW)),
    a.a.y + (srcH * ((c.a.y - b.a.y) / destH)));
  let botRight = new Coord(
    a.b.x + (srcW * ((c.b.x - b.b.x) / destW)),
    a.b.y + (srcH * ((c.b.y - b.b.y) / destH)));
  return {
    a: topLeft,
    b: botRight,
  };
}
