oncontextmenu = () => {return false};

// colors
const palette = {
  colors: ["red", "yellow", "green", "blue", "purple", "white", "gray", "black"],
  random: function () {return this[this.colors[Math.floor(Math.random() * this.colors.length)]]}
}
for (const color of palette.colors) palette[color] = getComputedStyle(document.body).getPropertyValue("--" + color);


// canvas
const canvas = {
  el: document.querySelector("canvas"),
  memory: {},

  redraw: function () {
    this.ctx.clearRect(0, 0, canvas.el.width, canvas.el.height);
    for (const arguments of Object.values(this.memory)) this.draw(...arguments);
  },

  set: function (key, type, opts) {
    this.memory[key] = [type, opts];
    this.redraw();
  },
  remove: function (key) {
    delete this.memory[key];
    this.redraw();
  },

  draw: function (type, opts) {
    this.ctx.beginPath();

    if (type == "line") {
      this.ctx.moveTo(opts.coords[0] + cameraX, opts.coords[1] + cameraY);
      for (let i = 2; i < opts.coords.length; i++) this.ctx.lineTo(opts.coords[i] + cameraX, opts.coords[++i] + cameraY);

      if (opts.color) this.ctx.strokeStyle = opts.color;
      if (opts.width) this.ctx.lineWidth = opts.width;
      if (opts.dashed) this.ctx.setLineDash([8,4]);
      this.ctx.stroke();
      if (opts.dashed) this.ctx.setLineDash([]);
    } else if (type == "circle") {
      this.ctx.arc(opts.x + cameraX, opts.y + cameraY, opts.radius, 0, Math.PI * 2);
      if (opts.color) {
        this.ctx.fillStyle = opts.color;
        this.ctx.fill();
      }
      if (opts.border) {
        this.ctx.strokeStyle = opts.border;
        if (opts.width) this.ctx.strokeWidth = opts.width;
        this.ctx.stroke();
      }
    }

  },
};
canvas.ctx = canvas.el.getContext("2d");
canvas.el.width = innerWidth, canvas.el.height = innerHeight;
onresize = () => canvas.el.width = innerWidth, canvas.el.height = innerHeight;


// physics
const physics = {
  els: [],
  add: el => physics.els.push(el),
  remove: el => physics.els.splice(physics.els.indexOf(el), 1),
  tick: () => {
    for (const el of physics.els) el.tick();
  },

  near: (a, b, distance) => {
    if (Math.abs(a.x - b.x) > distance) return false;
    if (Math.abs(a.y - b.y) > distance) return false;
    if ((a.x - b.x) ** 2 + (a.y - b.y) ** 2 < distance ** 2) return true;
  }
}
setInterval(physics.tick, 100/6);


// camera
var cameraX = 0, cameraY = 0;
canvas.el.onmousedown = () => {
  addEventListener("mousemove", moveCamera);
  addEventListener("mouseup", () => removeEventListener("mousemove", moveCamera), {once: true});
}
function moveCamera(e) {
  cameraX += e.movementX;
  cameraY += e.movementY;
  document.body.style.left = cameraX + "px";
  document.body.style.top = cameraY + "px";
}


// CUSTOM CLASSES --------------------------------------------------------


// bonds
class Bond {
  static incr = 0;
  a; b; electrons; key;

  constructor(particle1, particle2, type, electrons) {
    if (particle1.getElectronNeed() < particle2.getElectronNeed())
      this.a = particle1, this.b = particle2;
    else this.a = particle2, this.b = particle1;

    this.electrons = electrons;
    this.a.bonds.push(this);
    this.b.bonds.push(this);
    this.a.addElectrons(type == "ionic" ? -electrons : electrons);
    this.b.addElectrons(electrons);

    this.key = "bond" + ++Bond.incr;
    physics.add(this);

    if (type == "ionic") console.log("Bonded:\n", -electrons, this.a, "\n ", electrons, this.b);
    else console.log("Bonded: (", electrons, ")\n", this.a, "\n", this.b);
  }

  tick() {
    let dx = (this.b.x - this.a.x - 64) / 100;
    let dy = (this.b.y - this.a.y - 64) / 100;
    this.a.applyVelocity(dx, dy);
    this.b.applyVelocity(-dx, -dy);

    canvas.set(this.key, "line", {
      color: palette.black, width: 4,
      coords: [
        this.a.x, this.a.y,
        this.b.x, this.b.y,
      ]
    });
    for (let i = this.electrons; i > 0; i--) canvas.set(this.key + "-" + i, "circle", {
      color: palette.red, border: palette.red, width: 4,
      radius: 4,
      x: this.a.x + (this.b.x - this.a.x) / 2 - (this.electrons.length - this.electrons.length / 2 + i) * 8,
      y: this.a.y + (this.b.y - this.a.y) / 2 - (this.electrons.length - this.electrons.length / 2 + i) * 8,
    });
  }

