function pop (e) {
    let amount = 30;
    switch (e.target.dataset.type) {
        case 'shadow':
        case 'line':
            amount = 60;
            break;
    }
    if (e.clientX === 0 && e.clientY === 0) {
        const bbox = e.target.getBoundingClientRect();
        const x = bbox.left + bbox.width / 2;
        const y = bbox.top + bbox.height / 2;
        for (let i = 0; i < 30; i++) {
            createParticle(x, y, e.target.dataset.type);
        }
    } else {
        for (let i = 0; i < amount; i++) {
            createParticle(e.clientX, e.clientY, e.target.dataset.type);
        }
    }
}
function createParticle (x, y, type) {
    const particle = document.createElement('particlez');
    document.body.appendChild(particle);
    let width = Math.floor(Math.random() * 30 + 8);
    let height = width;
    let destinationX = (Math.random() - 0.5) * 300;
    let destinationY = (Math.random() - 0.5) * 300;
    let rotation = Math.random() * 520;
    let delay = 1;
    switch (type) {
        case 'square':
            particle.style.background = `hsl(${Math.random() * 50 + 200}, 70%, 60%)`;
            particle.style.border = '1px solid white';
            break;
        case 'earth':
            particle.innerHTML = ['💩','🤮'][Math.floor(Math.random() * 2)];
            particle.style.color = `hsl(${Math.random() * 50 + 200}, 70%, 60%)`;
            particle.style.fontSize = `${Math.random() * 5 + 10}px`;
            particle.style.opacity = `0.5`;
            width = height = 'auto';
            break;
        case 'small':
            particle.innerHTML = ['🔥'][Math.floor(Math.random() * 1)];
            particle.style.color = `hsl(${Math.random() * 50 + 200}, 70%, 60%)`;
            particle.style.fontSize = `${Math.random() * 7 + 10}px`;
            width = height = 'auto';
            particle.style.opacity = `0.1`;
            break;
        case 'big':
            particle.innerHTML = ['👌'][Math.floor(Math.random() * 1)];
            particle.style.color = `hsl(${Math.random() * 50 + 200}, 70%, 60%)`;
            particle.style.fontSize = `${Math.random() * 7 + 10}px`;
            width = height = 'auto';
            particle.style.opacity = `0.1`;
            break;
        case 'logo':
            particle.style.backgroundImage = 'url()';
            break;
        case 'shadow':
            var color = `hsl(${Math.random() * 50 + 200}, 70%, 50%)`;
            particle.style.boxShadow = `0 0 ${Math.floor(Math.random() * 10 + 10)}px ${color}`;
            particle.style.background = color;
            particle.style.borderRadius = '50%';
            width = height = Math.random() * 5 + 4;
            break;
        case 'line':
            particle.style.background = `hsl(${Math.random() * 50 + 200}, 70%, 50%)`;
            height = 1;
            rotation += 1000;
            delay = Math.random() * 1000;
            break;
    }
    particle.style.width = `${width}px`;
    particle.style.height = `${height}px`;
    const animation = particle.animate([
        {
            transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(0deg)`,
            opacity: 1
        },
        {
            transform: `translate(-50%, -50%) translate(${x + destinationX}px, ${y + destinationY}px) rotate(${rotation}deg)`,
            opacity: 0
        }
    ], {
        duration: Math.random() * 1000 + 5000,
        easing: 'cubic-bezier(0, .9, .57, 1)',
        delay: delay
    });
    animation.onfinish = removeParticle;
}
function removeParticle (e) {
    e.srcElement.effect.target.remove();
}
if (document.body.animate) {
    document.querySelectorAll('#click-button-big').forEach(button => button.addEventListener('click', pop));
    document.querySelectorAll('#click-button-small').forEach(button => button.addEventListener('click', pop));
    document.querySelectorAll('#click-earth').forEach(button => button.addEventListener('click', pop));
}