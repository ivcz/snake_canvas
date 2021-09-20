import { Main as Game } from './Main';
import Apple from './Apple';
import Field from './Field';
import Snake from './Snake';

import Coord from '@/Utils/Coord';
import PathNode from '@/Utils/PathNode';
import PathNodeHeap from '@/Utils/PathNodeHeap';
import Direction from '@/Utils/Direction';

export default class AStar {

    protected path: PathNode[] = [];
    // private snake: Snake;
    // private field: Field;
    // private apple: Apple;
    private goal: Coord = new Coord(0, 0);
    private game: Game;
    private cacheCounter: number = 0;
    private maxCache: number = 1000;

    private vectors = [[0, 1], [1, 0], [-1, 0], [0, -1]];
    
    constructor(game: Game) {
        this.game = game;
        this.maxCache = Math.floor(this.game.field.gridCount / 4);
    }

    private prevPath(): boolean {
        const pathLength = this.path.length - 1;
        if (this.goal.x === this.path[pathLength].x && this.goal.y === this.path[pathLength].y) {
            for (let i = 0; i <= pathLength; ++i) {
                if (this.checkCollision(new Coord(this.path[i].x, this.path[i].y))) return false;
            }
            return true;
        }
        return false;
    }

    public nextCoord(): Coord | undefined {
        if (this.path.length > 0 && this.cacheCounter <= this.maxCache && this.prevPath()) {
            this.cacheCounter += 1;
            return this.path.shift()?.getCoord();
        }
        try {
            this.cacheCounter = 0;
            this.path = this.reconstructPath(this.findPath());
            return this.path.shift()?.getCoord();
        } catch (e) {
            console.log('err', e);
            // alert(e);
            throw e;
        }
    }

    private reconstructPath(path: PathNode): PathNode[] {
        let node = path;
        let res: PathNode[] = [];
        while (node.prev) {
            res.unshift(node);
            node = node.prev;
        }
        return res;
    }

    private findPath(): PathNode {
        const start = new PathNode(
            this.game.snake.headX,
            this.game.snake.headY,
            this.countDistance(
                new Coord(this.game.snake.headX, this.game.snake.headY),
                this.getGoalCoord()
            )
        );
        let open: PathNodeHeap = new PathNodeHeap([start], (el1: PathNode, el2: PathNode) => {
            if (el1.fScore < el2.fScore) return -1;
            if (el1.fScore > el2.fScore) return 1;
            if (el1.gScore < el2.gScore) return -1;
            if (el1.gScore > el2.gScore) return 1;
            return 0;
        });
        let closedKeys: Set<string> = new Set();
        let current = open.first;
        while (open.size > 0 && current) {
            current = open.pop();
            if (current.x >= this.game.apple.x1 
                && current.x <= this.game.apple.x2
                && current.y >= this.game.apple.y1
                && current.y <= this.game.apple.y2
            ) return current;
            closedKeys.add(`${current.x}.${current.y}`);
            for (let neighbor of this.getNeighbors(current)) {
                if (!open.has(neighbor.x, neighbor.y) && !closedKeys.has(`${neighbor.x}.${neighbor.y}`)) {
                    const gCost = this.countDistance(start, neighbor);
                    const fCost = this.countDistance(neighbor, this.goal) + gCost;
                    neighbor.prev = current;
                    neighbor.gScore = gCost;
                    neighbor.fScore = fCost;
                    open.add(neighbor);
                }
            }
        }
        throw 'failure';
    }

    private checkCollision(coord: Coord): boolean {
        if (coord.x >= this.game.field.gridCount) return true;
        if (coord.x < 0) return true;
        if (coord.y >= this.game.field.gridCount) return true;
        if (coord.y < 0) return true;
        return this.game.snake.has(coord.x, coord.y);
    }

    private countDistance(c1: Coord, c2: Coord): number {
        /* vector */
        // const xDiff = c1.x - c2.x;
        // const yDiff = c1.y - c2.y;
        // return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
        /* manhattan */
        return Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y);
    }

    private getNeighbors(coord: PathNode): PathNode[] {
        let res: PathNode[] = [];
        for (const vector of this.vectors) {
            const newCoord = new PathNode(
                coord.x + vector[0],
                coord.y + vector[1]
            );
            if (!this.checkCollision(newCoord)) res.push(newCoord);
        }
        return res;
    }

    private getGoalCoord(): Coord {
        const appleXCenter = Math.ceil((this.game.apple.x2 + this.game.apple.x1) / 2);
        const appleYCenter = Math.ceil((this.game.apple.y2 + this.game.apple.y1) / 2);
        this.goal = new Coord(appleXCenter, appleYCenter);
        return this.goal;
    }

}
