// Howler.js를 사용한 향상된 사운드 시스템

class SoundManager {
    constructor() {
        this.sounds = {};
        this.initialized = false;
        this.enabled = true;
        this.volume = 1.0;
    }

    // 사운드 초기화
    init() {
        if (this.initialized || typeof Howl === 'undefined') return;

        // 사운드 효과 정의 (실제 존재하는 파일만 사용)
        const soundDefinitions = {
            // 카드 관련
            cardDraw: {
                src: ['se/allow1.ogg', 'se/allow1.mp3'],
                volume: 0.8,
                rate: 1.0
            },
            cardPlay: {
                src: ['se/allow2.ogg', 'se/allow2.mp3'],
                volume: 0.6,
                rate: 1.0
            },
            cardFlip: {
                src: ['se/allow2.ogg', 'se/allow2.mp3'],  // allow2를 플립 사운드로 사용
                volume: 0.4,
                rate: 1.5
            },
            cardSelect: {
                src: ['se/allow1.ogg', 'se/allow1.mp3'],  // allow1을 선택 사운드로 사용
                volume: 0.3,
                rate: 1.3
            },

            // 게임 이벤트
            combo: {
                src: ['se/gold_small.mp3'],  // 작은 금화 사운드를 콤보로 사용
                volume: 0.7,
                rate: 1.2
            },
            victory: {
                src: ['se/397_win.mp3'],  // 승리 사운드
                volume: 0.6,
                rate: 1.0
            },
            defeat: {
                src: ['se/405_lose.mp3'],  // 패배 사운드
                volume: 0.5,
                rate: 1.0
            },
            levelUp: {
                src: ['se/gold_big.mp3'],  // 큰 금화 사운드를 레벨업으로 사용
                volume: 0.8,
                rate: 1.0
            },

            // 특수 효과
            rare: {
                src: ['se/gold_big.mp3'],  // 큰 금화 사운드를 희귀 카드로 사용
                volume: 0.7,
                rate: 1.1
            },
            critical: {
                src: ['se/gold_big.mp3'],  // 큰 금화 사운드를 크리티컬로 사용
                volume: 0.9,
                rate: 0.9
            },
            powerUp: {
                src: ['se/gold_small.mp3'],  // 작은 금화 사운드를 파워업으로 사용
                volume: 0.6,
                rate: 1.4
            },

            // UI 사운드
            buttonClick: {
                src: ['se/allow2.ogg', 'se/allow2.mp3'],  // allow2를 버튼 클릭으로 사용
                volume: 0.3,
                rate: 1.2
            },
            buttonHover: {
                src: ['se/allow1.ogg', 'se/allow1.mp3'],  // allow1을 버튼 호버로 사용
                volume: 0.2,
                rate: 1.6
            },
            notification: {
                src: ['se/gold_small.mp3'],  // 작은 금화 사운드를 알림으로 사용
                volume: 0.5,
                rate: 1.3
            }
        };

        // Howl 인스턴스 생성
        for (const [key, def] of Object.entries(soundDefinitions)) {
            // 파일이 실제로 존재하는지 확인하고 폴백 처리
            this.sounds[key] = new Howl({
                src: def.src,
                volume: def.volume * this.volume,
                rate: def.rate,
                preload: true,
                onloaderror: () => {
                    console.warn(`Failed to load sound: ${key}`);
                    // 폴백: 기본 사운드 사용
                    if (key !== 'cardDraw' && key !== 'cardPlay') {
                        this.sounds[key] = this.sounds.cardDraw || this.createSilentSound();
                    }
                }
            });
        }

        // 기존 사운드 파일에 대한 폴백 (allow1, allow2)
        if (!this.sounds.cardDraw._src || this.sounds.cardDraw._src.length === 0) {
            this.sounds.cardDraw = new Howl({
                src: ['SE/allow1.ogg', 'SE/allow1.mp3'],
                volume: 0.8 * this.volume,
                preload: true
            });
        }

        if (!this.sounds.cardPlay._src || this.sounds.cardPlay._src.length === 0) {
            this.sounds.cardPlay = new Howl({
                src: ['SE/allow2.ogg', 'SE/allow2.mp3'],
                volume: 0.6 * this.volume,
                preload: true
            });
        }

        this.initialized = true;
    }

    // 무음 사운드 생성 (폴백용)
    createSilentSound() {
        return {
            play: () => {},
            stop: () => {},
            volume: () => {},
            rate: () => {}
        };
    }

