/* ================================================
   BINARO GUIDE — Main Entry Point
   ================================================ */

import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initWalkthroughs } from './walkthrough.js';
import { initPractice } from './practice.js';

document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initNavigation();
    initWalkthroughs();
    initPractice();
});
