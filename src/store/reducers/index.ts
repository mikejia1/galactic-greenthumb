// Reducers take in the current state and an action and return a new state.
// They are responsible for processing all game logic.

import { Direction, computeCurrentFrame, worldBoundaryColliders, tileRect, rectanglesOverlap, randomInt, ALL_DIRECTIONS, Coord, GardenerDirection } from "../../utils";
import { Collider, ColliderType, ColliderExceptions, IGlobalState } from "../classes";
import { Gardener, NonPlayer, WateringCan, Plant, INITIAL_PLANT_HEALTH } from '../../entities';
import {
  DOWN,
  INCREMENT_SCORE,
  LEFT,
  TICK,
  RESET,
  RESET_SCORE,
  RIGHT,
  TOGGLE_EQUIP,
  UP,
  USE_ITEM,
  STOP_WATERING,
  STOP_RIGHT,
  STOP_LEFT,
  STOP_UP,
  STOP_DOWN,
  TOGGLE_DEBUG_CONTROL_COLLISION_RECTS,
  TOGGLE_DEBUG_CONTROL_POSITION_RECTS,
  TOGGLE_DEBUG_CONTROL_WATERING_RECTS,
  TOGGLE_DEBUG_CONTROL_FACING_RECTS,
  TOGGLE_DEBUG_CONTROL_EQUIP_RECTS,
  TOGGLE_DEBUG_CONTROL_DISABLE_COLLISIONS,
  TOGGLE_GAME_AUDIO,
} from "../actions";
import { V_TILE_COUNT, H_TILE_COUNT, collisions, plants, MAP_TILE_SIZE } from "../data/positions";
import { InvisibleCollider } from "../../scene";

// Gardener images.
import basewalkstrip     from "../../entities/images/gardener/base_walk_strip8.png";
import basewateringstrip from "../../entities/images/gardener/base_watering_strip5.png";
import toolwateringstrip from "../../entities/images/gardener/tools_watering_strip5.png";

// Blast shield images.
import closedShield from "../../entities/images/shield/shield_32x160.png";
import topShield    from "../../entities/images/shield/shield_top_32x.png";
import bottomShield from "../../entities/images/shield/shield_bottom_32x.png";

// Other images.
import npcwalkcycle from "../../entities/images/nonplayer/npcwalkcycle.png";
import spacegarden  from "../images/space_garden.png";
import wateringcan  from "../../entities/images/wateringcan/wateringcan.png";
import spaceframes  from "../images/space_frames.png";

// Default gardener starting state.
function initialGardener(colliderId: number): Gardener {
  return new Gardener(colliderId, new Coord(200, 220), GardenerDirection.Right, false, false, false);
}

// Create watering can for start of game.
function initialWateringCan(): WateringCan {
  return new WateringCan(new Coord(200, 150), false);
}

// Generate the game starting state.
function initialGameState(): IGlobalState {
  // Ensure all colliders get a unique ID.
  let colliderId = 0;

  // Create invisible colliders for map features with unique collider Ids and increment colliderId accordingly.
  let features = invisibleCollidersForMapFeatures(colliderId);
  colliderId += features.length;

  // Create plants from initial plant positions. 
  let allPlants = createPlants(colliderId);
  colliderId += allPlants.length;

  // Create invisible colliders for world boundaries with unique collider Ids and increment colliderId accordingly.
  let worldBoundaries = worldBoundaryColliders(colliderId);
  colliderId += worldBoundaries.length;

  // Create a bunch of NPCs and increment colliderId accordingly.
  let npcs = gridOfNPCs(colliderId, new Coord(200, 250), 25, 2, 2);
  colliderId += npcs.length;

  return {
    gardener: initialGardener(colliderId++),
    keysPressed: [],
    score: 0,
    wateringCan: initialWateringCan(),
    plants: allPlants,
    npcs: npcs,
    currentFrame: 0,
    gardenerImages: {
      walkingBase:  loadImage("Base walk strip", basewalkstrip),
      wateringBase: loadImage("Base watering strip", basewateringstrip),
      waterPouring: loadImage("Tool watering strip", toolwateringstrip),
    },
    npcimage:         loadImage("NPC walk cycle", npcwalkcycle),
    backgroundImage:  loadImage("Space garden", spacegarden),
    wateringCanImage: loadImage("Watering can", wateringcan),
    deepSpaceImage:   loadImage("Space frames", spaceframes),
    shieldImages: {
      closed:         loadImage("Closed shield", closedShield),
      top:            loadImage("Top shield", topShield),
      bottom:         loadImage("Bottom shield", bottomShield),
    },
    invisibleColliders: [...worldBoundaries, ...features],  // Map features and world boundaries both contribute invisible colliders.
    muted: true,
    debugSettings: {
      showCollisionRects: false,   // Collision rectangles for colliders.
      showPositionRects: false,    // Position rectangles for paintables.
      showWateringRects: false,    // Watering interaction rectangles for plants.
      showFacingRects: false,      // Facing direction rectangle for gardener.
      showEquipRects: false,       // Equipping interaction rectangle for watering can.
      collisionsDisabled: false,   // Disable collision checks - Gardener can walk through anything.
    },
  }
}

