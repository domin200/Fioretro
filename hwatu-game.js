// 사운드 프리로드 및 재생 시스템
let allow1Audio = null;
let allow2Audio = null;

// 오디오 초기화 함수
function initAudio() {
    // OGG 지원 여부 확인
    const audio = document.createElement('audio');
    const canPlayOgg = audio.canPlayType('audio/ogg; codecs="vorbis"');
    
    // 지원하는 형식으로 오디오 생성
    if (canPlayOgg) {
        allow1Audio = new Audio('se/allow1.ogg');
        allow2Audio = new Audio('se/allow2.ogg');
    } else {
        // OGG를 지원하지 않는 경우 (Safari 등)
        console.log('OGG not supported, trying to use fallback');
        // MP3 파일이 없으므로 오디오 비활성화
        allow1Audio = { play: () => Promise.resolve(), currentTime: 0 };
        allow2Audio = { play: () => Promise.resolve(), currentTime: 0 };
    }
    
    if (allow1Audio instanceof Audio) {
        allow1Audio.volume = 1.0;  // 100% 볼륨
        allow1Audio.preload = 'auto';
    }
    if (allow2Audio instanceof Audio) {
        allow2Audio.volume = 0.5;  // 50% 볼륨
        allow2Audio.preload = 'auto';
    }
}

// 페이지 로드 시 오디오 초기화
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', initAudio);
}

// 사운드 재생 함수
function playSound(soundFile) {
    try {
        // 프리로드된 오디오 사용
        if (soundFile === 'se/allow1.ogg' && allow1Audio) {
            if (allow1Audio instanceof Audio) {
                allow1Audio.currentTime = 0;  // 처음부터 재생
                allow1Audio.play().catch(e => {
                    console.log('allow1 play failed:', e);
                    // 사용자 상호작용 후 재시도
                    document.addEventListener('click', () => {
                        allow1Audio.play().catch(() => {});
                    }, { once: true });
                });
            }
        } else if (soundFile === 'se/allow2.ogg' && allow2Audio) {
            if (allow2Audio instanceof Audio) {
                allow2Audio.currentTime = 0;  // 처음부터 재생
                allow2Audio.play().catch(e => {
                    console.log('allow2 play failed:', e);
                    // 사용자 상호작용 후 재시도
                    document.addEventListener('click', () => {
                        allow2Audio.play().catch(() => {});
                    }, { once: true });
                });
            }
        } else {
            const audio = new Audio(soundFile);
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Sound play failed:', e));
        }
    } catch (error) {
        console.log('Sound system error:', error);
    }
}

// 화투 카드 정의 (48장)
const HWATU_CARDS = [
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
    { month: 9, type: '열끗', name: '국화술잔', points: 10, id: 33 },
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
    reincarnatedCards: 0  // 윤회로 덱으로 돌아간 카드 수
};


// 게임 초기화
function initGame() {
    // 덱 준비 및 섞기
    gameState.deck = [...HWATU_CARDS];
    
    // 비온뒤 맑음 업그레이드 확인 - 12월 카드 제거
    const hasSunnyAfterRain = gameState.upgrades.some(u => u.id === 'sunny_after_rain');
    if (hasSunnyAfterRain) {
        gameState.deck = gameState.deck.filter(card => card.month !== 12);
        // 효과 발동 알림 (약간의 딜레이 후)
        setTimeout(() => triggerUpgradeEffect('sunny_after_rain'), 300);
    }
    
    shuffleDeck();
    
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
    gameState.multiplier = 1;
    gameState.totalScore = 0;
    gameState.turn = 0;
    gameState.selectedCard = null;
    gameState.shownCombinations = new Set();  // 족보 표시 초기화
    gameState.reincarnatedCards = 0;  // 윤회 카운터 초기화
    
    // 버리기 횟수 계산 (기본 4 + 업그레이드)
    const extraDiscards = gameState.upgrades.filter(u => u.id === 'extra_discard').length;
    gameState.discardsLeft = 4 + extraDiscards;
    
    // 초기 카드 분배 (애니메이션)
    const hasMapleHand = gameState.upgrades.some(u => u.id === 'maple_hand');
    const handSize = hasMapleHand ? 4 : 5;
    const hasNoPossession = gameState.upgrades.some(u => u.id === 'no_possession');
    
    // 카드를 미리 뽑아둠
    const cardsToHand = [];
    for (let i = 0; i < handSize; i++) {
        cardsToHand.push(gameState.deck.pop());
    }
    
    const cardToFloor = !hasNoPossession ? gameState.deck.pop() : null;
    
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
    // 모든 카드에서 selected 클래스 제거 및 스타일 초기화
    document.querySelectorAll('.card.selected').forEach(card => {
        card.classList.remove('selected');
        // 인라인 스타일 제거하여 원래 상태로
        card.style.border = '';
        card.style.boxShadow = '';
        card.style.transform = '';
    });
    
    const handArea = document.getElementById('hand-area');
    const cards = handArea.children;
    
    // 새 카드 선택
    gameState.selectedCard = index;
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
    
    // 버튼 상태만 업데이트
    document.getElementById('play-btn').disabled = gameState.selectedCard === null;
    document.getElementById('discard-btn').disabled = gameState.selectedCard === null || gameState.discardsLeft <= 0;
}

