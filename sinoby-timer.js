(function () {
    var SELECTOR = '.sinoby-timer[data-sinoby-reserve="sinoby-y8oc7a"]';
    var MOBILE_MQ = window.matchMedia("(max-width: 480px)");
    var NARROW_MQ = window.matchMedia("(max-width: 320px)");

    var el = document.querySelector(SELECTOR);
    if (!el) return;

    try {
        var cfg = JSON.parse(el.getAttribute("data-config") || "{}");
        cfg.style = cfg.style || {};

        if (NARROW_MQ.matches) {
            Object.assign(cfg.style, {
                digitSize: 32,
                digitGap: 2,
                ringRadius: 26,
                ringThickness: 3,
                labelSize: 9,
                labelGap: 0,
            });
        } else if (MOBILE_MQ.matches) {
            Object.assign(cfg.style, {
                digitSize: 42,
                digitGap: 4,
                ringRadius: 26,
                ringThickness: 4,
                labelSize: 10,
            });
        } else if (window.matchMedia("(max-width: 1024px)").matches) {
            Object.assign(cfg.style, {
                digitSize: 52,
                digitGap: 6,
                ringRadius: 30,
                labelSize: 11,
            });
        }

        el.setAttribute("data-config", JSON.stringify(cfg));
    } catch (e) {}
})();