function loadImage(title: string, resource: string) {
  const img = new Image();
  img.src = resource;
  img.onload = () => {
      console.log("Image loaded: " + title);
  };
  return img;
}

// Create a grid of NPCs with top-left one at given position, and with given spacing.
function gridOfNPCs(colliderId: number, pos: Coord, spacing: number, cols: number, rows: number): NonPlayer[] {
  let all: NonPlayer[] = [];
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      let npc = new NonPlayer({
        colliderId: colliderId + (row * cols) + col,
        pos: pos.plus(col * spacing, row * spacing), 
      });
      all = [...all, npc];
    }
  }
  return all;
}

function createPlants(colliderId: number): Plant[]{
  let all: Plant[] = [];
  for (let r = 0; r < V_TILE_COUNT; r++) {
    for (let c = 0; c < H_TILE_COUNT; c++) {
      let i = (r * H_TILE_COUNT) + c;
      if (plants[i] == 0) continue;
      // Shift the vertical position of plants by 4 pixels to better align with dirt patch. 
      let plant: Plant = new Plant(colliderId++, new Coord(c*MAP_TILE_SIZE, r*MAP_TILE_SIZE+8), INITIAL_PLANT_HEALTH);
      all = [...all, plant];
    }
  }
  return all;
}

// Return an array of invisible colliders based on store/data/collision.tsx
function invisibleCollidersForMapFeatures(nextColliderId: number): Collider[] {
  let all: Collider[] = [];
  for (let r = 0; r < V_TILE_COUNT; r++) {
    for (let c = 0; c < H_TILE_COUNT; c++) {
      let i = (r * H_TILE_COUNT) + c;
      if (collisions[i] == 0) continue;
      let ic = new InvisibleCollider(nextColliderId + all.length, tileRect(r,c));
      all = [...all, ic];
    }
  }
  return all;
}

// All actions/index.ts setters are handled here
const gameReducer = (state = initialGameState(), action: any) => {
  switch (action.type) {
    case RIGHT:                                   return newKeyDown(state, Direction.Right);
    case LEFT:                                    return newKeyDown(state, Direction.Left);
    case UP:                                      return newKeyDown(state, Direction.Up);
    case DOWN:                                    return newKeyDown(state, Direction.Down);
    case STOP_RIGHT:                              return newKeyUp(state, Direction.Right);
    case STOP_LEFT:                               return newKeyUp(state, Direction.Left);
    case STOP_UP:                                 return newKeyUp(state, Direction.Up);
    case STOP_DOWN:                               return newKeyUp(state, Direction.Down);
    case TOGGLE_EQUIP:                            return toggleEquip(state);
    case USE_ITEM:                                return utiliseItem(state);
    case STOP_WATERING:                           return ceaseWatering(state);
    case RESET:                                   return initialGameState();
    case RESET_SCORE:                             return { ...state, score: 0 };
    case INCREMENT_SCORE:                         return { ...state, score: state.score + 1 };
    case TOGGLE_GAME_AUDIO:                       return toggleGameAudio(state);
    case TICK:                                    return updateFrame(state);
    case TOGGLE_DEBUG_CONTROL_COLLISION_RECTS:    return toggleDebugControlCollisionRects(state);
    case TOGGLE_DEBUG_CONTROL_POSITION_RECTS:     return toggleDebugControlPositionRects(state);
    case TOGGLE_DEBUG_CONTROL_WATERING_RECTS:     return toggleDebugControlWateringRects(state);
    case TOGGLE_DEBUG_CONTROL_FACING_RECTS:       return toggleDebugControlFacingRects(state);
    case TOGGLE_DEBUG_CONTROL_EQUIP_RECTS:        return toggleDebugControlEquipRects(state);
    case TOGGLE_DEBUG_CONTROL_DISABLE_COLLISIONS: return toggleDebugControlDisableCollisions(state);
    default:                                      return state;
  }
};

