// 향상된 게임 기능 통합 스크립트

// 초기화 함수
document.addEventListener('DOMContentLoaded', () => {
    console.log('향상된 게임 기능 초기화 중...');

    // 3D 카드 기능 활성화
    if (window.createCardElement) {
        const originalCreateCard = window.createCardElement;

        // 3D 카드 사용 옵션
        const use3DCards = false; // 일단 비활성화 (문제 해결 후 활성화)

        // createCardElement 오버라이드
        window.createCardElement = function(card) {
            if (use3DCards && window.createEnhancedCardElement) {
                return window.createEnhancedCardElement(card, { use3D: true });
            }
            return originalCreateCard(card);
        };
    }

    // 카드 플레이 이벤트 리스너 추가
    document.addEventListener('cardPlayed', (e) => {
        const { card, x, y } = e.detail;

        // 시각 효과 재생
        if (window.visualEffects) {
            if (card.type === '광') {
                window.visualEffects.playCardEffect(x, y, 'rare');
                window.soundManager?.playRareCard();
            } else {
                window.visualEffects.playCardEffect(x, y, 'normal');
            }
        }

        // UI 피드백
        if (window.uiManager) {
            window.showToast(`${card.month}월 ${card.name} 플레이!`, 'info', 2000);
        }
    });

    // 콤보 이벤트 리스너
    document.addEventListener('combo', (e) => {
        const { combo, score } = e.detail;

        if (window.visualEffects) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            window.visualEffects.playCardEffect(centerX, centerY, 'combo');
        }

        if (window.soundManager) {
            window.soundManager.playCombo(combo);
        }

        if (window.uiManager) {
            window.showToast(`${combo}x 콤보! +${score}점`, 'success', 3000);
        }
    });

    // 스테이지 클리어 이벤트
    document.addEventListener('stageClear', (e) => {
        const { stage, score } = e.detail;

        if (window.visualEffects) {
            window.visualEffects.screenShake(10, 500);
        }

        if (window.soundManager) {
            window.soundManager.playVictory();
        }

        if (window.uiManager) {
            window.showToast(`스테이지 ${stage} 클리어! 점수: ${score}`, 'success', 5000);
        }
    });

    // 보스 등장 이벤트
    document.addEventListener('bossAppear', (e) => {
        const { boss } = e.detail;

        if (window.visualEffects) {
            window.visualEffects.bossAppearEffect();
        }

        if (window.soundManager) {
            window.soundManager.play('critical');
        }

        if (window.uiManager) {
            window.showToast(`⚠️ ${boss} 보스 등장!`, 'warning', 4000);
        }
    });

    // 버튼 UI 개선
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        // Tailwind 클래스 추가
        if (!button.className.includes('btn-')) {
            button.classList.add('btn-primary');
        }
        button.classList.add('card-hover-effect');

        // 툴팁 추가
        const tooltip = button.getAttribute('data-tooltip');
        if (tooltip) {
            button.addEventListener('mouseenter', () => {
                window.showTooltip(button, tooltip, 'top');
            });
            button.addEventListener('mouseleave', () => {
                window.hideTooltip(button);
            });
        }
    });

    // 카드 호버 효과 개선
    const observeCards = () => {
        const cards = document.querySelectorAll('.card, .card-3d');
        cards.forEach(card => {
            if (!card.dataset.enhanced) {
                card.dataset.enhanced = 'true';
                card.classList.add('card-hover-effect');

                // 호버시 하이라이트 효과
                card.addEventListener('mouseenter', () => {
                    if (card.cardData?.type === '광') {
                        window.applyRareCardEffect?.(card);
                    }
                });
            }
        });
    };

    // MutationObserver로 동적으로 추가되는 카드 감지
    const observer = new MutationObserver(observeCards);
    observer.observe(document.body, { childList: true, subtree: true });
    observeCards(); // 초기 실행

    // 키보드 단축키 추가
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'p':
            case 'P':
                // Play 버튼 클릭
                document.getElementById('play-btn')?.click();
                break;
            case 'd':
            case 'D':
                // Discard 버튼 클릭
                document.getElementById('discard-btn')?.click();
                break;
            case 's':
            case 'S':
                // Shop 버튼 클릭
                document.getElementById('shop-btn')?.click();
                break;
            case 'm':
            case 'M':
                // 음소거 토글
                if (window.soundManager) {
                    const enabled = window.soundManager.toggle();
                    window.showToast(enabled ? '🔊 사운드 켜짐' : '🔇 사운드 꺼짐', 'info', 2000);
                }
                break;
            case 'Escape':
                // 모달이나 팝업 닫기
                document.querySelector('[id$="-popup"]:not([style*="display: none"])')?.click();
                break;
        }
    });

    // 게임 시작 메시지
    setTimeout(() => {
        if (window.uiManager) {
            window.showToast('🎴 화라투로에 오신 것을 환영합니다!', 'success', 3000);
            window.showToast('💡 단축키: P(플레이), D(버리기), S(상점), M(음소거)', 'info', 5000);
        }
    }, 1000);

    // 성능 모니터링 (개발 모드)
    if (window.location.hostname === 'localhost') {
        let fps = 0;
        let lastTime = performance.now();

        const updateFPS = () => {
            const currentTime = performance.now();
            fps = Math.round(1000 / (currentTime - lastTime));
            lastTime = currentTime;

            let fpsDisplay = document.getElementById('fps-display');
            if (!fpsDisplay) {
                fpsDisplay = document.createElement('div');
                fpsDisplay.id = 'fps-display';
                fpsDisplay.style.cssText = `
                    position: fixed;
                    top: 10px;
                    left: 10px;
                    background: rgba(0,0,0,0.5);
                    color: #0f0;
                    padding: 5px 10px;
                    font-family: monospace;
                    font-size: 12px;
                    z-index: 10000;
                    border-radius: 3px;
                `;
                document.body.appendChild(fpsDisplay);
            }

            fpsDisplay.textContent = `FPS: ${fps}`;
            requestAnimationFrame(updateFPS);
        };

        updateFPS();
    }

    console.log('✅ 향상된 게임 기능 초기화 완료!');
});

// 전역 헬퍼 함수들
window.triggerCardEffect = (card, x, y) => {
    const event = new CustomEvent('cardPlayed', {
        detail: { card, x, y }
    });
    document.dispatchEvent(event);
};

window.triggerCombo = (combo, score) => {
    const event = new CustomEvent('combo', {
        detail: { combo, score }
    });
    document.dispatchEvent(event);
};

window.triggerStageClear = (stage, score) => {
    const event = new CustomEvent('stageClear', {
        detail: { stage, score }
    });
    document.dispatchEvent(event);
};

window.triggerBossAppear = (boss) => {
    const event = new CustomEvent('bossAppear', {
        detail: { boss }
    });
    document.dispatchEvent(event);
};