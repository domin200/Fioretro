// 사운드 프리로드 및 재생 시스템
let allow1Audio = null;
let allow2Audio = null;
let audioInitialized = false;

// 오디오 초기화 함수
function initAudio() {
    if (audioInitialized) return;
    
    try {
        // MP3 우선 사용
        console.log('Initializing allow audio files...');
        allow1Audio = new Audio('se/allow1.mp3');
        allow2Audio = new Audio('se/allow2.mp3');
        
        allow1Audio.volume = 1.0;
        allow2Audio.volume = 0.5;
        allow1Audio.preload = 'auto';
        allow2Audio.preload = 'auto';
        
        // 에러 처리
        allow1Audio.addEventListener('error', (e) => {
            console.error('Error loading allow1.mp3, trying OGG...', e);
            // MP3 실패시 OGG 시도
            allow1Audio = new Audio('se/allow1.ogg');
            allow1Audio.volume = 1.0;
            allow1Audio.preload = 'auto';
        });
        
        allow2Audio.addEventListener('error', (e) => {
            console.error('Error loading allow2.mp3, trying OGG...', e);
            // MP3 실패시 OGG 시도
            allow2Audio = new Audio('se/allow2.ogg');
            allow2Audio.volume = 0.5;
            allow2Audio.preload = 'auto';
        });
        
        console.log('Allow audio initialized successfully');
    } catch (error) {
        console.error('Failed to initialize audio:', error);
        // 오디오를 지원하지 않는 경우
        allow1Audio = { play: () => Promise.resolve(), currentTime: 0, pause: () => {} };
        allow2Audio = { play: () => Promise.resolve(), currentTime: 0, pause: () => {} };
    }
    
    audioInitialized = true;
}

// 사용자 상호작용 시 오디오 활성화
function enableAudioOnInteraction() {
    console.log('Enabling audio on interaction...');
    
    if (!audioInitialized) {
        initAudio();
    }
    
    // 무음 재생으로 오디오 컨텍스트 활성화
    if (allow1Audio instanceof Audio) {
        allow1Audio.volume = 0;
        allow1Audio.play().then(() => {
            allow1Audio.pause();
            allow1Audio.currentTime = 0;
            allow1Audio.volume = 1.0;
            console.log('Audio context activated for allow1');
        }).catch((e) => {
            console.error('Failed to activate allow1:', e);
        });
    }
    if (allow2Audio instanceof Audio) {
        allow2Audio.volume = 0;
        allow2Audio.play().then(() => {
            allow2Audio.pause();
            allow2Audio.currentTime = 0;
            allow2Audio.volume = 0.5;
            console.log('Audio context activated for allow2');
        }).catch((e) => {
            console.error('Failed to activate allow2:', e);
        });
    }
}

// 페이지 로드 시 오디오 초기화
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        initAudio();
        // 첫 클릭/터치 시 오디오 활성화
        ['click', 'touchstart'].forEach(eventType => {
            document.addEventListener(eventType, enableAudioOnInteraction, { once: true });
        });
    });
}

// 사운드 재생 함수
function playSound(soundFile) {
    try {
        // 오디오가 초기화되지 않았으면 초기화
        if (!audioInitialized) {
            initAudio();
        }
        
        // 프리로드된 오디오 사용 (OGG 또는 MP3 경로 모두 처리)
        if (soundFile.includes('allow1')) {
            if (allow1Audio) {
                if (allow1Audio instanceof Audio) {
                    // 재생 중이면 처음부터 다시 재생
                    allow1Audio.pause();
                    allow1Audio.currentTime = 0;
                    
                    const playPromise = allow1Audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(e => {
                            console.log('allow1 play failed, will retry on next interaction:', e.message);
                        });
                    }
                } else {
                    // 오디오가 지원되지 않는 경우
                    console.log('allow1 audio not supported');
                }
            }
        } else if (soundFile.includes('allow2')) {
            if (allow2Audio) {
                if (allow2Audio instanceof Audio) {
                    // 재생 중이면 처음부터 다시 재생
                    allow2Audio.pause();
                    allow2Audio.currentTime = 0;
                    
                    const playPromise = allow2Audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(e => {
                            console.log('allow2 play failed, will retry on next interaction:', e.message);
                        });
                    }
                } else {
                    // 오디오가 지원되지 않는 경우
                    console.log('allow2 audio not supported');
                }
            }
        } else {
            // 기타 사운드 파일
            const audio = new Audio(soundFile);
            audio.volume = 0.5;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log('Sound play failed:', soundFile, e.message);
                });
            }
        }
    } catch (error) {
        console.log('Sound system error:', error);
    }
}

// 카드 강화 타입은 hwatu-config.js에서 가져옴

// 화투 카드 정의 (48장) - 전역 변수로 설정
window.HWATU_CARDS = [
    // 1월 - 송학
    { month: 1, type: '광', name: '송학', points: 20, id: 1 },
    { month: 1, type: '홍단', name: '홍단', points: 10, id: 2 },
    { month: 1, type: '피', name: '피', points: 0, id: 3 },
    { month: 1, type: '피', name: '피', points: 0, id: 4 },
    
    // 2월 - 매조
    { month: 2, type: '열끗', name: '매조', points: 10, id: 5 },
    { month: 2, type: '홍단', name: '홍단', points: 10, id: 6 },
    { month: 2, type: '피', name: '피', points: 0, id: 7 },
    { month: 2, type: '피', name: '피', points: 0, id: 8 },
    
    // 3월 - 벚꽃
    { month: 3, type: '광', name: '벚꽃', points: 20, id: 9 },
    { month: 3, type: '홍단', name: '홍단', points: 10, id: 10 },
    { month: 3, type: '피', name: '피', points: 0, id: 11 },
    { month: 3, type: '피', name: '피', points: 0, id: 12 },
    
    // 4월 - 흑싸리
    { month: 4, type: '열끗', name: '흑싸리', points: 10, id: 13 },
    { month: 4, type: '초단', name: '초단', points: 10, id: 14 },
    { month: 4, type: '피', name: '피', points: 0, id: 15 },
    { month: 4, type: '피', name: '피', points: 0, id: 16 },
    
    // 5월 - 난초
    { month: 5, type: '열끗', name: '난초', points: 10, id: 17 },
    { month: 5, type: '초단', name: '초단', points: 10, id: 18 },
    { month: 5, type: '피', name: '피', points: 0, id: 19 },
    { month: 5, type: '피', name: '피', points: 0, id: 20 },
    
    // 6월 - 모란
    { month: 6, type: '열끗', name: '모란', points: 10, id: 21 },
    { month: 6, type: '청단', name: '청단', points: 10, id: 22 },
    { month: 6, type: '피', name: '피', points: 0, id: 23 },
    { month: 6, type: '피', name: '피', points: 0, id: 24 },
    
    // 7월 - 홍싸리
    { month: 7, type: '열끗', name: '홍싸리', points: 10, id: 25 },
    { month: 7, type: '초단', name: '초단', points: 10, id: 26 },
    { month: 7, type: '피', name: '피', points: 0, id: 27 },
    { month: 7, type: '피', name: '피', points: 0, id: 28 },
    
    // 8월 - 공산
    { month: 8, type: '광', name: '공산', points: 20, id: 29 },
    { month: 8, type: '열끗', name: '기러기', points: 10, id: 30 },
    { month: 8, type: '피', name: '피', points: 0, id: 31 },
    { month: 8, type: '피', name: '피', points: 0, id: 32 },
    
    // 9월 - 국화
    { month: 9, type: '열끗', name: '국화술잔(열끗/쌍피)', points: 10, id: 33, special: true },
    { month: 9, type: '청단', name: '청단', points: 10, id: 34 },
    { month: 9, type: '피', name: '피', points: 0, id: 35 },
    { month: 9, type: '피', name: '피', points: 0, id: 36 },
    
    // 10월 - 단풍
    { month: 10, type: '열끗', name: '단풍사슴', points: 10, id: 37 },
    { month: 10, type: '청단', name: '청단', points: 10, id: 38 },
    { month: 10, type: '피', name: '피', points: 0, id: 39 },
    { month: 10, type: '피', name: '피', points: 0, id: 40 },
    
    // 11월 - 오동
    { month: 11, type: '광', name: '오동', points: 20, id: 41 },
    { month: 11, type: '쌍피', name: '쌍피', points: 0, id: 42 },
    { month: 11, type: '피', name: '피', points: 0, id: 43 },
    { month: 11, type: '피', name: '피', points: 0, id: 44 },
    
    // 12월 - 비
    { month: 12, type: '광', name: '비', points: 20, id: 45 },
    { month: 12, type: '열끗', name: '국진', points: 10, id: 46 },
    { month: 12, type: '쌍피', name: '쌍피', points: 0, id: 47 },
    { month: 12, type: '피', name: '피', points: 0, id: 48 }
];

// 화투 카드를 2차원 배열로 변환 (월별로 정리)
const hwatu = [];
for (let month = 1; month <= 12; month++) {
    const monthCards = window.HWATU_CARDS.filter(card => card.month === month);
    hwatu.push(monthCards);
}
// HWATU_CARDS 별칭 설정 (호환성)
const HWATU_CARDS = window.HWATU_CARDS;

// 게임 상태
const gameState = {
    deck: [],           // 남은 카드 덱
    hand: [],           // 플레이어 손패 (최대 5장)
    floor: [],          // 바닥 패 (최대 5장)
    captured: {         // 획득한 카드
        '광': [],
        '열끗': [],
        '단': [],
        '피': []
    },
    score: 0,
    multiplier: 1,
    totalScore: 0,
    turn: 0,
    stage: 1,
    targetScore: 25,
    selectedCard: null,
    discardsLeft: 4,    // 남은 버리기 횟수
    upgrades: [],        // 획득한 업그레이드 목록
    shownCombinations: new Set(),  // 이미 표시한 족보 추적
    reincarnatedCards: 0,  // 윤회로 덱으로 돌아간 카드 수
    stageEnded: false,  // 스테이지 종료 여부
    cardEnhancements: {},  // 카드 강화 정보 {cardId: 'blue'|'red'|'white'|'black'|'gold'}
    gold: 0,  // 소지금
    redEnhancementBonus: 0  // 적 강화로 인한 추가 배수 (스테이지당 누적)
};


// 전체 게임 초기화 (게임 시작 또는 실패 후 재시작)
function initFullGame() {
    // upgrades가 없으면 초기화
    if (!gameState.upgrades) {
        gameState.upgrades = [];
    }
    
    // 덱 준비 및 섞기
    gameState.deck = [...HWATU_CARDS];
    gameState.removedCards = [];  // 제거된 카드 목록 초기화
    gameState.duplicatedCards = [];  // 복제된 카드 목록 초기화
    gameState.cardEnhancements = {};  // 카드 강화 초기화
    gameState.consumableCards = [];  // 소모품 카드 초기화
    
    // gameStateManager도 동기화
    if (typeof gameStateManager !== 'undefined') {
        gameStateManager.state.consumableCards = [];
    }
    
    initStage();
}

// 스테이지 초기화 (매 스테이지마다)
function initStage() {
    // 현재 덱 준비 (제거/복제 카드 반영)
    const tempDeck = [...HWATU_CARDS];
    
    // 제거된 카드 처리
    if (gameState.removedCards && gameState.removedCards.length > 0) {
        gameState.deck = tempDeck.filter(card => !gameState.removedCards.includes(card.id));
    } else {
        gameState.deck = tempDeck;
    }
    
    // 복제된 카드 추가
    if (gameState.duplicatedCards && gameState.duplicatedCards.length > 0) {
        gameState.duplicatedCards.forEach((cardId, index) => {
            const originalCard = HWATU_CARDS.find(c => c.id === cardId);
            if (originalCard) {
                // 복제 카드 생성 (ID는 다르게 설정)
                const duplicatedCard = {...originalCard, id: cardId + '_dup_' + index};
                gameState.deck.push(duplicatedCard);
            }
        });
    }
    
    // gameStateManager의 카드 강화 정보를 gameState로 동기화
    if (typeof gameStateManager !== 'undefined' && gameStateManager.state.cardEnhancements) {
        // 기존 강화 정보 유지하면서 gameStateManager의 정보로 업데이트
        Object.assign(gameState.cardEnhancements, gameStateManager.state.cardEnhancements);
    }
    
    // 비온뒤 맑음 업그레이드 확인 - 12월 카드 제거
    const hasSunnyAfterRain = gameState.upgrades && gameState.upgrades.some(u => u.id === 'sunny_after_rain');
    if (hasSunnyAfterRain) {
        gameState.deck = gameState.deck.filter(card => card.month !== 12);
        // 효과 발동 알림 (약간의 딜레이 후)
        setTimeout(() => triggerUpgradeEffect('sunny_after_rain'), 300);
    }
    
    shuffleDeck();
    
    // 스테이지 설정 초기화 계속
    initGame();
}

// 게임 초기화
function initGame() {
    // 상태 초기화
    gameState.hand = [];
    gameState.floor = [];
    gameState.captured = {
        '광': [],
        '열끗': [],
        '단': [],
        '피': []
    };
    gameState.score = 0;
    gameState.bonusPoints = 0;  // 보너스 포인트 (소모품 카드 등)
    gameState.multiplier = 1;
    gameState.totalScore = 0;
    gameState.redEnhancementBonus = 0;  // 적 강화 보너스 초기화
    gameState.turn = 0;
    gameState.selectedCard = null;
    gameState.shownCombinations = new Set();  // 족보 표시 초기화
    gameState.reincarnatedCards = 0;  // 윤회 카운터 초기화
    gameState.stageEnded = false;  // 스테이지 종료 플래그 초기화
    
    // 버리기 횟수 계산 (기본 4 + 업그레이드)
    const extraDiscards = gameState.upgrades ? gameState.upgrades.filter(u => u.id === 'extra_discard').length : 0;
    gameState.discardsLeft = 4 + extraDiscards;
    
    // 초기 카드 분배 (애니메이션)
    const hasMapleHand = gameState.upgrades && gameState.upgrades.some(u => u.id === 'maple_hand');
    const handSize = hasMapleHand ? 4 : 5;
    const hasNoPossession = gameState.upgrades && gameState.upgrades.some(u => u.id === 'no_possession');
    
    // 카드를 미리 뽑아둠
    const cardsToHand = [];
    for (let i = 0; i < handSize; i++) {
        if (gameState.deck.length > 0) {
            cardsToHand.push(gameState.deck.pop());
        }
    }
    
    const cardToFloor = !hasNoPossession && gameState.deck.length > 0 ? gameState.deck.pop() : null;
    
    // UI 초기화 (카드 없이)
    updateDisplay();
    
    // 순차적으로 카드 분배 애니메이션
    let dealDelay = 300;
    
    // 손패 카드 분배 애니메이션
    cardsToHand.forEach((card, index) => {
        setTimeout(() => {
            showInitialDealAnimation(card, 'hand', () => {
                gameState.hand.push(card);
                updateDisplay();
            });
        }, dealDelay * index);
    });
    
    // 바닥패 카드 분배 (손패 다음에)
    if (cardToFloor) {
        setTimeout(() => {
            showInitialDealAnimation(cardToFloor, 'floor', () => {
                gameState.floor.push(cardToFloor);
                updateDisplay();
            });
        }, dealDelay * handSize);
    }
    
    // 업그레이드 효과들 (모든 카드 분배 후)
    const totalDealTime = dealDelay * (handSize + (cardToFloor ? 1 : 0));
    
    if (hasNoPossession) {
        setTimeout(() => triggerUpgradeEffect('no_possession'), totalDealTime + 200);
    }
    
    if (hasMapleHand) {
        setTimeout(() => triggerUpgradeEffect('maple_hand'), totalDealTime + 400);
    }
    
    // 관심법 효과
    const hasMindReading = gameState.upgrades.some(u => u.id === 'mind_reading');
    if (hasMindReading && gameState.deck.length > 0) {
        setTimeout(() => {
            triggerUpgradeEffect('mind_reading');
            showTopCardPreview();
        }, totalDealTime + 600);
    }
    
    // 놀부심보 효과 - 첫 턴에 카드 2장 추가 드로우
    const hasNolbuTreasure = gameState.upgrades && gameState.upgrades.some(u => u.id === 'nolbu_treasure');
    if (hasNolbuTreasure && gameState.turn === 0) {
        setTimeout(() => {
            triggerUpgradeEffect('nolbu_treasure');
            // 2장 추가 드로우
            for (let i = 0; i < 2; i++) {
                if (gameState.deck.length > 0) {
                    setTimeout(() => {
                        const extraCard = gameState.deck.pop();
                        showDrawAnimation(extraCard);
                        gameState.hand.push(extraCard);
                        updateDisplay();
                    }, i * 300);
                }
            }
        }, totalDealTime + 800);
    }
}

// 덱 섞기
function shuffleDeck() {
    for (let i = gameState.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
    }
}

// 카드 선택
function selectHandCard(index) {
    // 스테이지가 종료되었으면 선택 불가
    if (gameState.stageEnded) {
        console.log('Stage has ended, cannot select cards');
        return;
    }
    
    // 모든 카드에서 selected 클래스 제거 및 스타일 초기화
    document.querySelectorAll('.card.selected').forEach(card => {
        card.classList.remove('selected');
        // 인라인 스타일 제거하여 원래 상태로
        card.style.border = '';
        card.style.boxShadow = '';
        card.style.transform = '';
    });
    
    // 소모품 슬롯에서도 selected 효과 제거
    document.querySelectorAll('.consumable-slot').forEach(slot => {
        const innerDiv = slot.querySelector('div');
        if (innerDiv) {
            innerDiv.style.border = '2px solid #ffd700';
            innerDiv.style.boxShadow = '';
            innerDiv.style.transform = '';
        }
    });
    
    const handArea = document.getElementById('hand-area');
    const cards = handArea.children;
    
    // 새 카드 선택
    gameState.selectedCard = index;
    gameState.selectedConsumable = null;  // 소모품 카드 선택 해제
    
    if (cards[index]) {
        const selectedCard = cards[index];
        selectedCard.classList.add('selected');
        
        // 같은 ID의 모든 카드에 selected 클래스 추가 (획득패 영역 포함)
        const cardId = selectedCard.dataset.cardId;
        if (cardId) {
            document.querySelectorAll(`[data-card-id="${cardId}"]`).forEach(card => {
                card.classList.add('selected');
            });
        }
    }
    
    // 버튼 상태 업데이트
    updateButtonStates();
}

// 버튼 상태 업데이트
function updateButtonStates() {
    const playBtn = document.getElementById('play-btn');
    const discardBtn = document.getElementById('discard-btn');
    
    // 선택된 것이 있는지 확인 (손패 카드 또는 소모품 카드)
    const hasSelection = gameState.selectedCard !== null || gameState.selectedConsumable !== null;
    
    // 바닥에 내기 버튼 (바닥에 서로 다른 월이 5개 이상이면 비활성화)
    const uniqueMonths = new Set(gameState.floor.map(card => card.month)).size;
    playBtn.disabled = !hasSelection || gameState.stageEnded || uniqueMonths >= 5;
    
    // 버리기 버튼 - 소모품 카드는 버릴 수 없고, 손패 카드만 버리기 가능
    if (gameState.selectedConsumable !== null) {
        discardBtn.disabled = true;  // 소모품 카드는 버리기 불가
    } else {
        // 호랑이굴 효과 - 첫 턴에는 버리기 불가
        const hasTigerCave = gameState.upgrades.some(u => u.id === 'tiger_cave');
        const tigerCaveBlock = hasTigerCave && gameState.turn === 0;
        discardBtn.disabled = !hasSelection || gameState.discardsLeft <= 0 || gameState.stageEnded || tigerCaveBlock;
    }
}

