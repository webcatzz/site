oncontextmenu = () => {return false};

// colors
const palette = {
  colors: ["red", "green", "blue", "yellow", "white", "black"],
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

  add: function (type, opts, key) {
    if (key) this.memory[key] = [type, opts];
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
    }

  },
};
canvas.ctx = canvas.el.getContext("2d");
canvas.el.width = innerWidth, canvas.el.height = innerHeight;
onresize = () => canvas.el.width = innerWidth, canvas.el.height = innerHeight;


// physics
const physicsEls = [];
setInterval(() => {
  for (const el of physicsEls) {
    el.velocity.x -= el.velocity.x / 8;
    el.velocity.y -= el.velocity.y / 8;
    el.x += el.velocity.x;
    el.y += el.velocity.y;
  }
}, 100/6);


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

  constructor(particle1, particle2, electrons) {
    if (particle1.cloud.getNeed() < particle2.cloud.getNeed())
      this.a = particle1, this.b = particle2;
    else this.a = particle2, this.b = particle1;

    this.a.bonds.push(this);
    this.b.bonds.push(this);
    this.a.cloud.remove(electrons);
    this.b.cloud.add(electrons);

    this.key = "bond" + ++Bond.incr;
    this.a.addEventListener("positionchanged", () => this.updatePos());
    this.b.addEventListener("positionchanged", () => this.updatePos());
    this.updatePos();
  }

  updatePos() {
    let dx = (this.b.x - this.a.x - 64) / 1000;
    let dy = (this.b.y - this.a.y - 64) / 1000;
    this.a.applyVelocity(dx, dy);
    this.b.applyVelocity(-dx, -dy);

    canvas.remove(this.key);
    canvas.add("line", {
      color: "black", width: 4,
      coords: [
        this.a.x, this.a.y,
        this.b.x, this.b.y,
      ]
    }, this.key);
  }

  remove() {
    canvas.remove(this.key);
    this.a.cloud.add(electrons);
    this.b.cloud.remove(electrons);
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
    this.classList.add("particle");
    this.setColor(palette.random());
    this.addEventListener("mousedown", this.drag);
    physicsEls.push(this);
  }

  set x(value) {this.style.left = value + "px"; this.dispatchEvent(new Event("positionchanged"))}
  set y(value) {this.style.top = value + "px"; this.dispatchEvent(new Event("positionchanged"))}
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
    canvas.remove("trajectory");
    canvas.add("line", {
      color: this.color, width: 2, dashed: true,
      coords: [
        this.x,
        this.y,
        this.x + 2 * (this.x - e.x + cameraX),
        this.y + 2 * (this.y - e.y + cameraY),
      ]
    }, "trajectory");
  }

  disconnectedCallback() {
    physicsEls.splice(physicsEls.indexOf(this), 1);
  }

  static get observedAttributes() {return ["x", "y", "color"]}
  attributeChangedCallback(name, oldValue, value) {
    if (name == "color") this.setColor(palette[value]);
    else this[name] = Number(value);
  }
}


// electron cloud
class ElectronCloud {
  size = 0;
  shells = [null, 0, 0, 0, 0, 0, 0];

  atom;
  constructor(atom) {this.atom = atom}

  add(num = 1) {
    num = Math.min(num, 79 - this.size), this.size += num;
    while (num-- > 0) {
      if (this.shells[1] < 2) this.shells[1]++; // filling 1s
      else if (this.shells[2] < 8) this.shells[2]++; // filling 2s and 2p
      else if (this.shells[3] < 8) this.shells[3]++; // filling 3s and 3p
      else if (this.shells[4] < 2) this.shells[4]++; // filling 4s
      else if (this.shells[3] < 18) this.shells[3]++; // filling 3d
      else if (this.shells[4] < 8) this.shells[4]++; // filling 4p
      else if (this.shells[5] < 2) this.shells[5]++; // filling 5s
      else if (this.shells[4] < 18) this.shells[4]++; // filling 4d
      else if (this.shells[5] < 8) this.shells[5]++; // filling 5p
      else if (this.shells[6] < 2) this.shells[6]++; // filling 6s
      else if (this.shells[4] < 25) this.shells[4]++; // filling 4f
      else if (this.shells[5] < 18) this.shells[5]++; // filling 5d
      else if (this.shells[6] < 8) this.shells[6]++; // filling 6p
    }
  }
  remove(num = 1) {
    num = Math.max(num, 0), this.size -= num;
    while (num-- > 0) {
      if (this.shells[6] > 2) this.shells[6]--; // removing from 6p
      else if (this.shells[5] > 8) this.shells[5]--; // removing from 5d
      else if (this.shells[4] > 11) this.shells[4]--; // removing from 4f
      else if (this.shells[6]) this.shells[6]--; // removing from 6s
      else if (this.shells[5] > 2) this.shells[5]--; // removing from 5p
      else if (this.shells[4] > 8) this.shells[4]--; // removing from 4d
      else if (this.shells[5]) this.shells[5]--; // removing from 5s
      else if (this.shells[4] > 2) this.shells[4]--; // removing from 4p
      else if (this.shells[3] > 8) this.shells[3]--; // removing from 3d
      else if (this.shells[4]) this.shells[4]--; // removing from 4s
      else if (this.shells[3]) this.shells[3]--; // removing from 3s and 3p
      else if (this.shells[2]) this.shells[2]--; // removing from 2s and 2p
      else if (this.shells[1]) this.shells[1]--; // removing from 1s
    }
  }

  getNeed() {
    if (this.shells[4] == 0) {
		  let valenceNum = 0;
      if (this.shells[2] == 0) valenceNum = this.shells[1];
      else if (this.shells[3] == 0) valenceNum = this.shells[2];
      else valenceNum = this.shells[3];
		
      if (valenceNum < 4) return -valenceNum;
      else if (valenceNum == 8 || this.atom.name == Atom.symbols[1]) return 0;
      else return 8 - valenceNum;
    }
    else return 0; // todo: insert code for rows 4+
  }
}


// atoms
class Atom extends Particle {
  static symbols = ["?", "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pg", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Rf", "Db", "Sg", "Bh"];

  p; n;
  cloud = new ElectronCloud(this);
  bonds = [];
  label;

  constructor() {
    super();
    this.classList.add("atom");
  }

  connectedCallback() {
    this.label = this.appendChild(document.createElement("span"));
    this.updateSymbol();

    // setting size by period
    let size = 30;
    if (this.p > 2) size += 5;
    if (this.p > 10) size += 5;
    if (this.p > 18) size += 5;
    if (this.p > 36) size += 5;
    if (this.p > 54) size += 5;
    if (this.p > 86) size += 5;
    this.style.width = size + "px";

    // reactions
    this.addEventListener("positionchanged", this.scanForReactions);

    this.cloud.add(this.p);
  }

  updateSymbol() {this.label.textContent = Atom.symbols[this.p]}

  scanForReactions() {
    for (const atom of document.getElementsByTagName("lbau-atom")) {
      if (atom != this && !this.isBonded(atom) && (atom.x - this.x) ** 2 + (atom.y - this.y) ** 2 < 16384) {
        let need1 = this.cloud.getNeed();
        let need2 = atom.cloud.getNeed();
        // ionic
        if (need1 === -need2 && need1 != 0) this.bond(atom, need1);
      }
    }
  }
  isBonded(atom) {
    for (const bond of this.bonds) if (bond.a == atom || bond.b == atom) return true;
    return false;
  }
  bond(atom, electrons) {
    let bond = new Bond(this, atom);
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