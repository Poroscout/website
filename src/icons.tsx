import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faCaretLeft, faCaretRight, faUserPlus, faHome } from '@fortawesome/fontawesome-free-solid';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

library.add(
    // @ts-ignore
    faCaretLeft, faCaretRight, faUserPlus, fab, faHome, faArrowUpRightFromSquare
)

dom.watch();

export {}