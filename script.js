(function () {
    const navToggle = document.querySelector(".main-nav-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (navToggle && mainNav) {
        navToggle.addEventListener("click", function () {
            const isOpen = mainNav.classList.toggle("main-nav--open");
            navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            navToggle.setAttribute(
                "aria-label",
                isOpen ? "Закрыть меню" : "Открыть меню"
            );
        });

        mainNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                mainNav.classList.remove("main-nav--open");
                navToggle.setAttribute("aria-expanded", "false");
                navToggle.setAttribute("aria-label", "Открыть меню");
            });
        });
    }
})();

(function () {
    if (typeof Swiper === "undefined") return;

    const colorLabels = {
        gray: "Серый",
        black: "Чёрный",
        light: "Светло-серый",
        terracotta: "Терракотовый",
    };

    document.querySelectorAll(".cars-slider.swiper").forEach((sliderEl) => {
        const card = sliderEl.closest(".cars-card");
        const paginationEl = card?.querySelector(".cars-dots");
        const colors = (sliderEl.dataset.bulletColors || "")
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);
        const initialSlide = Number(sliderEl.dataset.initialSlide || 0);

        if (!paginationEl || !colors.length) return;

        new Swiper(sliderEl, {
            slidesPerView: 1,
            spaceBetween: 0,
            initialSlide,
            speed: 400,
            pagination: {
                el: paginationEl,
                clickable: true,
                bulletClass: "cars-dot",
                bulletActiveClass: "cars-dot--active",
                renderBullet(index, className) {
                    const color = colors[index] || "gray";
                    const label = colorLabels[color] || color;
                    return (
                        '<button type="button" class="' +
                        className +
                        " cars-dot--" +
                        color +
                        '" aria-label="' +
                        label +
                        '" aria-selected="false"></button>'
                    );
                },
            },
            on: {
                init(swiper) {
                    updateBulletAria(swiper);
                },
                slideChange(swiper) {
                    updateBulletAria(swiper);
                },
            },
        });
    });

    function updateBulletAria(swiper) {
        swiper.pagination.bullets.forEach((bullet, index) => {
            const isActive = index === swiper.activeIndex;
            bullet.setAttribute("aria-selected", isActive ? "true" : "false");
        });
    }
})();

(function ($) {
    if (typeof $ === "undefined" || !$.fancybox) return;

    const popupEl = document.getElementById("callback-popup");
    const formEl = document.getElementById("callback-form");
    const successEl = document.getElementById("callback-success");
    const phoneInput = formEl?.querySelector('input[name="phone"]');

    function digitsOnly(value) {
        return value.replace(/\D/g, "");
    }

    function formatPhone(value) {
        let digits = digitsOnly(value);
        if (!digits.length) return "";
        if (digits[0] === "8") digits = "7" + digits.slice(1);
        if (digits[0] !== "7") digits = "7" + digits;
        digits = digits.slice(0, 11);

        let result = "+7";
        if (digits.length > 1) result += " (" + digits.slice(1, 4);
        if (digits.length >= 4) result += ") " + digits.slice(4, 7);
        if (digits.length >= 7) result += "-" + digits.slice(7, 9);
        if (digits.length >= 9) result += "-" + digits.slice(9, 11);
        return result;
    }

    function isPhoneValid(value) {
        return digitsOnly(value).length === 11;
    }

    function resetPopup() {
        const inner = popupEl?.querySelector(".callback-popup__inner");
        if (!inner) return;
        inner.classList.remove("callback-popup__inner--success");
        formEl?.reset();
        if (successEl) successEl.hidden = true;
        formEl?.querySelector(".callback-form__submit")?.removeAttribute("disabled");
        phoneInput?.classList.remove("callback-form__input--error");
    }

    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            const formatted = formatPhone(this.value);
            this.value = formatted;
            this.classList.remove("callback-form__input--error");
        });

        phoneInput.addEventListener("focus", function () {
            if (!digitsOnly(this.value).length) {
                this.value = "+7 (";
            }
        });

        phoneInput.addEventListener("blur", function () {
            if (digitsOnly(this.value).length <= 1) {
                this.value = "";
            }
        });
    }

    $(".js-open-form").fancybox({
        type: "inline",
        baseClass: "callback-fancybox",
        touch: false,
        animationEffect: "fade",
        animationDuration: 280,
        transitionEffect: "fade",
        transitionDuration: 280,
        hideScrollbar: true,
        btnTpl: {
            smallBtn:
                '<button type="button" data-fancybox-close class="fancybox-close-small" title="Закрыть" aria-label="Закрыть"></button>',
        },
        beforeShow: function () {
            resetPopup();
        },
        afterClose: function () {
            resetPopup();
        },
    });

    formEl?.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!phoneInput) return;

        if (!isPhoneValid(phoneInput.value)) {
            phoneInput.classList.add("callback-form__input--error");
            phoneInput.focus();
            return;
        }

        const submitBtn = formEl.querySelector(".callback-form__submit");
        submitBtn?.setAttribute("disabled", "disabled");

        const inner = popupEl?.querySelector(".callback-popup__inner");
        if (inner && successEl) {
            inner.classList.add("callback-popup__inner--success");
            successEl.hidden = false;
        }

        setTimeout(function () {
            $.fancybox.close();
        }, 2200);
    });
})(window.jQuery);
