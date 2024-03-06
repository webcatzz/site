oncontextmenu = () => {return false};

// game
const game = {
  root: document.getElementById("root"),
  size: () => {return [game.root.parentElement.offsetWidth, game.root.parentElement.offsetHeight]},
  headerY: document.querySelector("header").offsetHeight,

  atoms: [], bonds: [],
  add: (el, arr) => arr.push(el),
  remove: (el, arr) => arr.splice(arr.indexOf(el), 1),

  start: () => game.interval = setInterval(game.tick, 100/6),
  pause: () => clearInterval(game.interval),
  tick: () => {
    // atoms
    for (let i = 0; i < game.atoms.length; i++) {
      game.atoms[i].tick();
      if (game.atoms[i].electronNeed) for (let j = i + 1; j < game.atoms.length; j++) {
        if (game.atoms[j].electronNeed && !game.atoms[i].isBonded(game.atoms[j]) && game.near(game.atoms[i], game.atoms[j], 128)) {
          game.atoms[i].checkReact(game.atoms[j]);
        }
      }
    }
    // bonds
    for (const bond of game.bonds) bond.tick();
    // canvas
    canvas.redraw();
  },

  inBounds: (x, y) => {
    let size = game.size();
    return x > -cameraX && x < -cameraX + size[0] && y > -cameraY && y < -cameraY + size[1];
  },
  near: (a, b, distance) => {
    if (Math.abs(a.x - b.x) > distance || Math.abs(a.y - b.y) > distance) return false;
    return (a.x - b.x) ** 2 + (a.y - b.y) ** 2 < distance ** 2;
  }
}
game.start();


// color palette
const palette = {
  colors: ["red", "yellow", "green", "blue", "purple", "white", "gray", "black"],
  random: function () {return this[this.colors[Math.floor(Math.random() * this.colors.length)]]}
}
for (const color of palette.colors) palette[color] = getComputedStyle(document.body).getPropertyValue("--" + color);


// canvas
const canvas = {
  el: document.querySelector("canvas"),

  redraw: () => {
    canvas.ctx.clearRect(0, 0, canvas.el.width, canvas.el.height);
    for (const bond of game.bonds) bond.draw();
    if (canvas.trajectory) canvas.draw("line", canvas.trajectory);
  },

  draw: (type, opts) => {
    canvas.ctx.beginPath();

    if (type == "line") {
      canvas.ctx.moveTo(opts.x1 + cameraX, opts.y1 + cameraY);
      canvas.ctx.lineTo(opts.x2 + cameraX, opts.y2 + cameraY);
      if (opts.color) canvas.ctx.strokeStyle = opts.color;
      if (opts.width) canvas.ctx.lineWidth = opts.width;
      if (opts.dashed) canvas.ctx.setLineDash([8,4]);
      canvas.ctx.stroke();
      if (opts.dashed) canvas.ctx.setLineDash([]);
    }
    else if (type == "circle") {
      canvas.ctx.arc(opts.x + cameraX, opts.y + cameraY, opts.radius, 0, Math.PI * 2);
      if (opts.color) {
        canvas.ctx.fillStyle = opts.color;
        canvas.ctx.fill();
      }
      if (opts.border) {
        canvas.ctx.strokeStyle = opts.border;
        if (opts.width) canvas.ctx.strokeWidth = opts.width;
        canvas.ctx.stroke();
      }
    }
    else if (type == "text") {
      canvas.ctx.fillStyle = opts.color;
      opts.x += cameraX;
      opts.y += cameraY + 2;
      let metrics = canvas.ctx.measureText(opts.text);
      canvas.ctx.clearRect(opts.x - metrics.width/2, opts.y - 12, metrics.width, 16);
      canvas.ctx.fillText(opts.text, opts.x, opts.y);
    }
  }
};
canvas.ctx = canvas.el.getContext("2d");
[canvas.el.width, canvas.el.height] = game.size();
onresize = () => [canvas.el.width, canvas.el.height] = game.size();
canvas.ctx.font = "bold 12px sans-serif", canvas.ctx.textAlign = "center";


