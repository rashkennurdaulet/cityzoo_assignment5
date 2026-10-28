/* =====================================================================
   Owner: Saidazimov Mukhammadjan
   Assignment #5 — Play sounds
   A tiny sound manager. Any element with data-sound="name" plays that
   sound when clicked (event delegation). Only ONE sound plays at a time,
   so effects never overlap. A mute switch is saved in localStorage.
   Public API: window.ZooSound.play(name)
   ===================================================================== */
(function () {
  'use strict';

  var FILES = {
    click:   'sounds/click.wav',
    pop:     'sounds/pop.wav',
    toggle:  'sounds/toggle.wav',
    success: 'sounds/success.wav',
    error:   'sounds/error.wav',
    star:    'sounds/star.wav'
  };
  var STORAGE_KEY = 'cityzoo-sound-muted';

  var cache = {};        /* name -> Audio object, created lazily            */
  var current = null;    /* the Audio object that is playing right now      */
  var muted = readMuted();

  function readMuted() {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { return false; }
  }
  function saveMuted() {
    try { localStorage.setItem(STORAGE_KEY, muted ? '1' : '0'); } catch (e) { /* ignore */ }
  }

  /* Play a named sound; stops the previous one first so nothing overlaps. */
  function play(name) {
    if (muted || !FILES[name]) return;
    if (current) { current.pause(); current.currentTime = 0; }
    var audio = cache[name] || (cache[name] = new Audio(FILES[name]));
    audio.currentTime = 0;
    current = audio;
    var attempt = audio.play();
    if (attempt && typeof attempt.catch === 'function') { attempt.catch(function () { /* autoplay blocked */ }); }
  }

  function renderToggle(button) {
    if (!button) return;
    button.setAttribute('aria-pressed', String(!muted));
    button.setAttribute('aria-label', muted ? 'Turn sounds on' : 'Mute sounds');
    button.textContent = muted ? '🔇 Sound off' : '🔊 Sound on';
  }

  window.ZooSound = {
    play: play,
    isMuted: function () { return muted; }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('soundToggle');
    renderToggle(toggle);

    if (toggle) {
      toggle.addEventListener('click', function () {
        muted = !muted;
        saveMuted();
        renderToggle(toggle);
        play('toggle');                 /* confirms "sound on"; silent when muting */
      });
    }

    /* one listener for every button that carries data-sound="..." */
    document.addEventListener('click', function (event) {
      var source = event.target.closest('[data-sound]');
      if (source) play(source.getAttribute('data-sound'));
    });
  });
})();
