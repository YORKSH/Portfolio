/**
 * 프로젝트 목록 필터·정렬 (URL 파라미터와 동기화)
 *   ?category=residential  카테고리 필터
 *   ?sort=asc              오래된순 (기본: 최신순)
 */
type Sort = 'asc' | 'desc';

export function initProjectFilter() {
  const grid = document.querySelector<HTMLElement>('[data-grid]');
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll<HTMLElement>('.card-item'));
  const filterLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-filter]'));
  const sortButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-sort]'));
  const empty = document.querySelector<HTMLElement>('[data-empty]');
  const status = document.querySelector<HTMLElement>('[data-status]');
  const validCategories = new Set(filterLinks.map((a) => a.dataset.filter).filter(Boolean));

  function readState() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category') ?? '';
    const sort: Sort = params.get('sort') === 'asc' ? 'asc' : 'desc';
    return { category: validCategories.has(category) ? category : '', sort };
  }

  function apply(category: string, sort: Sort) {
    // 필터
    let visible = 0;
    for (const item of items) {
      const cats = (item.dataset.categories ?? '').split(' ');
      const show = !category || cats.includes(category);
      item.hidden = !show;
      if (show) visible++;
    }

    // 정렬: 연도 → (같은 연도) order → 원래 순서
    const num = (v: string | undefined, fallback: number) => (v ? Number(v) : fallback);
    const sorted = [...items].sort((a, b) => {
      const ya = num(a.dataset.year, 0);
      const yb = num(b.dataset.year, 0);
      if (ya !== yb) return sort === 'asc' ? ya - yb : yb - ya;
      const oa = num(a.dataset.order, Infinity);
      const ob = num(b.dataset.order, Infinity);
      if (oa !== ob) return oa - ob;
      return num(a.dataset.index, 0) - num(b.dataset.index, 0);
    });
    grid!.append(...sorted);

    // 버튼 상태
    for (const a of filterLinks) {
      if ((a.dataset.filter ?? '') === category) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
    for (const b of sortButtons) b.setAttribute('aria-pressed', String(b.dataset.sort === sort));
    if (empty) empty.hidden = visible > 0;
    if (status) status.textContent = String(visible);
  }

  function update(next: { category?: string; sort?: Sort }) {
    const current = readState();
    const category = next.category ?? current.category;
    const sort = next.sort ?? current.sort;

    const params = new URLSearchParams(window.location.search);
    if (category) params.set('category', category);
    else params.delete('category');
    if (sort === 'asc') params.set('sort', 'asc');
    else params.delete('sort');
    const query = params.toString();
    history.replaceState(history.state, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
    document.dispatchEvent(new CustomEvent('portfolio:querychange'));

    const run = () => apply(category, sort);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('startViewTransition' in document && !reduce) {
      // 지원 브라우저에서는 카드가 새 위치로 부드럽게 이동합니다.
      document.startViewTransition(run);
    } else {
      run();
    }
  }

  for (const a of filterLinks) {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      update({ category: a.dataset.filter ?? '' });
    });
  }
  for (const b of sortButtons) {
    b.addEventListener('click', () => update({ sort: b.dataset.sort === 'asc' ? 'asc' : 'desc' }));
  }

  const initial = readState();
  apply(initial.category, initial.sort);
}