// camera
var cameraX = 0, cameraY = 0;
canvas.el.onmousedown = () => {
  game.pause();
  addEventListener("mousemove", moveCamera);
  addEventListener("mouseup", () => {
    removeEventListener("mousemove", moveCamera);
    game.start();
  }, {once: true});
}
function moveCamera(e) {
  cameraX += e.movementX;
  cameraY += e.movementY;
  game.root.style.left = cameraX + "px";
  game.root.style.top = cameraY + "px";
  canvas.redraw();
}


// CUSTOM CLASSES --------------------------------------------------------


// bonds
class Bond {
  static incr = 0;
  a; b; electrons;

  constructor(particle1, particle2, type) {
    // ordering
    if (particle1.electronNeed > particle2.electronNeed) this.a = particle1, this.b = particle2;
    else if (particle1.electronNeed < particle2.electronNeed) this.a = particle2, this.b = particle1;
    else if (particle1.p > particle2.p) this.a = particle1, this.b = particle2;
    else this.a = particle2, this.b = particle1;
    // type
    let polarization = Atom.data[this.a.p].electronegativity - Atom.data[this.b.p].electronegativity;
    if (polarization < 0.4) this.type = "covalent";
    else if (polarization > 1.7) this.type = "ionic";
    else this.type = "polar-covalent";
    // grabbing electrons
    if (this.type == "ionic") this.electrons = Math.abs(this.a.electronNeed);
    else this.electrons = Math.min(Math.abs(this.a.electronNeed), Math.abs(this.b.electronNeed));
    // updating atoms' bonds and electrons
    this.a.bonds.push(this);
    this.b.bonds.push(this);
    this.a.addElectrons(this.electrons);
    this.b.addElectrons(this.type == "ionic" ? -this.electrons : this.electrons);
    // physics
    if (this.a.bonds.length > this.b.bonds.length) this.a.updateBonds();
    else this.b.updateBonds();
    game.add(this, game.bonds);
    // debug
    console.log(`New ${this.type} (%c${Atom.data[this.a.p].electronegativity}%c - %c${Atom.data[this.b.p].electronegativity}%c = %c${Atom.data[this.a.p].electronegativity - Atom.data[this.b.p].electronegativity}%c) bond formed:
\t%c${(this.a.symbol + " ").substring(0, 2)}%c gained %c${this.electrons}%c electron(s), with a new need of %c${this.a.electronNeed}%c and charge of %c${this.a.charge}%c
\t%c${(this.b.symbol + " ").substring(0, 2)}%c ${this.type == "ionic" ? "lost  " : "gained"} %c${this.electrons}%c electron(s), with a new need of %c${this.b.electronNeed}%c and charge of %c${this.b.charge}%c`,

      "color: " + palette.green, "",
      "color: " + palette.green, "",
      "color: " + palette.green, "",

      "color: " + this.a.getColor(), "",
      "color: " + palette.green, "",
      "color: " + palette.green, "",
      "color: " + palette.green, "",

      "color: " + this.b.getColor(), "",
      "color: " + palette.green, "",
      "color: " + palette.green, "",
      "color: " + palette.green, "",
    );
  }

  vector = {x: 0, y: -64};
  set rotation(value) {
    this.vector.x = -64 * Math.sin(value);
    this.vector.y = -64 * Math.cos(value);
  }
  tick() {
    this.a.applyVelocity(
      (this.b.x - this.a.x - this.vector.x) / 10,
      (this.b.y - this.a.y - this.vector.y) / 10,
    );
    this.b.applyVelocity(
      (this.vector.x + this.a.x - this.b.x) / 10,
      (this.vector.y + this.a.y - this.b.y) / 10,
    );
  }
  draw() {
    if (game.inBounds(this.a.x, this.a.y) && game.inBounds(this.b.x, this.b.y)) {
      canvas.draw("line", {
        color: palette.black, width: 4,
        x1: this.a.x, y1: this.a.y,
        x2: this.b.x, y2: this.b.y,
      });
      canvas.draw("text", {
        text: String(this.electrons),
        color: palette.black,
        x: this.a.x + (this.b.x - this.a.x) / 2,
        y: this.a.y + (this.b.y - this.a.y) / 2,
      });
    }
  }