// Stop the gardener if the keyup direction matches the current gardener direction.
function newKeyUp(state: IGlobalState, direction: Direction): IGlobalState {
  var keysPressed = state.keysPressed;
  const index = keysPressed.indexOf(direction);
  if (index > -1) { // only splice array when item is found
    keysPressed.splice(index, 1); // 2nd parameter means remove one item only
  }
  // Only stop gardener if no keys are pressed.
  if (keysPressed.length === 0) {
    return { ...state, keysPressed: keysPressed, gardener: state.gardener.stop()}
  }
  // Update facing direction of gardener if new key is to the left or right.
  if (keysPressed[0] === Direction.Left || keysPressed[0] === Direction.Right) {
    return { ...state, keysPressed: keysPressed, gardener: state.gardener.changeFacingDirection(keysPressed[0])}
  }
  return {...state, keysPressed: keysPressed};
}

// Only move the gardener if the keypress changes the gardener direction.
function newKeyDown(state: IGlobalState, direction: Direction): IGlobalState {
  // This is a spurious keypress. Ignore it.
  if (ignoreKeyPress(direction, state.keysPressed)) {
    return state;
  }
  // Add the new keypress to the keysPressed array. New keypress must be first.
  const keys = [direction, ...state.keysPressed];
  // If keypress is to the left or right, update the gardener's facing direction.
  let gardener = state.gardener;
  if (direction === Direction.Left || direction === Direction.Right) {
    gardener = gardener.changeFacingDirection(direction);
  }
  gardener.moving = true;
  return {...state, keysPressed: keys, gardener: gardener};
}

function ignoreKeyPress(newDirection: Direction, keysPressed: Direction[]): boolean {
  // If key is the same as the current direction, ignore it.
  if (keysPressed[0] === newDirection) return true;
  return false;
}

// Move the gardener according to keys pressed.
// This will be aborted if the would-be new position overlaps with a plant.
function moveGardenerOnFrame(state: IGlobalState, allColliders: Map<number, Collider>): IGlobalState {
  // Would-be new post-move gardener.
  const newGar = state.gardener.move(state.keysPressed);

  // If new gardener is in collision with anything, we abort the move.
  if (collisionDetected(state, allColliders, newGar)) {
    console.log("Bump!");
    if (!state.muted) playBumpSound();
    return {
      ...state,
      currentFrame: computeCurrentFrame(),
    }
  }
  // All clear. Commit the move to the global state.
  return {
    ...state,
    gardener: newGar,
    // Watering can moves with gardener if the item is equipped.
    wateringCan: state.wateringCan.isEquipped ? state.wateringCan.moveWithGardener(newGar) : state.wateringCan,
    currentFrame: computeCurrentFrame(),
  }
}

// Play the sound corresponding to the gardener bumping into a collider.
function playBumpSound(): void {
  try {
    let boing = new Audio(require('../sounds/boing.mp3'));
    let playPromise = boing.play();
    // In browsers that don’t yet support this functionality, playPromise won’t be defined.
    if (playPromise !== undefined) {
      playPromise.then(function() {}).catch(function(error) {
        console.log("Bump sound failure: ", error);
      });
    }
  } catch (error) {
    console.log("Audio error: ", error);
  }
}