// 카드를 바닥에 내기
function playCard() {
    // 소모품 카드가 선택된 경우
    if (gameState.selectedConsumable !== null) {
        useConsumableCard(gameState.selectedConsumable);
        return;
    }
    
    if (gameState.selectedCard === null) return;
    if (gameState.stageEnded) {
        console.log('Stage has ended, cannot play cards');
        return;
    }
    
    // 바닥에 서로 다른 월이 5개 이상이면 플레이 불가
    const uniqueMonths = new Set(gameState.floor.map(card => card.month)).size;
    if (uniqueMonths >= 5) {
        console.log('Cannot play card: floor already has 5 or more different months');
        return;
    }
    
    // 카드를 놓기 전에 미리 바닥 슬롯 체크
    const playedCard = gameState.hand[gameState.selectedCard];
    const tempFloor = [...gameState.floor, playedCard];
    const tempFloorSlots = getFloorSlotCountForCards(tempFloor);
    
    // 이 카드를 놓으면 5슬롯이 되는 경우 즉시 차단
    if (tempFloorSlots >= 5) {
        gameState.stageEnded = true;
        console.log('This move will end the stage, blocking further actions');
    }
    
    // 이 카드를 놓으면 손패가 비거나 덱이 충분하지 않은 경우도 체크
    if (gameState.hand.length <= 1 || gameState.deck.length < 2) {
        gameState.stageEnded = true;
        console.log('Stage will end due to empty hand or deck');
    }
    
    // 애니메이션을 위해 선택된 카드 엘리먼트 가져오기
    const handArea = document.getElementById('hand-area');
    const selectedCardElement = handArea.children[gameState.selectedCard];
    const floorArea = document.getElementById('floor-area');
    
    // 손패 -> 바닥 애니메이션 표시
    showHandToFloorAnimation(selectedCardElement, playedCard);
    
    // 상태 업데이트
    gameState.hand.splice(gameState.selectedCard, 1);
    
    // 바닥에서 같은 월의 카드 찾기
    const matchingCards = gameState.floor.filter(card => card.month === playedCard.month);
    
    // 무조건 바닥에 추가
    gameState.floor.push(playedCard);
    
    // 선택 초기화
    gameState.selectedCard = null;
    
    // 애니메이션 후 업데이트
    setTimeout(() => {
        updateDisplay();
    }, 500);
    
    // 1초 후 덱에서 카드 뒤집기 (애니메이션 효과)
    setTimeout(() => {
        if (gameState.deck.length > 0) {
            const deckCard = gameState.deck.pop();
            
            // 덱 카드 바닥에 추가 애니메이션
            showDeckCardAnimation(deckCard);
            
            const deckMatches = gameState.floor.filter(card => card.month === deckCard.month);
            
            // 매칭 여부와 관계없이 바닥에 추가
            gameState.floor.push(deckCard);
            
            // 바닥패 업데이트
            updateDisplay();
        }
        
        // 1초 후에 손패 보충 (놀부심보가 있으면 추가 드로우 안함)
        setTimeout(() => {
            const hasNolbuTreasure = gameState.upgrades && gameState.upgrades.some(u => u.id === 'nolbu_treasure');
            
            // 놀부심보가 있고 첫 턴이 아니면 드로우 안함
            if (hasNolbuTreasure && gameState.turn > 0) {
                // 추가 드로우 차단
                console.log('놀부심보 효과: 추가 드로우 차단');
            } else if (gameState.deck.length > 0 && gameState.hand.length < 5) {
                const newCard = gameState.deck.pop();
                if (newCard) {  // 카드가 존재하는지 확인
                    // 손패 보충 애니메이션
                    showDrawAnimation(newCard);
                    gameState.hand.push(newCard);
                }
            }
            
            gameState.turn++;
            
            // 점수 계산
            calculateScore();
            
            // 바닥 슬롯이 5개 차면 라운드 종료 (같은 월은 1슬롯으로 계산)
            const floorSlots = getFloorSlotCount();
            if (floorSlots >= 5) {
                // 스테이지 종료 설정
                gameState.stageEnded = true;
                setTimeout(() => {
                    calculateScore();  // 최종 점수 계산
                    endRound();  // 라운드 종료 및 스테이지 진행
                }, 1000);
            } else {
                // 라운드 종료 체크
                checkRoundEnd();
            }
            
            // 최종 업데이트
            updateDisplay();
        }, 1000);
    }, 1000);
}

// 덱 카드 애니메이션 표시
function showDeckCardAnimation(card) {
    // 애니메이션 시작 즉시 사운드 재생
    playSound('se/allow1.ogg');
    
    const floorArea = document.getElementById('floor-area');
    const deckCard = document.querySelector('.deck-card');
    
    // 덱 카드 위치 가져오기
    const deckRect = deckCard ? deckCard.getBoundingClientRect() : document.getElementById('deck-info').getBoundingClientRect();
    const floorRect = floorArea.getBoundingClientRect();
    
    // 카드 컨테이너 생성 (3D 회전을 위해 + 크기 애니메이션)
    const cardContainer = document.createElement('div');
    cardContainer.style.cssText = `
        position: fixed;
        left: ${deckRect.left + (deckRect.width - 50) / 2}px;
        top: ${deckRect.top + 25}px;
        width: 100px;
        height: 150px;
        z-index: 1000;
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        transform-style: preserve-3d;
        transform: scale(0.5);
        perspective: 1000px;
    `;
    
    // 카드 뒷면
    const backCard = document.createElement('div');
    backCard.className = 'card';
    backCard.style.cssText = `
        background-image: url('new card/back.png');
        background-size: cover;
        background-position: center;
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
    `;
    
    // 카드 앞면
    const frontCard = createCardElement(card);
    frontCard.style.cssText += `
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        transform: rotateY(180deg);
    `;
    
    cardContainer.appendChild(backCard);
    cardContainer.appendChild(frontCard);
    document.body.appendChild(cardContainer);
    
    // 바닥으로 이동하면서 뒤집기 + 크기 100%로 확대
    setTimeout(() => {
        cardContainer.style.left = floorRect.left + floorRect.width / 2 - 50 + 'px';
        cardContainer.style.top = floorRect.top + floorRect.height / 2 - 75 + 'px';
        cardContainer.style.transform = 'rotateY(180deg) scale(1)';
    }, 50);
    
    // 도착 사운드 재생 (0.1초 일찍)
    setTimeout(() => {
        playSound('se/allow2.ogg');
    }, 750);
    
    // 애니메이션 후 제거
    setTimeout(() => {
        cardContainer.remove();
    }, 850);
}

// 카드 획득
function captureCard(card) {
    let category = card.type;
    
    // 단 카드 분류
    if (category === '홍단' || category === '청단' || category === '초단') {
        category = '단';
    }
    // 쌍피는 피로 분류
    if (category === '쌍피') {
        category = '피';
        // 쌍피는 2장으로 계산 - 중복 체크
        const alreadyCaptured = gameState.captured['피'].some(c => c.id === card.id);
        if (!alreadyCaptured) {
            gameState.captured['피'].push(card);
        }
    }
    
    if (gameState.captured[category]) {
        // 이미 획득한 카드인지 확인 (ID로 체크)
        const alreadyCaptured = gameState.captured[category].some(c => c.id === card.id);
        if (!alreadyCaptured) {
            gameState.captured[category].push(card);
        }
    }
}

// 선택한 카드 버리기
function discardCards() {
    // 소모품 카드는 버릴 수 없음
    if (gameState.selectedConsumable !== null) {
        return;
    }
    
    if (gameState.selectedCard === null) return;
    if (gameState.stageEnded) {
        console.log('Stage has ended, cannot discard cards');
        return;
    }
    if (gameState.discardsLeft <= 0) {
        alert('더 이상 버리기를 사용할 수 없습니다!');
        return;
    }
    
    // 호랑이굴 효과는 버튼에서 이미 처리됨
    
    // 일타삼피 효과 확인
    const hasTripleDiscard = gameState.upgrades.some(u => u.id === 'triple_discard');
    
    // 버리기 후 덱이나 손패가 비는 경우 미리 차단
    const discardCount = hasTripleDiscard ? 
        Math.min(3, gameState.hand.length) : 1;
    
    if (gameState.hand.length <= discardCount || gameState.deck.length < discardCount) {
        gameState.stageEnded = true;
        console.log('Stage will end after discard, blocking further actions');
    }
    
    // 버릴 카드들 결정
    const cardsToDiscard = [];
    const indicesToRemove = [];
    
    if (hasTripleDiscard) {
        // 선택한 카드와 양옆 카드 모두 버리기
        const selectedIndex = gameState.selectedCard;
        
        // 중앙 카드
        cardsToDiscard.push(gameState.hand[selectedIndex]);
        indicesToRemove.push(selectedIndex);
        
        // 왼쪽 카드
        if (selectedIndex > 0) {
            cardsToDiscard.push(gameState.hand[selectedIndex - 1]);
            indicesToRemove.push(selectedIndex - 1);
        }
        
        // 오른쪽 카드
        if (selectedIndex < gameState.hand.length - 1) {
            cardsToDiscard.push(gameState.hand[selectedIndex + 1]);
            indicesToRemove.push(selectedIndex + 1);
        }
        
        // 일타삼피 효과 발동
        triggerUpgradeEffect('triple_discard');
    } else {
        // 일반 버리기
        cardsToDiscard.push(gameState.hand[gameState.selectedCard]);
        indicesToRemove.push(gameState.selectedCard);
    }
    
    gameState.discardsLeft--; // 버리기 카운트 감소
    
    // 적 강화 효과: 버려지는 카드가 적 강화를 가지고 있으면 배수 +0.5
    let redEnhancementActivated = false;
    cardsToDiscard.forEach(card => {
        const enhancement = gameState.cardEnhancements[card.id];
        if (enhancement === '적') {
            gameState.redEnhancementBonus += 0.5;
            redEnhancementActivated = true;
            console.log(`Red enhancement activated! Bonus +0.5 (Total bonus: ${gameState.redEnhancementBonus})`);
        }
    });
    
    // 적 강화 효과 시각적 표시
    if (redEnhancementActivated) {
        showEnhancementEffect('적 강화 발동! 배수 +0.5', '#ff4444');
    }
    
    // 버릴 카드들의 애니메이션
    const handArea = document.getElementById('hand-area');
    const cardElements = handArea.children;
    const tempCards = [];
    
    // 각 카드에 대해 애니메이션 생성
    indicesToRemove.forEach((index, i) => {
        const originalCard = cardElements[index];
        const rect = originalCard.getBoundingClientRect();
        const card = cardsToDiscard[i];
        
        // 임시 카드 생성 (애니메이션용)
        const tempCard = createCardElement(card);
        tempCard.style.position = 'fixed';
        tempCard.style.left = rect.left + 'px';
        tempCard.style.top = rect.top + 'px';
        tempCard.style.width = rect.width + 'px';
        tempCard.style.height = rect.height + 'px';
        tempCard.style.zIndex = (2000 + i) + '';
        tempCard.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s ease-out, filter 1s ease-out';
        document.body.appendChild(tempCard);
        tempCards.push(tempCard);
        
        // 원본 카드 즉시 숨기기
        originalCard.style.visibility = 'hidden';
    });
    
    // 카드들 제거 (큰 인덱스부터 제거해야 함)
    indicesToRemove.sort((a, b) => b - a).forEach(index => {
        gameState.hand.splice(index, 1);
    });
    gameState.selectedCard = null;
    
    // 버리기 사운드 즉시 재생
    playSound('se/allow1.ogg');
    
    // 즉시 화면 업데이트 (버린 카드 제거)
    updateDisplay();
    
    // 애니메이션 시작 (위로 올라가면서 사라짐)
    setTimeout(() => {
        tempCards.forEach((tempCard, i) => {
            // 각 카드마다 약간 다른 회전과 방향
            const rotation = 15 + (i - 1) * 10; // -5, 15, 25도
            const translateX = (i - 1) * 30; // -30, 0, 30px
            tempCard.style.transform = `translateY(-200px) translateX(${translateX}px) scale(0.7) rotate(${rotation}deg)`;
            tempCard.style.opacity = '0';
            tempCard.style.filter = 'blur(4px)';
        });
    }, 50);
    
    // 윤회 효과 확인
    const hasReincarnation = gameState.upgrades.some(u => u.id === 'reincarnation');
    
    if (hasReincarnation) {
        // 윤회 효과: 버린 카드를 덱에 다시 넣기
        cardsToDiscard.forEach(card => {
            gameState.deck.push(card);
            gameState.reincarnatedCards++;
        });
        
        // 덱 섞기
        shuffleDeck();
        
        // 윤회 효과 발동
        triggerUpgradeEffect('reincarnation');
    }
    
    // 덱에서 새 카드들 드로우 (버린 카드 수만큼) - 놀부심보가 있으면 드로우 안함
    const hasNolbuTreasure = gameState.upgrades && gameState.upgrades.some(u => u.id === 'nolbu_treasure');
    
    if (hasNolbuTreasure) {
        // 놀부심보 효과: 추가 드로우 차단
        console.log('놀부심보 효과: 버리기 후 추가 드로우 차단');
        PopupComponent.showMessage('놀부심보 효과로 카드를 보충할 수 없습니다!', 'warning');
    } else {
        const drawCount = cardsToDiscard.length;
        setTimeout(() => {
            for (let i = 0; i < drawCount; i++) {
                if (gameState.deck.length > 0) {
                    const newCard = gameState.deck.pop();
                    
                    // 각 카드 드로우에 딜레이 추가
                    setTimeout(() => {
                        showDrawAnimation(newCard);
                        
                        // 1초 후 손패에 추가
                        setTimeout(() => {
                            gameState.hand.push(newCard);
                            updateDisplay();
                        }, 1000);
                    }, i * 200); // 각 카드마다 200ms 간격
                }
            }
        }, 500);
    }
    
    // 애니메이션 완료 후 임시 카드 제거
    setTimeout(() => {
        tempCards.forEach(tempCard => tempCard.remove());
    }, 1050);
}

// 손패 -> 바닥 애니메이션
function showHandToFloorAnimation(cardElement, card) {
    // 애니메이션 시작 즉시 사운드 재생
    playSound('se/allow1.ogg');
    
    const floorArea = document.getElementById('floor-area');
    
    // 원본 카드 위치 가져오기
    const startRect = cardElement.getBoundingClientRect();
    const floorRect = floorArea.getBoundingClientRect();
    
    // 임시 카드 생성
    const tempCard = createCardElement(card);
    tempCard.style.position = 'fixed';
    tempCard.style.left = startRect.left + 'px';
    tempCard.style.top = startRect.top + 'px';
    tempCard.style.width = startRect.width + 'px';
    tempCard.style.height = startRect.height + 'px';
    tempCard.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    tempCard.style.zIndex = '1000';
    document.body.appendChild(tempCard);
    
    // 원본 카드 숨기기
    cardElement.style.visibility = 'hidden';
    
    // 바닥으로 이동 애니메이션
    setTimeout(() => {
        tempCard.style.left = floorRect.left + floorRect.width / 2 - 50 + 'px';
        tempCard.style.top = floorRect.top + floorRect.height / 2 - 75 + 'px';
        tempCard.style.transform = 'rotate(360deg)';
    }, 50);
    
    // 도착 사운드 재생 (0.1초 일찍)
    setTimeout(() => {
        playSound('se/allow2.ogg');
    }, 450);
    
    // 애니메이션 후 제거
    setTimeout(() => {
        tempCard.remove();
    }, 550);
}

// 카드 드로우 애니메이션
function showDrawAnimation(card) {
    // 애니메이션 시작 즉시 사운드 재생
    playSound('se/allow1.ogg');
    
    const handArea = document.getElementById('hand-area');
    const deckCard = document.querySelector('.deck-card');
    
    // 덱 카드 위치 가져오기
    const deckRect = deckCard ? deckCard.getBoundingClientRect() : document.getElementById('deck-info').getBoundingClientRect();
    const handRect = handArea.getBoundingClientRect();
    
    // 카드 컨테이너 생성 (3D 회전을 위해 + 크기 애니메이션)
    const cardContainer = document.createElement('div');
    cardContainer.style.cssText = `
        position: fixed;
        left: ${deckRect.left + (deckRect.width - 50) / 2}px;
        top: ${deckRect.top + 25}px;
        width: 100px;
        height: 150px;
        z-index: 1000;
        transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        transform-style: preserve-3d;
        transform: scale(0.5);
        perspective: 1000px;
    `;
    
    // 카드 뒷면
    const backCard = document.createElement('div');
    backCard.className = 'card';
    backCard.style.cssText = `
        background-image: url('new card/back.png');
        background-size: cover;
        background-position: center;
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
    `;
    
    // 카드 앞면
    const frontCard = createCardElement(card);
    frontCard.style.cssText += `
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        transform: rotateY(180deg);
    `;
    
    cardContainer.appendChild(backCard);
    cardContainer.appendChild(frontCard);
    document.body.appendChild(cardContainer);
    
    // 손패로 이동하면서 뒤집기 + 크기 100%로 확대
    setTimeout(() => {
        cardContainer.style.left = handRect.left + handRect.width / 2 - 50 + 'px';
        cardContainer.style.top = handRect.top + handRect.height / 2 - 75 + 'px';
        cardContainer.style.transform = 'rotateY(180deg) scale(1)';
    }, 50);
    
    // 애니메이션 후 제거 (손패 도착시 allow2 재생 안함)
    setTimeout(() => {
        cardContainer.remove();
    }, 1050);
}

// 초기 카드 분배 애니메이션
function showInitialDealAnimation(card, destination, onComplete) {
    // 시작 사운드 재생 (손패로 갈 때만 allow1)
    if (destination === 'hand') {
        playSound('se/allow1.ogg');
    }
    
    const deckElement = document.querySelector('.deck-card') || document.getElementById('deck-info');
    const targetArea = destination === 'hand' ? 
        document.getElementById('hand-area') : 
        document.getElementById('floor-area');
    
    if (!deckElement || !targetArea) {
        onComplete?.();
        return;
    }
    
    const deckRect = deckElement.getBoundingClientRect();
    const targetRect = targetArea.getBoundingClientRect();
    
    // 카드 컨테이너 생성 (3D 회전 효과 + 크기 애니메이션)
    const cardContainer = document.createElement('div');
    cardContainer.style.cssText = `
        position: fixed;
        left: ${deckRect.left + (deckRect.width - 50) / 2}px;
        top: ${deckRect.top + 25}px;
        width: 100px;
        height: 150px;
        z-index: 2000;
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        transform-style: preserve-3d;
        transform: rotateY(0deg) scale(0.5);
    `;
    
    // 카드 뒷면
    const backCard = document.createElement('div');
    backCard.className = 'card';
    backCard.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: url('new card/back.png');
        background-size: cover;
        background-position: center;
        backface-visibility: hidden;
        border-radius: 10px;
    `;
    
    // 카드 앞면
    const frontCard = createCardElement(card);
    frontCard.style.cssText += `
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        transform: rotateY(180deg);
    `;
    
    cardContainer.appendChild(backCard);
    cardContainer.appendChild(frontCard);
    document.body.appendChild(cardContainer);
    
    // 목적지로 이동하면서 뒤집기 + 크기 100%로 확대
    setTimeout(() => {
        // 목적지 계산 (손패는 가운데, 바닥패도 가운데)
        const targetX = targetRect.left + targetRect.width / 2 - 50;
        const targetY = targetRect.top + targetRect.height / 2 - 75;
        
        cardContainer.style.left = `${targetX}px`;
        cardContainer.style.top = `${targetY}px`;
        cardContainer.style.transform = 'rotateY(180deg) scale(1)';
    }, 50);
    
    // 도착 사운드 (바닥패로 갈 때만 allow2)
    if (destination === 'floor') {
        setTimeout(() => {
            playSound('se/allow2.ogg');
        }, 550);
    }
    
    // 애니메이션 완료 후 정리
    setTimeout(() => {
        cardContainer.remove();
        onComplete?.();
    }, 650);
}

// 족보 달성 애니메이션 표시
function showCombinationAchievement(text) {
    const achievement = document.createElement('div');
    achievement.style.cssText = `
        position: fixed;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -50%);
        font-size: 72px;
        font-weight: bold;
        color: #ffd700;
        text-shadow: 
            2px 2px 4px rgba(0, 0, 0, 0.8),
            0 0 20px rgba(255, 215, 0, 0.6),
            0 0 40px rgba(255, 215, 0, 0.4);
        z-index: 5000;
        pointer-events: none;
        animation: achievementFloat 2s ease-out forwards;
    `;
    achievement.textContent = text;
    
    // 애니메이션 스타일 추가
    if (!document.getElementById('achievement-animation-style')) {
        const style = document.createElement('style');
        style.id = 'achievement-animation-style';
        style.textContent = `
            @keyframes achievementFloat {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.5);
                }
                20% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.2);
                }
                30% {
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -150%) scale(0.8);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(achievement);
    
    // 2초 후 제거
    setTimeout(() => {
        achievement.remove();
    }, 2000);
}

