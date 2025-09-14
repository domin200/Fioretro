// ============================================
// 주막 상점 관리 모듈
// ============================================

class ShopManager {
    constructor() {
        this.items = this.initializeItems();
    }

    initializeItems() {
        return [
            // 보물 (Treasures)
            {
                id: 'hand_size',
                name: '황금 파우치',
                category: 'treasure',
                description: '핸드 크기 +2',
                price: 15,
                rarity: 'legendary',
                icon: '👛',
                effect: () => {
                    gameStateManager.state.handSize += 2;
                    PopupComponent.showMessage('핸드 크기가 2 증가했습니다!', 'success');
                }
            },
            {
                id: 'target_score',
                name: '은빛 목표',
                category: 'treasure',
                description: '목표 점수 -5',
                price: 12,
                rarity: 'epic',
                icon: '🎯',
                effect: () => {
                    gameStateManager.state.targetScore = Math.max(10, gameStateManager.state.targetScore - 5);
                    PopupComponent.showMessage('목표 점수가 5 감소했습니다!', 'success');
                }
            },
            // 계절 패 (Seasonal Cards - Consumables)
            {
                id: 'spring_pack',
                name: '봄의 패',
                category: 'consumable',
                description: '1~3월 패 중 무작위 한 장을 덱에 추가',
                price: 5,
                rarity: 'rare',
                icon: '🌸',
                effect: function() {
                    this.addSeasonalCard([1, 2, 3], '봄');
                }
            },
            {
                id: 'summer_pack',
                name: '여름의 패',
                category: 'consumable',
                description: '4~6월 패 중 무작위 한 장을 덱에 추가',
                price: 5,
                rarity: 'rare',
                icon: '☀️',
                effect: function() {
                    this.addSeasonalCard([4, 5, 6], '여름');
                }
            },
            {
                id: 'autumn_pack',
                name: '가을의 패',
                category: 'consumable',
                description: '7~9월 패 중 무작위 한 장을 덱에 추가',
                price: 5,
                rarity: 'rare',
                icon: '🍁',
                effect: function() {
                    this.addSeasonalCard([7, 8, 9], '가을');
                }
            },
            {
                id: 'winter_pack',
                name: '겨울의 패',
                category: 'consumable',
                description: '10~12월 패 중 무작위 한 장을 덱에 추가',
                price: 5,
                rarity: 'rare',
                icon: '❄️',
                effect: function() {
                    this.addSeasonalCard([10, 11, 12], '겨울');
                }
            },
            // 소모품 카드 (Consumable Cards)
            {
                id: 'bonus_pi_card',
                name: '보너스피 카드',
                category: 'consumable_card',
                description: '소모품 카드 - 사용 시 현재 점수 +3',
                price: 4,
                rarity: 'common',
                icon: '🎯',
                effect: function() {
                    // 소모품 카드 슬롯 확인
                    if (gameStateManager.state.consumableCards.length >= 2) {
                        PopupComponent.showMessage('소모품 카드는 최대 2장까지만 보유할 수 있습니다!', 'error');
                        // 환불
                        gameStateManager.updateGold(this.price);
                        return false;
                    }
                    
                    // 소모품 카드 추가
                    gameStateManager.state.consumableCards.push({
                        id: 'bonus_pi',
                        name: '보너스피',
                        type: 'consumable',
                        icon: '🎯',
                        effect: '사용 시 점수 +3',
                        action: function() {
                            // gameState.score 직접 업데이트
                            if (typeof gameState !== 'undefined') {
                                gameState.score += 3;
                            }
                            PopupComponent.showMessage('보너스피 효과 발동! 점수 +3', 'success');
                        }
                    });
                    
                    PopupComponent.showMessage('보너스피 카드를 획득했습니다!', 'success');
                    return true;
                }
            },
            {
                id: 'trash_can_card',
                name: '쓰레기통 카드',
                category: 'consumable_card',
                description: '소모품 카드 - 사용 시 버리기 횟수 +1',
                price: 3,
                rarity: 'common',
                icon: '🗑️',
                effect: function() {
                    // 소모품 카드 슬롯 확인
                    if (gameStateManager.state.consumableCards.length >= 2) {
                        PopupComponent.showMessage('소모품 카드는 최대 2장까지만 보유할 수 있습니다!', 'error');
                        // 환불
                        gameStateManager.updateGold(this.price);
                        return false;
                    }
                    
                    // 소모품 카드 추가
                    gameStateManager.state.consumableCards.push({
                        id: 'trash_can',
                        name: '쓰레기통',
                        type: 'consumable',
                        icon: '🗑️',
                        effect: '사용 시 버리기 횟수 +1',
                        action: function() {
                            // gameState.discardsLeft 직접 업데이트
                            if (typeof gameState !== 'undefined') {
                                gameState.discardsLeft++;
                            }
                            PopupComponent.showMessage('쓰레기통 효과 발동! 버리기 횟수 +1', 'success');
                        }
                    });
                    
                    PopupComponent.showMessage('쓰레기통 카드를 획득했습니다!', 'success');
                    return true;
                }
            },
            // 보주 (Orbs)
            {
                id: 'blue_orb',
                name: '청룡의 보주',
                category: 'orb',
                description: '선택한 카드에 청 강화 부여 (점수 +1)',
                price: 4,
                rarity: 'rare',
                icon: '🔵',
                enhancementType: ENHANCEMENT_TYPES.BLUE.name,
                requiresCardSelection: true
            },
            {
                id: 'red_orb',
                name: '주작의 보주',
                category: 'orb',
                description: '선택한 카드에 적 강화 부여 (버려질 때 배수 +0.5)',
                price: 5,
                rarity: 'rare',
                icon: '🔴',
                enhancementType: ENHANCEMENT_TYPES.RED.name,
                requiresCardSelection: true
            },
            {
                id: 'white_orb',
                name: '백호의 보주',
                category: 'orb',
                description: '선택한 카드에 백 강화 부여 (바닥에 있을 때 점수 +2)',
                price: 4,
                rarity: 'rare',
                icon: '⚪',
                enhancementType: ENHANCEMENT_TYPES.WHITE.name,
                requiresCardSelection: true
            },
            {
                id: 'black_orb',
                name: '현무의 보주',
                category: 'orb',
                description: '선택한 카드에 흑 강화 부여 (핸드에 있을 때 점수 +2)',
                price: 4,
                rarity: 'epic',
                icon: '⚫',
                enhancementType: ENHANCEMENT_TYPES.BLACK.name,
                requiresCardSelection: true
            },
            {
                id: 'gold_orb',
                name: '황룡의 보주',
                category: 'orb',
                description: '선택한 카드에 황 강화 부여 (스테이지 종료 시 소지금 +1)',
                price: 6,
                rarity: 'legendary',
                icon: '🟡',
                enhancementType: ENHANCEMENT_TYPES.GOLD.name,
                requiresCardSelection: true
            },
            {
                id: 'rainbow_orb',
                name: '오색의 보주',
                category: 'orb',
                description: '선택한 카드에 무작위 강화 부여',
                price: 3,
                rarity: 'common',
                icon: '🌈',
                requiresCardSelection: true,
                effect: (card) => {
                    const types = Object.keys(ENHANCEMENT_TYPES);
                    const randomType = types[Math.floor(Math.random() * types.length)];
                    gameStateManager.applyEnhancement(card.id, ENHANCEMENT_TYPES[randomType].name);
                    PopupComponent.showMessage(
                        `${card.name}에 ${ENHANCEMENT_TYPES[randomType].name} 강화가 부여되었습니다!`, 
                        'success'
                    );
                }
            },
            {
                id: 'void_orb',
                name: '무극의 보주',
                category: 'orb',
                description: '선택한 카드를 덱에서 제거',
                price: 4,
                rarity: 'common',
                icon: '🕳️',
                requiresCardSelection: true,
                requiresDeckCard: true,
                effect: (card) => {
                    gameStateManager.removeCard(card.id);
                    PopupComponent.showMessage(`${card.name}가 덱에서 제거되었습니다!`, 'success');
                }
            },
            {
                id: 'twin_orb',
                name: '쌍생의 보주',
                category: 'orb',
                description: '무작위 패 5장 중 하나를 선택해서 복제',
                price: 6,
                rarity: 'epic',
                icon: '🔁',
                requiresRandomHandSelection: true,
                effect: (card) => {
                    gameStateManager.duplicateCard(card.id);
                    
                    // 원본 카드의 강화 효과도 복제
                    const originalEnhancement = gameStateManager.state.cardEnhancements[card.id];
                    if (originalEnhancement) {
                        // 복제된 카드의 ID 생성 (원본과 동일한 ID를 사용)
                        gameStateManager.state.cardEnhancements[card.id] = originalEnhancement;
                        PopupComponent.showMessage(
                            `${card.name}가 ${originalEnhancement} 강화 효과와 함께 복제되었습니다!`, 
                            'success'
                        );
                    } else {
                        PopupComponent.showMessage(`${card.name}가 복제되어 덱에 추가되었습니다!`, 'success');
                    }
                }
            }
        ];
    }

