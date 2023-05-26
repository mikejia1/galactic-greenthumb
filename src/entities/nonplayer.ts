import { Collider, ColliderType, IGlobalState, Paintable, activateAirlockButton, collisionDetected } from '../store/classes';
import {
    BACKGROUND_HEIGHT, BACKGROUND_WIDTH, Colour, Direction, NPC_H_PIXEL_SPEED,
    ENTITY_RECT_HEIGHT, ENTITY_RECT_WIDTH, NPC_V_PIXEL_SPEED, computeBackgroundShift,
    outlineRect, positionRect, randomDirection, shiftForTile, shiftRect,
    Coord, Rect, randomInt, ALL_DIRECTIONS, directionOfFirstRelativeToSecond, computeCurrentFrame, FPS, oppositeDirection, rectanglesOverlap, randLeftOrRight,
} from '../utils';
import { MAP_TILE_SIZE } from '../store/data/positions';
import { Tile } from '../scene';
import { CausaMortis, Death, paintSkeletonDeath } from './skeleton';

// Probability of cabin fever, per NPC, per frame. 5 in 10,000.
const PER_FRAME_CABIN_FEVER_PROBABILITY = 0.0005;

// Number of frames until a frazzled NPC becomes suicidal.
const SUICIDAL_DELAY = 200;
// Number of frames a suicidal NPC will contemplate death while hanging around the air lock button.
const CONTEMPLATE_DEATH_DELAY = 200;

// Number of frames before NPC respawns after death.
const RESPAWN_DELAY = 96;

// Complete set of possible NPC mental states.
export enum MentalState {
    Normal,     // NPC acting "normal" wandering randomly around the ship
    Frazzled,   // NPC has cabin fever, acting erratic
    Scared,     // NPC is scared of some impending danger
}

export class NonPlayer implements Paintable, Collider {
    pos: Coord;                             // NPC's current location, in pixels, relative to background image.
    facing: Direction;                      // The direction that the NPC is currently facing.
    stationeryCountdown: number;            // A countdown (measured in frames) for when the NPC stands still.
    moving: boolean;                        // Whether or not the NPC is currently walking (vs standing still).
    isOffScreen: boolean;                   // Whether or not the NPC is "gone" off screen, to return at a later time.
    invisible: boolean;                     // Whether or not the NPC is currently invisible.
    biasDirection: Direction;               // A direction that the NPC is biased toward choosing (Left or Right).
    timeOfLastReturnToGarden: number;       // Frame number of the most recent time the NPC returned from the "holding zone".
    mentalState: MentalState;               // The current mental state of the NPC.
    gardenerAvoidanceCountdown: number;     // NPC is avoiding the gardener when this is non-zero.
    hasCabinFever: boolean;                 // To record that an NPC has cabin fever.
    suicideCountdown: number;               // Countdown until frazzled NPC becomes suicidal and heads to the air lock button.
    hasReachedAirLockButton: boolean;       // Whether or not the NPC, when headed to the air lock button, has reached it.
    contemplateDeathCountdown: number;      // Countdown until frazzled NPC near the air lock decides to push the button.
    readyToPushAirLockButton: boolean;      // Whether or not the NPC is trying to push the air lock button.
    isHeadingTowardAirLockDoom: boolean;    // Whether or not the NPC with cabin fever is now headed toward the air lock.
    colliderId: number;                     // ID to distinguish the collider from all others.
    colliderType: ColliderType;             // The type of collider that the NPC currently is (depends on mental state).
    id: number;                             // Index of the npc in the globalstate npc list. 
    death: Death | null;                    // If the NPC is dead, death objects describes how to paint the death animation.

