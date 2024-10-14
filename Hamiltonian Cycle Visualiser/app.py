from flask import Flask, render_template, request, jsonify
from hamiltonian import has_hamiltonian_cycle

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/check-cycle', methods=['POST'])
def check_cycle():
    data = request.json
    graph = data.get('graph')
    
    # Check if the graph is valid
    if not graph or len(graph) == 0:
        return jsonify({"error": "Graph is empty or invalid."}), 400

    result = has_hamiltonian_cycle(graph)
    return jsonify({"hamiltonian_cycle": result})

if __name__ == "__main__":
    app.run(debug=True)
