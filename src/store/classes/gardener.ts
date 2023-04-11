import { Coord } from './coord';
import { Direction, IGlobalState } from '../reducers';
import { LEFT, RIGHT, UP, DOWN } from '../actions';
//import gardenerwalkcycle from '../images/gardenerwalkcycle.png';

// The gardener who tends the garden.
export class Gardener {
    pos: Coord;             // Position of the gardener in the environment.
    facing: Direction;      // Direction the gardener is currently facing.
    itemEquipped: boolean;  // Whether or not the gardener has an item equipped.
  
    constructor(pos: Coord, facing: Direction, itemEquipped: boolean) {
      this.pos = pos;
      this.facing = facing;
      this.itemEquipped = itemEquipped;
    }
  
    // Default gardener starting state.
    static initialState(): Gardener {
      return new Gardener(new Coord(500, 300), Direction.Up, false);
    }
  
    // Move the gardener according to given x and y deltas. Return new gardener.
    move(action: any): Gardener {
      let newPos = new Coord(this.pos.x + action.payload[0], this.pos.y + action.payload[1]);
      return new Gardener(newPos, this.getFacingDirection(action), this.itemEquipped);
    }
  
    // Set value of itemEquipped. Return new gardener.
    setItemEquipped(itemEquipped: boolean): Gardener {
      return new Gardener(this.pos, this.facing, itemEquipped);
    }
  
    // Paint the gardener on the canvas.
    paint(canvas: CanvasRenderingContext2D, state: IGlobalState): void {
        let frame = state.currentFrame % 4;
        let row = 0;
        switch (this.facing) {
            case Direction.Up:
                row = 1; break;
            case Direction.Down:
                row = 0; break;
            case Direction.Left:
                row = 2; break;
            case Direction.Right:
                row = 3; break;
        }
        canvas.drawImage(state.gimage, frame * 48, row * 48, 48, 48, this.pos.x - 20, this.pos.y - 20, 60, 60);
    
        //canvas.fillStyle = "#FFA500";   // Orange
        //canvas.strokeStyle = "#146356"; // Dark grey-ish maybe.
        //canvas.fillRect(this.pos.x, this.pos.y, 20, 20);
        //canvas.strokeRect(this.pos.x, this.pos.y, 20, 20);
    }
  
    // Return would-be resulting facing direction given an action.
    getFacingDirection(action: any): Direction {
      switch (action.type) {
        case RIGHT:
          return Direction.Right;
        case LEFT:
          return Direction.Left;
        case UP:
          return Direction.Up;
        case DOWN:
          return Direction.Down;
      }
      return this.facing;
    }
  }