oncontextmenu = () => {return false};

// game
const game = {
  root: document.getElementById("root"),
  size: () => {return [game.root.parentElement.offsetWidth, game.root.parentElement.offsetHeight]},

  atoms: [], bonds: [],
  add: (el, arr) => arr.push(el),
  remove: (el, arr) => arr.splice(arr.indexOf(el), 1),

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
  near: (a, b, distance) => {
    if (Math.abs(a.x - b.x) > distance || Math.abs(a.y - b.y) > distance) return false;
    return (a.x - b.x) ** 2 + (a.y - b.y) ** 2 < distance ** 2;
  }
}
setInterval(game.tick, 100/6);


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
      canvas.ctx.moveTo(opts.coords[0] + cameraX, opts.coords[1] + cameraY);
      for (let i = 2; i < opts.coords.length; i++) canvas.ctx.lineTo(opts.coords[i] + cameraX, opts.coords[++i] + cameraY);

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

  },
};
canvas.ctx = canvas.el.getContext("2d");
[canvas.el.width, canvas.el.height] = game.size();
onresize = () => [canvas.el.width, canvas.el.height] = game.size();


// camera
var cameraX = 0, cameraY = 0;
canvas.el.onmousedown = () => {
  addEventListener("mousemove", moveCamera);
  addEventListener("mouseup", () => removeEventListener("mousemove", moveCamera), {once: true});
}
function moveCamera(e) {
  cameraX += e.movementX;
  cameraY += e.movementY;
  game.root.style.left = cameraX + "px";
  game.root.style.top = cameraY + "px";
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
    // grabbing electrons
    this.type = type;
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
    if (type == "ionic") console.log("Bonded:\n", this.electrons, this.a, "\n ", -this.electrons, this.b);
    else console.log("Bonded: (", this.electrons, ")\n", this.a, "\n", this.b);
  }

  vector = {x: 0, y: -64};
  set rotation(value) {
    this.vector.x = -64 * Math.sin(value);
    this.vector.y = -64 * Math.cos(value);
  }
  tick() {
    this.a.applyVelocity(
      (this.b.x - this.a.x - this.vector.x) / 100,
      (this.b.y - this.a.y - this.vector.y) / 100,
    );
    this.b.applyVelocity(
      (this.vector.x + this.a.x - this.b.x) / 100,
      (this.vector.y + this.a.y - this.b.y) / 100,
    );
  }
  draw() {
    canvas.draw("line", {
      color: palette.black, width: 4,
      coords: [
        this.a.x, this.a.y,
        this.b.x, this.b.y,
      ]
    });
    // for (let i = this.electrons; i > 0; i--) canvas.set(this.key + "-" + i, "circle", {
    //   color: palette.white, border: palette.black, width: 4,
    //   radius: 4,
    //   x: this.a.x + (this.b.x - this.a.x) / 2 - (this.electrons.length - this.electrons.length / 2 + i) * 8,
    //   y: this.a.y + (this.b.y - this.a.y) / 2 - (this.electrons.length - this.electrons.length / 2 + i) * 8,
    // });
  }

  remove() {
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
      this.applyVelocity((this.x - e.x + cameraX) / 3, (this.y - e.y + cameraY) / 3);
    }, {once: true});
  }
  drawTrajectory(e) {
    canvas.trajectory = {
      color: this.color, width: 2, dashed: true,
      coords: [
        this.x,
        this.y,
        this.x + 2 * (this.x - e.x + cameraX),
        this.y + 2 * (this.y - e.y + cameraY)
      ]
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

  p; n;
  cloud = [
    null,
    0, // {total: 0, s: 0},
    0, // {total: 0, s: 0, p: 0},
    0, // {total: 0, s: 0, p: 0, d: 0},
    0, // {total: 0, s: 0, p: 0, d: 0, f: 0},
    0, // {total: 0, s: 0, p: 0, d: 0},
    0, // {total: 0, s: 0, p: 0},
  ];
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
    // physics
    game.add(this, game.atoms);
  }

  get name() {return Atom.symbols[this.p]}
  set name(value) {this.p = Atom.symbols.indexOf(value)}

  // bonds & reactions
  electronNeed;
  checkReact(atom) {
    // ionic
    if (this.electronNeed === -atom.electronNeed)
      new Bond(this, atom, "ionic");
    // covalent
    else if (
      this.electronNeed > 0 && atom.electronNeed > 0 &&
      this.electronNeed % 2 == 1 || atom.electronNeed % 2 == 1 ||
      this.electronNeed == atom.electronNeed
    ) new Bond(this, atom, "covalent");
  }
  isBonded(atom) {
    for (const bond of this.bonds) if (bond.a == atom || bond.b == atom) return true;
    return false;
  }
  updateBonds() {
    for (let i = 0; i < this.bonds.length; i++) {
      this.bonds[i].rotation = i * 2 * Math.PI / this.bonds.length;
      // console.log(i * 2 * Math.PI / this.bonds.length, "/", this.bonds.length, this.name, this.bonds[i].b.name);
    }
  }

  // electron cloud
  addElectrons(num = 1) {
    if (num > 0) {
      while (num-- > 0) this.cloud[this.getValenceShell()]++;
    } else {
      num = Math.min(num, 0);
      while (num++ < 0) this.cloud[this.getValenceShell()]--;
    }
    // updating electron need
    let group = this.getGroup();
    if (group < 3 || group > 12) {
      let valence = this.cloud.findIndex(el => el == 0) - 1, valenceNum = this.cloud[valence];
      if (valenceNum == 8 || valence == 1 && valenceNum == 2) this.electronNeed = 0;
      else if (valenceNum < 4) this.electronNeed = valence == 1 ? valenceNum : -valenceNum;
      else this.electronNeed = 8 - valenceNum;
    }
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
  updateSymbol() {this.label.textContent = this.name}
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
  cell.textContent = atom.name;

  if (i == 2) cell.style.gridColumn = 18;
  else if (i == 5 || i == 13) cell.style.gridColumn = 13;
}
document.getElementById("table").appendChild(document.createElement("div")).classList.add("colored", "gray", "halftone", "cell", "empty");
document.querySelector("header button").onclick = () => document.getElementById("info").classList.toggle("hidden");


// loading level
load([
  [
    {type: "atom", name: "Na", x: 400, y: 400},
    {type: "atom", name: "H", x: 500, y: 200},
    {type: "atom", name: "Cl", x: 800, y: 300},
    {type: "atom", name: "Ag", x: 600, y: 400},
    {type: "atom", name: "Cl", x: 1000, y: 500},
    // {type: "bond", a: 2, b: 4, kind: "ionic"}
  ],
  [
    {type: "atom", name: "Na", x: 400, y: 400},
  ]
][location.hash ? location.hash.substring(1) : 0]);
function load(data) {
  for (const item of data) {
    if (item.type == "atom") {
      let atom = new Atom();
      atom.name = item.name;
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
  for (const atom of game.atoms) arr.push({type: "atom", name: atom.name, x: atom.x, y: atom.y});
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
      atom.name = input.value;
      atom.x = input.offsetLeft;
      atom.y = input.offsetTop;
      atom.add();
    }
    input.blur();
  }}
  return false;
}