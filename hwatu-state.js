// ============================================
// 게임 상태 관리 모듈
// ============================================

class GameStateManager {
    constructor() {
        this.reset();
    }

    reset() {
        this.state = {
            gameStarted: false,
            stageEnded: false,
            currentTurn: 'player',
            playerHand: [],
            opponentHand: [],
            playerCaptures: [],
            opponentCaptures: [],
            floorCards: [],
            deck: [],
            playerScore: 0,
            opponentScore: 0,
            targetScore: GAME_CONFIG.INITIAL_TARGET_SCORE,
            multiplier: 1,
            redEnhancementBonus: 0,
            handSize: GAME_CONFIG.INITIAL_HAND_SIZE,
            stage: GAME_CONFIG.INITIAL_STAGE,
            discardsRemaining: GAME_CONFIG.INITIAL_DISCARDS,
            gold: 0,
            goldPattern: GAME_CONFIG.GOLD_PATTERN,
            currentPatternIndex: 0,
            cardEnhancements: {},
            removedCards: new Set(),
            duplicatedCards: new Set(),
            purchasedItems: new Set(),
            selectedCard: null,
            selectedFloorCard: null,
            isProcessingAction: false,
            consumableCards: [],  // 소모품 카드 (최대 2장)
            treasures: []  // 보물 아이템 목록
        };
    }

    // 게임 시작
    startGame() {
        this.state.gameStarted = true;
        this.state.stageEnded = false;
    }

    // 스테이지 종료
    endStage() {
        this.state.stageEnded = true;
    }

    // 다음 스테이지
    nextStage() {
        this.state.stage++;
        this.state.stageEnded = false;
        this.state.discardsRemaining = GAME_CONFIG.INITIAL_DISCARDS;
        this.state.multiplier = 1;
        this.state.redEnhancementBonus = 0;
        this.state.currentPatternIndex = (this.state.currentPatternIndex + 1) % this.state.goldPattern.length;
        this.state.purchasedItems.clear();
    }

    // 점수 업데이트
    updateScore(player, points) {
        if (player === 'player') {
            this.state.playerScore += points;
        } else {
            this.state.opponentScore += points;
        }
    }

    // 배수 증가
    increaseMultiplier(amount) {
        this.state.multiplier += amount;
    }

    // 적 강화 보너스 증가
    increaseRedBonus(amount) {
        this.state.redEnhancementBonus += amount;
    }

    // 소지금 업데이트
    updateGold(amount) {
        this.state.gold = Math.max(0, this.state.gold + amount);
    }

    // 카드 강화 적용
    applyEnhancement(cardId, enhancementType) {
        this.state.cardEnhancements[cardId] = enhancementType;
    }

    // 카드 제거
    removeCard(cardId) {
        this.state.removedCards.add(cardId);
    }

    // 카드 복제
    duplicateCard(cardId) {
        this.state.duplicatedCards.add(cardId);
    }

    // 아이템 구매
    purchaseItem(itemId) {
        this.state.purchasedItems.add(itemId);
    }

    // 카드 선택
    selectCard(card) {
        this.state.selectedCard = card;
    }

    // 바닥 카드 선택
    selectFloorCard(card) {
        this.state.selectedFloorCard = card;
    }

    // 액션 처리 상태
    setProcessingAction(isProcessing) {
        this.state.isProcessingAction = isProcessing;
    }

    // 턴 변경
    changeTurn() {
        this.state.currentTurn = this.state.currentTurn === 'player' ? 'opponent' : 'player';
    }

    // 카드 덱 설정
    setDeck(deck) {
        this.state.deck = deck;
    }

    // 손패 업데이트
    updateHand(player, hand) {
        if (player === 'player') {
            this.state.playerHand = hand;
        } else {
            this.state.opponentHand = hand;
        }
    }

    // 획득 카드 업데이트
    updateCaptures(player, captures) {
        if (player === 'player') {
            this.state.playerCaptures = captures;
        } else {
            this.state.opponentCaptures = captures;
        }
    }

    // 바닥 카드 업데이트
    updateFloorCards(cards) {
        this.state.floorCards = cards;
    }

    // 버리기 횟수 감소
    decreaseDiscards() {
        this.state.discardsRemaining = Math.max(0, this.state.discardsRemaining - 1);
    }

    // 상태 가져오기
    getState() {
        return this.state;
    }

    // 특정 상태 값 가져오기
    get(key) {
        return this.state[key];
    }

    // 특정 상태 값 설정
    set(key, value) {
        this.state[key] = value;
    }

    // 게임 진행 가능 여부
    canPlayCard() {
        return this.state.gameStarted && 
               !this.state.stageEnded && 
               !this.state.isProcessingAction &&
               this.state.currentTurn === 'player';
    }

    // 버리기 가능 여부
    canDiscard() {
        return this.state.gameStarted && 
               !this.state.stageEnded && 
               !this.state.isProcessingAction &&
               this.state.discardsRemaining > 0;
    }
}

// 전역 게임 상태 인스턴스
const gameStateManager = new GameStateManager();