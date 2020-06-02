import { ExcelComponent } from '@core/ExcelComponent';
import { createTable } from './table.template';
import { $ } from '../../core/dom';

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

    onMousedown(event) {
        // const resize = event.target.dataset.resize;
        const $resizer = $(event.target);
        const $parent = $resizer.closest('[data-type="resizable"]');
        console.log($resizer);

        const coords = $parent.getCoords()

        document.onmousemove = e => {
            console.log('mousemove');

            const delta = e.pageX - coords.right;
            const value = coords.width + delta;
            $parent.$el.style.width = value + 'px';

            document.querySelectorAll(`[data-col="${$parent.data.col}"]`)
                .forEach(el => el.style.width = value + 'px')
        }

        document.onmouseup = e => {
            document.onmousemove = null;
        }
    }
}
