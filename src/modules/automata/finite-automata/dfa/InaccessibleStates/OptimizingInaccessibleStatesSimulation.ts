import { AbstractFiniteSimulation } from '../../AbstractFiniteSimulation.ts';
import { Application } from '../../../../../types/Application.ts';
import { ModuleNames } from '../../../../../AppModules.ts';
import { DrawerItem } from '../../../../menu/hamburger-menu/views/DrawerItem.ts';
import { InaccessibleStatesOptimizer } from './InaccessibleStatesOptimizer.ts';

/**
 * The inaccessible states optimization simulation
 */
export class OptimizingInaccessibleStatesSimulation extends AbstractFiniteSimulation {
    /**
     * Letting the abstract implementation do the basic stuff
     */
    initialize(app: Application) {
        super.initialize(app);

        // subscribing this simulation to the finite automata category
        const category = app.getModule(ModuleNames.HamburgerMenu)?.getCategory(AbstractFiniteSimulation.menuId);

        // ensuring the category is defined
        if (category === null) return;

        category?.addItem(new DrawerItem({ displayName: 'Optimizing Inaccessible States', onclick: () => this.simulate() }));
    }

    /**
     * Running the simulation
     */
    simulate(): void {
        // hiding the module before proceeding with the automation
        this.app?.getModule(ModuleNames.HamburgerMenu)?.onToggleMenu();
        // calling the simulation on application instance
        this.app?.simulateAutomata(new InaccessibleStatesOptimizer());
    }
}