// TODO: See if we can animate from within a saga instead of the way we're doing it now.
function updateFrame(state: IGlobalState): IGlobalState {
  let f = computeCurrentFrame();
  if (f === state.currentFrame) {
    return state;
  }
//  // Allow fruits to grow.
//  let newState = growFruits(state, f);

  // Get all the colliders as they exist now.
  let allColliders = allCollidersFromState(state);

  // Allow gardener to move.
  let gardenerMoving = state.gardener.moving;
  if (gardenerMoving) {
    state = moveGardenerOnFrame(state, allColliders);
    allColliders.set(state.gardener.colliderId, state.gardener);
  }

  // Allow gardener to (keep) watering.
  if (state.gardener.watering) state = utiliseItem(state);

  // Allow NPCs to move.
  let newNPCs: NonPlayer[] = [];
  state.npcs.forEach(npc => {
    // Get a new version of the npc - one that has taken its next step.
    let newNPC = moveNPC(state, npc);

    // Allow the NPC to consider adopting a new movement (forced = false).
    newNPC = considerNewNPCMovement(newNPC, false);

    // If this new NPC is in collision with anything, revert back to original npc
    // and force it to choose a new movement.
    if (collisionDetected(state, allColliders, newNPC)) {
      newNPC = considerNewNPCMovement(npc, true);
    }

    // Update the NPC array. Update the colliders so that subsequent NPCs will
    // check collisions against up-to-date locations of their peers.
    newNPCs = [...newNPCs, newNPC];
    allColliders.set(newNPC.colliderId, newNPC);
  });

  return {
    ...state,
    currentFrame: f,
    npcs: newNPCs,
  }
}

// Toggle debug control showCollisionRects from False to True or vice versa.
function toggleDebugControlCollisionRects(state: IGlobalState): IGlobalState {
  return {
    ...state,
    debugSettings: {
      ...state.debugSettings,
      showCollisionRects: !state.debugSettings.showCollisionRects,
    },
  };
}

// Toggle debug control showPositionRects from False to True or vice versa.
function toggleDebugControlPositionRects(state: IGlobalState): IGlobalState {
  return {
    ...state,
    debugSettings: {
      ...state.debugSettings,
      showPositionRects: !state.debugSettings.showPositionRects,
    },
  };
}

// Toggle debug control showWateringRects from False to True or vice versa.
function toggleDebugControlWateringRects(state: IGlobalState): IGlobalState {
  return {
    ...state,
    debugSettings: {
      ...state.debugSettings,
      showWateringRects: !state.debugSettings.showWateringRects,
    },
  };
}

// Toggle debug control showFacingRects from False to True or vice versa.
function toggleDebugControlFacingRects(state: IGlobalState): IGlobalState {
  return {
    ...state,
    debugSettings: {
      ...state.debugSettings,
      showFacingRects: !state.debugSettings.showFacingRects,
    },
  };
}

// Toggle debug control showEquipRects from False to True or vice versa.
function toggleDebugControlEquipRects(state: IGlobalState): IGlobalState {
  return {
    ...state,
    debugSettings: {
      ...state.debugSettings,
      showEquipRects: !state.debugSettings.showEquipRects,
    },
  };
}

// Toggle debug control disableCollisions from False to True or vice versa.
function toggleDebugControlDisableCollisions(state: IGlobalState): IGlobalState {
  return {
    ...state,
    debugSettings: {
      ...state.debugSettings,
      collisionsDisabled: !state.debugSettings.collisionsDisabled,
    },
  };
}

// Change state's "muted" property from false to true or vice versa.
function toggleGameAudio(state: IGlobalState): IGlobalState {
  return {
    ...state,
    muted: !state.muted,
  };
}

// Allow an NPC to randomly choose a new movement. If the NPC is not currently moving, wait for
// its stationaryCountdown to reach zero before adopting a new movement.
function considerNewNPCMovement(npc: NonPlayer, forced: boolean): NonPlayer {
  // Whether or not the NPC will adopt a new movement.
  let change = false;

  // If NPC is currently stationery, adopt new movement when the countdown reaches zero,
  // otherwise adopt new movement with some small probability.
  if (!npc.moving) {
    if (npc.stationeryCountdown === 0) change = true;
  } else {
    change = (Math.random() < 0.02);
  }
  change = change || forced;

  // If no new movement is being adopted, return NPC unchanged.
  if (!change) return npc;

  // New movement is to be adopted. Choose new direction *or* choose to remain stationery for a while.
  let choice = randomInt(0, 4);
  if (choice === 4) {
    let countdown = 30 + randomInt(0, 200);
    return new NonPlayer({
      clone: npc,
      moving: false,
      stationeryCountdown: countdown,
    });
  }
  return new NonPlayer({
    clone: npc,
    moving: true,
    facing: ALL_DIRECTIONS[choice],
  });
}