    constructor(params: any) {
        // Some default values to satisfy the requirement that everything be initialized in the constructor.
        this.colliderId = 8675309;                      // A dummy collider ID, meant to be overwritten.
        this.pos = new Coord(50, 50);                   // A dummy position, meant to be overwritten.
        this.facing = randomDirection();                // Choose a random facing direction.
        this.stationeryCountdown = 0;                   // Start with NPC not standing still.
        this.moving = true;                             // Start with NPC moving.
        this.isOffScreen = false;                       // Start with NPC on screen.
        this.biasDirection = randLeftOrRight();         // A random bias direction for the NPC.
        this.timeOfLastReturnToGarden = 0;              // Dummy value for last time NPC returned from "holding zone".
        this.mentalState = MentalState.Normal;          // Start NPC in normal (~calm) mental state.
        this.gardenerAvoidanceCountdown = 0;            // NPC *not* initially avoiding gardener.
        this.hasCabinFever = false;                     // NPC does *not* initially have cabin fever.
        this.suicideCountdown = 0;                      // Dummy value that is ignored unless NPC is frazzled.
        this.hasReachedAirLockButton = false;           // NPC has not yet reached the air lock button in suicidal mode.
        this.contemplateDeathCountdown = 0;             // Dummy value this is ignored unless NPC is frazzled and has approached the air lock button.
        this.readyToPushAirLockButton = false;          // NPC is not currently trying to kill itself with the air lock.
        this.isHeadingTowardAirLockDoom = false;        // NPC is not initially heading toward the air lock to die.
        this.colliderType = ColliderType.NPCNormalCo;   // NPC default mental state is "normal".
        this.id = 123;                                  // Dummy npcId meant to be overridden. 
        this.invisible = false;                         // NPC not invisible by default.
        this.death = null;                              // NPC not dead by default.

        // If the NPC is to be cloned from another, do that first before setting any specifically designated field.
        if (params.clone !== undefined) this.cloneFrom(params.clone);
        if (params.colliderId !== undefined) this.colliderId = params.colliderId;
        if (params.id !== undefined) this.id = params.id;
        if (params.invisible !== undefined) this.invisible = params.invisible;
        if (params.pos !== undefined) this.pos = params.pos;
        if (params.facing !== undefined) this.facing = params.facing;
        if (params.stationeryCountdown !== undefined) this.stationeryCountdown = params.stationeryCountdown;
        if (params.suicideCountdown !== undefined) this.suicideCountdown = params.suicideCountdown;
        if (params.hasReachedAirLockButton !== undefined) this.hasReachedAirLockButton = params.hasReachedAirLockButton;
        if (params.contemplateDeathCountdown !== undefined) this.contemplateDeathCountdown = params.contemplateDeathCountdown;
        if (params.readyToPushAirLockButton !== undefined) this.readyToPushAirLockButton = params.readyToPushAirLockButton;
        if (params.isHeadingTowardAirLockDoom !== undefined) this.isHeadingTowardAirLockDoom = params.isHeadingTowardAirLockDoom;
        if (params.moving !== undefined) this.moving = params.moving;
        if (params.isOffScreen !== undefined) this.isOffScreen = params.isOffScreen;
        if (params.biasDirection !== undefined) this.biasDirection = params.biasDirection;
        if (params.timeOfLastReturnToGarden !== undefined) this.timeOfLastReturnToGarden = params.timeOfLastReturnToGarden;
        if (params.mentalState !== undefined) this.mentalState = params.mentalState;
        if (params.gardenerAvoidanceCountdown !== undefined) this.gardenerAvoidanceCountdown = params.gardenerAvoidanceCountdown;
        if (params.hasCabinFever !== undefined) this.hasCabinFever = params.hasCabinFever;
        if (params.death !== undefined) this.death = params.death;

        // Mental state determines collider type.
        if (this.mentalState === MentalState.Frazzled) this.colliderType = ColliderType.NPCFrazzledCo;
    }

    // An initializer that clones an existing NPC.
    cloneFrom(other: NonPlayer): void {
        this.colliderId = other.colliderId;
        this.pos = other.pos;
        this.facing = other.facing;
        this.stationeryCountdown = other.stationeryCountdown;
        this.suicideCountdown = other.suicideCountdown;
        this.hasReachedAirLockButton = other.hasReachedAirLockButton;
        this.contemplateDeathCountdown = other.contemplateDeathCountdown;
        this.readyToPushAirLockButton = other.readyToPushAirLockButton;
        this.isHeadingTowardAirLockDoom = other.isHeadingTowardAirLockDoom;
        this.moving = other.moving;
        this.isOffScreen = other.isOffScreen;
        this.biasDirection = other.biasDirection;
        this.timeOfLastReturnToGarden = other.timeOfLastReturnToGarden;
        this.mentalState = other.mentalState;
        this.gardenerAvoidanceCountdown = other.gardenerAvoidanceCountdown;
        this.hasCabinFever = other.hasCabinFever;
        this.colliderType = other.colliderType;
        this.id = other.id;
        this.invisible = other.invisible;
        this.death = other.death;
    }

