// ===================================
// 1. 상수 및 설정 (Constants & Configuration)
// ===================================

const GAME_CONFIG = {
    INITIAL_HAND_SIZE: 5,
    INITIAL_FLOOR_SIZE: 1,
    INITIAL_DISCARDS: 4,
    INITIAL_TARGET_SCORE: 25,
    TARGET_MULTIPLIER: 1.3,
    ANIMATION_DURATION: {
        CARD_MOVE: 500,
        CARD_FLIP: 1000,
        SCORE_POPUP: 2500,
        UPGRADE_TRIGGER: 2000,
        TOP_CARD_PREVIEW: 3000
    },
    SOUND_PATHS: {
        CARD_START: 'se/allow1.ogg',
        CARD_ARRIVE: 'se/allow2.ogg'
    }
};

// ===================================
// 2. 유틸리티 함수 (Utility Functions)
// ===================================

const Utils = {
    // 배열 섞기
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },

    // 사운드 재생
    playSound(soundPath) {
        const audio = new Audio(soundPath);
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Sound play failed:', e));
    },

    // 요소 위치 가져오기
    getElementRect(element) {
        return element ? element.getBoundingClientRect() : null;
    },

    // 애니메이션 스타일 생성
    createAnimationStyle(name, keyframes) {
        const style = document.createElement('style');
        style.textContent = `@keyframes ${name} { ${keyframes} }`;
        document.head.appendChild(style);
        return style;
    },

    // 임시 요소 생성 및 제거
    createTempElement(html, cssText, duration) {
        const element = document.createElement('div');
        element.innerHTML = html;
        element.style.cssText = cssText;
        document.body.appendChild(element);
        
        if (duration) {
            setTimeout(() => element.remove(), duration);
        }
        
        return element;
    }
};

// ===================================
// 3. 카드 시스템 (Card System)
// ===================================

class CardManager {
    constructor() {
        this.imageCache = new Map();
    }

    // 카드 이미지 경로 가져오기
    getCardImagePath(card) {
        const cacheKey = `${card.month}_${card.id}`;
        if (this.imageCache.has(cacheKey)) {
            return this.imageCache.get(cacheKey);
        }

        let imageName = '';
        const imageMap = {
            1: { '광': '1_일광.png', '홍단': '1_띠.png', 3: '1_피1.png', 4: '1_피2.png' },
            2: { '열끗': '2_끗.png', '홍단': '2_띠.png', 7: '2_피1.png', 8: '2_피2.png' },
            3: { '광': '3_삼광.png', '홍단': '3_띠.png', 11: '3_피1.png', 12: '3_피2.png' },
            4: { '열끗': '4_끗.png', '초단': '4_띠.png', 15: '4_피1.png', 16: '4_피2.png' },
            5: { '열끗': '5_끗.png', '초단': '5_띠.png', 19: '5_피1.png', 20: '5_피2.png' },
            6: { '열끗': '6_끗.png', '청단': '6_띠.png', 23: '6_피1.png', 24: '6_피2.png' },
            7: { '열끗': '7_끗.png', '초단': '7_띠.png', 27: '7_피1.png', 28: '7_피2.png' },
            8: { '광': '8_팔광.png', '열끗': '8_끗.png', 31: '8_피1.png', 32: '8_피2.png' },
            9: { '열끗': '9_쌍피.png', '청단': '9_띠.png', 35: '9_피1.png', 36: '9_피2.png' },
            10: { '열끗': '10_끗.png', '청단': '10_띠.png', 39: '10_피1.png', 40: '10_피2.png' },
            11: { '광': '11_똥광.png', '쌍피': '11_쌍피.png', 43: '11_피1.png', 44: '11_피2.png' },
            12: { '광': '12_비광.png', '열끗': '12_끗.png', '쌍피': '12_쌍피.png', '피': '12_띠.png' }
        };

        const monthMap = imageMap[card.month];
        if (monthMap) {
            imageName = monthMap[card.type] || monthMap[card.id] || '';
        }

        if (imageName) {
            const path = `new card/${imageName}`;
            this.imageCache.set(cacheKey, path);
            return path;
        }
        
        return null;
    }

    // 카드 엘리먼트 생성
    createElement(card, options = {}) {
        const { 
            size = 'normal', 
            showOverlay = true, 
            enableHover = true,
            customClass = ''
        } = options;

        const div = document.createElement('div');
        div.className = `card ${size === 'mini' ? 'mini-card' : ''} ${customClass}`;
        div.dataset.cardId = card.id;

        const imagePath = this.getCardImagePath(card);
        
        if (imagePath) {
            div.style.backgroundImage = `url('${imagePath}')`;
            div.style.backgroundSize = 'cover';
            div.style.backgroundPosition = 'center';
            
            if (showOverlay) {
                div.innerHTML = `
                    <div style="background: rgba(0,0,0,0.8); color: white; padding: 2px 4px; 
                         border-radius: 4px; position: absolute; bottom: 4px; left: 50%; 
                         transform: translateX(-50%); font-size: clamp(9px, 1.2vw, 11px); 
                         white-space: nowrap; backdrop-filter: blur(2px);">
                        ${card.month}월 ${card.name}
                    </div>
                `;
            }
        } else {
            div.innerHTML = `
                <div class="card-month">${card.month}월</div>
                <div class="card-type">${this.getCardIcon(card.type)}</div>
                <div class="card-name">${card.name}</div>
            `;
        }

        if (enableHover) {
            this.addHoverEvents(div, card.id);
        }

        return div;
    }

