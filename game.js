// 화투 카드 정의 (48장)
const HWATU_CARDS = [
    // 1월 - 송학
    { month: 1, type: '광', name: '송학', value: 20, icon: '🌸', id: 2 },
    { month: 1, type: '홍단', name: '홍단', value: 10, icon: '📜', id: 3 },
    { month: 1, type: '피', name: '피', value: 0, icon: '🍃', id: 4 },
    { month: 1, type: '피', name: '피', value: 0, icon: '🍃', id: 5 },
    
    // 2월 - 매조
    { month: 2, type: '십', name: '매조', value: 10, icon: '🦜', id: 6 },
    { month: 2, type: '홍단', name: '홍단', value: 10, icon: '📜', id: 7 },
    { month: 2, type: '피', name: '피', value: 0, icon: '🍃', id: 8 },
    { month: 2, type: '피', name: '피', value: 0, icon: '🍃', id: 9 },
    
    // 3월 - 벚꽃
    { month: 3, type: '광', name: '벚꽃', value: 20, icon: '🌸', id: 10 },
    { month: 3, type: '홍단', name: '홍단', value: 10, icon: '📜', id: 11 },
    { month: 3, type: '피', name: '피', value: 0, icon: '🍃', id: 12 },
    { month: 3, type: '피', name: '피', value: 0, icon: '🍃', id: 13 },
    
    // 4월 - 흑싸리
    { month: 4, type: '십', name: '흑싸리', value: 10, icon: '🦅', id: 14 },
    { month: 4, type: '초단', name: '초단', value: 10, icon: '📜', id: 15 },
    { month: 4, type: '피', name: '피', value: 0, icon: '🍃', id: 16 },
    { month: 4, type: '피', name: '피', value: 0, icon: '🍃', id: 17 },
    
    // 5월 - 난초
    { month: 5, type: '십', name: '난초', value: 10, icon: '🌿', id: 18 },
    { month: 5, type: '초단', name: '초단', value: 10, icon: '📜', id: 19 },
    { month: 5, type: '피', name: '피', value: 0, icon: '🍃', id: 20 },
    { month: 5, type: '피', name: '피', value: 0, icon: '🍃', id: 21 },
    
    // 나머지는 섯다 이미지 매핑이므로 기본값 사용
    // 6월 - 모란
    { month: 6, type: '십', name: '모란', value: 10, icon: '🦋', id: 6 },
    { month: 6, type: '청단', name: '청단', value: 10, icon: '📜', id: 6 },
    { month: 6, type: '피', name: '피', value: 0, icon: '🍃', id: 6 },
    { month: 6, type: '피', name: '피', value: 0, icon: '🍃', id: 6 },
    
    // 7월 - 홍싸리
    { month: 7, type: '십', name: '홍싸리', value: 10, icon: '🐗', id: 7 },
    { month: 7, type: '초단', name: '초단', value: 10, icon: '📜', id: 7 },
    { month: 7, type: '피', name: '피', value: 0, icon: '🍃', id: 7 },
    { month: 7, type: '피', name: '피', value: 0, icon: '🍃', id: 7 },
    
    // 8월 - 공산
    { month: 8, type: '광', name: '공산', value: 20, icon: '🌙', id: 8 },
    { month: 8, type: '십', name: '기러기', value: 10, icon: '🦆', id: 8 },
    { month: 8, type: '피', name: '피', value: 0, icon: '🍃', id: 8 },
    { month: 8, type: '피', name: '피', value: 0, icon: '🍃', id: 8 },
    
    // 9월 - 국화
    { month: 9, type: '십', name: '국화', value: 10, icon: '🍶', id: 9 },
    { month: 9, type: '청단', name: '청단', value: 10, icon: '📜', id: 9 },
    { month: 9, type: '피', name: '피', value: 0, icon: '🍃', id: 9 },
    { month: 9, type: '피', name: '피', value: 0, icon: '🍃', id: 9 },
    
    // 10월 - 단풍
    { month: 10, type: '십', name: '단풍', value: 10, icon: '🦌', id: 10 },
    { month: 10, type: '청단', name: '청단', value: 10, icon: '📜', id: 10 },
    { month: 10, type: '피', name: '피', value: 0, icon: '🍃', id: 10 },
    { month: 10, type: '피', name: '피', value: 0, icon: '🍃', id: 10 },
    
    // 11월 - 오동
    { month: 11, type: '광', name: '오동', value: 20, icon: '🦅', id: 11 },
    { month: 11, type: '쌍피', name: '쌍피', value: 0, icon: '🍂', id: 11 },
    { month: 11, type: '피', name: '피', value: 0, icon: '🍃', id: 11 },
    { month: 11, type: '피', name: '피', value: 0, icon: '🍃', id: 11 },
    
    // 12월 - 비
    { month: 12, type: '광', name: '비', value: 20, icon: '☔', id: 12 },
    { month: 12, type: '십', name: '국진', value: 10, icon: '🐦', id: 12 },
    { month: 12, type: '쌍피', name: '쌍피', value: 0, icon: '🍂', id: 12 },
    { month: 12, type: '피', name: '피', value: 0, icon: '🍃', id: 12 }
];

