// 간단한 사운드 시스템 (HTML5 Audio 사용)

class SimpleSoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 1.0;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        // 실제 존재하는 사운드 파일만 로드
        this.sounds.cardDraw = this.createAudio('se/allow1.mp3', 0.8);
        this.sounds.cardPlay = this.createAudio('se/allow2.mp3', 0.6);
        this.sounds.victory = this.createAudio('se/397_win.mp3', 0.6);
        this.sounds.defeat = this.createAudio('se/405_lose.mp3', 0.5);
        this.sounds.goldBig = this.createAudio('se/gold_big.mp3', 0.7);
        this.sounds.goldSmall = this.createAudio('se/gold_small.mp3', 0.5);

        this.initialized = true;
        console.log('Simple sound system initialized');
    }

    createAudio(src, volume) {
        try {
            const audio = new Audio(src);
            audio.volume = volume * this.volume;
            audio.preload = 'none'; // 프리로드 하지 않음
            return audio;
        } catch (e) {
            // 오디오 생성 실패시 더미 객체 반환
            return {
                play: () => Promise.resolve(),
                pause: () => {},
                load: () => {},
                currentTime: 0,
                volume: 0
            };
        }
    }

    play(soundName, options = {}) {
        if (!this.enabled) return;

        const sound = this.sounds[soundName];
        if (!sound) return;

        try {
            // 사운드 복제 (동시 재생 가능하도록)
            const audio = sound.cloneNode ? sound.cloneNode() : sound;

            // 옵션 적용
            if (options.volume !== undefined) {
                audio.volume = Math.min(1, options.volume * this.volume);
            }
            if (options.rate !== undefined && audio.playbackRate !== undefined) {
                audio.playbackRate = options.rate;
            }

            // 재생
            const playPromise = audio.play();
            if (playPromise && playPromise.catch) {
                playPromise.catch(() => {
                    // 재생 실패 무시
                });
            }
        } catch (e) {
            // 에러 무시
        }
    }

    playCardDraw() {
        this.play('cardDraw', { rate: 0.9 + Math.random() * 0.2 });
    }

    playCardPlay() {
        this.play('cardPlay', { rate: 0.95 + Math.random() * 0.1 });
    }

    playCombo(level = 1) {
        this.play('goldSmall', {
            rate: 1.0 + (level - 1) * 0.1,
            volume: Math.min(1.0, 0.5 + level * 0.1)
        });
    }

    playRareCard() {
        this.play('goldBig', { volume: 0.8 });
    }

    playVictory() {
        this.play('victory');
    }

    playDefeat() {
        this.play('defeat');
    }

    playButtonClick() {
        this.play('cardPlay', { volume: 0.3, rate: 1.2 });
    }

    playButtonHover() {
        this.play('cardDraw', { volume: 0.2, rate: 1.6 });
    }

    playNotification() {
        this.play('goldSmall', { volume: 0.4 });
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        for (const sound of Object.values(this.sounds)) {
            if (sound && sound.volume !== undefined) {
                sound.volume = this.volume;
            }
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    stopAll() {
        for (const sound of Object.values(this.sounds)) {
            try {
                if (sound && sound.pause) {
                    sound.pause();
                    sound.currentTime = 0;
                }
            } catch (e) {
                // 에러 무시
            }
        }
    }
}

// 전역 인스턴스 생성
window.soundManager = new SimpleSoundManager();

// DOM 로드 후 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.soundManager.init();

        // 기존 playSound 함수 오버라이드
        if (typeof window.playSound !== 'undefined') {
            const originalPlaySound = window.playSound;
            window.playSound = function(soundFile) {
                // 기존 사운드 파일명을 새 시스템에 매핑
                if (soundFile && soundFile.includes('allow1')) {
                    window.soundManager.playCardDraw();
                } else if (soundFile && soundFile.includes('allow2')) {
                    window.soundManager.playCardPlay();
                } else {
                    // 폴백: 기존 함수 사용
                    try {
                        originalPlaySound(soundFile);
                    } catch (e) {
                        // 에러 무시
                    }
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
            window.soundManager.play('cardDraw', { volume: 0.4, rate: 1.3 });
        }
    });
});