import { ExcelComponent } from '@core/ExcelComponent';
import { createTable } from './table.template';
import { resizeHandler } from './table.resize';
import { shouldResize, isCell } from './table.function';
import { TableSelection } from './TableSelection';
import { $ } from '../../core/dom';
import { matrix } from '../table/table.function';

export class Table extends ExcelComponent {
    static className = 'excel__table';

    constructor($root) {
        super($root, {
            listeners: ['mousedown', 'mousemove']
        })
    }

    toHTML() {
        return createTable(25);
    }

    prepare() {
        this.selection = new TableSelection();
    }

    init() {
        super.init();
        const $cell = this.$root.find('[data-id="0:0"]');
        this.selection.select($cell);
    }

    onMousedown(event) {
        if (shouldResize(event)) {
            resizeHandler(this.$root, event);
        } else if (isCell(event)) {
            const $target = $(event.target);
            if (event.shiftKey) {
                // const target = $target.id(true);
                // const current = this.selection.current.id(true); // переписали в $cells

                const $cells = matrix($target, this.selection.current)
                    .map(id => this.$root.find(`[data-id="${id}"]`))

                // const $cells = ids.map(id => this.$root.find(`[data-id="${id}"]`));
                this.selection.selectGroup($cells)
            } else {
                this.selection.select($target);
            }
        }
    }
}

