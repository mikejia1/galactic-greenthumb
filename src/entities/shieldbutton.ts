import { IGlobalState, Collider, Paintable, ColliderType } from '../store/classes';
import {
    Direction, Colour, shiftForTile, shiftRect, positionRect, outlineRect,
    ENTITY_RECT_HEIGHT, ENTITY_RECT_WIDTH, BACKGROUND_WIDTH, BACKGROUND_HEIGHT,
    computeBackgroundShift, GARDENER_V_PIXEL_SPEED, GARDENER_H_PIXEL_SPEED, GARDENER_DH_PIXEL_SPEED, GARDENER_DV_PIXEL_SPEED,
    Coord, Rect, GardenerDirection,
} from '../utils';
import { MAP_TILE_SIZE } from '../store/data/positions';
import { Tile } from '../scene';

// A button to activate a section of the multi-panel blast shield.
export class ShieldButton implements Paintable {
    pos: Coord;  // Position of the button in the environment.
 
    constructor(pos: Coord) {
        this.pos = pos;
    }
    
    // Paint the button on the canvas.
    paint(canvas: CanvasRenderingContext2D, state: IGlobalState): void {
        let shift = this.computeShift(state);
        let newPos = this.pos.plus(shift.x, shift.y);        

        // The button animation has 4 frames.
        let frameCount = 4;
        let frame = Math.floor(state.currentFrame % (6 * frameCount) / 6);

        // Determine where, on the canvas, the button should be painted.
        let dest = new Coord(newPos.x - 11, newPos.y - 28);
        dest = dest.toIntegers();
        
        // Paint button sprite for current frame.
        canvas.drawImage(
            state.shieldButtonImage,    // Shield button source image
            (frame * 32), 0,            // Top-left corner of frame in source
            32, 32,                     // Size of frame in source
            dest.x, dest.y,             // Position of sprite on canvas
            32, 32);                    // Sprite size on canvas
    
        // Extra debug displays.
        if (state.debugSettings.showPositionRects) {
            outlineRect(canvas, shiftRect(positionRect(this), shift.x, shift.y), Colour.POSITION_RECT);
        }
    }

    // Compute a displacement that will place the button at the correct place on the canvas.
    computeShift(state: IGlobalState): Coord {
        return shiftForTile(this.closestTile(), state, computeBackgroundShift(state));
    }

    // Determine the grid tile that is the closest approximation to the button's position.
    closestTile(): Tile {
        return new Tile(
            Math.floor(this.pos.x / MAP_TILE_SIZE),
            Math.floor(this.pos.y / MAP_TILE_SIZE));
    }
  }
