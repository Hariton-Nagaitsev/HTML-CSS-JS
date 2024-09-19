(function() {
    'use strict';

    function saveAudioState() {
        const currentAudio = document.querySelector('audio:not([data-next])');
        if (currentAudio && !currentAudio.paused) {
            sessionStorage.setItem('audioId', currentAudio.id);
            sessionStorage.setItem('audioTime', currentAudio.currentTime);
            sessionStorage.setItem('audioPlaying', true);
        }
    }

    function restoreAudioState() {
        const audioId = sessionStorage.getItem('audioId');
        const audioTime = sessionStorage.getItem('audioTime');
        const audioPlaying = sessionStorage.getItem('audioPlaying') === 'true';

        if (audioId) {
            const audio = document.getElementById(audioId);
            if (audio) {
                audio.currentTime = parseFloat(audioTime) || 0;
                if (audioPlaying && !audio.paused) {
                    audio.play().catch(error => {
                        console.error('Ошибка при воспроизведении аудио:', error);
                    });
                }
            } else {
                console.warn(`Аудио с ID ${audioId} не найдено.`);
            }
        }
    }

    function clearAudioState() {
        sessionStorage.removeItem('audioId');
        sessionStorage.removeItem('audioTime');
        sessionStorage.removeItem('audioPlaying');
    }

    function setupAutoPlayNext() {
        document.querySelectorAll('audio').forEach(audio => {
            audio.addEventListener('ended', () => {
                const nextAudioId = audio.getAttribute('data-next');
                if (nextAudioId) {
                    const nextAudio = document.getElementById(nextAudioId);
                    if (nextAudio) {
                        nextAudio.play().catch(error => {
                            console.error('Ошибка при воспроизведении следующего аудио:', error);
                        });
                    } else {
                        console.warn(`Следующее аудио с ID ${nextAudioId} не найдено.`);
                    }
                }
                clearAudioState();
            });
        });
    }

    function setupAudioControls() {
        document.addEventListener('play', e => {
            if (e.target.tagName === 'AUDIO') {
                document.querySelectorAll('audio').forEach(audio => {
                    if (audio !== e.target) {
                        audio.pause();
                        audio.currentTime = 0;
                    }
                });
            }
        }, true);
    }

    function toggleList(id) {
        const list = document.getElementById(id);
        if (!list) {
            console.warn(`Список с ID ${id} не найден.`);
            return;
        }

        const sections = document.querySelectorAll('.music-section');

        sections.forEach(section => {
            const sectionList = section.querySelector('.music-list');
            if (sectionList !== list) {
                sectionList.style.display = 'none';
                section.classList.remove('active');
            }
        });

        if (list.style.display === 'block') {
            list.style.display = 'none';
            document.querySelector('.music-section.active')?.classList.remove('active');
        } else {
            list.style.display = 'block';
            document.querySelector('.music-section.active')?.classList.remove('active');
            document.querySelector(`#${id}`).parentNode.classList.add('active');
        }
    }

    function setupToggleList() {
        document.querySelectorAll('.music-section').forEach(section => {
            section.addEventListener('click', () => {
                const toggleId = section.getAttribute('data-toggle');
                toggleList(toggleId);
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        restoreAudioState();
        setupAutoPlayNext();
        setupAudioControls();
        setupToggleList();
    });
})();
