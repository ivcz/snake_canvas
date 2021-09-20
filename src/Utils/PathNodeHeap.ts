import Heap from './Heap';
import PathNode from './PathNode';

export default class PathNodeHeap extends Heap<PathNode> {

    constructor(items: Array<PathNode>, compare: (i1: PathNode, i2: PathNode) => number) {
        super(items, compare);
    }

    public add(item: PathNode): void {
        this.items.push(item);
        this.sortUp(this.size - 1);
    }

    public has(x: number, y: number): boolean {
        for (const node of this.items) {
            if (node.x === x && node.y === y) return true;
        }
        return false;
    }

    public pop(): PathNode {
        const res = this.items[0];
        this.swap(0, this.size - 1);
        this.items.pop();
        if (this.size > 0) this.sortDown(0);
        return res;
    }

}