// 게임 상태
let gameState = {
    deck: [],
    hand: [],
    discardPile: [],  // 버린 카드 추적
    selectedCards: [],
    score: 0,
    multiplier: 1,
    chips: 3,
    stage: 1,
    targetScore: 50,
    roundsPlayed: 0,
    handsPlayed: 0,  // 플레이한 핸드 수
    maxHands: 4,  // 라운드당 최대 핸드 수
    collectedPi: 0  // 모은 피 총 개수
};

// 족보 정의 - 실제 화투 점수 체계
const COMBINATIONS = {
    // 광 조합 (실제 화투 점수)
    '오광': { check: (cards) => {
        const gwangs = cards.filter(c => c.type === '광');
        return gwangs.length === 5;
    }, score: 15 },
    
    '사광': { check: (cards) => {
        const gwangs = cards.filter(c => c.type === '광');
        return gwangs.length === 4;
    }, score: 4 },
    
    '비광삼광': { check: (cards) => {
        const gwangs = cards.filter(c => c.type === '광');
        const hasRain = gwangs.some(c => c.month === 12);
        return gwangs.length === 3 && hasRain;
    }, score: 2 },
    
    '삼광': { check: (cards) => {
        const gwangs = cards.filter(c => c.type === '광');
        const hasRain = gwangs.some(c => c.month === 12);
        return gwangs.length === 3 && !hasRain;
    }, score: 3 },
    
    // 단 조합 (각 3점)
    '홍단': { check: (cards) => {
        const hongdan = cards.filter(c => c.type === '홍단');
        return hongdan.length === 3;
    }, score: 3 },
    
    '청단': { check: (cards) => {
        const cheongdan = cards.filter(c => c.type === '청단');
        return cheongdan.length === 3;
    }, score: 3 },
    
    '초단': { check: (cards) => {
        const chodan = cards.filter(c => c.type === '초단');
        return chodan.length === 3;
    }, score: 3 },
    
    // 고도리 (5점)
    '고도리': { check: (cards) => {
        const godori = cards.filter(c => 
            (c.month === 2 && c.type === '십') || 
            (c.month === 4 && c.type === '십') || 
            (c.month === 8 && c.type === '십')
        );
        return godori.length === 3;
    }, score: 5 },
    
    // 열끗 (십) - 5장부터 1점, 추가 1장당 1점
    '열끗': { check: (cards) => {
        const sips = cards.filter(c => c.type === '십');
        if (sips.length >= 5) {
            return { valid: true, count: sips.length };
        }
        return false;
    }, score: 0, 
    dynamicScore: (result) => result.count - 4 },
    
    // 피는 누적된 총량으로 계산 (라운드 전체에서 모은 피)
    '피': { check: (cards) => {
        // 현재 게임 상태에서 누적된 피 개수 사용
        if (gameState.collectedPi >= 10) {
            return { valid: true, count: gameState.collectedPi };
        }
        return false;
    }, score: 0,
    dynamicScore: (result) => result.count - 9 }
};

// 게임 초기화
function initGame() {
    gameState.deck = [...HWATU_CARDS];
    gameState.discardPile = [];
    gameState.handsPlayed = 0;
    gameState.collectedPi = 0;  // 피 카운트 초기화
    shuffleDeck();
    drawCards(5);
    updateDisplay();
}

// 덱 섞기
function shuffleDeck() {
    for (let i = gameState.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
    }
}

// 카드 뽑기
function drawCards(count) {
    for (let i = 0; i < count; i++) {
        if (gameState.deck.length > 0) {
            gameState.hand.push(gameState.deck.pop());
        }
    }
}

// 화면 업데이트
function updateDisplay() {
    // 점수판 업데이트
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('pi-count').textContent = gameState.collectedPi;
    document.getElementById('chips').textContent = gameState.chips;
    document.getElementById('deck-count').textContent = gameState.deck.length;
    document.getElementById('discard-count').textContent = gameState.discardPile.length;
    document.getElementById('hands-left').textContent = gameState.maxHands - gameState.handsPlayed;
    document.getElementById('target').textContent = gameState.targetScore;
    document.getElementById('stage-info').textContent = `스테이지 ${gameState.stage}`;
    
    // 손패 표시
    const handArea = document.getElementById('hand-area');
    handArea.innerHTML = '';
    
    gameState.hand.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        handArea.appendChild(cardElement);
    });
    
    // 버튼 상태 업데이트
    updateButtonStates();
}