    // 카드 아이콘 가져오기
    getCardIcon(type) {
        const icons = {
            '광': '☀️',
            '열끗': '🦌',
            '단': '📜',
            '홍단': '📜',
            '청단': '📜',
            '초단': '📜',
            '피': '🍃',
            '쌍피': '🍃'
        };
        return icons[type] || '🎴';
    }

    // 호버 이벤트 추가 (최적화)
    addHoverEvents(element, cardId) {
        // 이벤트 위임 대신 직접 처리
        element.dataset.hoverable = 'true';
        element.addEventListener('mouseenter', () => this.highlightCards(cardId, true), { passive: true });
        element.addEventListener('mouseleave', () => this.highlightCards(cardId, false), { passive: true });
    }

    // 카드 하이라이트 (최적화)
    highlightCards(cardId, isHighlight) {
        // requestAnimationFrame으로 DOM 조작 최적화
        requestAnimationFrame(() => {
            const cards = document.querySelectorAll(`[data-card-id="${cardId}"]`);
            cards.forEach(card => {
                if (card.classList.contains('selected')) return;
                
                if (isHighlight) {
                    card.classList.add('highlighted');
                } else {
                    card.classList.remove('highlighted');
                }
            });
        });
    }
}

// ===================================
// 4. 애니메이션 시스템 (Animation System)
// ===================================

class AnimationManager {
    constructor() {
        this.activeAnimations = new Set();
    }

    // 카드 이동 애니메이션
    animateCardMove(fromElement, toElement, card, onComplete) {
        const fromRect = Utils.getElementRect(fromElement);
        const toRect = Utils.getElementRect(toElement);
        
        if (!fromRect || !toRect) {
            onComplete?.();
            return;
        }

        const tempCard = cardManager.createElement(card, { enableHover: false });
        tempCard.style.cssText = `
            position: fixed;
            left: ${fromRect.left}px;
            top: ${fromRect.top}px;
            width: ${fromRect.width}px;
            height: ${fromRect.height}px;
            transition: all ${GAME_CONFIG.ANIMATION_DURATION.CARD_MOVE}ms cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1000;
        `;
        
        document.body.appendChild(tempCard);
        this.activeAnimations.add(tempCard);

        // 원본 숨기기
        if (fromElement) {
            fromElement.style.visibility = 'hidden';
        }

        // 애니메이션 시작
        requestAnimationFrame(() => {
            tempCard.style.left = `${toRect.left + toRect.width / 2 - 50}px`;
            tempCard.style.top = `${toRect.top + toRect.height / 2 - 75}px`;
            tempCard.style.transform = 'rotate(360deg)';
        });

        // 사운드 재생
        Utils.playSound(GAME_CONFIG.SOUND_PATHS.CARD_START);

        setTimeout(() => {
            Utils.playSound(GAME_CONFIG.SOUND_PATHS.CARD_ARRIVE);
        }, GAME_CONFIG.ANIMATION_DURATION.CARD_MOVE - 100);

        setTimeout(() => {
            tempCard.remove();
            this.activeAnimations.delete(tempCard);
            onComplete?.();
        }, GAME_CONFIG.ANIMATION_DURATION.CARD_MOVE + 50);
    }

    // 카드 뒤집기 애니메이션
    animateCardFlip(card, fromRect, toRect, onComplete) {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            left: ${fromRect.left + (fromRect.width - 100) / 2}px;
            top: ${fromRect.top}px;
            width: 100px;
            height: 150px;
            transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
            transform-style: preserve-3d;
            z-index: 2000;
        `;

        // 카드 뒷면
        const backCard = document.createElement('div');
        backCard.className = 'card';
        backCard.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            backface-visibility: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
        `;
        backCard.textContent = '🎴';

        // 카드 앞면
        const frontCard = cardManager.createElement(card, { enableHover: false });
        frontCard.style.cssText += `
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            transform: rotateY(180deg);
        `;

        container.appendChild(backCard);
        container.appendChild(frontCard);
        document.body.appendChild(container);
        this.activeAnimations.add(container);

        // 사운드 재생
        Utils.playSound(GAME_CONFIG.SOUND_PATHS.CARD_START);

        // 애니메이션
        requestAnimationFrame(() => {
            container.style.left = `${toRect.left + toRect.width / 2 - 50}px`;
            container.style.top = `${toRect.top + toRect.height / 2 - 75}px`;
            container.style.transform = 'rotateY(180deg)';
        });

        setTimeout(() => {
            Utils.playSound(GAME_CONFIG.SOUND_PATHS.CARD_ARRIVE);
        }, 900);

        setTimeout(() => {
            container.remove();
            this.activeAnimations.delete(container);
            onComplete?.();
        }, GAME_CONFIG.ANIMATION_DURATION.CARD_FLIP + 50);
    }

    // 모든 애니메이션 정리
    clearAllAnimations() {
        this.activeAnimations.forEach(element => element.remove());
        this.activeAnimations.clear();
    }
}

// ===================================
// 5. 업그레이드 시스템 (Upgrade System)
// ===================================

