// 3D 카드 컴포넌트 및 향상된 애니메이션 효과

// 파티클 효과 추가 함수
function addParticleEffect(element) {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';

    // 5개의 파티클 생성
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 3}s`;
        particleContainer.appendChild(particle);
    }

    element.appendChild(particleContainer);
}

// 향상된 카드 생성 함수
window.createEnhancedCardElement = function(card, options = {}) {
    const { use3D = false, showFlipAnimation = false } = options;

    // 3D 카드 구조 사용
    if (use3D) {
        const container = document.createElement('div');
        container.className = 'card-3d';
        container.cardData = card;

        const inner = document.createElement('div');
        inner.className = 'card__inner';

        // 카드 뒷면
        const back = document.createElement('div');
        back.className = 'card__face card__face--back';
        back.style.backgroundImage = 'url("new card/back.png")';
        back.style.backgroundSize = 'cover';
        back.style.backgroundPosition = 'center';

        // 카드 앞면
        const front = document.createElement('div');
        front.className = 'card__face card__face--front';

        // 카드 이미지 설정
        const imageName = getCardImageName(card);
        if (imageName) {
            front.style.backgroundImage = `url('new card/${imageName}')`;
            front.style.backgroundSize = 'cover';
            front.style.backgroundPosition = 'center';
        }

        // 카드 정보 오버레이
        const overlay = createCardOverlay(card);
        front.appendChild(overlay);

        inner.appendChild(back);
        inner.appendChild(front);
        container.appendChild(inner);

        // 강화 효과 적용
        applyEnhancementEffects(container, card);

        // 희귀 카드 효과 (광 카드)
        if (card.type === '광') {
            container.classList.add('rare');
            addParticleEffect(container);
        }

        // 플립 애니메이션 트리거
        if (showFlipAnimation) {
            setTimeout(() => {
                container.classList.add('flipped');
            }, 100);
        }

        // 클릭 이벤트로 카드 뒤집기
        container.addEventListener('click', () => {
            container.classList.toggle('flipped');
        });

        return container;
    }

    // 기존 2D 카드로 폴백
    return window.createCardElement(card);
};

// 카드 이미지 이름 가져오기
function getCardImageName(card) {
    let imageName = '';

    // 월별로 파일명 매핑
    if (card.month === 1) {
        if (card.type === '광') imageName = '1_일광.png';
        else if (card.type === '홍단') imageName = '1_띠.png';
        else if (card.id === 3) imageName = '1_피1.png';
        else if (card.id === 4) imageName = '1_피2.png';
    } else if (card.month === 2) {
        if (card.type === '열끗') imageName = '2_끗.png';
        else if (card.type === '홍단') imageName = '2_띠.png';
        else if (card.id === 7) imageName = '2_피1.png';
        else if (card.id === 8) imageName = '2_피2.png';
    } else if (card.month === 3) {
        if (card.type === '광') imageName = '3_삼광.png';
        else if (card.type === '홍단') imageName = '3_띠.png';
        else if (card.id === 11) imageName = '3_피1.png';
        else if (card.id === 12) imageName = '3_피2.png';
    } else if (card.month === 4) {
        if (card.type === '열끗') imageName = '4_끗.png';
        else if (card.type === '초단') imageName = '4_띠.png';
        else if (card.id === 15) imageName = '4_피1.png';
        else if (card.id === 16) imageName = '4_피2.png';
    } else if (card.month === 5) {
        if (card.type === '열끗') imageName = '5_끗.png';
        else if (card.type === '초단') imageName = '5_띠.png';
        else if (card.id === 19) imageName = '5_피1.png';
        else if (card.id === 20) imageName = '5_피2.png';
    } else if (card.month === 6) {
        if (card.type === '열끗') imageName = '6_끗.png';
        else if (card.type === '청단') imageName = '6_띠.png';
        else if (card.id === 23) imageName = '6_피1.png';
        else if (card.id === 24) imageName = '6_피2.png';
    } else if (card.month === 7) {
        if (card.type === '열끗') imageName = '7_끗.png';
        else if (card.type === '초단') imageName = '7_띠.png';
        else if (card.id === 27) imageName = '7_피1.png';
        else if (card.id === 28) imageName = '7_피2.png';
    } else if (card.month === 8) {
        if (card.type === '광') imageName = '8_팔광.png';
        else if (card.type === '열끗') imageName = '8_끗.png';
        else if (card.id === 31) imageName = '8_피1.png';
        else if (card.id === 32) imageName = '8_피2.png';
    } else if (card.month === 9) {
        if (card.type === '열끗') imageName = '9_쌍피.png';
        else if (card.type === '청단') imageName = '9_띠.png';
        else if (card.id === 35) imageName = '9_피1.png';
        else if (card.id === 36) imageName = '9_피2.png';
    } else if (card.month === 10) {
        if (card.type === '열끗') imageName = '10_끗.png';
        else if (card.type === '청단') imageName = '10_띠.png';
        else if (card.id === 39) imageName = '10_피1.png';
        else if (card.id === 40) imageName = '10_피2.png';
    } else if (card.month === 11) {
        if (card.type === '광') imageName = '11_똥광.png';
        else if (card.type === '쌍피') imageName = '11_쌍피.png';
        else if (card.id === 43) imageName = '11_피1.png';
        else if (card.id === 44) imageName = '11_피2.png';
    } else if (card.month === 12) {
        if (card.type === '광') imageName = '12_비광.png';
        else if (card.type === '열끗') imageName = '12_끗.png';
        else if (card.type === '쌍피') imageName = '12_쌍피.png';
        else if (card.type === '피') imageName = '12_띠.png';
    }

    return imageName;
}

// 카드 정보 오버레이 생성
function createCardOverlay(card) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: absolute;
        bottom: 4px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 11px;
        white-space: nowrap;
        backdrop-filter: blur(2px);
    `;

    const enhancement = gameState.cardEnhancements?.[card.id];
    if (enhancement) {
        const gradientColors = {
            '청': 'linear-gradient(to right, #00bfff, #87ceeb, #00bfff)',
            '적': 'linear-gradient(to right, #ff4444, #ff7777, #ff4444)',
            '백': 'linear-gradient(to right, #ffffff, #f0f0f0, #ffffff)',
            '흑': 'linear-gradient(to right, #8b00ff, #da70d6, #8b00ff)',
            '황': 'linear-gradient(to right, #ffd700, #ffff99, #ffd700)'
        };

        overlay.innerHTML = `
            <span style="
                background: ${gradientColors[enhancement] || gradientColors['황']};
                background-size: 300% 100%;
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: gradient 3s linear infinite;
                font-weight: bold;
            ">${card.month}월 ${card.name}</span>
        `;
    } else {
        overlay.textContent = `${card.month}월 ${card.name}`;
    }

    return overlay;
}

