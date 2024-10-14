def is_safe(v, pos, path, graph):
    if graph[path[pos - 1]][v] == 0:  # Check if vertex is adjacent
        return False
    if v in path:  # Check if vertex is already included in the path
        return False
    return True

def hamiltonian_cycle_util(graph, path, pos):
    if pos == len(graph):  # All vertices are in the path
        if graph[path[pos - 1]][path[0]] == 1:  # Check if there is an edge from the last to the first
            return True
        else:
            return False

    # Try different vertices as candidates for the Hamiltonian cycle
    for v in range(1, len(graph)):
        if is_safe(v, pos, path, graph):
            path[pos] = v
            if hamiltonian_cycle_util(graph, path, pos + 1):
                return True
            path[pos] = -1  # Backtrack if adding vertex v doesn't result in a solution
    
    return False

def has_hamiltonian_cycle(graph):
    path = [-1] * len(graph)
    path[0] = 0  # Start the path from the first vertex
    if hamiltonian_cycle_util(graph, path, 1):
        return True
    return False