    // 사운드 재생
    play(soundName, options = {}) {
        if (!this.enabled || !this.sounds[soundName]) return;

        const sound = this.sounds[soundName];

        // 옵션 적용
        if (options.volume !== undefined) {
            sound.volume(options.volume * this.volume);
        }
        if (options.rate !== undefined) {
            sound.rate(options.rate);
        }
        if (options.loop !== undefined) {
            sound.loop(options.loop);
        }

        // 재생
        const id = sound.play();

        // 페이드 효과
        if (options.fadeIn) {
            sound.fade(0, options.volume || sound.volume(), options.fadeIn, id);
        }

        return id;
    }

    // 사운드 정지
    stop(soundName, id) {
        if (!this.sounds[soundName]) return;
        this.sounds[soundName].stop(id);
    }

    // 모든 사운드 정지
    stopAll() {
        for (const sound of Object.values(this.sounds)) {
            if (sound && sound.stop) {
                sound.stop();
            }
        }
    }

    // 볼륨 설정
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        for (const sound of Object.values(this.sounds)) {
            if (sound && sound.volume) {
                sound.volume(this.volume);
            }
        }
    }

    // 사운드 활성화/비활성화
    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopAll();
        }
        return this.enabled;
    }

    // 카드 드로우 사운드 (피치 변화)
    playCardDraw() {
        const pitch = 0.9 + Math.random() * 0.2; // 0.9 ~ 1.1 사이 랜덤 피치
        this.play('cardDraw', { rate: pitch });
    }

    // 카드 플레이 사운드 (피치 변화)
    playCardPlay() {
        const pitch = 0.95 + Math.random() * 0.1; // 0.95 ~ 1.05 사이 랜덤 피치
        this.play('cardPlay', { rate: pitch });
    }

    // 콤보 사운드 (연속 재생)
    playCombo(comboLevel = 1) {
        const pitch = 1.0 + (comboLevel - 1) * 0.1; // 콤보 레벨에 따라 피치 상승
        const volume = Math.min(1.0, 0.7 + comboLevel * 0.1); // 콤보 레벨에 따라 볼륨 상승
        this.play('combo', { rate: pitch, volume: volume });
    }

    // 희귀 카드 사운드
    playRareCard() {
        this.play('rare', { volume: 0.9 });
        // 추가 반짝임 효과음
        setTimeout(() => {
            this.play('powerUp', { volume: 0.5, rate: 1.5 });
        }, 200);
    }

    // 버튼 호버 사운드
    playButtonHover() {
        this.play('buttonHover', { volume: 0.3 });
    }

    // 버튼 클릭 사운드
    playButtonClick() {
        this.play('buttonClick', { volume: 0.5 });
    }

    // 알림 사운드
    playNotification() {
        this.play('notification', { volume: 0.6 });
    }

    // 승리 사운드
    playVictory() {
        this.play('victory', { volume: 0.8, fadeIn: 500 });
    }

    // 패배 사운드
    playDefeat() {
        this.play('defeat', { volume: 0.6 });
    }
}

// 전역 인스턴스 생성
window.soundManager = new SoundManager();

// 초기화 및 기존 playSound 함수 오버라이드
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.soundManager.init();

        // 기존 playSound 함수를 새로운 시스템으로 대체
        if (typeof window.playSound !== 'undefined') {
            const originalPlaySound = window.playSound;
            window.playSound = function(soundFile) {
                // 기존 사운드 파일명을 새 시스템에 매핑
                if (soundFile.includes('allow1')) {
                    window.soundManager.playCardDraw();
                } else if (soundFile.includes('allow2')) {
                    window.soundManager.playCardPlay();
                } else {
                    // 폴백: 기존 함수 사용
                    originalPlaySound(soundFile);
                }
            };
        }
    });
} else {
    window.soundManager.init();
}

// UI 요소에 사운드 효과 자동 추가
document.addEventListener('DOMContentLoaded', () => {
    // 버튼 호버 사운드
    document.querySelectorAll('button, .btn').forEach(button => {
        button.addEventListener('mouseenter', () => {
            window.soundManager.playButtonHover();
        });
        button.addEventListener('click', () => {
            window.soundManager.playButtonClick();
        });
    });

    // 카드 선택 사운드
    document.addEventListener('click', (e) => {
        if (e.target.closest('.card, .card-3d')) {
            window.soundManager.play('cardSelect', { volume: 0.4 });
        }
    });
});