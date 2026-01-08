const STYLES = [
    'pixel-art',
    'bottts',
    'bottts-neutral',
];

export const getBossImage = (seed) => {
    // Use 'pixel-art' for that retro feel.
    // https://api.dicebear.com/9.x/pixel-art/svg?seed=...
    const style = 'pixel-art';
    return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`;
};

export const preloadBossImages = (count = 20) => {
    const seeds = Array.from({ length: count }, (_, i) => `boss-${i}`);
    seeds.forEach(seed => {
        const img = new Image();
        img.src = getBossImage(seed);
    });
};
