export default class Heap<T> {

    protected items: Array<T> = [];
    public compare: ((i1: T, i2: T) => number);

    constructor(items: Array<T>, compare: (i1: T, i2: T) => number) {
        this.items = items;
        this.compare = compare;
        // this.sortUp(this.size - 1);
    }

    public get first(): T {
        return this.items[0];
    }

    public add(item: T): void {
        this.items.push(item);
        this.sortUp(this.size - 1);
    }

    public pop(): T {
        const res = this.items[0];
        this.items.pop();
        this.swap(0, this.size - 1);
        this.sortDown(0);
        return res;
    }

    public get size(): number {
        return this.items.length;
    }

    protected sortDown(i: number): void {
        const left = this.left(i);
        const right = this.right(i);
        let min = i;
        if (right < this.size) {
            // if (this.items[right] && this.items[left])
                min = this.compare(this.items[left], this.items[right]) === -1 ? left : right;
        } else if (left < this.size) {
            min = left;
        }
        if (this.items[i]) {
            if (this.compare(this.items[i], this.items[min]) === 1) {
                this.swap(i, min);
                this.sortDown(min);
            }
        }
    }

    protected sortUp(i: number): void {
        const parent = this.parent(i);
        if (this.compare(this.items[i], this.items[parent]) === -1) {
            this.swap(i, parent);
            this.sortUp(parent);
        }
    }

    protected swap(i1: number, i2: number): void {
        const temp = this.items[i1];
        this.items[i1] = this.items[i2];
        this.items[i2] = temp;
    }

    protected left(i: number): number {
        return 2 * i + 1;
    }

    protected right(i: number): number {
        return 2 * i + 2;
    }

    protected parent(i: number): number {
        return Math.max(0, Math.ceil(i / 2) - 1);
    }

}