class UpgradeManager {
    constructor() {
        this.upgrades = [];
        this.upgradeDefinitions = this.loadUpgradeDefinitions();
    }

    loadUpgradeDefinitions() {
        return [
            { id: 'chodan_blessing', name: '초단의 축복', icon: '🍀', description: '초단(초색 띠 3장)을 모으면 추가 +5점', rarity: 'rare' },
            { id: 'cheongdan_blessing', name: '청단의 축복', icon: '💙', description: '청단(청색 띠 3장)을 모으면 추가 +5점', rarity: 'rare' },
            { id: 'hongdan_blessing', name: '홍단의 축복', icon: '❤️', description: '홍단(홍색 띠 3장)을 모으면 추가 +5점', rarity: 'rare' },
            { id: 'extra_discard', name: '추가 버리기', icon: '♻️', description: '버리기 가능 횟수 +1', rarity: 'common' },
            { id: 'base_multiplier', name: '기본 배수 강화', icon: '✨', description: '기본 배수 +0.5', rarity: 'common' },
            { id: 'bonus_pi', name: '보너스피', icon: '🎯', description: '기본 점수 +2', rarity: 'common' },
            { id: 'gwangbak_charm', name: '광박의 부적', icon: '🌟', description: '라운드 종료시 바닥에 광이 없으면 배수×2', rarity: 'epic' },
            { id: 'pibak_charm', name: '피박의 부적', icon: '🩸', description: '라운드 종료시 바닥에 피가 없으면 배수×2', rarity: 'epic' },
            { id: 'gwang_38', name: '38광땡', icon: '🌠', description: '3광과 8광을 동시에 보유하면 추가 +10점', rarity: 'rare' },
            { id: 'gwang_13', name: '13광땡', icon: '⭐', description: '1광과 3광을 동시에 보유하면 추가 +5점', rarity: 'common' },
            { id: 'gwang_18', name: '18광땡', icon: '✦', description: '1광과 8광을 동시에 보유하면 추가 +5점', rarity: 'common' },
            { id: 'samjokoh_foot', name: '삼족오 발', icon: '🦅', description: '바닥에 같은 월 3장 모이면 ×3배수 (×1 대신)', rarity: 'epic' },
            { id: 'shake_shake', name: '흔들흔들', icon: '🎲', description: '라운드 종료시 손에 같은 월 3장 있으면 ×3배수', rarity: 'epic' },
            { id: 'no_possession', name: '무소유', icon: '🚫', description: '스테이지 시작 시 바닥 패가 없이 시작한다', rarity: 'common' },
            { id: 'maple_hand', name: '단풍손', icon: '🍁', description: '손패 카드가 -1(총 4장) 되지만, 기본점수 +4', rarity: 'rare' },
            { id: 'mind_reading', name: '관심법', icon: '👁️', description: '매 스테이지 시작 시 덱 맨 위의 카드를 알고 시작한다', rarity: 'rare' }
        ];
    }

    // 업그레이드 추가
    addUpgrade(upgradeId) {
        const upgrade = this.upgradeDefinitions.find(u => u.id === upgradeId);
        if (upgrade) {
            this.upgrades.push(upgrade);
            this.triggerUpgradeEffect(upgradeId);
        }
    }

    // 업그레이드 효과 발동 시각화
    triggerUpgradeEffect(upgradeId) {
        const upgradeElements = document.querySelectorAll('.upgrade-item');
        upgradeElements.forEach(element => {
            if (element.dataset.upgradeId === upgradeId) {
                element.classList.add('upgrade-triggered');
                
                // 툴팁 표시
                const event = new MouseEvent('mouseenter', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                element.dispatchEvent(event);
                
                // 애니메이션 종료 후 클래스 제거
                setTimeout(() => {
                    element.classList.remove('upgrade-triggered');
                    const leaveEvent = new MouseEvent('mouseleave', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    element.dispatchEvent(leaveEvent);
                }, GAME_CONFIG.ANIMATION_DURATION.UPGRADE_TRIGGER);
            }
        });
    }

    // 업그레이드 확인
    hasUpgrade(upgradeId) {
        return this.upgrades.some(u => u.id === upgradeId);
    }

    // 업그레이드 개수 가져오기
    getUpgradeCount(upgradeId) {
        return this.upgrades.filter(u => u.id === upgradeId).length;
    }

    // 초기화
    reset() {
        this.upgrades = [];
    }

    // 업그레이드 선택 UI 생성
    createSelectionUI(count = 3) {
        const availableUpgrades = [...this.upgradeDefinitions];
        const choices = [];
        
        for (let i = 0; i < count && availableUpgrades.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableUpgrades.length);
            choices.push(availableUpgrades.splice(randomIndex, 1)[0]);
        }
        
        return choices;
    }
}

// ===================================
// 6. 스코어 시스템 (Score System)
// ===================================

class ScoreCalculator {
    constructor(upgradeManager) {
        this.upgradeManager = upgradeManager;
    }

    calculate(handCards, floorCards) {
        const allCards = [...handCards, ...floorCards];
        let points = 0;
        let multiplier = 1;

        // 기본 점수 계산
        points = this.calculateBasePoints(allCards);
        
        // 업그레이드 점수 적용
        points += this.calculateUpgradePoints(allCards, handCards, floorCards);
        
        // 배수 계산
        multiplier = this.calculateMultiplier(floorCards, handCards);

        return { points, multiplier, total: points * multiplier };
    }

