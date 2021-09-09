import '@/assets/style/main.scss';

import { Main } from '@/Game/Main'


document.addEventListener('DOMContentLoaded', () => {
    const game = new Main('main-canvas', 640);
    game.start();

    document.addEventListener('keypress', (ev: KeyboardEvent) => {
        if (ev.key === 'q' || ev.key === 'й') {
            console.log('pause toggle');
            game.togglePause();
        }
        if (ev.key === 'h' || ev.key === 'р') {
            game.dirLeft();
        }
        if (ev.key === 'j' || ev.key === 'о') {
            game.dirDown();
        }
        if (ev.key === 'k' || ev.key === 'л') {
            game.dirUp();
        }
        if (ev.key === 'l' || ev.key === 'д') {
            game.dirRight();
        }
    });
});

