export function createTableSorter(body, collator, defaultKey, defaultDirection, ascendingKeys, onChange) {
  const buttons = body.closest('table').querySelectorAll('[data-table-sort]');
  const rowKeys = new WeakMap();
  let key = defaultKey;
  let direction = defaultDirection;

  function order(rows, getKeys) {
    return rows.sort((a, b) => {
      const first = getKeys(a);
      const second = getKeys(b);
      const left = first.values[key];
      const right = second.values[key];
      const leftMissing = left == null || Number.isNaN(left);
      const rightMissing = right == null || Number.isNaN(right);
      if (leftMissing || rightMissing) {
        return Number(leftMissing) - Number(rightMissing) || first.position - second.position;
      }
      const comparison = typeof left === 'string'
        ? collator.compare(left, right)
        : left - right;
      return comparison * direction || first.position - second.position;
    });
  }

  function apply() {
    body.append(...order(Array.from(body.rows), row => rowKeys.get(row)));
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const nextKey = button.dataset.tableSort;
      direction = nextKey === key ? -direction : (ascendingKeys.includes(nextKey) ? 1 : -1);
      key = nextKey;
      buttons.forEach(item => {
        const header = item.closest('th');
        const arrow = item.querySelector('span');
        if (item === button) {
          header.setAttribute('aria-sort', direction === 1 ? 'ascending' : 'descending');
          arrow.textContent = direction === 1 ? '▲' : '▼';
        } else {
          header.removeAttribute('aria-sort');
          arrow.textContent = '↕';
        }
      });
      (onChange || apply)();
    });
  });

  return {
    add(row, values, position) {
      rowKeys.set(row, { values, position });
    },
    apply,
    order
  };
}
