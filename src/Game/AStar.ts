import { Main as Game } from './Main';
import Apple from './Apple';
import Field from './Field';
import Snake from './Snake';

import Coord from '@/Utils/Coord';
import Heap from '@/Utils/Heap';
import Direction from '@/Utils/Direction';

class PathNode extends Coord {
    public gScore: number;
    public fScore: number;
    public prev?: PathNode;

    constructor(x: number, y: number, fScore: number = 0, gScore: number = 0, prev?: PathNode) {
        super(x, y);
        this.fScore = fScore;
        this.gScore = gScore;
        this.prev = prev;
    }
}

class NodeHeap extends Heap<PathNode> {

    protected keys: Set<string> = new Set();

    constructor(items: Array<PathNode>, compare: (i1: PathNode, i2: PathNode) => number) {
        super(items, compare);
    }

    public add(item: PathNode): void {
        this.items.push(item);
        this.keys.add(`${item.x}.${item.y}`);
        this.sortUp(this.size - 1);
    }

    public has(index: string): boolean {
        return this.keys.has(index);
    }

    public pop(): PathNode {
        const res = this.items[0];
        this.swap(0, this.size - 1);
        this.items.pop();
        this.keys.delete(`${res.x}.${res.y}`);
        if (this.size > 0) this.sortDown(0);
        return res;
    }

}

export default class AStar {

    protected path: PathNode[] = [];
    private snake: Snake;
    private field: Field;
    private apple: Apple;
    private goal: Coord;
    private game: Game;

    private vectors = [[0, 1], [1, 0], [-1, 0], [0, -1]];
    
    constructor(game: Game) {
        this.game = game;
        this.snake = this.game.snake;
        this.field = this.game.field;
        this.apple = this.game.apple;
        this.goal = this.getGoalCoord();
    }

    public update(game: Game) {
        this.game = game;
        this.snake = this.game.snake;
        this.field = this.game.field;
        this.apple = this.game.apple;
        this.goal = this.getGoalCoord();
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

    public nextCoord(): Coord {
        if (this.path.length > 0 && this.prevPath()) {
            const newCoord = new Coord(this.path[0].x, this.path[0].y);
            this.path.shift();
            return newCoord;
        }
        try {
            const path = this.reconstructPath(this.findPath());
            this.path = path;
            const newCoord = new Coord(path[0].x, path[0].y);
            this.path.shift();
            return newCoord;
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
            this.snake.headX,
            this.snake.headY,
            this.countDistance(
                new Coord(this.snake.headX, this.snake.headY),
                this.getGoalCoord()
            )
        );
        let open: NodeHeap = new NodeHeap([start], (el1: PathNode, el2: PathNode) => {
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
            if (current.x >= this.apple.x1 
                && current.x <= this.apple.x2
                && current.y >= this.apple.y1
                && current.y <= this.apple.y2
            ) return current;
            closedKeys.add(`${current.x}.${current.y}`);
            for (let neighbor of this.getNeighbors(current)) {
                if (!open.has(`${neighbor.x}.${neighbor.y}`) && !closedKeys.has(`${neighbor.x}.${neighbor.y}`)) {
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
        if (coord.x >= this.field.gridCount) return true;
        if (coord.x < 0) return true;
        if (coord.y >= this.field.gridCount) return true;
        if (coord.y < 0) return true;
        return this.snake.has(`${coord.x}.${coord.y}`);
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
        const appleXCenter = Math.ceil((this.apple.x2 + this.apple.x1) / 2);
        const appleYCenter = Math.ceil((this.apple.y2 + this.apple.y1) / 2);
        this.goal = new Coord(appleXCenter, appleYCenter);
        return this.goal;
    }

}