// 점수 계산 (핸드 전체 + 바닥 전체)
function calculateScore() {
    // 스냅샷: 현재 핸드 전체 + 바닥 전체
    const handCards = [...gameState.hand];
    const floorCards = [...gameState.floor]; // 바닥의 모든 카드
    const allCards = [...handCards, ...floorCards];
    
    let points = 0;
    const achievedCombinations = []; // 달성한 족보 목록
    
    // 카드 타입별로 분류
    const cardsByType = {
        '광': [],
        '열끗': [],
        '단': [],
        '피': []
    };
    
    // 9월 열끗 특수 처리를 위한 변수
    let september9Yeol = null;
    
    allCards.forEach(card => {
        if (card.type === '광') {
            cardsByType['광'].push(card);
        } else if (card.type === '열끗') {
            // 9월 열끗은 별도로 저장 (나중에 유리한 쪽으로 배치)
            if (card.month === 9) {
                september9Yeol = card;
            } else {
                cardsByType['열끗'].push(card);
            }
        } else if (card.type === '홍단' || card.type === '청단' || card.type === '초단') {
            cardsByType['단'].push(card);
        } else {
            cardsByType['피'].push(card);
            if (card.type === '쌍피') {
                cardsByType['피'].push(card); // 쌍피는 2장으로 계산
            }
        }
    });
    
    // 9월 열끗 최적 배치 결정
    if (september9Yeol) {
        // 열끗이 4장 이하면 열끗으로, 피가 9장 이하면 쌍피로 사용하는 것이 유리
        const yeolCount = cardsByType['열끗'].length;
        const piCount = cardsByType['피'].length;
        
        // 열끗 점수 계산: 5장부터 1점씩
        const yeolScore = yeolCount >= 4 ? (yeolCount - 3) : 0;
        const yeolScoreWith9 = (yeolCount + 1) >= 5 ? (yeolCount - 3) : 0;
        
        // 피 점수는 항상 1장당 1점
        const piScoreWith9 = piCount + 2; // 9월 열끗을 쌍피로 사용
        
        // 더 유리한 쪽으로 배치
        if (yeolScoreWith9 > 2 || (yeolCount === 4)) {
            // 열끗으로 사용하는 것이 유리 (5장 완성 또는 추가 점수)
            cardsByType['열끗'].push(september9Yeol);
        } else {
            // 쌍피로 사용 (2점 추가)
            cardsByType['피'].push(september9Yeol);
            cardsByType['피'].push(september9Yeol); // 쌍피는 2장으로 계산
        }
    }
    
    // 피 점수 (1장당 1점, 쌍피는 2점) - 기본 점수는 피만
    const piCount = cardsByType['피'].length;
    points += piCount;  // 피 1장당 1점 (쌍피는 이미 2장으로 계산됨)
    
    // 카드 강화 효과 적용
    let enhancementMultiplier = 0;
    
    // 청 강화: 모든 카드에 점수 +1
    allCards.forEach(card => {
        const enhancement = gameState.cardEnhancements[card.id];
        if (enhancement === '청') {
            points += 1;
        }
    });
    
    // 백 강화: 바닥에 있을 때 점수 +2
    floorCards.forEach(card => {
        const enhancement = gameState.cardEnhancements[card.id];
        if (enhancement === '백') {
            points += 2;
        }
    });
    
    // 흑 강화: 핸드에 있을 때 점수 +2
    handCards.forEach(card => {
        const enhancement = gameState.cardEnhancements[card.id];
        if (enhancement === '흑') {
            points += 2;
        }
    });
    
    // 적 강화는 버릴 때 처리 (discardCards 함수에서)
    
    // 보너스피 업그레이드 적용
    const bonusPiUpgrades = gameState.upgrades.filter(u => u.id === 'bonus_pi').length;
    points += bonusPiUpgrades * 2;  // 각 보너스피 업그레이드당 +2점
    
    // 단풍손 업그레이드 적용 (기본 점수 +4)
    const hasMapleHand = gameState.upgrades.some(u => u.id === 'maple_hand');
    if (hasMapleHand) {
        points += 4;
        triggerUpgradeEffect('maple_hand');
    }
    
    // 칠지도 효과 (피가 정확히 7장이면 +10점)
    const hasSevenPi = gameState.upgrades.some(u => u.id === 'seven_pi');
    if (hasSevenPi && piCount === 7) {
        points += 10;
        triggerUpgradeEffect('seven_pi');
        if (!gameState.shownCombinations.has('칠지도')) {
            achievedCombinations.push('칠지도!');
            gameState.shownCombinations.add('칠지도');
        }
    }
    
    // 호랑이굴 효과 (기본 점수 +5)
    const hasTigerCave = gameState.upgrades.some(u => u.id === 'tiger_cave');
    if (hasTigerCave) {
        points += 5;
        triggerUpgradeEffect('tiger_cave');
    }
    
    // 천리길 효과 (스테이지 번호 × 1 만큼 기본 점수 추가)
    const hasThousandMile = gameState.upgrades.some(u => u.id === 'thousand_mile');
    if (hasThousandMile) {
        points += gameState.stage;
        triggerUpgradeEffect('thousand_mile');
    }
    
    // 윤회 효과 (덱으로 돌아간 카드당 +2점)
    const hasReincarnation = gameState.upgrades.some(u => u.id === 'reincarnation');
    if (hasReincarnation && gameState.reincarnatedCards > 0) {
        points += gameState.reincarnatedCards * 2;
        // 효과는 discardCards에서 이미 발동되므로 여기서는 점수만 추가
    }
    
    // 멍텅구리 효과 (열끗도 장당 1점)
    const hasStupidFish = gameState.upgrades.some(u => u.id === 'stupid_fish');
    if (hasStupidFish) {
        const yeolCount = cardsByType['열끗'].length;
        points += yeolCount;  // 열끗 카드 장당 1점
        if (yeolCount > 0) {
            triggerUpgradeEffect('stupid_fish');
        }
    }
    
    // 배수 계산 (바닥 카드 + 특수 조합)
    let multiplier = calculateMultiplier(floorCards);
    
    // 기본 배수 강화 업그레이드 적용
    const baseMultiplierUpgrades = gameState.upgrades.filter(u => u.id === 'base_multiplier').length;
    multiplier += baseMultiplierUpgrades * 0.5;  // 각 기본 배수 업그레이드당 +0.5
    
    // 적 강화로 인한 추가 배수 적용
    multiplier += gameState.redEnhancementBonus;
    
    // 특수 조합 배수 추가
    const gwangCount = cardsByType['광'].length;
    const yeolCount = cardsByType['열끗'].length;
    const dan = cardsByType['단'];
    const hongdan = dan.filter(c => c.type === '홍단').length;
    const cheongdan = dan.filter(c => c.type === '청단').length;
    const chodan = dan.filter(c => c.type === '초단').length;
    
    // 광 배수 (원래 점수만큼 배수 적용)
    if (gwangCount === 5) {
        multiplier *= 15;  // 오광 (원래 15점)
        if (!gameState.shownCombinations.has('오광')) {
            achievedCombinations.push('오광!');
            gameState.shownCombinations.add('오광');
        }
    } else if (gwangCount === 4) {
        multiplier *= 4;  // 사광 (원래 4점)
        if (!gameState.shownCombinations.has('사광')) {
            achievedCombinations.push('사광!');
            gameState.shownCombinations.add('사광');
        }
    } else if (gwangCount === 3) {
        const hasRain = cardsByType['광'].some(c => c.month === 12);
        if (hasRain) {
            multiplier *= 2;  // 비광 (원래 2점)
            if (!gameState.shownCombinations.has('비광')) {
                achievedCombinations.push('비광!');
                gameState.shownCombinations.add('비광');
            }
        } else {
            multiplier *= 3;  // 삼광 (원래 3점)
            if (!gameState.shownCombinations.has('삼광')) {
                achievedCombinations.push('삼광!');
                gameState.shownCombinations.add('삼광');
            }
        }
    }
    
    // 열끗 배수
    if (yeolCount >= 5) {
        multiplier *= (yeolCount - 4);  // 5장부터 1점씩이었으므로 그만큼 배수
    }
    
    // 고도리 체크
    const godori = cardsByType['열끗'].filter(c => 
        c.month === 2 || c.month === 4 || c.month === 8
    );
    if (godori.length === 3) {
        multiplier *= 5;  // 고도리 5배 (원래 5점)
        if (!gameState.shownCombinations.has('고도리')) {
            achievedCombinations.push('고도리!');
            gameState.shownCombinations.add('고도리');
        }
    }
    
    // 단 배수 (원래 3점씩이므로 3배)
    if (hongdan === 3) {
        multiplier *= 3;  // 홍단 3배
        if (!gameState.shownCombinations.has('홍단')) {
            achievedCombinations.push('홍단!');
            gameState.shownCombinations.add('홍단');
        }
        // 홍단의 축복 업그레이드 적용
        const hongdanBlessings = gameState.upgrades.filter(u => u.id === 'hongdan_blessing').length;
        if (hongdanBlessings > 0) {
            points += hongdanBlessings * 5;  // 각 홍단의 축복당 +5점
            triggerUpgradeEffect('hongdan_blessing');
        }
    }
    if (cheongdan === 3) {
        multiplier *= 3;  // 청단 3배
        if (!gameState.shownCombinations.has('청단')) {
            achievedCombinations.push('청단!');
            gameState.shownCombinations.add('청단');
        }
        // 청단의 축복 업그레이드 적용
        const cheongdanBlessings = gameState.upgrades.filter(u => u.id === 'cheongdan_blessing').length;
        if (cheongdanBlessings > 0) {
            points += cheongdanBlessings * 5;  // 각 청단의 축복당 +5점
            triggerUpgradeEffect('cheongdan_blessing');
        }
    }
    if (chodan === 3) {
        multiplier *= 3;  // 초단 3배
        if (!gameState.shownCombinations.has('초단')) {
            achievedCombinations.push('초단!');
            gameState.shownCombinations.add('초단');
        }
        // 초단의 축복 업그레이드 적용
        const chodanBlessings = gameState.upgrades.filter(u => u.id === 'chodan_blessing').length;
        if (chodanBlessings > 0) {
            points += chodanBlessings * 5;  // 각 초단의 축복당 +5점
            triggerUpgradeEffect('chodan_blessing');
        }
    }
    
    // 광박의 부적 효과 (바닥에 광이 없으면 배수×2)
    const hasGwangbakCharm = gameState.upgrades.some(u => u.id === 'gwangbak_charm');
    if (hasGwangbakCharm) {
        const floorGwang = floorCards.filter(c => c.type === '광').length;
        if (floorGwang === 0) {
            multiplier *= 2;
            triggerUpgradeEffect('gwangbak_charm');
        }
    }
    
    // 피박의 부적 효과 (바닥에 피가 없으면 배수×2)
    const hasPibakCharm = gameState.upgrades.some(u => u.id === 'pibak_charm');
    if (hasPibakCharm) {
        const floorPi = floorCards.filter(c => c.type === '피' || c.type === '쌍피').length;
        if (floorPi === 0) {
            multiplier *= 2;
            triggerUpgradeEffect('pibak_charm');
        }
    }
    
    // 38광땡 효과 (3광과 8광을 동시에 보유하면 +10점)
    const has38Gwang = gameState.upgrades.some(u => u.id === 'gwang_38');
    if (has38Gwang) {
        const has3Gwang = cardsByType['광'].some(c => c.month === 3);
        const has8Gwang = cardsByType['광'].some(c => c.month === 8);
        if (has3Gwang && has8Gwang) {
            points += 10;
            triggerUpgradeEffect('gwang_38');
        }
    }
    
    // 13광땡 효과 (1광과 3광을 동시에 보유하면 +5점)
    const has13Gwang = gameState.upgrades.some(u => u.id === 'gwang_13');
    if (has13Gwang) {
        const has1Gwang = cardsByType['광'].some(c => c.month === 1);
        const has3Gwang = cardsByType['광'].some(c => c.month === 3);
        if (has1Gwang && has3Gwang) {
            points += 5;
            triggerUpgradeEffect('gwang_13');
        }
    }
    
    // 18광땡 효과 (1광과 8광을 동시에 보유하면 +5점)
    const has18Gwang = gameState.upgrades.some(u => u.id === 'gwang_18');
    if (has18Gwang) {
        const has1Gwang = cardsByType['광'].some(c => c.month === 1);
        const has8Gwang = cardsByType['광'].some(c => c.month === 8);
        if (has1Gwang && has8Gwang) {
            points += 5;
            triggerUpgradeEffect('gwang_18');
        }
    }
    
    // 흔들흔들 효과 (손에 같은 월 3장 있으면 ×3배수)
    const hasShakeShake = gameState.upgrades.some(u => u.id === 'shake_shake');
    if (hasShakeShake) {
        const handMonthCounts = {};
        handCards.forEach(card => {
            handMonthCounts[card.month] = (handMonthCounts[card.month] || 0) + 1;
        });
        
        // 같은 월 3장 이상 있는지 확인
        const hasThreeOfSameMonth = Object.values(handMonthCounts).some(count => count >= 3);
        if (hasThreeOfSameMonth) {
            multiplier *= 3;
            triggerUpgradeEffect('shake_shake');
        }
    }
    
    // 최종 점수 = (점수 + 보너스) × 배수
    gameState.score = points + (gameState.bonusPoints || 0);
    gameState.multiplier = multiplier;
    gameState.totalScore = gameState.score * multiplier;
    
    // 달성한 족보 애니메이션 표시 (순차적으로)
    achievedCombinations.forEach((combination, index) => {
        setTimeout(() => {
            showCombinationAchievement(combination);
        }, index * 500); // 0.5초 간격으로 표시
    });
}

// 배수 계산 (바닥의 5장으로만)
function calculateMultiplier(floorCards) {
    // 월별로 카드 개수 세기
    const monthCounts = {};
    floorCards.forEach(card => {
        monthCounts[card.month] = (monthCounts[card.month] || 0) + 1;
    });
    
    let multiplier = 1;
    
    // 삼족오 발 업그레이드 확인
    const hasSamjokohFoot = gameState.upgrades.some(u => u.id === 'samjokoh_foot');
    
    Object.values(monthCounts).forEach(count => {
        if (count === 2) {
            multiplier *= 2;  // 같은 월 2장 → ×2
        } else if (count === 3) {
            // 같은 월 3장
            if (hasSamjokohFoot) {
                multiplier *= 3;  // 삼족오 발 효과 → ×3
                // 약간의 지연 후 효과 발동 (다른 효과와 겹치지 않도록)
                setTimeout(() => triggerUpgradeEffect('samjokoh_foot'), 100);
            }
            // 기본은 ×1 (배수 변화 없음)
        } else if (count === 4) {
            multiplier *= 5;  // 같은 월 4장 → ×5
        } else if (count === 5) {
            multiplier *= 10;  // 같은 월 5장 → ×10
        } else if (count === 6) {
            multiplier *= 20;  // 같은 월 6장 → ×20
        } else if (count > 6) {
            // 6장 이상은 장수마다 2배씩 증가
            multiplier *= 20 * Math.pow(2, count - 6);
        }
    });
    
    return multiplier;
}

// 바닥 슬롯 개수 계산 (같은 월은 1개로 계산)
function getFloorSlotCount() {
    const uniqueMonths = new Set();
    gameState.floor.forEach(card => {
        uniqueMonths.add(card.month);
    });
    return uniqueMonths.size;
}

// 특정 카드 배열의 바닥 슬롯 수 계산
function getFloorSlotCountForCards(cards) {
    const uniqueMonths = new Set();
    cards.forEach(card => {
        uniqueMonths.add(card.month);
    });
    return uniqueMonths.size;
}

// 바닥 슬롯이 5개 찼을 때 점수 계산
function calculateFloorScore() {
    // 점수 재계산 (현재 핸드 5장 + 바닥 5장)
    calculateScore();
    
    // 화면에 점수 계산 메시지 표시
    showScoreCalculationMessage();
    
    // 화면 업데이트
    updateDisplay();
}

// 점수 계산 메시지 표시
function showScoreCalculationMessage() {
    const floorArea = document.getElementById('floor-area');
    const message = document.createElement('div');
    message.style.cssText = `
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
    `;
    
    // 점수 상세 표시
    message.innerHTML = `
        <div style="margin-bottom: 15px; font-size: 20px; opacity: 0.9;">바닥 5슬롯 완성!</div>
        <div style="font-size: 36px; color: #ffd700;">
            ${gameState.score} × ${gameState.multiplier} = ${gameState.totalScore}
        </div>
        <div style="margin-top: 10px; font-size: 16px; opacity: 0.8;">
            점수 × 배수 = 총점
        </div>
    `;
    
    // 애니메이션 CSS 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes scorePopup {
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
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(message);
    
    // 2.5초 후 메시지 제거
    setTimeout(() => {
        message.remove();
        style.remove();
    }, 2500);
}

// 라운드 종료 체크
function checkRoundEnd() {
    // 덱이 비거나 손패가 비면 라운드 종료
    if (gameState.deck.length === 0 || gameState.hand.length === 0) {
        // 스테이지 종료 설정
        gameState.stageEnded = true;
        endRound();
    }
}

