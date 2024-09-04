class Graph {
    private adjList: Map<number, number[]> = new Map();
    private transposeAdjList: Map<number, number[]> = new Map();

    addEdge(v: number, w: number) {
        if (!this.adjList.has(v)) this.adjList.set(v, []);
        if (!this.adjList.has(w)) this.adjList.set(w, []);
        this.adjList.get(v)!.push(w);

        if (!this.transposeAdjList.has(w)) this.transposeAdjList.set(w, []);
        if (!this.transposeAdjList.has(v)) this.transposeAdjList.set(v, []);
        this.transposeAdjList.get(w)!.push(v);
    }

    private dfs(v: number, visited: Set<number>, stack: number[]) {
        visited.add(v);
        const neighbors = this.adjList.get(v) || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                this.dfs(neighbor, visited, stack);
            }
        }
        stack.push(v);
    }

    private reverseDfs(v: number, visited: Set<number>, component: number[]) {
        visited.add(v);
        component.push(v);
        const neighbors = this.transposeAdjList.get(v) || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                this.reverseDfs(neighbor, visited, component);
            }
        }
    }

    kosarajuSCC(): number[][] {
        const stack: number[] = [];
        const visited = new Set<number>();

        // Step 1: Fill vertices in stack according to their finishing times
        for (const vertex of this.adjList.keys()) {
            if (!visited.has(vertex)) {
                this.dfs(vertex, visited, stack);
            }
        }

        // Step 2: Reverse graph (transposeAdjList) is already maintained

        // Step 3: Process all vertices in order defined by stack
        const sccs: number[][] = [];
        const visitedReversed = new Set<number>();

        while (stack.length > 0) {
            const v = stack.pop()!;
            if (!visitedReversed.has(v)) {
                const component: number[] = [];
                this.reverseDfs(v, visitedReversed, component);
                sccs.push(component);
            }
        }

        return sccs;
    }
}

// Example usage
const g = new Graph();
g.addEdge(1, 2);
g.addEdge(2, 3);
g.addEdge(3, 1);
g.addEdge(2, 4);
g.addEdge(4, 5);
g.addEdge(5, 4);

console.log(g.kosarajuSCC());
