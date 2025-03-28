import { CustomElement } from '../../../../core/CustomElement.ts';
import { html } from '../../../../helpers/dom.ts';
import './drawer-item.less';

/**
 * The drawer item props
 */
export type DrawerItemProps = {
    // the name displayed inside the drawer menu
    displayName: string;
    // the click handler invoked when the user clicks a menu item
    onclick: VoidFunction;
};

/**
 * Handles rendering a drawer item
 */
export class DrawerItem extends CustomElement<DrawerItemProps> {
    static element = 'drawer-item';

    /**
     * Constructor for the drawer item
     */
    constructor(props: DrawerItemProps) {
        super(props);
        // attaching the click handler to this component
        this.onclick = props.onclick;
    }

    /**
     * Returns the template for this item
     */
    template(): string | null {
        return html`<div class="drawer-item">${this.props.displayName}</div>`;
    }
}
