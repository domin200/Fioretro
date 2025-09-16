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
                transition: all 0.3s ease !important;
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

            /* 손패 호버 시 더 부드러운 전환 */
            #hand-area .card {
                transition: all 0.2s ease;
            }

            #hand-area .card:hover {
                cursor: pointer;
                transform: translateY(-12px) scale(1.1) !important;
            }
        `;
        document.head.appendChild(style);

        // 선택된 카드와 같은 월의 바닥 카드 하이라이트
        const highlightSameMonthCards = (targetCard = null) => {
            // 모든 same-month 클래스 제거
            document.querySelectorAll('.card.same-month').forEach(card => {
                card.classList.remove('same-month');
            });

            // 대상 카드 결정 (호버된 카드 또는 선택된 카드)
            const cardToCheck = targetCard || document.querySelector('#hand-area .card.selected');
            if (!cardToCheck || !cardToCheck.cardData) return;

            const targetMonth = cardToCheck.cardData.month;

            // 바닥의 같은 월 카드에 하이라이트 적용
            document.querySelectorAll('#floor-area .card').forEach(card => {
                if (card.cardData && card.cardData.month === targetMonth) {
                    card.classList.add('same-month');
                }
            });
        };

        // 손패 카드 호버 이벤트
        document.addEventListener('mouseenter', (e) => {
            // e.target이 Element인지 확인
            if (e.target && e.target.nodeType === 1) {
                const handCard = e.target.closest ? e.target.closest('#hand-area .card') : null;
                if (handCard) {
                    highlightSameMonthCards(handCard);
                }
            }
        }, true);

        // 손패 영역 벗어날 때 선택된 카드로 복원
        document.addEventListener('mouseleave', (e) => {
            // e.target이 Element인지 확인
            if (e.target && e.target.nodeType === 1) {
                const handCard = e.target.closest ? e.target.closest('#hand-area .card') : null;
                if (handCard) {
                    // 선택된 카드가 있으면 그걸로 복원, 없으면 하이라이트 제거
                    highlightSameMonthCards();
                }
            }
        }, true);

        // 손패 카드 클릭 이벤트 감지
        document.addEventListener('click', (e) => {
            // e.target이 Element인지 확인
            if (e.target && e.target.nodeType === 1 && e.target.closest) {
                const handCard = e.target.closest('#hand-area .card');
                if (handCard) {
                    // 잠시 후 하이라이트 업데이트 (선택 상태가 변경된 후)
                    setTimeout(() => highlightSameMonthCards(), 50);
                }
            }
        });

        // 주기적으로 체크 (게임 상태 변경 대응)
        setInterval(() => highlightSameMonthCards(), 500);
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
            const isGold = color === '#FFD700';
            const particleCount = isGold ? 20 : 12; // 황금색은 더 많은 파티클

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                const size = isGold ? (8 + Math.random() * 4) : (4 + Math.random() * 3);

                particle.style.cssText = `
                    position: fixed;
                    width: ${size}px;
                    height: ${size}px;
                    background: radial-gradient(circle, ${color}, transparent);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    left: ${x}px;
                    top: ${y}px;
                    box-shadow: 0 0 ${size}px ${color};
                `;

                document.body.appendChild(particle);

                const angle = (Math.PI * 2 * i) / particleCount;
                const velocity = isGold ? (4 + Math.random() * 3) : (2 + Math.random() * 2);
                const lifetime = isGold ? (1500 + Math.random() * 500) : (1000 + Math.random() * 500);

                let opacity = 1;
                let currentX = x;
                let currentY = y;
                let scale = 1;
                const startTime = performance.now();

                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = elapsed / lifetime;

                    if (progress < 1) {
                        // 파티클이 위로 올라가면서 퍼짐
                        currentX += Math.cos(angle) * velocity * (1 - progress * 0.5);
                        currentY += Math.sin(angle) * velocity - progress * 3; // 위로 올라가는 효과
                        opacity = 1 - progress * 0.8;
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

                        // 카드가 추가되었을 때만
                        if (afterFloorCount > beforeFloorCount && selectedMonth !== null) {
                            // 같은 월 카드가 있는지 확인 (새로 추가된 카드 제외)
                            let hasSameMonth = false;
                            let matchingCard = null;

                            for (let i = 0; i < afterFloorCards.length - 1; i++) {
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
                                    hasSameMonth = true;
                                    matchingCard = card;
                                    break;
                                }
                            }

                            // 파티클 생성 위치 결정
                            const targetCard = hasSameMonth ? matchingCard : afterFloorCards[afterFloorCards.length - 1];

                            if (targetCard) {
                                const rect = targetCard.getBoundingClientRect();
                                const x = rect.left + rect.width / 2;
                                const y = rect.top + rect.height / 2;
                                const color = hasSameMonth ? '#FFD700' : '#4169E1';

                                console.log(`Creating particles at: ${x}, ${y}, Color: ${color}, Same month: ${hasSameMonth}`);
                                window.createParticles(x, y, color);

                                // 사운드 효과
                                if (window.soundManager) {
                                    if (hasSameMonth) {
                                        window.soundManager.playRareCard();
                                    } else {
                                        window.soundManager.playCardPlay();
                                    }
                                }
                            }
                        }
                    }, 800); // 카드 이동 애니메이션 완료 대기

                    return result;
                };

                window.playCard._particleWrapped = true;
                console.log('playCard function wrapped successfully');
                return true;
            }
            return false;
        }

        // 초기 시도
        if (!wrapPlayCardFunction()) {
            console.log('playCard not found, setting up retry...');

            // 여러 번 재시도
            let retryCount = 0;
            const retryInterval = setInterval(() => {
                retryCount++;
                if (wrapPlayCardFunction()) {
                    clearInterval(retryInterval);
                    console.log(`playCard wrapped after ${retryCount} retries`);
                } else if (retryCount > 20) {
                    clearInterval(retryInterval);
                    console.warn('Failed to wrap playCard after 20 retries');
                }
            }, 500); // 0.5초마다 재시도
        }

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
                                const particleColor = hasSameMonth ? '#FFD700' : '#4169E1';
                                console.log('Creating particles NOW at:', targetX, targetY, 'Color:', particleColor);

                                if (window.createParticles) {
                                    window.createParticles(targetX, targetY, particleColor);
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
            window.createParticles(x, y, '#FFD700');
            setTimeout(() => {
                window.createParticles(x + 100, y, '#4169E1');
            }, 500);
            console.log('Particles created successfully');
        } else {
            console.error('createParticles function not found!');
        }
    };
});