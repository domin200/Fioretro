// 경량화된 게임 개선 기능

document.addEventListener('DOMContentLoaded', () => {
    console.log('게임 개선 기능 초기화...');

    // === 1. 카드 애니메이션 개선 ===
    const improveCardAnimations = () => {
        // 카드별 애니메이션 상태 추적
        const cardAnimationStates = new Map();

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

            @keyframes blueGlow {
                0%, 100% {
                    filter: brightness(1.2) saturate(1.5) hue-rotate(-20deg) drop-shadow(0 0 20px rgba(0, 150, 255, 0.8));
                    box-shadow: 0 0 30px rgba(0, 150, 255, 0.6), inset 0 0 20px rgba(0, 150, 255, 0.3);
                }
                50% {
                    filter: brightness(1.4) saturate(2) hue-rotate(0deg) drop-shadow(0 0 35px rgba(0, 200, 255, 1));
                    box-shadow: 0 0 50px rgba(0, 200, 255, 0.8), inset 0 0 30px rgba(0, 200, 255, 0.5);
                }
            }

            @keyframes redGlow {
                0%, 100% {
                    filter: brightness(1.2) saturate(1.5) drop-shadow(0 0 20px rgba(255, 50, 50, 0.8));
                    box-shadow: 0 0 30px rgba(255, 50, 50, 0.6), inset 0 0 20px rgba(255, 50, 50, 0.3);
                }
                50% {
                    filter: brightness(1.4) saturate(2) drop-shadow(0 0 35px rgba(255, 100, 100, 1));
                    box-shadow: 0 0 50px rgba(255, 100, 100, 0.8), inset 0 0 30px rgba(255, 100, 100, 0.5);
                }
            }

            @keyframes goldGlow {
                0%, 100% {
                    filter: brightness(1.3) saturate(1.5) drop-shadow(0 0 25px rgba(255, 215, 0, 0.9));
                    box-shadow: 0 0 40px rgba(255, 215, 0, 0.7), inset 0 0 25px rgba(255, 215, 0, 0.4);
                }
                50% {
                    filter: brightness(1.5) saturate(2) drop-shadow(0 0 40px rgba(255, 235, 50, 1));
                    box-shadow: 0 0 60px rgba(255, 235, 50, 0.9), inset 0 0 35px rgba(255, 235, 50, 0.6);
                }
            }

            @keyframes darkGlow {
                0%, 100% {
                    filter: brightness(0.8) contrast(1.5) drop-shadow(0 0 20px rgba(100, 0, 200, 0.8));
                    box-shadow: 0 0 30px rgba(100, 0, 200, 0.6), inset 0 0 20px rgba(50, 0, 100, 0.4);
                }
                50% {
                    filter: brightness(1) contrast(2) drop-shadow(0 0 35px rgba(150, 0, 255, 1));
                    box-shadow: 0 0 50px rgba(150, 0, 255, 0.8), inset 0 0 30px rgba(100, 0, 200, 0.6);
                }
            }

            @keyframes whiteGlow {
                0%, 100% {
                    filter: brightness(1.4) contrast(1.2) drop-shadow(0 0 20px rgba(255, 255, 255, 0.9));
                    box-shadow: 0 0 30px rgba(255, 255, 255, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.4);
                }
                50% {
                    filter: brightness(1.6) contrast(1.3) drop-shadow(0 0 35px rgba(255, 255, 255, 1));
                    box-shadow: 0 0 50px rgba(255, 255, 255, 0.9), inset 0 0 30px rgba(255, 255, 255, 0.6);
                }
            }

            @keyframes floatAnimation {
                0%, 100% {
                    transform: translateY(0px) rotateX(2deg) rotateY(-1deg);
                    filter: drop-shadow(0 15px 20px rgba(0, 0, 0, 0.3));
                }
                25% {
                    transform: translateY(-8px) rotateX(1deg) rotateY(1deg);
                    filter: drop-shadow(0 20px 25px rgba(0, 0, 0, 0.25));
                }
                50% {
                    transform: translateY(-4px) rotateX(-1deg) rotateY(0deg);
                    filter: drop-shadow(0 18px 22px rgba(0, 0, 0, 0.28));
                }
                75% {
                    transform: translateY(-10px) rotateX(0deg) rotateY(-2deg);
                    filter: drop-shadow(0 22px 28px rgba(0, 0, 0, 0.22));
                }
            }

            @keyframes gentleFloat {
                0%, 100% {
                    transform: translateY(0px) translateZ(20px);
                    filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.4));
                }
                50% {
                    transform: translateY(-5px) translateZ(25px);
                    filter: drop-shadow(0 15px 20px rgba(0, 0, 0, 0.35));
                }
            }

            .card {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                position: relative;
                overflow: hidden;
                transform-style: preserve-3d;
                perspective: 1000px;
            }

            /* 손패 카드 기본 설정 (애니메이션은 JS로 제어) */
            #hand-area .card {
                transition: none !important;
                will-change: transform, filter;
            }

            /* 바닥 카드 기본 설정 (애니메이션은 JS로 제어) */
            #floor-area .card {
                transition: none !important;
                will-change: transform, filter;
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
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                transform: translateY(-15px) scale(1.1) rotateX(0deg) rotateY(0deg) !important;
                filter: drop-shadow(0 25px 35px rgba(0, 0, 0, 0.5)) !important;
                z-index: 100 !important;
            }

            .card.selected {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                border: 3px solid #4CAF50 !important;
                filter: drop-shadow(0 20px 30px rgba(76, 175, 80, 0.6)) !important;
                /* transform은 JS에서 float와 함께 적용 */
            }

            /* 같은 월 카드 하이라이트 효과 (호버) - 손패와 완전 동일 */
            .card.same-month-hover {
                animation-play-state: paused !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                transform: translateY(-20px) scale(1.12) rotateZ(-2deg) !important;
                filter: drop-shadow(0 30px 40px rgba(0, 0, 0, 0.45)) !important;
                z-index: 100 !important;
            }

            /* 같은 월 카드 선택 효과 (클릭) - 손패와 완전 동일 */
            .card.same-month-selected {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                border: 3px solid #4CAF50 !important;
                filter: drop-shadow(0 20px 30px rgba(76, 175, 80, 0.6)) !important;
                /* transform은 JS에서 float와 함께 적용 */
                z-index: 80 !important;
            }

            /* 바닥 카드 컨테이너 하이라이트 - JS로 제어하므로 제거 */

            /* 스택된 카드 컨테이너 기본 설정 */
            #floor-area > div[style*="position: relative"] {
                transition: none !important;
                will-change: transform, filter;
            }

            /* 색상별 카드 효과 - float 애니메이션 제거 */
            .card-blue {
                filter: brightness(1.2) saturate(1.5) hue-rotate(-20deg) drop-shadow(0 0 20px rgba(0, 150, 255, 0.8)) !important;
                box-shadow: 0 0 30px rgba(0, 150, 255, 0.6), inset 0 0 20px rgba(0, 150, 255, 0.3) !important;
            }

            .card-red {
                filter: brightness(1.2) saturate(1.5) drop-shadow(0 0 20px rgba(255, 50, 50, 0.8)) !important;
                box-shadow: 0 0 30px rgba(255, 50, 50, 0.6), inset 0 0 20px rgba(255, 50, 50, 0.3) !important;
            }

            .card-gold {
                filter: brightness(1.3) saturate(1.5) drop-shadow(0 0 25px rgba(255, 215, 0, 0.9)) !important;
                box-shadow: 0 0 40px rgba(255, 215, 0, 0.7), inset 0 0 25px rgba(255, 215, 0, 0.4) !important;
            }

            .card-dark {
                filter: brightness(0.8) contrast(1.5) drop-shadow(0 0 20px rgba(100, 0, 200, 0.8)) !important;
                box-shadow: 0 0 30px rgba(100, 0, 200, 0.6), inset 0 0 20px rgba(50, 0, 100, 0.4) !important;
            }

            .card-white {
                filter: brightness(1.4) contrast(1.2) drop-shadow(0 0 20px rgba(255, 255, 255, 0.9)) !important;
                box-shadow: 0 0 30px rgba(255, 255, 255, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.4) !important;
            }

            /* 강화된 카드 호버 시 필터 유지 */
            .card-blue:hover,
            .card-red:hover,
            .card-gold:hover,
            .card-dark:hover,
            .card-white:hover {
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }

            /* 손패 호버 시 더 부드러운 전환 */
            #hand-area .card {
                transition: all 0.2s ease;
            }

            #hand-area .card:hover {
                cursor: pointer;
                animation-play-state: paused !important;
                transform: translateY(-20px) scale(1.12) rotateZ(-2deg) !important;
                filter: drop-shadow(0 30px 40px rgba(0, 0, 0, 0.45)) !important;
            }
        `;
        document.head.appendChild(style);

        // 호버 시 같은 월 카드 하이라이트
        const highlightSameMonthCardsHover = (targetCard) => {
            // 모든 hover 클래스 제거
            document.querySelectorAll('.card.same-month-hover').forEach(card => {
                card.classList.remove('same-month-hover');
            });

            if (!targetCard || !targetCard.cardData) return;

            const targetMonth = targetCard.cardData.month;

            // 바닥의 같은 월 카드에 hover 클래스만 추가 (CSS 스타일 적용)
            document.querySelectorAll('#floor-area .card').forEach(card => {
                if (card.cardData && card.cardData.month === targetMonth) {
                    card.classList.add('same-month-hover');
                }
            });
        };

        // 클릭 시 같은 월 카드에 별 표시
        const highlightSameMonthCardsSelected = () => {
            // 모든 selected 클래스 제거
            document.querySelectorAll('.card.same-month-selected').forEach(card => {
                card.classList.remove('same-month-selected');
            });

            const selectedCard = document.querySelector('#hand-area .card.selected');
            if (!selectedCard || !selectedCard.cardData) return;

            const targetMonth = selectedCard.cardData.month;

            // 바닥의 같은 월 카드에 별 표시
            document.querySelectorAll('#floor-area .card').forEach(card => {
                if (card.cardData && card.cardData.month === targetMonth) {
                    card.classList.add('same-month-selected');
                }
            });
        };

        // 손패 카드 호버 이벤트 (더 안정적으로)
        document.addEventListener('mouseover', (e) => {
            // e.target이 Element인지 확인
            if (e.target && e.target.nodeType === 1) {
                // 손패 카드 또는 그 자식 요소에 마우스가 올라갔을 때
                const handCard = e.target.closest ? e.target.closest('#hand-area .card') : null;
                if (handCard && handCard.cardData) {
                    // 이미 호버 중인 카드가 아닐 때만 처리
                    if (!handCard.classList.contains('hovering')) {
                        // 모든 hovering 클래스 제거
                        document.querySelectorAll('.card.hovering').forEach(c => c.classList.remove('hovering'));
                        handCard.classList.add('hovering');
                        highlightSameMonthCardsHover(handCard);
                    }
                }
            }
        }, true);

        // 손패 영역 벗어날 때 호버 효과 제거
        document.addEventListener('mouseout', (e) => {
            // e.target이 Element인지 확인
            if (e.target && e.target.nodeType === 1) {
                const handCard = e.target.closest ? e.target.closest('#hand-area .card') : null;

                // 손패 카드에서 완전히 벗어났는지 확인
                if (handCard && handCard.classList.contains('hovering')) {
                    // 마우스가 다른 손패 카드로 이동했는지 확인
                    const relatedTarget = e.relatedTarget;
                    const newHandCard = relatedTarget && relatedTarget.closest ? relatedTarget.closest('#hand-area .card') : null;

                    if (!newHandCard || newHandCard !== handCard) {
                        handCard.classList.remove('hovering');

                        // 다른 손패 카드로 이동하지 않았다면 호버 효과 제거
                        if (!newHandCard) {
                            document.querySelectorAll('.card.same-month-hover').forEach(card => {
                                card.classList.remove('same-month-hover');
                            });
                        }
                    }
                }
            }
        }, true);

        // 손패 카드 클릭 이벤트 감지
        document.addEventListener('click', (e) => {
            // e.target이 Element인지 확인
            if (e.target && e.target.nodeType === 1 && e.target.closest) {
                const handCard = e.target.closest('#hand-area .card');
                if (handCard) {
                    // 흰색 파티클 효과 추가
                    const rect = handCard.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top + rect.height / 2;

                    if (window.createParticles) {
                        window.createParticles(x, y, '#FFFFFF', true); // 클릭 이벤트
                    }

                    // 잠시 후 별 표시 업데이트 (선택 상태가 변경된 후)
                    setTimeout(() => highlightSameMonthCardsSelected(), 50);
                }

                // 바닥 카드 클릭
                const floorCard = e.target.closest('#floor-area .card');
                if (floorCard) {
                    // 흰색 파티클 효과 추가
                    const rect = floorCard.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top + rect.height / 2;

                    if (window.createParticles) {
                        window.createParticles(x, y, '#FFFFFF', true); // 클릭 이벤트
                    }
                }
            }
        });

        // 카드 색상 감지 함수 (보주 강화된 카드만)
        const detectCardColor = (card) => {
            // gameState에서 카드 강화 정보 확인
            if (window.gameState && window.gameState.cardEnhancements && card.cardData) {
                const cardId = card.cardData.id;
                const enhancement = window.gameState.cardEnhancements[cardId];

                // 강화된 카드만 색상 반환
                if (enhancement) {
                    console.log(`Card ${cardId} has ${enhancement} enhancement`);
                    switch(enhancement) {
                        case 'blue':
                        case '청색':
                            return 'blue';
                        case 'red':
                        case '적색':
                            return 'red';
                        case 'gold':
                        case '황색':
                        case '황금':
                            return 'gold';
                        case 'black':
                        case '흑색':
                            return 'dark';
                        case 'white':
                        case '백색':
                            return 'white';
                        default:
                            return null;
                    }
                }
            }

            return null; // 강화되지 않은 카드는 null 반환
        };

        // 카드에 색상 클래스 적용
        const applyColorClass = (card) => {
            const color = detectCardColor(card);

            // 기존 색상 클래스 제거
            card.classList.remove('card-blue', 'card-red', 'card-gold', 'card-dark', 'card-white');

            // 강화된 카드에만 색상 클래스 추가
            if (color) {
                card.classList.add(`card-${color}`);
                // 강화 효과가 보이도록 z-index 상승
                card.style.zIndex = '10';
            }

            return color;
        };

        // 고급 부유 애니메이션 함수
        const advancedFloatAnimation = () => {
            const currentTime = performance.now() / 1000; // 초 단위로 변환

            // 손패 카드
            document.querySelectorAll('#hand-area .card').forEach((card, index) => {
                const cardId = `hand-${index}`;

                // 색상 클래스 적용
                if (!card.classList.contains('card-blue') &&
                    !card.classList.contains('card-red') &&
                    !card.classList.contains('card-gold') &&
                    !card.classList.contains('card-dark') &&
                    !card.classList.contains('card-white')) {
                    applyColorClass(card);
                }

                // 카드별 고유 상태 초기화
                if (!cardAnimationStates.has(cardId)) {
                    cardAnimationStates.set(cardId, {
                        phaseX: Math.random() * Math.PI * 2,
                        phaseY: Math.random() * Math.PI * 2,
                        phaseZ: Math.random() * Math.PI * 2,
                        phaseFloat: Math.random() * Math.PI * 2,
                        speedX: 0.5 + Math.random() * 0.5,
                        speedY: 0.3 + Math.random() * 0.4,
                        speedZ: 0.4 + Math.random() * 0.3,
                        speedFloat: 0.8 + Math.random() * 0.4,
                        ampX: 1.5 + Math.random() * 1,
                        ampY: 1 + Math.random() * 0.5,
                        ampZ: 0.5 + Math.random() * 0.5,
                        ampFloat: 6 + Math.random() * 3
                    });
                }

                const state = cardAnimationStates.get(cardId);

                // 여러 사인파 합성
                const rotateX =
                    Math.sin(currentTime * state.speedX + state.phaseX) * state.ampX +
                    Math.sin(currentTime * state.speedX * 2.3 + state.phaseX) * state.ampX * 0.3;

                const rotateY =
                    Math.cos(currentTime * state.speedY + state.phaseY) * state.ampY +
                    Math.sin(currentTime * state.speedY * 1.7 + state.phaseY) * state.ampY * 0.5;

                const rotateZ =
                    Math.sin(currentTime * state.speedZ + state.phaseZ) * state.ampZ;

                const floatY =
                    Math.sin(currentTime * state.speedFloat + state.phaseFloat) * state.ampFloat +
                    Math.cos(currentTime * state.speedFloat * 1.3 + state.phaseFloat) * state.ampFloat * 0.4 +
                    Math.sin(currentTime * state.speedFloat * 2.1 + state.phaseFloat) * state.ampFloat * 0.2;

                // 그림자 동적 계산
                const shadowY = 20 + floatY * 1.5;
                const shadowBlur = 25 + Math.abs(floatY);
                const shadowOpacity = 0.25 + Math.abs(floatY) / 40;

                // 강화된 카드인지 확인
                const isEnhanced = card.classList.contains('card-blue') ||
                                  card.classList.contains('card-red') ||
                                  card.classList.contains('card-gold') ||
                                  card.classList.contains('card-dark') ||
                                  card.classList.contains('card-white');

                if (card.classList.contains('selected')) {
                    // 선택된 카드는 더 활발한 움직임
                    const selectedTransform = `
                        translateY(${floatY - 15}px)
                        translateZ(30px)
                        rotateX(${rotateX * 1.5}deg)
                        rotateY(${rotateY * 1.5}deg)
                        rotateZ(${rotateZ * 2}deg)
                        scale(1.1)
                    `;
                    card.style.transform = selectedTransform;
                    card.style.boxShadow = `0 ${shadowY + 10}px ${shadowBlur + 10}px rgba(76, 175, 80, ${shadowOpacity + 0.2})`;
                    card.style.zIndex = '200';
                } else if (!card.matches(':hover')) {
                    const transform = `
                        translateY(${floatY}px)
                        translateZ(10px)
                        rotateX(${rotateX}deg)
                        rotateY(${rotateY}deg)
                        rotateZ(${rotateZ}deg)
                    `;
                    card.style.transform = transform;

                    if (!isEnhanced) {
                        // 일반 카드는 그림자 효과
                        card.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`;
                    }
                }
            });

            // 바닥 카드 및 스택 컨테이너
            const floorElements = [];
            const floorArea = document.getElementById('floor-area');

            if (floorArea) {
                // 직접 자식 요소들을 확인
                Array.from(floorArea.children).forEach(child => {
                    if (child.style.position === 'relative' && child.querySelector('.card')) {
                        // 스택 컨테이너
                        floorElements.push({
                            element: child,
                            type: 'stack',
                            cards: child.querySelectorAll('.card')
                        });
                    } else if (child.classList.contains('card')) {
                        // 단일 카드
                        floorElements.push({
                            element: child,
                            type: 'single',
                            cards: [child]
                        });
                    }
                });
            }

            floorElements.forEach((item, index) => {
                const cardId = `floor-${index}`;
                const element = item.element;
                const isStack = item.type === 'stack';

                // 색상 클래스는 카드에만 적용
                if (!isStack && element.classList && element.classList.contains('card')) {
                    if (!element.classList.contains('card-blue') &&
                        !element.classList.contains('card-red') &&
                        !element.classList.contains('card-gold') &&
                        !element.classList.contains('card-dark') &&
                        !element.classList.contains('card-white')) {
                        applyColorClass(element);
                    }
                }

                // 카드별 고유 상태 초기화 (손패와 동일한 움직임)
                if (!cardAnimationStates.has(cardId)) {
                    cardAnimationStates.set(cardId, {
                        phaseX: Math.random() * Math.PI * 2,
                        phaseY: Math.random() * Math.PI * 2,
                        phaseZ: Math.random() * Math.PI * 2,
                        phaseFloat: Math.random() * Math.PI * 2,
                        speedX: 0.5 + Math.random() * 0.5,
                        speedY: 0.3 + Math.random() * 0.4,
                        speedZ: 0.4 + Math.random() * 0.3,
                        speedFloat: 0.8 + Math.random() * 0.4,
                        ampX: 1.5 + Math.random() * 1,
                        ampY: 1 + Math.random() * 0.5,
                        ampZ: 0.5 + Math.random() * 0.5,
                        ampFloat: 6 + Math.random() * 3
                    });
                }

                const state = cardAnimationStates.get(cardId);

                // 여러 사인파 합성 (손패와 동일한 움직임)
                const rotateX =
                    Math.sin(currentTime * state.speedX + state.phaseX) * state.ampX +
                    Math.sin(currentTime * state.speedX * 2.3 + state.phaseX) * state.ampX * 0.3;

                const rotateY =
                    Math.cos(currentTime * state.speedY + state.phaseY) * state.ampY +
                    Math.sin(currentTime * state.speedY * 1.7 + state.phaseY) * state.ampY * 0.5;

                const rotateZ =
                    Math.sin(currentTime * state.speedZ + state.phaseZ) * state.ampZ;

                const floatY =
                    Math.sin(currentTime * state.speedFloat + state.phaseFloat) * state.ampFloat +
                    Math.cos(currentTime * state.speedFloat * 1.3 + state.phaseFloat) * state.ampFloat * 0.4 +
                    Math.sin(currentTime * state.speedFloat * 2.1 + state.phaseFloat) * state.ampFloat * 0.2;

                // 그림자 동적 계산 (스택은 더 진한 그림자)
                const shadowY = isStack ? 25 + floatY * 1.5 : 20 + floatY * 1.5;
                const shadowBlur = isStack ? 30 + Math.abs(floatY) : 25 + Math.abs(floatY);
                const shadowOpacity = isStack ? 0.35 + Math.abs(floatY) / 40 : 0.25 + Math.abs(floatY) / 40;

                // 호버나 특수 효과가 있는 경우 처리
                if (!element.matches(':hover') && !element.classList.contains('same-month-hover')) {
                    // 강화된 카드인지 확인 (스택의 경우 첫 번째 카드 확인)
                    const checkCard = isStack ? item.cards[0] : element;
                    const isEnhanced = checkCard && (
                        checkCard.classList.contains('card-blue') ||
                        checkCard.classList.contains('card-red') ||
                        checkCard.classList.contains('card-gold') ||
                        checkCard.classList.contains('card-dark') ||
                        checkCard.classList.contains('card-white')
                    );

                    if (element.classList.contains('same-month-selected') ||
                        (isStack && item.cards[0] && item.cards[0].classList.contains('same-month-selected'))) {
                        // 선택된 같은 월 카드는 더 활발한 움직임
                        const selectedTransform = `
                            translateY(${floatY - 15}px)
                            translateZ(30px)
                            rotateX(${rotateX * 1.5}deg)
                            rotateY(${rotateY * 1.5}deg)
                            rotateZ(${rotateZ * 2}deg)
                            scale(1.1)
                        `;
                        element.style.transform = selectedTransform;
                        element.style.boxShadow = `0 ${shadowY + 10}px ${shadowBlur + 10}px rgba(76, 175, 80, ${shadowOpacity + 0.2})`;
                    } else {
                        const transform = `
                            translateY(${floatY}px)
                            translateZ(10px)
                            rotateX(${rotateX}deg)
                            rotateY(${rotateY}deg)
                            rotateZ(${rotateZ}deg)
                        `;
                        element.style.transform = transform;

                        if (!isEnhanced) {
                            // 일반 카드/스택은 그림자 효과
                            element.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`;
                        }
                    }
                }
            });

            // 사용하지 않는 ID 정리
            if (cardAnimationStates.size > 50) {
                const activeIds = new Set();
                document.querySelectorAll('#hand-area .card').forEach((_, i) => activeIds.add(`hand-${i}`));
                floorElements.forEach((_, i) => activeIds.add(`floor-${i}`));

                for (const [id] of cardAnimationStates) {
                    if (!activeIds.has(id)) {
                        cardAnimationStates.delete(id);
                    }
                }
            }
        };

        // 애니메이션 루프 시작
        const animationLoop = () => {
            advancedFloatAnimation();
            requestAnimationFrame(animationLoop);
        };
        requestAnimationFrame(animationLoop);

        // 주기적으로 선택 상태만 체크 (게임 상태 변경 대응)
        setInterval(() => highlightSameMonthCardsSelected(), 500);
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
        // 클릭용 파티클 (카드 위에 표시) - 항상 흰색
        window.createParticles = (x, y, color = '#FFFFFF', isClick = true) => {
            // 기본값을 true로 변경하여 기존 클릭 이벤트가 카드 위에 표시되도록 유지
            if (!isClick) {
                // 바닥 충돌용은 별도 함수 사용
                window.createFloorParticles(x, y, color);
                return;
            }

            // 클릭 파티클은 항상 흰색, 8개
            const particleCount = 8;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                const size = 3 + Math.random() * 2; // 작은 크기

                particle.style.cssText = `
                    position: fixed;
                    width: ${size}px;
                    height: ${size}px;
                    background: radial-gradient(circle, #FFFFFF, transparent);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    left: ${x}px;
                    top: ${y}px;
                    box-shadow: 0 0 ${size}px #FFFFFF;
                `;

                document.body.appendChild(particle);

                const angle = (Math.PI * 2 * i) / particleCount;
                const velocity = 2.5 + Math.random() * 1.5; // 중간 속도
                const lifetime = 350 + Math.random() * 125; // 빠르게 사라짐

                let opacity = 1;
                let currentX = x;
                let currentY = y;
                let scale = 1;

                // 원형으로 모든 방향으로 퍼지도록 설정
                const horizontalVelocity = Math.cos(angle) * velocity;
                const verticalVelocity = Math.sin(angle) * velocity; // sin을 사용해 위아래로도 퍼짐
                let velocityY = verticalVelocity - 2; // 초기 속도 (위쪽 바이어스 약간)
                const gravity = 0.25; // 중력 약간 증가
                const startTime = performance.now();

                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = elapsed / lifetime;

                    if (progress < 1) {
                        // 파티클이 원형으로 퍼짐 (더 빠르게)
                        currentX += horizontalVelocity * (1 - progress * 0.3); // 0.5에서 0.3으로 감소

                        // 50% 지점까지는 초기 방향대로, 그 이후는 아래로
                        if (progress < 0.5) {
                            // 초기 방향으로 이동
                            currentY += velocityY;
                            velocityY *= 0.92; // 더 빠르게 감속
                        } else {
                            // 아래로 떨어짐 (중력 효과)
                            velocityY += gravity;
                            currentY += velocityY;
                        }

                        opacity = 1 - progress * 0.9; // 더 빨리 페이드 아웃
                        scale = 1 + progress * 0.5; // 점점 커짐

                        particle.style.left = currentX + 'px';
                        particle.style.top = currentY + 'px';
                        particle.style.opacity = opacity;
                        particle.style.transform = `scale(${scale})`;

                        requestAnimationFrame(animate);
                    } else {
                        particle.remove();
                    }
                };

                requestAnimationFrame(animate);
            }
        };

        // 바닥 충돌용 파티클 (카드 뒤에 표시)
        window.createFloorParticles = (x, y, color = '#FFFFFF') => {
            const isGold = color === '#FFD700';
            const particleCount = isGold ? 30 : 8; // 황금색은 더 많이 (화려하게)

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                const size = isGold ? (6 + Math.random() * 3) : (3 + Math.random() * 2); // 황금색 크기 줄임

                // 황금색은 더 화려한 그라데이션
                const gradient = isGold ?
                    `radial-gradient(circle, #FFFF00, ${color}, transparent)` :
                    `radial-gradient(circle, ${color}, transparent)`;

                particle.style.cssText = `
                    position: fixed;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${gradient};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 30;
                    left: ${x}px;
                    top: ${y}px;
                    box-shadow: 0 0 ${size * (isGold ? 2 : 1)}px ${color};
                `;

                document.body.appendChild(particle);

                const angle = (Math.PI * 2 * i) / particleCount;
                const velocity = isGold ? (5 + Math.random() * 3) : (2.5 + Math.random() * 1.5); // 클릭과 동일한 속도
                const lifetime = isGold ? (1200 + Math.random() * 400) : (700 + Math.random() * 250); // 클릭과 동일한 수명

                let opacity = 1;
                let currentX = x;
                let currentY = y;
                let scale = 1;

                // 클릭 파티클과 동일한 움직임
                const horizontalVelocity = Math.cos(angle) * velocity;
                const verticalVelocity = Math.sin(angle) * velocity;
                let velocityY = verticalVelocity - 2;
                const gravity = 0.25;
                const startTime = performance.now();

                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = elapsed / lifetime;

                    if (progress < 1) {
                        // 클릭 파티클과 동일한 움직임
                        currentX += horizontalVelocity * (1 - progress * 0.3);

                        if (progress < 0.5) {
                            currentY += velocityY;
                            velocityY *= 0.92;
                        } else {
                            velocityY += gravity;
                            currentY += velocityY;
                        }

                        opacity = 1 - progress * 0.9;
                        scale = 1 + progress * 0.5;

                        // 황금색은 반짝임 효과 추가
                        if (isGold && Math.random() > 0.7) {
                            particle.style.filter = `brightness(${1.5 + Math.random() * 0.5})`;
                        }

                        particle.style.left = currentX + 'px';
                        particle.style.top = currentY + 'px';
                        particle.style.opacity = opacity;
                        particle.style.transform = `scale(${scale})`;

                        requestAnimationFrame(animate);
                    } else {
                        particle.remove();
                    }
                };

                requestAnimationFrame(animate);
            }
        };

        // playCard 함수 래핑을 위한 함수
        function wrapPlayCardFunction() {
            if (typeof window.playCard === 'function' && !window.playCard._particleWrapped) {
                console.log('Wrapping playCard function for particles');
                const originalPlayCard = window.playCard;

                window.playCard = function() {
                    console.log('playCard called - preparing particles');

                    // 현재 선택된 카드 정보 저장
                    const selectedCard = document.querySelector('#hand-area .card.selected');
                    let selectedMonth = null;

                    if (selectedCard) {
                        // cardData가 있으면 사용, 없으면 이미지 경로에서 추출
                        if (selectedCard.cardData) {
                            selectedMonth = selectedCard.cardData.month;
                        } else {
                            // 이미지 경로에서 월 정보 추출 (예: "1-1.png"에서 1)
                            const img = selectedCard.querySelector('img');
                            if (img && img.src) {
                                const match = img.src.match(/(\d+)-\d+\.png/);
                                if (match) {
                                    selectedMonth = parseInt(match[1]);
                                }
                            }
                        }
                        console.log('Selected card month:', selectedMonth);
                    }

                    // 바닥 카드 수 기록
                    const beforeFloorCount = document.querySelectorAll('#floor-area .card').length;

                    // 원래 함수 실행
                    const result = originalPlayCard.apply(this, arguments);

                    // 카드가 바닥에 추가된 후 파티클 효과
                    setTimeout(() => {
                        const afterFloorCards = document.querySelectorAll('#floor-area .card');
                        const afterFloorCount = afterFloorCards.length;

                        console.log(`Floor cards: before=${beforeFloorCount}, after=${afterFloorCount}`);

                        // 선택된 카드가 있었을 때
                        if (selectedMonth !== null) {
                            // 같은 월 카드가 있는지 확인
                            let hasSameMonth = false;
                            let matchingCard = null;

                            console.log(`Checking for same month cards. Selected month: ${selectedMonth}, Total floor cards: ${afterFloorCards.length}`);

                            for (let i = 0; i < afterFloorCards.length; i++) {
                                const card = afterFloorCards[i];
                                let cardMonth = null;

                                if (card.cardData) {
                                    cardMonth = card.cardData.month;
                                } else {
                                    const img = card.querySelector('img');
                                    if (img && img.src) {
                                        const match = img.src.match(/(\d+)-\d+\.png/);
                                        if (match) {
                                            cardMonth = parseInt(match[1]);
                                        }
                                    }
                                }

                                console.log(`Card ${i}: month=${cardMonth}, selectedMonth=${selectedMonth}, match=${cardMonth === selectedMonth}`);

                                // 같은 월 카드 찾기
                                if (cardMonth === selectedMonth) {
                                    // 방금 놓인 카드가 아닌 기존 카드 중에 같은 월이 있는지 확인
                                    // 마지막 카드가 방금 놓인 카드일 가능성이 높음
                                    if (i < afterFloorCards.length - 1 || afterFloorCount <= beforeFloorCount) {
                                        hasSameMonth = true;
                                        matchingCard = card;
                                        console.log(`Found matching month! Card at index ${i} matches month ${selectedMonth}`);
                                        break;
                                    }
                                }
                            }

                            console.log(`Has same month: ${hasSameMonth}, Matching card: ${matchingCard ? 'found' : 'not found'}`);

                            // 파티클 생성 위치 결정
                            if (hasSameMonth && matchingCard) {
                                // 황금색 파티클 - 첫 번째 매칭된 카드 위치
                                const rect = matchingCard.getBoundingClientRect();
                                const x = rect.left + rect.width / 2;
                                const y = rect.top + rect.height / 2;
                                console.log(`Creating GOLD particles at matching card: ${x}, ${y}`);
                                window.createParticles(x, y, '#FFD700', false); // 바닥 충돌
                            } else {
                                // 파란색 파티클 - 새로 놓인 카드 위치 찾기
                                // 방금 플레이한 카드의 월과 같은 카드 찾기 (가장 마지막 것)
                                let newCardElement = null;

                                // 역순으로 검색하여 방금 추가된 카드 찾기
                                for (let i = afterFloorCards.length - 1; i >= 0; i--) {
                                    const card = afterFloorCards[i];
                                    let cardMonth = null;

                                    if (card.cardData) {
                                        cardMonth = card.cardData.month;
                                    } else {
                                        const img = card.querySelector('img');
                                        if (img && img.src) {
                                            const match = img.src.match(/(\d+)-\d+\.png/);
                                            if (match) {
                                                cardMonth = parseInt(match[1]);
                                            }
                                        }
                                    }

                                    if (cardMonth === selectedMonth) {
                                        newCardElement = card;
                                        break;
                                    }
                                }

                                // 못 찾았으면 마지막 카드 사용
                                if (!newCardElement) {
                                    newCardElement = afterFloorCards[afterFloorCards.length - 1];
                                }

                                if (newCardElement) {
                                    const rect = newCardElement.getBoundingClientRect();
                                    const x = rect.left + rect.width / 2;
                                    const y = rect.top + rect.height / 2;
                                    console.log(`Creating WHITE particles at new card: ${x}, ${y}`);
                                    window.createParticles(x, y, '#FFFFFF', false); // 바닥 충돌
                                }
                            }

                            // 사운드 효과
                            if (window.soundManager) {
                                if (hasSameMonth) {
                                    window.soundManager.playRareCard();
                                } else {
                                    window.soundManager.playCardPlay();
                                }
                            }
                        }
                    }, 300); // 카드 이동 애니메이션 완료 대기

                    return result;
                };

                window.playCard._particleWrapped = true;
                console.log('playCard function wrapped successfully');
                return true;
            }
            return false;
        }

        // showDeckCardAnimation 함수 래핑을 위한 함수
        function wrapDeckCardFunction() {
            if (typeof window.showDeckCardAnimation === 'function' && !window.showDeckCardAnimation._particleWrapped) {
                console.log('Wrapping showDeckCardAnimation function for particles');
                const originalShowDeckCard = window.showDeckCardAnimation;

                window.showDeckCardAnimation = function(card) {
                    console.log('Deck card animation called - preparing particles');

                    // 덱에서 나온 카드의 월 정보
                    const deckCardMonth = card ? card.month : null;
                    console.log('Deck card month:', deckCardMonth);

                    // 원래 함수 실행
                    const result = originalShowDeckCard.apply(this, arguments);

                    // 파티클 효과
                    if (deckCardMonth !== null) {
                        setTimeout(() => {
                            const floorCards = document.querySelectorAll('#floor-area .card');

                            // 같은 월 카드가 있는지 확인 (방금 추가된 카드 제외)
                            let hasSameMonth = false;
                            let matchingCard = null;

                            for (let i = 0; i < floorCards.length - 1; i++) {
                                const card = floorCards[i];
                                let cardMonth = null;

                                if (card.cardData) {
                                    cardMonth = card.cardData.month;
                                } else {
                                    const img = card.querySelector('img');
                                    if (img && img.src) {
                                        const match = img.src.match(/(\d+)-\d+\.png/);
                                        if (match) {
                                            cardMonth = parseInt(match[1]);
                                        }
                                    }
                                }

                                if (cardMonth === deckCardMonth) {
                                    hasSameMonth = true;
                                    matchingCard = card;
                                    break;
                                }
                            }

                            // 파티클 생성 위치 결정
                            const targetCard = hasSameMonth ? matchingCard : floorCards[floorCards.length - 1];

                            if (targetCard) {
                                const rect = targetCard.getBoundingClientRect();
                                const x = rect.left + rect.width / 2;
                                const y = rect.top + rect.height / 2;
                                const color = hasSameMonth ? '#FFD700' : '#FFFFFF';

                                console.log(`Creating deck card particles at: ${x}, ${y}, Color: ${color}`);
                                window.createParticles(x, y, color, false); // 바닥 충돌

                                // 사운드 효과
                                if (window.soundManager) {
                                    if (hasSameMonth) {
                                        window.soundManager.playRareCard();
                                    } else {
                                        window.soundManager.playCardPlay();
                                    }
                                }
                            }
                        }, 700); // 덱 카드 애니메이션 (0.1초 빠르게)
                    }

                    return result;
                };

                window.showDeckCardAnimation._particleWrapped = true;
                console.log('showDeckCardAnimation function wrapped successfully');
                return true;
            }
            return false;
        }

        // 초기 시도
        if (!wrapPlayCardFunction()) {
            console.log('playCard not found, setting up retry...');
        }

        if (!wrapDeckCardFunction()) {
            console.log('showDeckCardAnimation not found, setting up retry...');
        }

        // 여러 번 재시도
        let retryCount = 0;
        const retryInterval = setInterval(() => {
            retryCount++;
            let playCardWrapped = window.playCard && window.playCard._particleWrapped;
            let deckCardWrapped = window.showDeckCardAnimation && window.showDeckCardAnimation._particleWrapped;

            if (!playCardWrapped) {
                playCardWrapped = wrapPlayCardFunction();
            }

            if (!deckCardWrapped) {
                deckCardWrapped = wrapDeckCardFunction();
            }

            if (playCardWrapped && deckCardWrapped) {
                clearInterval(retryInterval);
                console.log(`All functions wrapped after ${retryCount} retries`);
            } else if (retryCount > 20) {
                clearInterval(retryInterval);
                console.warn(`Failed to wrap functions after 20 retries. playCard: ${playCardWrapped}, deckCard: ${deckCardWrapped}`);
            }
        }, 500); // 0.5초마다 재시도

        // MutationObserver로 바닥 영역 감시
        const floorArea = document.getElementById('floor-area');
        if (floorArea) {
            console.log('Setting up floor area observer');

            const observer = new MutationObserver((mutations) => {
                console.log('Mutation detected in floor area');

                const currentFloorCards = floorArea.querySelectorAll('.card');
                const currentCount = currentFloorCards.length;

                console.log(`Floor cards: before=${lastFloorCardCount}, after=${currentCount}, lastPlayedCard=`, lastPlayedCard);

                // 카드가 추가되었을 때
                if (currentCount > lastFloorCardCount) {
                    console.log('Card count increased!');

                    // lastPlayedCard가 없어도 파티클 생성 시도
                    let cardMonth = null;

                    if (lastPlayedCard) {
                        cardMonth = lastPlayedCard.month;
                    } else {
                        // 방금 추가된 카드에서 정보 가져오기
                        const newCard = currentFloorCards[currentFloorCards.length - 1];
                        if (newCard && newCard.cardData) {
                            cardMonth = newCard.cardData.month;
                            console.log('Getting month from new card:', cardMonth);
                        }
                    }

                    if (cardMonth !== null) {
                        // 같은 월 카드 찾기
                        const hasSameMonth = Array.from(currentFloorCards).some((card, index) =>
                            card.cardData &&
                            card.cardData.month === cardMonth &&
                            index < currentFloorCards.length - 1 // 방금 놓인 카드 제외
                        );

                        console.log(`Same month check: month=${cardMonth}, hasSameMonth=${hasSameMonth}`);

                        // 파티클 생성 위치 결정
                        let targetCard = null;

                        if (hasSameMonth) {
                            // 같은 월 카드 위치
                            targetCard = Array.from(currentFloorCards).find(card =>
                                card.cardData &&
                                card.cardData.month === cardMonth
                            );
                        } else {
                            // 새로 놓인 카드 위치
                            targetCard = currentFloorCards[currentFloorCards.length - 1];
                        }

                        if (targetCard) {
                            console.log('Target card found, waiting for animation...');

                            // 애니메이션이 완료될 때까지 대기
                            setTimeout(() => {
                                const rect = targetCard.getBoundingClientRect();
                                const targetX = rect.left + rect.width / 2;
                                const targetY = rect.top + rect.height / 2;

                                // 파티클 생성
                                const particleColor = hasSameMonth ? '#FFD700' : '#FFFFFF';
                                console.log('Creating particles NOW at:', targetX, targetY, 'Color:', particleColor);

                                if (window.createParticles) {
                                    window.createParticles(targetX, targetY, particleColor, false); // 바닥 충돌
                                    console.log('Particles should be visible now!');

                                    // 사운드 효과
                                    if (window.soundManager) {
                                        if (hasSameMonth) {
                                            window.soundManager.playRareCard();
                                        } else {
                                            window.soundManager.playCardPlay();
                                        }
                                    }
                                } else {
                                    console.error('createParticles function not found!');
                                }
                            }, 600); // 카드 애니메이션 완료 대기
                        } else {
                            console.log('Target card not found');
                        }
                    }

                    lastPlayedCard = null; // 처리 완료
                }

                lastFloorCardCount = currentCount;
            });

            observer.observe(floorArea, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });

            // 초기 카드 수 저장
            lastFloorCardCount = floorArea.querySelectorAll('.card').length;
            console.log('Initial floor card count:', lastFloorCardCount);
        }
    };

    // === 모든 개선 기능 실행 ===
    improveCardAnimations();
    // addScoreAnimations(); // 점수 표시 문제로 일시 비활성화
    improveButtons();
    addGameFeedback();
    addParticleEffects();


    console.log('✨ 게임 개선 기능 초기화 완료!');

    // 파티클 테스트용 (개발자 콘솔에서 testParticles() 실행)
    window.testParticles = () => {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        console.log('Testing particles at center:', x, y);
        if (window.createParticles) {
            window.createParticles(x, y, '#FFD700', true); // 테스트용
            setTimeout(() => {
                window.createParticles(x + 100, y, '#FFFFFF', true); // 테스트용
            }, 500);
            console.log('Particles created successfully');
        } else {
            console.error('createParticles function not found!');
        }
    };
});