/**
 * ChromoSelector 2.1.8 for jQuery 1.3+
 *
 * All code (c) 2013-2015 - Copyright www.chromoselector.com - All Rights Reserved.
 * Written by Rouslan Placella <info@chromoselector.com>
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 */
(function(e, t, n, r) {
    "use strict";
    function v(e, t, r) {
        return [r + e * n.cos(t), r + e * n.sin(t)]
    }
    function m(e, t, n) {
        return b(e, [t, t]) <= n
    }
    function g(e, t, n, r) {
        var i = function(e, t, n) {
            return (e[0] - n[0]) * (t[1] - n[1]) - (t[0] - n[0]) * (e[1] - n[1])
        }
          , s = i(e, t, n) < 0
          , o = i(e, n, r) < 0
          , u = i(e, r, t) < 0;
        return s === o && o === u
    }
    function y(e, t) {
        return -1 / ((t[1] - e[1]) / (t[0] - e[0]))
    }
    function b(e, t) {
        var r = e[0] - t[0]
          , i = e[1] - t[1];
        return n.sqrt(r * r + i * i)
    }
    function w(e, t) {
        return t * t === Infinity ? [e[0], e[1] + 1] : [e[0] + 1, t + e[1]]
    }
    function E(e, t, n, r) {
        var i = (r[1] - n[1]) * (t[0] - e[0]) - (r[0] - n[0]) * (t[1] - e[1])
          , s = (r[0] - n[0]) * (e[1] - n[1]) - (r[1] - n[1]) * (e[0] - n[0])
          , o = s / i;
        return [e[0] + o * (t[0] - e[0]), e[1] + o * (t[1] - e[1])]
    }
    function S(e, t, n, r) {
        var i, s = (t + n * e.width) * 4;
        for (i = 0; i < 4; i++)
            e.data[s + i] = r[i]
    }
    function x(e, t, n, r) {
        var i = E(r, [r[0] + 20, r[1]], e, t), s = E(r, [r[0] + 20, r[1]], e, n), o;
        return r[0] < i[0] ? o = 255 : r[0] > s[0] ? o = 0 : o = (s[0] - r[0]) / (s[0] - i[0]) * 255,
        [o, o, o, 255]
    }
    function N(t, r) {
        var i = t.getContext("2d")
          , s = e("<canvas>").attr("width", r).attr("height", r)[0]
          , o = s.getContext("2d");
        if (!T.K) {
            T.K = i.createImageData(80, 80);
            var u, a, f, l, c, h, p, d, v = 180 / n.PI, m = function(e) {
                return e %= 360,
                e >= 240 ? 0 : e >= 180 ? 255 * ((240 - e) / 60) : e >= 60 ? 255 : 255 * (e / 60)
            };
            for (a = 0; a < 80; a++) {
                l = a - 40;
                for (f = 0; f < 80; f++)
                    c = f - 40,
                    u = n.atan2(l, c) * v + 270,
                    h = m(u + 120),
                    p = m(u),
                    d = m(u + 240),
                    S(T.K, a, f, [h, p, d, 255])
            }
        }
        i.putImageData(T.K, 0, 0),
        o.scale(r / 80, r / 80),
        o.drawImage(t, 0, 0),
        i.drawImage(s, 0, 0)
    }
    function C(t) {
        var r = t.M
          , i = t.s[1].getContext("2d");
        N(t.s[1], r);
        var s = [r / 2, r / 2];
        i[l] = "destination-out",
        i[c] = "rgba(0,0,0,1)",
        i.lineWidth = t.G,
        i.beginPath(),
        i.arc(s[0], s[1], t.H - t.G / 2, 0, n.PI * 2, !0),
        i.closePath(),
        i.fill();
        var o = e("<canvas/>").attr("width", r).attr("height", r)[0]
          , u = o.getContext("2d");
        u[a](0, 0, r, r),
        u[l] = "destination-out",
        u.beginPath(),
        u.arc(s[0], s[1], t.H + t.G / 2, 0, n.PI * 2, !0),
        u.closePath(),
        u.fill(),
        i.drawImage(o, 0, 0),
        i = t.s[0].getContext("2d"),
        i.lineWidth = t.G - 2,
        i.shadowColor = t.a.shadowColor,
        i.shadowBlur = t.a.shadow,
        i.beginPath(),
        i.arc(s[0], s[1], t.H, 0, n.PI * 2, !0),
        i.closePath(),
        i.stroke()
    }
    function k(e) {
        var t = e.Color.getHsl().h
          , r = e.s[2]
          , i = r.getContext("2d");
        i.clearRect(0, 0, e.M, e.M);
        var s = -n.PI / 2, o = O(e, s), c;
        if (!e.z) {
            var h = i.createImageData(e.M, e.M), d = function(e, t) {
                return {
                    start: n.round(n.min(e[0][t] - 3, e[1][t] - 3, e[2][t] - 3)),
                    end: n.round(n.max(e[0][t] + 3, e[1][t] + 3, e[2][t] + 3))
                }
            }, v = d(o, 0), m = d(o, 1), g, y;
            for (g = o[0][0] - 3; g <= v.end; g++)
                for (y = m.start + (1.7 * (g - o[0][0]) | 0) - 3; y <= m.end; y++)
                    S(h, g, y, x(o[0], o[1], o[2], [g, y]));
            for (g = v.start; g <= o[0][0] - 3; g++)
                for (y = m.start - (1.7 * (g - o[0][0]) | 0) - 3; y <= m.end; y++)
                    S(h, g, y, x(o[0], o[1], o[2], [g, y]));
            c = e.t.getContext("2d"),
            c.putImageData(h, 0, 0);
            var b = c.createLinearGradient(0, m.start, 0, m.end);
            b[u](1, "rgba(0,0,0,0)"),
            b[u](0, "rgba(0,0,0,1)"),
            c[f] = b,
            c[l] = "destination-out",
            c[a](v.start, m.start, v.end, m.end),
            c[l] = "source-over"
        }
        s = (1 - t) * n.PI * 2,
        o = O(e, s),
        i[f] = (new p({
            h: t,
            s: 1,
            l: .5
        })).getHexString(),
        i[a](0, 0, e.M, e.M),
        i.save(),
        i.translate(e.M / 2, e.M / 2),
        i.rotate(s + n.PI / 2),
        i.translate(-e.M / 2, -e.M / 2),
        i.drawImage(e.t, 0, 0),
        i.restore(),
        i.beginPath(),
        i.moveTo(0, 0),
        i.lineTo(o[1][0], o[1][1]),
        i.lineTo(o[0][0], o[0][1]),
        i.lineTo(o[2][0], o[2][1]),
        i.lineTo(o[1][0], o[1][1]),
        i.lineTo(0, 0),
        i.lineTo(0, e.M),
        i.lineTo(e.M, e.M),
        i.lineTo(e.M, 0),
        i.lineTo(0, 0),
        i.closePath(),
        i[l] = "destination-out",
        i[f] = "rgba(0,0,0,1)",
        i.fill();
        var w = function(t, n) {
            var r = 1 / (e.M / 2) * 2;
            return e.M / 2 * r + o[t][n] * (1 - r)
        };
        i[l] = "destination-over",
        i.beginPath(),
        i.moveTo(w(0, 0), w(0, 1)),
        i.lineTo(w(1, 0), w(1, 1)),
        i.lineTo(w(2, 0), w(2, 1)),
        i.closePath(),
        i[f] = "rgba(0,0,0,1)",
        i.shadowColor = e.a.shadowColor,
        i.shadowBlur = e.a.shadow,
        i.fill(),
        i.shadowColor = "rgba(0,0,0,0)",
        i.shadowBlur = 0,
        i[l] = "source-over"
    }
    function L(t) {
        var r = t.s[3]
          , i = r.getContext("2d");
        i.clearRect(0, 0, t.M, t.M);
        var s = (1 - t.Color.getHsl().h) * n.PI * 2
          , o = O(t, s)
          , u = v(t.H, s, t.M / 2)
          , a = [o[1][0] * t.Color.getHsl().l + (1 - t.Color.getHsl().l) * o[2][0], o[1][1] * t.Color.getHsl().l + (1 - t.Color.getHsl().l) * o[2][1]]
          , f = y(o[1], o[2])
          , l = w(a, f)
          , h = E(a, l, o[1], o[2])
          , p = b(o[1], o[2])
          , d = b(o[2], h)
          , m = o[2];
        d >= p / 2 && (m = o[1]);
        var g = E(a, l, o[0], m);
        a = [g[0] * t.Color.getHsl().s + (1 - t.Color.getHsl().s) * h[0], g[1] * t.Color.getHsl().s + (1 - t.Color.getHsl().s) * h[1]],
        e.each([u, a], function(e, t) {
            i[c] = "#fff",
            i.lineWidth = 1.5,
            i.beginPath(),
            i.arc(t[0], t[1], 6, 0, n.PI * 2, !0),
            i.closePath(),
            i.stroke(),
            i.lineWidth = 2,
            i[c] = "rgba(0,0,0,1)",
            i.beginPath(),
            i.arc(t[0], t[1], 4.5, 0, n.PI * 2, !0),
            i.closePath(),
            i.stroke()
        })
    }
    function A(e, t) {
        var n = t.getContext("2d");
        n.clearRect(0, 0, t.width, t.height),
        e.n.css("border-bottom-color") ? n[c] = e.n.css("border-bottom-color") : n[c] = "#444",
        n.lineWidth = 1,
        n.lineCap = "round",
        n.beginPath(),
        n.moveTo(0, 18),
        n.lineTo(18, 0),
        n.moveTo(7, 18),
        n.lineTo(18, 7),
        n.moveTo(13, 18),
        n.lineTo(18, 13),
        n.closePath(),
        n.stroke()
    }
    function O(e, t) {
        var r, i = [];
        for (r = 0; r < 3; r++)
            i[r] = v(e.r, t, e.M / 2),
            t -= n.PI * 2 / 3;
        return i
    }
    function M(e, t) {
        var r = G(e, t, e.d)
          , i = n.atan2(r[0] - e.M / 2, r[1] - e.M / 2) * (180 / n.PI) + 270
          , s = e.Color.getHsla();
        e.Color.setColor({
            h: i / 360,
            s: s.s,
            l: s.l,
            a: s.a
        }),
        k(e),
        L(e),
        e.D(e)
    }
    function _(e, t, n) {
        var r = e.Color.getHsla();
        e.Color.setColor({
            h: r.h,
            s: t,
            l: n,
            a: r.a
        }),
        L(e),
        e.D(e)
    }
    function D(e) {
        e.a.autosave && P(e),
        e.a.preview && e.h.css("background", e.Color.getRgbaString()),
        e.e.trigger(e.a.eventPrefix + "update")
    }
    function P(e) {
        var t = "";
        typeof e.a.color2str == "function" ? t = e.a.color2str.call(null, e.Color) : t = e.Color.getHexString(),
        typeof e.a.save == "function" ? e.a.save.call(e.e[0], t) : e.e.val(t).html(t)
    }
    function H(e, t) {
        var n;
        typeof e.a.load == "function" ? n = e.a.load.call(e.e) : n = e.e.val() || e.e.html(),
        typeof e.a.str2color == "function" ? e.Color = new p(e.a.str2color.call(null, n)) : e.Color = new p(n),
        e.a.preview && e.j && e.h.css("background", e.Color.getRgbaString()),
        e.o && e.o.setColor(e.Color),
        t && (k(e),
        L(e))
    }
    function B(e, t) {
        if (e.J || e.n.is(":visible"))
            return;
        e.J = 1;
        if (e.I) {
            clearTimeout(e.I),
            e.I = 0;
            return
        }
        e.z ? (H(e),
        k(e),
        L(e)) : U(e);
        if (typeof t != "undefined") {
            t = parseInt(t, 10);
            if (t < 0 || isNaN(t))
                t = e.a.speed
        } else
            t = e.a.speed;
        var n = e.e.triggerHandler(e.a.eventPrefix + "beforeShow");
        if (typeof n == "undefined" || n) {
            K(e),
            et(e);
            var r = e.L === "fade" ? "fadeIn" : "slideDown";
            e.n[r].call(e.n, t, function() {
                K(e),
                e.a.resizable && A(e, e.l[0]),
                e.e.trigger(e.a.eventPrefix + "show"),
                e.J = 0
            }),
            e.o && e.o.setHeight(e.b.height())
        }
    }
    function j(e, t) {
        e.I = setTimeout(function() {
            if (e.k && e.k.find("select:focus").length)
                return;
            e.I = 0;
            if (typeof t != "undefined") {
                t = parseInt(t, 10);
                if (t < 0 || isNaN(t))
                    t = e.a.speed
            } else
                t = e.a.speed;
            var n = e.e.triggerHandler(e.a.eventPrefix + "beforeHide");
            if (typeof n == "undefined" || n) {
                var r = e.L === "fade" ? "fadeOut" : "slideUp";
                e.n[r].call(e.n, t, function() {
                    K(e),
                    e.e.trigger(e.a.eventPrefix + "hide")
                })
            }
        }, 100)
    }
    function F(e, t) {
        e.n.is(":visible") ? j(e, t) : B(e, t)
    }
    function I(e, t) {
        var r = (1 - e.Color.getHsl().h) * n.PI * 2
          , i = O(e, r)
          , s = G(e, t, e.d)
          , o = s;
        if (!g(s, i[0], i[1], i[2])) {
            var u, a = [];
            for (u = 0; u < 3; u++)
                a[u] = b(i[u], s);
            var f = n.max.apply(null, a);
            for (u = 0; u < 3; u++)
                if (a[u] === f) {
                    o = q(s, i, a, u);
                    break
                }
        }
        var l = R(i[0], i[1], i[2], o, e.Color.getHsl().h);
        _(e, l.s, l.l)
    }
    function q(e, t, r, i) {
        var s = [0, 1, 2]
          , o = [1, 0, 1]
          , u = [2, 2, 0]
          , a = E(e, t[s[i]], t[o[i]], t[u[i]]);
        if (b(a, t[s[i]]) >= b(t[0], t[1])) {
            var f, l = n.min.apply(null, r);
            for (f = 0; f < 3; f++)
                if (r[f] === l) {
                    a = t[f];
                    break
                }
        }
        return a
    }
    function R(e, t, n, r, i) {
        var s = y(t, n)
          , o = w(r, s)
          , u = E(r, o, t, n)
          , a = b(t, n)
          , f = b(n, u)
          , l = n;
        f >= a / 2 && (l = t),
        s = y(e, l),
        o = w(r, s);
        var c = E(r, u, e, l)
          , h = b(u, r)
          , p = b(u, c)
          , d = h / p;
        return isNaN(d) && (d = 0),
        {
            h: i,
            s: d,
            l: f / a
        }
    }
    function U(e) {
        C(e),
        k(e),
        L(e),
        e.z = 1,
        e.e.trigger(e.a.eventPrefix + "ready")
    }
    function z(e, t) {
        var r = G(e, t, e.d);
        if (e.a.panel || e.a.panelAlpha)
            r[0] -= e.o.getWidth();
        var i = J(e, n.max(r[0], r[1]) + n.max(e.C[0], e.C[1]));
        W(e, i),
        e.e.trigger(e.a.eventPrefix + "resize")
    }
    function W(e, t) {
        e.b.width(t).height(t + e.j.outerHeight()),
        e.a.panel || e.a.panelAlpha ? (e.n.width(e.o.getWidth() + e.b.width()),
        e.o.setHeight(e.b.height())) : e.n.width(e.b.width()),
        e.d.width(t).height(t),
        $(e, t),
        et(e)
    }
    function X(e, t) {
        t !== e.M && (e.z = 0,
        e.M = t,
        e.r = t / 2 - 15 - e.a.ringwidth,
        e.G = e.a.ringwidth,
        e.H = e.M / 2 - e.G / 2 - 10,
        e.s.each(function() {
            this.width = t,
            this.height = t
        }).add(e.b),
        e.t.width = t,
        e.t.height = t,
        W(e, t),
        U(e))
    }
    function V(e) {
        e.preventDefault()
    }
    function $(e, t) {
        if (e.a.roundcorners) {
            t = t || e.M;
            var n = "0px 0px 0px " + t / 2 + "px";
            !e.a.resizable && !e.a.panel && !e.a.panelAlpha && (n = "0px 0px " + t / 2 + "px " + t / 2 + "px"),
            e.n.css({
                "-webkit-border-radius": n,
                "border-radius": n
            })
        }
    }
    function J(e, t) {
        return t |= 0,
        e.a.maxWidth < e.a.minWidth && (e.a.maxWidth = e.a.minWidth),
        t > e.a.maxWidth ? t = e.a.maxWidth : t < e.a.minWidth && (t = e.a.minWidth),
        t += t % 2,
        t
    }
    function K(n) {
        var r;
        try {
            r = n.e.offset()
        } catch (s) {
            return
        }
        var o = n.c.offset();
        if (!n.F) {
            n.c.css({
                top: 0,
                left: 0
            });
            var u = e(i).scrollTop()
              , a = n.n.height()
              , f = r.top - u
              , l = u + e(t).height() - r.top - n.e.outerHeight();
            l < a && f > l ? (n.n.css({
                top: r.top - a
            }),
            n.l && n.l.hide(),
            n.n.css({
                "-webkit-border-radius": "",
                "border-radius": ""
            })) : (n.n.css({
                top: r.top + n.e.outerHeight() + 27
            }),
            n.l && n.l.show(),
            $(n));
            var c = e(i).scrollLeft()
              , h = r.left - c - 2
              , p = r.left + n.n.width() - (c + e(t).width());
            if (p > 0 && h > 0) {
                var d = 2;
                h < p ? d += h : d += p,
                n.n.css({
                    left: r.left - d
                })
            } else
                n.n.css({
                    left: r.left - 10
                })
        }
        n.e.is(":visible") ? (n.f.show().css("top", r.top - o.top + (n.e.outerHeight() - n.f.height()) / 2),
        n.a.iconpos === "left" ? n.f.css("left", r.left - o.left - n.f.outerWidth() - 2) : n.f.css("left", r.left - o.left + n.e.outerWidth() + 2)) : n.f.hide()
    }
    function Q(t, n) {
        var i = r[t], s, u = ["rgb", "hsl", "cmyk"];
        if (typeof n != "undefined")
            if (t === "panelMode")
                e.inArray(n, u) && (i = n);
            else if (t === "panelModes")
                e.each(n, function(t, r) {
                    e.inArray(r, u) || delete n[t]
                }),
                i = n;
            else if (t === "panelChannelWidth")
                s = parseInt(n) || 0,
                s >= 10 && s <= 40 && (i = s + s % 2);
            else if (t === "panelChannelMargin")
                s = parseInt(n) || 0,
                s >= 0 && s <= 50 && (i = s + s % 2);
            else if (t === "panel" || t === "panelAlpha")
                i = !!n;
            else if (t === "shadowColor" && typeof n == "string" && n.length)
                i = (new p(n)).getRgbaString();
            else if (t === "effect")
                i = n === "slide" ? "slide" : "fade";
            else if (t === "iconpos")
                i = n === "left" ? "left" : "right";
            else if (t === "target") {
                i = null;
                if (typeof n == "string" || typeof n == "object") {
                    var a = e(n);
                    a && typeof a[0] == "object" && (i = a)
                }
            } else
                t === "icon" && typeof n == "string" && n.length ? i = n : t === "iconalt" && typeof n == "string" && n.length ? i = n : t === "pickerClass" && typeof n == "string" && n.length ? i = n : t.match(/^autoshow|autosave|resizable|preview|roundcorners$/) ? i = !!n : t.match(/^minWidth|maxWidth$/) ? (s = parseInt(n, 10) || 0,
                i = s > 100 ? s : 100) : t.match(/^speed|width|shadow|ringwidth$/) ? (s = parseInt(n, 10) || 0,
                i = s > 0 ? s : 0) : (new RegExp("^" + o + "$")).test(t) || /^save|load|str2color|color2str$/.test(t) ? typeof n == "function" && (i = n) : t === "eventPrefix" && typeof n == "string" && /^\w*$/.test(n) && (i = n);
        return i
    }
    function G(e, n, r) {
        var i = 0, s = 0, o = n.originalEvent, u = o.touches || o.changedTouches, a, f;
        return e ? (a = r.parent().offset(),
        f = e.j.outerHeight()) : (a = r.offset(),
        f = 0),
        u ? (i = u[0].pageX - a.left,
        s = u[0].pageY - a.top - f) : o.clientX && (i = o.clientX + t.pageXOffset - a.left,
        s = o.clientY + t.pageYOffset - a.top - f),
        [i, s]
    }
    function Y(e) {
        return e.n.width()
    }
    function Z(e) {
        return e.n.height()
    }
    function et(e) {
        var t = e.i.height();
        e.g.height(t),
        e.h.css("top", "-" + t + "px").height(t);
        var n = e.g[0].getContext("2d");
        e.g[0].height = t,
        e.g[0].width = 500,
        e.g.css("width", "500px");
        var r = i.createElement("canvas");
        r.height = 10,
        r.width = 10;
        var s = r.getContext("2d");
        s[f] = "#ccc",
        s[a](0, 0, 10, 10),
        s[f] = "#888",
        s[a](0, 0, 5, 5),
        s[a](5, 5, 5, 5);
        var o = n.createPattern(r, "repeat");
        n[f] = o,
        n[a](0, 0, e.M, t)
    }
    function tt(e, t) {
        return e.each(t)
    }
    var i = t.document
      , s = "chromoselector"
      , o = "create|ready|update|destroy|show|beforeShow|hide|beforeHide|resize|resizeStart|resizeStop"
      , u = "addColorStop"
      , a = "fillRect"
      , f = "fillStyle"
      , l = "globalCompositeOperation"
      , c = "strokeStyle"
      , h = function() {
        return function(e, t) {
            t = t || 4;
            var n, r, i, s = function() {
                i ? (e.apply({}, r),
                i = 0,
                n = setTimeout(s, t)) : n = 0
            };
            return function() {
                r = arguments,
                i = 1,
                n || s()
            }
        }
    }()
      , p = function(e) {
        function n(e, t) {
            var n, r = {};
            for (n in e)
                e.hasOwnProperty(n) && (t ? r[n] = t(e[n]) : r[n] = e[n]);
            return r
        }
        function r(e) {
            return e + e
        }
        function i(e, t) {
            var n, r, i = t.split("");
            for (n in i)
                if (i.hasOwnProperty(n)) {
                    r = parseFloat(e[t[n]]);
                    if (isNaN(r) || r < 0 || r > 1)
                        return 0
                }
            return 1
        }
        function s(e) {
            var n, r, i = "", s = 0;
            for (; s < 4; s++)
                r = t(e[["r", "g", "b", "a"][s]] * 255),
                n = r.toString(16),
                r < 16 && (n = "0" + n),
                i += n;
            return "#" + i
        }
        function o(e) {
            var t = 0
              , n = {};
            for (; t < 4; t++)
                n[t] = parseInt("0x" + e.substring(t * 2 + 1, t * 2 + 3), 16) / 255;
            return {
                r: n[0],
                g: n[1],
                b: n[2],
                a: n[3]
            }
        }
        function u(t) {
            var n = t.r, r = t.g, i = t.b, s = e.max(n, r, i), o = e.min(n, r, i), u, a, f = (s + o) / 2;
            if (s === o)
                u = a = 0;
            else {
                var l = s - o;
                a = f > .5 ? l / (2 - s - o) : l / (s + o);
                switch (s) {
                case n:
                    u = (r - i) / l + (r < i ? 6 : 0);
                    break;
                case r:
                    u = (i - n) / l + 2;
                    break;
                case i:
                    u = (n - r) / l + 4
                }
                u /= 6
            }
            return {
                h: u,
                s: a,
                l: f,
                a: t.a
            }
        }
        function a(e) {
            var t, n, r;
            if (e.s === 0)
                t = n = r = e.l;
            else {
                var i = function(e, t, n) {
                    return n < 0 ? n += 1 : n > 1 && (n -= 1),
                    n < 1 / 6 ? e + (t - e) * 6 * n : n < .5 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e
                }, s;
                e.l < .5 ? s = e.l * (1 + e.s) : s = e.l + e.s - e.l * e.s;
                var o = 2 * e.l - s;
                t = i(o, s, e.h + 1 / 3),
                n = i(o, s, e.h),
                r = i(o, s, e.h - 1 / 3)
            }
            return {
                r: t,
                g: n,
                b: r,
                a: e.a
            }
        }
        function f(t) {
            if (t.r === t.g && t.g === t.b)
                return {
                    c: 0,
                    m: 0,
                    y: 0,
                    k: 1 - t.r
                };
            var n = e.min(1 - t.r, 1 - t.g, 1 - t.b);
            return {
                c: (1 - t.r - n) / (1 - n),
                m: (1 - t.g - n) / (1 - n),
                y: (1 - t.b - n) / (1 - n),
                k: n
            }
        }
        function l(t) {
            return {
                r: 1 - e.min(1, t.c * (1 - t.k) + t.k),
                g: 1 - e.min(1, t.m * (1 - t.k) + t.k),
                b: 1 - e.min(1, t.y * (1 - t.k) + t.k),
                a: 1
            }
        }
        function c(e) {
            for (var t = 0; t < e.length; t++)
                e[t].indexOf("%") !== -1 ? e[t] = e[t].substr(0, e[t].length - 1) / 100 : e[t] = e[t] / 255,
                e[t] > 1 && (e[t] = 1);
            return e
        }
        function h(e) {
            var t;
            return /^#([0-9a-f]{3}){1,2}$/i.test(e) ? (e.length === 4 && (e = e.replace(/[0-9a-f]/gi, r)),
            t = {
                r: o(e)
            },
            t.r.a = 1) : /^#([0-9a-f]{4}){1,2}$/i.test(e) && (e.length === 5 && (e = e.replace(/[0-9a-f]/gi, r)),
            t = {
                r: o(e)
            }),
            t
        }
        function p(e) {
            var t, n;
            t = e.match(/^rgba\((\d+%?),(\d+%?),(\d+%?),(\.\d+|\d+\.?\d*)\)$/);
            if (t && t.length === 5)
                return t.shift(),
                n = t.pop() / 1,
                n > 1 && (n = 1),
                t = c(t),
                {
                    r: {
                        r: t[0],
                        g: t[1],
                        b: t[2],
                        a: n
                    }
                }
        }
        function d(e) {
            var t;
            t = e.match(/^rgb\((\d+%?),(\d+%?),(\d+%?)\)$/);
            if (t && t.length === 4)
                return t.shift(),
                t = c(t),
                {
                    r: {
                        r: t[0],
                        g: t[1],
                        b: t[2],
                        a: 1
                    }
                }
        }
        function v(t) {
            var n, r, i;
            n = t.match(/^hsla\((-?\d+),(\d+%),(\d+%),(\.\d+|\d+\.?\d*)\)$/);
            if (n && n.length === 5)
                return n.shift(),
                i = n.shift() / 360,
                i -= e.floor(i),
                r = n.pop() / 1,
                r > 1 && (r = 1),
                n = c(n),
                {
                    h: {
                        h: i,
                        s: n[0],
                        l: n[1],
                        a: r
                    }
                }
        }
        function m(t) {
            var n, r;
            n = t.match(/^hsl\((-?\d+),(\d+%),(\d+%)\)$/);
            if (n && n.length === 4)
                return n.shift(),
                r = n.shift() / 360,
                r -= e.floor(r),
                n = c(n),
                {
                    h: {
                        h: r,
                        s: n[0],
                        l: n[1],
                        a: 1
                    }
                }
        }
        function g(e) {
            var t, n;
            t = e.match(/^device-cmyk\((\.\d+|\d+\.?\d*),(\.\d+|\d+\.?\d*),(\.\d+|\d+\.?\d*),(\.\d+|\d+\.?\d*)\)$/);
            if (t && t.length === 5) {
                t.shift();
                for (n = 0; n < t.length; n++)
                    t[n] = t[n] / 1,
                    t[n] > 1 && (t[n] = 1);
                return {
                    r: l({
                        c: t[0],
                        m: t[1],
                        y: t[2],
                        k: t[3]
                    })
                }
            }
        }
        function y(e) {
            var t;
            return e = e.replace(/\s+/g, ""),
            /^#/.test(e) ? t = h(e) : /^rgba/.test(e) ? t = p(e) : /^rgb/.test(e) ? t = d(e) : /^hsla/.test(e) ? t = v(e) : /^hsl/.test(e) ? t = m(e) : /^device-cmyk/.test(e) && (t = g(e)),
            t
        }
        function b(t) {
            var r, s;
            return t = n(t, parseFloat),
            i(t, "sl") && !isNaN(t.h) ? (t.h = t.h - e.floor(t.h),
            s = {
                h: t
            },
            r = 1,
            i(t, "a") && (r = t.a),
            s.h.a = r) : i(t, "rgb") ? (s = {
                r: t
            },
            r = 1,
            i(t, "a") && (r = t.a),
            s.r.a = r) : i(t, "cmyk") && (s = {
                r: l(t)
            }),
            s
        }
        function w(e) {
            var t;
            return typeof e == "string" ? t = y(e) : e instanceof N ? t = {
                r: e.getRgba(),
                h: e.getHsla()
            } : typeof e == "object" && (t = b(e)),
            t
        }
        function E(e) {
            return t(e * 100) / 100
        }
        function S(e) {
            return [t(e.r * 255), t(e.g * 255), t(e.b * 255), E(e.a)]
        }
        function x(e) {
            return [t(e.h * 360), t(e.s * 100) + "%", t(e.l * 100) + "%", E(e.a)]
        }
        function T(e) {
            return [E(e.c), E(e.m), E(e.y), E(e.k)]
        }
        function N(e) {
            var t = this
              , r = {
                r: 0,
                g: 0,
                b: 0,
                a: 1
            }
              , i = {
                h: 0,
                s: 0,
                l: 0,
                a: 1
            };
            t.getRgba = function() {
                return n(r)
            }
            ,
            t.getRgb = function() {
                var e = n(r);
                return delete e.a,
                e
            }
            ,
            t.getHsla = function() {
                return n(i)
            }
            ,
            t.getHsl = function() {
                var e = n(i);
                return delete e.a,
                e
            }
            ,
            t.getCmyk = function() {
                return f(r)
            }
            ,
            t.getRgbaString = function() {
                return "rgba(" + S(r).join() + ")"
            }
            ,
            t.getRgbString = function() {
                var e = S(r);
                return e.pop(),
                "rgb(" + e.join() + ")"
            }
            ,
            t.getHexaString = function() {
                return s(r)
            }
            ,
            t.getHexString = function() {
                return s(r).substring(0, 7)
            }
            ,
            t.getHslaString = function() {
                return "hsla(" + x(i).join() + ")"
            }
            ,
            t.getHslString = function() {
                var e = x(i);
                return e.pop(),
                "hsl(" + e.join() + ")"
            }
            ,
            t.getCmykString = function() {
                var e = T(f(r));
                return "device-cmyk(" + e.join() + ")"
            }
            ,
            t.getTextColor = function() {
                var e = r.r * .2126 + r.g * .7152 + r.b * .0722;
                return new N(e < .35 ? "#fff" : "#000")
            }
            ,
            t.setColor = function(e) {
                var n = w(e);
                return n && (n.r && n.h ? (r = n.r,
                i = n.h) : n.r ? (r = n.r,
                i = u(n.r)) : (r = a(n.h),
                i = n.h)),
                t
            }
            ,
            t.setAlpha = function(e) {
                return e = parseFloat(e),
                !isNaN(e) && e >= 0 && e <= 1 && (r.a = e,
                i.a = e),
                t
            }
            ,
            t.getAlpha = function() {
                return r.a
            }
            ,
            t.setColor(e)
        }
        var t = e.round;
        return N
    }(n)
      , d = function() {
        return function(r, o, l, d, v, m, g, y, b, w, E) {
            var S = this
              , x = function() {
                var e = B;
                return d && (e += g + y),
                v ? B + g : I === "cmyk" ? e + g * 4 + y * 3 : e + g * 3 + y * 2
            }
              , T = function(t, n, r) {
                var i = e.extend({}, t);
                return i[n] = r,
                new p(i)
            }
              , N = function() {
                return et.createLinearGradient(0, J - g / 2 - 10, 0, g / 2 + 10)
            }
              , C = function(e, t) {
                j = N(),
                j[u](0, e.getHexString()),
                j[u](1, t.getHexString()),
                et[c] = j
            }
              , k = function() {
                j = N(),
                j[u](0, "#f00"),
                j[u](1 / 6, "#ff0"),
                j[u](2 / 6, "#0f0"),
                j[u](.5, "#0ff"),
                j[u](4 / 6, "#00f"),
                j[u](5 / 6, "#f0f"),
                j[u](1, "#f00"),
                et[c] = j
            }
              , L = function(e) {
                j = N(),
                j[u](0, "#000"),
                j[u](.5, e.getHexString()),
                j[u](1, "#fff"),
                et[c] = j
            }
              , A = function(e) {
                j = N(),
                j[u](0, e.getHexString()),
                j[u](1, "#000"),
                et[c] = j
            }
              , O = function() {
                et.clearRect(0, 0, x(), J),
                D();
                var t, n, r, s, o, l, h = 10, m = 0, b = function() {
                    et.beginPath(),
                    et.moveTo(h + g / 2, g / 2 + 10),
                    et.lineTo(h + g / 2, J - g / 2 - 10),
                    et.lineWidth = g,
                    et.lineCap = "round",
                    et.stroke()
                };
                if (d) {
                    var w = i.createElement("canvas");
                    w.height = 10,
                    w.width = 10;
                    var E = w.getContext("2d");
                    E[f] = "#ccc",
                    E[a](0, 0, 10, 10),
                    E[f] = "#888",
                    E[a](0, 0, 5, 5),
                    E[a](5, 5, 5, 5);
                    var S = et.createPattern(w, "repeat");
                    et[c] = S,
                    b(),
                    j = N(),
                    j[u](0, (new p(F)).setAlpha(0).getRgbaString()),
                    j[u](1, F.getHexString()),
                    et[c] = j,
                    b(),
                    h += g + y,
                    m = 1
                }
                v ? M() : I === "rgb" ? (e.each(q, function(e, t) {
                    n = T(F.getRgb(), t, 0),
                    r = T(F.getRgb(), t, 1),
                    C(n, r),
                    b(),
                    h += g + y,
                    m++
                }),
                M(F.getRgb())) : I === "hsl" ? (k(),
                b(),
                m++,
                h += g + y,
                n = T(F.getHsl(), "s", 0),
                r = T(F.getHsl(), "s", 1),
                C(n, r),
                b(),
                m++,
                h += g + y,
                s = e.extend({}, F.getHsl()),
                s.l = .5,
                L(new p(s)),
                b(),
                M(F.getHsl())) : I === "cmyk" && (e.each("cmy".split(""), function(e, t) {
                    n = T(F.getCmyk(), t, 0),
                    r = T(F.getCmyk(), t, 1),
                    C(n, r),
                    b(),
                    h += g + y,
                    m++
                }),
                o = e.extend({}, F.getCmyk()),
                o.k = 0,
                o = new p(o),
                A(o),
                b(),
                M(F.getCmyk()))
            }
              , M = function(t) {
                var r = 10, i, s, o, u, a = function(e, t, r) {
                    et[c] = e,
                    et.lineWidth = t,
                    et.beginPath(),
                    et.arc(s, o, r, 0, n.PI * 2, !0),
                    et.closePath(),
                    et.stroke()
                };
                d && (s = r + g / 2,
                u = J - g - 20,
                o = u - u * F.getAlpha() + g / 2 + 10,
                r += g + y,
                a("#fff", 1.5, 6),
                a("#000", 2, 4.5)),
                v || e.each(t, function(e, t) {
                    s = r + g / 2,
                    u = J - g - 20,
                    o = u - u * t + g / 2 + 10,
                    a("#fff", 1.5, 6),
                    a("#000", 2, 4.5),
                    r += g + y
                })
            }
              , _ = function(e) {
                et.shadowColor = E,
                et.shadowBlur = w,
                et.beginPath(),
                et.moveTo(e, g / 2 + 10),
                et.lineTo(e, J - g / 2 - 10),
                et.lineWidth = g - 2,
                et[c] = "rgba(0,0,0,1)",
                et.lineCap = "round",
                et.stroke(),
                et.shadowBlur = 0
            }
              , D = function() {
                if (w > 0) {
                    var t, n = 10, r;
                    d && (t = n + g / 2,
                    _(t),
                    n += g + y),
                    v || e.each(q, function() {
                        t = n + g / 2,
                        _(t),
                        n += g + y
                    })
                }
            }
              , P = function() {
                var t = 0;
                d || v ? Q.append(e("<div />").text("A").width(g).css({
                    "padding-left": 10
                })) : v || (Q.append(e("<div />").text(q[0].toUpperCase()).width(g).css({
                    "padding-left": 10
                })),
                t++);
                if (!v)
                    for (; t < q.length; t++)
                        Q.append(e("<div />").text(q[t].toUpperCase()).width(g).css({
                            "padding-left": y
                        }))
            }
              , H = h(function(e) {
                var t = G(!1, e, K)
                  , i = J - g - B
                  , o = i - n.round(t[1] - g / 2 - B / 2);
                o < 0 ? o = 0 : o > i && (o = i);
                var u = o / i;
                if (d && U === 0)
                    F.setAlpha(u);
                else if (!v) {
                    var a = U;
                    d && a--;
                    var f = "get" + I.charAt(0).toUpperCase() + I.slice(1)
                      , l = F[f]();
                    l[q[a]] = u,
                    l.a = F.getAlpha(),
                    F = new p(l)
                }
                O(),
                r.trigger(s + "." + s)
            });
            S.getColor = function() {
                return F
            }
            ,
            S.getWidth = function() {
                return x()
            }
            ,
            S.setAlpha = function(e) {
                return F.setAlpha(e),
                S
            }
            ,
            S.setColor = function(e) {
                return F = new p(e),
                O(),
                S
            }
            ,
            S.setHeight = function(e) {
                return et.clearRect(0, 0, x(), J),
                Y = Q.outerHeight(!0),
                X.width(x() - 20),
                J = e - X.outerHeight(!0) - Y,
                K.attr("height", J),
                O(),
                S
            }
            ,
            S.setMode = function(t) {
                return e.inArray(t, W) >= 0 && (X.val(t),
                I = t,
                q = t.split(""),
                K.attr("width", x()),
                O(),
                b && (Q.width(x()).children().remove(),
                P()),
                X.width(x() - 20)),
                S
            }
            ;
            var B = 20, j, F = new p, I = "rgb", q = I.split(""), R = 0, U = 0, z = 0, W = ["rgb", "hsl", "cmyk"], X = e("<select/>");
            if (!v && l.length) {
                var $ = "<option/>";
                e.each(l, function(t, n) {
                    X.append(e($).html(n))
                }),
                r.append(X),
                z = X.outerHeight(!0)
            }
            var J = m - z
              , K = e("<canvas/>").attr("width", x()).attr("height", J).css("display", "block");
            r.append(K);
            var Q = e()
              , Y = 0;
            b && (Q = e("<div />").addClass("ui-panel-labels").width(x()),
            P(),
            r.append(Q));
            var Z = K[0]
              , et = Z.getContext("2d");
            S.setMode(o),
            v || X.change(function() {
                S.setMode(e(":selected", this).val())
            }),
            r.add(Q.find("div")).bind("mousedown touchstart", function(t) {
                e(this).is(t.target) && V(t)
            }),
            K.bind("mousedown touchstart", function(t) {
                V(t),
                U = 0;
                var n = 10
                  , r = G(!1, t, e(this));
                while (U < 5 && !R)
                    r[0] > n && r[0] < n + g ? (R = 1,
                    H(t)) : (U++,
                    n += g + y)
            }).bind("mousemove touchmove", function(e) {
                var t = G(!1, e, K)
                  , n = K.width()
                  , r = B / 2;
                if (t[0] > r && t[1] > r && t[0] < n - r && t[1] < K.height() - r) {
                    var i = r;
                    while (i < n) {
                        if (t[0] > i && t[0] < g + i) {
                            K.css("cursor", "crosshair");
                            break
                        }
                        K.css("cursor", ""),
                        i += g + y
                    }
                } else
                    K.css("cursor", "")
            }),
            e([t, i]).bind("mousemove touchmove", function(e) {
                R && (V(e),
                H(e))
            }).bind("mouseup touchend", function(e) {
                R && (V(e),
                R = 0,
                H(e))
            })
        }
    }()
      , T = {}
      , nt = function(r, o) {
        var u = this;
        u.z = 0,
        u.a = o,
        u.w = 0,
        u.u = h(M),
        u.y = 0,
        u.x = h(I),
        u.B = 0,
        u.A = h(z),
        u.D = h(D, 100),
        u.E = h(function(e, t) {
            e.Color.setColor(t),
            k(e),
            L(e),
            e.D(e)
        }),
        u.a.ringwidth > u.a.minWidth / 4 && (u.a.ringwidth = n.floor(u.a.minWidth / 4)),
        u.I = 0,
        u.J = 0,
        u.e = r,
        H(u),
        u.M = J(u, u.a.width),
        u.G = u.a.ringwidth,
        u.H = u.M / 2 - u.G / 2 - 10,
        u.r = u.M / 2 - 15 - u.a.ringwidth;
        var a = '<canvas width="' + u.M + '" height="' + u.M + '"></canvas>'
          , f = "";
        u.a.target && u.a.target.length ? (u.F = 1,
        u.c = u.a.target,
        f = "ui-cs-static") : (u.F = 0,
        u.c = e("<div/>").prependTo("body").css({
            width: 0,
            height: 0,
            position: "absolute",
            overflow: "visible"
        })),
        u.d = e("<div/>").addClass("ui-cs-widget").css({
            position: "relative"
        }).width(u.M).height(u.M).html(a + a + a + a),
        u.b = e("<div/>").append(u.d).width(u.M).addClass("ui-cs-container"),
        u.m = e("<div/>").addClass("ui-cs-supercontainer").append(u.b),
        u.n = e("<div/>").addClass("ui-cs-chromoselector").addClass(u.a.pickerClass).addClass(f).append(u.m);
        if (u.a.panel || u.a.panelAlpha)
            u.k = e("<div/>").addClass("ui-cs-panel"),
            u.m.append(u.k),
            u.o = new d(u.k,u.a.panelMode,u.a.panelModes,u.a.panelAlpha,!u.a.panel,100,u.a.panelChannelWidth,u.a.panelChannelMargin,!0,u.a.shadow,u.a.shadowColor),
            u.o.setColor(u.Color),
            u.k.bind(s + "." + s, function() {
                u.E(u, u.o.getColor().getHsla())
            }),
            u.e.bind(u.a.eventPrefix + "update." + s, function() {
                u.o.setColor(u.Color)
            }),
            u.k.find("select").bind("blur." + s, function() {
                u.F || j(u)
            }).bind("change." + s, function() {
                u.n.width(u.o.getWidth() + u.b.width())
            });
        u.a.icon ? (u.f = e("<a/>", {
            href: "#",
            tabindex: "999"
        }).addClass("ui-cs-icon").css("position", "absolute").append(e("<img/>", {
            alt: u.a.iconalt,
            src: u.a.icon
        }).load(function() {
            e(this).parent().height(e(this).height()),
            e(this).parent().width(e(this).width()),
            K(u)
        })),
        u.c.append(u.f)) : u.f = e([]),
        u.a.resizable && (u.l = e("<canvas />").height(20).width(20).attr("height", 20).attr("width", 20).addClass("ui-cs-resizer").css({
            position: "absolute",
            bottom: "0px",
            right: "0px"
        }),
        A(u, u.l[0]),
        u.m.append(u.l)),
        u.m.append(e("<div/>").css("clear", "both")),
        u.i = e("<div/>").addClass("ui-cs-preview-widget").css("overflow", "hidden");
        var l = new p(u.a.shadowColor);
        l.setAlpha(l.getAlpha() - .1);
        var c = "0 0 " + n.max(0, u.a.shadow - 2) + "px 0 " + l.getRgbaString();
        u.j = e("<div/>").addClass("ui-cs-preview-container").append(u.i.append(e("<canvas/>").css({
            display: "block"
        })).css("box-shadow", c).css("-webkit-box-shadow", c)),
        u.a.preview && u.b.prepend(u.j),
        u.h = e("<div/>").addClass("ui-cs-preview-color").css("width", "100%").css("background-color", u.Color.getRgbaString()).css("position", "relative"),
        u.i.append(u.h),
        u.g = u.i.find("canvas"),
        et(u),
        $(u),
        u.d.height(u.M).add(u.b).width(u.M),
        u.a.panel || u.a.panelAlpha ? u.n.width(u.o.getWidth() + u.b.width()) : u.n.width(u.b.width()),
        u.c.append(u.n.hide()),
        u.s = u.d.find("canvas").css({
            position: "absolute",
            width: "100%",
            height: "100%"
        }),
        u.t = e(a)[0],
        u.L = "fade",
        u.a.effect === "slide" && (u.L = "slide");
        if (u.a.autoshow) {
            u.a.lazy ? u.e.bind("mouseover." + s, function() {
                u.z || U(u),
                u.e.unbind("mouseover." + s)
            }) : U(u);
            var v = u.e;
            u.f.length && (v = u.f),
            v.bind("focus." + s + " click." + s, function(e) {
                V(e),
                u.z || U(u),
                B(u)
            }).bind("blur." + s, function() {
                j(u)
            }),
            u.e.bind("keydown." + s, function(e) {
                e.keyCode === 27 && j(u)
            })
        }
        u.e.bind("keyup." + s, function() {
            H(u),
            k(u),
            L(u),
            u.e.trigger(u.a.eventPrefix + "update")
        }),
        u.a.resizable && u.l.bind("mousedown." + s + " touchstart." + s, function(e) {
            V(e);
            var t = G(u, e, u.d);
            u.e.trigger(u.a.eventPrefix + "resizeStart"),
            u.B = 1,
            u.C = [u.M - t[0], u.M - t[1]]
        }),
        u.b.bind("mousedown." + s + " touchstart." + s, function(e) {
            V(e);
            var t = G(u, e, u.d);
            if (m(t, u.M / 2, u.H + u.G) && !m(t, u.M / 2, u.H - u.G))
                u.w = 1,
                u.u(u, e);
            else {
                var r = (1 - u.Color.getHsl().h) * n.PI * 2
                  , i = O(u, r);
                g(t, i[0], i[1], i[2]) && (u.y = 1,
                u.x(u, e))
            }
        }).bind("mousemove." + s + " touchmove." + s, function(e) {
            var t = G(u, e, u.d);
            if (m(t, u.M / 2, u.H + u.G / 2) && !m(t, u.M / 2, u.H - u.G / 2))
                u.d.css("cursor", "crosshair");
            else {
                var r = (1 - u.Color.getHsl().h) * n.PI * 2
                  , i = O(u, r);
                g(t, i[0], i[1], i[2]) ? u.d.css("cursor", "crosshair") : u.d.css("cursor", "")
            }
        }),
        e([t, i]).bind("mousemove touchmove", function(e) {
            u.w ? (V(e),
            u.u(u, e)) : u.y ? (V(e),
            u.x(u, e)) : u.B && (V(e),
            u.A(u, e))
        }).bind("mouseup touchend", function(e) {
            u.w ? (V(e),
            u.w = 0,
            M(u, e)) : u.y ? (V(e),
            u.y = 0,
            I(u, e)) : u.B && (V(e),
            u.B = 0,
            X(u, u.d.width()),
            K(u),
            u.e.trigger(u.a.eventPrefix + "resizeStop"))
        }).bind("resize scroll", function(e) {
            (e.target === t || e.target === i) && K(u)
        }),
        setTimeout(function() {
            K(u)
        }, 4)
    }
      , rt = {
        init: function(t) {
            var n = {};
            return t = t ? t : {},
            e.each(r, function(e) {
                n[e] = Q(e, t[e])
            }),
            tt(this, function() {
                var t = e(this);
                if (!t.data(s)) {
                    t.data(s, new nt(t,n));
                    var r = o.split("|");
                    e.each(r, function(e) {
                        var i = r[e]
                          , o = n[i];
                        typeof o == "function" && t.bind(n.eventPrefix + i + "." + s, o)
                    }),
                    t.trigger(n.eventPrefix + "create")
                }
            })
        },
        show: function(t) {
            return tt(this, function() {
                B(e(this).data(s), t)
            })
        },
        hide: function(t) {
            return tt(this, function() {
                j(e(this).data(s), t)
            })
        },
        toggle: function(t) {
            return tt(this, function() {
                F(e(this).data(s), t)
            })
        },
        save: function() {
            return tt(this, function() {
                P(e(this).data(s))
            })
        },
        load: function() {
            return tt(this, function() {
                H(e(this).data(s), 1)
            })
        },
        setColor: function(t) {
            return tt(this, function() {
                var n = e(this).data(s);
                n.E(n, t)
            })
        },
        getColor: function() {
            return this.data(s).Color
        },
        getWidth: function() {
            return Y(e(this).data(s))
        },
        getHeight: function() {
            return Z(e(this).data(s))
        },
        resize: function(t) {
            return tt(this, function() {
                var n = e(this).data(s);
                n.e.trigger(n.a.eventPrefix + "resizeStart"),
                X(n, t),
                K(n),
                n.e.trigger(n.a.eventPrefix + "resize").trigger(n.a.eventPrefix + "resizeStop")
            })
        },
        reflow: function() {
            return tt(this, function() {
                K(e(this).data(s))
            })
        },
        api: function() {
            var e = {}
              , t = this;
            return e.show = function(e) {
                return rt.show.call(t, e),
                this
            }
            ,
            e.hide = function(e) {
                return rt.hide.call(t, e),
                this
            }
            ,
            e.toggle = function(e) {
                return rt.toggle.call(t, e),
                this
            }
            ,
            e.save = function() {
                return rt.save.call(t),
                this
            }
            ,
            e.load = function() {
                return rt.load.call(t),
                this
            }
            ,
            e.getColor = function() {
                return rt.getColor.call(t)
            }
            ,
            e.getWidth = function() {
                return rt.getWidth.call(t)
            }
            ,
            e.getHeight = function() {
                return rt.getHeight.call(t)
            }
            ,
            e.setColor = function(e) {
                return rt.setColor.call(t, e),
                this
            }
            ,
            e.destroy = function() {
                rt.destroy.call(t)
            }
            ,
            e.resize = function(e) {
                return rt.resize.call(t, e),
                this
            }
            ,
            e.reflow = function() {
                return rt.reflow.call(t),
                this
            }
            ,
            e
        },
        destroy: function() {
            return tt(this, function() {
                var t = e(this).data(s)
                  , n = t.a.eventPrefix;
                t.F ? t.b.siblings().length ? t.b.remove() : t.c.remove() : t.c.remove(),
                t.e.add(t.f).add(t.l).add(t.b).unbind("." + s);
                for (var r in t)
                    delete t[r];
                e(this).removeData(s).trigger(n + "destroy").unbind("." + s)
            })
        }
    };
    e.fn[s] = function(t) {
        var n = 1;
        try {
            var r = i.createElement("canvas")
              , o = r.getContext("2d");
            o.createImageData(5, 5)
        } catch (u) {
            n = 0
        }
        if (!n)
            return t === "getColor" ? new p : t === "getWidth" || t === "getHeight" ? 0 : this;
        if (rt[t])
            return rt[t].apply(this, Array.prototype.slice.call(arguments, 1));
        if (typeof t == "object" || !t)
            return rt.init.apply(this, arguments);
        e.error("Method " + t + " does not exist on jQuery." + s)
    }
    ,
    e.fn[s].defaults = function(e, t) {
        return typeof t == "undefined" ? r[e] : (r[e] = Q(e, t),
        this)
    }
    ,
    e.fn[s].Color = p
}
)(jQuery, window, Math, {
    autoshow: !0,
    autosave: !0,
    pickerClass: "",
    speed: 400,
    minWidth: 120,
    maxWidth: 400,
    width: 180,
    ringwidth: 18,
    resizable: !0,
    shadow: 6,
    shadowColor: "rgba(0,0,0,0.6)",
    preview: !0,
    panel: !1,
    panelAlpha: !1,
    panelChannelWidth: 18,
    panelChannelMargin: 12,
    panelMode: "rgb",
    panelModes: ["rgb", "hsl", "cmyk"],
    roundcorners: !0,
    effect: "fade",
    icon: null,
    iconalt: "Open Color Picker",
    iconpos: "right",
    lazy: !0,
    target: null,
    eventPrefix: "",
    create: null,
    ready: null,
    destroy: null,
    update: null,
    beforeShow: null,
    show: null,
    beforeHide: null,
    hide: null,
    resize: null,
    resizeStart: null,
    resizeStop: null,
    save: null,
    load: null,
    str2color: null,
    color2str: null
});