// 카드를 바닥에 내기
function playCard() {
    if (gameState.selectedCard === null) return;
    
    // 애니메이션을 위해 선택된 카드 엘리먼트 가져오기
    const handArea = document.getElementById('hand-area');
    const selectedCardElement = handArea.children[gameState.selectedCard];
    const floorArea = document.getElementById('floor-area');
    
    // 카드 정보 저장
    const playedCard = gameState.hand[gameState.selectedCard];
    
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
        
        // 1초 후에 손패 보충
        setTimeout(() => {
            if (gameState.deck.length > 0 && gameState.hand.length < 5) {
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
    
    // 카드 컨테이너 생성 (3D 회전을 위해)
    const cardContainer = document.createElement('div');
    cardContainer.style.cssText = `
        position: fixed;
        left: ${deckRect.left + (deckRect.width - 100) / 2}px;
        top: ${deckRect.top}px;
        width: 100px;
        height: 150px;
        z-index: 1000;
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        transform-style: preserve-3d;
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
    
    // 바닥으로 이동하면서 뒤집기
    setTimeout(() => {
        cardContainer.style.left = floorRect.left + floorRect.width / 2 - 50 + 'px';
        cardContainer.style.top = floorRect.top + floorRect.height / 2 - 75 + 'px';
        cardContainer.style.transform = 'rotateY(180deg)';
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
    if (gameState.selectedCard === null) return;
    if (gameState.discardsLeft <= 0) {
        alert('더 이상 버리기를 사용할 수 없습니다!');
        return;
    }
    
    // 호랑이굴 효과 - 첫 턴에는 버리기 불가
    const hasTigerCave = gameState.upgrades.some(u => u.id === 'tiger_cave');
    if (hasTigerCave && gameState.turn === 0) {
        alert('호랑이굴 효과로 첫 턴에는 버리기를 사용할 수 없습니다!');
        return;
    }
    
    // 일타삼피 효과 확인
    const hasTripleDiscard = gameState.upgrades.some(u => u.id === 'triple_discard');
    
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
    
    // 덱에서 새 카드들 드로우 (버린 카드 수만큼)
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
    
    // 카드 컨테이너 생성 (3D 회전을 위해)
    const cardContainer = document.createElement('div');
    cardContainer.style.cssText = `
        position: fixed;
        left: ${deckRect.left + (deckRect.width - 100) / 2}px;
        top: ${deckRect.top}px;
        width: 100px;
        height: 150px;
        z-index: 1000;
        transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        transform-style: preserve-3d;
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
    
    // 손패로 이동하면서 뒤집기
    setTimeout(() => {
        cardContainer.style.left = handRect.left + handRect.width / 2 - 50 + 'px';
        cardContainer.style.top = handRect.top + handRect.height / 2 - 75 + 'px';
        cardContainer.style.transform = 'rotateY(180deg)';
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
    
    // 카드 컨테이너 생성 (3D 회전 효과)
    const cardContainer = document.createElement('div');
    cardContainer.style.cssText = `
        position: fixed;
        left: ${deckRect.left + (deckRect.width - 100) / 2}px;
        top: ${deckRect.top}px;
        width: 100px;
        height: 150px;
        z-index: 2000;
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        transform-style: preserve-3d;
        transform: rotateY(0deg);
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
    
    // 목적지로 이동하면서 뒤집기
    setTimeout(() => {
        // 목적지 계산 (손패는 가운데, 바닥패도 가운데)
        const targetX = targetRect.left + targetRect.width / 2 - 50;
        const targetY = targetRect.top + targetRect.height / 2 - 75;
        
        cardContainer.style.left = `${targetX}px`;
        cardContainer.style.top = `${targetY}px`;
        cardContainer.style.transform = 'rotateY(180deg)';
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
    
    allCards.forEach(card => {
        if (card.type === '광') {
            cardsByType['광'].push(card);
        } else if (card.type === '열끗') {
            cardsByType['열끗'].push(card);
        } else if (card.type === '홍단' || card.type === '청단' || card.type === '초단') {
            cardsByType['단'].push(card);
        } else {
            cardsByType['피'].push(card);
            if (card.type === '쌍피') {
                cardsByType['피'].push(card); // 쌍피는 2장으로 계산
            }
        }
    });
    
    // 피 점수 (1장당 1점, 쌍피는 2점) - 기본 점수는 피만
    const piCount = cardsByType['피'].length;
    points += piCount;  // 피 1장당 1점 (쌍피는 이미 2장으로 계산됨)
    
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
    
    // 윤회 효과 (덱으로 돌아간 카드당 +5점)
    const hasReincarnation = gameState.upgrades.some(u => u.id === 'reincarnation');
    if (hasReincarnation && gameState.reincarnatedCards > 0) {
        points += gameState.reincarnatedCards * 5;
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
            multiplier *= 2;  // 비광삼광(2점)
            if (!gameState.shownCombinations.has('비광')) {
                achievedCombinations.push('비광!');
                gameState.shownCombinations.add('비광');
            }
        } else {
            multiplier *= 3;  // 삼광(3점)
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
    
    // 최종 점수 = 점수 × 배수
    gameState.score = points;
    gameState.multiplier = multiplier;
    gameState.totalScore = points * multiplier;
    
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
        endRound();
    }
}

// 라운드 종료
function endRound() {
    if (gameState.totalScore >= gameState.targetScore) {
        // 미션 성공
        showMissionResult(true, gameState.totalScore);
        setTimeout(() => {
            // 업그레이드 선택 팝업 표시
            showUpgradeSelection();
        }, 2500);
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
                
                initGame();
                
                // initGame 후에 스테이지 값 설정
                gameState.stage = 1;
                gameState.targetScore = 25;  // 초기값 25
                gameState.discardsLeft = 4;  // 버리기 횟수 초기화
                updateDisplay();
            }, 2500);
        }
    }
}

// 미션 결과 표시
function showMissionResult(success, score, usingTwoHearts = false) {
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
    
    // 버리기 카운트 업데이트
    document.getElementById('discards-left').textContent = gameState.discardsLeft;
    
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
    
    // 버튼 상태
    document.getElementById('play-btn').disabled = gameState.selectedCard === null;
    document.getElementById('discard-btn').disabled = gameState.selectedCard === null || gameState.discardsLeft <= 0;
}

// 카드 엘리먼트 생성
function createCardElement(card) {
    const div = document.createElement('div');
    div.className = 'card';
    div.dataset.cardId = card.id;  // 카드 ID 저장
    
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
                ${card.month}월 ${card.name}
            </div>
        `;
    } else {
        // 이미지가 없는 경우 텍스트로 표시
        div.innerHTML = `
            <div class="card-month">${card.month}월</div>
            <div class="card-type">${card.type}</div>
            <div class="card-name">${card.name}</div>
        `;
    }
    
    // 호버 이벤트 추가
    div.addEventListener('mouseenter', () => highlightCard(card.id, true));
    div.addEventListener('mouseleave', () => highlightCard(card.id, false));
    
    return div;
}

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
    { id: 'mind_reading', name: '관심법', icon: '👁️', description: '매 스테이지 시작 시 덱 맨 위의 카드를 알고 시작한다', rarity: 'rare' },
    { id: 'seven_pi', name: '칠지도', icon: '7️⃣', description: '피 카드가 정확히 7장이면 추가로 +10점', rarity: 'rare' },
    { id: 'stupid_fish', name: '멍텅구리', icon: '🐟', description: '열끗 카드도 장당 1점을 얻는다', rarity: 'common' },
    { id: 'sunny_after_rain', name: '비온뒤 맑음', icon: '🌤️', description: '덱에서 12월 패 4장이 제거됨', rarity: 'epic' },
    { id: 'tiger_cave', name: '호랑이굴', icon: '🐯', description: '매 라운드 첫턴은 버리기 불가, 기본 점수 +5', rarity: 'rare' },
    { id: 'triple_discard', name: '일타삼피', icon: '3️⃣', description: '버리기시 양옆 카드도 같이 버려짐', rarity: 'epic' },
    { id: 'thousand_mile', name: '천리길', icon: '🛤️', description: '스테이지 번호 × 1 만큼 기본 점수 추가', rarity: 'rare' },
    { id: 'reincarnation', name: '윤회', icon: '♻️', description: '버린 카드가 덱으로 돌아가고, 버리기당 +5점', rarity: 'epic' },
    { id: 'two_hearts', name: '두개의 심장', icon: '💕', description: '한 번 패배해도 게임이 끝나지 않음 (1회용)', rarity: 'legendary' },
];

let selectedUpgrade = null;

// 업그레이드 선택 팝업 표시
function showUpgradeSelection() {
    const popup = document.getElementById('upgrade-popup');
    const choicesContainer = document.getElementById('upgrade-choices');
    const confirmBtn = document.getElementById('confirm-upgrade');
    
    // 이전 선택 초기화
    selectedUpgrade = null;
    confirmBtn.disabled = true;
    choicesContainer.innerHTML = '';
    
    // 랜덤으로 3개 업그레이드 선택
    const availableUpgrades = [...upgradePool];
    const choices = [];
    for (let i = 0; i < 3 && availableUpgrades.length > 0; i++) {
        const index = Math.floor(Math.random() * availableUpgrades.length);
        choices.push(availableUpgrades[index]);
        availableUpgrades.splice(index, 1);
    }
    
    // 업그레이드 카드 생성
    choices.forEach((upgrade, index) => {
        const card = document.createElement('div');
        card.className = 'upgrade-card';
        card.innerHTML = `
            <div class="upgrade-rarity rarity-${upgrade.rarity}">${upgrade.rarity.toUpperCase()}</div>
            <div class="upgrade-icon">${upgrade.icon}</div>
            <div class="upgrade-name">${upgrade.name}</div>
            <div class="upgrade-description">${upgrade.description}</div>
        `;
        
        card.onclick = () => selectUpgrade(card, upgrade, confirmBtn);
        choicesContainer.appendChild(card);
    });
    
    // 팝업 표시
    popup.style.display = 'flex';
}

// 업그레이드 선택
function selectUpgrade(card, upgrade, confirmBtn) {
    // 이전 선택 제거
    document.querySelectorAll('.upgrade-card').forEach(c => c.classList.remove('selected'));
    
    // 새로운 선택 적용
    card.classList.add('selected');
    selectedUpgrade = upgrade;
    confirmBtn.disabled = false;
}

// 업그레이드 확인
function confirmUpgrade() {
    if (!selectedUpgrade) return;
    
    // 업그레이드 적용
    gameState.upgrades.push(selectedUpgrade);
    applyUpgrade(selectedUpgrade);
    
    // 팝업 닫기
    const popup = document.getElementById('upgrade-popup');
    popup.style.display = 'none';
    
    // 다음 스테이지 진행
    proceedToNextStage();
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

// 다음 스테이지 진행
function proceedToNextStage() {
    // 다음 스테이지 값 설정
    const nextStage = gameState.stage + 1;
    const nextTarget = Math.floor(gameState.targetScore * 1.3);
    
    // 배경색 변경
    if (typeof updateBackgroundColors === 'function') {
        updateBackgroundColors(nextStage);
    }
    
    initGame();
    
    // 스테이지 값 업데이트
    gameState.stage = nextStage;
    gameState.targetScore = nextTarget;
    updateDisplay();
}

// 게임 시작
window.onload = () => {
    // 오디오 초기화
    initAudio();
    
    // 게임 시작시 스테이지 1 색상 확실히 설정
    if (typeof updateBackgroundColors === 'function') {
        updateBackgroundColors(1);
    }
    initGame();
    
    // 업그레이드 확인 버튼 이벤트
    document.getElementById('confirm-upgrade').onclick = confirmUpgrade;
};