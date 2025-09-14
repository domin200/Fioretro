// ============================================
// 화투 게임 설정 및 상수
// ============================================

// 게임 설정
const GAME_CONFIG = {
    INITIAL_TARGET_SCORE: 25,
    INITIAL_DISCARDS: 4,
    INITIAL_HAND_SIZE: 5,
    INITIAL_STAGE: 1,
    MAX_FLOOR_CARDS: 5,
    GOLD_PATTERN: [3, 4, 5],
    INTEREST_RATE: 0.2, // 5금당 1금 이자
    ANIMATION_DURATION: {
        CARD_DEAL: 300,
        CARD_MOVE: 500,
        FADE_TRANSITION: 1000,
        POPUP_DISPLAY: 2500,
        EFFECT_DISPLAY: 2000
    }
};

// 카드 강화 타입
const ENHANCEMENT_TYPES = {
    BLUE: { 
        name: '청', 
        color: '#00bfff', 
        rgb: '0, 191, 255', 
        effect: '점수 +1' 
    },
    RED: { 
        name: '적', 
        color: '#ff4444', 
        rgb: '255, 68, 68', 
        effect: '버려질 때 배수 +0.5' 
    },
    WHITE: { 
        name: '백', 
        color: '#ffffff', 
        rgb: '255, 255, 255', 
        effect: '바닥에 있을 때 점수 +2' 
    },
    BLACK: { 
        name: '흑', 
        color: '#8b00ff', 
        rgb: '139, 0, 255', 
        effect: '핸드에 있을 때 점수 +2' 
    },
    GOLD: { 
        name: '황', 
        color: '#ffd700', 
        rgb: '255, 215, 0', 
        effect: '스테이지 종료 시 소지금 +1' 
    }
};

// 사운드 파일 경로
const SOUND_PATHS = {
    CARD_FLIP: ['card_flip1.mp3', 'card_flip2.mp3', 'card_flip3.mp3'],
    CARD_DEAL: ['card_deal1.mp3', 'card_deal2.mp3', 'card_deal3.mp3'],
    CARD_CAPTURE: 'capture.mp3',
    COMBO: 'combo.mp3',
    UPGRADE: 'upgrade.mp3',
    BGM: {
        GAME: 'Card Chaos.mp3',
        SHOP: 'Card Shark Serenade.mp3'
    }
};

// 족보 점수
const COMBINATION_SCORES = {
    '오광': 15,
    '사광': 10,
    '삼광': 5,
    '비광': 5,
    '고도리': 5,
    '홍단': 3,
    '청단': 3,
    '초단': 3,
    '총통': 10,
    '알통': 5,
    '광박': 10,
    '피박': 10,
    '멍박': 10,
    '38광땡': 10,
    '13광땡': 10,
    '18광땡': 10
};

// 등급별 색상
const RARITY_COLORS = {
    common: '#ffffff',
    rare: '#4fc3f7',
    epic: '#ab47bc',
    legendary: '#ffd700'
};