    // 상점 아이템 배치 (2-3 레이아웃)
    arrangeShopItems() {
        const treasures = this.items.filter(item => item.category === 'treasure');
        const orbs = this.items.filter(item => item.category === 'orb');
        const consumables = this.items.filter(item => item.category === 'consumable');
        
        // 보주와 소모품을 합쳐서 섞기
        const mixedItems = [...orbs, ...consumables];
        const shuffledItems = ArrayUtils.shuffle(mixedItems);
        
        return {
            topRow: treasures,  // 2개 보물
            bottomRow: shuffledItems.slice(0, 3),  // 3개 (보주/소모품 랜덤)
            additionalItems: shuffledItems.slice(3)  // 나머지
        };
    }

    // 아이템 구매 가능 여부
    canPurchase(itemId) {
        const item = this.items.find(i => i.id === itemId);
        return item && 
               gameStateManager.state.gold >= item.price && 
               !gameStateManager.state.purchasedItems.has(itemId);
    }

    // 아이템 구매 처리
    purchaseItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item || !this.canPurchase(itemId)) return false;

        gameStateManager.updateGold(-item.price);
        gameStateManager.purchaseItem(itemId);

        // 카드 선택이 필요한 경우
        if (item.requiresCardSelection || item.requiresDeckCard || item.requiresRandomHandSelection) {
            return this.handleCardSelection(item);
        }

        // 즉시 효과 적용
        if (item.effect) {
            const result = item.effect.call(this);
            // 소모품 카드가 슬롯이 꽉 차서 실패한 경우
            if (result === false) {
                // 구매 취소 처리
                gameStateManager.updateGold(item.price);
                gameStateManager.state.purchasedItems.delete(itemId);
                return false;
            }
        }

        return true;
    }

    // 카드 선택 처리
    handleCardSelection(item) {
        if (item.requiresRandomHandSelection) {
            // 무작위 5장 선택
            const allCards = this.getAllDeckCards();
            const randomCards = ArrayUtils.randomSelect(allCards, 5);
            this.showCardSelectionPopup(randomCards, item);
        } else if (item.requiresDeckCard) {
            // 덱 카드에서 무작위 5장 선택
            const deckCards = this.getAllDeckCards();
            const randomCards = ArrayUtils.randomSelect(deckCards, Math.min(5, deckCards.length));
            this.showCardSelectionPopup(randomCards, item);
        } else {
            // 현재 패 카드 선택
            this.showCardSelectionPopup(gameStateManager.state.playerHand, item);
        }
        return true;
    }

    // 모든 덱 카드 가져오기
    getAllDeckCards() {
        // HWATU_CARDS가 전역에 없으면 gameState.deck 사용
        let allCards = [];
        
        if (typeof HWATU_CARDS !== 'undefined') {
            allCards = [...HWATU_CARDS];
        } else if (typeof gameState !== 'undefined' && gameState.deck) {
            // gameState.deck와 hand, floor, captures에서 모든 카드 수집
            allCards = [
                ...gameState.deck,
                ...gameState.hand,
                ...gameState.floor,
                ...gameState.captures,
                ...gameState.opponentHand,
                ...gameState.opponentCaptures
            ];
        }
        
        // 제거된 카드 필터링
        const filteredCards = allCards.filter(card => 
            !gameStateManager.state.removedCards.has(card.id)
        );
        
        // 복제된 카드 추가
        gameStateManager.state.duplicatedCards.forEach(cardId => {
            const duplicatedCard = allCards.find(c => c.id === parseInt(cardId));
            if (duplicatedCard) {
                filteredCards.push({...duplicatedCard});
            }
        });
        
        return filteredCards;
    }

    // 계절 카드 추가 메서드
    addSeasonalCard(months, seasonName) {
        // 모든 카드 가져오기
        const allCards = this.getAllDeckCards();
        
        // 해당 월의 모든 카드 수집
        const seasonalCards = allCards.filter(card => 
            months.includes(card.month)
        );
        
        if (seasonalCards.length === 0) {
            console.error('No seasonal cards found for months:', months);
            return;
        }

        // 무작위 카드 선택
        const randomCard = seasonalCards[Math.floor(Math.random() * seasonalCards.length)];
        
        // 카드 획득 애니메이션 표시
        this.showCardAcquisitionAnimation(randomCard, seasonName);
        
        // 덱에 카드 추가 (복제로 처리)
        gameStateManager.duplicateCard(randomCard.id);
    }

    // 카드 획득 애니메이션
    showCardAcquisitionAnimation(card, seasonName) {
        // 덱 카드 요소 찾기 (🎴 이모지가 있는 요소)
        const deckCard = document.querySelector('.deck-card');
        const deckRect = deckCard ? deckCard.getBoundingClientRect() : null;
        
        // 화면 중앙 위치
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // 계절 이름 표시 (화면 상단에 고정)
        const seasonTitle = DOMUtils.createElement('h2', {
            style: {
                position: 'fixed',
                top: '50px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#ffd700',
                fontSize: '36px',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
                zIndex: 10001,
                animation: 'fadeIn 0.5s ease'
            },
            textContent: `${seasonName}의 패 획득!`
        });
        document.body.appendChild(seasonTitle);

        // 카드 생성 - createCardElement 함수 사용
        let cardElement;
        if (typeof createCardElement === 'function') {
            cardElement = createCardElement(card);
        } else {
            // createCardElement가 없으면 기본 카드 생성
            cardElement = document.createElement('div');
            cardElement.className = 'card';
            
            // 카드 이미지 직접 설정
            let imageName = '';
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
            
            if (imageName) {
                cardElement.style.backgroundImage = `url('new card/${imageName}')`;
                cardElement.style.backgroundSize = 'cover';
                cardElement.style.backgroundPosition = 'center';
            }
        }
        
        // 카드 스타일 설정
        cardElement.style.cssText += `
            position: fixed;
            left: ${centerX - 60}px;
            top: ${centerY - 80}px;
            width: 120px;
            height: 160px;
            z-index: 10002;
            box-shadow: 0 0 50px rgba(255, 215, 0, 1);
            border: 3px solid #ffd700;
            border-radius: 8px;
            transform: scale(0) rotateY(0deg);
            transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            background-size: cover;
            background-position: center;
        `;
        document.body.appendChild(cardElement);

        // 카드 정보 표시
        const cardInfo = DOMUtils.createElement('div', {
            style: {
                position: 'fixed',
                left: '50%',
                top: `${centerY + 100}px`,
                transform: 'translateX(-50%)',
                textAlign: 'center',
                opacity: '0',
                zIndex: 10001,
                transition: 'opacity 0.5s ease'
            },
            innerHTML: `
                <div style="color: #fff; font-size: 24px; font-weight: bold; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                    ${card.month}월 - ${card.name}
                </div>
                <div style="color: #ffd700; font-size: 18px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                    덱에 추가됩니다!
                </div>
            `
        });
        document.body.appendChild(cardInfo);

        // 1단계: 카드 나타나기
        setTimeout(() => {
            cardElement.style.transform = 'scale(1.5) rotateY(360deg)';
            cardInfo.style.opacity = '1';
        }, 100);

        // 2단계: 잠시 대기 후 덱으로 이동
        setTimeout(() => {
            // 덱 위치로 이동 (덱 카드의 중앙으로)
            if (deckRect) {
                const targetX = deckRect.left + (deckRect.width / 2) - 60;
                const targetY = deckRect.top + (deckRect.height / 2) - 80;
                
                cardElement.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                cardElement.style.left = `${targetX}px`;
                cardElement.style.top = `${targetY}px`;
                cardElement.style.transform = 'scale(0.3) rotate(720deg)';
                cardElement.style.opacity = '0';
            } else {
                // 덱 위치를 찾을 수 없으면 우측 상단으로
                cardElement.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                cardElement.style.left = `${window.innerWidth - 150}px`;
                cardElement.style.top = `100px`;
                cardElement.style.transform = 'scale(0.3) rotate(720deg)';
                cardElement.style.opacity = '0';
            }
            
            // 정보 텍스트 페이드 아웃
            cardInfo.style.opacity = '0';
            
            // 효과음 재생
            if (typeof playSound === 'function') {
                playSound('se/allow1.mp3');
            }
        }, 2000);

        // 3단계: 제거 및 덱 카운트 업데이트
        setTimeout(() => {
            cardElement.remove();
            cardInfo.remove();
            seasonTitle.remove();
            
            // 덱 카운트 업데이트
            if (typeof updateDeckCount === 'function') {
                updateDeckCount();
            }
            
            PopupComponent.showMessage(
                `${card.month}월 ${card.name}이(가) 덱에 추가되었습니다!`,
                'success'
            );
        }, 3000);
    }

    // 카드 선택 팝업 표시
    showCardSelectionPopup(cards, item) {
        // 새로운 CardSelectionComponent 사용
        CardSelectionComponent.create(cards, {
            title: item.name,
            description: item.description,
            maxCards: 5,
            showEnhancement: true,
            onSelect: (selectedCard) => {
                if (item.enhancementType) {
                    gameStateManager.applyEnhancement(selectedCard.id, item.enhancementType);
                    PopupComponent.showMessage(
                        `${selectedCard.name}에 ${item.enhancementType} 강화가 부여되었습니다!`, 
                        'success'
                    );
                } else if (item.effect) {
                    item.effect(selectedCard);
                }
                
                // 상점 UI 업데이트
                if (typeof updateDeckCount === 'function') {
                    updateDeckCount();
                }
                if (typeof updateConsumableCards === 'function') {
                    updateConsumableCards();
                }
            },
            onCancel: () => {
                // 취소 기능 제거 - 환불 없음
            }
        });
    }
}

// 전역 상점 매니저 인스턴스
const shopManager = new ShopManager();