    // Return the invisible rectangle that determines collision behaviour for the NPC.
    collisionRect(): Rect {
        // An off-screen NPC should have a far distant collision rect that won't interfere with anything.
        // A tiny little square at a very distant location unique to the NPC.
        if (this.isOffScreen) {
            let uniq = -1000 * (this.id + 1);
            return {
                a: new Coord(uniq, 0),
                b: new Coord(uniq + 2, 0),
            };
        }
        // Otherwise, use the proper collision rect.
        return {
            a: this.pos.plus(0, -ENTITY_RECT_HEIGHT),
            b: this.pos.plus(ENTITY_RECT_WIDTH, 0),
        };
    }

    // Override the paintable paint function
    paint(canvas: CanvasRenderingContext2D, state: IGlobalState): void {
        // An invisible NPC doesn't need to be painted.
        if (this.invisible) return;
        return this.paintAtPos(canvas, state, null);
    }

    // Paint the NPC on the canvas.
    paintAtPos(canvas: CanvasRenderingContext2D, state: IGlobalState, dialog: Coord | null): void {
        // Additional vertical displacement caused by mental state.
        let jitter: number;
        switch (this.mentalState) {
            case MentalState.Normal:
                jitter = 0;
                break;
            case MentalState.Frazzled:
            case MentalState.Scared:
                jitter = randomInt(-1, 1);
                break;
        }
        // The walking animation has 8 frames.
        let frame = this.currentSpriteFrame(state);
        let shift = this.computeShift(state);
        let newPos = this.pos.plus(shift.x, shift.y);
        newPos = newPos.plus(0, jitter);
        let flip = (this.facing === Direction.Left);
        newPos = (dialog != null) ? dialog : newPos;

        // Determine where, on the canvas, the NPC should be painted.
        let dest = flip
            ? new Coord((newPos.x * -1) - 14, newPos.y - 18)
            : new Coord(newPos.x - 3, newPos.y - 18);
        dest = dest.toIntegers();
        canvas.save();
        canvas.scale(flip ? -1 : 1, 1);
        
        // Paint gardener sprite for current frame.
        canvas.drawImage(
            this.currentWalkCycleImage(state),  // The sprite sheet image
            (frame * 96) + 40, 20,              // Top-left corner of frame in source
            48, 48,                             // Size of frame in source
            dest.x, dest.y,                     // Position of sprite on canvas
            48, 48);                            // Sprite size on canvas
    
        // Restore canvas transforms to normal.
        canvas.restore();

        // Extra debug displays.
        if (state.debugSettings.showCollisionRects) {
            outlineRect(canvas, shiftRect(this.collisionRect(), shift.x, shift.y), Colour.COLLISION_RECT);
        }
        if (state.debugSettings.showPositionRects) {
            outlineRect(canvas, shiftRect(positionRect(this), shift.x, shift.y), Colour.POSITION_RECT);
        }
    }

    // Get the walk cycle sprite sheet that currently applies for the NPC (depends on mental state).
    currentWalkCycleImage(state: IGlobalState): any {
        if (this.death != null){
            switch(this.death.cause) {
                case CausaMortis.Laceration: return state.npcImages.slainDeath;
                case CausaMortis.Asphyxiation: return state.npcImages.chokeDeath;
                case CausaMortis.Incineration: return state.skeleton;
            }
        }
        switch (this.mentalState) {
            case MentalState.Normal:    return state.npcImages.normalWalkCycle;
            case MentalState.Frazzled:  return state.npcImages.frazzledWalkCycle;
            case MentalState.Scared:    return state.npcImages.scaredWalkCycle;
        }
    }

