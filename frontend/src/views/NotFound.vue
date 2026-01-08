<template>
    <div class="not-found-container min-h-[calc(100vh-96px)]">
        <div class="not-found-content">
            <h1>404</h1>
            <p>Oops! It looks like you've hit a dead end.</p>
            <p>Maybe our cat misplaced the page you were looking for.</p>
            <router-link to="/">
                <button class="home-button">Take me home</button>
            </router-link>
        </div>
        <div class="not-found-image">
            <img src="https://img.freepik.com/premium-photo/image-cat-wearing-hoodie-generative-ai_97167-1329.jpg"
                alt="Lost cat image" />
        </div>
    </div>
</template>

<script>
export default {
    name: "NotFound",
};
</script>

<style scoped>
.not-found-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(135deg, #ff6f61, #ff2f62);
    color: #ffffff;
    text-align: center;
    padding: 2rem;
    box-sizing: border-box;
    position: relative;
}

.not-found-content {
    z-index: 1;
    max-width: 80%;
    margin-bottom: 3rem;
}

.not-found-container h1 {
    font-size: 6rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px #000000;
}

.not-found-container p {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
    text-shadow: 1px 1px #000000;
}

.home-button {
    background-color: #ffffff;
    color: #ff2f62;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1.25rem;
    cursor: pointer;
    border-radius: 2rem;
    transition: background-color 0.3s, color 0.3s, transform 0.3s;
}

.home-button:hover {
    background-color: #ff2f62;
    color: #ffffff;
    transform: scale(1.05);
}

.not-found-image {
    position: absolute;
    bottom: 0;
    right: 0;
    max-width: 100%;
    width: 100%;
    height: auto;
    overflow: hidden;
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
}

.not-found-image img {
    max-width: 80%;
    width: auto;
    height: auto;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    opacity: 0.9;
    animation: float 4s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-20px);
    }
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .not-found-container {
        padding: 1rem;
    }

    .not-found-container h1 {
        font-size: 4rem;
    }

    .not-found-container p {
        font-size: 1rem;
    }

    .home-button {
        font-size: 1rem;
        padding: 0.5rem 1rem;
    }

    .not-found-image img {
        max-width: 100%;
    }
}
</style>