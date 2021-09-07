import '@/assets/style/main.scss';

import { Main } from '@/Game/Main'


document.addEventListener('DOMContentLoaded', () => {
    const game = new Main('main-canvas', 10);
    game.start();

    document.addEventListener('keyup', (ev: KeyboardEvent) => {
        if (ev.key === 'й') {
            game.togglePause();
        }
        if (ev.key === 'р') {
            game.dirLeft();
        }
        if (ev.key === 'о') {
            game.dirDown();
        }
        if (ev.key === 'л') {
            game.dirUp();
        }
        if (ev.key === 'д') {
            game.dirRight();
        }
    });
});

