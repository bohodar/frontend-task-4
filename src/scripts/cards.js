'use strict';
const cardsBody = document.body.querySelector('.cards-body');
const cardsForm = cardsBody.querySelector('.cards-body__wrapper');
cardsForm.addEventListener('submit', handleSubmit);
const cardsBox = cardsForm.querySelector('.cards-body__cards');
const usersCards = [];

for (let i = 0; i < 5; i++) {
  usersCards[i] = [];
  for (let j = 0; j < 20; j++) {
    usersCards[i].push([]);
  }
}

usersCards.forEach((box, boxIndex) => {
  cardsBox.appendChild(document.createElement('label'));
  const cardsLabel = cardsBox.children[boxIndex];
  cardsLabel.dataset.boxId = `${boxIndex}`;
  box.forEach((card, cardIndex) => {
    const cardInput = document.createElement('input');
    const cardInputLabel = document.createElement('label');
    cardInput.id = `box${boxIndex}-card${cardIndex}`;
    cardInput.dataset.itemId = `${cardIndex + 1}`;
    cardInput.type = 'checkbox';
    cardInputLabel.htmlFor = `box${boxIndex}-card${cardIndex}`;
    cardInputLabel.textContent = `${cardIndex + 1}`;
    cardsLabel.appendChild(cardInput);
    cardsLabel.appendChild(cardInputLabel);
  })
});

const copyCardsBox = cardsBox.cloneNode(true);
copyCardsBox.style.transform = 'scale(0.8)';

function handleSubmit(e) {

  let isAllowed = false;
  e.preventDefault();
  const warning = cardsForm.querySelector('.cards-body__warning');

  const filteredCards = usersCards.map((el, index) => {
    return Array.from(cardsForm)
      .filter((card) => (
        card.type === 'checkbox' &&
        card.checked &&
        +card.parentNode.dataset.boxId === +index
      ) ? card : null);
  });

  filteredCards.forEach(el => {
    if (el.length !== 5) {
      isAllowed = false;
      warning.classList.add('cards-body__warning--showed')
    } else {
      isAllowed = true;
      warning.classList.remove('cards-body__warning--showed')
    }
  });

  if (!isAllowed) return;

  const gottenCardsFromServ = getWinCombination();
  console.log(gottenCardsFromServ);

  gottenCardsFromServ.forEach((gottenArr, index) => {
    filteredCards.forEach((userArr) => {
      userArr.forEach((input) => {
        gottenArr.forEach(number => {
          if (+input.parentNode.dataset.boxId === index && +input.dataset.itemId === number) {
            input.nextElementSibling.classList.add('matched');
          }
        })
      })
    })
  });

  const copyInputs = copyCardsBox.querySelectorAll('input');
  gottenCardsFromServ.forEach((gottenArr, index) => {
    for (let i = 0; i < copyInputs.length; i++) {
      gottenArr.forEach(number => {
        if (
          +copyInputs[i].parentNode.dataset.boxId === index &&
          +copyInputs[i].dataset.itemId === number
        ) {
          copyInputs[i].checked = true;
        }
      })
    }
  });

  cardsBody.appendChild(copyCardsBox);
}

function getWinCombination() {
  const mainArr = new Array(5);
  for (let i = 0; i < mainArr.length; i++) {
    mainArr[i] = [];
    const numArr = mainArr[i];
    while (numArr.length < 5) {
      const number = Math.floor(Math.random() * 20) + 1;
      if (numArr.indexOf(number) === -1) numArr.push(number)
    }
  }
  return mainArr
}
