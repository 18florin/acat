import { Automata } from '../../../../../types/Automata.ts';
import { Application } from '../../../../../types/Application.ts';
import { DefaultToolbar } from '../../../../menu/context-menu/DefaultToolbar.ts';
import { PlayButton } from '../../../../menu/context-menu/buttons/PlayButton.ts';
import { RefreshButton } from '../../../../menu/context-menu/buttons/RefreshButton.ts';
import { InaccessibleStatesSimulator } from './InaccessibleStatesSimulator.ts'; 
import { DFAModel } from '../DFAModel.ts';

/**
 * The Inaccessible States Optimizer automata implementation.
 */
export class InaccessibleStatesOptimizer implements Automata {
    // references the current application
    protected app: Application | null = null;

    // references this simulation's toolbar
    protected toolbar: DefaultToolbar | null = null;

    // references the actual simulator
    protected simulator: InaccessibleStatesSimulator;

    /**
     * The constructor for the Inaccessible States Optimizer
     */
    constructor() {
        this.simulator = new InaccessibleStatesSimulator(this);
        this.toolbar = new DefaultToolbar({
            buttons: [new PlayButton(this.simulator.onOptimize), new RefreshButton(this.onRefreshSimulation)],
        });
    }

    /**
     * Returning the current configuration for the user to later save it
     */
    getConfiguration(): Record<string, any> {
        return {};
    }

    /**
     * Runs the current simulation for Inaccessible States Optimization
     */
    runSimulation(app: Application): void {
        this.app = app;

        // adding the main view to the body
        const container = this.simulator.getMainView();
        this.app.getLayout().appBody.appendChild(container);
        this.simulator.start(container);
    }

    /**
     * Returns the new context bar that will be displayed in the top context menu
     */
    getContextBar(): DefaultToolbar {
        if (this.toolbar === null) throw new Error('No toolbar available');
        return this.toolbar;
    }

    /**
     * Invoked when the user clicks the refresh button
     */
    onRefreshSimulation = () => {
        this.app?.simulateAutomata(new InaccessibleStatesOptimizer());
    };
}