    currentSpriteFrame(state: IGlobalState) : number {
        // Check if there is a death animation in progress.
        if (this.death != null){
            switch(this.death.cause){
                case CausaMortis.Laceration:
                    return Math.min(Math.floor((state.currentFrame - this.death.time) / 3), 14);
                case CausaMortis.Asphyxiation:
                    return Math.min(Math.floor((state.currentFrame - this.death.time) / 3), 13);
                case CausaMortis.Incineration:
                    // The walking animation has 20 frames. Stay on the initial skeleton frame for 10 frames,
                    let frameTicker = Math.max(state.currentFrame - state.gameoverFrame - 0, 0);
                    return Math.min(Math.floor(frameTicker / 2), 19);
            }   
        }
        // The walking animation has 8 frames.
        let frameCount = 8;
        let frame: number;
        switch (this.mentalState) {
            // A normal NPC moves at a normal walking pace.
            case MentalState.Normal:
            case MentalState.Scared:
                frame = this.moving ? Math.floor(state.currentFrame % (6 * frameCount) / 6) : 0;
                break;
            // A frazzled NPC moves at a frantic pace.
            case MentalState.Frazzled:
                frame = this.moving ? Math.floor(state.currentFrame % (3 * frameCount) / 3) : 0;
                break;
        }
        return frame;
    }

    // Compute a displacement that will place the NPC at the correct place on the canvas.
    computeShift(state: IGlobalState): Coord {
        return shiftForTile(this.closestTile(), state, computeBackgroundShift(state, false));
    }

    // Determine the grid tile that is the closest approximation to the NPC's position.
    closestTile(): Tile {
        return new Tile(
            Math.floor(this.pos.x / MAP_TILE_SIZE),
            Math.floor(this.pos.y / MAP_TILE_SIZE));
    }

    // Let the NPC move. Returns new updated version of the NPC.
    move(): NonPlayer {
        // An NPC that is "gone" off-screen doesn't need to move.
        if (this.isOffScreen) return this;
    
        let vPixelSpeed: number;
        let hPixelSpeed: number;
        switch (this.mentalState) {
            // A normal NPC moves at a slow speed.
            case MentalState.Normal:
            case MentalState.Scared:
                // NPCs walk faster when avoiding the gardener.
                let multiplier = (this.gardenerAvoidanceCountdown > 0) ? 1.5 : 1;
                vPixelSpeed = NPC_V_PIXEL_SPEED * multiplier;
                hPixelSpeed = NPC_H_PIXEL_SPEED * multiplier;
                break;
            // A frazzled NPC moves faster.
            case MentalState.Frazzled:
                vPixelSpeed = Math.floor(NPC_V_PIXEL_SPEED * 2.5);
                hPixelSpeed = Math.floor(NPC_H_PIXEL_SPEED * 2.5);
                break;
        }
        var delta = [0,0]
        switch (this.facing) {
            case Direction.Down:
            delta = [0, vPixelSpeed];
            break;
            case Direction.Up:
            delta = [0, -vPixelSpeed];
            break;
            case Direction.Left:
            delta = [-hPixelSpeed, 0];
            break;
            case Direction.Right:
            delta = [hPixelSpeed, 0];
             break;
        }
        // Add deltas to NPC position and keep it within the background rectangle.
        let newPos = new Coord(
            this.pos.x + delta[0],
            this.pos.y + delta[1]
        );
        //let newPos = new Coord(
        //    (this.pos.x + delta[0] + BACKGROUND_WIDTH) % BACKGROUND_WIDTH,
        //    (this.pos.y + delta[1] + BACKGROUND_HEIGHT) % BACKGROUND_HEIGHT);
        // Return a clone of this NPC, but with a the new position.
        return new NonPlayer({
            clone: this,
            pos: newPos,
            gardenerAvoidanceCountdown: Math.max(this.gardenerAvoidanceCountdown-1, 0),
        });
    }

    oxygenConsumption(): number {
        // On-screen NPCs in non-normal mental state consume non-normal amounts of oxygen.
        if (!this.isOffScreen) {
            if (this.mentalState == MentalState.Frazzled)   return 0.5;
            if (this.mentalState == MentalState.Scared)     return 2;
        }
        // An off-screen or normal NPC consumes oxygen at usual rate.
        return 1;
    }

