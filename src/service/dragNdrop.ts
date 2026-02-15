import type { Item } from '../components/item/Item';
import { CLASS_NAME } from '../constants.js';

type DragEventType =
  | 'dragstart'
  | 'dragend'
  | 'dragover'
  | 'dragleave'
  | 'drop';
type DragEventHandler = (e: DragEvent) => void;
type DragNDropHandlers = Record<
  `on${Capitalize<DragEventType>}`,
  DragEventHandler
>;

export default class DragNDrop {
  private static itemOnDrag: Item | null = null;

  public static makeDragHandlers(item: Item): DragNDropHandlers {
    let reqId = 0;
    let isInside = false;

    const clearDragover = (hostEl: HTMLElement | null) => {
      cancelAnimationFrame(reqId);
      reqId = 0;
      isInside = false;
      hostEl?.classList.remove(CLASS_NAME.dragover);
    };

    const onDragstart: DragEventHandler = () => {
      DragNDrop.itemOnDrag = item;
      item.host?.classList.add(CLASS_NAME.dragging);
    };

    const onDragend: DragEventHandler = () => {
      DragNDrop.itemOnDrag = null;
      item.host?.classList.remove(CLASS_NAME.dragging);
    };

    const onDragover: DragEventHandler = (e) => {
      e.preventDefault();
      isInside = true;
      if (!!reqId) return;

      requestAnimationFrame(() => {
        reqId = 0;
        if (isInside) {
          item.host?.classList.add(CLASS_NAME.dragover);
        }
      });
    };

    const onDragleave: DragEventHandler = (e) => {
      const hostEl = item.host;
      const relatedTarget = e.relatedTarget as HTMLElement;

      if (!relatedTarget || !hostEl?.contains(relatedTarget)) {
        clearDragover(hostEl);
      }
    };

    const onDrop: DragEventHandler = () => {
      clearDragover(item.host);

      const target = DragNDrop.itemOnDrag;
      if (!!target?.host && !!item.host && item.id !== target.id) {
        const targetTop = target.host.getBoundingClientRect().top;
        const currentTop = item.host.getBoundingClientRect().top;
        const position = targetTop > currentTop ? 'beforebegin' : 'afterend';
        item.host?.insertAdjacentElement(position, target.host);
      }
    };

    return { onDragstart, onDragend, onDragover, onDragleave, onDrop };
  }
}
