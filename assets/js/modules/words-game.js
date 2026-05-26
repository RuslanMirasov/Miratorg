const GAME_WRAPPER = document.querySelector('[data-game-canvas]');
const LAVELS = [
  {
    id: 1,
    words: [
      { word: 'нос', tip: 'У человека между глаз' },
      { word: 'сон', tip: 'Его ты видишь, когда спишь' },
    ],
    letters: [
      ['н', '*', 'c'],
      ['*', '+', '*'],
      ['*', 'о', '*'],
    ],
    matrix: [
      ['*', 'н', '*'],
      ['с', 'о', 'н'],
      ['*', 'с', '*'],
    ],
  },
  {
    id: 2,
    words: [
      { word: 'столб', tip: 'Вертикальная опора или высокий деревянный шест' },
      { word: 'болт', tip: 'Металлический крепеж с резьбой' },
      { word: 'борт', tip: 'Боковая часть корабля или машины' },
      { word: 'стол', tip: 'Мебель, за которой едят или работают' },
      { word: 'лоб', tip: 'Часть лица над глазами' },
      { word: 'лот', tip: 'Товар или приз на розыгрыше' },
    ],
    letters: [
      ['т', 'л', 'б'],
      ['*', '+', '*'],
      ['о', '*', 'с'],
    ],
    matrix: [
      ['*', 'б', 'о', 'л', 'т'],
      ['*', 'о', '*', '*', '*'],
      ['*', 'р', '*', '*', '*'],
      ['с', 'т', 'о', 'л', 'б'],
      ['т', '*', '*', 'о', '*'],
      ['о', '*', '*', 'б', '*'],
      ['л', 'о', 'т', '*', '*'],
    ],
  },
  {
    id: 3,
    words: [
      { word: 'носорог', tip: 'Крупный зверь с мощным рогом на морде' },
      { word: 'носороги', tip: 'Стадо тяжёлых животных с одним рогом' },
      { word: 'рог', tip: 'Твёрдый вырост у быка, козла или оленя на голове' },
      { word: 'ринг', tip: 'Площадка для боксёров' },
      { word: 'горн', tip: 'Труба для сигнала в лагере или на сборе' },
      { word: 'огни', tip: 'Яркие точки, которые загораются в темноте' },
      { word: 'нос', tip: 'Им дышат и чувствуют запахи' },
      { word: 'ноги', tip: 'На них ходят, бегают и прыгают' },
    ],
    letters: [
      ['г', 'н', 'о'],
      ['о', '+', 'и'],
      ['р', 'о', 'с'],
    ],
    matrix: [
      ['*', '*', 'н', 'о', 'г', 'и', '*', '*'],
      ['*', '*', 'о', '*', 'о', '*', '*', 'р'],
      ['н', 'о', 'с', 'о', 'р', 'о', 'г', 'и'],
      ['о', '*', 'о', '*', 'н', '*', '*', 'н'],
      ['с', '*', 'р', '*', '*', '*', '*', 'г'],
      ['*', '*', 'о', 'г', 'н', 'и', '*', '*'],
      ['р', 'о', 'г', '*', '*', '*', '*', '*'],
    ],
  },
];

const renderMatrix = matrix => {
  if (!matrix) return;

  const rows = matrix.map(row => {
    const cells = row.map(cell => {
      if (cell === '*') return '<td></td>';

      return `<td class="letter"><span>${cell}</span></td>`;
    });

    return `<tr>${cells.join('')}</tr>`;
  });

  GAME_WRAPPER.insertAdjacentHTML(
    'beforeend',
    `
      <table class="game-matrix" data-game-matrix>
        ${rows.join('')}
      </table>
    `
  );
};

const renderLetters = letters => {
  if (!letters) return;

  let count = 0;

  const rows = letters.map(row => {
    const cells = row.map(cell => {
      if (cell === '*') return '<li></li>';
      if (cell === '+') return '<li><button data-letter-mix><img src="./assets/img/svg/revers.svg"/></button></li>';
      count++;
      return `<li data-letter="${cell}" class=""><span>${cell}</span></li>`;
    });

    return cells.join('');
  });

  GAME_WRAPPER.insertAdjacentHTML(
    'beforeend',
    `
      <ul class="game-pad count--${count}" data-game-pad>
        ${rows.join('')}
      </ul>
    `
  );
};

const loadGameLavel = number => {
  const level = LAVELS.find(level => level.id === number);

  if (!level || !level.matrix || !level.letters) {
    console.warn('Уровень игры не найден, либо в нём нет обязательных данных (matrix или letters)');
    return;
  }

  const { matrix, letters } = level;

  renderMatrix(matrix);
  renderLetters(letters);
};

export const initWordsGame = () => {
  if (!GAME_WRAPPER) return;

  GAME_WRAPPER.innerHTML = '';

  loadGameLavel(1);
};