    // Make a new version of the NPC that now begins avoiding the gardener.
    startAvoidingGardener(): NonPlayer {
        return new NonPlayer({
            clone: this,
            gardenerAvoidanceCountdown: 150,
            stationeryCountdown: 0,
        });
    }

    // Allow the NPC to change its mental state.
    maybeChangeMentalState(state: IGlobalState): NonPlayer {
        // An off-screen NPC does not change its mental state.
        if (this.isOffScreen) return this;
    
        let newMentalState: MentalState;
        let newSuicideCountdown: number             = this.suicideCountdown;
        let newContemplateDeathCountdown: number    = this.contemplateDeathCountdown;
        let newHasReachedAirLockButton: boolean     = this.hasReachedAirLockButton;
        let newReadyToPushAirLockButton: boolean    = this.readyToPushAirLockButton;
        let newHasCabinFever: boolean               = this.hasCabinFever;
        switch (this.mentalState) {
            // An NPC in normal mental state becomes scared by impending danger, or
            // randomly gets frazzled (cabin fever).
            case MentalState.Normal:
                if (dangerIsImpending(state)) newMentalState = MentalState.Scared;
                else if (((randomInt(0, 9999) / 10000) < PER_FRAME_CABIN_FEVER_PROBABILITY) && state.randomCabinFeverAllowed) {
                    // When an NPC first develops cabin fever, that's when the suicide countdown starts.
                    newHasCabinFever = true;
                    newMentalState = MentalState.Frazzled;
                    newSuicideCountdown = SUICIDAL_DELAY;
                }
                else newMentalState = MentalState.Normal;
                break;
            // A frazzled NPC will becomes scared by impending danger but reverts to frazzled afterwards.
            case MentalState.Frazzled:
                if (dangerIsImpending(state)) newMentalState = MentalState.Scared;
                else {
                    newMentalState = MentalState.Frazzled;
                    // If suicidal and just now reaching the air lock button, switch to death contemplation.
                    if ((this.suicideCountdown === 0) && (!this.hasReachedAirLockButton) && this.isCloseToAirLockButton(state)) {
                        newContemplateDeathCountdown = CONTEMPLATE_DEATH_DELAY;
                        newHasReachedAirLockButton = true;
                        console.log("Suicidal NPC has reached the air lock button");
                    // If death contemplation is done, the NPC is ready to push the air lock button.
                    } else if ((this.hasReachedAirLockButton) && (this.contemplateDeathCountdown === 0) && (!this.readyToPushAirLockButton)) {
                        newReadyToPushAirLockButton = true;
                        console.log("NPC is ready to push the button");
                    }
                }
                break;
            // A scared NPC stops being scared when the danger is gone.
            case MentalState.Scared:
                // Either remain scared, revert back to frazzled, or revert back to normal.
                if (dangerIsImpending(state)) newMentalState = MentalState.Scared;
                else if (this.hasCabinFever) newMentalState = MentalState.Frazzled; 
                else newMentalState = MentalState.Normal;
                break;
        }
        return new NonPlayer({
            clone: this,
            mentalState: newMentalState,
            suicideCountdown: newSuicideCountdown,
            contemplateDeathCountdown: newContemplateDeathCountdown,
            hasReachedAirLockButton: newHasReachedAirLockButton,
            readyToPushAirLockButton: newReadyToPushAirLockButton,
            hasCabinFever: newHasCabinFever,
        });
    }

    // Let frazzled NPC decrement suicide-related countdowns.
    decrementSuicideCountdowns(): NonPlayer {
        if (this.mentalState !== MentalState.Frazzled) return this;
        return new NonPlayer({
            clone: this,
            suicideCountdown: Math.max(this.suicideCountdown - 1, 0),
            contemplateDeathCountdown: Math.max(this.contemplateDeathCountdown - 1, 0),
        });
    }

    // Check whether suicidal NPC, when headed toward the air lock button, has reached it.
    isCloseToAirLockButton(state: IGlobalState): boolean {
        return rectanglesOverlap(this.collisionRect(), state.airlockButton.interactionRect());
    }

    // Begin the final phase of cabin fever where the NPC has opened the air lock and is headed towards it.
    headTowardAirLockDoom(): NonPlayer {
        return new NonPlayer({
            clone: this,
            isHeadingTowardAirLockDoom: true,
        });
    }