    calculateBasePoints(cards) {
        let points = 0;
        const cardsByType = this.categorizeCards(cards);
        
        // 피 점수
        const piCount = cardsByType['피'].length;
        points += piCount;
        
        // 보너스피 업그레이드
        const bonusPiCount = this.upgradeManager.getUpgradeCount('bonus_pi');
        points += bonusPiCount * 2;
        
        // 단풍손 업그레이드
        if (this.upgradeManager.hasUpgrade('maple_hand')) {
            points += 4;
            this.upgradeManager.triggerUpgradeEffect('maple_hand');
        }
        
        return points;
    }

    calculateUpgradePoints(allCards, handCards, floorCards) {
        let points = 0;
        
        // 단 족보 체크
        const danCards = allCards.filter(c => c.type === '홍단' || c.type === '청단' || c.type === '초단');
        
        // 홍단
        const hongdanCards = danCards.filter(c => c.type === '홍단');
        if (hongdanCards.length >= 3 && this.upgradeManager.hasUpgrade('hongdan_blessing')) {
            points += 5;
            this.upgradeManager.triggerUpgradeEffect('hongdan_blessing');
        }
        
        // 청단
        const cheongdanCards = danCards.filter(c => c.type === '청단');
        if (cheongdanCards.length >= 3 && this.upgradeManager.hasUpgrade('cheongdan_blessing')) {
            points += 5;
            this.upgradeManager.triggerUpgradeEffect('cheongdan_blessing');
        }
        
        // 초단
        const chodanCards = danCards.filter(c => c.type === '초단');
        if (chodanCards.length >= 3 && this.upgradeManager.hasUpgrade('chodan_blessing')) {
            points += 5;
            this.upgradeManager.triggerUpgradeEffect('chodan_blessing');
        }
        
        // 광땡 체크
        const gwangCards = allCards.filter(c => c.type === '광');
        const gwangMonths = gwangCards.map(c => c.month);
        
        if (gwangMonths.includes(3) && gwangMonths.includes(8) && this.upgradeManager.hasUpgrade('gwang_38')) {
            points += 10;
            this.upgradeManager.triggerUpgradeEffect('gwang_38');
        }
        
        if (gwangMonths.includes(1) && gwangMonths.includes(3) && this.upgradeManager.hasUpgrade('gwang_13')) {
            points += 5;
            this.upgradeManager.triggerUpgradeEffect('gwang_13');
        }
        
        if (gwangMonths.includes(1) && gwangMonths.includes(8) && this.upgradeManager.hasUpgrade('gwang_18')) {
            points += 5;
            this.upgradeManager.triggerUpgradeEffect('gwang_18');
        }
        
        return points;
    }

    calculateMultiplier(floorCards, handCards) {
        let multiplier = 1;
        
        // 기본 배수 강화
        const baseMultiplierCount = this.upgradeManager.getUpgradeCount('base_multiplier');
        multiplier += baseMultiplierCount * 0.5;
        
        // 바닥 카드 월별 그룹화
        const floorByMonth = {};
        floorCards.forEach(card => {
            if (!floorByMonth[card.month]) {
                floorByMonth[card.month] = [];
            }
            floorByMonth[card.month].push(card);
        });
        
        // 같은 월 카드 개수별 배수
        Object.values(floorByMonth).forEach(cards => {
            if (cards.length === 2) {
                multiplier *= 2;
            } else if (cards.length === 3) {
                // 삼족오 발 체크
                if (this.upgradeManager.hasUpgrade('samjokoh_foot')) {
                    multiplier *= 3;
                    this.upgradeManager.triggerUpgradeEffect('samjokoh_foot');
                } else {
                    multiplier *= 1;
                }
            } else if (cards.length === 4) {
                multiplier *= 4;
            }
        });
        
        // 흔들흔들 체크
        if (this.upgradeManager.hasUpgrade('shake_shake')) {
            const handByMonth = {};
            handCards.forEach(card => {
                handByMonth[card.month] = (handByMonth[card.month] || 0) + 1;
            });
            
            if (Object.values(handByMonth).some(count => count >= 3)) {
                multiplier *= 3;
                this.upgradeManager.triggerUpgradeEffect('shake_shake');
            }
        }
        
        // 광박/피박 체크
        const floorTypes = new Set(floorCards.map(c => c.type));
        
        if (!floorTypes.has('광') && this.upgradeManager.hasUpgrade('gwangbak_charm')) {
            multiplier *= 2;
            this.upgradeManager.triggerUpgradeEffect('gwangbak_charm');
        }
        
        if (!floorCards.some(c => c.type === '피' || c.type === '쌍피') && 
            this.upgradeManager.hasUpgrade('pibak_charm')) {
            multiplier *= 2;
            this.upgradeManager.triggerUpgradeEffect('pibak_charm');
        }
        
        return multiplier;
    }

