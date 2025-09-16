// UI 컴포넌트 (토스트, 툴팁, 모달 등)

class UIManager {
    constructor() {
        this.toastQueue = [];
        this.isShowingToast = false;
        this.tooltips = new Map();
        this.init();
    }

    init() {
        // 토스트 컨테이너 생성
        if (!document.getElementById('toast-container')) {
            const toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
            document.body.appendChild(toastContainer);
        }

        // 툴팁 컨테이너 생성
        if (!document.getElementById('tooltip-container')) {
            const tooltipContainer = document.createElement('div');
            tooltipContainer.id = 'tooltip-container';
            tooltipContainer.className = 'fixed z-50 pointer-events-none';
            document.body.appendChild(tooltipContainer);
        }

        // Tailwind 클래스 추가
        this.addTailwindStyles();
    }

    // Tailwind 스타일 추가
    addTailwindStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* 토스트 애니메이션 */
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            .toast-enter {
                animation: slideInRight 0.3s ease-out;
            }

            .toast-exit {
                animation: slideOutRight 0.3s ease-out;
            }

            /* 툴팁 스타일 */
            .tooltip {
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                white-space: nowrap;
                backdrop-filter: blur(4px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .tooltip::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border: 6px solid transparent;
                border-top-color: rgba(0, 0, 0, 0.9);
            }

            /* 버튼 스타일 개선 */
            .btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
            }

            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
            }

            .btn-secondary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                font-weight: 500;
                transition: all 0.3s ease;
            }

            .btn-danger {
                background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                font-weight: 500;
                transition: all 0.3s ease;
            }

            /* 카드 호버 효과 개선 */
            .card-hover-effect {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .card-hover-effect:hover {
                transform: translateY(-8px) scale(1.05);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
        `;
        document.head.appendChild(style);
    }

    // 토스트 메시지 표시
    showToast(message, type = 'info', duration = 3000) {
        const toast = {
            message,
            type,
            duration,
            id: Date.now()
        };

        this.toastQueue.push(toast);
        this.processToastQueue();
    }

    // 토스트 큐 처리
    processToastQueue() {
        if (this.isShowingToast || this.toastQueue.length === 0) return;

        this.isShowingToast = true;
        const toast = this.toastQueue.shift();
        this.displayToast(toast);
    }

    // 토스트 표시
    displayToast(toast) {
        const container = document.getElementById('toast-container');

        const toastElement = document.createElement('div');
        toastElement.className = `toast-enter flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] ${this.getToastClass(toast.type)}`;

        // 아이콘 추가
        const icon = this.getToastIcon(toast.type);
        toastElement.innerHTML = `
            <span class="text-2xl">${icon}</span>
            <span class="flex-1">${toast.message}</span>
            <button class="ml-2 text-white/70 hover:text-white" onclick="uiManager.closeToast('${toast.id}')">✕</button>
        `;

        container.appendChild(toastElement);

        // 사운드 효과
        if (window.soundManager) {
            window.soundManager.playNotification();
        }

        // 자동 제거
        setTimeout(() => {
            this.closeToast(toast.id);
        }, toast.duration);
    }

    // 토스트 닫기
    closeToast(toastId) {
        const container = document.getElementById('toast-container');
        const toasts = container.querySelectorAll('.toast-enter');

        toasts.forEach(toast => {
            if (!toast.dataset.closing) {
                toast.dataset.closing = 'true';
                toast.classList.remove('toast-enter');
                toast.classList.add('toast-exit');

                setTimeout(() => {
                    toast.remove();
                    this.isShowingToast = false;
                    this.processToastQueue();
                }, 300);
            }
        });
    }

    // 토스트 타입별 클래스
    getToastClass(type) {
        const classes = {
            success: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
            error: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
            warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
            info: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
        };
        return classes[type] || classes.info;
    }

    // 토스트 타입별 아이콘
    getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    // 툴팁 표시
    showTooltip(element, content, position = 'top') {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = content;

        const container = document.getElementById('tooltip-container');
        container.appendChild(tooltip);

        // 위치 계산
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let top, left;
        switch(position) {
            case 'top':
                top = rect.top - tooltipRect.height - 10;
                left = rect.left + rect.width / 2 - tooltipRect.width / 2;
                break;
            case 'bottom':
                top = rect.bottom + 10;
                left = rect.left + rect.width / 2 - tooltipRect.width / 2;
                break;
            case 'left':
                top = rect.top + rect.height / 2 - tooltipRect.height / 2;
                left = rect.left - tooltipRect.width - 10;
                break;
            case 'right':
                top = rect.top + rect.height / 2 - tooltipRect.height / 2;
                left = rect.right + 10;
                break;
        }

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;

        this.tooltips.set(element, tooltip);
    }

    // 툴팁 숨기기
    hideTooltip(element) {
        const tooltip = this.tooltips.get(element);
        if (tooltip) {
            tooltip.remove();
            this.tooltips.delete(element);
        }
    }

    // 확인 다이얼로그
    showConfirm(message, onConfirm, onCancel) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';

        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4 transform scale-95 opacity-0 transition-all duration-300">
                <h3 class="text-lg font-bold mb-4">확인</h3>
                <p class="text-gray-600 mb-6">${message}</p>
                <div class="flex gap-3 justify-end">
                    <button class="btn-secondary px-4 py-2 rounded" id="modal-cancel">취소</button>
                    <button class="btn-primary px-4 py-2 rounded" id="modal-confirm">확인</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 애니메이션
        setTimeout(() => {
            modal.querySelector('div').style.transform = 'scale(1)';
            modal.querySelector('div').style.opacity = '1';
        }, 10);

        // 이벤트 리스너
        modal.querySelector('#modal-confirm').addEventListener('click', () => {
            this.closeModal(modal);
            if (onConfirm) onConfirm();
        });

        modal.querySelector('#modal-cancel').addEventListener('click', () => {
            this.closeModal(modal);
            if (onCancel) onCancel();
        });

        // 배경 클릭시 닫기
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
                if (onCancel) onCancel();
            }
        });
    }

    // 모달 닫기
    closeModal(modal) {
        modal.querySelector('div').style.transform = 'scale(0.95)';
        modal.querySelector('div').style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }

    // 로딩 표시
    showLoading(message = '로딩중...') {
        const loading = document.createElement('div');
        loading.id = 'loading-overlay';
        loading.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';

        loading.innerHTML = `
            <div class="bg-white rounded-lg p-6 flex items-center gap-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span class="text-gray-700">${message}</span>
            </div>
        `;

        document.body.appendChild(loading);
    }

    // 로딩 숨기기
    hideLoading() {
        const loading = document.getElementById('loading-overlay');
        if (loading) {
            loading.remove();
        }
    }

    // 프로그레스 바
    showProgress(value, max, label = '') {
        let progress = document.getElementById('progress-bar');
        if (!progress) {
            progress = document.createElement('div');
            progress.id = 'progress-bar';
            progress.className = 'fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200';
            progress.innerHTML = `
                <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"></div>
            `;
            document.body.appendChild(progress);
        }

        const percentage = (value / max) * 100;
        progress.querySelector('div').style.width = `${percentage}%`;

        if (percentage >= 100) {
            setTimeout(() => {
                progress.remove();
            }, 500);
        }
    }
}

// 전역 인스턴스 생성
window.uiManager = new UIManager();

// 유틸리티 함수들
window.showToast = (message, type, duration) => window.uiManager.showToast(message, type, duration);
window.showTooltip = (element, content, position) => window.uiManager.showTooltip(element, content, position);
window.hideTooltip = (element) => window.uiManager.hideTooltip(element);
window.showConfirm = (message, onConfirm, onCancel) => window.uiManager.showConfirm(message, onConfirm, onCancel);
window.showLoading = (message) => window.uiManager.showLoading(message);
window.hideLoading = () => window.uiManager.hideLoading();
window.showProgress = (value, max, label) => window.uiManager.showProgress(value, max, label);