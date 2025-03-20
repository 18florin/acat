import { Network, DataSet, Node, Edge } from 'vis-network/standalone';
import { InaccessibleStatesOptimizer } from './InaccessibleStatesOptimizer.ts';
import { DFAMainView } from "../views/DFAMainView.ts";
import { DFAModel, State } from '../DFAModel.ts';

/**
 * Does the actual simulation of the Inaccessible States Optimizer
 */
export class InaccessibleStatesSimulator {
    // the simulator view
    protected mainView: DFAMainView | null = null;

    // references the network of states
    protected network: Network | null = null;

    // references the DFAModel
    protected model: DFAModel = new DFAModel();

    /**
     * The constructor receives the Automata instance
     */
    constructor(protected automata: InaccessibleStatesOptimizer) {}

    /**
     * Entry point for starting the simulation
     */
    start(mainView: DFAMainView) {
        // initializing the DFA model
        this.model.states.push({ name: 'q0', initial: true, final: false });

        // keeping track of the container
        this.mainView = mainView;
        // creating the network of states
        const [nodes, edges] = [this.getNodes(), this.getEdges()];
        // setting up some display options for how to render the network
        const options = { physics: false, edges: { font: { align: 'top' } } };
        // instantiating the network of states
        this.network = new Network(mainView.getNetworkContainer(), { nodes, edges }, options);

        this.network.setOptions({
            interaction: {
                selectable: true,
                multiselect: true,
            },
            manipulation: {
                enabled: true,
                addEdge: this.edgeAdded,
                addNode: this.nodeAdded,
            },
        });
    }

    /**
     * Invoked when the user clicks the play button for the simulation
     */
    onOptimize = () => {
        this.removeInaccessibleStates();
        this.updateNetwork();
    };

    /**
     * Removes inaccessible states from the model.
     */
    protected removeInaccessibleStates() {
        const accessibleStates = this.getAccessibleStates();
        this.model.states = this.model.states.filter(state => accessibleStates.includes(state.name));
        this.model.transitions = this.model.transitions.filter(transition =>
            accessibleStates.includes(transition.from) && accessibleStates.includes(transition.to)
        );
    }

    /**
     * Updates the network with the optimized model.
     */
    protected updateNetwork() {
        if (this.network) {
            const nodes = this.getNodes();
            const edges = this.getEdges();
    
            const positions = this.network.getPositions();
            nodes.forEach(node => {
                if (node.id !== undefined && positions[node.id] && positions[node.id] !== undefined) {
                    node.x = positions[node.id].x;
                    node.y = positions[node.id].y;
                }
            });
    
            this.network.setData({ nodes, edges });
        }
    }
    /**
     * Handler that will be invoked when a new node will be added
     */
    protected nodeAdded = (nodeData: Node, callback: (arg: Node) => void) => {
        const newNode = { x: nodeData.x, y: nodeData.y, ...this.getNextStateData() };
        callback(newNode);
    };

    /**
     * Invoked when a new edge has been added
     */
    protected edgeAdded = (edgeData: Edge, callback: (edge: Edge) => void) => {
        // Accepting the new edge only if forwards to a new state
        if (edgeData.from !== edgeData.to) {
            // requesting the character that will validate next state
            const character = prompt('Enter the transition character:');
            if (!character) {
                alert('Aborting because no character was inserted');
                return;
            }

            // @ts-ignore
            this.model.transitions.push({ from: edgeData.from, to: edgeData.to, character });

            edgeData.label = character;
            callback(edgeData);
        } else {
            alert('Self-loops are not allowed!');
        }
    };

    /**
     * Returns a new node definition
     */
    protected getNextStateData(): Node {
        const nextState: State = { name: 'q' + this.model.states.length, final: true, initial: false };
        this.model.states.push(nextState);
        return { id: nextState.name, label: nextState.name + ' (Final)', shape: 'ellipse', color: 'lightgreen' };
    }

    /**
     * Returns the list of nodes created based on the model's states
     */
    protected getNodes(): Node[] {
        const nodes: Node[] = [];
        for (let i = 0, len = this.model.states.length; i < len; i++) {
            const state = this.model.states[i];
            nodes.push({
                id: state.name,
                label: state.name + (state.initial ? ' (Start)' : state.final ? ' (Final)' : ''),
                shape: 'ellipse',
                color: state.initial || state.final ? 'lightgreen' : 'lightblue',
            });
        }

        return nodes;
    }

    /**
     * Returns the list of edges created based on the model's transition table
     */
    protected getEdges(): Edge[] {
        const edges: Edge[] = [];
        for (let i = 0, len = this.model.transitions.length; i < len; i++) {
            const transition = this.model.transitions[i];
            edges.push({ label: transition.character, from: transition.from, to: transition.to });
        }

        return edges;
    }

    /**
     * Returns the main view.
     */
    getMainView(): DFAMainView {
        if (!this.mainView) {
            this.mainView = new DFAMainView();
        }
        return this.mainView;
    }
    
     /**
     * Returns a list of accessible state names.
     */
     protected getAccessibleStates(): string[] {
        const accessible: string[] = [this.model.getInitialState().name];
        const queue: string[] = [this.model.getInitialState().name];
        const marked: string[] = [this.model.getInitialState().name]; 

        while (queue.length > 0) {
            const currentState = queue.shift()!;
            for (const transition of this.model.transitions) {
                if (transition.from === currentState && !marked.includes(transition.to)) {
                    accessible.push(transition.to);
                    queue.push(transition.to);
                    marked.push(transition.to); 
                }
            }
        }
        return accessible;
    }
}