  remove() {
    physics.remove(this);
    canvas.remove(this.key);
    for (let i = this.electrons; i > 0; i--) canvas.remove(this.key + "-" + i);
    this.a.addElectrons(this.electrons);
    this.b.addElectrons(type == "ionic" ? -this.electrons : this.electrons);
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
  connectedCallback() {
    physics.add(this);
  }

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
      canvas.remove("trajectory");
      this.applyVelocity((this.x - e.x + cameraX) / 3, (this.y - e.y + cameraY) / 3);
    }, {once: true});
  }
  drawTrajectory(e) {
    canvas.set("trajectory", "line", {
      color: this.color, width: 2, dashed: true,
      coords: [
        this.x,
        this.y,
        this.x + 2 * (this.x - e.x + cameraX),
        this.y + 2 * (this.y - e.y + cameraY),
      ]
    });
  }

  disconnectedCallback() {
    physics.remove(this);
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
    super.connectedCallback();
    // visuals
    this.setColor(this.getColor());
    this.style.width = 25 + this.getPeriod() * 5 + "px";
    this.label = this.appendChild(document.createElement("span"));
    this.updateSymbol();

    this.addElectrons(this.p);
  }

  get name() {return Atom.symbols[this.p]}
  set name(value) {this.p = Atom.symbols.indexOf(value)}

  // bonds & reactions
  tick() {
    super.tick();
    let need1 = this.getElectronNeed();
    if (need1 != 0) for (const atom of document.getElementsByTagName("lbau-atom")) {
      if (atom != this && !this.isBonded(atom) && physics.near(this, atom, 128)) {
        let need2 = atom.getElectronNeed();
        if (need2 == 0) continue;
        // ionic
        else if (need1 === -need2) new Bond(this, atom, "ionic", Math.abs(need1));
        // covalent
        else if (
          need1 > 0 && need2 > 0 &&
          need1 % 2 == 1 && need2 % 2 == 1
        ) {
          new Bond(this, atom, "covalent", Math.abs(need1));
        }
      }
    }
  }
  isBonded(atom) {
    for (const bond of this.bonds) if (bond.a == atom || bond.b == atom) return true;
    return false;
  }

  // electron cloud
  addElectrons(num = 1) {
    if (num > 0) {
      while (num-- > 0) this.cloud[this.getValenceShell()]++;
    } else {
      num = Math.min(num, 0);
      while (num++ < 0) this.cloud[this.getValenceShell()]--;
    }
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
  getElectronNeed() {
    let group = this.getGroup();
    if (group < 3 || group > 12) {
      let valence = this.cloud.findIndex(el => el == 0) - 1, valenceNum = this.cloud[valence];
      if (valenceNum == 8 || valence == 1 && valenceNum == 2) return 0;
      else if (valenceNum < 4) return -valenceNum;
      else return 8 - valenceNum;
    }
    return 0;
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
  getColor() {
    let type = this.getType();
    if (["Alkaline earth metal", "Noble gas"].includes(type)) return palette.red;
    if (["Metalloid", "Actinide"].includes(type)) return palette.yellow;
    if (["Alkali metal", "Post-transition metal"].includes(type)) return palette.green;
    if (["Reactive non-metal", "Lathanide"].includes(type)) return palette.blue;
    if (["Transition metal"].includes(type)) return palette.purple;
  }

  static get observedAttributes() {return super.observedAttributes.concat(["name", "p"])}
  attributeChangedCallback(name, oldValue, value) {
    if (Particle.observedAttributes.includes(name)) super.attributeChangedCallback(name, oldValue, value);
    else if (name == "name") this.p = Atom.symbols.indexOf(value);
    else if (name == "p") this.p = Number(value);
  }

}







// defining custom classes
window.customElements.define("lbau-atom", Atom);




// periodic table
for (let i = 1; i < Atom.symbols.length; i++) {
  if ((i >= 58 && i <= 71) || (i >= 90 && i <= 103)) continue;

  let cell = document.getElementById("table").appendChild(document.createElement("div"));
  let atom = new Atom; atom.p = i;
  cell.classList.add("colored");
  cell.style.setProperty("--color", atom.getColor());
  cell.textContent = Atom.symbols[i];
  cell.onmousedown = function () {
    let atom = new Atom;
    atom.name = this.textContent;
    atom.x = this.offsetLeft + this.parentElement.offsetLeft + this.offsetWidth / 2;
    atom.y = this.offsetTop + this.parentElement.offsetTop + this.offsetHeight / 2;
    document.body.appendChild(atom);
    atom.drag();
  }
}
document.getElementById("table").appendChild(document.createElement("div")).classList.add("colored", "empty");