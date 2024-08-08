document.addEventListener('DOMContentLoaded', async () => {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe.user;
    const coinCounter = document.getElementById('coin-counter');
    const clickButtonSmall = document.getElementById('click-button-small');
    const clickButtonBig = document.getElementById('click-button-big');
    const clickButtonEarth = document.getElementById('click-earth');
    const userName = document.getElementById('user-name');
    const copyReferralLinkButton = document.getElementById('copy-referral-link');
    const friendsList = document.getElementById('friends-list');
    const friendsCount = document.getElementById('friends-count');
    const leadersList = document.getElementById('leaders-list');
    const navButtons = document.querySelectorAll('.nav-button');

    let coins = 0.00000;

    if (user) {
        userName.textContent = user.first_name;
        await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                telegramId: user.id,
                firstName: user.first_name,
                photoUrl: user.photo_url
            })
        });

        const res = await fetch(`/api/users/${user.id}`);
        const data = await res.json();
        coins = data.coins;
        coinCounter.textContent = coins.toFixed(5);
    }

    clickButtonSmall.addEventListener('click', async () => {
        coins += 0.00020;
        coinCounter.textContent = coins.toFixed(5);

        await fetch(`/api/users/${user.id}/coins`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ coins })
        });
    });

    clickButtonBig.addEventListener('click', async () => {
        coins += 0.00001;
        coinCounter.textContent = coins.toFixed(5);

        await fetch(`/api/users/${user.id}/coins`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ coins })
        });
    });

    clickButtonEarth.addEventListener('click', async () => {
        coins -= 0.00050;
        coinCounter.textContent = coins.toFixed(5);

        await fetch(`/api/users/${user.id}/coins`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ coins })
        });
    });

    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetSection = e.target.getAttribute('data-section');
            document.querySelectorAll('#app > div').forEach(div => {
                div.classList.add('d-none');
            });
            document.getElementById(targetSection).classList.remove('d-none');
            navButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            if (targetSection === 'friends-section') {
                loadFriends();
            } else if (targetSection === 'leaders-section') {
                loadLeaders();
            }
        });
    });

    copyReferralLinkButton.addEventListener('click', () => {
        const referralLink = `https://tetra-bet.ru/?ref=${user.id}`;
        navigator.clipboard.writeText(referralLink).then(() => {
            alert('Реферальная ссылка скопирована!');
        });
    });

    async function loadFriends() {
        const res = await fetch(`/api/users/${user.id}/friends`);
        const data = await res.json();
        friendsCount.textContent = data.length;
        friendsList.innerHTML = '';
        data.forEach(friend => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = `${friend.firstName} - ${friend.coins.toFixed(5)} 💵`;
            friendsList.appendChild(li);
        });
    }

    async function loadLeaders() {
        try {
            console.log('Fetching leaders...');
            const res = await fetch('/api/leaders');
            if (res.ok) {
                const data = await res.json();
                console.log('Leaders data:', data);
                leadersList.innerHTML = '';
                data.forEach((leader, index) => {
                    const li = document.createElement('li');
                    let bgColor;
                    switch (index) {
                        case 0:
                            bgColor = 'bg-warning';
                            break;
                        case 1:
                            bgColor = 'bg-secondary';
                            break;
                        case 2:
                            bgColor = 'bg-danger';
                            break;
                        default:
                            bgColor = 'bg-dark';
                    }
                    li.className = `list-group-item ${bgColor}`;
                    li.textContent = `${leader.firstName} - ${leader.coins.toFixed(5)} coins`;
                    leadersList.appendChild(li);
                });
            } else {
                throw new Error(await res.text());
            }
        } catch (error) {
            console.error('Failed to load leaders:', error.message);
        }
    }

    // Set initial active section
    document.querySelector('.nav-button[data-section="home-section"]').click();
});