// 강화 효과 적용
function applyEnhancementEffects(element, card) {
    const enhancement = gameState.cardEnhancements?.[card.id];
    if (!enhancement) return;

    element.classList.add(`enhanced-${enhancement.toLowerCase()}`);

    // 강화 아이콘 추가
    const enhanceData = Object.values(ENHANCEMENT_TYPES || {}).find(e => e.name === enhancement);
    if (enhanceData) {
        const icon = document.createElement('div');
        icon.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            width: 24px;
            height: 24px;
            background: ${enhanceData.color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: white;
            z-index: 10;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        `;
        icon.textContent = enhanceData.icon;
        element.appendChild(icon);

        // 툴팁 이벤트
        icon.addEventListener('mouseenter', (e) => {
            showEnhancementTooltip(e, enhancement, enhanceData);
        });
        icon.addEventListener('mouseleave', hideEnhancementTooltip);
    }
}

// GSAP Flip 애니메이션 헬퍼
window.animateCardMove = function(card, fromElement, toElement, onComplete) {
    if (typeof gsap === 'undefined' || !gsap.Flip) {
        // GSAP이 없으면 기본 애니메이션
        if (onComplete) onComplete();
        return;
    }

    // Flip 상태 저장
    const state = gsap.Flip.getState(card);

    // 카드를 목표 위치로 이동
    toElement.appendChild(card);

    // Flip 애니메이션 실행
    gsap.Flip.from(state, {
        duration: 0.6,
        ease: "power2.inOut",
        scale: true,
        onComplete: onComplete
    });
};

// 카드 드로우 애니메이션
window.animateCardDraw = function(card, deckElement, handElement, onComplete) {
    if (typeof gsap === 'undefined') {
        if (onComplete) onComplete();
        return;
    }

    const cardEl = createEnhancedCardElement(card, { use3D: true });
    cardEl.style.position = 'absolute';

    // 덱 위치에서 시작
    const deckRect = deckElement.getBoundingClientRect();
    gsap.set(cardEl, {
        left: deckRect.left,
        top: deckRect.top,
        scale: 0.5,
        rotation: -180
    });

    document.body.appendChild(cardEl);

    // 손패로 이동
    const handRect = handElement.getBoundingClientRect();
    gsap.to(cardEl, {
        left: handRect.left + handRect.width / 2 - 50,
        top: handRect.top,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        onComplete: () => {
            handElement.appendChild(cardEl);
            cardEl.style.position = '';
            if (onComplete) onComplete();
        }
    });

    // 뒤집기 애니메이션
    setTimeout(() => {
        cardEl.classList.add('flipped');
    }, 400);
};

// 희귀 카드 채도 펌핑 효과
window.applyRareCardEffect = function(cardElement) {
    if (typeof gsap === 'undefined') return;

    gsap.to(cardElement, {
        filter: "saturate(200%) brightness(110%)",
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
    });
};