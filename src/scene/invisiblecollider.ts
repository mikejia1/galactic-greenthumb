import { Collider, ColliderType } from '../store/classes';
import { Rect, rectToString } from '../utils';

// An invisible object that exists just to collide.
export class InvisibleCollider implements Collider {
    rect: Rect;
    colliderId: number;
    colliderType: ColliderType;
  
    constructor(colliderId: number, rect: Rect, colliderType: ColliderType) {
        this.colliderId = colliderId;
        this.rect = rect;
        this.colliderType = colliderType;
    }
  
    collisionRect(): Rect {
        return this.rect;
    }

    toString(): String {
        return rectToString(this.rect);
    }
}
