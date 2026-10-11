import { WORLD, PLATFORMS } from "./engine.mjs";
const TAU = Math.PI * 2;
export function renderer(canvas) {
  const c = canvas.getContext("2d");
  const rect = (x, y, w, h, color, r = 0) => {
    c.fillStyle = color;
    c.beginPath();
    c.roundRect(x, y, w, h, r);
    c.fill();
  };
  const line = (points, color, width = 2) => {
    c.strokeStyle = color;
    c.lineWidth = width;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    points.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.stroke();
  };
  const circle = (x, y, r, color) => {
    c.fillStyle = color;
    c.beginPath();
    c.arc(x, y, r, 0, TAU);
    c.fill();
  };
  const poly = (points, color) => {
    c.fillStyle = color;
    c.beginPath();
    points.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.closePath();
    c.fill();
  };
  const star = (x, y, r, color) => {
    const p = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5,
        rr = i % 2 ? r * 0.43 : r;
      p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
    }
    poly(p, color);
  };
  function building(x, y, w, h, shade = "#53677f") {
    rect(x, y, w, h, shade, 4);
    rect(x - 8, y - 10, w + 16, 13, "#6d829c", 3);
    for (let col = 0; col < Math.floor(w / 35); col++)
      for (let row = 0; row < Math.floor(h / 48); row++) {
        const lit = (row + col) % 3 !== 0;
        rect(
          x + 13 + col * 35,
          y + 17 + row * 48,
          15,
          23,
          lit ? "#f4d59b" : "#40536d",
          2,
        );
        if (lit)
          rect(x + 15 + col * 35, y + 19 + row * 48, 11, 8, "#ffedc0", 1);
      }
    rect(x + w * 0.43, y + h - 45, 25, 45, "#303e56");
  }
  function tree(x, y, size) {
    rect(x - 6, y - 45, 12, 50, "#55516a", 2);
    circle(x, y - 70, size, "#36516b");
    circle(x - size * 0.45, y - 58, size * 0.75, "#405f76");
    circle(x + size * 0.48, y - 58, size * 0.7, "#466b81");
    circle(x - 6, y - 81, size * 0.72, "#52768a");
  }
  function lamp(x) {
    line(
      [
        [x, 558],
        [x, 338],
        [x + 34, 338],
      ],
      "#435670",
      6,
    );
    rect(x + 22, 334, 28, 9, "#d9c798", 3);
    const glow = c.createRadialGradient(x + 35, 350, 0, x + 35, 350, 88);
    glow.addColorStop(0, "#ffde9a28");
    glow.addColorStop(1, "#ffde9a00");
    circle(x + 35, 350, 88, glow);
  }
  function decor(g) {
    const sky = c.createLinearGradient(0, 0, 0, 558);
    sky.addColorStop(0, "#61799e");
    sky.addColorStop(0.6, "#b6a8b4");
    sky.addColorStop(1, "#efc3aa");
    rect(0, 0, 1280, 660, sky);
    const sun = c.createRadialGradient(
      1020 - g.camera * 0.05,
      110,
      0,
      1020 - g.camera * 0.05,
      110,
      165,
    );
    sun.addColorStop(0, "#ffe6bd88");
    sun.addColorStop(1, "#ffe6bd00");
    circle(1020 - g.camera * 0.05, 110, 165, sun);
    circle(1020 - g.camera * 0.05, 110, 39, "#ffe8c4");
    for (let i = 0; i < 9; i++) {
      const x = ((((i * 235 - g.camera * 0.13) % 1600) + 1600) % 1600) - 100;
      rect(x, 75 + (i % 3) * 40, 90 + (i % 2) * 50, 10, "#d5c6c7", 8);
      rect(x + 20, 65 + (i % 3) * 40, 75, 18, "#d5c6c7", 10);
    }
    c.save();
    c.translate(-g.camera * 0.25, 0);
    for (let i = 0; i < 18; i++) {
      let h = 95 + ((i * 43) % 110);
      building(i * 143 - 70, 425 - h, 110, h, "#718096");
    }
    c.restore();
    c.save();
    c.translate(-g.camera * 0.65, 0);
    for (let i = 0; i < 20; i++) tree(i * 245 + 180, 529, 44 + (i % 3) * 7);
    rect(0, 506, 4800, 24, "#64767d");
    line(
      [
        [0, 507],
        [4800, 507],
      ],
      "#a1aaa5",
      4,
    );
    c.restore();
    c.save();
    c.translate(-g.camera, 0);
    building(105, 177, 219, 381);
    rect(113, 151, 205, 29, "#748499", 4);
    rect(138, 119, 36, 35, "#677b93", 3);
    line(
      [
        [262, 150],
        [262, 112],
      ],
      "#697d91",
      3,
    );
    rect(600, 497, 1850, 61, "#c9ad71", 7);
    rect(610, 507, 1830, 45, "#d7bf80", 4);
    line(
      [
        [610, 553],
        [2440, 553],
      ],
      "#f4d993",
      4,
    );
    // Deux balançoires, construction brune fidèle à la description.
    line(
      [
        [880, 550],
        [950, 326],
        [1230, 326],
        [1300, 550],
      ],
      "#775a4e",
      12,
    );
    line(
      [
        [944, 329],
        [872, 549],
      ],
      "#a08061",
      5,
    );
    line(
      [
        [1235, 329],
        [1307, 549],
      ],
      "#a08061",
      5,
    );
    line(
      [
        [945, 326],
        [1240, 326],
      ],
      "#aa8260",
      13,
    );
    for (const x of [1012, 1150]) {
      const sway = Math.sin(g.time * 0.8 + (x === 1012 ? 0 : 1)) * 0.06;
      c.save();
      c.translate(x, 332);
      c.rotate(sway);
      line(
        [
          [-22, 0],
          [-22, 151],
        ],
        "#606978",
        2,
      );
      line(
        [
          [22, 0],
          [22, 151],
        ],
        "#606978",
        2,
      );
      rect(-31, 150, 62, 10, "#6d5048", 4);
      rect(-29, 149, 58, 3, "#a17b5d");
      c.restore();
    }
    // Toboggan bleu et échelle grise.
    line(
      [
        [1495, 550],
        [1580, 373],
        [1635, 373],
      ],
      "#9eacb8",
      9,
    );
    for (let i = 0; i < 6; i++)
      line(
        [
          [1508 + i * 12, 521 - i * 25],
          [1545 + i * 11, 521 - i * 25],
        ],
        "#ccd3d2",
        5,
      );
    poly(
      [
        [1618, 375],
        [1650, 375],
        [1745, 498],
        [1820, 528],
        [1820, 546],
        [1730, 522],
        [1635, 394],
      ],
      "#409be0",
    );
    line(
      [
        [1640, 372],
        [1741, 504],
        [1820, 534],
      ],
      "#7bc9ed",
      8,
    );
    line(
      [
        [1625, 384],
        [1726, 514],
        [1814, 549],
      ],
      "#256bb2",
      5,
    );
    line(
      [
        [1655, 400],
        [1655, 553],
      ],
      "#819cac",
      7,
    );
    rect(1595, 361, 54, 14, "#57b9ed", 5);
    // Maison claire et toit orange.
    rect(2020, 368, 272, 190, "#e4d9c0", 5);
    poly(
      [
        [1996, 372],
        [2156, 250],
        [2315, 372],
      ],
      "#c57957",
    );
    poly(
      [
        [2020, 366],
        [2156, 268],
        [2292, 366],
      ],
      "#db9166",
    );
    line(
      [
        [1996, 371],
        [2156, 250],
        [2315, 372],
      ],
      "#8e594c",
      8,
    );
    rect(2086, 326, 36, 35, "#f5d995", 3);
    rect(2060, 403, 51, 56, "#806d65", 3);
    rect(2065, 408, 41, 46, "#f6d897", 1);
    line(
      [
        [2085, 408],
        [2085, 454],
      ],
      "#a88b65",
      3,
    );
    line(
      [
        [2065, 431],
        [2106, 431],
      ],
      "#a88b65",
      3,
    );
    rect(2204, 403, 51, 56, "#806d65", 3);
    rect(2209, 408, 41, 46, "#f6d897", 1);
    line(
      [
        [2229, 408],
        [2229, 454],
      ],
      "#a88b65",
      3,
    );
    rect(2131, 468, 54, 90, "#4d525f", 3);
    rect(2137, 476, 42, 68, "#646571", 2);
    circle(2171, 514, 3, "#dec68d");
    rect(2241, 283, 20, 45, "#c6bba9", 3);
    for (const x of [480, 1410, 2450, 2770, 3260]) lamp(x);
    for (const x of [700, 1875, 2370]) {
      line(
        [
          [x, 520],
          [x, 558],
          [x + 93, 558],
          [x + 93, 520],
        ],
        "#49546a",
        5,
      );
      rect(x - 10, 491, 112, 15, "#8b715c", 3);
      rect(x - 10, 513, 112, 12, "#a0876b", 3);
    }
    // Arène du bouffon : pavillon festif abandonné.
    rect(2810, 360, 480, 195, "#5f677d", 6);
    poly(
      [
        [2765, 362],
        [3050, 212],
        [3335, 362],
      ],
      "#654c70",
    );
    poly(
      [
        [2765, 362],
        [3050, 212],
        [2900, 362],
      ],
      "#aa5b78",
    );
    poly(
      [
        [3010, 362],
        [3050, 212],
        [3190, 362],
      ],
      "#4d86a0",
    );
    poly(
      [
        [3190, 362],
        [3050, 212],
        [3335, 362],
      ],
      "#c59060",
    );
    rect(2840, 392, 420, 166, "#303d58");
    for (const x of [2830, 2930, 3030, 3130, 3230]) {
      line(
        [
          [x, 360],
          [x + 45, 410],
          [x + 90, 360],
        ],
        "#d7a35f",
        2,
      );
      circle(x + 45, 410, 5, "#ffe3a5");
    }
    rect(2954, 296, 185, 37, "#353a58", 6);
    c.fillStyle = "#efc39d";
    c.font = "bold 14px system-ui";
    c.textAlign = "center";
    c.fillText("LE BOUFFON", 3047, 320);
    rect(0, 558, WORLD.width, 102, "#39465a");
    rect(0, 558, WORLD.width, 10, "#c6b68a");
    rect(0, 568, WORLD.width, 5, "#516478");
    for (let i = 0; i < 80; i++) {
      rect(i * 52, 597, 37, 3, "#4c5b6f", 2);
      line(
        [
          [i * 86, 575],
          [i * 86, 654],
        ],
        "#303d50",
        1,
      );
    }
    rect(0, 632, WORLD.width, 28, "#2e394d");
    for (const p of PLATFORMS) {
      rect(p.x, p.y, p.w, p.h, "#405b74", 5);
      rect(p.x + 3, p.y, p.w - 6, 5, "#89bbc5", 3);
      for (let i = 0; i < p.w / 22; i++)
        rect(p.x + 8 + i * 22, p.y + 8, 9, 4, "#55788e", 1);
    }
    if (!g.bossActive) {
      rect(2768, 380, 7, 178, "#6fd8f455", 4);
      for (let i = 0; i < 5; i++)
        line(
          [
            [2765, 390 + i * 34],
            [2780, 410 + i * 34],
          ],
          "#86dfff",
          3,
        );
    }
    if (g.portal) {
      c.save();
      c.translate(3300, 493);
      c.scale(0.65, 1);
      const glow = c.createRadialGradient(0, 0, 10, 0, 0, 88);
      glow.addColorStop(0, "#99ffd3aa");
      glow.addColorStop(1, "#76fbc300");
      circle(0, 0, 88, glow);
      c.strokeStyle = "#88efc6";
      c.lineWidth = 7;
      c.beginPath();
      c.ellipse(0, 0, 44, 61, 0, 0, TAU);
      c.stroke();
      circle(0, 0, 36, "#86ffd433");
      c.restore();
    }
    c.restore();
  }
  function hero(h, t) {
    c.save();
    c.translate(h.x + h.w / 2, h.y + h.h);
    c.scale(h.facing, 1);
    if (h.invulnerable > 0 && Math.floor(t * 15) % 2) c.globalAlpha = 0.5;
    const color = h.invisible > 0 ? "#4ad5a1" : "#328ee0",
      shade = h.invisible > 0 ? "#218c72" : "#1c5c9c";
    circle(0, 1, 22, "#15243733");
    // Quatre tentacules segmentés avec pointes.
    for (let i = 0; i < 4; i++) {
      const side = i < 2 ? -1 : 1,
        baseY = -45 + (i % 2) * 10;
      const reach = h.tentacle > 0 && side > 0 ? 180 : 43;
      let points = [];
      for (let j = 0; j <= 9; j++) {
        const u = j / 9;
        const x = side * (9 + u * reach),
          y = baseY + Math.sin(u * 4 + t * 3 + i) * 15 + u * (i % 2 ? 20 : -25);
        points.push([x, y]);
      }
      line(points, "#553c8d", 9);
      line(points, "#a481e4", 5);
      points.forEach(([x, y], j) => {
        if (j > 0 && j < 9) circle(x, y, 3.8, j % 2 ? "#a389da" : "#7851b8");
      });
      const [x, y] = points.at(-1);
      poly(
        [
          [x - 5, y - 4],
          [x + side * 12, y - 5],
          [x, y + 5],
        ],
        "#c0a4f3",
      );
    }
    const stride = h.onGround && h.vx ? Math.sin(h.anim) * 9 : 0;
    line(
      [
        [-7, -24],
        [-9 - stride, -7],
        [-12 - stride, 0],
      ],
      shade,
      11,
    );
    line(
      [
        [7, -24],
        [9 + stride, -7],
        [14 + stride, 0],
      ],
      color,
      11,
    );
    rect(-20 - stride, -4, 17, 7, "#163e6a", 3);
    rect(6 + stride, -4, 17, 7, "#163e6a", 3);
    rect(-17, -56, 34, 35, color, 10);
    rect(-15, -31, 30, 6, "#243e6b", 2);
    rect(-4, -31, 8, 6, "#f2c86f", 2);
    star(0, -44, 12, "#ed516c");
    line(
      [
        [-16, -50],
        [-24, -32],
        [-23, -23],
      ],
      shade,
      10,
    );
    line(
      [
        [16, -50],
        [24, -36],
        [29, -36],
      ],
      color,
      10,
    );
    circle(29, -36, 6, "#e7bb9e");
    circle(-23, -23, 5, "#e7bb9e");
    rect(-12, -78, 25, 27, "#ebbd9b", 9);
    circle(0, -62, 13, "#ebbd9b");
    poly(
      [
        [-14, -69],
        [-14, -80],
        [-7, -87],
        [7, -85],
        [15, -77],
        [11, -69],
        [7, -75],
        [0, -73],
        [-6, -77],
      ],
      "#584034",
    );
    line(
      [
        [-13, -68],
        [13, -68],
      ],
      "#293545",
      2,
    );
    rect(-12, -71, 11, 8, "#37495c", 3);
    rect(2, -71, 11, 8, "#37495c", 3);
    rect(-10, -69, 7, 4, "#bfe4ee", 1);
    rect(4, -69, 7, 4, "#bfe4ee", 1);
    line(
      [
        [-2, -68],
        [3, -68],
      ],
      "#273445",
      2,
    );
    line(
      [
        [-3, -58],
        [4, -57],
        [7, -59],
      ],
      "#986450",
      1.5,
    );
    if (h.shield) {
      c.strokeStyle = "#81d8ff";
      c.lineWidth = 4;
      c.beginPath();
      c.ellipse(39, -41, 11, 47, 0, -Math.PI / 2, Math.PI / 2);
      c.stroke();
      c.fillStyle = "#70cfff44";
      c.fill();
    }
    if (h.invisible > 0) {
      c.strokeStyle = "#97ffbd66";
      c.lineWidth = 2;
      c.setLineDash([5, 5]);
      c.beginPath();
      c.ellipse(0, -40, 42, 55, 0, 0, TAU);
      c.stroke();
      c.setLineDash([]);
    }
    c.restore();
  }
  function guard(e, g) {
    c.save();
    c.translate(e.x + e.w / 2, e.y + e.h);
    c.scale(e.facing, 1);
    if (e.flash > 0) c.globalAlpha = 0.55;
    circle(0, 0, 22, "#17273944");
    line(
      [
        [-8, -21],
        [-11, -3],
      ],
      "#9c3453",
      11,
    );
    line(
      [
        [8, -21],
        [12, -3],
      ],
      "#b7465a",
      11,
    );
    rect(-20, -6, 17, 8, "#573549", 3);
    rect(5, -6, 19, 8, "#573549", 3);
    rect(-19, -54, 38, 33, "#d15868", 8);
    line(
      [
        [-15, -52],
        [14, -24],
      ],
      "#f2cc69",
      8,
    );
    line(
      [
        [15, -52],
        [-14, -24],
      ],
      "#f2cc69",
      8,
    );
    rect(-15, -77, 30, 28, "#bb3b51", 7);
    poly(
      [
        [-12, -68],
        [-2, -65],
        [-2, -60],
        [-12, -64],
      ],
      "#91fa86",
    );
    poly(
      [
        [12, -68],
        [2, -65],
        [2, -60],
        [12, -64],
      ],
      "#91fa86",
    );
    line(
      [
        [-17, -47],
        [-26, -32],
      ],
      "#a93753",
      10,
    );
    line(
      [
        [16, -47],
        [28, -39],
      ],
      "#d15868",
      10,
    );
    rect(23, -45, 24, 10, "#303a4e", 2);
    rect(27, -37, 9, 10, "#283347", 2);
    rect(42, -44, 8, 6, "#72cbeb", 2);
    if (e.frozen > 0) {
      rect(-25, -83, 54, 87, "#a4e7ff55", 8);
      star(0, -91, 9, "#b5f2ff");
    }
    c.restore();
    if (e.hp < e.maxHp) {
      rect(e.x - 2, e.y - 24, 42, 4, "#20344c", 2);
      rect(e.x - 2, e.y - 24, (42 * e.hp) / e.maxHp, 4, "#f49b98", 2);
    }
  }
  function boss(b, g) {
    c.save();
    c.translate(b.x + b.w / 2, b.y + b.h);
    c.scale(b.facing, 1);
    if (b.flash > 0) c.globalAlpha = 0.55;
    circle(0, 0, 35, "#17273955");
    line(
      [
        [-13, -27],
        [-16, -6],
      ],
      "#753959",
      16,
    );
    line(
      [
        [13, -27],
        [16, -6],
      ],
      "#377cb2",
      16,
    );
    rect(-28, -8, 24, 12, "#773850", 5);
    rect(6, -8, 27, 12, "#2e5c8f", 5);
    rect(-25, -72, 50, 48, "#3f8ebe", 12);
    poly(
      [
        [-22, -72],
        [-5, -26],
        [-27, -32],
      ],
      "#97364f",
    );
    rect(-22, -34, 44, 7, "#ecbf59", 2);
    for (let i = 0; i < 3; i++) circle(0, -62 + i * 10, 3, "#efc769");
    line(
      [
        [-21, -64],
        [-33, -44],
        [-43, -50],
      ],
      "#9e3e5d",
      15,
    );
    line(
      [
        [21, -64],
        [34, -43],
        [48, -52],
      ],
      "#416ca9",
      15,
    );
    circle(48, -52, 8, "#ebbc99");
    circle(-43, -50, 8, "#ebbc99");
    poly(
      [
        [-28, -79],
        [-12, -59],
        [0, -75],
        [12, -60],
        [28, -80],
      ],
      "#a8415b",
    );
    line(
      [
        [-28, -79],
        [-12, -59],
        [0, -75],
        [12, -60],
        [28, -80],
      ],
      "#f0c460",
      3,
    );
    // Visage humain provisoire, jamais un crâne.
    rect(-18, -112, 36, 37, "#eabe99", 12);
    circle(0, -94, 20, "#eabe99");
    poly(
      [
        [-20, -100],
        [-18, -113],
        [-9, -122],
        [9, -121],
        [20, -111],
        [16, -101],
        [11, -110],
        [0, -106],
        [-10, -111],
      ],
      "#574132",
    );
    circle(-8, -98, 5, "#fff4df");
    circle(8, -98, 5, "#fff4df");
    circle(-7, -98, 2.6, "#373b50");
    circle(9, -98, 2.6, "#373b50");
    line(
      [
        [-9, -86],
        [0, -81],
        [11, -87],
      ],
      "#9d5f50",
      2,
    );
    poly(
      [
        [-20, -111],
        [-51, -144],
        [-46, -112],
        [-19, -105],
      ],
      "#4fbcc7",
    );
    poly(
      [
        [-13, -113],
        [-3, -155],
        [14, -115],
      ],
      "#97314e",
    );
    poly(
      [
        [12, -113],
        [48, -142],
        [43, -109],
        [20, -106],
      ],
      "#e5ad52",
    );
    for (const [x, y] of [
      [-51, -144],
      [-3, -155],
      [48, -142],
    ])
      circle(x, y, 5, "#f6d478");
    if (b.frozen > 0) rect(-35, -156, 70, 156, "#8cdbff33", 15);
    if (b.phase) circle(48, -52, 13 + Math.sin(g.time * 15) * 2, "#ffb05c99");
    c.restore();
  }
  return function draw(g) {
    c.clearRect(0, 0, 1280, 660);
    decor(g);
    c.save();
    c.translate(-g.camera, 0);
    for (const p of g.pickups) {
      if (p.taken) continue;
      const y = p.y + Math.sin(g.time * 3 + p.x) * 4;
      if (p.type === "coin") {
        circle(p.x, y, 13, "#ffdca0");
        circle(p.x, y, 9, "#db9e47");
        circle(p.x, y, 7, "#f7c66f");
        line(
          [
            [p.x, y - 4],
            [p.x, y + 4],
          ],
          "#fff1bd",
          2,
        );
      } else if (p.type === "health") {
        rect(p.x - 13, y - 13, 26, 26, "#70d4b1", 6);
        line(
          [
            [p.x - 6, y],
            [p.x + 6, y],
          ],
          "#effff7",
          4,
        );
        line(
          [
            [p.x, y - 6],
            [p.x, y + 6],
          ],
          "#effff7",
          4,
        );
      } else if (p.type === "energy") {
        circle(p.x, y, 14, "#a888e7");
        poly(
          [
            [p.x + 2, y - 9],
            [p.x - 6, y + 1],
            [p.x, y + 1],
            [p.x - 2, y + 10],
            [p.x + 7, y - 1],
            [p.x + 2, y - 1],
          ],
          "#f2e8ff",
        );
      } else star(p.x, y, 16, "#ffdb88");
    }
    for (const e of g.enemies) if (e.hp > 0) guard(e, g);
    if (g.bossActive && g.boss.hp > 0) boss(g.boss, g);
    hero(g.hero, g.time);
    for (const cloud of g.clouds) {
      const a = Math.min(1, cloud.ttl);
      c.globalAlpha = 0.33 * a;
      for (let i = 0; i < 7; i++)
        circle(
          cloud.x + Math.cos(i * 2 + g.time) * cloud.r * 0.45,
          cloud.y + Math.sin(i + g.time) * 20,
          cloud.r * 0.6,
          i % 2 ? "#a3d95d" : "#5eac6b",
        );
      c.globalAlpha = 1;
    }
    for (const s of g.shots) {
      const color =
        s.type === "fire"
          ? "#ffab57"
          : s.type === "ice"
            ? "#9fe6ff"
            : "#74d0ff";
      line(
        [
          [s.x - s.vx * 0.045, s.y - s.vy * 0.045],
          [s.x, s.y],
        ],
        color + "88",
        s.r,
      );
      circle(s.x, s.y, s.r, color);
      circle(s.x, s.y, s.r * 0.45, "#fff4de");
      if (s.type === "ice") {
        star(s.x, s.y, s.r + 3, "#c0f5ff");
      }
    }
    for (const e of g.effects) {
      let a = 1 - e.t / e.max;
      c.globalAlpha = a;
      if (["nova", "frost"].includes(e.type)) {
        c.strokeStyle = e.type === "nova" ? "#9edfff" : "#bcecff";
        c.lineWidth = 12 * a;
        c.beginPath();
        c.arc(e.x, e.y, (e.t / e.max) * 660, 0, TAU);
        c.stroke();
      } else {
        for (let i = 0; i < 8; i++) {
          const d = e.t * 130;
          circle(
            e.x + Math.cos((i * TAU) / 8) * d,
            e.y + Math.sin((i * TAU) / 8) * d,
            3 * a,
            e.type === "hurt"
              ? "#ff8f9b"
              : e.type === "pickup"
                ? "#ffe0a0"
                : "#9ddfff",
          );
        }
      }
      c.globalAlpha = 1;
    }
    c.restore();
    const vignette = c.createRadialGradient(640, 280, 280, 640, 280, 850);
    vignette.addColorStop(0, "#12273c00");
    vignette.addColorStop(1, "#10213855");
    rect(0, 0, 1280, 660, vignette);
  };
}