// 카드 엘리먼트 생성
function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.dataset.index = index;
    
    if (gameState.selectedCards.includes(index)) {
        cardDiv.classList.add('selected');
    }
    
    // 이미지가 있으면 이미지 사용, 없으면 기본 아이콘 사용
    if (card.id) {
        cardDiv.style.backgroundImage = `url('card/${card.id}.png')`;
        cardDiv.style.backgroundSize = 'cover';
        cardDiv.style.backgroundPosition = 'center';
        cardDiv.innerHTML = `
            <div style="position: absolute; bottom: 5px; left: 0; right: 0; background: rgba(0,0,0,0.7); padding: 5px; border-radius: 0 0 10px 10px;">
                <div class="card-name" style="color: white; font-size: 11px;">${card.month}월 ${card.name}</div>
            </div>
        `;
    } else {
        cardDiv.innerHTML = `
            <div class="card-month">${card.month}월</div>
            <div class="card-type">${card.icon}</div>
            <div class="card-name">${card.name}</div>
        `;
    }
    
    cardDiv.addEventListener('click', () => selectCard(index));
    
    return cardDiv;
}

// 카드 선택
function selectCard(index) {
    const selectedIndex = gameState.selectedCards.indexOf(index);
    
    if (selectedIndex === -1) {
        if (gameState.selectedCards.length < 5) {
            gameState.selectedCards.push(index);
        }
    } else {
        gameState.selectedCards.splice(selectedIndex, 1);
    }
    
    updateDisplay();
}

// 버튼 상태 업데이트
function updateButtonStates() {
    const playBtn = document.getElementById('play-btn');
    const discardBtn = document.getElementById('discard-btn');
    
    playBtn.disabled = false;  // 항상 플레이 가능
    discardBtn.disabled = gameState.selectedCards.length === 0 || gameState.chips <= 0;
}

// 플레이 실행
function playCards() {
    // 선택된 카드가 없으면 전체 5장 선택
    if (gameState.selectedCards.length === 0) {
        gameState.selectedCards = [0, 1, 2, 3, 4];
    }
    
    const playedCards = gameState.selectedCards.map(i => gameState.hand[i]);
    const result = calculateScore(playedCards);
    
    // 플레이한 카드 중 피 개수 카운트하여 누적
    playedCards.forEach(card => {
        if (card.type === '피') {
            gameState.collectedPi += 1;
        } else if (card.type === '쌍피') {
            gameState.collectedPi += 2;
        }
    });
    
    // 점수 계산 및 적용
    const totalScore = result.baseScore * result.multiplier;
    gameState.score += totalScore;
    
    // 플레이한 카드를 버린 카드 더미에 추가
    gameState.selectedCards.sort((a, b) => b - a);
    gameState.selectedCards.forEach(i => {
        gameState.discardPile.push(gameState.hand[i]);
    });
    
    // 손패 비우기
    gameState.hand = [];
    gameState.selectedCards = [];
    
    // 핸드 수 증가
    gameState.handsPlayed++;
    
    // 결과 표시
    displayResult(result, totalScore);
    
    // 새로운 5장 뽑기
    drawCards(5);
    
    // 라운드 체크
    checkRoundEnd();
    
    updateDisplay();
}

// 점수 계산
function calculateScore(cards) {
    let baseScore = 0;
    let multiplier = 1;
    let combinations = [];
    let detailedScores = [];
    
    // 같은 종류 카드 개수 계산 (배수 계산용)
    const typeCount = {};
    cards.forEach(card => {
        const baseType = card.type.replace('홍단', '단').replace('청단', '단').replace('초단', '단');
        // 쌍피는 피 2개로 계산
        if (baseType === '쌍피') {
            typeCount['피'] = (typeCount['피'] || 0) + 2;
        } else {
            typeCount[baseType] = (typeCount[baseType] || 0) + 1;
        }
    });
    
    // 배수 계산 (같은 종류 3장 이상)
    let typeMultipliers = [];
    for (const [type, count] of Object.entries(typeCount)) {
        if (count >= 3) {
            multiplier *= count;
            typeMultipliers.push(`${type} ${count}장: x${count}`);
        }
    }
    
    // 족보 체크 및 점수 계산
    for (const [name, combo] of Object.entries(COMBINATIONS)) {
        const checkResult = combo.check(cards);
        
        if (checkResult === true || (checkResult && checkResult.valid)) {
            combinations.push(name);
            
            // 동적 점수 계산 (열끗, 피)
            let comboScore = combo.score;
            if (combo.dynamicScore && checkResult.count !== undefined) {
                comboScore = combo.dynamicScore(checkResult);
                detailedScores.push(`${name}(${checkResult.count}장): ${comboScore}점`);
            } else {
                detailedScores.push(`${name}: ${comboScore}점`);
            }
            
            baseScore += comboScore;
        }
    }
    
    // 기본 점수가 0이면 최소 1점
    if (baseScore === 0) {
        baseScore = 1;
    }
    
    return {
        baseScore,
        multiplier,
        combinations,
        detailedScores,
        typeMultipliers
    };
}