    categorizeCards(cards) {
        const categories = {
            '광': [],
            '열끗': [],
            '단': [],
            '피': []
        };
        
        cards.forEach(card => {
            if (card.type === '광') {
                categories['광'].push(card);
            } else if (card.type === '열끗') {
                categories['열끗'].push(card);
            } else if (card.type === '홍단' || card.type === '청단' || card.type === '초단') {
                categories['단'].push(card);
            } else if (card.type === '피' || card.type === '쌍피') {
                categories['피'].push(card);
                if (card.type === '쌍피') {
                    categories['피'].push(card); // 쌍피는 2장으로 계산
                }
            }
        });
        
        return categories;
    }
}

// ===================================
// 7. 게임 상태 관리 (Game State Management)
// ===================================

class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.deck = [];
        this.hand = [];
        this.floor = [];
        this.captured = {
            '광': [],
            '열끗': [],
            '단': [],
            '피': []
        };
        this.score = 0;
        this.multiplier = 1;
        this.totalScore = 0;
        this.turn = 0;
        this.stage = 1;
        this.targetScore = GAME_CONFIG.INITIAL_TARGET_SCORE;
        this.selectedCard = null;
        this.discardsLeft = GAME_CONFIG.INITIAL_DISCARDS;
        this.handsLeft = 8;
    }

    // 상태 업데이트 메서드들
    selectCard(index) {
        this.selectedCard = this.selectedCard === index ? null : index;
    }

    removeHandCard(index) {
        return this.hand.splice(index, 1)[0];
    }

    addToFloor(card) {
        this.floor.push(card);
    }

    drawCard() {
        return this.deck.pop();
    }

    addToHand(card) {
        this.hand.push(card);
    }

    updateScore(score, multiplier) {
        this.score = score;
        this.multiplier = multiplier;
        this.totalScore = score * multiplier;
    }

    nextStage() {
        this.stage++;
        this.targetScore = Math.floor(this.targetScore * GAME_CONFIG.TARGET_MULTIPLIER);
    }

    canDiscard() {
        return this.discardsLeft > 0 && this.selectedCard !== null;
    }

    canPlay() {
        return this.selectedCard !== null;
    }
}

// ===================================
// 8. UI 관리 (UI Management)
// ===================================

class UIManager {
    constructor(gameState, cardManager, upgradeManager) {
        this.gameState = gameState;
        this.cardManager = cardManager;
        this.upgradeManager = upgradeManager;
    }

    updateAll() {
        this.updateScoreBoard();
        this.updateHandArea();
        this.updateFloorArea();
        this.updateButtons();
        this.updateUpgrades();
    }

    updateScoreBoard() {
        document.getElementById('score').textContent = this.gameState.score;
        document.getElementById('pi-count').textContent = this.gameState.captured['피'].length;
        document.getElementById('chips').textContent = this.gameState.multiplier;
        document.getElementById('deck-remaining').textContent = this.gameState.deck.length;
        document.getElementById('discard-count').textContent = 
            GAME_CONFIG.INITIAL_DISCARDS - this.gameState.discardsLeft;
        document.getElementById('hands-left').textContent = this.gameState.handsLeft;
        document.getElementById('target').textContent = this.gameState.targetScore;
        document.getElementById('stage-info').textContent = `스테이지 ${this.gameState.stage}`;
    }

    updateHandArea() {
        const handArea = document.getElementById('hand-area');
        handArea.innerHTML = '';
        
        this.gameState.hand.forEach((card, index) => {
            const cardDiv = this.cardManager.createElement(card);
            if (index === this.gameState.selectedCard) {
                cardDiv.classList.add('selected');
            }
            cardDiv.onclick = () => {
                this.gameState.selectCard(index);
                this.updateAll();
            };
            handArea.appendChild(cardDiv);
        });
    }

    updateFloorArea() {
        const floorArea = document.getElementById('floor-area');
        floorArea.innerHTML = '';
        
        // 월별로 카드 그룹화
        const cardsByMonth = {};
        const monthOrder = [];
        
        this.gameState.floor.forEach(card => {
            if (!cardsByMonth[card.month]) {
                cardsByMonth[card.month] = [];
                monthOrder.push(card.month);
            }
            cardsByMonth[card.month].push(card);
        });
        
        // 카드 스택 표시
        monthOrder.forEach(month => {
            const monthCards = cardsByMonth[month];
            
            if (monthCards.length === 1) {
                const cardDiv = this.cardManager.createElement(monthCards[0]);
                floorArea.appendChild(cardDiv);
            } else {
                const stackContainer = this.createCardStack(monthCards);
                floorArea.appendChild(stackContainer);
            }
        });
    }

    createCardStack(cards) {
        const container = document.createElement('div');
        container.style.cssText = `
            position: relative;
            width: ${100 + (cards.length - 1) * 25}px;
            height: ${150 + (cards.length - 1) * 10}px;
            display: inline-block;
            margin-right: 15px;
        `;
        
        cards.forEach((card, index) => {
            const cardDiv = this.cardManager.createElement(card);
            cardDiv.style.cssText += `
                position: absolute;
                left: ${index * 25}px;
                top: ${index * 10}px;
                z-index: ${index};
                box-shadow: ${2 + index}px ${2 + index}px ${5 + index * 2}px rgba(0, 0, 0, 0.3);
            `;
            container.appendChild(cardDiv);
        });
        
        // 카드 개수 배지
        if (cards.length > 1) {
            const badge = document.createElement('div');
            badge.style.cssText = `
                position: absolute;
                top: -10px;
                right: -10px;
                background: #ff4444;
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 14px;
                z-index: 100;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            `;
            badge.textContent = cards.length;
            container.appendChild(badge);
        }
        
        return container;
    }