// 라운드 종료
function endRound() {
    // 스테이지 종료 설정
    gameState.stageEnded = true;
    
    if (gameState.totalScore >= gameState.targetScore) {
        // 미션 성공
        // 1. 먼저 보유 소지금에 대한 이자 계산 (5당 1 지급)
        const interestGold = Math.floor(gameState.gold / 5);
        gameState.gold += interestGold;
        
        // 2. 황 강화 카드 보너스 계산 (바닥과 손패에 있는 황 강화 카드당 1 소지금)
        let goldEnhancementBonus = 0;
        
        // 바닥 카드 중 황 강화 확인
        gameState.floor.forEach(card => {
            if (gameState.cardEnhancements[card.id] === '황') {
                goldEnhancementBonus++;
            }
        });
        
        // 손패 카드 중 황 강화 확인
        gameState.hand.forEach(card => {
            if (gameState.cardEnhancements[card.id] === '황') {
                goldEnhancementBonus++;
            }
        });
        
        if (goldEnhancementBonus > 0) {
            gameState.gold += goldEnhancementBonus;
            showEnhancementEffect(`황 강화 보너스! +${goldEnhancementBonus} 소지금`, '#ffd700');
        }
        
        // 3. 스테이지 클리어 보상 지급 (3, 4, 5 반복)
        const goldPattern = [3, 4, 5];
        const clearGold = goldPattern[(gameState.stage - 1) % 3];
        gameState.gold += clearGold;
        
        // 총 획득 소지금 (이자 + 황 강화 보너스 + 클리어 보상)
        const totalEarnedGold = interestGold + goldEnhancementBonus + clearGold;
        
        showMissionResult(true, gameState.totalScore, false, totalEarnedGold, interestGold, clearGold, goldEnhancementBonus);
        
        // 소지금 UI 업데이트를 먼저 완료
        updateDisplay();
        
        setTimeout(() => {
            // 소지금 계산이 완료된 후 상점 표시
            showUpgradeSelection();
        }, 3000);
    } else {
        // 두개의 심장 확인
        const twoHeartsIndex = gameState.upgrades.findIndex(u => u.id === 'two_hearts');
        
        if (twoHeartsIndex !== -1) {
            // 두개의 심장 효과 발동
            showMissionResult(false, gameState.totalScore, true); // 두개의 심장 사용 알림
            
            // 두개의 심장 제거
            gameState.upgrades.splice(twoHeartsIndex, 1);
            
            // 효과 발동 알림
            setTimeout(() => {
                triggerUpgradeEffect('two_hearts');
                showTwoHeartsUsed();
            }, 1000);
            
            // 다음 스테이지로 진행
            setTimeout(() => {
                showUpgradeSelection();
            }, 3500);
        } else {
            // 미션 실패
            showMissionResult(false, gameState.totalScore);
            setTimeout(() => {
                // 스테이지 1로 돌아올 때 기본 색상으로 복원
                if (typeof updateBackgroundColors === 'function') {
                    updateBackgroundColors(1);
                }
                
                // 업그레이드 초기화
                gameState.upgrades = [];
                
                initFullGame();
                
                // initGame 후에 스테이지 값 설정
                gameState.stage = 1;
                gameState.targetScore = 25;  // 초기값 25
                gameState.discardsLeft = 4;  // 버리기 횟수 초기화
                gameState.gold = 0;  // 소지금 초기화
                updateDisplay();
            }, 2500);
        }
    }
}