// 결과 표시
function displayResult(result, totalScore) {
    const playArea = document.getElementById('play-result');
    
    let html = `<div style="text-align: center;">`;
    html += `<div style="font-size: 36px; color: #ffd700; margin-bottom: 10px;">${Math.floor(totalScore)}점!</div>`;
    
    if (result.detailedScores && result.detailedScores.length > 0) {
        html += `<div class="combo-text" style="font-size: 16px; margin: 10px 0;">`;
        html += result.detailedScores.join('<br>');
        html += `</div>`;
    }
    
    if (result.typeMultipliers && result.typeMultipliers.length > 0) {
        html += `<div style="font-size: 14px; color: #ff6b6b; margin: 10px 0;">`;
        html += '배수: ' + result.typeMultipliers.join(', ');
        html += `</div>`;
    }
    
    html += `<div style="margin-top: 10px; font-size: 14px; opacity: 0.8;">`;
    html += `기본점: ${result.baseScore}점 × 배수: ${result.multiplier} = ${Math.floor(totalScore)}점`;
    html += `</div>`;
    html += `</div>`;
    
    playArea.innerHTML = html;
    
    // 3초 후 결과 지우기
    setTimeout(() => {
        playArea.innerHTML = '';
    }, 3000);
}

// 카드 버리고 뽑기
function discardAndDraw() {
    if (gameState.selectedCards.length === 0 || gameState.chips <= 0) return;
    
    // 칩 소모
    gameState.chips--;
    
    // 선택한 카드를 버린 카드 더미에 추가
    gameState.selectedCards.sort((a, b) => b - a);
    const discardCount = gameState.selectedCards.length;
    
    gameState.selectedCards.forEach(i => {
        gameState.discardPile.push(gameState.hand[i]);
        gameState.hand.splice(i, 1);
    });
    
    // 새 카드 뽑기
    drawCards(discardCount);
    
    // 선택 초기화
    gameState.selectedCards = [];
    
    updateDisplay();
}

// 라운드 종료 체크
function checkRoundEnd() {
    // 덱이 비었거나 최대 핸드 수에 도달하면 라운드 종료
    if (gameState.deck.length < 5 || gameState.handsPlayed >= gameState.maxHands) {
        endRound();
    }
}

// 라운드 종료
function endRound() {
    const modal = document.getElementById('result-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalScore = document.getElementById('modal-score');
    const modalText = document.getElementById('modal-text');
    
    modal.style.display = 'flex';
    
    if (gameState.score >= gameState.targetScore) {
        modalTitle.textContent = '스테이지 클리어!';
        modalScore.textContent = gameState.score;
        modalText.textContent = `목표 점수 ${gameState.targetScore}점 달성!`;
        
        // 다음 스테이지 준비
        gameState.stage++;
        gameState.targetScore = Math.floor(gameState.targetScore * 1.3);
        gameState.chips = 3;
    } else {
        modalTitle.textContent = '게임 오버';
        modalScore.textContent = gameState.score;
        modalText.textContent = `목표 점수 미달성 (${gameState.targetScore}점 필요)`;
        
        // 게임 리셋
        gameState.stage = 1;
        gameState.score = 0;
        gameState.targetScore = 50;
        gameState.chips = 3;
    }
}

// 계속하기
function continueGame() {
    const modal = document.getElementById('result-modal');
    modal.style.display = 'none';
    
    gameState.hand = [];
    gameState.selectedCards = [];
    gameState.discardPile = [];
    gameState.handsPlayed = 0;
    
    initGame();
}

// 이벤트 리스너
document.getElementById('play-btn').addEventListener('click', playCards);
document.getElementById('discard-btn').addEventListener('click', discardAndDraw);
document.getElementById('continue-btn').addEventListener('click', continueGame);

// 게임 시작
initGame();