    updateButtons() {
        const playBtn = document.getElementById('play-btn');
        const discardBtn = document.getElementById('discard-btn');
        
        playBtn.disabled = !this.gameState.canPlay();
        discardBtn.disabled = !this.gameState.canDiscard();
    }

    updateUpgrades() {
        const container = document.getElementById('upgrades-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.upgradeManager.upgrades.forEach(upgrade => {
            const upgradeDiv = document.createElement('div');
            upgradeDiv.className = 'upgrade-item';
            upgradeDiv.dataset.upgradeId = upgrade.id;
            upgradeDiv.innerHTML = `
                <span class="upgrade-icon">${upgrade.icon}</span>
            `;
            
            // 툴팁 추가
            this.addUpgradeTooltip(upgradeDiv, upgrade);
            
            container.appendChild(upgradeDiv);
        });
    }

    addUpgradeTooltip(element, upgrade) {
        element.addEventListener('mouseenter', (e) => {
            const existingTooltip = document.getElementById('upgrade-tooltip-active');
            if (existingTooltip) {
                existingTooltip.remove();
            }
            
            const tooltip = document.createElement('div');
            tooltip.id = 'upgrade-tooltip-active';
            tooltip.className = 'upgrade-tooltip';
            tooltip.innerHTML = `
                <div class="tooltip-title">${upgrade.name}</div>
                <div class="tooltip-description">${upgrade.description}</div>
            `;
            
            const rect = element.getBoundingClientRect();
            tooltip.style.cssText = `
                position: fixed;
                left: ${rect.right + 10}px;
                top: ${rect.top}px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 10px;
                border-radius: 8px;
                font-size: 12px;
                z-index: 10000;
                pointer-events: none;
                min-width: 200px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            `;
            
            document.body.appendChild(tooltip);
        });
        
        element.addEventListener('mouseleave', () => {
            const tooltip = document.getElementById('upgrade-tooltip-active');
            if (tooltip) {
                tooltip.remove();
            }
        });
    }

    showScorePopup(score, multiplier, total) {
        const message = Utils.createTempElement(
            `
            <div style="margin-bottom: 15px; font-size: 20px; opacity: 0.9;">
                바닥 5슬롯 완성!
            </div>
            <div style="font-size: 36px; color: #ffd700;">
                ${score} × ${multiplier} = ${total}
            </div>
            <div style="margin-top: 10px; font-size: 16px; opacity: 0.8;">
                점수 × 배수 = 총점
            </div>
            `,
            `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 50px;
            border-radius: 15px;
            font-size: 28px;
            font-weight: bold;
            z-index: 2000;
            animation: scorePopup 2.5s ease;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
            `,
            GAME_CONFIG.ANIMATION_DURATION.SCORE_POPUP
        );
        
        // 애니메이션 추가
        Utils.createAnimationStyle('scorePopup', `
            0% { 
                opacity: 0; 
                transform: translate(-50%, -50%) scale(0.5) rotateX(90deg);
            }
            30% { 
                opacity: 1; 
                transform: translate(-50%, -50%) scale(1.1) rotateX(0deg);
            }
            70% { 
                opacity: 1; 
                transform: translate(-50%, -50%) scale(1) rotateX(0deg);
            }
            100% { 
                opacity: 0; 
                transform: translate(-50%, -50%) scale(0.9) rotateX(-90deg);
            }
        `);
    }
}

// ===================================
// 9. 메인 게임 컨트롤러 (Main Game Controller)
// ===================================

class HwatuGame {
    constructor() {
        this.gameState = new GameState();
        this.cardManager = new CardManager();
        this.animationManager = new AnimationManager();
        this.upgradeManager = new UpgradeManager();
        this.scoreCalculator = new ScoreCalculator(this.upgradeManager);
        this.uiManager = new UIManager(this.gameState, this.cardManager, this.upgradeManager);
        
        this.init();
    }

    init() {
        this.loadHwatuCards();
        this.setupEventListeners();
        this.startNewGame();
    }

    loadHwatuCards() {
        // HWATU_CARDS 데이터 로드 (기존 코드에서 가져옴)
        this.HWATU_CARDS = window.HWATU_CARDS || [];
    }

    setupEventListeners() {
        document.getElementById('play-btn').addEventListener('click', () => this.playCard());
        document.getElementById('discard-btn').addEventListener('click', () => this.discardCard());
        document.getElementById('new-round-btn').addEventListener('click', () => this.nextRound());
        document.getElementById('continue-btn').addEventListener('click', () => this.continueGame());
        document.getElementById('confirm-upgrade').addEventListener('click', () => this.confirmUpgrade());
    }

    startNewGame() {
        this.gameState.reset();
        this.upgradeManager.reset();
        this.initializeRound();
    }