// 미션 결과 표시
function showMissionResult(success, score, usingTwoHearts = false, earnedGold = 0, interestGold = 0, clearGold = 0, goldEnhancementBonus = 0) {
    // 승리/패배 효과음 재생
    const soundEffect = new Audio(success ? 'se/397_win.mp3' : 'se/405_lose.mp3');
    soundEffect.play().catch(e => console.log('효과음 재생 실패:', e));
    
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: ${success ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #f93b1d 0%, #ea1e63 100%)'};
        color: white;
        padding: 40px 60px;
        border-radius: 20px;
        font-size: 32px;
        font-weight: bold;
        z-index: 3000;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        text-align: center;
        animation: missionPopup 2.5s ease;
    `;
    
    message.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">
            ${success ? '🎉 미션 성공!' : (usingTwoHearts ? '💕 두개의 심장!' : '💔 미션 실패!')}
        </div>
        <div style="font-size: 24px; margin-bottom: 10px;">
            스테이지 ${gameState.stage}
        </div>
        <div style="font-size: 36px; color: #ffd700;">
            최종 점수: ${score}
        </div>
        <div style="font-size: 20px; margin-top: 10px; opacity: 0.9;">
            목표 점수: ${gameState.targetScore}
        </div>
        ${success && earnedGold > 0 ? 
            `<div style="margin-top: 15px; color: #ffd700;">
                ${interestGold > 0 ? `<div style="font-size: 20px; margin-bottom: 5px;">
                    이자: <span style="font-weight: bold;">+${interestGold}</span>
                </div>` : ''}
                ${goldEnhancementBonus > 0 ? `<div style="font-size: 20px; margin-bottom: 5px;">
                    황 강화 보너스: <span style="font-weight: bold;">+${goldEnhancementBonus}</span>
                </div>` : ''}
                <div style="font-size: 20px; margin-bottom: 5px;">
                    클리어 보상: <span style="font-weight: bold;">+${clearGold}</span>
                </div>
                <div style="font-size: 24px; margin-top: 10px; border-top: 1px solid rgba(255, 215, 0, 0.5); padding-top: 10px;">
                    총 획득: <span style="font-weight: bold;">+${earnedGold}</span>
                </div>
            </div>` : ''}
        ${success ? 
            `<div style="font-size: 18px; margin-top: 15px; opacity: 0.8;">다음 스테이지로 진행합니다!</div>` : 
            (usingTwoHearts ? 
                `<div style="font-size: 18px; margin-top: 15px; opacity: 0.8;">두개의 심장으로 부활합니다!</div>` : 
                `<div style="font-size: 18px; margin-top: 15px; opacity: 0.8;">게임이 초기화됩니다...</div>`)
        }
    `;
    
    // 애니메이션 CSS 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes missionPopup {
            0% { 
                opacity: 0; 
                transform: translate(-50%, -50%) scale(0.5) rotate(-10deg);
            }
            30% { 
                opacity: 1; 
                transform: translate(-50%, -50%) scale(1.1) rotate(5deg);
            }
            50% { 
                transform: translate(-50%, -50%) scale(1.05) rotate(-2deg);
            }
            70% { 
                opacity: 1; 
                transform: translate(-50%, -50%) scale(1) rotate(0deg);
            }
            100% { 
                opacity: 0; 
                transform: translate(-50%, -50%) scale(0.9) rotate(0deg);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(message);
    
    // 2.5초 후 메시지 제거
    setTimeout(() => {
        message.remove();
        style.remove();
    }, 2400);
}

// 화면 업데이트
function updateDisplay() {
    // 점수 계산 (새 시스템)
    calculateScore();
    
    // 업그레이드 표시 업데이트
    updateUpgradesDisplay();
    
    // 소모품 카드 표시 업데이트
    updateConsumableCards();
    
    // 점수 정보 (숫자 변경 시 애니메이션 효과) - 배수 적용 전 점수 표시
    const scoreElement = document.getElementById('score');
    const targetElement = document.getElementById('target');
    const stageElement = document.getElementById('stage-num');
    
    if (scoreElement.textContent !== gameState.score.toString()) {
        scoreElement.style.animation = 'pulse 0.3s ease';
        scoreElement.textContent = gameState.score;  // 배수 적용 전 점수
        setTimeout(() => scoreElement.style.animation = '', 300);
    }
    
    targetElement.textContent = gameState.targetScore;
    stageElement.textContent = gameState.stage;
    
    // 배수 표시
    const multiplierElement = document.getElementById('multiplier');
    if (multiplierElement.textContent !== `x${gameState.multiplier}`) {
        multiplierElement.style.animation = 'pulse 0.3s ease';
        multiplierElement.textContent = `x${gameState.multiplier}`;
        setTimeout(() => multiplierElement.style.animation = '', 300);
    }
    
    // 버리기 버튼 텍스트 업데이트 (카운트 포함)
    const discardBtn = document.getElementById('discard-btn');
    if (discardBtn) {
        discardBtn.textContent = `버리기(${gameState.discardsLeft})`;
    }
    
    // 최종 점수 업데이트 (점수 × 배수)
    const totalScoreElement = document.getElementById('total-score');
    if (totalScoreElement) {
        const totalScore = gameState.totalScore;
        if (totalScoreElement.textContent !== totalScore.toString()) {
            totalScoreElement.style.animation = 'pulse 0.5s ease';
            totalScoreElement.textContent = totalScore;
            setTimeout(() => totalScoreElement.style.animation = '', 500);
        }
    }
    
    // 소지금 업데이트
    const goldElement = document.getElementById('gold-amount');
    if (goldElement) {
        if (goldElement.textContent !== gameState.gold.toString()) {
            goldElement.style.animation = 'pulse 0.5s ease';
            goldElement.textContent = gameState.gold;
            setTimeout(() => goldElement.style.animation = '', 500);
        }
    }
    
    // 덱 카운트 업데이트
    if (document.getElementById('deck-remaining')) {
        document.getElementById('deck-remaining').textContent = gameState.deck.length;
    }
    
    // 덱 총 개수 업데이트 (비온뒤 맑음 업그레이드 확인)
    if (document.getElementById('deck-total')) {
        const hasSunnyAfterRain = gameState.upgrades.some(u => u.id === 'sunny_after_rain');
        document.getElementById('deck-total').textContent = hasSunnyAfterRain ? 44 : 48;
    }
    
    // 현재 손패와 바닥패의 카드 종류별 개수 계산
    const currentCards = {
        '광': 0,
        '열끗': 0,
        '단': 0,
        '피': 0
    };
    
    // 손패 카드 계산
    gameState.hand.forEach(card => {
        if (card.type === '광') currentCards['광']++;
        else if (card.type === '열끗') currentCards['열끗']++;
        else if (card.type === '홍단' || card.type === '청단' || card.type === '초단') currentCards['단']++;
        else if (card.type === '피' || card.type === '쌍피') {
            currentCards['피'] += card.type === '쌍피' ? 2 : 1;
        }
    });
    
    // 바닥패 카드 계산
    gameState.floor.forEach(card => {
        if (card.type === '광') currentCards['광']++;
        else if (card.type === '열끗') currentCards['열끗']++;
        else if (card.type === '홍단' || card.type === '청단' || card.type === '초단') currentCards['단']++;
        else if (card.type === '피' || card.type === '쌍피') {
            currentCards['피'] += card.type === '쌍피' ? 2 : 1;
        }
    });
    
    // 총 개수 표시 (현재 손패/바닥패만)
    document.getElementById('gwang-count').textContent = currentCards['광'];
    document.getElementById('yeol-count').textContent = currentCards['열끗'];
    document.getElementById('dan-count').textContent = currentCards['단'];
    document.getElementById('pi-count').textContent = currentCards['피'];
    
    // 획득한 카드 미니 카드로 표시 (실제로는 손패 + 바닥패만 표시)
    ['광', '열끗', '단', '피'].forEach(type => {
        const containerId = `captured-${type === '열끗' ? 'yeol' : type === '광' ? 'gwang' : type === '단' ? 'dan' : 'pi'}-cards`;
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        // 현재 손패의 카드 표시
        gameState.hand.forEach(card => {
            let shouldShow = false;
            if (type === '광' && card.type === '광') shouldShow = true;
            else if (type === '열끗' && card.type === '열끗') shouldShow = true;
            else if (type === '단' && (card.type === '홍단' || card.type === '청단' || card.type === '초단')) shouldShow = true;
            else if (type === '피' && (card.type === '피' || card.type === '쌍피')) shouldShow = true;
            
            if (shouldShow) {
                const miniCard = createMiniCardElement(card);
                miniCard.style.opacity = '0.8';  // 손패는 좀 더 진하게
                container.appendChild(miniCard);
            }
        });
        
        // 바닥패의 카드 표시
        gameState.floor.forEach(card => {
            let shouldShow = false;
            if (type === '광' && card.type === '광') shouldShow = true;
            else if (type === '열끗' && card.type === '열끗') shouldShow = true;
            else if (type === '단' && (card.type === '홍단' || card.type === '청단' || card.type === '초단')) shouldShow = true;
            else if (type === '피' && (card.type === '피' || card.type === '쌍피')) shouldShow = true;
            
            if (shouldShow) {
                const miniCard = createMiniCardElement(card);
                miniCard.style.opacity = '0.5';  // 바닥패는 반투명
                container.appendChild(miniCard);
            }
        });
    });
    
    // 손패 표시
    const handArea = document.getElementById('hand-area');
    handArea.innerHTML = '';
    gameState.hand.forEach((card, index) => {
        const cardDiv = createCardElement(card);
        if (index === gameState.selectedCard) {
            cardDiv.classList.add('selected');
        }
        cardDiv.onclick = () => selectHandCard(index);
        handArea.appendChild(cardDiv);
    });
    
    // 바닥패 표시 (같은 월끼리 그룹화)
    const floorArea = document.getElementById('floor-area');
    floorArea.innerHTML = '';
    
    // 월별로 카드 그룹화하면서 첫 등장 순서 기록
    const cardsByMonth = {};
    const monthOrder = [];
    gameState.floor.forEach(card => {
        if (!cardsByMonth[card.month]) {
            cardsByMonth[card.month] = [];
            monthOrder.push(card.month);  // 첫 등장 순서 기록
        }
        cardsByMonth[card.month].push(card);
    });
    
    // 첫 등장 순서대로 각 월의 카드들을 표시 (같은 월은 겹쳐서)
    monthOrder.forEach(month => {
        const monthCards = cardsByMonth[month];
        if (monthCards.length === 1) {
            // 카드가 1장이면 그냥 표시
            const cardDiv = createCardElement(monthCards[0]);
            floorArea.appendChild(cardDiv);
        } else {
            // 카드가 여러 장이면 겹쳐서 표시
            const stackContainer = document.createElement('div');
            stackContainer.style.position = 'relative';
            stackContainer.style.width = `${100 + (monthCards.length - 1) * 25}px`;  // 카드 수에 따라 너비 조정
            stackContainer.style.height = `${150 + (monthCards.length - 1) * 10}px`;  // 카드 수에 따라 높이 조정
            stackContainer.style.display = 'inline-block';
            stackContainer.style.marginRight = '15px';
            
            monthCards.forEach((card, index) => {
                const cardDiv = createCardElement(card);
                cardDiv.style.position = 'absolute';
                cardDiv.style.left = `${index * 25}px`;  // 더 넓게 오른쪽으로 이동 (카드 내용 보이게)
                cardDiv.style.top = `${index * 10}px`;   // 더 넓게 아래로 이동
                cardDiv.style.zIndex = index;
                // 모든 카드에 그림자 효과 추가 (깊이감)
                cardDiv.style.boxShadow = `${2 + index}px ${2 + index}px ${5 + index * 2}px rgba(0, 0, 0, 0.3)`;
                stackContainer.appendChild(cardDiv);
            });
            
            // 카드 개수 표시 배지
            if (monthCards.length > 1) {
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
                badge.textContent = monthCards.length;
                stackContainer.appendChild(badge);
            }
            
            floorArea.appendChild(stackContainer);
        }
    });
    
    // 버튼 상태 (바닥에 서로 다른 월이 5개 이상이면 비활성화)
    const uniqueFloorMonths = new Set(gameState.floor.map(card => card.month)).size;
    document.getElementById('play-btn').disabled = gameState.selectedCard === null || gameState.stageEnded || uniqueFloorMonths >= 5;
    // 호랑이굴 효과 확인
    const hasTigerCave = gameState.upgrades.some(u => u.id === 'tiger_cave');
    const tigerCaveBlock = hasTigerCave && gameState.turn === 0;
    document.getElementById('discard-btn').disabled = gameState.selectedCard === null || gameState.discardsLeft <= 0 || gameState.stageEnded || tigerCaveBlock;
}

// 카드 엘리먼트 생성
// 전역으로 createCardElement 함수 노출
window.createCardElement = function(card) {
    const div = document.createElement('div');
    div.className = 'card';
    
    // 카드 강화 확인 및 적용
    const enhancement = gameState.cardEnhancements[card.id];
    if (enhancement) {
        div.classList.add(`enhanced-${enhancement.toLowerCase()}`);
        
        // 툴팁 추가
        const enhanceData = Object.values(ENHANCEMENT_TYPES).find(e => e.name === enhancement);
        if (enhanceData) {
            div.setAttribute('data-enhancement', enhancement);
            div.setAttribute('data-enhancement-effect', enhanceData.effect);
            
            // 호버 이벤트로 툴팁 표시
            div.addEventListener('mouseenter', (e) => showEnhancementTooltip(e, enhancement, enhanceData));
            div.addEventListener('mouseleave', hideEnhancementTooltip);
        }
    }
    
    // 카드 이미지 파일명 결정
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
        if (card.type === '열끗') imageName = '9_쌍피.png';  // 국화술잔
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
        else if (card.type === '피') imageName = '12_띠.png';  // 12월 띠
    }
    
    if (imageName) {
        div.style.backgroundImage = `url('new card/${imageName}')`;
        div.style.backgroundSize = 'cover';
        div.style.backgroundPosition = 'center';
        // 이미지 위에 텍스트 오버레이 추가 (반응형)
        div.innerHTML = `
            <div style="background: rgba(0,0,0,0.8); color: white; padding: 2px 4px; border-radius: 4px; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); font-size: clamp(9px, 1.2vw, 11px); white-space: nowrap; backdrop-filter: blur(2px);">
                ${enhancement ? `<span style="
                    background: ${(() => {
                        const gradientColors = {
                            '청': 'linear-gradient(to right, #00bfff, #87ceeb, #00bfff)',
                            '적': 'linear-gradient(to right, #ff4444, #ff7777, #ff4444)',
                            '백': 'linear-gradient(to right, #ffffff, #f0f0f0, #ffffff)',
                            '흑': 'linear-gradient(to right, #8b00ff, #da70d6, #8b00ff)',
                            '황': 'linear-gradient(to right, #ffd700, #ffff99, #ffd700)'
                        };
                        return gradientColors[enhancement] || gradientColors['황'];
                    })()};
                    background-size: 300% 100%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gradient 3s linear infinite;
                    font-weight: bold;
                ">${card.month}월 ${card.name}</span>` : `${card.month}월 ${card.name}`}
            </div>
        `;
    } else {
        // 이미지가 없는 경우 텍스트로 표시
        // 강화된 카드인 경우 카드 이름에 그라데이션 효과 적용
        const enhancement = gameState.cardEnhancements[card.id];
        let cardNameHtml = `<div class="card-name">${card.name}</div>`;
        
        if (enhancement) {
            const gradientColors = {
                '청': 'linear-gradient(to right, #00bfff, #87ceeb, #00bfff, #4682b4, #00bfff)',
                '적': 'linear-gradient(to right, #ff4444, #ff7777, #ff4444, #cc0000, #ff4444)',
                '백': 'linear-gradient(to right, #ffffff, #f0f0f0, #ffffff, #e8e8e8, #ffffff)',
                '흑': 'linear-gradient(to right, #8b00ff, #da70d6, #8b00ff, #9932cc, #8b00ff)',
                '황': 'linear-gradient(to right, #ffd700, #ffff99, #ffd700, #ffa500, #ffd700)'
            };
            
            cardNameHtml = `
                <div class="card-name" style="
                    background: ${gradientColors[enhancement] || gradientColors['황']};
                    background-size: 300% 100%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gradient 4s linear infinite;
                    font-weight: bold;
                ">${card.name}</div>
            `;
        }
        
        let monthHtml = `<div class="card-month">${card.month}월</div>`;
        
        if (enhancement) {
            const gradientColors = {
                '청': 'linear-gradient(to right, #00bfff, #87ceeb, #00bfff, #4682b4, #00bfff)',
                '적': 'linear-gradient(to right, #ff4444, #ff7777, #ff4444, #cc0000, #ff4444)',
                '백': 'linear-gradient(to right, #ffffff, #f0f0f0, #ffffff, #e8e8e8, #ffffff)',
                '흑': 'linear-gradient(to right, #8b00ff, #da70d6, #8b00ff, #9932cc, #8b00ff)',
                '황': 'linear-gradient(to right, #ffd700, #ffff99, #ffd700, #ffa500, #ffd700)'
            };
            
            monthHtml = `
                <div class="card-month" style="
                    background: ${gradientColors[enhancement] || gradientColors['황']};
                    background-size: 300% 100%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gradient 4s linear infinite;
                    font-weight: bold;
                ">${card.month}월</div>
            `;
        }
        
        // 9월 열끗 특별 표시
        let specialBadge = '';
        if (card.month === 9 && card.type === '열끗') {
            specialBadge = `
                <div style="
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: linear-gradient(135deg, #ff6b6b, #ffd700);
                    color: white;
                    font-size: 9px;
                    padding: 2px 4px;
                    border-radius: 3px;
                    font-weight: bold;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                ">열/피</div>
            `;
        }
        
        div.innerHTML = `
            ${monthHtml}
            <div class="card-type">${card.type}</div>
            ${cardNameHtml}
            ${specialBadge}
        `;
    }
    
    // 호버 이벤트 추가
    div.addEventListener('mouseenter', () => highlightCard(card.id, true));
    div.addEventListener('mouseleave', () => highlightCard(card.id, false));
    
    return div;
}

// 전역 함수로도 사용 가능하도록
const createCardElement = window.createCardElement;

// 미니 카드 엘리먼트 생성
function createMiniCardElement(card) {
    const div = document.createElement('div');
    div.className = 'card mini-card';
    div.dataset.cardId = card.id;  // 카드 ID 저장
    div.innerHTML = `
        <div style="font-size: 11px; font-weight: bold;">${card.month}월</div>
        <div style="font-size: 9px;">${card.name}</div>
    `;
    
    // 호버 이벤트 추가
    div.addEventListener('mouseenter', () => highlightCard(card.id, true));
    div.addEventListener('mouseleave', () => highlightCard(card.id, false));
    
    return div;
}

// 카드 강화 함수
function enhanceCard(cardId, enhancementType) {
    // 기존 강화 제거
    if (gameState.cardEnhancements[cardId]) {
        console.log(`Removing existing enhancement from card ${cardId}`);
    }
    
    // 새 강화 적용
    gameState.cardEnhancements[cardId] = enhancementType;
    console.log(`Card ${cardId} enhanced with ${enhancementType}`);
    
    // 화면 업데이트
    updateDisplay();
}

// 카드 강화 제거 함수
function removeCardEnhancement(cardId) {
    delete gameState.cardEnhancements[cardId];
    updateDisplay();
}

// 강화 툴팁 표시
function showEnhancementTooltip(event, enhancement, enhanceData) {
    // 기존 툴팁 제거
    hideEnhancementTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.id = 'enhancement-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background: rgba(0, 0, 0, 0.9);
        color: ${enhanceData.color};
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        z-index: 10000;
        pointer-events: none;
        border: 1px solid ${enhanceData.color};
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        white-space: nowrap;
        animation: fadeIn 0.2s ease;
    `;
    
    // 각 강화별 그라데이션 색상 설정
    const gradientColors = {
        '청': 'linear-gradient(to right, #00bfff, #87ceeb, #00bfff, #4682b4, #00bfff)',
        '적': 'linear-gradient(to right, #ff4444, #ff7777, #ff4444, #cc0000, #ff4444)',
        '백': 'linear-gradient(to right, #ffffff, #f0f0f0, #ffffff, #e8e8e8, #ffffff)',
        '흑': 'linear-gradient(to right, #8b00ff, #da70d6, #8b00ff, #9932cc, #8b00ff)',
        '황': 'linear-gradient(to right, #ffd700, #ffff99, #ffd700, #ffa500, #ffd700)'
    };
    
    tooltip.innerHTML = `
        <div style="margin-bottom: 8px;">
            <span style="
                font-size: 14px; 
                font-weight: bold; 
                background: ${gradientColors[enhancement] || gradientColors['황']}; 
                background-size: 300% 100%; 
                -webkit-background-clip: text; 
                background-clip: text; 
                -webkit-text-fill-color: transparent; 
                animation: gradient 4s linear infinite;
            ">${enhancement} 강화</span>
        </div>
        <div style="color: #fff; font-size: 11px;">
            ${enhanceData.effect}
        </div>
    `;
    
    document.body.appendChild(tooltip);
    
    // 위치 설정 (카드 위에 표시)
    const rect = event.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + (rect.width - tooltipRect.width) / 2;
    let top = rect.top - tooltipRect.height - 10;
    
    // 화면 밖으로 나가지 않도록 조정
    if (left < 5) left = 5;
    if (left + tooltipRect.width > window.innerWidth - 5) {
        left = window.innerWidth - tooltipRect.width - 5;
    }
    if (top < 5) {
        // 위에 공간이 없으면 아래에 표시
        top = rect.bottom + 10;
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

// 강화 툴팁 숨기기
function hideEnhancementTooltip() {
    const tooltip = document.getElementById('enhancement-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// 강화 효과 시각적 표시
function showEnhancementEffect(text, color) {
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: fixed;
        left: 50%;
        top: 30%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, ${color}88 0%, ${color}cc 100%);
        color: white;
        padding: 20px 40px;
        border-radius: 15px;
        font-size: 24px;
        font-weight: bold;
        z-index: 2500;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        animation: enhancementPop 1.5s ease;
        border: 2px solid ${color};
    `;
    
    effect.innerHTML = `
        <span style="
            background: linear-gradient(to right, #ffffff, ${color}, #ffffff);
            background-size: 300% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradient 2s linear infinite;
        ">${text}</span>
    `;
    
    // 애니메이션 CSS 추가
    if (!document.getElementById('enhancement-effect-style')) {
        const style = document.createElement('style');
        style.id = 'enhancement-effect-style';
        style.textContent = `
            @keyframes enhancementPop {
                0% { 
                    opacity: 0; 
                    transform: translateX(-50%) translateY(20px) scale(0.8);
                }
                50% { 
                    opacity: 1; 
                    transform: translateX(-50%) translateY(0) scale(1.05);
                }
                100% { 
                    opacity: 0; 
                    transform: translateX(-50%) translateY(-20px) scale(0.95);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(effect);
    
    // 1.5초 후 제거
    setTimeout(() => effect.remove(), 1500);
}


// 카드 하이라이트 함수
function highlightCard(cardId, isHighlight) {
    // 모든 카드 엘리먼트 찾기 (손패, 바닥패, 획득패)
    const allCards = document.querySelectorAll(`[data-card-id="${cardId}"]`);
    
    allCards.forEach(card => {
        // 선택된 카드는 스타일 변경 안함 (CSS 클래스가 처리)
        if (card.classList.contains('selected')) {
            return;
        }
        
        if (isHighlight) {
            card.style.border = '3px solid #ff6b6b';
            card.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.6)';
            card.style.transform = 'scale(1.05)';
        } else {
            // 호버 해제시 완전히 초기화
            card.style.border = '';
            card.style.boxShadow = '';
            card.style.transform = '';
        }
    });
}

// 업그레이드 효과 발동 애니메이션
function triggerUpgradeEffect(upgradeId) {
    const upgradeElements = document.querySelectorAll('.upgrade-item');
    upgradeElements.forEach(element => {
        if (element.dataset.upgradeId === upgradeId) {
            // 애니메이션 클래스 추가
            element.classList.add('upgrade-triggered');
            
            // 툴팁 표시
            const event = new MouseEvent('mouseenter', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(event);
            
            // 애니메이션 종료 후 클래스 제거 및 툴팁 숨김
            setTimeout(() => {
                element.classList.remove('upgrade-triggered');
                const leaveEvent = new MouseEvent('mouseleave', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                element.dispatchEvent(leaveEvent);
            }, 2000);
        }
    });
}

// 두개의 심장 사용 알림
function showTwoHeartsUsed() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        left: 50%;
        top: 30%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
        color: white;
        padding: 30px 50px;
        border-radius: 15px;
        font-size: 24px;
        font-weight: bold;
        z-index: 3001;
        box-shadow: 0 20px 60px rgba(255, 107, 107, 0.5);
        text-align: center;
        animation: heartBeat 2s ease;
    `;
    
    notification.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 15px;">💕</div>
        <div>두개의 심장이 발동되었습니다!</div>
        <div style="font-size: 16px; margin-top: 10px; opacity: 0.9;">
            한 번의 기회를 더 얻었습니다
        </div>
    `;
    
    // 애니메이션 CSS 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes heartBeat {
            0% { 
                opacity: 0; 
                transform: translate(-50%, -50%) scale(0.5);
            }
            20% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.2);
            }
            40% {
                transform: translate(-50%, -50%) scale(0.9);
            }
            60% {
                transform: translate(-50%, -50%) scale(1.1);
            }
            80% {
                transform: translate(-50%, -50%) scale(1);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // 2초 후 제거
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// 관심법 효과 - 덱 맨 위 카드 미리보기
function showTopCardPreview() {
    if (gameState.deck.length === 0) return;
    
    const topCard = gameState.deck[gameState.deck.length - 1];
    const deckElement = document.querySelector('.deck-card');
    
    if (!deckElement) return;
    
    // 덱 요소의 위치 가져오기
    const deckRect = deckElement.getBoundingClientRect();
    
    // 미리보기 카드 생성
    const preview = document.createElement('div');
    preview.style.cssText = `
        position: fixed;
        top: ${deckRect.top - 190}px;
        left: ${deckRect.left + (deckRect.width / 2) - 60}px;
        z-index: 3000;
        animation: topCardReveal 3s ease;
    `;
    
    // 카드 이미지 파일명 결정 (createCardElement와 동일한 로직)
    let imageName = '';
    if (topCard.month === 1) {
        if (topCard.type === '광') imageName = '1_일광.png';
        else if (topCard.type === '홍단') imageName = '1_띠.png';
        else if (topCard.id === 3) imageName = '1_피1.png';
        else if (topCard.id === 4) imageName = '1_피2.png';
    } else if (topCard.month === 2) {
        if (topCard.type === '열끗') imageName = '2_끗.png';
        else if (topCard.type === '홍단') imageName = '2_띠.png';
        else if (topCard.id === 7) imageName = '2_피1.png';
        else if (topCard.id === 8) imageName = '2_피2.png';
    } else if (topCard.month === 3) {
        if (topCard.type === '광') imageName = '3_삼광.png';
        else if (topCard.type === '홍단') imageName = '3_띠.png';
        else if (topCard.id === 11) imageName = '3_피1.png';
        else if (topCard.id === 12) imageName = '3_피2.png';
    } else if (topCard.month === 4) {
        if (topCard.type === '열끗') imageName = '4_끗.png';
        else if (topCard.type === '초단') imageName = '4_띠.png';
        else if (topCard.id === 15) imageName = '4_피1.png';
        else if (topCard.id === 16) imageName = '4_피2.png';
    } else if (topCard.month === 5) {
        if (topCard.type === '열끗') imageName = '5_끗.png';
        else if (topCard.type === '초단') imageName = '5_띠.png';
        else if (topCard.id === 19) imageName = '5_피1.png';
        else if (topCard.id === 20) imageName = '5_피2.png';
    } else if (topCard.month === 6) {
        if (topCard.type === '열끗') imageName = '6_끗.png';
        else if (topCard.type === '청단') imageName = '6_띠.png';
        else if (topCard.id === 23) imageName = '6_피1.png';
        else if (topCard.id === 24) imageName = '6_피2.png';
    } else if (topCard.month === 7) {
        if (topCard.type === '열끗') imageName = '7_끗.png';
        else if (topCard.type === '초단') imageName = '7_띠.png';
        else if (topCard.id === 27) imageName = '7_피1.png';
        else if (topCard.id === 28) imageName = '7_피2.png';
    } else if (topCard.month === 8) {
        if (topCard.type === '광') imageName = '8_팔광.png';
        else if (topCard.type === '열끗') imageName = '8_끗.png';
        else if (topCard.id === 31) imageName = '8_피1.png';
        else if (topCard.id === 32) imageName = '8_피2.png';
    } else if (topCard.month === 9) {
        if (topCard.type === '열끗') imageName = '9_쌍피.png';
        else if (topCard.type === '청단') imageName = '9_띠.png';
        else if (topCard.id === 35) imageName = '9_피1.png';
        else if (topCard.id === 36) imageName = '9_피2.png';
    } else if (topCard.month === 10) {
        if (topCard.type === '열끗') imageName = '10_끗.png';
        else if (topCard.type === '청단') imageName = '10_띠.png';
        else if (topCard.id === 39) imageName = '10_피1.png';
        else if (topCard.id === 40) imageName = '10_피2.png';
    } else if (topCard.month === 11) {
        if (topCard.type === '광') imageName = '11_똥광.png';
        else if (topCard.type === '쌍피') imageName = '11_쌍피.png';
        else if (topCard.id === 43) imageName = '11_피1.png';
        else if (topCard.id === 44) imageName = '11_피2.png';
    } else if (topCard.month === 12) {
        if (topCard.type === '광') imageName = '12_비광.png';
        else if (topCard.type === '열끗') imageName = '12_끗.png';
        else if (topCard.type === '쌍피') imageName = '12_쌍피.png';
        else if (topCard.type === '피') imageName = '12_띠.png';
    }
    
    // 카드 표시
    if (imageName) {
        preview.innerHTML = `
            <div style="
                width: 120px;
                height: 180px;
                border: 3px solid #ffd700;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
                background-image: url('new card/${imageName}');
                background-size: cover;
                background-position: center;
            "></div>
        `;
    } else {
        // 이미지가 없는 경우 텍스트로 표시
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
                    ${topCard.type === '광' ? '☀️' : 
                      topCard.type === '열끗' ? '🦌' : 
                      topCard.type === '단' ? '📜' : '🍃'}
                </div>
                <div style="font-size: 14px;">
                    ${topCard.name}
                </div>
            </div>
        `;
    }
    
    // 애니메이션 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes topCardReveal {
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
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(preview);
    
    // 3초 후 제거
    setTimeout(() => {
        preview.remove();
        style.remove();
    }, 3000);
}

// 업그레이드 표시 업데이트
function updateUpgradesDisplay() {
    const container = document.getElementById('upgrades-list');
    if (!container) return;
    
    // 기존 툴팁 정리
    const existingTooltip = document.getElementById('upgrade-tooltip-active');
    if (existingTooltip) {
        existingTooltip.remove();
    }
    
    container.innerHTML = '';
    
    // 업그레이드 개수 집계
    const upgradeCounts = {};
    gameState.upgrades.forEach(upgrade => {
        if (!upgradeCounts[upgrade.id]) {
            upgradeCounts[upgrade.id] = { upgrade: upgrade, count: 0 };
        }
        upgradeCounts[upgrade.id].count++;
    });
    
    // 업그레이드 표시
    Object.values(upgradeCounts).forEach(item => {
        const upgradeDiv = document.createElement('div');
        upgradeDiv.className = 'upgrade-item';
        upgradeDiv.dataset.upgradeId = item.upgrade.id;
        upgradeDiv.style.cssText = `
            position: relative;
        `;
        
        const rarityColor = {
            'common': '#ffffff',
            'rare': '#4fc3f7',
            'epic': '#ab47bc',
            'legendary': '#ffd700'
        };
        
        upgradeDiv.innerHTML = `
            <span>${item.upgrade.icon}</span>
            ${item.count > 1 ? `<span style="position: absolute; bottom: 0px; right: 0px; background: rgba(255,215,0,0.9); color: #000; font-size: 9px; padding: 1px 4px; border-radius: 50%; font-weight: bold; min-width: 14px; text-align: center;">${item.count}</span>` : ''}
        `;
        
        // 툴팁 표시 함수
        upgradeDiv.addEventListener('mouseenter', function(e) {
            // 기존 툴팁 제거
            const existingTooltip = document.getElementById('upgrade-tooltip-active');
            if (existingTooltip) {
                existingTooltip.remove();
            }
            
            // 새 툴팁 생성
            const tooltip = document.createElement('div');
            tooltip.id = 'upgrade-tooltip-active';
            tooltip.innerHTML = `
                <div style="color: ${rarityColor[item.upgrade.rarity]}; font-weight: bold; margin-bottom: 4px;">
                    ${item.upgrade.name}
                </div>
                <div style="font-size: 11px; color: #ddd;">
                    ${item.upgrade.description}${item.count > 1 ? ` (×${item.count})` : ''}
                </div>
            `;
            tooltip.style.cssText = `
                position: fixed;
                background: rgba(20, 20, 20, 0.98);
                color: white;
                padding: 10px 14px;
                border-radius: 8px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 99999;
                pointer-events: none;
                border: 1px solid ${rarityColor[item.upgrade.rarity]};
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            `;
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = (rect.right + 10) + 'px';
            tooltip.style.top = rect.top + (rect.height / 2) + 'px';
            tooltip.style.transform = 'translateY(-50%)';
            
            document.body.appendChild(tooltip);
        });
        
        upgradeDiv.addEventListener('mouseleave', function() {
            const tooltip = document.getElementById('upgrade-tooltip-active');
            if (tooltip) {
                tooltip.remove();
            }
        });
        
        // 컨테이너에 추가
        container.appendChild(upgradeDiv);
    });
}

// 업그레이드 시스템
const upgradePool = [
    { id: 'chodan_blessing', name: '초단의 축복', icon: '🍀', description: '초단(초색 띠 3장)을 모으면 추가 +5점', rarity: 'rare', price: 8 },
    { id: 'cheongdan_blessing', name: '청단의 축복', icon: '💙', description: '청단(청색 띠 3장)을 모으면 추가 +5점', rarity: 'rare', price: 8 },
    { id: 'hongdan_blessing', name: '홍단의 축복', icon: '❤️', description: '홍단(홍색 띠 3장)을 모으면 추가 +5점', rarity: 'rare', price: 8 },
    { id: 'extra_discard', name: '추가 버리기', icon: '♻️', description: '버리기 가능 횟수 +1', rarity: 'common', price: 5 },
    { id: 'base_multiplier', name: '기본 배수 강화', icon: '✨', description: '기본 배수 +0.5', rarity: 'common', price: 5 },
    { id: 'bonus_pi', name: '보너스피', icon: '🎯', description: '기본 점수 +2', rarity: 'common', price: 4 },
    { id: 'gwangbak_charm', name: '광박의 부적', icon: '🌟', description: '라운드 종료시 바닥에 광이 없으면 배수×2', rarity: 'epic', price: 12 },
    { id: 'pibak_charm', name: '피박의 부적', icon: '🩸', description: '라운드 종료시 바닥에 피가 없으면 배수×2', rarity: 'epic', price: 12 },
    { id: 'gwang_38', name: '38광땡', icon: '🌠', description: '3광과 8광을 동시에 보유하면 추가 +10점', rarity: 'rare', price: 8 },
    { id: 'gwang_13', name: '13광땡', icon: '⭐', description: '1광과 3광을 동시에 보유하면 추가 +5점', rarity: 'common', price: 4 },
    { id: 'gwang_18', name: '18광땡', icon: '✦', description: '1광과 8광을 동시에 보유하면 추가 +5점', rarity: 'common', price: 4 },
    { id: 'samjokoh_foot', name: '삼족오 발', icon: '🦅', description: '바닥에 같은 월 3장 모이면 ×3배수 (×1 대신)', rarity: 'epic', price: 15 },
    { id: 'shake_shake', name: '흔들흔들', icon: '🎲', description: '라운드 종료시 손에 같은 월 3장 있으면 ×3배수', rarity: 'epic', price: 15 },
    { id: 'no_possession', name: '무소유', icon: '🚫', description: '스테이지 시작 시 바닥 패가 없이 시작한다', rarity: 'common', price: 3 },
    { id: 'maple_hand', name: '단풍손', icon: '🍁', description: '손패 카드가 -1(총 4장) 되지만, 기본점수 +4', rarity: 'rare', price: 7 },
    { id: 'mind_reading', name: '관심법', icon: '👁️', description: '매 스테이지 시작 시 덱 맨 위의 카드를 알고 시작한다', rarity: 'rare', price: 6 },
    { id: 'seven_pi', name: '칠지도', icon: '7️⃣', description: '피 카드가 정확히 7장이면 추가로 +10점', rarity: 'rare', price: 9 },
    { id: 'stupid_fish', name: '멍텅구리', icon: '🐟', description: '열끗 카드도 장당 1점을 얻는다', rarity: 'rare', price: 9 },
    { id: 'sunny_after_rain', name: '비온뒤 맑음', icon: '🌤️', description: '덱에서 12월 패 4장이 제거됨', rarity: 'epic', price: 10 },
    { id: 'tiger_cave', name: '호랑이굴', icon: '🐯', description: '매 라운드 첫턴은 버리기 불가, 기본 점수 +5', rarity: 'rare', price: 7 },
    { id: 'triple_discard', name: '일타삼피', icon: '3️⃣', description: '버리기시 양옆 카드도 같이 버려짐', rarity: 'epic', price: 13 },
    { id: 'thousand_mile', name: '천리길', icon: '🛤️', description: '스테이지 번호 × 1 만큼 기본 점수 추가', rarity: 'rare', price: 8 },
    { id: 'reincarnation', name: '윤회', icon: '♻️', description: '버린 카드가 덱으로 돌아가고, 버리기당 +2점', rarity: 'epic', price: 14 },
    { id: 'two_hearts', name: '두개의 심장', icon: '💕', description: '한 번 패배해도 게임이 끝나지 않음 (1회용)', rarity: 'legendary', price: 20 },
    { id: 'nolbu_treasure', name: '놀부심보', icon: '💰', description: '첫 턴에 카드 2장 추가 드로우, 이후 추가 드로우 불가', rarity: 'epic', price: 15 },
    
    // 카드 강화 아이템 - 사신수 보주 (구버전 - hwatu-shop.js로 이전됨)
    // { id: 'enhance_blue', name: '청룡의 보주', icon: '🔵', description: '덱에서 무작위 5장 중 1장을 선택하여 청 강화 부여', rarity: 'common', price: 6, type: 'enhancement', enhanceType: '청' },
    // { id: 'enhance_red', name: '주작의 보주', icon: '🔴', description: '덱에서 무작위 5장 중 1장을 선택하여 적 강화 부여', rarity: 'common', price: 6, type: 'enhancement', enhanceType: '적' },
    // { id: 'enhance_white', name: '백호의 보주', icon: '⚪', description: '덱에서 무작위 5장 중 1장을 선택하여 백 강화 부여', rarity: 'rare', price: 8, type: 'enhancement', enhanceType: '백' },
    // { id: 'enhance_black', name: '현무의 보주', icon: '⚫', description: '덱에서 무작위 5장 중 1장을 선택하여 흑 강화 부여', rarity: 'rare', price: 8, type: 'enhancement', enhanceType: '흑' },
    // { id: 'enhance_gold', name: '황룡의 보주', icon: '🟡', description: '덱에서 무작위 5장 중 1장을 선택하여 황 강화 부여', rarity: 'epic', price: 10, type: 'enhancement', enhanceType: '황' },
    // { id: 'enhance_random', name: '오색의 보주', icon: '🌈', description: '덱에서 무작위 5장 중 1장을 선택하여 무작위 강화 부여', rarity: 'rare', price: 5, type: 'enhancement', enhanceType: 'random' },
    // { id: 'remove_card', name: '무극의 보주', icon: '🌀', description: '덱에서 무작위 5장 중 1장을 선택하여 완전히 제거', rarity: 'epic', price: 12, type: 'remove' },
    // { id: 'duplicate_card', name: '쌍생의 보주', icon: '♊', description: '덱에서 무작위 5장 중 1장을 선택하여 복제 (덱에 추가)', rarity: 'epic', price: 10, type: 'duplicate' },
];

let shopUpgrades = []; // 상점에 표시된 업그레이드들
let purchasedUpgrades = []; // 이번 상점에서 구매한 업그레이드들

// BGM 볼륨 페이드 전환 함수
function fadeVolume(audioElement, targetVolume, duration = 1000) {
    const startVolume = audioElement.volume;
    const volumeChange = targetVolume - startVolume;
    const steps = 20;
    const stepTime = duration / steps;
    let currentStep = 0;
    
    const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        audioElement.volume = startVolume + (volumeChange * progress);
        
        if (currentStep >= steps) {
            clearInterval(interval);
            audioElement.volume = targetVolume;
        }
    }, stepTime);
}

// BGM 전환 (크로스페이드 효과)
function switchBGM(type) {
    const currentBgm = document.getElementById('bgm');
    if (!currentBgm) return;
    
    const isPlaying = !currentBgm.paused;
    if (!isPlaying) {
        // BGM이 재생 중이 아니면 단순히 소스만 변경
        if (type === 'shop') {
            currentBgm.src = 'bgm/Card Shark Serenade.mp3';
        } else if (type === 'boss') {
            currentBgm.src = 'bgm/boss.mp3';
        } else if (type === 'goblin') {
            currentBgm.src = 'bgm/dokebi store.mp3';
        } else {
            currentBgm.src = 'bgm/Card Chaos.mp3';
        }
        return;
    }
    
    // 현재 BGM이 이미 목표 BGM이면 전환하지 않음
    let targetSrc;
    if (type === 'shop') {
        targetSrc = 'bgm/Card Shark Serenade.mp3';
    } else if (type === 'boss') {
        targetSrc = 'bgm/boss.mp3';
    } else if (type === 'goblin') {
        targetSrc = 'bgm/dokebi store.mp3';
    } else {
        targetSrc = 'bgm/Card Chaos.mp3';
    }
    
    if (currentBgm.src.includes(targetSrc.replace('bgm/', ''))) {
        return;
    }
    
    // 새 BGM 엘리먼트 생성 (크로스페이드용)
    const newBgm = document.createElement('audio');
    newBgm.id = 'bgm-temp';
    newBgm.src = targetSrc;
    newBgm.loop = true;
    newBgm.volume = 0;
    document.body.appendChild(newBgm);
    
    // 새 BGM 재생 시작
    newBgm.play().then(() => {
        // 현재 BGM 페이드 아웃
        fadeVolume(currentBgm, 0, 1000);
        // 새 BGM 페이드 인
        fadeVolume(newBgm, 1, 1000);
        
        // 페이드 완료 후 정리
        setTimeout(() => {
            currentBgm.pause();
            currentBgm.src = targetSrc;
            currentBgm.volume = 1;
            currentBgm.currentTime = newBgm.currentTime;
            currentBgm.play().catch(e => console.log('BGM 전환 실패:', e));
            newBgm.remove();
        }, 1000);
    }).catch(e => {
        console.log('새 BGM 재생 실패:', e);
        newBgm.remove();
    });
}

// 주막 BGM으로 전환
function switchToShopBGM() {
    switchBGM('shop');
}

// 게임 BGM으로 전환
function switchToGameBGM() {
    switchBGM('game');
}

// 업그레이드 상점 표시
function showUpgradeSelection() {
    // 50% 확률로 도깨비 상점 결정
    const isGoblinShop = Math.random() < 0.5;
    
    // 도깨비 상점이면 도깨비 BGM, 아니면 주막 BGM으로 전환
    if (isGoblinShop) {
        switchBGM('goblin');
    } else {
        switchToShopBGM();
    }
    
    // play 컨테이너를 상점으로 변환
    const playContainer = document.getElementById('play-container');
    
    // 초기화
    purchasedUpgrades = [];
    
    // play 컨테이너 내용을 상점으로 교체 (소모품 카드 영역과 덱 정보는 유지)
    playContainer.innerHTML = `
        <div id="upgrades-info">
            <div id="upgrades-list">
                <!-- 동적으로 생성됨 -->
            </div>
        </div>
        
        <div class="shop-container" style="width: 100%; height: 100%; display: flex; flex-direction: column; padding: 20px; position: relative;">
            <div class="shop-header" style="text-align: center; margin-bottom: 15px;">
                <h3 style="color: ${isGoblinShop ? '#ff6b6b' : '#ffd700'}; font-size: 20px; margin: 0;">${isGoblinShop ? '👺 도깨비 상점' : '🏪 주막'}</h3>
            </div>
            <div class="upgrade-choices" id="upgrade-choices" style="
                flex: 1;
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                justify-content: center;
                align-items: center;
                overflow-y: auto;
                padding: 20px;
            ">
                <!-- 동적으로 생성됨 -->
            </div>
            <div class="shop-footer" style="text-align: center; padding: 20px;">
                <button class="btn btn-primary" onclick="proceedToNextStage()" style="
                    padding: 15px 40px;
                    font-size: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">다음 스테이지로</button>
            </div>
        </div>
        
        <!-- 소모품 카드 영역 (우측 하단) -->
        <div id="consumable-area" style="
            position: absolute;
            bottom: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            padding: 15px;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(20, 20, 20, 0.5) 100%);
            border: 2px solid rgba(255, 215, 0, 0.3);
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(5px);
        ">
            <div id="consumable-slot-1" class="consumable-slot" style="
                width: 80px;
                height: 110px;
                border: 2px dashed rgba(255, 215, 0, 0.3);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
            "></div>
            <div id="consumable-slot-2" class="consumable-slot" style="
                width: 80px;
                height: 110px;
                border: 2px dashed rgba(255, 215, 0, 0.3);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
            "></div>
        </div>
        
        <!-- 덱 정보 -->
        <div id="deck-info">
            <div class="deck-card">
                🎴
                <div class="deck-remaining-label">
                    덱 <span id="deck-remaining">48</span>/<span id="deck-total">48</span>
                </div>
            </div>
        </div>
    `;
    
    const choicesContainer = document.getElementById('upgrade-choices');
    
    // shopManager의 아이템과 upgradePool을 합치기
    const allItems = [];
    
    // upgradePool의 아이템들 추가
    upgradePool.forEach(item => {
        if (!item.category) {
            // 기존 upgradePool 아이템 분류
            if (item.type === 'enhancement' || item.type === 'remove' || item.type === 'duplicate') {
                item.category = 'orb';
            } else {
                item.category = 'treasure';
            }
        }
        allItems.push(item);
    });
    
    // shopManager의 아이템들 추가 (중복 방지)
    if (typeof shopManager !== 'undefined') {
        shopManager.items.forEach(item => {
            if (!allItems.find(i => i.id === item.id)) {
                allItems.push(item);
            }
        });
    }
    
    // 도깨비 상점인 경우 epic 이상 등급만 필터링
    let filteredItems = allItems;
    if (isGoblinShop) {
        filteredItems = allItems.filter(item => {
            // 등급이 epic, legendary, mythic인 아이템만 (rarity 필드 사용)
            return item.rarity === 'epic' || item.rarity === 'legendary' || item.rarity === 'mythic';
        });
    }
    
    // 카테고리별로 분리
    const treasures = filteredItems.filter(u => u.category === 'treasure');
    const orbs = filteredItems.filter(u => u.category === 'orb');
    const consumables = filteredItems.filter(u => u.category === 'consumable');
    const consumableCards = filteredItems.filter(u => u.category === 'consumable_card');
    
    shopUpgrades = [];
    
    // 현재 보유한 보물 개수 확인
    const ownedTreasures = gameState.upgrades.filter(u => 
        u.category === 'treasure' || 
        (!u.category && u.type !== 'enhancement' && u.type !== 'remove' && u.type !== 'duplicate')
    );
    const treasureCount = ownedTreasures.length;
    const canBuyTreasures = treasureCount < 5; // 최대 5개 제한
    
    // 이미 보유한 보물 제외하고 선택
    const availableTreasures = treasures.filter(t => 
        !gameState.upgrades.some(u => u.id === t.id) &&
        !gameStateManager.state.purchasedItems.has(t.id)
    );
    
    // 보물 추가 (최대 2개, 5개 제한 고려)
    if (canBuyTreasures && availableTreasures.length > 0) {
        const treasuresToShow = Math.min(2, 5 - treasureCount, availableTreasures.length);
        for (let i = 0; i < treasuresToShow; i++) {
            const index = Math.floor(Math.random() * availableTreasures.length);
            shopUpgrades.push(availableTreasures[index]);
            availableTreasures.splice(index, 1);
        }
    }
    
    // 보주, 소모품, 소모품 카드를 섞어서 3개 선택
    const mixedItems = [...orbs, ...consumables, ...consumableCards];
    const shuffledMixed = mixedItems.sort(() => Math.random() - 0.5);
    for (let i = 0; i < 3 && i < shuffledMixed.length; i++) {
        shopUpgrades.push(shuffledMixed[i]);
    }
    
    // 첫 번째 줄 (보물 2개)
    const firstRow = document.createElement('div');
    firstRow.style.cssText = `
        display: flex;
        gap: 20px;
        justify-content: center;
        margin-bottom: 20px;
        width: 100%;
    `;
    
    // 두 번째 줄 (보주 3개)
    const secondRow = document.createElement('div');
    secondRow.style.cssText = `
        display: flex;
        gap: 20px;
        justify-content: center;
        width: 100%;
    `;
    
    // 업그레이드 카드 생성
    shopUpgrades.forEach((upgrade, index) => {
        const card = document.createElement('div');
        card.className = 'upgrade-card';
        card.dataset.upgradeId = upgrade.id;
        card.style.position = 'relative'; // 카테고리 절대 위치를 위해 추가
        
        // 강화 관련 텍스트에 애니메이션 그라데이션 효과 적용
        let enhancedDescription = upgrade.description;
        let gradientClass = '';
        
        // 업그레이드 설명에서 강화 관련 키워드 찾기
        if (upgrade.description.includes('청단') || upgrade.description.includes('청')) {
            gradientClass = 'gradient-청';
        } else if (upgrade.description.includes('홍단') || upgrade.description.includes('적')) {
            gradientClass = 'gradient-적';
        } else if (upgrade.description.includes('백')) {
            gradientClass = 'gradient-백';
        } else if (upgrade.description.includes('흑')) {
            gradientClass = 'gradient-흑';
        } else if (upgrade.description.includes('황') || upgrade.description.includes('금') || upgrade.description.includes('광')) {
            gradientClass = 'gradient-황';
        }
        
        // 강화 관련 설명이면 애니메이션 그라데이션 적용
        if (gradientClass) {
            enhancedDescription = `
                <div class="animated-gradient-text ${gradientClass}">
                    <div class="gradient-overlay"></div>
                    <div class="text-content">${upgrade.description}</div>
                </div>
            `;
        }
        
        // 카테고리 결정
        let category = '보물';
        if (upgrade.type === 'enhancement' || upgrade.type === 'remove' || upgrade.type === 'duplicate') {
            category = '보주';
        } else if (upgrade.category === 'consumable') {
            category = '소모';
        } else if (upgrade.category === 'consumable_card') {
            category = '소모카드';
        } else if (upgrade.category === 'orb') {
            category = '보주';
        }
        
        // 등급별 그라데이션 클래스 결정
        let rarityGradientClass = '';
        switch(upgrade.rarity) {
            case 'common':
                rarityGradientClass = 'gradient-common';
                break;
            case 'rare':
                rarityGradientClass = 'gradient-rare';
                break;
            case 'epic':
                rarityGradientClass = 'gradient-epic';
                break;
            case 'legendary':
                rarityGradientClass = 'gradient-legendary';
                break;
        }
        
        card.innerHTML = `
            <div class="upgrade-rarity rarity-${upgrade.rarity}">${upgrade.rarity.toUpperCase()}</div>
            <div class="upgrade-category" style="
                position: absolute;
                left: 10px;
                top: 10px;
                font-size: 11px;
                color: #aaa;
                font-weight: bold;
                text-transform: uppercase;
            ">${category}</div>
            <div class="upgrade-icon">${upgrade.icon}</div>
            <div class="upgrade-name">
                <div class="animated-gradient-text ${rarityGradientClass}">
                    <div class="gradient-overlay"></div>
                    <div class="text-content">${upgrade.name}</div>
                </div>
            </div>
            <div class="upgrade-price">${upgrade.price}</div>
        `;
        
        // 소지금 관계없이 클릭 가능 (설명 보기)
        card.onclick = () => showPurchaseTooltip(upgrade, card);
        
        // 첫 2개는 첫번째 줄, 나머지 3개는 두번째 줄
        if (index < 2) {
            firstRow.appendChild(card);
        } else {
            secondRow.appendChild(card);
        }
    });
    
    // 컨테이너에 두 줄 추가
    choicesContainer.appendChild(firstRow);
    choicesContainer.appendChild(secondRow);
    
    // 소모품 카드 영역 업데이트
    updateConsumableCards();
    
    // 덱 카운트 업데이트
    updateDeckCount();
    
    // 업그레이드 표시 업데이트
    updateUpgradesDisplay();
}

// 상점 버튼 상태 새로고침
function refreshShopButtons() {
    const shopCards = document.querySelectorAll('.upgrade-card');
    shopCards.forEach(card => {
        const upgradeId = card.dataset.upgradeId;
        if (!upgradeId) return;
        
        const upgrade = shopUpgrades.find(u => u.id === upgradeId);
        if (!upgrade) return;
        
        // 보물 아이템이고 이미 구매했으면 비활성화
        if (upgrade.category === 'treasure' && gameStateManager.state.purchasedItems.has(upgradeId)) {
            card.classList.add('purchased');
            card.style.opacity = '0.5';
            card.style.pointerEvents = 'none';
        }
        
        // 구매 가능 여부 체크
        const canPurchase = shopManager.canPurchase(upgradeId);
        if (!canPurchase) {
            card.style.opacity = '0.7';
        }
    });
}

// 덱 카운트 업데이트
function updateDeckCount() {
    const deckRemaining = document.getElementById('deck-remaining');
    const deckTotal = document.getElementById('deck-total');
    
    if (deckRemaining && deckTotal) {
        // 전체 카드 수 계산 (기본 48장 + 복제된 카드 - 제거된 카드)
        let totalCards = 48;
        
        if (typeof gameStateManager !== 'undefined') {
            totalCards = totalCards - gameStateManager.state.removedCards.size + gameStateManager.state.duplicatedCards.size;
        }
        
        // 현재 덱에 남은 카드 수
        const remaining = gameState.deck ? gameState.deck.length : totalCards;
        
        deckRemaining.textContent = remaining;
        deckTotal.textContent = totalCards;
    }
}

// 구매 툴팁 표시
function showPurchaseTooltip(upgrade, cardElement) {
    // 기존 툴팁 제거
    hidePurchaseTooltip();
    
    // 카드 위치 가져오기
    const rect = cardElement.getBoundingClientRect();
    
    // 구매 가능 여부 확인
    let canPurchase = gameState.gold >= upgrade.price;
    let purchaseMessage = '';
    
    // 보물의 경우 5개 제한 체크
    if (upgrade.category === 'treasure') {
        const treasureCount = gameState.upgrades.filter(u => 
            u.category === 'treasure' || 
            (!u.category && u.type !== 'enhancement' && u.type !== 'remove' && u.type !== 'duplicate')
        ).length;
        
        if (treasureCount >= 5) {
            canPurchase = false;
            purchaseMessage = '(보물 최대 보유)';
        }
    }
    
    // 소모품 카드의 경우 슬롯 체크 (계절 패 제외)
    if (upgrade.category === 'consumable_card' || upgrade.category === 'consumable') {
        // 계절 패는 즉시 사용되므로 슬롯 체크 제외
        if (!upgrade.id.includes('_pack')) {
            const consumableSlotsFull = gameStateManager.state.consumableCards.length >= 2;
            if (consumableSlotsFull) {
                canPurchase = false;
                purchaseMessage = '(소모품 슬롯 가득참)';
            }
        }
    }
    
    // 소지금 부족 체크
    if (gameState.gold < upgrade.price) {
        canPurchase = false;
        purchaseMessage = '(소지금 부족)';
    }
    
    const canAfford = canPurchase; // 기존 변수명 호환성 유지
    
    // 툴팁 생성
    const tooltip = document.createElement('div');
    tooltip.id = 'purchase-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%);
        border: 2px solid #ffd700;
        border-radius: 10px;
        padding: 15px;
        z-index: 10000;
        min-width: 200px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        animation: fadeIn 0.2s ease;
    `;
    
    // 등급별 그라데이션 클래스 결정
    let rarityGradientClass = '';
    switch(upgrade.rarity) {
        case 'common':
            rarityGradientClass = 'gradient-common';
            break;
        case 'rare':
            rarityGradientClass = 'gradient-rare';
            break;
        case 'epic':
            rarityGradientClass = 'gradient-epic';
            break;
        case 'legendary':
            rarityGradientClass = 'gradient-legendary';
            break;
    }
    
    tooltip.innerHTML = `
        <div style="text-align: center; margin-bottom: 10px;">
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">
                <div class="animated-gradient-text ${rarityGradientClass}">
                    <div class="gradient-overlay"></div>
                    <div class="text-content">${upgrade.name}</div>
                </div>
            </div>
            <div style="font-size: 14px; color: #fff; opacity: 0.9; margin-bottom: 10px;">
                ${upgrade.description}
            </div>
            <div style="font-size: 16px; color: ${canAfford ? '#ffd700' : '#ff4444'};">
                가격: ${upgrade.price} ${purchaseMessage}
            </div>
        </div>
        <button ${!canAfford ? 'disabled' : ''} onclick="${canAfford ? `confirmPurchase('${upgrade.id}')` : ''}" style="
            width: 100%;
            padding: 10px;
            background: ${canAfford ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : 'linear-gradient(135deg, #666 0%, #444 100%)'};
            color: ${canAfford ? 'white' : '#999'};
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            cursor: ${canAfford ? 'pointer' : 'not-allowed'};
            transition: all 0.3s ease;
        " ${canAfford ? `onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"` : ''}>
            ${canAfford ? '구매하기' : purchaseMessage.replace(/[()]/g, '')}
        </button>
    `;
    
    document.body.appendChild(tooltip);
    
    // 위치 설정 (카드 위에 표시)
    const left = rect.left + rect.width / 2 - 100;
    const top = rect.top - tooltip.offsetHeight - 10;
    
    // 화면 벗어남 방지
    const adjustedLeft = Math.max(10, Math.min(left, window.innerWidth - tooltip.offsetWidth - 10));
    const adjustedTop = top < 10 ? rect.bottom + 10 : top;
    
    tooltip.style.left = adjustedLeft + 'px';
    tooltip.style.top = adjustedTop + 'px';
    
    // 카드 클릭 이벤트 임시 변경 (툴팁 닫기)
    cardElement.onclick = hidePurchaseTooltip;
    
    // 다른 곳 클릭 시 툴팁 닫기
    setTimeout(() => {
        document.addEventListener('click', hidePurchaseTooltipOnClickOutside);
    }, 100);
}

// 구매 툴팁 숨기기
function hidePurchaseTooltip() {
    const tooltip = document.getElementById('purchase-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
    
    // 이벤트 리스너 제거
    document.removeEventListener('click', hidePurchaseTooltipOnClickOutside);
    
    // 카드 클릭 이벤트 복원
    const cards = document.querySelectorAll('.upgrade-card');
    cards.forEach(card => {
        if (card.classList.contains('purchased')) return;
        
        const upgradeId = card.dataset.upgradeId;
        const upgrade = shopUpgrades.find(u => u.id === upgradeId);
        if (upgrade) {
            card.onclick = () => showPurchaseTooltip(upgrade, card);
        }
    });
}

// 툴팁 외부 클릭 시 닫기
function hidePurchaseTooltipOnClickOutside(event) {
    const tooltip = document.getElementById('purchase-tooltip');
    if (tooltip && !tooltip.contains(event.target)) {
        hidePurchaseTooltip();
    }
}

// 구매 확인
function confirmPurchase(upgradeId) {
    const upgrade = shopUpgrades.find(u => u.id === upgradeId);
    const cardElement = document.querySelector(`[data-upgrade-id="${upgradeId}"]`);
    
    if (upgrade && cardElement) {
        hidePurchaseTooltip();
        purchaseUpgrade(upgrade, cardElement);
    }
}

// 업그레이드 구매
function purchaseUpgrade(upgrade, cardElement) {
    // 소지금 확인
    if (gameState.gold < upgrade.price) {
        return;
    }
    
    // 이미 구매한 업그레이드인지 확인
    if (purchasedUpgrades.some(u => u.id === upgrade.id)) {
        return;
    }
    
    // gameStateManager와 gameState 동기화
    if (typeof gameStateManager !== 'undefined') {
        gameStateManager.state.gold = gameState.gold;
        gameStateManager.state.discardsRemaining = gameState.discardsLeft;
        gameStateManager.state.playerScore = gameState.score;
        gameStateManager.state.consumableCards = gameState.consumableCards || [];
    }
    
    // shopManager가 있고 해당 아이템이 shopManager에 있는 경우
    if (typeof shopManager !== 'undefined' && shopManager.items.find(i => i.id === upgrade.id)) {
        // shopManager를 통해 구매 처리
        const success = shopManager.purchaseItem(upgrade.id);
        if (success) {
            // gameState와 동기화
            gameState.gold = gameStateManager.state.gold;
            gameState.discardsLeft = gameStateManager.state.discardsRemaining;
            gameState.score = gameStateManager.state.playerScore;
            gameState.consumableCards = gameStateManager.state.consumableCards;
            
            purchasedUpgrades.push(upgrade);
            cardElement.classList.add('purchased');
            cardElement.style.opacity = '0.5';
            cardElement.style.pointerEvents = 'none';
            updateDisplay();
            updateConsumableCards();  // 소모품 카드 영역 업데이트
            updateDeckCount();  // 덱 카운트 업데이트
            refreshShopButtons();  // 상점 버튼 상태 업데이트
        }
        return;
    }
    
    // 소지금 차감
    gameState.gold -= upgrade.price;
    
    // 강화 아이템인 경우 카드 선택 화면 표시
    if (upgrade.type === 'enhancement') {
        purchasedUpgrades.push(upgrade);
        showCardEnhancementSelection(upgrade, cardElement);
        return;
    }
    
    // 카드 제거 아이템인 경우
    if (upgrade.type === 'remove') {
        purchasedUpgrades.push(upgrade);
        showCardRemovalSelection(upgrade, cardElement);
        return;
    }
    
    // 카드 복제 아이템인 경우
    if (upgrade.type === 'duplicate') {
        purchasedUpgrades.push(upgrade);
        showCardDuplicationSelection(upgrade, cardElement);
        return;
    }
    
    // 일반 업그레이드 적용
    gameState.upgrades.push(upgrade);
    purchasedUpgrades.push(upgrade);
    applyUpgrade(upgrade);
    
    // 효과 발동 알림
    triggerUpgradeEffect(upgrade.id);
    
    // UI 업데이트
    cardElement.classList.add('purchased');
    cardElement.onclick = null;
    const priceElement = cardElement.querySelector('.upgrade-price');
    if (priceElement) {
        priceElement.textContent = '구매완료';
    }
    
    
    // 다른 카드들의 구매 가능 여부 재확인
    updateShopAffordability();
}

// 카드 강화 선택 화면 표시
function showCardEnhancementSelection(upgrade, shopCardElement) {
    // 덱에서 무작위로 5장 선택 (제거된 카드만 제외)
    const availableCards = HWATU_CARDS.filter(card => {
        return !gameState.removedCards || !gameState.removedCards.includes(card.id);
    });
    
    if (availableCards.length === 0) {
        alert('강화할 카드가 없습니다!');
        // 소지금 환불
        gameState.gold += upgrade.price;
        updateShopAffordability();
        return;
    }
    
    // 무작위 5장 선택
    const shuffled = availableCards.sort(() => Math.random() - 0.5);
    const cardsToShow = shuffled.slice(0, Math.min(5, availableCards.length));
    
    // CardSelectionComponent 사용
    CardSelectionComponent.create(cardsToShow, {
        title: '강화할 카드 선택',
        description: `${upgrade.name} - ${upgrade.enhanceType === 'random' ? '무작위' : upgrade.enhanceType} 강화`,
        showEnhancement: true,
        onSelect: (selectedCard) => {
            applyEnhancementToCard(selectedCard.id, upgrade, shopCardElement, null);
            updateDeckCount();
        },
        onCancel: () => {
            // 취소 기능 제거 - 환불 없음
        }
    });
    
    return;
    
    // 이하 기존 코드 (사용하지 않음)
    const selectionOverlay = document.createElement('div');
    selectionOverlay.id = 'enhancement-selection-overlay';
    selectionOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
    `;
    
    selectionOverlay.innerHTML = `
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); 
                    border-radius: 20px; 
                    padding: 30px; 
                    max-width: 800px;">
            <h2 style="color: #ffd700; text-align: center; margin-bottom: 20px; font-size: 28px;">
                강화할 카드를 선택하세요
            </h2>
            <div style="color: white; text-align: center; margin-bottom: 20px;">
                ${upgrade.name} - ${upgrade.enhanceType === 'random' ? '무작위' : upgrade.enhanceType} 강화
            </div>
            <div id="enhancement-card-choices" style="
                display: flex;
                gap: 20px;
                justify-content: center;
                flex-wrap: wrap;
                margin-bottom: 20px;
            "></div>
            <div style="text-align: center; display: flex; gap: 10px; justify-content: center;">
                <button id="apply-enhancement-btn" onclick="applySelectedEnhancement('${upgrade.id}')" style="
                    padding: 10px 30px;
                    background: linear-gradient(135deg, #666 0%, #444 100%);
                    color: #999;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: not-allowed;
                    display: none;
                " disabled>적용</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(selectionOverlay);
    
    // 카드 표시
    const choicesContainer = document.getElementById('enhancement-card-choices');
    cardsToShow.forEach(card => {
        const cardDiv = createCardElement(card);
        cardDiv.style.cursor = 'pointer';
        cardDiv.style.transition = 'all 0.3s ease';
        cardDiv.style.position = 'relative';
        
        // 기존 강화 표시
        if (gameState.cardEnhancements[card.id]) {
            const currentEnhance = gameState.cardEnhancements[card.id];
            const enhanceType = ENHANCEMENT_TYPES[Object.keys(ENHANCEMENT_TYPES).find(key => 
                ENHANCEMENT_TYPES[key].name === currentEnhance)];
            if (enhanceType) {
                const badge = document.createElement('div');
                badge.style.cssText = `
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background: ${enhanceType.color};
                    color: ${enhanceType.name === '황' ? '#000' : '#fff'};
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 16px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    z-index: 10;
                `;
                badge.textContent = currentEnhance;
                cardDiv.appendChild(badge);
            }
        }
        
        cardDiv.onclick = () => {
            // 이전 선택 해제
            const prevSelected = choicesContainer.querySelector('.selected-card');
            if (prevSelected) {
                prevSelected.classList.remove('selected-card');
                prevSelected.style.border = '';
                prevSelected.style.boxShadow = '';
                prevSelected.style.transform = '';
            }
            
            // 현재 카드 선택
            selectedCardId = card.id;
            cardDiv.classList.add('selected-card');
            cardDiv.style.border = '4px solid #ffd700';
            cardDiv.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
            cardDiv.style.transform = 'scale(1.1)';
            
            // 적용 버튼 활성화
            const applyBtn = document.getElementById('apply-enhancement-btn');
            if (applyBtn) {
                applyBtn.style.display = 'inline-block';
                applyBtn.disabled = false;
                applyBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                applyBtn.style.color = 'white';
                applyBtn.style.cursor = 'pointer';
            }
            
            // 선택된 카드 정보를 전역에 저장
            window.selectedEnhancementData = {
                cardId: card.id,
                upgrade: upgrade,
                shopCardElement: shopCardElement,
                selectionOverlay: selectionOverlay
            };
        };
        cardDiv.onmouseover = () => {
            if (!cardDiv.classList.contains('selected-card')) {
                cardDiv.style.transform = 'translateY(-10px) scale(1.1)';
                cardDiv.style.boxShadow = '0 10px 30px rgba(255, 215, 0, 0.5)';
            }
        };
        cardDiv.onmouseout = () => {
            if (!cardDiv.classList.contains('selected-card')) {
                cardDiv.style.transform = '';
                cardDiv.style.boxShadow = '';
            }
        };
        choicesContainer.appendChild(cardDiv);
    });
}

// 선택된 강화 적용
function applySelectedEnhancement(upgradeId) {
    if (window.selectedEnhancementData) {
        const { cardId, upgrade, shopCardElement, selectionOverlay } = window.selectedEnhancementData;
        applyEnhancementToCard(cardId, upgrade, shopCardElement, selectionOverlay);
        window.selectedEnhancementData = null;
    }
}

// 강화 취소 (환불)
function cancelEnhancement(upgradeId) {
    const upgrade = upgradePool.find(u => u.id === upgradeId);
    if (upgrade) {
        // 소지금 환불
        gameState.gold += upgrade.price;
        
        // purchasedUpgrades에서 제거
        const index = purchasedUpgrades.findIndex(u => u.id === upgradeId);
        if (index !== -1) {
            purchasedUpgrades.splice(index, 1);
        }
        
        // UI 업데이트
        
        updateShopAffordability();
    }
    
    // 선택 화면 닫기
    const overlay = document.getElementById('enhancement-selection-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    // 전역 데이터 정리
    window.selectedEnhancementData = null;
    window.selectedRemovalData = null;
    window.selectedDuplicationData = null;
}

// 카드 제거 선택 화면 표시
function showCardRemovalSelection(upgrade, shopCardElement) {
    // 덱의 모든 카드 가져오기
    const availableCards = HWATU_CARDS.filter(card => {
        // 이미 제거된 카드는 제외
        return !gameState.removedCards || !gameState.removedCards.includes(card.id);
    });
    
    if (availableCards.length === 0) {
        alert('제거할 카드가 없습니다!');
        // 소지금 환불
        gameState.gold += upgrade.price;
        updateShopAffordability();
        return;
    }
    
    // 최대 5장 선택
    const cardsToShow = [];
    const numCards = Math.min(5, availableCards.length);
    const selectedIndices = new Set();
    
    while (cardsToShow.length < numCards) {
        const index = Math.floor(Math.random() * availableCards.length);
        if (!selectedIndices.has(index)) {
            selectedIndices.add(index);
            cardsToShow.push(availableCards[index]);
        }
    }
    
    // 선택된 카드 추적
    let selectedCardId = null;
    
    // 선택 화면 생성
    const selectionOverlay = document.createElement('div');
    selectionOverlay.id = 'enhancement-selection-overlay';
    selectionOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
    `;
    
    selectionOverlay.innerHTML = `
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); 
                    border-radius: 20px; 
                    padding: 30px; 
                    max-width: 800px;">
            <h2 style="color: #ffd700; text-align: center; margin-bottom: 20px; font-size: 28px;">
                제거할 카드를 선택하세요
            </h2>
            <div style="color: white; text-align: center; margin-bottom: 20px;">
                ${upgrade.name} - 선택한 카드를 덱에서 완전히 제거합니다
            </div>
            <div id="enhancement-card-choices" style="
                display: flex;
                gap: 20px;
                justify-content: center;
                flex-wrap: wrap;
                margin-bottom: 20px;
            "></div>
            <div style="text-align: center; display: flex; gap: 10px; justify-content: center;">
                <button id="apply-removal-btn" onclick="applySelectedRemoval('${upgrade.id}')" style="
                    padding: 10px 30px;
                    background: linear-gradient(135deg, #666 0%, #444 100%);
                    color: #999;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: not-allowed;
                    display: none;
                " disabled>적용</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(selectionOverlay);
    
    // 카드 표시
    const choicesContainer = document.getElementById('enhancement-card-choices');
    cardsToShow.forEach(card => {
        const cardDiv = createCardElement(card);
        cardDiv.style.cursor = 'pointer';
        cardDiv.style.transition = 'all 0.3s ease';
        cardDiv.onclick = () => {
            // 이전 선택 해제
            const prevSelected = choicesContainer.querySelector('.selected-card');
            if (prevSelected) {
                prevSelected.classList.remove('selected-card');
                prevSelected.style.border = '';
                prevSelected.style.boxShadow = '';
                prevSelected.style.transform = '';
            }
            
            // 현재 카드 선택
            selectedCardId = card.id;
            cardDiv.classList.add('selected-card');
            cardDiv.style.border = '4px solid #ff0000';
            cardDiv.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.8)';
            cardDiv.style.transform = 'scale(1.1)';
            
            // 적용 버튼 활성화
            const applyBtn = document.getElementById('apply-removal-btn');
            if (applyBtn) {
                applyBtn.style.display = 'inline-block';
                applyBtn.disabled = false;
                applyBtn.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
                applyBtn.style.color = 'white';
                applyBtn.style.cursor = 'pointer';
            }
            
            // 선택된 카드 정보를 전역에 저장
            window.selectedRemovalData = {
                cardId: card.id,
                upgrade: upgrade,
                shopCardElement: shopCardElement,
                selectionOverlay: selectionOverlay
            };
        };
        cardDiv.onmouseover = () => {
            if (!cardDiv.classList.contains('selected-card')) {
                cardDiv.style.transform = 'translateY(-10px) scale(1.1)';
                cardDiv.style.boxShadow = '0 10px 30px rgba(255, 0, 0, 0.5)';
            }
        };
        cardDiv.onmouseout = () => {
            if (!cardDiv.classList.contains('selected-card')) {
                cardDiv.style.transform = '';
                cardDiv.style.boxShadow = '';
            }
        };
        choicesContainer.appendChild(cardDiv);
    });
}

// 선택된 카드 제거 적용
function applySelectedRemoval(upgradeId) {
    if (window.selectedRemovalData) {
        const { cardId, upgrade, shopCardElement, selectionOverlay } = window.selectedRemovalData;
        removeCardFromDeck(cardId, upgrade, shopCardElement, selectionOverlay);
        window.selectedRemovalData = null;
    }
}

// 카드를 덱에서 제거
function removeCardFromDeck(cardId, upgrade, shopCardElement, selectionOverlay) {
    // 제거된 카드 목록 초기화
    if (!gameState.removedCards) {
        gameState.removedCards = [];
    }
    
    // 카드 제거
    gameState.removedCards.push(cardId);
    
    // 카드 정보 가져오기
    const card = HWATU_CARDS.find(c => c.id === cardId);
    if (card) {
        showEnhancementEffect(`${card.month}월 ${card.name}을(를) 덱에서 제거했습니다!`, '#ff0000');
    }
    
    // 상점 카드 UI 업데이트
    shopCardElement.classList.add('purchased');
    shopCardElement.onclick = null;
    const priceElement = shopCardElement.querySelector('.upgrade-price');
    if (priceElement) {
        priceElement.textContent = '구매완료';
    }
    
    
    // 선택 화면 닫기
    selectionOverlay.remove();
    
    // 다른 카드들의 구매 가능 여부 재확인
    updateShopAffordability();
}

// 카드 복제 선택 화면 표시
function showCardDuplicationSelection(upgrade, shopCardElement) {
    // 덱의 모든 카드 가져오기 (제거된 카드 제외)
    const availableCards = HWATU_CARDS.filter(card => {
        return !gameState.removedCards || !gameState.removedCards.includes(card.id);
    });
    
    if (availableCards.length === 0) {
        alert('복제할 카드가 없습니다!');
        // 소지금 환불
        gameState.gold += upgrade.price;
        updateShopAffordability();
        return;
    }
    
    // 최대 5장 선택
    const cardsToShow = [];
    const numCards = Math.min(5, availableCards.length);
    const selectedIndices = new Set();
    
    while (cardsToShow.length < numCards) {
        const index = Math.floor(Math.random() * availableCards.length);
        if (!selectedIndices.has(index)) {
            selectedIndices.add(index);
            cardsToShow.push(availableCards[index]);
        }
    }
    
    // 선택된 카드 추적
    let selectedCardId = null;
    
    // 선택 화면 생성
    const selectionOverlay = document.createElement('div');
    selectionOverlay.id = 'enhancement-selection-overlay';
    selectionOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
    `;
    
    selectionOverlay.innerHTML = `
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); 
                    border-radius: 20px; 
                    padding: 30px; 
                    max-width: 800px;">
            <h2 style="color: #ffd700; text-align: center; margin-bottom: 20px; font-size: 28px;">
                복제할 카드를 선택하세요
            </h2>
            <div style="color: white; text-align: center; margin-bottom: 20px;">
                ${upgrade.name} - 선택한 카드를 복제하여 덱에 추가합니다
            </div>
            <div id="enhancement-card-choices" style="
                display: flex;
                gap: 20px;
                justify-content: center;
                flex-wrap: wrap;
                margin-bottom: 20px;
            "></div>
            <div style="text-align: center; display: flex; gap: 10px; justify-content: center;">
                <button id="apply-duplication-btn" onclick="applySelectedDuplication('${upgrade.id}')" style="
                    padding: 10px 30px;
                    background: linear-gradient(135deg, #666 0%, #444 100%);
                    color: #999;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: not-allowed;
                    display: none;
                " disabled>적용</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(selectionOverlay);
    
    // 카드 표시
    const choicesContainer = document.getElementById('enhancement-card-choices');
    cardsToShow.forEach(card => {
        const cardDiv = createCardElement(card);
        cardDiv.style.cursor = 'pointer';
        cardDiv.style.transition = 'all 0.3s ease';
        cardDiv.onclick = () => {
            // 이전 선택 해제
            const prevSelected = choicesContainer.querySelector('.selected-card');
            if (prevSelected) {
                prevSelected.classList.remove('selected-card');
                prevSelected.style.border = '';
                prevSelected.style.boxShadow = '';
                prevSelected.style.transform = '';
            }
            
            // 현재 카드 선택
            selectedCardId = card.id;
            cardDiv.classList.add('selected-card');
            cardDiv.style.border = '4px solid #00d7ff';
            cardDiv.style.boxShadow = '0 0 20px rgba(0, 215, 255, 0.8)';
            cardDiv.style.transform = 'scale(1.1)';
            
            // 적용 버튼 활성화
            const applyBtn = document.getElementById('apply-duplication-btn');
            if (applyBtn) {
                applyBtn.style.display = 'inline-block';
                applyBtn.disabled = false;
                applyBtn.style.background = 'linear-gradient(135deg, #00bfff 0%, #0099cc 100%)';
                applyBtn.style.color = 'white';
                applyBtn.style.cursor = 'pointer';
            }
            
            // 선택된 카드 정보를 전역에 저장
            window.selectedDuplicationData = {
                cardId: card.id,
                upgrade: upgrade,
                shopCardElement: shopCardElement,
                selectionOverlay: selectionOverlay
            };
        };
        cardDiv.onmouseover = () => {
            if (!cardDiv.classList.contains('selected-card')) {
                cardDiv.style.transform = 'translateY(-10px) scale(1.1)';
                cardDiv.style.boxShadow = '0 10px 30px rgba(0, 215, 255, 0.5)';
            }
        };
        cardDiv.onmouseout = () => {
            if (!cardDiv.classList.contains('selected-card')) {
                cardDiv.style.transform = '';
                cardDiv.style.boxShadow = '';
            }
        };
        choicesContainer.appendChild(cardDiv);
    });
}

// 선택된 카드 복제 적용
function applySelectedDuplication(upgradeId) {
    if (window.selectedDuplicationData) {
        const { cardId, upgrade, shopCardElement, selectionOverlay } = window.selectedDuplicationData;
        duplicateCard(cardId, upgrade, shopCardElement, selectionOverlay);
        window.selectedDuplicationData = null;
    }
}

// 카드 복제
function duplicateCard(cardId, upgrade, shopCardElement, selectionOverlay) {
    // 복제된 카드 목록 초기화
    if (!gameState.duplicatedCards) {
        gameState.duplicatedCards = [];
    }
    
    // 카드 복제 기록
    gameState.duplicatedCards.push(cardId);
    
    // 카드 정보 가져오기
    const card = HWATU_CARDS.find(c => c.id === cardId);
    if (card) {
        showEnhancementEffect(`${card.month}월 ${card.name}을(를) 복제했습니다! 덱에 추가됩니다.`, '#00d7ff');
    }
    
    // 상점 카드 UI 업데이트
    shopCardElement.classList.add('purchased');
    shopCardElement.onclick = null;
    const priceElement = shopCardElement.querySelector('.upgrade-price');
    if (priceElement) {
        priceElement.textContent = '구매완료';
    }
    
    
    // 선택 화면 닫기
    selectionOverlay.remove();
    
    // 다른 카드들의 구매 가능 여부 재확인
    updateShopAffordability();
}

// 카드에 강화 적용
function applyEnhancementToCard(cardId, upgrade, shopCardElement, selectionOverlay) {
    // 무작위 강화인 경우
    let enhanceType = upgrade.enhanceType;
    if (enhanceType === 'random') {
        const enhanceTypes = ['청', '적', '백', '흑', '황'];
        enhanceType = enhanceTypes[Math.floor(Math.random() * enhanceTypes.length)];
    }
    
    // 기존 강화 확인
    const previousEnhancement = gameState.cardEnhancements[cardId];
    
    // 강화 적용 (덮어씌우기)
    gameState.cardEnhancements[cardId] = enhanceType;
    
    // 카드 정보 가져오기
    const card = HWATU_CARDS.find(c => c.id === cardId);
    if (card) {
        let message = `${card.month}월 ${card.name}에 ${enhanceType} 강화 적용!`;
        if (previousEnhancement && previousEnhancement !== enhanceType) {
            message = `${card.month}월 ${card.name}의 ${previousEnhancement} 강화를 ${enhanceType} 강화로 교체!`;
        }
        showEnhancementEffect(message, 
            ENHANCEMENT_TYPES[Object.keys(ENHANCEMENT_TYPES).find(key => 
                ENHANCEMENT_TYPES[key].name === enhanceType)].color);
    }
    
    // 상점 카드 UI 업데이트
    shopCardElement.classList.add('purchased');
    shopCardElement.onclick = null;
    const priceElement = shopCardElement.querySelector('.upgrade-price');
    if (priceElement) {
        priceElement.textContent = '구매완료';
    }
    
    
    // 선택 화면 닫기
    selectionOverlay.remove();
    
    // 다른 카드들의 구매 가능 여부 재확인
    updateShopAffordability();
}

// 상점 카드들의 구매 가능 여부 업데이트
function updateShopAffordability() {
    const cards = document.querySelectorAll('.upgrade-card');
    cards.forEach(card => {
        if (card.classList.contains('purchased')) return;
        
        const upgradeId = card.dataset.upgradeId;
        const upgrade = shopUpgrades.find(u => u.id === upgradeId);
        if (!upgrade) return;
        
        // 소지금 관계없이 클릭 가능 (cant-afford 클래스 제거)
        card.onclick = () => showPurchaseTooltip(upgrade, card);
    });
}

// 업그레이드 효과 적용
function applyUpgrade(upgrade) {
    switch(upgrade.id) {
        case 'extra_discard':
            // 추가 버리기는 initGame에서 계산됨
            const extraDiscards = gameState.upgrades.filter(u => u.id === 'extra_discard').length;
            gameState.discardsLeft = 4 + extraDiscards;
            break;
        case 'base_multiplier':
            // 기본 배수는 점수 계산시 적용
            break;
        case 'bonus_pi':
            // 보너스 피는 점수 계산시 적용
            break;
        case 'chodan_blessing':
        case 'cheongdan_blessing':
        case 'hongdan_blessing':
        case 'gwangbak_charm':
        case 'pibak_charm':
            // 이 업그레이드들은 점수 계산시 적용
            break;
    }
    updateDisplay();
}

// 소모품 카드 표시 업데이트
function updateConsumableCards() {
    if (!gameState.consumableCards) {
        gameState.consumableCards = [];
    }
    
    // 소모품 슬롯 1
    const slot1 = document.getElementById('consumable-slot-1');
    if (slot1) {
        if (gameState.consumableCards[0]) {
            const card = gameState.consumableCards[0];
            slot1.innerHTML = `
                <div class="consumable-card-inner" style="
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
                    border: 2px solid #ffd700;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                ">
                    <div style="font-size: 30px; margin-bottom: 5px;">${card.icon}</div>
                    <div style="font-size: 10px; color: #ffd700; text-align: center;">${card.name}</div>
                </div>
            `;
            slot1.onclick = () => selectConsumableCard(0);
            slot1.onmouseenter = (e) => showConsumableTooltip(card, e);
            slot1.onmouseleave = hideConsumableTooltip;
            slot1.style.cursor = 'pointer';
        } else {
            slot1.innerHTML = '';
            slot1.onclick = null;
            slot1.onmouseenter = null;
            slot1.onmouseleave = null;
        }
    }
    
    // 소모품 슬롯 2
    const slot2 = document.getElementById('consumable-slot-2');
    if (slot2) {
        if (gameState.consumableCards[1]) {
            const card = gameState.consumableCards[1];
            slot2.innerHTML = `
                <div class="consumable-card-inner" style="
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
                    border: 2px solid #ffd700;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                ">
                    <div style="font-size: 30px; margin-bottom: 5px;">${card.icon}</div>
                    <div style="font-size: 10px; color: #ffd700; text-align: center;">${card.name}</div>
                </div>
            `;
            slot2.onclick = () => selectConsumableCard(1);
            slot2.onmouseenter = (e) => showConsumableTooltip(card, e);
            slot2.onmouseleave = hideConsumableTooltip;
            slot2.style.cursor = 'pointer';
        } else {
            slot2.innerHTML = '';
            slot2.onclick = null;
            slot2.onmouseenter = null;
            slot2.onmouseleave = null;
        }
    }
}

// 효과 메시지 표시
function showEffectMessage(message, color = '#ffd700') {
    const msg = document.createElement('div');
    msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px 40px;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(20, 20, 20, 0.9) 100%);
        border: 2px solid ${color};
        border-radius: 10px;
        color: ${color};
        font-size: 24px;
        font-weight: bold;
        z-index: 10000;
        pointer-events: none;
        animation: effectMessage 1.5s ease;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
    `;
    
    // 애니메이션 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes effectMessage {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.5);
            }
            20% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.1);
            }
            40% {
                transform: translate(-50%, -50%) scale(1);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -60%) scale(0.9);
            }
        }
    `;
    document.head.appendChild(style);
    
    msg.textContent = message;
    document.body.appendChild(msg);
    
    // 1.5초 후 제거
    setTimeout(() => {
        msg.remove();
        style.remove();
    }, 1500);
}

// 소모품 카드 툴팁 표시
function showConsumableTooltip(card, event) {
    hideConsumableTooltip(); // 기존 툴팁 제거
    
    const tooltip = document.createElement('div');
    tooltip.id = 'consumable-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%);
        border: 2px solid #ffd700;
        border-radius: 8px;
        padding: 10px;
        z-index: 10000;
        pointer-events: none;
        min-width: 150px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        animation: fadeIn 0.2s ease;
    `;
    
    tooltip.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 24px; margin-bottom: 5px;">${card.icon}</div>
            <div style="font-size: 14px; font-weight: bold; color: #ffd700; margin-bottom: 5px;">${card.name}</div>
            <div style="font-size: 12px; color: #aaa;">${card.effect}</div>
        </div>
    `;
    
    document.body.appendChild(tooltip);
    
    // 위치 설정
    const rect = event.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.top - tooltipRect.height - 10;
    
    // 화면 벗어남 방지
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) {
        top = rect.bottom + 10;
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

// 소모품 카드 툴팁 숨기기
function hideConsumableTooltip() {
    const tooltip = document.getElementById('consumable-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// 소모품 카드 선택
function selectConsumableCard(index) {
    if (!gameState.consumableCards[index]) return;
    
    // 스테이지가 종료되었으면 선택 불가
    if (gameState.stageEnded) {
        console.log('Stage has ended, cannot select cards');
        return;
    }
    
    // 모든 카드에서 selected 클래스 제거
    document.querySelectorAll('.card.selected').forEach(card => {
        card.classList.remove('selected');
        card.style.border = '';
        card.style.boxShadow = '';
        card.style.transform = '';
    });
    
    // 소모품 슬롯에서도 selected 클래스 제거
    document.querySelectorAll('.consumable-slot').forEach(slot => {
        const innerDiv = slot.querySelector('div');
        if (innerDiv) {
            innerDiv.style.border = '2px solid #ffd700';
            innerDiv.style.boxShadow = '';
            innerDiv.style.transform = '';
        }
    });
    
    // 소모품 카드 선택 표시
    const slot = document.getElementById(`consumable-slot-${index + 1}`);
    if (slot) {
        const innerDiv = slot.querySelector('div');
        if (innerDiv) {
            innerDiv.style.border = '3px solid #00ff00';
            innerDiv.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
            innerDiv.style.transform = 'scale(1.05)';
        }
    }
    
    // 선택된 소모품 카드 정보 저장
    gameState.selectedCard = null;  // 손패 카드 선택 해제
    gameState.selectedConsumable = index;  // 소모품 카드 인덱스 저장
    
    // 버튼 업데이트
    updateButtonStates();
}

// 소모품 카드 사용
function useConsumableCard(index) {
    if (!gameState.consumableCards[index]) return;
    
    const card = gameState.consumableCards[index];
    const slot = document.getElementById(`consumable-slot-${index + 1}`);
    
    // 애니메이션을 위한 카드 복사본 생성
    if (slot) {
        const slotRect = slot.getBoundingClientRect();
        const floorArea = document.getElementById('floor-area');
        const floorRect = floorArea.getBoundingClientRect();
        
        // 애니메이션용 카드 생성
        const animCard = document.createElement('div');
        animCard.style.cssText = `
            position: fixed;
            left: ${slotRect.left}px;
            top: ${slotRect.top}px;
            width: ${slotRect.width}px;
            height: ${slotRect.height}px;
            z-index: 5000;
            pointer-events: none;
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        animCard.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
                border: 2px solid #ffd700;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
            ">
                <div style="font-size: 30px; margin-bottom: 5px;">${card.icon}</div>
                <div style="font-size: 10px; color: #ffd700; text-align: center;">${card.name}</div>
            </div>
        `;
        
        document.body.appendChild(animCard);
        
        // 효과음 재생
        playSound('se/allow1.mp3');
        
        // 바닥 중앙으로 이동 애니메이션
        setTimeout(() => {
            const targetX = floorRect.left + floorRect.width / 2 - slotRect.width / 2;
            const targetY = floorRect.top + floorRect.height / 2 - slotRect.height / 2;
            
            animCard.style.transform = `translate(${targetX - slotRect.left}px, ${targetY - slotRect.top}px) scale(1.2)`;
            animCard.style.opacity = '0.8';
        }, 50);
        
        // 효과 발동 및 카드 제거
        setTimeout(() => {
            animCard.style.opacity = '0';
            animCard.style.transform += ' scale(1.5)';
            
            // 효과 발동
            if (card.action) {
                card.action();
            }
            
            // 효과 메시지 표시
            showEffectMessage(card.name + ' 사용!', '#4ade80');
            
            // 애니메이션 카드 제거
            setTimeout(() => {
                animCard.remove();
            }, 300);
        }, 650);
    }
    
    // 카드 제거
    gameState.consumableCards.splice(index, 1);
    
    // 선택 해제
    gameState.selectedConsumable = null;
    
    // 화면 업데이트
    updateDisplay();
}

// 소모품 카드 버리기
function discardConsumableCard(index) {
    if (!gameState.consumableCards[index]) return;
    
    const card = gameState.consumableCards[index];
    
    // 카드 제거
    gameState.consumableCards.splice(index, 1);
    
    PopupComponent.showMessage(`${card.name} 카드를 버렸습니다.`, 'info');
    
    // 선택 해제
    gameState.selectedConsumable = null;
    
    // 화면 업데이트
    updateDisplay();
}

// 다음 스테이지 진행
function proceedToNextStage() {
    // 스테이지 번호가 3의 배수면 보스 BGM, 아니면 게임 BGM으로 전환
    if (gameState.stage % 3 === 0) {
        switchBGM('boss');
    } else {
        switchToGameBGM();
    }
    
    // play 컨테이너를 게임 화면으로 복원
    const playContainer = document.getElementById('play-container');
    playContainer.innerHTML = `
        <div id="upgrades-info">
            <div id="upgrades-list">
                <!-- 동적으로 생성됨 -->
            </div>
        </div>
        
        <div style="flex: 1; display: flex; flex-direction: column;">
            <div style="flex: 0.45; display: flex; flex-direction: column;">
                <div class="section-title">바닥 패</div>
                <div id="floor-area" style="flex: 1;"></div>
            </div>
            
            <div class="divider"></div>
            
            <div style="flex: 0.55; display: flex; flex-direction: column;">
                <div class="section-title" style="margin-top: 15px;">내 손패</div>
                <div id="hand-area" style="flex: 1; display: flex; align-items: center;"></div>
                
                <div id="control-area" style="margin-top: 15px;">
                    <button class="btn btn-secondary" id="discard-btn" onclick="discardCards()">버리기(${gameState.discardsLeft || 4})</button>
                    <button class="btn btn-primary" id="play-btn" onclick="playCard()">바닥에 내기</button>
                </div>
            </div>
        </div>
        
        <!-- 소모품 카드 영역 -->
        <div id="consumable-area" style="
            position: absolute;
            bottom: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            padding: 15px;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(20, 20, 20, 0.5) 100%);
            border: 2px solid rgba(255, 215, 0, 0.3);
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(5px);
        ">
            <div id="consumable-slot-1" class="consumable-slot" style="
                width: 80px;
                height: 110px;
                border: 2px dashed rgba(255, 215, 0, 0.3);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
            "></div>
            <div id="consumable-slot-2" class="consumable-slot" style="
                width: 80px;
                height: 110px;
                border: 2px dashed rgba(255, 215, 0, 0.3);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
            "></div>
        </div>
        
        <div id="deck-info">
            <div class="deck-card">
                🎴
                <div class="deck-remaining-label">
                    덱 <span id="deck-remaining">48</span>/<span id="deck-total">48</span>
                </div>
            </div>
        </div>
    `;
    
    // 다음 스테이지 값 설정
    const nextStage = gameState.stage + 1;
    const nextTarget = Math.floor(gameState.targetScore * 1.3);
    
    // 배경색 변경
    if (typeof updateBackgroundColors === 'function') {
        updateBackgroundColors(nextStage);
    }
    
    initStage();
    
    // 스테이지 값 업데이트
    gameState.stage = nextStage;
    gameState.targetScore = nextTarget;
    // updateDisplay는 initGame 내부의 카드 분배 애니메이션에서 호출됨
}

// 게임 시작
window.onload = () => {
    // 오디오 초기화
    console.log('Initializing audio system...');
    initAudio();
    
    // allow 오디오 상태 확인
    console.log('allow1Audio:', allow1Audio);
    console.log('allow2Audio:', allow2Audio);
    
    // BGM 초기화
    const gameBGM = document.getElementById('bgm');
    if (gameBGM) gameBGM.volume = 1;
    
    // 초기 스테이지 값 설정 (initFullGame 전에 설정해야 함)
    gameState.stage = 1;
    gameState.targetScore = 25;
    gameState.discardsLeft = 4;
    gameState.gold = 0;
    gameState.upgrades = [];  // 초기에는 업그레이드 없음
    
    // 게임 시작시 스테이지 1 색상 확실히 설정
    if (typeof updateBackgroundColors === 'function') {
        updateBackgroundColors(1);
    }
    
    // 게임 초기화
    initFullGame();
    
    // 테스트용 강화 제거됨
    
    // 테스트용 키보드 이벤트 (q 키로 소지금 +1)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'q' || e.key === 'Q') {
            gameState.gold++;
            
            // gameStateManager와 동기화
            if (typeof gameStateManager !== 'undefined') {
                gameStateManager.state.gold = gameState.gold;
            }
            
            // 화면 업데이트
            updateDisplay();
            
            // 시각적 피드백
            const goldElement = document.getElementById('gold-amount');
            if (goldElement) {
                goldElement.style.color = '#4ade80';
                setTimeout(() => {
                    goldElement.style.color = '#ffd700';
                }, 300);
            }
            
            console.log('테스트: 소지금 +1 (현재:', gameState.gold + ')');
        }
    });
    
    // 업그레이드 확인 버튼 이벤트
    document.getElementById('confirm-upgrade').onclick = confirmUpgrade;
};

