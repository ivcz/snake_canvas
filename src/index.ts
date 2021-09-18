import '@/assets/style/main.scss';

import { Main } from '@/Game/Main'
import AI from './Game/AI';
import Heap from '@/Utils/Heap';

document.addEventListener('DOMContentLoaded', () => {
    const game = new Main('main-canvas', 320);
    const ai = new AI(game);
    setInterval(() => {
        if (!game.pause) {
            ai.start();
            game.start();
        }
    }, 1000 / 320);

    document.addEventListener('keypress', (ev: KeyboardEvent) => {
        if (ev.key === 'q' || ev.key === 'й') {
            console.log('pause toggle');
            game.togglePause();
        }
        // if (ev.key === 'h' || ev.key === 'р') {
        //     game.dirLeft();
        // }
        // if (ev.key === 'j' || ev.key === 'о') {
        //     game.dirDown();
        // }
        // if (ev.key === 'k' || ev.key === 'л') {
        //     game.dirUp();
        // }
        // if (ev.key === 'l' || ev.key === 'д') {
        //     game.dirRight();
        // }
    });
});