    initializeRound() {
        // 덱 준비
        this.gameState.deck = Utils.shuffleArray([...this.HWATU_CARDS]);
        
        // 손패 크기 결정
        const handSize = this.upgradeManager.hasUpgrade('maple_hand') ? 4 : 5;
        
        // 카드 분배
        for (let i = 0; i < handSize; i++) {
            this.gameState.hand.push(this.gameState.deck.pop());
        }
        
        // 바닥패 초기화
        if (!this.upgradeManager.hasUpgrade('no_possession')) {
            this.gameState.floor.push(this.gameState.deck.pop());
        } else {
            setTimeout(() => this.upgradeManager.triggerUpgradeEffect('no_possession'), 500);
        }
        
        // 관심법 효과
        if (this.upgradeManager.hasUpgrade('mind_reading') && this.gameState.deck.length > 0) {
            setTimeout(() => {
                this.upgradeManager.triggerUpgradeEffect('mind_reading');
                this.showTopCardPreview();
            }, 900);
        }
        
        // 버리기 횟수 계산
        const extraDiscards = this.upgradeManager.getUpgradeCount('extra_discard');
        this.gameState.discardsLeft = GAME_CONFIG.INITIAL_DISCARDS + extraDiscards;
        
        // UI 업데이트
        this.uiManager.updateAll();
    }

    playCard() {
        if (!this.gameState.canPlay()) return;
        
        const card = this.gameState.removeHandCard(this.gameState.selectedCard);
        const handCard = document.querySelectorAll('.card')[this.gameState.selectedCard];
        const floorArea = document.getElementById('floor-area');
        
        // 애니메이션
        this.animationManager.animateCardMove(
            handCard,
            floorArea,
            card,
            () => {
                this.gameState.addToFloor(card);
                this.gameState.selectedCard = null;
                this.gameState.handsLeft--;
                
                // 점수 계산
                const result = this.scoreCalculator.calculate(
                    this.gameState.hand,
                    this.gameState.floor
                );
                this.gameState.updateScore(result.points, result.multiplier);
                
                // 5슬롯 완성 체크
                if (this.gameState.floor.length >= 5) {
                    this.uiManager.showScorePopup(
                        result.points,
                        result.multiplier,
                        result.total
                    );
                    setTimeout(() => this.checkRoundEnd(), 2500);
                } else {
                    this.checkRoundEnd();
                }
                
                this.uiManager.updateAll();
            }
        );
    }

    discardCard() {
        if (!this.gameState.canDiscard()) return;
        
        const card = this.gameState.removeHandCard(this.gameState.selectedCard);
        const handCard = document.querySelectorAll('.card')[this.gameState.selectedCard];
        
        // 버리기 애니메이션
        const rect = Utils.getElementRect(handCard);
        const tempCard = this.cardManager.createElement(card, { enableHover: false });
        tempCard.style.cssText = `
            position: fixed;
            left: ${rect.left}px;
            top: ${rect.top}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            z-index: 2000;
            transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1), 
                        opacity 1s ease-out, 
                        filter 1s ease-out;
        `;
        
        document.body.appendChild(tempCard);
        handCard.style.visibility = 'hidden';
        
        Utils.playSound(GAME_CONFIG.SOUND_PATHS.CARD_START);
        
        this.gameState.selectedCard = null;
        this.gameState.discardsLeft--;
        
        this.uiManager.updateAll();
        
        // 애니메이션 시작
        setTimeout(() => {
            tempCard.style.transform = 'translateY(-200px) scale(0.7) rotate(15deg)';
            tempCard.style.opacity = '0';
            tempCard.style.filter = 'blur(4px)';
        }, 50);
        
        // 새 카드 드로우
        setTimeout(() => {
            if (this.gameState.deck.length > 0) {
                const newCard = this.gameState.drawCard();
                const deckElement = document.querySelector('.deck-card');
                const handArea = document.getElementById('hand-area');
                
                this.animationManager.animateCardFlip(
                    newCard,
                    Utils.getElementRect(deckElement),
                    Utils.getElementRect(handArea),
                    () => {
                        this.gameState.addToHand(newCard);
                        this.uiManager.updateAll();
                    }
                );
            }
        }, 500);
        
        // 임시 카드 제거
        setTimeout(() => tempCard.remove(), 1050);
    }

    checkRoundEnd() {
        if (this.gameState.deck.length === 0 || this.gameState.hand.length === 0) {
            this.endRound();
        }
    }

    endRound() {
        if (this.gameState.totalScore >= this.gameState.targetScore) {
            // 미션 성공
            this.showMissionResult(true);
            setTimeout(() => this.showUpgradeSelection(), 2500);
        } else {
            // 미션 실패
            this.showMissionResult(false);
            setTimeout(() => {
                if (typeof updateBackgroundColors === 'function') {
                    updateBackgroundColors(1);
                }
                this.upgradeManager.reset();
                this.gameState.stage = 1;
                this.gameState.targetScore = GAME_CONFIG.INITIAL_TARGET_SCORE;
                this.initializeRound();
            }, 2500);
        }
    }

    showMissionResult(success) {
        const message = Utils.createTempElement(
            `
            <div style="font-size: 40px; margin-bottom: 20px;">
                ${success ? '미션 성공!' : '미션 실패!'}
            </div>
            <div style="font-size: 48px; color: #ffd700;">
                ${this.gameState.totalScore}점
            </div>
            <div style="font-size: 20px; opacity: 0.8; margin-top: 10px;">
                목표: ${this.gameState.targetScore}점
            </div>
            `,
            `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: ${success ? 
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                'linear-gradient(135deg, #f93b1d 0%, #ea1e63 100%)'};
            color: white;
            padding: 40px 60px;
            border-radius: 20px;
            font-size: 32px;
            font-weight: bold;
            z-index: 3000;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            text-align: center;
            animation: missionPopup 2.5s ease;
            `,
            2500
        );
    }

