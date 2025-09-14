// ============================================
// 유틸리티 함수들
// ============================================

// DOM 유틸리티
const DOMUtils = {
    // 엘리먼트 생성 헬퍼
    createElement(tag, attributes = {}, innerHTML = '') {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element[key] = value;
            }
        });
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },

    // 클래스 토글
    toggleClass(element, className, condition) {
        if (condition) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    },

    // 애니메이션 적용
    applyAnimation(element, animationClass, duration = 1000) {
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, duration);
    }
};

// 배열 유틸리티
const ArrayUtils = {
    // 배열 셔플 (Fisher-Yates)
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // 랜덤 선택
    randomSelect(array, count = 1) {
        const shuffled = this.shuffle(array);
        return count === 1 ? shuffled[0] : shuffled.slice(0, count);
    },

    // 중복 제거
    unique(array, keyFn = x => x) {
        const seen = new Set();
        return array.filter(item => {
            const key = keyFn(item);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    },

    // 그룹화
    groupBy(array, keyFn) {
        return array.reduce((groups, item) => {
            const key = keyFn(item);
            (groups[key] = groups[key] || []).push(item);
            return groups;
        }, {});
    }
};

// 애니메이션 유틸리티
const AnimationUtils = {
    // 페이드 효과
    fadeIn(element, duration = 500) {
        element.style.opacity = '0';
        element.style.display = 'block';
        element.style.transition = `opacity ${duration}ms`;
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    },

    fadeOut(element, duration = 500) {
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    },

    // 슬라이드 효과
    slideIn(element, direction = 'left', duration = 500) {
        const translations = {
            left: 'translateX(-100%)',
            right: 'translateX(100%)',
            top: 'translateY(-100%)',
            bottom: 'translateY(100%)'
        };
        
        element.style.transform = translations[direction];
        element.style.transition = `transform ${duration}ms ease`;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.transform = 'translate(0, 0)';
        }, 10);
    }
};

// 숫자 유틸리티
const NumberUtils = {
    // 범위 제한
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    // 선형 보간
    lerp(start, end, progress) {
        return start + (end - start) * progress;
    },

    // 이징 함수
    easeInOut(progress) {
        return progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;
    },

    // 숫자 포맷팅
    formatNumber(number, decimals = 0) {
        return number.toLocaleString('ko-KR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }
};

// 오디오 유틸리티
const AudioUtils = {
    // 볼륨 페이드
    fadeVolume(audioElement, targetVolume, duration = 1000) {
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
    },

    // 랜덤 사운드 재생
    playRandomSound(soundArray) {
        const sound = ArrayUtils.randomSelect(soundArray);
        this.playSound(sound);
    },

    // 사운드 재생
    playSound(soundPath) {
        const audio = new Audio(`se/${soundPath}`);
        audio.play().catch(e => console.log('Sound play failed:', e));
    }
};