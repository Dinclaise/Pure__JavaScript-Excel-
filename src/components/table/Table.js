import { ExcelComponent } from '@core/ExcelComponent';
import { createTable } from './table.template';
import { resizeHandler } from './table.resize';
import { shouldResize, isCell } from './table.function';
import { TableSelection } from './TableSelection';
import { $ } from '../../core/dom';
import { matrix } from '../table/table.function';
import { nextSelector } from '../table/table.function';

export class Table extends ExcelComponent {
    static className = 'excel__table';

    constructor($root, options) {
        super($root, {
            name: 'Table',
            listeners: ['mousedown', 'mousemove', 'keydown', 'input'],
            ...options
        })
    }

    // Return template of component
    toHTML() {
        return createTable(25);
    }

    prepare() {
        this.selection = new TableSelection();
    }

    init() {
        super.init();
        this.selectCell(this.$root.find('[data-id="0:0"]'));

        this.$on('it is working', text => {
            this.$el.current.text(text);
            console.log('formula: input', text);
        })

        this.$on('formula: done', () => {
            this.selection.current.focus();
        })
    }

    selectCell($cell) {
        this.selection.select($cell);
        this.$emit('table:select', $cell);
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

    onKeydown(event) {
        const keys = [
            'Enter',
            'Tab',
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'ArrowDown'
        ];

        const { key } = event;

        if (keys.includes(key) && !event.shiftKey) {
            event.preventDefault()

            const id = this.selection.current.id(true);
            const $next = this.$root.find(nextSelector(key, id))
            this.selectCell($next);
        }
    }

    onInput() {
        this.$emit('table:input', $(event.target))
    }
}