    showUpgradeSelection() {
        const choices = this.upgradeManager.createSelectionUI(3);
        const popup = document.getElementById('upgrade-popup');
        const container = document.getElementById('upgrade-choices');
        
        container.innerHTML = '';
        choices.forEach(upgrade => {
            const div = document.createElement('div');
            div.className = `upgrade-choice ${upgrade.rarity}`;
            div.innerHTML = `
                <div class="upgrade-icon">${upgrade.icon}</div>
                <div class="upgrade-name">${upgrade.name}</div>
                <div class="upgrade-desc">${upgrade.description}</div>
            `;
            div.onclick = () => this.selectUpgrade(upgrade);
            container.appendChild(div);
        });
        
        popup.style.display = 'flex';
    }

    selectUpgrade(upgrade) {
        this.selectedUpgrade = upgrade;
        document.querySelectorAll('.upgrade-choice').forEach(el => {
            el.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
    }

    confirmUpgrade() {
        if (this.selectedUpgrade) {
            this.upgradeManager.addUpgrade(this.selectedUpgrade.id);
            document.getElementById('upgrade-popup').style.display = 'none';
            this.nextRound();
        }
    }

    nextRound() {
        this.gameState.nextStage();
        
        if (typeof updateBackgroundColors === 'function') {
            updateBackgroundColors(this.gameState.stage);
        }
        
        this.initializeRound();
    }

    continueGame() {
        document.getElementById('result-modal').style.display = 'none';
        this.initializeRound();
    }

    showTopCardPreview() {
        if (this.gameState.deck.length === 0) return;
        
        const topCard = this.gameState.deck[this.gameState.deck.length - 1];
        const deckElement = document.querySelector('.deck-card');
        
        if (!deckElement) return;
        
        const deckRect = Utils.getElementRect(deckElement);
        const preview = document.createElement('div');
        preview.style.cssText = `
            position: fixed;
            top: ${deckRect.top - 190}px;
            left: ${deckRect.left + (deckRect.width / 2) - 60}px;
            z-index: 3000;
            animation: topCardReveal 3s ease;
        `;
        
        const imagePath = this.cardManager.getCardImagePath(topCard);
        
        if (imagePath) {
            preview.innerHTML = `
                <div style="
                    width: 120px;
                    height: 180px;
                    border: 3px solid #ffd700;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
                    background-image: url('${imagePath}');
                    background-size: cover;
                    background-position: center;
                "></div>
            `;
        } else {
            preview.innerHTML = `
                <div style="
                    width: 120px;
                    height: 180px;
                    background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
                    border: 3px solid #ffd700;
                    border-radius: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
                    color: #333;
                ">
                    <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">
                        ${topCard.month}월
                    </div>
                    <div style="font-size: 36px; margin-bottom: 10px;">
                        ${this.cardManager.getCardIcon(topCard.type)}
                    </div>
                    <div style="font-size: 14px;">
                        ${topCard.name}
                    </div>
                </div>
            `;
        }
        
        document.body.appendChild(preview);
        
        // 애니메이션 스타일
        const style = Utils.createAnimationStyle('topCardReveal', `
            0% { 
                opacity: 0; 
                transform: translateY(20px) rotateX(90deg);
            }
            20% { 
                opacity: 1; 
                transform: translateY(0) rotateX(0deg);
            }
            80% { 
                opacity: 1; 
                transform: translateY(0) rotateX(0deg);
            }
            100% { 
                opacity: 0; 
                transform: translateY(-20px) rotateX(-90deg);
            }
        `);
        
        setTimeout(() => {
            preview.remove();
            style.remove();
        }, GAME_CONFIG.ANIMATION_DURATION.TOP_CARD_PREVIEW);
    }
}

// ===================================
// 10. 초기화 (Initialization)
// ===================================

// 전역 인스턴스 생성
let game;
let cardManager;
let animationManager;
let upgradeManager;

// 게임 시작
window.addEventListener('DOMContentLoaded', () => {
    // HWATU_CARDS가 로드될 때까지 대기
    if (window.HWATU_CARDS) {
        initializeGame();
    } else {
        // 기존 스크립트가 로드될 때까지 대기
        const checkInterval = setInterval(() => {
            if (window.HWATU_CARDS) {
                clearInterval(checkInterval);
                initializeGame();
            }
        }, 100);
    }
});

function initializeGame() {
    cardManager = new CardManager();
    animationManager = new AnimationManager();
    upgradeManager = new UpgradeManager();
    game = new HwatuGame();
    
    // 전역 함수 노출 (기존 코드와의 호환성)
    window.triggerUpgradeEffect = (id) => upgradeManager.triggerUpgradeEffect(id);
    window.updateBackgroundColors = window.updateBackgroundColors || (() => {});
}

// CSS 스타일 추가
const style = document.createElement('style');
style.textContent = `
    .card.highlighted {
        border: 3px solid #ff6b6b !important;
        box-shadow: 0 0 20px rgba(255, 107, 107, 0.6) !important;
        transform: scale(1.05) !important;
    }
    
    .upgrade-triggered {
        animation: upgradeTrigger 0.6s ease-out;
    }
    
    @keyframes upgradeTrigger {
        0% { transform: scale(1); }
        50% { 
            transform: scale(1.5);
            filter: brightness(1.5);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
        }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);