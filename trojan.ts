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
const tarjanGraph = new TarjanGraph();
tarjanGraph.addEdge(1, 2);
tarjanGraph.addEdge(2, 3);
tarjanGraph.addEdge(3, 1);
tarjanGraph.addEdge(2, 4);
tarjanGraph.addEdge(4, 5);
tarjanGraph.addEdge(5, 4);

console.log("Tarjan's SCCs:", tarjanGraph.tarjanSCC());
