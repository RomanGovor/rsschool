import { cards } from './cards';

export class Card {
  constructor(isTrain, isMain, content) {
    this.isTrain = isTrain;
    this.isMain = isMain;
    this.content = content;
    this.renderCard();
  }

  renderCard() {
    const card = document.createElement('section');
    const front = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('word', `${this.content.word}`);
    front.classList.add('front');

    front.innerHTML = `
        <div class="img-card${!this.isTrain && !this.isMain ? ' full-height' : ''}" style="background-image: url('${this.content.image}');"></div>
        <div class="separator${!this.isTrain ? ' play-color' : ''}${!this.isTrain && !this.isMain ? ' none' : ''}"></div>
        <div class="description${!this.isTrain && !this.isMain ? ' none' : ''}">
          <div class="description-string">
            <div class="description-title">${this.content.word}</div>
              <button class="roll-button">
                <img src="./assets/icons/arrow.svg" alt="arrow" class="arrow">
            </button>
          </div>
        </div>
    `;

    card.append(front);

    if (!this.isMain) {
      const back = document.createElement('div');
      back.classList.add('back');

      back.innerHTML = `
          <div class="img-card" style="background-image: url('${this.content.image}');"></div>
          <div class="separator${!this.isTrain ? ' play-color' : ''}"></div>
          <div class="description">
             <div class="description-string">
               <div class="description-title">${this.content.translation}</div>
             </div>
          </div>
    `;
      card.append(back);
    } else {
      card.classList.add('main-card');
    }

    document.querySelector('.categories-cards').append(card);
  }

  static searchPathToAudioByCard(card, index) {
    const word = card.getAttribute('word');
    let url = '';
    for (let i = 0; i < cards[index].properties.length; i++) {
      if (cards[index].properties[i].word === word) {
        url = cards[index].properties[i].audioSrc;
        break;
      }
    }
    Card.playAudio(url);
  }

  static playAudio(url) {
    const audioObj = new Audio(url);
    audioObj.currentTime = 0;
    audioObj.play();
  }
}