  break() {
    game.remove(this, game.bonds);
    for (let i = this.electrons; i > 0; i--) canvas.remove(this.key + "-" + i);
    this.a.addElectrons(this.electrons);
    this.b.addElectrons(this.type == "ionic" ? -this.electrons : this.electrons);
    this.a.bonds.splice(this.a.bonds.indexOf(this));
    this.b.bonds.splice(this.b.bonds.indexOf(this));
  }
}


// particles
class Particle extends HTMLElement {
  static dragging;
  color; velocity = {x: 0, y: 0};

  constructor() {
    super();
    this.classList.add("colored", "particle");
    this.setColor(palette.random());
    this.addEventListener("mousedown", this.drag);
  }
  add() {root.appendChild(this)}

  set x(value) {this.style.left = value + "px"}
  set y(value) {this.style.top = value + "px"}
  get x() {return this.offsetLeft}
  get y() {return this.offsetTop}

  setColor(value) {
    this.color = value;
    this.style.setProperty("--color", this.color);
  }

  applyVelocity(x, y) {
    this.velocity.x += x;
    this.velocity.y += y;
  }
  tick() {
    this.velocity.x -= this.velocity.x / 8;
    this.velocity.y -= this.velocity.y / 8;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  drag() {
    let listener = e => this.drawTrajectory(e);
    addEventListener("mousemove", listener);
    addEventListener("mouseup", e => {
      removeEventListener("mousemove", listener);
      delete canvas.trajectory;
      this.applyVelocity((this.x - e.x + cameraX) / 3, (this.y - e.y + cameraY + game.headerY) / 3);
    }, {once: true});
  }
  drawTrajectory(e) {
    canvas.trajectory = {
      color: this.color, width: 2, dashed: true,
      x1: this.x,
      y1: this.y,
      x2: this.x + 2 * (this.x - e.x + cameraX),
      y2: this.y + 2 * (this.y - e.y + cameraY + game.headerY)
    };
  }

  static get observedAttributes() {return ["x", "y", "color"]}
  attributeChangedCallback(name, oldValue, value) {
    if (name == "color") this.setColor(palette[value]);
    else this[name] = Number(value);
  }
}


// atoms
class Atom extends Particle {
  static symbols = ["?", "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pg", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh"];
  static data = {
    1: {
      symbol: "H",
      name: "hydrogen",
      electronegativity: 2.2
    },
    2: {
      symbol: "He",
      name: "helium"
    },
    3: {
      symbol: "Li",
      name: "lithium",
      electronegativity: 0.98
    },
    4: {
      symbol: "Be",
      name: "beryllium",
      electronegativity: 1.57
    },
    5: {
      symbol: "B",
      name: "boron",
      electronegativity: 2.04
    },
    6: {
      symbol: "C",
      name: "carbon",
      electronegativity: 2.55
    },
    7: {
      symbol: "N",
      name: "nitrogen",
      electronegativity: 3.04
    },
    8: {
      symbol: "O",
      name: "oxygen",
      electronegativity: 3.44
    },
    9: {
      symbol: "F",
      name: "fluorine",
      electronegativity: 3.98
    },
    10: {
      symbol: "Ne",
      name: "neon"
    },
    11: {
      symbol: "Na",
      name: "sodium",
      electronegativity: 0.93
    },
    12: {
      symbol: "Mg",
      name: "magnesium",
      electronegativity: 1.31
    },
    13: {
      symbol: "Al",
      name: "alumnium",
      electronegativity: 1.61
    },
    14: {
      symbol: "Si",
      name: "silicon",
      electronegativity: 1.90
    },
    15: {
      symbol: "P",
      name: "phosphorus",
      electronegativity: 2.19
    },
    16: {
      symbol: "S",
      name: "sulfur",
      electronegativity: 2.58
    },
    17: {
      symbol: "Cl",
      name: "chlorine",
      electronegativity: 3.16
    },
    18: {
      symbol: "Ar",
      name: "argon"
    },
    19: {
      symbol: "K",
      name: "potassium",
      electronegativity: 0.82
    },
    20: {
      symbol: "Ca",
      name: "calcium",
      electronegativity: 1
    },
    21: {
      symbol: "Sc",
      name: "scandium",
      electronegativity: 1.36
    },
    22: {
      symbol: "Ti",
      name: "titanium",
      electronegativity: 1.54
    },
    23: {
      symbol: "V",
      name: "vanadium",
      electronegativity: 1.63
    },
    24: {
      symbol: "Cr",
      name: "chromium",
      electronegativity: 1.66
    },
    25: {
      symbol: "Mn",
      name: "manganese",
      electronegativity: 1.55
    },
    26: {
      symbol: "Fe",
      name: "iron",
      electronegativity: 1.83
    },
    27: {
      symbol: "Co",
      name: "cobalt",
      electronegativity: 1.88
    },
    28: {
      symbol: "Ni",
      name: "nickel",
      electronegativity: 1.91
    },
    29: {
      symbol: "Cu",
      name: "copper",
      electronegativity: 1.90
    },
    30: {
      symbol: "Zn",
      name: "zinc",
      electronegativity: 1.65
    },
    31: {
      symbol: "Ga",
      name: "gallium",
      electronegativity: 1.81
    },
    32: {
      symbol: "Ge",
      name: "germanium",
      electronegativity: 2.01
    },
    33: {
      symbol: "As",
      name: "arsenic",
      electronegativity: 2.18
    },
    34: {
      symbol: "Se",
      name: "sellenium",
      electronegativity: 2.55
    },
    35: {
      symbol: "Br",
      name: "bromine",
      electronegativity: 2.96
    },
    36: {
      symbol: "Kr",
      name: "krypton",
      electronegativity: 3
    },
    37: {
      symbol: "Rb",
      name: "rubidium",
      electronegativity: 0.82
    },
    38: {
      symbol: "Sr",
      name: "strontium",
      electronegativity: 0.95
    },
    39: {
      symbol: "Y",
      name: "yttrium",
      electronegativity: 1.22
    },
    40: {
      symbol: "Zr",
      name: "zirconium",
      electronegativity: 1.33
    },
    41: {
      symbol: "Nb",
      name: "niobium",
      electronegativity: 1.6
    },
    42: {
      symbol: "Mo",
      name: "molybdenum",
      electronegativity: 2.16
    },
    43: {
      symbol: "Tc",
      name: "technetium",
      electronegativity: 1.9
    },
    44: {
      symbol: "Ru",
      name: "ruthenium",
      electronegativity: 2.2
    },
    45: {
      symbol: "Rh",
      name: "rhodium",
      electronegativity: 2.82
    },
    46: {
      symbol: "Pd",
      name: "palladium",
      electronegativity: 2.2
    },
    47: {
      symbol: "Ag",
      name: "silver",
      electronegativity: 1.93
    },
    48: {
      symbol: "Cd",
      name: "cadmium",
      electronegativity: 1.69
    },
    49: {
      symbol: "In",
      name: "indium",
      electronegativity: 1.78
    },
    50: {
      symbol: "Sn",
      name: "tin"
    },
    51: {
      symbol: "Sb",
      name: "antimony"
    },
    52: {
      symbol: "Te",
      name: "tellurium"
    },
    53: {
      symbol: "I",
      name: "iodine"
    },
    54: {
      symbol: "Xe",
      name: "xenon"
    },
    55: {
      symbol: "Cs",
      name: "caesium"
    },
    56: {
      symbol: "Ba",
      name: "barium"
    },
    72: {
      symbol: "Hf",
      name: "hafnium"
    },
    73: {
      symbol: "Ta",
      name: "tantalum"
    },
    74: {
      symbol: "W",
      name: "tungsten"
    },
    75: {
      symbol: "Re",
      name: "rhenium"
    },
    76: {
      symbol: "Os",
      name: "osmium"
    },
    77: {
      symbol: "Ir",
      name: "iridium"
    },
    78: {
      symbol: "Pt",
      name: "platinum"
    },
    79: {
      symbol: "Au",
      name: "gold"
    },
    80: {
      symbol: "Hg",
      name: "mercury"
    },
    81: {
      symbol: "Tl",
      name: "thallium"
    },
    82: {
      symbol: "Pb",
      name: "lead"
    },
    83: {
      symbol: "Bi",
      name: "bismuth"
    },
    84: {
      symbol: "Po",
      name: "polonium"
    },
    85: {
      symbol: "At",
      name: "astatine"
    },
    86: {
      symbol: "Rn",
      name: "radon"
    },
    87: {
      symbol: "Fr",
      name: "francium"
    },
    88: {
      symbol: "Ra",
      name: "radium"
    },
  }

  p; n;
  cloud = {
    charge: 0,
    1: 0, // {total: 0, s: 0},
    2: 0, // {total: 0, s: 0, p: 0},
    3: 0, // {total: 0, s: 0, p: 0, d: 0},
    4: 0, // {total: 0, s: 0, p: 0, d: 0, f: 0},
    5: 0, // {total: 0, s: 0, p: 0, d: 0},
    6: 0, // {total: 0, s: 0, p: 0},
  };
  bonds = [];
  label;

  constructor() {
    super();
    this.classList.add("atom");
  }
  connectedCallback() {
    // visuals
    this.setColor(this.getColor());
    this.style.width = 25 + this.getPeriod() * 5 + "px";
    this.label = this.appendChild(document.createElement("span"));
    this.updateSymbol();
    // updating cloud
    this.addElectrons(this.p);
    this.cloud.charge = 0;
    // physics
    game.add(this, game.atoms);
    // hover
    this.onmouseover = () => hover(this, this.getName(), this.x + cameraX, this.y + cameraY + (this.clientWidth / 2) + 60);
    // debug
    console.log(
      `New atom %c${(this.symbol + " ").substring(0, 2)}%c with need %c${this.electronNeed}`,
      "color: " + this.getColor(), "",
      "color: " + palette.green
    )
  }

  get symbol() {return Atom.symbols[this.p]}
  set symbol(value) {this.p = Atom.symbols.indexOf(value)}
  getName() {
    let name = Atom.data[this.p].name;

    if (this.cloud.charge < 0 && this.bonds.length == 1 && this.bonds[0].type != "covalent") {
      let suffix;
      if (name.endsWith("ine")) suffix = name.length - 3;
      else if (this.p == 8) suffix = 2;
      else if (this.p == 16) suffix = 4;
      else suffix = name.lastIndexOf("o");
      name = name.substring(0, suffix) + "ide";
    }

    if (this.cloud.charge) name += "<sup>" + this.charge + "</sup>"
    
    return name;
  }
  get charge() {return this.cloud.charge > 0 ? this.cloud.charge + "+" : -this.cloud.charge + "-"}

  // bonds & reactions
  electronNeed;
  checkReact(atom) {
    if (
      Math.abs(this.electronNeed) === Math.abs(atom.electronNeed) ||
      this.electronNeed >= 0 && atom.electronNeed >= 0
    ) new Bond(this, atom);
    
    else console.log(
      `%c${this.symbol}%c (%c${this.electronNeed}%c) and %c${atom.symbol}%c (%c${atom.electronNeed}%c) did not react`,
      "color: " + this.getColor(), "", "color: " + palette.green, "",
      "color: " + this.getColor(), "", "color: " + palette.green, "",
    );
  }
  isBonded(atom) {
    for (const bond of this.bonds) if (bond.a == atom || bond.b == atom) return true;
    return false;
  }
  updateBonds() {
    for (let i = 0; i < this.bonds.length; i++) {
      this.bonds[i].rotation = i * 2 * Math.PI / this.bonds.length;
    }
  }

  // electron cloud
  addElectrons(num = 1) {
    if (num > 0) {
      while (num-- > 0) {
        this.cloud[this.getValenceShell()]++;
        this.cloud.charge--;
      }
    } else {
      num = Math.min(num, 0);
      while (num++ < 0) {
        this.cloud[this.getValenceShell()]--;
        this.cloud.charge++;
      }
    }
    // updating electron need
    let valence = this.getValenceShell(), valenceNum = this.cloud[valence];
    if (valenceNum == 8 || valence == 1 && valenceNum == 2) this.electronNeed = 0;
    else if (valenceNum < 4) this.electronNeed = valence == 1 ? valenceNum : -valenceNum;
    else this.electronNeed = 8 - valenceNum;
    return 0;
  }
  getValenceShell() {
    if (this.cloud[1] < 2) return 1; // 1s
    else if (this.cloud[2] < 8) return 2; // 2s, 2p
    else if (this.cloud[3] < 8) return 3; // 3s, 3p
    else if (this.cloud[4] < 2) return 4; // 4s
    else if (this.cloud[3] < 18) return 3; // 3d
    else if (this.cloud[4] < 8) return 4; // 4p
    else if (this.cloud[5] < 2) return 5; // 5s
    else if (this.cloud[4] < 18) return 4; // 4d
    else if (this.cloud[5] < 8) return 5; // 5p
    else if (this.cloud[6] < 2) return 6; // 6s
    else if (this.cloud[4] < 25) return 4; // 4f
    else if (this.cloud[5] < 18) return 5; // 5d
    else if (this.cloud[6] < 8) return 6; // 6p
  }

  // groups & periods
  getGroup() {
    let idx = this.p;
    if (this.p >= 2) idx += 16;
    if (this.p >= 5) idx += 10;
    if (this.p >= 13) idx += 10;
    if (this.p >= 72) idx -= 14;
    if (this.p >= 104) idx -= 14;
    idx %= 18;
    return idx ? idx : 18;
  }
  getPeriod() {
    if (this.p > 86) return 7;
    if (this.p > 54) return 6;
    if (this.p > 36) return 5;
    if (this.p > 18) return 4;
    if (this.p > 10) return 3;
    if (this.p > 2) return 2;
    return 1;
  }
  getType() {
    let group = this.getGroup();
    // hyrodgen and alkali metals
    if (group == 1) return this.p == 1 ? "Reactive non-metal" : "Alkali metal";
    // alkaline earth metals
    if (group == 2) return "Alkaline earth metal";
    // transition metals
    if (group == 3) return this.p == 57 ? "Lathanide" : this.p == 89 ? "Actinide" : "Transition metal";
    if (group >= 4 && group <= 12) return "Transition metal";
    // post-transition metals to reactive non-metals
    if (group == 13) return this.p == 5 ? "Metalloid" : "Post-transition metal";
    if (group == 14) return this.p == 6 ? "Reactive non-metal" : this.p <= 32 ? "Metalloid" : "Post-transition metal";
    if (group == 15) return this.p <= 15 ? "Reactive non-metal" : this.p <= 51 ? "Metalloid" : "Post-transition metal";
    if (group == 16) return this.p <= 34 ? "Reactive non-metal" : this.p == 52 ? "Metalloid" : "Post-transition metal";
    if (group == 17) return this.p <= 53 ? "Reactive non-metal" : "Post-transition metal";
    // noble gases
    if (group == 18) return "Noble gas";
  }

  // visuals
  updateSymbol() {this.label.textContent = this.symbol}
  getColorName() {
    let type = this.getType();
    if (["Alkaline earth metal", "Noble gas"].includes(type)) return "red";
    if (["Metalloid", "Actinide"].includes(type)) return "yellow";
    if (["Alkali metal", "Post-transition metal"].includes(type)) return "green";
    if (["Reactive non-metal", "Lathanide"].includes(type)) return "blue";
    if (["Transition metal"].includes(type)) return "purple";
  }
  getColor() {return palette[this.getColorName()]}

  static get observedAttributes() {return super.observedAttributes.concat(["name", "p"])}
  attributeChangedCallback(name, oldValue, value) {
    if (Particle.observedAttributes.includes(name)) super.attributeChangedCallback(name, oldValue, value);
    else if (name == "name") this.p = Atom.symbols.indexOf(value);
    else if (name == "p") this.p = Number(value);
  }

  disconnectedCallback() {
    game.remove(this, game.atoms);
    for (const bond of this.bonds) bond.break();
  }
}


// defining custom classes
window.customElements.define("lbau-atom", Atom);


// periodic table
for (let i = 1; i <= 18; i++) {
  let head = document.getElementById("table").appendChild(document.createElement("div"));
  head.className = "head", head.textContent = i;
}
for (let i = 1; i < Atom.symbols.length; i++) {
  if (i == 58) i = 72;
  else if (i == 90) i = 104;

  let cell = document.getElementById("table").appendChild(document.createElement("div"));
  let atom = new Atom; atom.p = i;
  cell.classList.add("colored", atom.getColorName(), "cell");
  cell.textContent = atom.symbol;

  if (i == 2) cell.style.gridColumn = 18;
  else if (i == 5 || i == 13) cell.style.gridColumn = 13;
}
document.getElementById("table").appendChild(document.createElement("div")).classList.add("colored", "gray", "halftone", "cell", "empty");
document.querySelector("header button").onclick = () => document.getElementById("info").classList.toggle("hidden");


// loading level
load([
  [
    {type: "atom", symbol: "Na", x: 400, y: 400},
    {type: "atom", symbol: "H", x: 500, y: 200},
    {type: "atom", symbol: "Cl", x: 800, y: 300},
    {type: "atom", symbol: "Ag", x: 600, y: 400},
    {type: "atom", symbol: "Cl", x: 1000, y: 500},
    // {type: "bond", a: 2, b: 4, kind: "ionic"}
  ],
  [
    {type: "atom", symbol: "Na", x: 400, y: 400},
  ]
][location.hash ? location.hash.substring(1) : 0]);
function load(data) {
  for (const item of data) {
    if (item.type == "atom") {
      let atom = new Atom();
      atom.symbol = item.symbol;
      atom.x = item.x;
      atom.y = item.y;
      atom.add();
    } else if (item.type == "bond") {
      new Bond(game.atoms[item.a], game.atoms[item.b], item.kind);
    }
  }
}

function exportJSON() {
  let arr = [];
  for (const atom of game.atoms) arr.push({type: "atom", symbol: atom.symbol, x: atom.x, y: atom.y});
  for (const bond of game.bonds) arr.push({type: "bond", a: game.atoms.indexOf(bond.a), b: game.atoms.indexOf(bond.b), kind: bond.type});
  console.log(JSON.stringify(arr));
}


// debug
oncontextmenu = e => {
  let input = game.root.appendChild(document.createElement("input"));
  input.style = `position: absolute; left: ${e.x - cameraX}px; top: ${e.y - cameraY - document.querySelector("header").offsetHeight}px`;
  input.focus();
  input.onblur = () => input.remove();
  input.onkeydown = e => {if (e.key == "Enter") {
    if (Atom.symbols.includes(input.value)) {
      let atom = new Atom;
      atom.symbol = input.value;
      atom.x = input.offsetLeft;
      atom.y = input.offsetTop;
      atom.add();
    }
    input.blur();
  }}
  return false;
}