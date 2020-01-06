var bgm = createSound('./assets/bgm.ogg', true);
on('click', bgm.stop.bind(bgm));