// "Move" the NPC. In quotes because NPCs sometimes stand still and that's handled here too.
function moveNPC(state: IGlobalState, npc: NonPlayer): NonPlayer {
  if (!npc.moving) {
    return new NonPlayer({
      clone: npc,
      stationeryCountdown: Math.max(0, npc.stationeryCountdown - 1),
    });
  }
  return npc.move();
}

/*
// Check all plants to see if any will grow their fruits. Return state unchanged
// if no fruit growth occurred, otherwise return updated state.
function growFruits(state: IGlobalState, frame: number): IGlobalState {
  let grewAny = false;
  let newPlants: Plant[] = [];
  state.plants.forEach(plant => {
    let result = plant.growFruits(frame);
    if (result.didGrow) newPlants = [ ...newPlants, result.newPlant ];
    else newPlants = [ ...newPlants, plant ];
    grewAny = grewAny || result.didGrow;
  });
  if (grewAny) return { ...state, plants: newPlants };
  return state;
}
*/

// Check whether the given collider overlaps (collides) with any other collider (excluding itself).
function collisionDetected(state: IGlobalState, colliders: Map<number, Collider>, collider: Collider): boolean {
  if (state.debugSettings.collisionsDisabled) return false;
  let cRect = collider.collisionRect();

  // Check all colliders and stop if and when any collision is found.
  let ids = Array.from(colliders.keys());
  for (let i = 0; i < ids.length; i++) {
    let colliderId = ids[i];
    // Don't check collisions with self.
    if (colliderId === collider.colliderId) continue;
    let co = colliders.get(colliderId);
    if (co === undefined) continue; // Will never happen.
    // Ignore collisions if there's an explicit exception for this pair of collider types.
    let exceptions = ColliderExceptions(collider);
    let expt = exceptions[co.colliderType.toString()];
    if (expt === true) continue;
    if (rectanglesOverlap(cRect, co.collisionRect())) return true;
  };

  // No collisions detected.
  return false;
}

// Get all the colliders from a state.
function allCollidersFromState(state: IGlobalState): Map<number, Collider> {
  let map = new Map<number, Collider>();
  state.plants.forEach(plant => map.set(plant.colliderId, plant));
  state.invisibleColliders.forEach(ic => map.set(ic.colliderId, ic));
  state.npcs.forEach(npc => map.set(npc.colliderId, npc));
  map.set(state.gardener.colliderId, state.gardener);
  return map;
}

// Attempt to equip item or drop current item.
function toggleEquip(state: IGlobalState): IGlobalState {
  if (state.gardener.itemEquipped) {
    return {
      ...state,
      gardener: state.gardener.setItemEquipped(false),
      wateringCan: state.wateringCan.layOnTheGround(),
    }
  }
  if (!canEquip(state)) {
    return state;
  }
  return {
      ...state,
      gardener: state.gardener.setItemEquipped(true),
      wateringCan: state.wateringCan.moveWithGardener(state.gardener),
  }
}

// Check whether or not an item can be equipped right now.
function canEquip(state: IGlobalState): boolean {
  // Rectangle for the direction the gardener is facing.
  let faceRect = state.gardener.facingDetectionRect();
  let rect = state.wateringCan.equipRect();
  return rectanglesOverlap(faceRect, rect);
}

// Use currently equipped item, if possible.
// Note: Named "utilise" instead of "use" because "useItem" exists elsewhere.
function utiliseItem(state: IGlobalState): IGlobalState {
  if (!state.gardener.itemEquipped) {
    return state;
  }
  var newPlants: Plant[] = [];
  let faceRect = state.gardener.facingDetectionRect();
  let alreadyAbsorbed = false;
  for (let i = 0; i < state.plants.length; i++) {
    let plant = state.plants[i];
    let plantRect = plant.wateringRect();
    if (!alreadyAbsorbed && rectanglesOverlap(faceRect, plantRect)) {
      newPlants = [...newPlants, plant.absorbWater()];
      alreadyAbsorbed = true;
    } else {
      newPlants = [...newPlants, plant];
    }
  }

  return {
    ...state,
    plants: newPlants,
    gardener: state.gardener.setWatering(true),
  };
}

// Set the gardener's "watering" boolean to false.
function ceaseWatering(state: IGlobalState): IGlobalState {
  return {
    ...state,
    gardener: state.gardener.setWatering(false),
  };
}

export default gameReducer;
