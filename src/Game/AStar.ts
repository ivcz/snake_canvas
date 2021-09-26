import { Main as Game } from './Main';

import Coord from '@/Utils/Coord';
import PathNode from '@/Utils/PathNode';
import PathNodeHeap from '@/Utils/PathNodeHeap';
import { CoordStorage, NodeStorage, IndiciesStorage, NeighborStorage } from '@/Utils/Storages';

export default class AStar {

    protected path: PathNode[] = [];
    protected nodeStorage: NodeStorage;
    protected coordStorage: CoordStorage;
    private goal: Coord = new Coord(0, 0);
    private game: Game;
    private cacheCounter: number = 0;
    private maxCache: number = 1000;

    private vectors = [[0, 1], [1, 0], [-1, 0], [0, -1]];
    private closedKeys: IndiciesStorage;
    private openKeys: IndiciesStorage;
    private neighborStorage: NeighborStorage;
    
    constructor(game: Game) {
        this.game = game;
        this.nodeStorage = new NodeStorage(this.game.field.gridCount, this.game.field.gridCount);
        this.coordStorage = new CoordStorage(this.game.field.gridCount, this.game.field.gridCount);
        this.closedKeys = new IndiciesStorage(this.game.field.gridCount, this.game.field.gridCount);
        this.openKeys = new IndiciesStorage(this.game.field.gridCount, this.game.field.gridCount);
        this.neighborStorage = new NeighborStorage(this.game.field.gridCount, this.game.field.gridCount);
        this.maxCache = Math.floor(this.game.field.gridCount / 4);
    }

    private prevPath(): boolean {
        const pathLength = this.path.length - 1;
        if (this.goal.x === this.path[pathLength].x && this.goal.y === this.path[pathLength].y) {
            for (let i = 0; i <= pathLength; ++i) {
                if (this.checkCollision(this.coordStorage.get(this.path[i].x, this.path[i].y))) return false;
            }
            return true;
        }
        return false;
    }

    public nextCoord(): Coord | undefined {
        if (/*!this.goalHasExit() ||*/ !this.goalIsReachable()) {
            const path = this.reconstructPath(this.findLongestPath());
            return path[0];
            // throw 'unreachable';
        } else {
            if (this.path.length > 0 && this.cacheCounter <= this.maxCache && this.prevPath()) {
                this.cacheCounter += 1;
                return this.path.shift()?.getCoord();
            } else {
                this.path = [];
                this.cacheCounter = 0;
            }
            try {
                this.path = this.reconstructPath(this.findPath());
                return this.path.shift()?.getCoord();
            } catch (e) {
                console.log('err', e);
                // alert(e);
                throw e;
            }
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

    private goalHasExit(): boolean {
        this.getGoalCoord();
        return this.getNeighbors(this.nodeStorage.get(this.goal.x, this.goal.y)).length > 1;
    }

    private goalIsReachable(): boolean {
        this.getGoalCoord();
        const queue: PathNode[] = [];
        this.closedKeys.clean();
        queue.push(this.nodeStorage.get(this.goal.x, this.goal.y));
        let current = queue[0];
        // let counter = 0;
        while (queue.length > 0) {
            // if (counter > 100000) throw 'recursion';
            // counter += 1;
            current = queue[0];
            queue.shift();
            for (const neighbor of this.neighborStorage.get(current.x, current.y)) {
                if (neighbor.x === this.game.snake.headX && neighbor.y === this.game.snake.headY) return true;
                if (!this.closedKeys.has(neighbor.x, neighbor.y)
                    && !this.checkCollision(this.coordStorage.get(neighbor.x, neighbor.y))
                ) {
                    this.closedKeys.add(neighbor.x, neighbor.y);
                    queue.push(neighbor);
                }
            }
        }
        return false;
    }

    private findLongestPath(): PathNode {
        const start = new PathNode(
            this.game.snake.headX,
            this.game.snake.headY
        );
        let open: PathNodeHeap = new PathNodeHeap([start], (el1: PathNode, el2: PathNode) => {
            if (el1.gScore > el2.gScore) return -1;
            if (el1.gScore < el2.gScore) return 1;
            return 0;
        });
        // this.closedKeys.clean();
        this.openKeys.clean();
        let current = open.first;
        while (open.size > 0) {
            current = open.pop();
            this.closedKeys.add(current.x, current.y);
            this.openKeys.add(current.x, current.y);
            for (let neighbor of this.getNeighbors(current)) {
                // if (!this.openKeys.has(neighbor.x, neighbor.y) && !this.closedKeys.has(neighbor.x, neighbor.y)) {
                if (!this.openKeys.has(neighbor.x, neighbor.y)) {
                    const gCost = this.countDistance(start, neighbor);
                    neighbor.prev = current;
                    neighbor.gScore = gCost;
                    this.openKeys.add(neighbor.x, neighbor.y);
                    open.add(neighbor);
                }
            }
        }
        return current;
    }

    private findPath(): PathNode {
        const start = new PathNode(
            this.game.snake.headX,
            this.game.snake.headY,
            this.countDistance(
                this.coordStorage.get(this.game.snake.headX, this.game.snake.headY),
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
        this.closedKeys.clean();
        this.openKeys.clean();
        let current = open.first;
        while (open.size > 0 && current) {
            current = open.pop();
            if (current.x === this.goal.x && current.y === this.goal.y) return current;
            this.closedKeys.add(current.x, current.y);
            this.openKeys.add(current.x, current.y);
            for (let neighbor of this.getNeighbors(current)) {
                if (!this.openKeys.has(neighbor.x, neighbor.y) && !this.closedKeys.has(neighbor.x, neighbor.y)) {
                    const gCost = this.countDistance(start, neighbor);
                    const fCost = this.countDistance(neighbor, this.goal) + gCost;
                    neighbor.prev = current;
                    neighbor.gScore = gCost;
                    neighbor.fScore = fCost;
                    this.openKeys.add(neighbor.x, neighbor.y);
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
        const res: PathNode[] = [];
        for (const neighbor of this.neighborStorage.get(coord.x, coord.y)) {
            if (!this.checkCollision(neighbor)) res.push(neighbor);
        }
        return res;
    }

    private getGoalCoord(): Coord {
        this.goal = this.coordStorage.get(this.game.apple.x1, this.game.apple.y1);
        return this.goal;
    }

}