    // Bring an invisible off-screen NPC back to the garden.
    comeBackOnScreen(): NonPlayer {
        return new NonPlayer({
            clone: this,
            isOffScreen: false,
            invisible: false,
            biasDirection: (this.pos.x < 0) ? Direction.Right : Direction.Left,
            timeOfLastReturnToGarden: computeCurrentFrame(),
            stationaryCountdown: 0,
            moving: true,
        });
    }

    // Move NPC to "holding zone" i.e. off-screen and invisible.
    goOffScreen(): NonPlayer {
        console.log("NPC going off-screen, id:"+this.id);
        return new NonPlayer({
            clone: this,
            death: null,
            isOffScreen: true,
            invisible: true,
            mentalState: MentalState.Normal,
            hasCabinFever: false,
            pos: randomOffScreenPos(),
            stationaryCountdown: 0,
            gardenerAvoidanceCountdown: 0,
            suicideCountdown: 0,
            contemplateDeathCountdown: 0,
            moving: false,
            hasReachedAirLockButton: false,
            readyToPushAirLockButton: false,
            isHeadingTowardAirLockDoom: false,
        });
    }

    // Check whether the NPC has just wandered off screen very recently.
    // This is always false for a short time right after wandering on-screen.
    justWentOffScreen(): boolean {
        let f = computeCurrentFrame();
        // For five seconds, you can't wander off-screen if you just wandered on-screen.
        let timeSince = f - this.timeOfLastReturnToGarden;
        if (timeSince < (5 * FPS)) return false;
        // After five seconds, you're off-screen if the NPC image is fully outside the background.
        return (this.pos.x < (0 - ENTITY_RECT_WIDTH)) || (this.pos.x > BACKGROUND_WIDTH);
    }
}

// Check global state to see if there's currently an impending danger that would scare NPCs.
function dangerIsImpending(state: IGlobalState): boolean {
    return (
        // A present black hole is an impending danger, unless it has already blasted the ship.
        ((state.blackHole !== null) && ((computeCurrentFrame() - state.blackHole.startFrame) < (30 * FPS))) || 
        // A non-airtight air lock is an impending danger.
        (!state.airlock.isAirtight(state)));
}

export function updateNPCState(state: IGlobalState) : IGlobalState {
    let allColliders : Map<number, Collider> = state.colliderMap;
    // Allow NPCs to move and adjust their mental state.
    let newNPCs: NonPlayer[] = [];
    let atLeastOneNPCPushingAirLockButton: boolean = false;
    state.npcs.forEach(npc => {
        let newNPC: NonPlayer = npc;
        // If NPC is dead, check that the death animation is done.
        if (newNPC.death != null) {
            // If npc has been dead long enough, go offscreen. 
            if (state.currentFrame - newNPC.death.time >= RESPAWN_DELAY) 
                newNPC = newNPC.goOffScreen();
            newNPCs = [...newNPCs, newNPC];
            allColliders.set(newNPC.colliderId, newNPC);  
            return;
        }
        // With small probability, an off-screen NPC may come back.
        if (newNPC.isOffScreen && (randomInt(0, 9999) < 3)) newNPC = newNPC.comeBackOnScreen();

        // If the NPC has just wandered off-screen, go into the "holding zone".
        if (!newNPC.isOffScreen && newNPC.justWentOffScreen()) newNPC = newNPC.goOffScreen();
    
        // Get a new version of the npc - one that has taken its next step.
        let postMoveNPC = moveNPC(state, newNPC);

        // Check if it now collides with anything.
        let collided = collisionDetected(state, allColliders, postMoveNPC);

        // If the NPC is colliding, revert to pre-move state.
        newNPC = collided ? newNPC : postMoveNPC;

        // Allow the NPC to consider adopting a new movement.
        // Force it to do so if it collided.
        newNPC = considerNewNPCMovement(state, newNPC, collided);

        // Allow the NPC to change its mental state.
        newNPC = newNPC.maybeChangeMentalState(state);

        // Decrement the suicide countdowns (only frazzled NPCs will do this).
        newNPC = newNPC.decrementSuicideCountdowns();

        // If NPC is trying to push air lock button, and is close enough to do so, push it and head toward the air lock.
        if (newNPC.readyToPushAirLockButton
            && rectanglesOverlap(newNPC.collisionRect(), state.airlockButton.interactionRect())
            && state.airlock.isAirtight(state)) {
            newNPC = newNPC.headTowardAirLockDoom();
            atLeastOneNPCPushingAirLockButton = true;
        }
    
        // Update the NPC array. Update the colliders so that subsequent NPCs will
        // check collisions against up-to-date locations of their peers.
        newNPCs = [...newNPCs, newNPC];
        allColliders.set(newNPC.colliderId, newNPC);
    });

    let newState = {
        ...state,
        npcs: newNPCs,
        colliderMap: allColliders,
    };
    if (atLeastOneNPCPushingAirLockButton) return activateAirlockButton(newState);
    return newState;
}

