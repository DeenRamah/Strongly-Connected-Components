class TarjanGraph {
    private adjList: Map<number, number[]> = new Map();
    private index: number = 0;
    private indices: Map<number, number> = new Map();
    private lowLink: Map<number, number> = new Map();
    private stack: number[] = [];
    private onStack: Set<number> = new Set();
    private sccs: number[][] = [];

    addEdge(v: number, w: number) {
        if (!this.adjList.has(v)) this.adjList.set(v, []);
        this.adjList.get(v)!.push(w);
    }

    private tarjan(v: number) {
        this.indices.set(v, this.index);
        this.lowLink.set(v, this.index);
        this.index++;
        this.stack.push(v);
        this.onStack.add(v);

        const neighbors = this.adjList.get(v) || [];
        for (const w of neighbors) {
            if (!this.indices.has(w)) {
                this.tarjan(w);
                this.lowLink.set(v, Math.min(this.lowLink.get(v)!, this.lowLink.get(w)!));
            } else if (this.onStack.has(w)) {
                this.lowLink.set(v, Math.min(this.lowLink.get(v)!, this.indices.get(w)!));
            }
        }

        if (this.lowLink.get(v) === this.indices.get(v)) {
            const scc: number[] = [];
            let w: number;
            do {
                w = this.stack.pop()!;
                this.onStack.delete(w);
                scc.push(w);
            } while (w !== v);
            this.sccs.push(scc);
        }
    }

    tarjanSCC(): number[][] {
        for (const vertex of this.adjList.keys()) {
            if (!this.indices.has(vertex)) {
                this.tarjan(vertex);
            }
        }
        return this.sccs;
    }
}

// Example usage
const tg = new TarjanGraph();
tg.addEdge(1, 2);
tg.addEdge(2, 3);
tg.addEdge(3, 1);
tg.addEdge(2, 4);
tg.addEdge(4, 5);
tg.addEdge(5, 4);

console.log(tg.tarjanSCC());
