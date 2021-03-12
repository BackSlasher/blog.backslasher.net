---
title: Populating a NetworkX graph with a scanner
categories:
- FOSS
tags:
  - Scripts
  - Python
  - Graphing
---

I had a graph living outside Pythonland (a commit tree with dependencies) and wanted to do graphy things to it. To do that, I first had to put the data into a NetworkX graph.
I wrote this code bit to discover a graph-like structure and put into a NetworkX (or similar enough) object.
It's basically a BFS scan, that delegates the actual node-to-edge discovery to a callable:

```python
#!/usr/bin/env python3
def populate_graph_from_node(G, first_node, edge_extractor):
    visited=set()
    next_nodes=set([first_node])
    while(next_nodes):
        new_edges=[]
        for node in next_nodes:
            new_edges += edge_extractor(node)
        G.add_edges_from(new_edges)
        visited.update(next_nodes)
        next_nodes = {edge[1] for edge in new_edges} - visited
```
The `edge_extractor` callable should accept a node, and return edge-like tuples (either `(source, dest)` or `(source, dest, data_dict)`).  
I do not bother to validate that the source node in the edges is indeed the node we're currently scanning.  
An example call could be something like this:
```python
#!/usr/bin/env python3
edge_dict = {
  1: [2],
  2: [3,4],
  4: [3],
}

import networkx as nx
graph = nx.DiGraph()
populate_graph_from_node(
  graph, 1,
  lambda node: [
    (node, dest) for dest in
    edge_dict.get(node, [])
  ]
)

print(graph.edges())
# [(1, 2), (2, 3), (2, 4), (4, 3)]
```