// Allow an NPC to randomly choose a new movement. If the NPC is not currently moving, wait for
// its stationaryCountdown to reach zero before adopting a new movement.
function considerNewNPCMovement(state: IGlobalState, npc: NonPlayer, forced: boolean): NonPlayer {
    // An off-screen NPC does not bother with this.
    if (npc.isOffScreen) return npc;

    // Whether or not the NPC will adopt a new movement.
    let change = false;
  
    // If NPC is currently stationery, adopt new movement when the countdown reaches zero,
    // otherwise adopt new movement with some small probability.
    if (!npc.moving) {
      if (npc.stationeryCountdown === 0) change = true;
    } else {
      switch (npc.mentalState) {
        // A normal NPC changes direction infrequently.
        case MentalState.Normal:
          // If an NPC is avoiding the gardener and finds itself facing the gardener, then
          // it's time to force a direction change.
          if (npc.gardenerAvoidanceCountdown > 0) {
            let badDir = directionOfFirstRelativeToSecond(state.gardener, npc);
            if (badDir === npc.facing) change = true;
            else change = (Math.random() < 0.02);
          } else change = (Math.random() < 0.02);
          break;
        // A frazzled NPC changes direction frequently.
        case MentalState.Frazzled:
          if (npc.isHeadingTowardAirLockDoom) {
            let deathDir = directionOfFirstRelativeToSecond(state.airlock.centre(), npc);
            if (deathDir === npc.facing) change = false;
            else change = true;
          } else change = (Math.random() < 0.6);
          break;
        // A scared NPC's behaviour is between the two above.
        case MentalState.Scared:
          // If an NPC is avoiding the gardener and finds itself facing the gardener, then
          // it's time to force a direction change.
          if (npc.gardenerAvoidanceCountdown > 0) {
            let badDir = directionOfFirstRelativeToSecond(state.gardener, npc);
            if (badDir === npc.facing) change = true;
            else change = (Math.random() < 0.2);
          } else change = (Math.random() < 0.2);
          break;
      }
    }
    change = change || forced;
  
    // If no new movement is being adopted, return NPC unchanged.
    if (!change) return npc;
  
    // New movement is to be adopted. Choose new direction *or* choose to remain stationery for a while.
    let choice: number;
    switch (npc.mentalState) {
      // A normal NPC stands still often.
      case MentalState.Normal:
        // If NPC is currently avoiding the gardener, movement choices are somewhat limited.
        if (npc.gardenerAvoidanceCountdown > 0) choice = gardenerAvoidingDirectionChoice(state, npc);
        else {
            let choices: number[] = [];
            for (let i = 0; i < ALL_DIRECTIONS.length; i++) {
                choices = [...choices, i];
                // The bias direction appears extra times in the choice list to make it a more likely choice.
                if (ALL_DIRECTIONS[i] === npc.biasDirection) choices = [...choices, i, i, i, i];
            }
            // Standing still is also in the list (value is 4).
            choices = [...choices, 4];
            choice = choices[randomInt(0, choices.length - 1)];
        }
        break;
      // A frazzled NPC doesn't stand still very often. It also ignores bias direction.
      case MentalState.Frazzled:
        // If suicidal, head toward the air lock button.
        if (npc.suicideCountdown === 0) choice = suicidalDirectionChoice(state, npc);
        else {
            // If non (yet) suicidal, just moved in frazzled manner.
            choice = randomInt(0, 4 + (4 * 5));
            if (choice > 4) choice = (choice - 5) % 4;
        }
        break;
      // A scared NPC is in between the two above. It also ignores bias direction.
      case MentalState.Scared:
        // If NPC is currently avoiding the gardener, movement choices are somewhat limited.
        if (npc.gardenerAvoidanceCountdown > 0) choice = gardenerAvoidingDirectionChoice(state, npc);
        else choice = randomInt(0, 4 + (2 * 5));
        if (choice > 4) choice = (choice - 5) % 4;
        break;
    }
    if (choice === 4) {
      let countdown: number;
      switch (npc.mentalState) {
        // A normal NPC will stand still for a little while.
        case MentalState.Normal:
          countdown = 30 + randomInt(0, 200);
          break;
        // A frazzled NPC will not stand still for long.
        case MentalState.Frazzled:
          countdown = 1 + randomInt(0, 4);
          break;
        // A scared NPC will be in between the two above.
        case MentalState.Scared:
            countdown = 15 + randomInt(0, 100);
            break;
      }
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
  
  // Choose a direction (an index into ALL_DIRECTIONS) that would move the NPC away from the gardener.
  function gardenerAvoidingDirectionChoice(state: IGlobalState, npc: NonPlayer): number {
    // Compute the one forbidden direction.
    let badDir = directionOfFirstRelativeToSecond(state.gardener, npc);
    // Gather up all the indices that don't correspond to that direction.
    let indices: number[] = [];
    for (let i = 0; i < 4; i++) {
      if (ALL_DIRECTIONS[i] !== badDir) {
        indices = [...indices, i];
      }
    }
    // Return one of those indices.
    let j = randomInt(0, 2);
    return indices[j];
  }

  // Choose a direction (an index into ALL_DIRECTIONS) that would move the NPC closer to the air lock button.
  function suicidalDirectionChoice(state: IGlobalState, npc: NonPlayer): number {
    // Compute the desired direction.
    let buttonDir = directionOfFirstRelativeToSecond(state.airlockButton, npc);
    // All directions, but with the desired one replacing its opposite (i.e. it's present twice), and
    // the other two directions represented twice times each. 
    let indices: number[] = [];
    let oppositeDir = oppositeDirection(buttonDir);
    let buttonDirIndex: number = 0;
    let oppositeDirIndex: number = 0;
    let otherDirIndex1: number = -1;
    let otherDirIndex2: number = -1;
    for (let i = 0; i < 4; i++) {
        indices = [...indices, i];
        if (ALL_DIRECTIONS[i] === buttonDir) buttonDirIndex = i;
        else if (ALL_DIRECTIONS[i] === oppositeDir) oppositeDirIndex = i;
        else if (otherDirIndex1 === -1) otherDirIndex1 = i;
        else otherDirIndex2 = i;
    }
    indices[oppositeDirIndex] = buttonDirIndex;
    indices = [...indices, otherDirIndex1, otherDirIndex2];
    return indices[randomInt(0, 5)];
  }
  
  // "Move" the NPC. In quotes because NPCs sometimes stand still and that's handled here too.
  function moveNPC(state: IGlobalState, npc: NonPlayer): NonPlayer {
    // An off-screen NPC does not bother moving.
    if (npc.isOffScreen) return npc;

    if (!npc.moving) {
      return new NonPlayer({
        clone: npc,
        stationeryCountdown: Math.max(0, npc.stationeryCountdown - 1),
      });
    }
    return npc.move();
  }

  // Choose a random off-screen position for an NPC so it can enter the garden area from off-screen.
  export function randomOffScreenPos(): Coord {
    let top = 195;
    let bot = BACKGROUND_HEIGHT - 35;
    let rangeSize = bot - top - (4 * ENTITY_RECT_HEIGHT);
    let y = top + (2 * ENTITY_RECT_HEIGHT) + randomInt(0, rangeSize);
    if (randomInt(0, 99) < 50) return new Coord(-ENTITY_RECT_WIDTH - 2, y);
    return new Coord(BACKGROUND_WIDTH + 2, y);
  }
