document.addEventListener("DOMContentLoaded", () => {
    const carousels = document.querySelectorAll(".carousel-js");

    carousels.forEach((carousel) => {
        const track = carousel.querySelector(".travel-carousel__track");
        if (!track) return;

        const slides = track.querySelectorAll(".travel-carousel__slide");
        if (!slides.length) return;
        if (slides.length === 1) return;

        let isAnimating = false;
        let autoInterval = null;

        const getSlideWidth = () => {
            const slide = track.querySelector(".travel-carousel__slide");
            if (!slide) return 0;

            const styles = getComputedStyle(track);
            const gap = parseInt(styles.columnGap || styles.gap || "0", 10);
            return slide.offsetWidth + gap;
        };

        const move = (direction) => {
            if (isAnimating) return;
            isAnimating = true;

            const distance = getSlideWidth();
            if (!distance) {
                isAnimating = false;
                return;
            }

            if (direction === "next") {
                const first = track.firstElementChild;
                if (!first) {
                    isAnimating = false;
                    return;
                }

                const clone = first.cloneNode(true);
                track.appendChild(clone);

                track.style.transition = "transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)";
                track.style.transform = `translateX(-${distance}px)`;

                track.addEventListener(
                    "transitionend",
                    () => {
                        track.style.transition = "none";
                        track.style.transform = "translateX(0)";
                        track.removeChild(first);
                        isAnimating = false;
                    },
                    { once: true }
                );
            } else {
                const last = track.lastElementChild;
                if (!last) {
                    isAnimating = false;
                    return;
                }

                const clone = last.cloneNode(true);
                track.insertBefore(clone, track.firstElementChild);

                track.style.transition = "none";
                track.style.transform = `translateX(-${distance}px)`;
                void track.offsetWidth;

                track.style.transition = "transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)";
                track.style.transform = "translateX(0)";

                track.addEventListener(
                    "transitionend",
                    () => {
                        track.style.transition = "none";
                        track.style.transform = "translateX(0)";
                        track.removeChild(last);
                        isAnimating = false;
                    },
                    { once: true }
                );
            }
        };

        const AUTO_DELAY = 2000;

        const stopAuto = () => {
            if (autoInterval) {
                clearInterval(autoInterval);
                autoInterval = null;
            }
        };

        const startAuto = () => {
            stopAuto();
            autoInterval = setInterval(() => {
                if (!isAnimating) move("next");
            }, AUTO_DELAY);
        };

        startAuto();

        carousel.addEventListener("mouseenter", stopAuto);
        carousel.addEventListener("mouseleave", startAuto);
    });
});
