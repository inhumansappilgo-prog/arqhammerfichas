(() => {
    'use strict';

    const roster = document.querySelector('.roster-wrapper');
    if (!roster) return;

    const resetInput = document.getElementById('reset-roster');
    const slots = Array.from(roster.querySelectorAll('.character-slot'));
    const radios = slots.map(slot => slot.querySelector('input[type="radio"]')).filter(Boolean);
    const status = document.getElementById('record-status');
    const archiveCount = document.getElementById('archive-count');
    const clock = document.getElementById('system-clock');
    const boot = document.getElementById('boot-sequence');
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const slugify = value => value
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const getName = slot => slot.querySelector('.tab-name')?.textContent.trim() || 'REGISTRO';
    const getActiveIndex = () => radios.findIndex(radio => radio.checked);

    slots.forEach((slot, index) => {
        const tab = slot.querySelector('.slot-tab');
        const input = slot.querySelector('input[type="radio"]');
        const name = getName(slot);
        const slug = slugify(name);
        input.dataset.archiveSlug = slug;
        input.dataset.archiveIndex = String(index);
        tab.tabIndex = 0;
        tab.setAttribute('role', 'button');
        tab.setAttribute('aria-label', `Abrir arquivo de ${name}`);

        if (!tab.querySelector('.slot-meta')) {
            const meta = document.createElement('div');
            meta.className = 'slot-meta';
            meta.innerHTML = `<span>ARQ-${String(index + 1).padStart(3, '0')}</span><i class="slot-index-light"></i>`;
            tab.appendChild(meta);
        }
    });

    roster.querySelectorAll('.roster-row').forEach((row, index) => {
        const first = index * 10 + 1;
        const last = Math.min(first + 9, slots.length);
        row.dataset.systemLabel = `BANCO BIOMÉTRICO // SETOR ${String(index + 1).padStart(2, '0')} // REGISTROS ${String(first).padStart(2, '0')}-${String(last).padStart(2, '0')}`;
    });

    if (archiveCount) archiveCount.textContent = `${slots.length} REGISTROS`;

    const setActiveState = (input, shouldScroll = true) => {
        slots.forEach(slot => slot.classList.remove('is-active'));
        roster.querySelectorAll('.roster-row').forEach(row => row.classList.remove('has-active'));

        if (!input || input === resetInput || !input.checked) {
            if (status) status.textContent = 'ARQUIVO EM ESPERA';
            history.replaceState(null, '', location.pathname + location.search);
            return;
        }

        const slot = input.closest('.character-slot');
        const row = slot.closest('.roster-row');
        const name = getName(slot);
        slot.classList.add('is-active');
        row?.classList.add('has-active');
        if (status) status.textContent = `DECODIFICANDO: ${name}`;
        history.replaceState(null, '', `#${input.dataset.archiveSlug}`);

        if (shouldScroll) {
            requestAnimationFrame(() => slot.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' }));
        }
    };

    const openByIndex = index => {
        if (!radios.length) return;
        const normalized = (index + radios.length) % radios.length;
        radios[normalized].checked = true;
        radios[normalized].dispatchEvent(new Event('change', { bubbles: true }));
    };

    roster.addEventListener('change', event => {
        const input = event.target.closest('input[type="radio"][name="roster"]');
        if (input) setActiveState(input);
    });

    roster.addEventListener('keydown', event => {
        const tab = event.target.closest('.slot-tab');
        if (tab && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            tab.click();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            resetInput.checked = true;
            setActiveState(resetInput, false);
        } else if (event.key === 'ArrowRight' && (event.altKey || event.ctrlKey)) {
            openByIndex(getActiveIndex() + 1);
        } else if (event.key === 'ArrowLeft' && (event.altKey || event.ctrlKey)) {
            openByIndex(getActiveIndex() - 1);
        }
    });

    document.getElementById('previous-record')?.addEventListener('click', () => openByIndex(getActiveIndex() < 0 ? radios.length - 1 : getActiveIndex() - 1));
    document.getElementById('next-record')?.addEventListener('click', () => openByIndex(getActiveIndex() + 1));
    document.getElementById('close-record')?.addEventListener('click', () => {
        resetInput.checked = true;
        setActiveState(resetInput, false);
    });

    const updateClock = () => {
        if (!clock) return;
        clock.textContent = new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        }).format(new Date());
    };
    updateClock();
    const clockTimer = window.setInterval(updateClock, 1000);
    window.addEventListener('pagehide', () => clearInterval(clockTimer), { once: true });

    const hash = location.hash.slice(1);
    if (hash) {
        const target = radios.find(radio => radio.dataset.archiveSlug === hash);
        if (target) {
            target.checked = true;
            setActiveState(target, false);
            requestAnimationFrame(() => target.closest('.character-slot')?.scrollIntoView({ block: 'nearest', inline: 'center' }));
        }
    }

    if (boot) {
        let alreadyBooted = false;
        try { alreadyBooted = sessionStorage.getItem('hammer-archive-booted') === '1'; } catch (_) {}
        if (alreadyBooted || reduceMotion) {
            boot.classList.add('is-hidden');
        } else {
            window.setTimeout(() => {
                boot.classList.add('is-hidden');
                try { sessionStorage.setItem('hammer-archive-booted', '1'); } catch (_) {}
            }, 1450);
        }
    }
})();
