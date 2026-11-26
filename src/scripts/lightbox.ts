/**
 * 이미지·도면 확대 보기 (PhotoSwipe)
 * - [data-lightbox] 안의 a.zoomable 을 누르면 전체 화면으로 열립니다.
 * - 같은 [data-lightbox] (예: 하나의 Gallery) 안의 이미지는 좌우로 넘겨 볼 수 있습니다.
 * - 휠/핀치로 확대, 드래그로 이동. 도면은 원본 해상도 이상으로 확대할 수 있습니다.
 */
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

function readLabels() {
  const el = document.getElementById('media-labels');
  try {
    return el?.textContent ? (JSON.parse(el.textContent) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function initLightbox() {
  const groups = document.querySelectorAll<HTMLElement>('[data-lightbox]');
  if (groups.length === 0) return;

  const labels = readLabels();

  for (const group of groups) {
    const isDrawing = group.dataset.kind === 'drawing';
    const lightbox = new PhotoSwipeLightbox({
      gallery: group,
      children: 'a.zoomable',
      pswpModule: () => import('photoswipe'),
      bgOpacity: 0.96,
      wheelToZoom: true,
      initialZoomLevel: 'fit',
      secondaryZoomLevel: isDrawing ? 2 : 1.5,
      maxZoomLevel: isDrawing ? 6 : 3,
      showHideAnimationType: 'zoom',
      closeTitle: labels.close,
      zoomTitle: labels.zoom,
      arrowPrevTitle: labels.prev,
      arrowNextTitle: labels.next,
    });

    // 캡션 표시
    lightbox.on('uiRegister', () => {
      lightbox.pswp?.ui?.registerElement({
        name: 'caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        onInit: (el, pswp) => {
          pswp.on('change', () => {
            const anchor = pswp.currSlide?.data.element as HTMLElement | undefined;
            const text = anchor?.dataset.caption ?? '';
            el.textContent = text;
            el.hidden = !text;
          });
        },
      });
    });

    lightbox.init();
  }
}
