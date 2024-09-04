class GraphKosaraju {
    private adjList: Map<number, number[]> = new Map();
    private transposeAdjList: Map<number, number[]> = new Map();
    private visited: Set<number> = new Set();
    private stack: number[] = [];
    
    addEdge(v: number, w: number) {
        if (!this.adjList.has(v)) this.adjList.set(v, []);
        if (!this.adjList.has(w)) this.adjList.set(w, []);
        this.adjList.get(v)!.push(w);

        if (!this.transposeAdjList.has(w)) this.transposeAdjList.set(w, []);
        if (!this.transposeAdjList.has(v)) this.transposeAdjList.set(v, []);
        this.transposeAdjList.get(w)!.push(v);
    }

    private dfs(v: number) {
        this.visited.add(v);
        const neighbors = this.adjList.get(v) || [];
        for (const neighbor of neighbors) {
            if (!this.visited.has(neighbor)) {
                this.dfs(neighbor);
            }
        }
        this.stack.push(v);
    }

    private reverseDfs(v: number, component: number[]) {
        this.visited.add(v);
        component.push(v);
        const neighbors = this.transposeAdjList.get(v) || [];
        for (const neighbor of neighbors) {
            if (!this.visited.has(neighbor)) {
                this.reverseDfs(neighbor, component);
            }
        }
    }

    kosarajuSCC(): number[][] {
        // 1. Perform DFS to get finishing times
        this.visited.clear();
        for (const vertex of this.adjList.keys()) {
            if (!this.visited.has(vertex)) {
                this.dfs(vertex);
            }
        }

        // 2. Transpose is already built

        // 3. Perform DFS on the transposed graph in the order of decreasing finish times
        this.visited.clear();
        const sccs: number[][] = [];
        
        while (this.stack.length > 0) {
            const v = this.stack.pop()!;
            if (!this.visited.has(v)) {
                const component: number[] = [];
                this.reverseDfs(v, component);
                sccs.push(component);
            }
        }

        return sccs;
    }
}

// Example usage
const graphKosaraju = new GraphKosaraju();
graphKosaraju.addEdge(1, 2);
graphKosaraju.addEdge(2, 3);
graphKosaraju.addEdge(3, 1);
graphKosaraju.addEdge(2, 4);
graphKosaraju.addEdge(4, 5);
graphKosaraju.addEdge(5, 4);

console.log("Kosaraju's SCCs:", graphKosaraju.kosarajuSCC());
