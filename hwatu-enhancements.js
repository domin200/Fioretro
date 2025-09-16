// 경량화된 게임 개선 기능

document.addEventListener('DOMContentLoaded', () => {
    console.log('게임 개선 기능 초기화...');

    // === 1. 카드 애니메이션 개선 ===
    const improveCardAnimations = () => {
        // 카드 호버 효과 강화
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes cardPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            @keyframes cardShine {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
            }

            .card {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                position: relative;
                overflow: hidden;
            }

            .card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255, 255, 255, 0.2),
                    transparent
                );
                transition: left 0.5s;
                pointer-events: none;
            }

            .card:hover::before {
                left: 100%;
            }

            .card:hover {
                transform: translateY(-10px) scale(1.08) !important;
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4) !important;
                z-index: 100 !important;
            }

            .card.selected {
                animation: cardPulse 2s ease-in-out infinite;
                border: 3px solid #4CAF50 !important;
                box-shadow: 0 0 30px rgba(76, 175, 80, 0.6) !important;
            }

            /* 같은 월 카드 하이라이트 효과 */
            .card.same-month {
                background: linear-gradient(135deg,
                    rgba(76, 175, 80, 0.2),
                    rgba(255, 255, 255, 0.1),
                    rgba(76, 175, 80, 0.2)
                );
                border: 2px solid rgba(76, 175, 80, 0.6) !important;
                box-shadow: 0 0 20px rgba(76, 175, 80, 0.5) !important;
            }

            .card.same-month::after {
                content: '⭐';
                position: absolute;
                top: 5px;
                right: 5px;
                font-size: 20px;
                animation: cardPulse 2s ease-in-out infinite;
            }

            /* 바닥 카드 컨테이너 하이라이트 */
            #floor-area .card.same-month {
                transform: translateY(-5px);
                z-index: 10;
            }
        `;
        document.head.appendChild(style);

        // 선택된 카드와 같은 월의 바닥 카드 하이라이트
        const highlightSameMonthCards = () => {
            // 모든 same-month 클래스 제거
            document.querySelectorAll('.card.same-month').forEach(card => {
                card.classList.remove('same-month');
            });

            // 선택된 손패 카드 찾기
            const selectedCard = document.querySelector('#hand-area .card.selected');
            if (!selectedCard || !selectedCard.cardData) return;

            const selectedMonth = selectedCard.cardData.month;

            // 바닥의 같은 월 카드에 하이라이트 적용
            document.querySelectorAll('#floor-area .card').forEach(card => {
                if (card.cardData && card.cardData.month === selectedMonth) {
                    card.classList.add('same-month');
                }
            });
        };

        // 손패 카드 클릭 이벤트 감지
        document.addEventListener('click', (e) => {
            const handCard = e.target.closest('#hand-area .card');
            if (handCard) {
                // 잠시 후 하이라이트 업데이트 (선택 상태가 변경된 후)
                setTimeout(highlightSameMonthCards, 50);
            }
        });

        // 주기적으로 체크 (게임 상태 변경 대응)
        setInterval(highlightSameMonthCards, 500);
    };

    // === 2. 점수 애니메이션 ===
    const addScoreAnimations = () => {
        let lastScore = null;
        let lastMultiplier = null;
        let isAnimating = false;

        const animateValue = (element, start, end, duration) => {
            if (isAnimating) return; // 이미 애니메이션 중이면 건너뛰기
            if (start === end) return; // 같은 값이면 애니메이션 불필요

            isAnimating = true;
            const startTime = performance.now();
            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const value = Math.floor(start + (end - start) * progress);
                element.textContent = value;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    element.textContent = end;
                    isAnimating = false;
                }
            };
            requestAnimationFrame(update);
        };

        setInterval(() => {
            const scoreEl = document.getElementById('score');
            const multiplierEl = document.getElementById('multiplier');

            if (scoreEl && multiplierEl) {
                // gameState에서 직접 점수 가져오기 (더 정확함)
                const currentScore = (window.gameState && window.gameState.score !== undefined)
                    ? window.gameState.score
                    : parseInt(scoreEl.textContent) || 0;

                const currentMultiplier = (window.gameState && window.gameState.multiplier !== undefined)
                    ? window.gameState.multiplier
                    : parseInt(multiplierEl.textContent.replace('x', '')) || 1;

                // 초기값 설정
                if (lastScore === null) {
                    lastScore = currentScore;
                    scoreEl.textContent = currentScore;
                }
                if (lastMultiplier === null) {
                    lastMultiplier = currentMultiplier;
                }

                // 점수가 변경되었고 애니메이션 중이 아닐 때만
                if (currentScore !== lastScore && !isAnimating) {
                    // 큰 변화는 즉시 표시
                    if (Math.abs(currentScore - lastScore) > 100) {
                        scoreEl.textContent = currentScore;
                    } else {
                        animateValue(scoreEl, lastScore, currentScore, 500);
                    }

                    // 점수 증가 효과
                    scoreEl.style.transform = 'scale(1.2)';
                    scoreEl.style.color = '#4CAF50';
                    setTimeout(() => {
                        scoreEl.style.transform = 'scale(1)';
                        scoreEl.style.color = '';
                    }, 300);

                    lastScore = currentScore;
                }

                if (currentMultiplier !== lastMultiplier) {
                    multiplierEl.textContent = 'x' + currentMultiplier;
                    multiplierEl.style.transform = 'scale(1.3)';
                    multiplierEl.style.color = '#FFD700';
                    setTimeout(() => {
                        multiplierEl.style.transform = 'scale(1)';
                        multiplierEl.style.color = '';
                    }, 300);

                    lastMultiplier = currentMultiplier;
                }
            }
        }, 100);
    };

    // === 3. 버튼 개선 ===
    const improveButtons = () => {
        const buttons = document.querySelectorAll('button');

        buttons.forEach(button => {
            // 리플 효과 추가
            button.style.position = 'relative';
            button.style.overflow = 'hidden';

            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: rippleEffect 0.6s ease-out;
                    pointer-events: none;
                `;

                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });

            // 호버 효과
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
                button.style.boxShadow = '';
            });
        });

        // 리플 애니메이션 스타일
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes rippleEffect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    };

    // === 4. 게임 이벤트 피드백 ===
    const addGameFeedback = () => {
        // 플레이 버튼 클릭시
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            const originalClick = playBtn.onclick;
            playBtn.onclick = function(e) {
                // 시각 피드백
                const flash = document.createElement('div');
                flash.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle, rgba(76,175,80,0.3), transparent);
                    pointer-events: none;
                    z-index: 9998;
                    animation: flashFade 0.5s ease-out;
                `;
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 500);

                // 원래 동작 실행
                if (originalClick) originalClick.call(this, e);
            };
        }

        // 버리기 버튼 클릭시
        const discardBtn = document.getElementById('discard-btn');
        if (discardBtn) {
            const originalClick = discardBtn.onclick;
            discardBtn.onclick = function(e) {
                // 시각 피드백
                const flash = document.createElement('div');
                flash.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle, rgba(255,152,0,0.2), transparent);
                    pointer-events: none;
                    z-index: 9998;
                    animation: flashFade 0.5s ease-out;
                `;
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 500);

                // 원래 동작 실행
                if (originalClick) originalClick.call(this, e);
            };
        }

        // 플래시 애니메이션
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes flashFade {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    };

    // === 5. 파티클 효과 (간단한 버전) ===
    const addParticleEffects = () => {
        window.createParticles = (x, y, color = '#FFD700') => {
            for (let i = 0; i < 10; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 6px;
                    height: 6px;
                    background: ${color};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    left: ${x}px;
                    top: ${y}px;
                `;

                document.body.appendChild(particle);

                const angle = (Math.PI * 2 * i) / 10;
                const velocity = 3 + Math.random() * 2;
                const lifetime = 1000 + Math.random() * 500;

                let opacity = 1;
                let currentX = x;
                let currentY = y;
                const startTime = performance.now();

                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = elapsed / lifetime;

                    if (progress < 1) {
                        currentX += Math.cos(angle) * velocity;
                        currentY += Math.sin(angle) * velocity + progress * 2;
                        opacity = 1 - progress;

                        particle.style.left = currentX + 'px';
                        particle.style.top = currentY + 'px';
                        particle.style.opacity = opacity;

                        requestAnimationFrame(animate);
                    } else {
                        particle.remove();
                    }
                };

                requestAnimationFrame(animate);
            }
        };

        // 카드 클릭시 파티클
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (card) {
                const rect = card.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;

                // 같은 월 카드는 특별한 색상
                if (card.classList.contains('same-month')) {
                    window.createParticles(x, y, '#FFD700');
                }
                // 선택된 카드는 녹색
                else if (card.classList.contains('selected')) {
                    window.createParticles(x, y, '#4CAF50');
                }
                // 일반 카드는 흰색
                else {
                    window.createParticles(x, y, '#87CEEB');
                }
            }
        });
    };

    // === 모든 개선 기능 실행 ===
    improveCardAnimations();
    // addScoreAnimations(); // 점수 표시 문제로 일시 비활성화
    improveButtons();
    addGameFeedback();
    addParticleEffects();


    console.log('✨ 게임 개선 기능 초기화 완료!');
});