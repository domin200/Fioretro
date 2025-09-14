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
                    shopManager.addSeasonalCard([1, 2, 3], '봄');
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
                    shopManager.addSeasonalCard([4, 5, 6], '여름');
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
                    shopManager.addSeasonalCard([7, 8, 9], '가을');
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
                    shopManager.addSeasonalCard([10, 11, 12], '겨울');
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
            item.effect();
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
            // 덱 카드 선택
            const deckCards = this.getAllDeckCards();
            this.showCardSelectionPopup(deckCards, item);
        } else {
            // 현재 패 카드 선택
            this.showCardSelectionPopup(gameStateManager.state.playerHand, item);
        }
        return true;
    }

    // 모든 덱 카드 가져오기
    getAllDeckCards() {
        const cards = [];
        for (let month = 1; month <= 12; month++) {
            for (let i = 0; i < 4; i++) {
                const cardId = `${month}_${i + 1}`;
                if (!gameStateManager.state.removedCards.has(cardId)) {
                    cards.push(hwatu[month - 1][i]);
                }
            }
        }
        
        // 복제된 카드 추가
        gameStateManager.state.duplicatedCards.forEach(cardId => {
            const [month, num] = cardId.split('_').map(Number);
            cards.push(hwatu[month - 1][num - 1]);
        });
        
        return cards;
    }

    // 계절 카드 추가 메서드
    addSeasonalCard(months, seasonName) {
        // hwatu 카드 데이터가 필요함 - 전역 변수 참조
        if (typeof hwatu === 'undefined') {
            console.error('hwatu card data not found');
            return;
        }

        // 해당 월의 모든 카드 수집
        const seasonalCards = [];
        months.forEach(month => {
            for (let i = 0; i < 4; i++) {
                seasonalCards.push(hwatu[month - 1][i]);
            }
        });

        // 무작위 카드 선택
        const randomCard = seasonalCards[Math.floor(Math.random() * seasonalCards.length)];
        
        // 카드 획득 애니메이션 표시
        this.showCardAcquisitionAnimation(randomCard, seasonName);
        
        // 덱에 카드 추가 (복제로 처리)
        gameStateManager.duplicateCard(randomCard.id);
    }

    // 카드 획득 애니메이션
    showCardAcquisitionAnimation(card, seasonName) {
        // 전체 화면 오버레이
        const overlay = DOMUtils.createElement('div', {
            style: {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.8)',
                zIndex: 10000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeIn 0.3s ease'
            }
        });

        // 계절 이름 표시
        const seasonTitle = DOMUtils.createElement('h2', {
            style: {
                color: '#ffd700',
                fontSize: '36px',
                marginBottom: '20px',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
            },
            textContent: `${seasonName}의 패 획득!`
        });
        overlay.appendChild(seasonTitle);

        // 카드 컨테이너
        const cardContainer = DOMUtils.createElement('div', {
            style: {
                position: 'relative',
                transform: 'scale(0)',
                transition: 'transform 0.5s ease'
            }
        });

        // 카드 생성
        const cardElement = CardComponent.create(card, {
            size: 'large',
            showEnhancement: false
        });
        
        // 카드 스타일 추가
        cardElement.style.cssText += `
            width: 150px;
            height: 200px;
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
            border: 3px solid #ffd700;
        `;
        
        cardContainer.appendChild(cardElement);
        overlay.appendChild(cardContainer);

        // 카드 이름과 설명
        const cardInfo = DOMUtils.createElement('div', {
            style: {
                marginTop: '30px',
                textAlign: 'center',
                opacity: '0',
                transition: 'opacity 0.5s ease 0.5s'
            },
            innerHTML: `
                <div style="color: #fff; font-size: 24px; font-weight: bold; margin-bottom: 10px;">
                    ${card.month}월 - ${card.name}
                </div>
                <div style="color: #aaa; font-size: 16px;">
                    덱에 추가되었습니다!
                </div>
            `
        });
        overlay.appendChild(cardInfo);

        document.body.appendChild(overlay);

        // 애니메이션 시작
        setTimeout(() => {
            cardContainer.style.transform = 'scale(1) rotateY(360deg)';
            cardInfo.style.opacity = '1';
        }, 100);

        // 3초 후 덱으로 날아가는 애니메이션
        setTimeout(() => {
            cardContainer.style.transition = 'all 0.8s ease';
            cardContainer.style.transform = 'scale(0.1) translateY(300px) rotate(720deg)';
            cardContainer.style.opacity = '0';
            
            // 페이드 아웃
            overlay.style.animation = 'fadeOut 0.5s ease 0.3s';
            
            // 완전히 제거
            setTimeout(() => {
                overlay.remove();
                PopupComponent.showMessage(
                    `${card.month}월 ${card.name}이(가) 덱에 추가되었습니다!`,
                    'success'
                );
            }, 800);
        }, 3000);
    }

    // 카드 선택 팝업 표시
    showCardSelectionPopup(cards, item) {
        const content = `
            <div class="card-selection-container">
                <p style="color: #ffd700; margin-bottom: 20px;">${item.description}</p>
                <div class="card-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px;">
                    ${cards.map(card => `
                        <div class="selectable-card" data-card-id="${card.id}" 
                             style="cursor: pointer; transition: transform 0.3s;">
                            ${CardComponent.create(card, { size: 'small', showEnhancement: true }).outerHTML}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const popup = PopupComponent.create('카드 선택', content, {
            buttons: [
                {
                    text: '취소',
                    type: 'danger',
                    onClick: () => {
                        gameStateManager.updateGold(item.price); // 환불
                        gameStateManager.state.purchasedItems.delete(item.id);
                        PopupComponent.showMessage('구매가 취소되었습니다.', 'info');
                    }
                }
            ]
        });

        // 카드 클릭 이벤트
        popup.querySelectorAll('.selectable-card').forEach(cardDiv => {
            cardDiv.onclick = () => {
                const cardId = cardDiv.dataset.cardId;
                const selectedCard = cards.find(c => c.id === cardId);
                
                if (item.enhancementType) {
                    gameStateManager.applyEnhancement(cardId, item.enhancementType);
                    PopupComponent.showMessage(
                        `${selectedCard.name}에 ${item.enhancementType} 강화가 부여되었습니다!`, 
                        'success'
                    );
                } else if (item.effect) {
                    item.effect(selectedCard);
                }
                
                popup.remove();
            };
        });
    }
}

// 전역 상점 매니저 인스턴스
const shopManager = new ShopManager();